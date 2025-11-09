import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export function useProjectMatches(projectId: number, limit: number = 20) {
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
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${getApiUrl(`api/user/project/${projectId}/matches/`)}?limit=${limit}`,
          {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch matches: ${response.statusText}`);
        }

        const result: ProjectMatchesResponse = await response.json();
        setData(result.matches || []);
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

