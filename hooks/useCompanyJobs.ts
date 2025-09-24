import { useEffect, useState } from "react";
import Constants from "expo-constants";

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

function getApiBaseUrl(): string {
  const fromConstants = (Constants?.expoConfig as any)?.extra?.apiUrl as
    | string
    | undefined;
  return (
    fromConstants || process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000"
  );
}

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
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/user/professor/jobs/`);
        if (!res.ok) {
          throw new Error(`Failed to load: ${res.status}`);
        }
        const json = (await res.json()) as ProfessorJob[];
        if (isMounted) setData(json);
      } catch (e: any) {
        if (isMounted) setError(e);
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
