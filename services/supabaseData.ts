import { supabase } from '../utils/supabase';

/**
 * Get all open projects for browsing
 */
export async function getAllProjects() {
  const { data, error } = await supabase
    .from('professor_projects')
    .select(`
      *,
      professor_profiles (
        id,
        professor_name,
        university,
        profile_image_url
      )
    `)
    .eq('is_open', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((project: any) => {
    // Ensure required_skills is always an array
    let requiredSkills: string[] = [];
    if (Array.isArray(project.required_skills)) {
      requiredSkills = project.required_skills;
    } else if (typeof project.required_skills === 'string') {
      try {
        // Try to parse if it's a JSON string
        const parsed = JSON.parse(project.required_skills);
        requiredSkills = Array.isArray(parsed) ? parsed : [];
      } catch {
        // If not JSON, treat as comma-separated string
        requiredSkills = project.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      modality: project.modality,
      location: project.location,
      required_skills: requiredSkills,
      hrs_per_week: project.hrs_per_week,
      start_date: project.start_date,
      end_date: project.end_date,
      capacity: project.capacity,
      is_open: project.is_open,
      created_at: project.created_at,
      professor_name: project.professor_profiles?.professor_name,
      university: project.professor_profiles?.university,
      profile_image: project.professor_profiles?.profile_image_url,
    };
  });
}

/**
 * Get a single project by ID
 */
export async function getProjectById(projectId: string) {
  const { data, error } = await supabase
    .from('professor_projects')
    .select(`
      *,
      professor_profiles (
        id,
        professor_name,
        university,
        description,
        website,
        profile_image_url,
        lab_first_image_url,
        lab_second_image_url,
        lab_third_image_url,
        position_description
      )
    `)
    .eq('id', projectId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    modality: data.modality,
    location: data.location,
    required_skills: data.required_skills || [],
    hrs_per_week: data.hrs_per_week,
    start_date: data.start_date,
    end_date: data.end_date,
    capacity: data.capacity,
    is_open: data.is_open,
    created_at: data.created_at,
    professor_name: data.professor_profiles?.professor_name,
    university: data.professor_profiles?.university,
    description_full: data.professor_profiles?.description,
    website: data.professor_profiles?.website,
    profile_image: data.professor_profiles?.profile_image_url,
    lab_first_image: data.professor_profiles?.lab_first_image_url,
    lab_second_image: data.professor_profiles?.lab_second_image_url,
    lab_third_image: data.professor_profiles?.lab_third_image_url,
    position_description: data.professor_profiles?.position_description,
  };
}

/**
 * Get all professor profiles (for browsing)
 */
export async function getAllProfessorProfiles() {
  const { data, error } = await supabase
    .from('professor_profiles')
    .select(`
      *,
      professor_projects (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((profile: any) => ({
    id: profile.id,
    professor_name: profile.professor_name,
    university: profile.university,
    description: profile.description,
    website: profile.website,
    profile_image: profile.profile_image_url,
    lab_first_image: profile.lab_first_image_url,
    lab_second_image: profile.lab_second_image_url,
    lab_third_image: profile.lab_third_image_url,
    position_description: profile.position_description,
    projects: profile.professor_projects || [],
  }));
}

/**
 * Get student matches (simplified - in production, use Edge Function for matching algorithm)
 */
export async function getStudentMatches(limit: number = 20) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get student profile
  const { data: studentProfile, error: studentError } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (studentError || !studentProfile) {
    throw new Error('Student profile not found');
  }

  // Get all open projects
  const { data: projects, error: projectsError } = await supabase
    .from('professor_projects')
    .select(`
      *,
      professor_profiles (
        professor_name,
        university,
        profile_image_url
      )
    `)
    .eq('is_open', true);

  if (projectsError) throw projectsError;

  // Simple matching algorithm (simplified version)
  const matches = projects.map((project: any) => {
    const studentSkills = Array.isArray(studentProfile.skills) ? studentProfile.skills : [];
    
    // Ensure required_skills is always an array
    let requiredSkills: string[] = [];
    if (Array.isArray(project.required_skills)) {
      requiredSkills = project.required_skills;
    } else if (typeof project.required_skills === 'string') {
      try {
        // Try to parse if it's a JSON string
        const parsed = JSON.parse(project.required_skills);
        requiredSkills = Array.isArray(parsed) ? parsed : [];
      } catch {
        // If not JSON, treat as comma-separated string
        requiredSkills = project.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }
    
    // Calculate skill coverage
    const skillCoverage = requiredSkills.length > 0
      ? studentSkills.filter((s: string) =>
          requiredSkills.some((r: string) =>
            s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase())
          )
        ).length / requiredSkills.length
      : 1.0;

    // Simple score calculation
    const score = skillCoverage * 0.7 + 0.3; // Base score with skill coverage

    return {
      project_id: project.id,
      title: project.title,
      description: project.description,
      professor_name: project.professor_profiles?.professor_name,
      university: project.professor_profiles?.university,
      required_skills: requiredSkills,
      hrs_per_week: project.hrs_per_week,
      start_date: project.start_date,
      end_date: project.end_date,
      capacity: project.capacity,
      modality: project.modality,
      location: project.location,
      profile_image: project.professor_profiles?.profile_image_url,
      score: Math.round(score * 100) / 100,
      fit: Math.round(score * 100) / 100,
      p_accept: Math.round(score * 0.8 * 100) / 100,
      perf: Math.round(score * 0.9 * 100) / 100,
      skill_coverage: Math.round(skillCoverage * 100) / 100,
      availability: 0.8,
      potential: 0.7,
    };
  });

  // Sort by score and limit
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, limit);
}

/**
 * Get project matches (students interested in a project)
 */
export async function getProjectMatches(projectId: string, limit: number = 20) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get project
  const { data: project, error: projectError } = await supabase
    .from('professor_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError || !project) {
    throw new Error('Project not found');
  }

  // Get all student profiles
  const { data: students, error: studentsError } = await supabase
    .from('student_profiles')
    .select(`
      *,
      user_profiles (
        username,
        email
      )
    `);

  if (studentsError) throw studentsError;

  const requiredSkills = project.required_skills || [];

  // Simple matching algorithm
  const matches = students.map((student: any) => {
    const studentSkills = student.skills || [];
    
    // Calculate skill coverage
    const skillCoverage = requiredSkills.length > 0
      ? studentSkills.filter((s: string) =>
          requiredSkills.some((r: string) =>
            s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase())
          )
        ).length / requiredSkills.length
      : 1.0;

    // Simple score calculation
    const score = skillCoverage * 0.7 + 0.3;

    return {
      student_id: student.id,
      username: student.user_profiles?.username,
      email: student.user_profiles?.email,
      given_name: student.given_name,
      last_name: student.last_name,
      headline: student.headline,
      summary: student.summary,
      skills: studentSkills,
      courses: student.courses || [],
      gpa: student.gpa,
      hrs_per_week: student.hrs_per_week,
      major_chosen: student.major_chosen,
      graduation_year: student.graduation_year,
      score: Math.round(score * 100) / 100,
      fit: Math.round(score * 100) / 100,
      p_accept: Math.round(score * 0.8 * 100) / 100,
      perf: Math.round(score * 0.9 * 100) / 100,
      skill_coverage: Math.round(skillCoverage * 100) / 100,
      availability: 0.8,
      potential: 0.7,
    };
  });

  // Sort by score and limit
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, limit);
}

/**
 * Get professor's projects
 */
export async function getProfessorProjects() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('professor_projects')
    .select(`
      *,
      professor_profiles (
        professor_name,
        university,
        profile_image_url
      )
    `)
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map((project: any) => ({
    ...project,
    professor_name: project.professor_profiles?.professor_name,
    university: project.professor_profiles?.university,
    profile_image: project.professor_profiles?.profile_image_url,
  }));
}

/**
 * Get professor profile by user ID
 */
export async function getProfessorProfile(userId: string) {
  const { data, error } = await supabase
    .from('professor_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

