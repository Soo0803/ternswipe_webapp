import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { getAllProjects } from '../services/supabaseData';
import { getProjectRanking, parseRankingResponse } from '../services/geminiRanking';

export type RankedProject = {
  project: any;
  rank: number;
  score?: number;
  reasoning?: string;
};

export function useRankedProjects() {
  const [rankedProjects, setRankedProjects] = useState<RankedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRankedProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Get student profile
      const { data: profile, error: profileError } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(`Failed to load profile: ${profileError.message}`);
      }

      if (!profile) {
        throw new Error('Student profile not found. Please complete your profile first.');
      }

      // Get all open projects
      const projects = await getAllProjects();

      if (projects.length === 0) {
        setRankedProjects([]);
        return;
      }

      // IMPORTANT: Store the projects array order to ensure consistency
      // The projects array order must match exactly when sending to Gemini and when parsing
      console.log(`📦 Loaded ${projects.length} projects. Order:`, projects.map((p, i) => `[${i}] ${p.title}`).join(", "));

      // Get student name for personalized ranking
      const studentName = `${profile.given_name || ''} ${profile.last_name || ''}`.trim() || undefined;
      
      // Get ranking from Gemini API
      // Pass the SAME projects array reference to ensure order consistency
      console.log(`🚀 Requesting ranking for ${projects.length} projects`);
      const rankingResponse = await getProjectRanking(profile, projects, studentName);

      // Parse and match rankings with projects
      // Use the SAME projects array to ensure pids map correctly
      console.log(`🔧 Parsing response with same projects array (${projects.length} projects)`);
      const ranked = parseRankingResponse(rankingResponse, projects);
      
      if (ranked.length === 0) {
        console.warn('No ranked projects returned, using fallback');
        // Fallback to original project order
        setRankedProjects(
          projects.map((project, index) => ({
            project,
            rank: index + 1,
          }))
        );
      } else {
        console.log(`✅ Successfully ranked ${ranked.length} projects`);
        console.log(`📊 Final order:`, ranked.map((r, i) => `${i + 1}. Rank #${r.rank}: "${r.project?.title}"`).join("\n"));
        // Set the ranked projects in the EXACT order returned by parseRankingResponse
        // (which preserves Gemini's order)
        setRankedProjects(ranked);
      }
    } catch (err: any) {
      console.error('Error loading ranked projects:', err);
      setError(err.message || 'Failed to load ranked projects');
      
      // Fallback: show projects without ranking
      try {
        const projects = await getAllProjects();
        setRankedProjects(
          projects.map((project, index) => ({
            project,
            rank: index + 1,
          }))
        );
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setRankedProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRankedProjects();
  }, []);

  return {
    rankedProjects,
    loading,
    error,
    refetch: loadRankedProjects,
  };
}

