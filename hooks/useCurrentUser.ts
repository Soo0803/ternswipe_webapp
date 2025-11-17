import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser as getSupabaseUser } from '../services/supabaseAuth';
import { storage } from '../utils/storage';

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN' | string;
};

export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get from Supabase first
      try {
        const supabaseUser = await getSupabaseUser();
        if (supabaseUser) {
          const authUser: AuthUser = {
            id: parseInt(supabaseUser.id) || 0,
            username: supabaseUser.username,
            email: supabaseUser.email,
            role: supabaseUser.role as any,
          };
          setUser(authUser);
          // Also store in storage for compatibility
          await storage.setItem('auth_user', JSON.stringify(authUser));
          return;
        }
      } catch (supabaseError) {
        console.log('Supabase user not available, trying AsyncStorage');
      }

      // Fallback to storage
      const stored = await storage.getItem('auth_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load current user', err);
      setUser(null);
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const setCurrentUser = useCallback(async (value: AuthUser | null) => {
    try {
      if (value) {
        await storage.setItem('auth_user', JSON.stringify(value));
      } else {
        await storage.removeItem('auth_user');
      }
      setUser(value);
    } catch (err) {
      console.error('Failed to persist current user', err);
    }
  }, []);

  return {
    user,
    loading,
    error,
    refresh: loadUser,
    setCurrentUser,
  };
}

