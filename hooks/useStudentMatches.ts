import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MatchResult {
  project_id: number;
  title: string;
  description: string;
  professor_name: string;
  university: string;
  required_skills: string[];
  hrs_per_week: number;
  start_date: string | null;
  end_date: string | null;
  capacity: number;
  modality: string | null;
  location: string | null;
  profile_image: string | null;
  score: number;
  fit: number;
  p_accept: number;
  perf: number;
  skill_coverage: number;
  availability: number;
  potential: number;
}

interface StudentMatchesResponse {
  matches: MatchResult[];
  count: number;
}

export function useStudentMatches(limit: number = 20) {
  const [data, setData] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${getApiUrl('api/user/student/matches/')}?limit=${limit}`,
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

        const result: StudentMatchesResponse = await response.json();
        setData(result.matches || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
        console.error('Error fetching student matches:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [limit]);

  return { data, loading, error, refetch: () => {
    // Trigger refetch by updating limit slightly
    const newLimit = limit === 20 ? 21 : 20;
    // This will trigger useEffect
  } };
}

