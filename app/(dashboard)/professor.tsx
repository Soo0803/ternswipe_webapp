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
import { useProfessorProjects } from '../../hooks/useProfessorProjects';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { getCurrentUser as getSupabaseUser } from '../../services/supabaseAuth';
import { palette, radii, shadows } from '../../constants/theme';

export default function ProfessorDashboard() {
  const router = useRouter();
  const { user, loading: userLoading, setCurrentUser } = useCurrentUser();
  const {
    profile: professorProfile,
    projects: professorProjects,
    loading: professorLoading,
    error: professorError,
  } = useProfessorProjects(user?.id?.toString());

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

  if (!user || user.role !== 'PROFESSOR') {
    return (
      <EmptyState
        title="Access Denied"
        description="This dashboard is for professors only."
        actionLabel="Go to sign in"
        onAction={() => router.replace('/(auth)/login')}
      />
    );
  }

  return (
    <ProfessorDashboardContent
      router={router}
      user={user}
      profile={professorProfile}
      projects={professorProjects}
      loading={professorLoading}
      error={professorError}
    />
  );
}

type ProfessorDashboardContentProps = {
  router: ReturnType<typeof useRouter>;
  user: { username: string | null | undefined };
  profile: any;
  projects: any[];
  loading: boolean;
  error: string | null;
};

function ProfessorDashboardContent({
  router,
  user,
  profile,
  projects,
  loading,
  error,
}: ProfessorDashboardContentProps) {
  const content = (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back, {profile?.professor_name || user.username || 'Professor'}!</Text>
          <Text style={styles.subtitle}>Manage your projects and view interested students</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Projects</Text>
              <TouchableOpacity onPress={() => router.push('/(dashboard)/projects')}>
                <Text style={styles.seeAllLink}>Manage</Text>
              </TouchableOpacity>
            </View>

            {projects && projects.length > 0 ? (
              <View style={styles.cardsContainer}>
                {projects.map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    style={styles.projectCard}
                    onPress={() => router.push(`/(dashboard)/project-matches?id=${project.id}`)}
                  >
                    <View style={styles.projectCardHeader}>
                      <Text style={styles.projectCardTitle} numberOfLines={2}>
                        {project.title}
                      </Text>
                      {project.is_open && (
                        <View style={styles.openBadge}>
                          <Text style={styles.openBadgeText}>Open</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.projectCardDescription} numberOfLines={2}>
                      {project.description}
                    </Text>
                    <View style={styles.projectCardFooter}>
                      <View style={styles.matchInfo}>
                        <Ionicons name="people-outline" size={16} color={palette.textMuted} />
                        <Text style={styles.matchCountText}>
                          {project.matchCount || 0} interested student{project.matchCount !== 1 ? 's' : ''}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => router.push(`/(dashboard)/project-matches?id=${project.id}`)}
                        style={styles.viewMatchesButton}
                      >
                        <Text style={styles.viewMatchesText}>View Matches</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <EmptyState
                title="No projects yet"
                description="Create your first project to start receiving student applications."
                actionLabel="Create Project"
                onAction={() => router.push('/(onboarding)/professor/projects')}
              />
            )}
          </View>

          {projects && projects.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Stats</Text>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{projects.length}</Text>
                  <Text style={styles.statLabel}>Active Projects</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {projects.reduce((sum, p) => sum + (p.matchCount || 0), 0)}
                  </Text>
                  <Text style={styles.statLabel}>Total Matches</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {projects.filter(p => p.is_open).length}
                  </Text>
                  <Text style={styles.statLabel}>Open Positions</Text>
                </View>
              </View>
            </View>
          )}
        </>
      )}
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
  projectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getPadding(12),
  },
  projectCardTitle: {
    flex: 1,
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
    marginRight: getPadding(8),
  },
  openBadge: {
    backgroundColor: palette.successSoft,
    borderRadius: radii.pill,
    paddingVertical: getPadding(4),
    paddingHorizontal: getPadding(12),
  },
  openBadgeText: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: palette.success,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getPadding(6),
  },
  matchCountText: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  viewMatchesButton: {
    paddingVertical: getPadding(6),
    paddingHorizontal: getPadding(12),
    backgroundColor: palette.primary,
    borderRadius: radii.md,
  },
  viewMatchesText: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.textOnPrimary,
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: getPadding(16),
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: getPadding(20),
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    ...(shadows.sm as any),
  },
  statNumber: {
    fontSize: getFontSize(32),
    fontWeight: '700',
    color: palette.primary,
    fontFamily: 'Inter-Regular',
    marginBottom: getPadding(8),
  },
  statLabel: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
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

