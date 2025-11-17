import { useEffect, useState } from "react";
import { getAllProfessorProfiles } from "../services/supabaseData";

type ProfessorJob = {
  id: number;
  user: number;
  // Canonical fields
  professor_name?: string | null;
  university?: string | null;
  description?: string | null;
  website?: string | null;
  profile_image?: string | null;
  lab_first_image?: string | null;
  lab_second_image?: string | null;
  lab_third_image?: string | null;
  position_description?: string | null;
  // Serializer alias fields for backward compatibility
};

export function useCompanyJobs() {
  const [data, setData] = useState<ProfessorJob[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      try {
        const profiles = await getAllProfessorProfiles();
        const json = profiles.map((p, index) => ({
          id: index + 1, // Temporary numeric ID for compatibility
          user: index + 1,
          professor_name: p.professor_name,
          university: p.university,
          description: p.description,
          website: p.website,
          profile_image: p.profile_image,
          lab_first_image: p.lab_first_image,
          lab_second_image: p.lab_second_image,
          lab_third_image: p.lab_third_image,
          position_description: p.position_description,
        })) as ProfessorJob[];
        if (isMounted) setData(json);
      } catch (e: any) {
        if (isMounted) {
          setError(e);
          console.error('Error fetching professor jobs:', e);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}

export type { ProfessorJob };
