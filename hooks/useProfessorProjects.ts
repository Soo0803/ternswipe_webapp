import { useEffect, useState } from 'react';
import { getProfessorProjects, getProfessorProfile } from '../services/supabaseData';
import { getProjectMatches } from '../services/supabaseData';

export interface ProfessorProfile {
  id: number;
  user: number;
  professor_name?: string | null;
  university?: string | null;
  description?: string | null;
  website?: string | null;
  position_description?: string | null;
  projects?: number[];
}

export interface ProfessorProject {
  id: number;
  profile: number;
  title: string;
  description: string;
  modality: string | null;
  location: string | null;
  required_skills: string[];
  hrs_per_week: number | null;
  start_date: string | null;
  end_date: string | null;
  capacity: number;
  is_open: boolean;
  created_at: string;
  professor_name?: string | null;
  university?: string | null;
  profile_image?: string | null;
}

export interface StudentPreview {
  student_id: number;
  username: string;
  given_name: string | null;
  last_name: string | null;
  email: string;
  headline: string | null;
  skills: string[];
  score: number;
  skill_coverage: number;
  availability: number;
}

export interface ProfessorProjectSummary extends ProfessorProject {
  matches: StudentPreview[];
  matchCount: number;
}

interface UseProfessorProjectsResult {
  profile: ProfessorProfile | null;
  projects: ProfessorProjectSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProfessorProjects(userId?: number | string): UseProfessorProjectsResult {
  const [profile, setProfile] = useState<ProfessorProfile | null>(null);
  const [projects, setProjects] = useState<ProfessorProjectSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchProfessorProjects() {
    if (!userId) {
      setProfile(null);
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get current user from Supabase
      const { getCurrentUser } = await import('../services/supabaseAuth');
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error('Authentication required');
      }

      // Get professor profile
      const professorProfile = await getProfessorProfile(currentUser.id);
      if (!professorProfile) {
        setProjects([]);
        throw new Error('Professor profile not found. Please complete registration.');
      }

      // Convert to expected format
      const profileData: ProfessorProfile = {
        id: parseInt(professorProfile.id) || 0,
        user: parseInt(professorProfile.id) || 0,
        professor_name: professorProfile.professor_name,
        university: professorProfile.university,
        description: professorProfile.description,
        website: professorProfile.website,
        position_description: professorProfile.position_description,
        projects: [],
      };
      setProfile(profileData);

      // Get projects
      const projectList = await getProfessorProjects();

      // Get matches for each project
      const projectsWithMatches: ProfessorProjectSummary[] = [];

      for (const project of projectList) {
        try {
          const matches = await getProjectMatches(String(project.id), 3);
          const studentPreviews: StudentPreview[] = matches.map((m: any) => ({
            student_id: parseInt(m.student_id) || 0,
            username: m.username || '',
            given_name: m.given_name,
            last_name: m.last_name,
            email: m.email || '',
            headline: m.headline,
            skills: m.skills || [],
            score: m.score || 0,
            skill_coverage: m.skill_coverage || 0,
            availability: m.availability || 0,
          }));

          projectsWithMatches.push({
            id: parseInt(project.id) || 0,
            profile: parseInt(professorProfile.id) || 0,
            title: project.title,
            description: project.description || '',
            modality: project.modality,
            location: project.location,
            required_skills: project.required_skills || [],
            hrs_per_week: project.hrs_per_week,
            start_date: project.start_date,
            end_date: project.end_date,
            capacity: project.capacity || 1,
            is_open: project.is_open !== false,
            created_at: project.created_at || new Date().toISOString(),
            professor_name: project.professor_name,
            university: project.university,
            profile_image: project.profile_image,
            matches: studentPreviews,
            matchCount: studentPreviews.length,
          });
        } catch (matchError) {
          console.warn('Failed to load matches for project', project.id, matchError);
          projectsWithMatches.push({
            id: parseInt(project.id) || 0,
            profile: parseInt(professorProfile.id) || 0,
            title: project.title,
            description: project.description || '',
            modality: project.modality,
            location: project.location,
            required_skills: project.required_skills || [],
            hrs_per_week: project.hrs_per_week,
            start_date: project.start_date,
            end_date: project.end_date,
            capacity: project.capacity || 1,
            is_open: project.is_open !== false,
            created_at: project.created_at || new Date().toISOString(),
            professor_name: project.professor_name,
            university: project.university,
            profile_image: project.profile_image,
            matches: [],
            matchCount: 0,
          });
        }
      }

      setProjects(projectsWithMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load professor data');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfessorProjects();
  }, [userId]);

  return {
    profile,
    projects,
    loading,
    error,
    refetch: fetchProfessorProjects,
  };
}

