import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { Button } from '../../components/Button';
import { isWeb } from '../../utils/platform';
import { getFontSize, getPadding } from '../../utils/responsive';
import { useStudentMatches } from '../../hooks/useStudentMatches';
import { useAllProjects } from '../../hooks/useAllProjects';
import { useRankedProjects } from '../../hooks/useRankedProjects';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { getCurrentUser as getSupabaseUser } from '../../services/supabaseAuth';
import { palette, radii, shadows } from '../../constants/theme';

type StudentCard = ReturnType<typeof useStudentMatches>['data'][number];

export default function StudentDashboard() {
  const router = useRouter();
  const { user, loading: userLoading, setCurrentUser } = useCurrentUser();
  const {
    data: studentMatches,
    loading: studentMatchesLoading,
    error: studentMatchesError,
  } = useStudentMatches(6);
  const {
    data: openProjects,
    loading: projectsLoading,
  } = useAllProjects();
  const {
    rankedProjects,
    loading: rankedLoading,
    error: rankedError,
  } = useRankedProjects();

  useEffect(() => {
    // Sync with Supabase user
    async function syncUser() {
      try {
        const supabaseUser = await getSupabaseUser();
        if (supabaseUser) {
          setCurrentUser({
            id: parseInt(supabaseUser.id) || 0,
            username: supabaseUser.username,
            email: supabaseUser.email,
            role: supabaseUser.role as any,
          });
        }
      } catch (error) {
        console.error('Failed to sync user:', error);
      }
    }
    if (!user) {
      syncUser();
    }
  }, []);

  if (userLoading) {
    return (
      <LoadingState message="Preparing your dashboard..." />
    );
  }

  if (!user || user.role !== 'STUDENT') {
    return (
      <EmptyState
        title="Access Denied"
        description="This dashboard is for students only."
        actionLabel="Go to sign in"
        onAction={() => router.replace('/(auth)/login')}
      />
    );
  }

  return (
    <StudentDashboardContent
      router={router}
      user={user}
      matches={studentMatches}
      matchesLoading={studentMatchesLoading}
      matchesError={studentMatchesError}
      projects={openProjects}
      projectsLoading={projectsLoading}
      rankedProjects={rankedProjects}
      rankedLoading={rankedLoading}
      rankedError={rankedError}
    />
  );
}

type StudentDashboardContentProps = {
  router: ReturnType<typeof useRouter>;
  user: { username: string | null | undefined };
  matches: StudentCard[];
  matchesLoading: boolean;
  matchesError: string | null;
  projects: ReturnType<typeof useAllProjects>['data'];
  projectsLoading: boolean;
  rankedProjects: ReturnType<typeof useRankedProjects>['rankedProjects'];
  rankedLoading: boolean;
  rankedError: string | null;
};

function StudentDashboardContent({
  router,
  user,
  matches,
  matchesLoading,
  matchesError,
  projects,
  projectsLoading,
  rankedProjects,
  rankedLoading,
  rankedError,
}: StudentDashboardContentProps) {
  const content = (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back, {user.username || 'Student'}!</Text>
          <Text style={styles.subtitle}>Here are your personalized project matches</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/gemini-test')}
          style={styles.testButton}
        >
          <Ionicons name="flask-outline" size={16} color={palette.textMuted} />
          <Text style={styles.testButtonText}>Test Gemini API</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI-Ranked Projects</Text>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/ranked-projects')}>
            <Text style={styles.seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {rankedLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.loadingText}>Ranking projects with AI...</Text>
          </View>
        ) : rankedError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{rankedError}</Text>
            <Text style={styles.errorSubtext}>Showing all projects instead</Text>
          </View>
        ) : rankedProjects && rankedProjects.length > 0 ? (
          <View style={styles.cardsContainer}>
            {rankedProjects.slice(0, 6).map((item) => (
              <TouchableOpacity
                key={item.project.id}
                style={styles.matchCard}
                onPress={() => router.push(`/(project_and_research)/${item.project.id}`)}
              >
                <View style={styles.matchCardHeader}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{item.rank}</Text>
                  </View>
                  <Text style={styles.matchCardTitle} numberOfLines={2}>
                    {item.project.title}
                  </Text>
                </View>
                <Text style={styles.matchCardProfessor}>
                  {item.project.professor_name} • {item.project.university}
                </Text>
                <Text style={styles.matchCardDescription} numberOfLines={2}>
                  {item.project.description}
                </Text>
                {item.reasoning && (
                  <View style={styles.reasoningContainer}>
                    <Ionicons name="sparkles" size={14} color={palette.primary} />
                    <Text style={styles.reasoningText} numberOfLines={2}>
                      {item.reasoning}
                    </Text>
                  </View>
                )}
                <View style={styles.matchCardFooter}>
                  <View style={styles.skillsContainer}>
                    {Array.isArray(item.project.required_skills) && item.project.required_skills.slice(0, 3).map((skill: string, idx: number) => (
                      <View key={idx} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {Array.isArray(item.project.required_skills) && item.project.required_skills.length > 3 && (
                      <Text style={styles.moreSkillsText}>
                        +{item.project.required_skills.length - 3} more
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No ranked projects available.</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Matches</Text>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/matches')}>
            <Text style={styles.seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {matchesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={palette.primary} />
          </View>
        ) : matchesError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{matchesError}</Text>
          </View>
        ) : matches && matches.length > 0 ? (
          <View style={styles.cardsContainer}>
            {matches.slice(0, 6).map((match) => (
              <TouchableOpacity
                key={match.project_id}
                style={styles.matchCard}
                onPress={() => router.push(`/(project_and_research)/${match.project_id}`)}
              >
                <View style={styles.matchCardHeader}>
                  <Text style={styles.matchCardTitle} numberOfLines={2}>
                    {match.title}
                  </Text>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>{Math.round(match.score * 100)}%</Text>
                  </View>
                </View>
                <Text style={styles.matchCardProfessor}>
                  {match.professor_name} • {match.university}
                </Text>
                <Text style={styles.matchCardDescription} numberOfLines={2}>
                  {match.description}
                </Text>
                <View style={styles.matchCardFooter}>
                  <View style={styles.skillsContainer}>
                    {Array.isArray(match.required_skills) && match.required_skills.slice(0, 3).map((skill, idx) => (
                      <View key={idx} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {Array.isArray(match.required_skills) && match.required_skills.length > 3 && (
                      <Text style={styles.moreSkillsText}>
                        +{match.required_skills.length - 3} more
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <EmptyState
            title="No matches yet"
            description="Complete your profile to get personalized project recommendations."
            actionLabel="Update Profile"
            onAction={() => router.push('/(dashboard)/profile')}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse All Projects</Text>
          <TouchableOpacity onPress={() => router.push('/(project_and_research)')}>
            <Text style={styles.seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {projectsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={palette.primary} />
          </View>
        ) : projects && projects.length > 0 ? (
          <View style={styles.cardsContainer}>
            {projects.slice(0, 6).map((project) => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                onPress={() => router.push(`/(project_and_research)/${project.id}`)}
              >
                <Text style={styles.projectCardTitle} numberOfLines={2}>
                  {project.title}
                </Text>
                <Text style={styles.projectCardDescription} numberOfLines={2}>
                  {project.description}
                </Text>
                <View style={styles.projectCardFooter}>
                  <Text style={styles.projectCardLocation}>
                    {project.modality || 'Not specified'} • {project.location || 'Location TBD'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No projects available at the moment.</Text>
        )}
      </View>
    </ScrollView>
  );

  if (isWeb) {
    return (
      <WebsiteLayout showHeader>
        <View style={styles.webContainer}>{content}</View>
      </WebsiteLayout>
    );
  }

  return (
    <SafeAreaView style={styles.mobileContainer} edges={['top']}>
      {content}
    </SafeAreaView>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color={palette.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="information-circle-outline" size={48} color={palette.textSubtle} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      <Button title={actionLabel} onPress={onAction} style={styles.emptyAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  webContainer: {
    width: '100%',
    maxWidth: 1400,
    marginHorizontal: 'auto',
    paddingHorizontal: getPadding(24),
    paddingVertical: getPadding(32),
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    marginBottom: getPadding(32),
    paddingHorizontal: isWeb ? 0 : getPadding(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: getPadding(12),
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getPadding(6),
    paddingVertical: getPadding(8),
    paddingHorizontal: getPadding(12),
  },
  testButtonText: {
    fontSize: getFontSize(12),
    color: palette.textMuted,
    fontWeight: '500',
    fontFamily: 'Inter-Regular',
  },
  greeting: {
    fontSize: getFontSize(32),
    fontWeight: '700',
    color: palette.text,
    marginBottom: getPadding(8),
    fontFamily: 'Inter-Regular',
  },
  subtitle: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: getPadding(40),
    paddingHorizontal: isWeb ? 0 : getPadding(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getPadding(20),
  },
  sectionTitle: {
    fontSize: getFontSize(24),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
  },
  seeAllLink: {
    fontSize: getFontSize(14),
    color: palette.primary,
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
  cardsContainer: {
    flexDirection: isWeb ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: getPadding(16),
  },
  matchCard: {
    flex: isWeb ? '1 1 calc(33.333% - 12px)' : 1,
    minWidth: isWeb ? 300 : '100%',
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: getPadding(20),
    borderWidth: 1,
    borderColor: palette.border,
    ...(shadows.sm as any),
  },
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getPadding(12),
  },
  rankBadge: {
    backgroundColor: palette.primary,
    borderRadius: radii.pill,
    paddingVertical: getPadding(4),
    paddingHorizontal: getPadding(10),
    marginRight: getPadding(8),
    minWidth: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: getFontSize(12),
    fontWeight: '700',
    color: palette.textOnPrimary,
    fontFamily: 'Inter-Regular',
  },
  reasoningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: getPadding(6),
    marginTop: getPadding(8),
    padding: getPadding(8),
    backgroundColor: palette.primarySoft,
    borderRadius: radii.md,
  },
  reasoningText: {
    flex: 1,
    fontSize: getFontSize(12),
    color: palette.text,
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
    lineHeight: getFontSize(16),
  },
  errorSubtext: {
    fontSize: getFontSize(12),
    color: palette.textMuted,
    marginTop: getPadding(4),
    fontFamily: 'Inter-Regular',
  },
  matchCardTitle: {
    flex: 1,
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
    marginRight: getPadding(8),
  },
  scoreBadge: {
    backgroundColor: palette.primary,
    borderRadius: radii.pill,
    paddingVertical: getPadding(4),
    paddingHorizontal: getPadding(12),
  },
  scoreText: {
    fontSize: getFontSize(12),
    fontWeight: '700',
    color: palette.textOnPrimary,
    fontFamily: 'Inter-Regular',
  },
  matchCardProfessor: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    marginBottom: getPadding(8),
    fontFamily: 'Inter-Regular',
  },
  matchCardDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    marginBottom: getPadding(12),
    lineHeight: getFontSize(20),
    fontFamily: 'Inter-Regular',
  },
  matchCardFooter: {
    marginTop: 'auto',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(6),
    alignItems: 'center',
  },
  skillTag: {
    backgroundColor: palette.primarySoft,
    borderRadius: radii.pill,
    paddingVertical: getPadding(4),
    paddingHorizontal: getPadding(10),
  },
  skillText: {
    fontSize: getFontSize(12),
    color: palette.primary,
    fontFamily: 'Inter-Regular',
  },
  moreSkillsText: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
    fontFamily: 'Inter-Regular',
  },
  projectCard: {
    flex: isWeb ? '1 1 calc(33.333% - 12px)' : 1,
    minWidth: isWeb ? 300 : '100%',
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: getPadding(20),
    borderWidth: 1,
    borderColor: palette.border,
    ...(shadows.sm as any),
  },
  projectCardTitle: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: palette.text,
    marginBottom: getPadding(8),
    fontFamily: 'Inter-Regular',
  },
  projectCardDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    marginBottom: getPadding(12),
    lineHeight: getFontSize(20),
    fontFamily: 'Inter-Regular',
  },
  projectCardFooter: {
    marginTop: 'auto',
  },
  projectCardLocation: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
    fontFamily: 'Inter-Regular',
  },
  loadingContainer: {
    paddingVertical: getPadding(40),
    alignItems: 'center',
  },
  errorContainer: {
    padding: getPadding(20),
    backgroundColor: palette.dangerSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.danger,
  },
  errorText: {
    color: palette.danger,
    fontSize: getFontSize(14),
    fontFamily: 'Inter-Regular',
  },
  emptyText: {
    color: palette.textMuted,
    fontSize: getFontSize(14),
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingVertical: getPadding(20),
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
    gap: getPadding(16),
  },
  loadingText: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  emptyState: {
    padding: getPadding(40),
    alignItems: 'center',
    gap: getPadding(16),
  },
  emptyTitle: {
    fontSize: getFontSize(20),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
  },
  emptyDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginBottom: getPadding(8),
  },
  emptyAction: {
    marginTop: getPadding(8),
  },
});

