import { supabase } from '../utils/supabase';
import { uploadFile } from '../utils/supabaseStorage';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'STUDENT' | 'PROFESSOR';
}

export interface LoginResponse {
  user: User;
  session: any;
}

/**
 * Sign up a new user (shared - creates auth user and user_profile only)
 * This is the first step - user selects role and provides basic credentials
 */
export async function signUpUser(data: {
  username: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'PROFESSOR';
}): Promise<LoginResponse> {
  try {
    console.log('Starting sign up for:', data.email, 'Role:', data.role);
    
    // Check if username or email already exists before signup
    // Note: This check might not catch all cases due to RLS, but it helps
    try {
      const { data: existingUsers, error: checkError } = await supabase
        .from('user_profiles')
        .select('username, email')
        .or(`username.eq.${data.username},email.eq.${data.email}`)
        .limit(1);
      
      if (!checkError && existingUsers && existingUsers.length > 0) {
        const existing = existingUsers[0];
        if (existing.username === data.username) {
          throw new Error('Username already exists. Please choose a different username.');
        }
        if (existing.email === data.email) {
          throw new Error('Email already exists. Please use a different email or sign in.');
        }
      }
    } catch (checkErr: any) {
      // If it's our custom error, throw it
      if (checkErr.message.includes('already exists')) {
        throw checkErr;
      }
      // Otherwise, continue (RLS might prevent the check, which is okay)
      console.log('Could not check existing users (might be due to RLS):', checkErr.message);
    }
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          role: data.role,
        },
        emailRedirectTo: undefined, // Don't require email confirmation for now
      },
    });

    console.log('Supabase signUp response:', { authData, authError });

    if (authError) {
      console.error('Auth error details:', authError);
      throw new Error(`Failed to create account: ${authError.message}`);
    }
    if (!authData.user) {
      console.error('No user returned from signUp');
      throw new Error('Failed to create user account - no user returned');
    }

    console.log('Auth user created:', authData.user.id);

    // IMPORTANT: Set the session in the Supabase client so authenticated requests work
    if (authData.session) {
      console.log('Setting session in Supabase client...');
      const { error: setSessionError } = await supabase.auth.setSession(authData.session);
      if (setSessionError) {
        console.error('Error setting session:', setSessionError);
        // Continue anyway, but log the error
      } else {
        console.log('Session set successfully');
      }
    } else {
      console.warn('No session returned from signUp - trying to get session...');
      // Try to get session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (session && !sessionError) {
        console.log('Got session from getSession()');
        const { error: setSessionError } = await supabase.auth.setSession(session);
        if (setSessionError) {
          console.error('Error setting session:', setSessionError);
        }
      } else {
        console.error('Could not get session:', sessionError);
      }
    }

    // Wait for trigger to create user_profile (with retry logic)
    let userProfile = null;
    let retries = 0;
    const maxRetries = 15; // Increased retries
    
    console.log('Waiting for user_profile to be created...');
    while (!userProfile && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 400)); // Slightly longer wait
      // Use maybeSingle() instead of single() to avoid PGRST116 error when profile doesn't exist yet
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();
      
      if (profile && !profileError) {
        console.log('User profile found:', profile);
        userProfile = profile;
        break;
      }
      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 is "not found" - that's expected, keep retrying
        console.log('Profile check error (retrying):', profileError.message, profileError.code);
      }
      retries++;
      console.log(`Retry ${retries}/${maxRetries}...`);
    }

    // If user_profile still doesn't exist, create it manually
    if (!userProfile) {
      console.log('Trigger did not create profile, creating manually...');
      
      // Ensure we have a session before making authenticated request
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        console.error('No session available for authenticated request');
        throw new Error('No session available. Please try signing up again.');
      }
      
      // Check if username or email already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`username.eq.${data.username},email.eq.${data.email}`)
        .maybeSingle();
      
      if (existingProfile) {
        console.log('Profile already exists (possibly from trigger):', existingProfile);
        if (existingProfile.id === authData.user.id) {
          userProfile = existingProfile;
        } else {
          throw new Error('Username or email already exists. Please use different credentials.');
        }
      } else {
        // Try to insert with conflict handling
        const { data: insertedProfile, error: createProfileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            username: data.username,
            email: data.email,
            role: data.role,
          })
          .select()
          .single();

        if (createProfileError) {
          console.error('Error creating user_profile:', createProfileError);
          console.error('Error code:', createProfileError.code);
          console.error('Error details:', JSON.stringify(createProfileError, null, 2));
          
          // If it's a unique constraint violation, check if profile exists now
          if (createProfileError.code === '23505') {
            console.log('Unique constraint violation - checking if profile exists...');
            // Use maybeSingle() to avoid PGRST116 error
            const { data: checkProfile, error: checkError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', authData.user.id)
              .maybeSingle();
            
            if (checkProfile && !checkError) {
              console.log('Profile exists after all:', checkProfile);
              userProfile = checkProfile;
            } else {
              throw new Error(`Username or email already exists. Please use different credentials.`);
            }
          } else {
            throw new Error(`Failed to create user profile: ${createProfileError.message}`);
          }
        } else {
          userProfile = insertedProfile;
          console.log('User profile created manually:', userProfile);
        }
      }
    }

    // Get the final session (should be set now)
    const { data: { session: finalSession }, error: finalSessionError } = await supabase.auth.getSession();
    
    if (finalSessionError) {
      console.error('Error getting final session:', finalSessionError);
    }

    const sessionToReturn = finalSession || authData.session;

    if (!sessionToReturn) {
      console.warn('No session available - user may need to confirm email');
      // Still return user info, but warn about session
      return {
        user: {
          id: authData.user.id,
          username: userProfile?.username || data.username,
          email: authData.user.email || '',
          role: data.role,
        },
        session: null as any, // Return null session, but user can still proceed
      };
    }

    console.log('Sign up successful, returning user and session');
    return {
      user: {
        id: authData.user.id,
        username: userProfile?.username || data.username,
        email: authData.user.email || '',
        role: data.role,
      },
      session: sessionToReturn,
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw error;
  }
}

/**
 * Complete student onboarding (creates student_profile with all details)
 */
export async function completeStudentOnboarding(
  userId: string,
  profileData: any
): Promise<void> {
  try {
    // Upload files if provided
    let transcriptUrl: string | null = null;
    let resumeUrl: string | null = null;
    let profileImageUrl: string | null = null;

    try {
      if (profileData.transcript) {
        transcriptUrl = await uploadFile(
          'documents',
          `transcripts/${userId}/${Date.now()}_transcript.pdf`,
          profileData.transcript
        );
      }

      if (profileData.resume) {
        resumeUrl = await uploadFile(
          'documents',
          `resumes/${userId}/${Date.now()}_resume.pdf`,
          profileData.resume
        );
      }

      if (profileData.profile_image) {
        profileImageUrl = await uploadFile(
          'images',
          `students/${userId}/profile_${Date.now()}.jpg`,
          profileData.profile_image
        );
      }
    } catch (uploadError: any) {
      console.error('File upload error:', uploadError);
      // Continue even if file upload fails
    }

    // Create student profile
    const { error: profileError } = await supabase
      .from('student_profiles')
      .insert({
        id: userId,
        given_name: profileData.given_name || null,
        middle_name: profileData.middle_name || null,
        last_name: profileData.last_name || null,
        nationality: profileData.nationality || null,
        age: profileData.age ? parseInt(String(profileData.age)) : null,
        language: profileData.language || null,
        graduation_year: profileData.graduation_year ? parseInt(String(profileData.graduation_year)) : null,
        major_chosen: profileData.major_chosen || null,
        location: profileData.location || null,
        phone_number: profileData.phone_number || null,
        transcript_url: transcriptUrl,
        resume_url: resumeUrl,
        profile_image_url: profileImageUrl,
        headline: profileData.headline || null,
        summary: profileData.summary || null,
        courses: Array.isArray(profileData.courses) ? profileData.courses : [],
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        skills_text: profileData.skills_text || null,
        gpa: profileData.gpa ? parseFloat(String(profileData.gpa)) : null,
        hrs_per_week: profileData.hrs_per_week ? parseInt(String(profileData.hrs_per_week)) : null,
        avail_start: profileData.avail_start || null,
        avail_end: profileData.avail_end || null,
        reliability: profileData.reliability ? parseFloat(String(profileData.reliability)) : null,
      });

    if (profileError) {
      console.error('Student profile error:', profileError);
      throw new Error(`Failed to create student profile: ${profileError.message}`);
    }
  } catch (error: any) {
    console.error('Complete student onboarding error:', error);
    throw error;
  }
}

/**
 * Complete professor onboarding (creates professor_profile and projects)
 */
export async function completeProfessorOnboarding(
  userId: string,
  profileData: any,
  projects: any[]
): Promise<void> {
  try {
    // Upload files if provided
    let profileImageUrl: string | null = null;
    let labFirstImageUrl: string | null = null;
    let labSecondImageUrl: string | null = null;
    let labThirdImageUrl: string | null = null;

    try {
      if (profileData.team_image) {
        profileImageUrl = await uploadFile(
          'images',
          `professors/${userId}/profile_${Date.now()}.jpg`,
          profileData.team_image
        );
      }

      if (profileData.lab_first_image) {
        labFirstImageUrl = await uploadFile(
          'images',
          `professors/${userId}/lab1_${Date.now()}.jpg`,
          profileData.lab_first_image
        );
      }

      if (profileData.lab_second_image) {
        labSecondImageUrl = await uploadFile(
          'images',
          `professors/${userId}/lab2_${Date.now()}.jpg`,
          profileData.lab_second_image
        );
      }

      if (profileData.lab_third_image) {
        labThirdImageUrl = await uploadFile(
          'images',
          `professors/${userId}/lab3_${Date.now()}.jpg`,
          profileData.lab_third_image
        );
      }
    } catch (uploadError: any) {
      console.error('File upload error:', uploadError);
      // Continue even if file upload fails
    }

    // Create professor profile
    const { data: professorProfile, error: profileError } = await supabase
      .from('professor_profiles')
      .insert({
        id: userId,
        professor_name: profileData.professor_name || null,
        university: profileData.university || null,
        description: profileData.description || null,
        website: profileData.website || null,
        profile_image_url: profileImageUrl,
        lab_first_image_url: labFirstImageUrl,
        lab_second_image_url: labSecondImageUrl,
        lab_third_image_url: labThirdImageUrl,
        position_description: profileData.position_description || null,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Professor profile error:', profileError);
      throw new Error(`Failed to create professor profile: ${profileError.message}`);
    }

    // Create projects
    if (projects && projects.length > 0) {
      const projectsToInsert = projects.map(project => ({
        profile_id: userId,
        title: project.title || '',
        description: project.description || null,
        modality: project.modality || null,
        location: project.location || null,
        required_skills: Array.isArray(project.required_skills) ? project.required_skills : [],
        hrs_per_week: project.hrs_per_week ? parseInt(String(project.hrs_per_week)) : null,
        start_date: project.start_date || null,
        end_date: project.end_date || null,
        capacity: project.capacity ? parseInt(String(project.capacity)) : 1,
        is_open: true,
      }));

      const { error: projectsError } = await supabase
        .from('professor_projects')
        .insert(projectsToInsert);

      if (projectsError) {
        console.error('Projects error:', projectsError);
        throw new Error(`Failed to create projects: ${projectsError.message}`);
      }
    }
  } catch (error: any) {
    console.error('Complete professor onboarding error:', error);
    throw error;
  }
}

/**
 * Sign in with email/username and password
 */
export async function signIn(emailOrUsername: string, password: string): Promise<LoginResponse> {
  // First, try to get the email from username if needed
  let email = emailOrUsername;
  
  // If it doesn't look like an email, try to find the user by username
  if (!emailOrUsername.includes('@')) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('username', emailOrUsername)
      .maybeSingle();
    
    if (profile) {
      email = profile.email;
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Get user profile
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();

  return {
    user: {
      id: data.user.id,
      username: userProfile?.username || data.user.email,
      email: data.user.email || '',
      role: userProfile?.role || 'STUDENT',
    },
    session: data.session,
  };
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: user.id,
    username: profile.username,
    email: user.email || '',
    role: profile.role,
  };
}
