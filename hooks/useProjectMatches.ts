import { useState, useEffect } from 'react';
import { getProjectMatches } from '../services/supabaseData';

interface StudentMatch {
  student_id: number;
  username: string;
  email: string;
  given_name: string | null;
  last_name: string | null;
  headline: string | null;
  summary: string | null;
  skills: string[];
  courses: string[];
  gpa: number | null;
  hrs_per_week: number | null;
  major_chosen: string | null;
  graduation_year: number | null;
  score: number;
  fit: number;
  p_accept: number;
  perf: number;
  skill_coverage: number;
  availability: number;
  potential: number;
}

interface ProjectMatchesResponse {
  matches: StudentMatch[];
  count: number;
}

export function useProjectMatches(projectId: string | number, limit: number = 20) {
  const [data, setData] = useState<StudentMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const matches = await getProjectMatches(String(projectId), limit);
        setData(matches as StudentMatch[]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
        console.error('Error fetching project matches:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [projectId, limit]);

  return { data, loading, error };
}

