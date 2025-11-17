import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProjectTitleByPid, logGeminiTestAnswer } from '../services/geminiRanking';
import { useAllProjects } from '../hooks/useAllProjects';
import { supabase } from '../utils/supabase';

type RankedPidEntry = {
  pid?: string;
  project_id?: string | number;
  id?: string | number;
  rank?: number;
  title?: string | null;
};

function parseGeminiPidOutput(raw: string): RankedPidEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.data)) return parsed.data;
    if (Array.isArray(parsed?.rankings)) return parsed.rankings;
  } catch {
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore
      }
    }
  }
  return [];
}

export default function GeminiTestPage() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [parsedEntries, setParsedEntries] = useState<RankedPidEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { data: projects, loading: projectsLoading } = useAllProjects();
  const [studentProfile, setStudentProfile] = useState<any>(null);

  // Fetch student profile on mount
  React.useEffect(() => {
    async function fetchStudentProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Not authenticated. Please log in.');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          setError(`Failed to fetch student profile: ${profileError.message}`);
          return;
        }

        setStudentProfile(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch student profile');
      }
    }

    fetchStudentProfile();
  }, []);

  const handleTest = async () => {
    if (!studentProfile) {
      setError('Student profile not loaded');
      return;
    }

    if (!projects || projects.length === 0) {
      setError('No projects available');
      return;
    }

    setLoading(true);
    setError(null);
    setOutput('');
    setParsedEntries([]);

    try {
      const answer = await logGeminiTestAnswer(studentProfile, projects);
      setOutput(answer);

      const parsed = parseGeminiPidOutput(answer);
      const enriched = parsed.map((entry, index) => {
        const identifier =
          entry.pid ??
          entry.project_id ??
          entry.id ??
          (entry as any)?.projectId ??
          (entry as any)?.projectID ??
          `p${index + 1}`;

        return {
          ...entry,
          title: getProjectTitleByPid(projects, identifier),
        };
      });
      setParsedEntries(enriched);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Gemini test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Gemini Test Page</Text>
        
        <View style={styles.info}>
          <Text>Student Profile: {studentProfile ? 'Loaded' : 'Not loaded'}</Text>
          <Text>Projects: {projects?.length || 0}</Text>
        </View>

        <Button
          title={loading ? 'Testing...' : 'Test Gemini API'}
          onPress={handleTest}
          disabled={loading || !studentProfile || !projects || projects.length === 0}
        />

        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
            <Text>Calling gemini-test...</Text>
          </View>
        )}

        {error && (
          <View style={styles.error}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {parsedEntries.length > 0 && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Ranked Project Titles</Text>
            {parsedEntries.map((entry, index) => (
              <Text key={`${entry.pid || entry.project_id || index}`} style={styles.resultRow}>
                {entry.rank ?? index + 1}. {entry.title || 'Unknown title'}{' '}
                <Text style={styles.resultPid}>
                  ({entry.pid || entry.project_id || entry.id || `p${index + 1}`})
                </Text>
              </Text>
            ))}
          </View>
        )}

        {output && (
          <ScrollView style={styles.output}>
            <Text style={styles.outputTitle}>Gemini Output:</Text>
            <Text style={styles.outputText}>{output}</Text>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    marginBottom: 20,
  },
  loading: {
    marginTop: 20,
    alignItems: 'center',
  },
  error: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 4,
  },
  errorText: {
    color: '#c62828',
  },
  results: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    backgroundColor: '#fafafa',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultRow: {
    fontSize: 14,
    marginBottom: 4,
  },
  resultPid: {
    fontSize: 12,
    color: '#666',
  },
  output: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    maxHeight: 400,
  },
  outputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  outputText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

