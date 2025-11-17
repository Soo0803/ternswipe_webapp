import { useState, useEffect } from 'react';
import { getAllProjects } from '../services/supabaseData';

interface Project {
  id: number;
  title: string;
  description: string;
  profile: number;
  required_skills: string[];
  hrs_per_week: number | null;
  start_date: string | null;
  end_date: string | null;
  capacity: number;
  modality: string | null;
  location: string | null;
  is_open: boolean;
  created_at: string;
}

export function useAllProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const result = await getAllProjects();
        setData(result as Project[]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { data, loading, error };
}

