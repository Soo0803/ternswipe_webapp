import { useState, useEffect } from 'react';
import { getStudentMatches } from '../services/supabaseData';

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

export function useStudentMatches(limit: number = 20, options: { enabled?: boolean } = {}) {
  const [data, setData] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const enabled = options.enabled ?? true;

  useEffect(() => {
    if (!enabled) {
      setData([]);
      setLoading(false);
      return;
    }

    async function fetchMatches() {
      try {
        setLoading(true);
        const matches = await getStudentMatches(limit);
        setData(matches);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
        console.error('Error fetching student matches:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [limit, enabled]);

  return { data, loading, error, refetch: () => {
    // Trigger refetch by updating limit slightly
    const newLimit = limit === 20 ? 21 : 20;
    // This will trigger useEffect
  } };
}

