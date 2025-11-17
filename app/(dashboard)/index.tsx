import React, { useMemo } from 'react';
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
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useProfessorProjects } from '../../hooks/useProfessorProjects';
import { palette, radii, shadows } from '../../constants/theme';
import AppIcon from '../../assets/app_icon/in_app_logo.svg';

type StudentCard = ReturnType<typeof useStudentMatches>['data'][number];

export default function DashboardHome() {
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();

  const isProfessor = user?.role === 'PROFESSOR';
  const {
    data: studentMatches,
    loading: studentMatchesLoading,
    error: studentMatchesError,
  } = useStudentMatches(6, { enabled: !isProfessor });
  const {
    data: openProjects,
    loading: projectsLoading,
  } = useAllProjects();
  const {
    profile: professorProfile,
    projects: professorProjects,
    loading: professorLoading,
    error: professorError,
  } = useProfessorProjects(isProfessor ? user?.id?.toString() : undefined);

  if (userLoading) {
    return (
      <LoadingState message="Preparing your dashboard..." />
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Sign in to continue"
        description="Your session expired. Please sign in again to access your dashboard."
        actionLabel="Go to sign in"
        onAction={() => router.replace('/(auth)/login')}
      />
    );
  }

  // Redirect to role-specific dashboard
  if (isProfessor) {
    router.replace('/(dashboard)/professor');
    return <LoadingState message="Redirecting..." />;
  }

  router.replace('/(dashboard)/student');
  return <LoadingState message="Redirecting..." />;
}

type StudentDashboardProps = {
  router: ReturnType<typeof useRouter>;
  user: { username: string | null | undefined };
  matches: StudentCard[];
  matchesLoading: boolean;
  matchesError: string | null;
  projects: ReturnType<typeof useAllProjects>['data'];
  projectsLoading: boolean;
};

function StudentDashboard({
  router,
  user,
  matches,
  matchesLoading,
  matchesError,
  projects,
  projectsLoading,
}: StudentDashboardProps) {
  const averageMatchScore = useMemo(() => {
    if (!matches || matches.length === 0) return 0;
    const total = matches.reduce((sum, match) => sum + match.score * 100, 0);
    return Math.round(total / matches.length);
  }, [matches]);

  if (isWeb) {
    return (
      <WebsiteLayout showHeader={false}>
        <ScrollView
          contentContainerStyle={styles.dashboardScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dashboardContainer}>
            <View style={styles.studentHero}>
              <View style={styles.studentHeroHeader}>
                <View style={styles.studentHeroBadge}>
                  <Text style={styles.studentHeroBadgeText}>Student workspace</Text>
            </View>
                <Text style={styles.studentHeroTitle}>
                  Hi {user?.username ?? 'there'}, your next research chapter starts here.
            </Text>
                <Text style={styles.studentHeroSubtitle}>
                  Review your most aligned matches, understand why they fit, and take the next step
                  toward joining a lab that values your contributions.
                </Text>
                <View style={styles.studentHeroActions}>
              <Button
                    title="View all matches"
                    onPress={() => router.push('/(dashboard)/matches')}
                    style={styles.studentHeroPrimary}
                    textStyle={styles.studentHeroPrimaryText}
              />
              <Button
                    title="Update my profile"
                    onPress={() => router.push('/(dashboard)/profile')}
                variant="outline"
                    style={styles.studentHeroSecondary}
                    textStyle={styles.studentHeroSecondaryText}
              />
            </View>
          </View>
              <View style={styles.studentHeroStats}>
                <StatBlock
                  label="Recommended projects"
                  value={matches?.length ?? 0}
                  icon="sparkles-outline"
                />
                <StatBlock
                  label="Average fit score"
                  value={matches && matches.length > 0 ? `${averageMatchScore}%` : '—'}
                  icon="stats-chart-outline"
                />
                <StatBlock
                  label="Open opportunities"
                  value={projects?.length ?? 0}
                  icon="briefcase-outline"
                />
              </View>
            </View>
            
            <View style={styles.panel}>
              <SectionHeader
                title="Top matches this week"
                actionLabel="See all"
                onAction={() => router.push('/(dashboard)/matches')}
              />
            {matchesLoading ? (
                <PanelLoader message="Loading personalized matches..." />
              ) : matchesError ? (
                <PanelError message={matchesError} />
              ) : matches && matches.length > 0 ? (
                <View style={styles.matchGrid}>
                {matches.map((match) => (
                    <View key={match.project_id} style={styles.matchCard}>
                      <View style={styles.matchHeader}>
                        <View style={styles.matchScore}>
                          <Ionicons name="flame-outline" size={18} color={palette.primary} />
                          <Text style={styles.matchScoreValue}>
                            {Math.round(match.score * 100)}%
                          </Text>
                        </View>
                  <TouchableOpacity
                    onPress={() => router.push(`/(project_and_research)/${match.project_id}`)}
                  >
                          <Ionicons name="arrow-forward-circle" size={20} color={palette.primary} />
                        </TouchableOpacity>
                    </View>
                      <Text style={styles.matchTitle} numberOfLines={2}>
                      {match.title}
                    </Text>
                      <Text style={styles.matchProfessor} numberOfLines={1}>
                        {match.professor_name} · {match.university}
                    </Text>
                      <Text style={styles.matchDescription} numberOfLines={3}>
                        {match.description || 'This project is seeking motivated collaborators.'}
                    </Text>
                      <View style={styles.matchMeta}>
                        <MetaPill
                          icon="checkmark-circle"
                          label={`${Math.round(match.skill_coverage * 100)}% skill alignment`}
                        />
                        {match.hrs_per_week ? (
                          <MetaPill
                            icon="time-outline"
                            label={`${match.hrs_per_week} hrs / week`}
                          />
                        ) : null}
                      </View>
                      {match.required_skills && match.required_skills.length > 0 && (
                        <View style={styles.skillRow}>
                          {match.required_skills.slice(0, 4).map((skill) => (
                            <View key={skill} style={styles.skillTag}>
                              <Text style={styles.skillTagText}>{skill}</Text>
                    </View>
                          ))}
                          {match.required_skills.length > 4 && (
                            <Text style={styles.skillTagOverflow}>
                              +{match.required_skills.length - 4}
                </Text>
                          )}
              </View>
            )}
          </View>
                  ))}
                </View>
              ) : (
                <PanelEmpty
                  title="No matches yet"
                  description="Tell us more about your skills and interests to unlock personalized recommendations."
                  actionLabel="Complete my profile"
                  onAction={() => router.push('/(dashboard)/profile')}
                />
              )}
            </View>

            <View style={styles.panel}>
              <SectionHeader
                title="Explore other opportunities"
                actionLabel="Browse directory"
                onAction={() => router.push('/(project_and_research)')}
              />
            {projectsLoading ? (
                <PanelLoader message="Scanning new projects..." />
              ) : projects && projects.length > 0 ? (
                <View style={styles.projectWrap}>
                  {projects.slice(0, 4).map((project) => (
                    <View key={project.id} style={styles.projectCard}>
                      <Text style={styles.projectTitle} numberOfLines={2}>
                      {project.title}
                    </Text>
                      <Text style={styles.projectDescription} numberOfLines={3}>
                        {project.description || 'Professors will update this description soon.'}
                    </Text>
                      <View style={styles.projectFooter}>
                        <Text style={styles.projectMetaText}>
                          {project.capacity} open position{project.capacity !== 1 ? 's' : ''}
                          </Text>
                        <TouchableOpacity
                          style={styles.projectLink}
                          onPress={() => router.push(`/(project_and_research)/${project.id}`)}
                        >
                          <Text style={styles.projectLinkText}>View</Text>
                          <Ionicons name="arrow-forward" size={14} color={palette.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                ))}
              </View>
            ) : (
                <PanelEmpty
                  title="We’ll add more soon"
                  description="New opportunities are published every week. Check back in a bit or message your favorite labs."
                  actionLabel="Go to messages"
                  onAction={() => router.push('/message')}
                />
            )}
          </View>
                  </View>
            </ScrollView>
      </WebsiteLayout>
    );
  }

  return (
    <SafeAreaView style={styles.mobileContainer}>
      <ScrollView
        style={styles.mobileScroll}
        contentContainerStyle={styles.mobileContent}
      >
        <View style={styles.mobileHeaderRow}>
          <AppIcon width={80} height={40} />
          <TouchableOpacity onPress={() => router.push('/(settings)')}>
            <Ionicons name="settings-outline" size={22} color={palette.text} />
          </TouchableOpacity>
      </View>

        <View style={styles.mobileHeroCard}>
          <Text style={styles.mobileHeroTitle}>Hello {user?.username ?? 'there'} 👋</Text>
          <Text style={styles.mobileHeroSubtitle}>
            Review your latest matches and see where you can contribute next.
          </Text>
          <Button
            title="View all matches"
            onPress={() => router.push('/(dashboard)/matches')}
            fullWidth
            style={styles.mobileHeroButton}
          />
        </View>

        <View style={styles.mobileSection}>
          <Text style={styles.mobileSectionTitle}>Top matches</Text>
          {matchesLoading ? (
            <ActivityIndicator color={palette.primary} />
          ) : matches && matches.length > 0 ? (
            matches.slice(0, 3).map((match) => (
                <TouchableOpacity
                  key={match.project_id}
                  style={styles.mobileMatchCard}
                  onPress={() => router.push(`/(project_and_research)/${match.project_id}`)}
                >
                <View style={styles.mobileMatchHeader}>
                  <Text style={styles.mobileMatchTitle}>{match.title}</Text>
                  <Text style={styles.mobileMatchScore}>{Math.round(match.score * 100)}%</Text>
                </View>
                <Text style={styles.mobileMatchProfessor} numberOfLines={1}>
                  {match.professor_name}
                  </Text>
                </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.mobileEmptyText}>
              Complete your profile to view recommended projects.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ProfessorDashboardProps = {
  router: ReturnType<typeof useRouter>;
  user: { username: string | null | undefined };
  profile: ReturnType<typeof useProfessorProjects>['profile'];
  projects: ReturnType<typeof useProfessorProjects>['projects'];
  loading: boolean;
  error: string | null;
};

function ProfessorDashboard({
  router,
  user,
  profile,
  projects,
  loading,
  error,
}: ProfessorDashboardProps) {
  const totals = useMemo(() => {
    const totalProjects = projects.length;
    const totalPositions = projects.reduce((sum, project) => sum + (project.capacity || 0), 0);
    const interestedStudents = projects.reduce((sum, project) => sum + (project.matchCount || 0), 0);
    return { totalProjects, totalPositions, interestedStudents };
  }, [projects]);

  if (loading) {
    return <LoadingState message="Gathering your lab insights..." />;
  }

  if (error) {
    return (
      <WebsiteLayout showHeader={false}>
        <View style={styles.centerContainer}>
          <PanelError message={error} />
          <Button
            title="Reload"
            onPress={() => router.push('/(dashboard)')}
            style={styles.reloadButton}
          />
        </View>
      </WebsiteLayout>
    );
  }

  if (!profile) {
    return (
      <EmptyState
        title="Complete your professor profile"
        description="We couldn’t find a professor workspace linked to this account. Finish onboarding to publish projects and meet prospective students."
        actionLabel="Go to registration"
        onAction={() => router.push('/(company_sign_up)')}
      />
    );
  }

  if (isWeb) {
    return (
      <WebsiteLayout showHeader={false}>
        <ScrollView
          contentContainerStyle={styles.dashboardScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dashboardContainer}>
            <View style={styles.professorHero}>
              <View style={styles.professorHeroContent}>
                <View style={styles.studentHeroBadge}>
                  <Text style={styles.studentHeroBadgeText}>Professor workspace</Text>
                </View>
                <Text style={styles.professorHeroTitle}>
                  Welcome back {profile.professor_name || user.username}.
                </Text>
                <Text style={styles.professorHeroSubtitle}>
                  Track interest in your projects, respond to the strongest student matches, and
                  maintain momentum for your research pipeline.
                </Text>
                <View style={styles.professorHeroActions}>
                  <Button
                    title="Create new project"
                    onPress={() => router.push('/(project_and_research)')}
                    style={styles.studentHeroPrimary}
                    textStyle={styles.studentHeroPrimaryText}
                  />
                  <Button
                    title="Manage profile"
                    onPress={() => router.push('/(dashboard)/profile')}
                    variant="outline"
                    style={styles.studentHeroSecondary}
                    textStyle={styles.studentHeroSecondaryText}
                  />
                </View>
              </View>
              <View style={styles.professorStatRow}>
                <StatBlock
                  label="Published projects"
                  value={totals.totalProjects}
                  icon="documents-outline"
                />
                <StatBlock
                  label="Open positions"
                  value={totals.totalPositions}
                  icon="people-outline"
                />
                <StatBlock
                  label="Interested students"
                  value={totals.interestedStudents}
                  icon="chatbubbles-outline"
                />
              </View>
            </View>

            <View style={styles.panel}>
              <SectionHeader title="Project interest" />
              {projects.length === 0 ? (
                <PanelEmpty
                  title="No projects yet"
                  description="Publish your first project to start receiving curated student matches."
                  actionLabel="Publish project"
                  onAction={() => router.push('/(project_and_research)')}
                />
              ) : (
                <View style={styles.projectTable}>
                  {projects.map((project) => (
                    <View key={project.id} style={styles.projectRow}>
                      <View style={styles.projectRowHeader}>
                        <Text style={styles.projectRowTitle}>{project.title}</Text>
                        <TouchableOpacity
                          style={styles.viewMatchesLink}
                          onPress={() =>
                            router.push({
                              pathname: '/(dashboard)/project-matches',
                              params: { projectId: project.id.toString() },
                            })
                          }
                        >
                          <Text style={styles.viewMatchesText}>View matches</Text>
                          <Ionicons
                            name="arrow-forward"
                            size={14}
                            color={palette.primary}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.projectRowDescription} numberOfLines={2}>
                        {project.description || 'Add more details so students know what to expect.'}
                      </Text>
                      <View style={styles.projectRowMeta}>
                        <MetaPill
                          icon="people-circle-outline"
                          label={`${project.matchCount} interested student${project.matchCount === 1 ? '' : 's'}`}
                        />
                        <MetaPill
                          icon="time-outline"
                          label={`${project.capacity} open slot${project.capacity === 1 ? '' : 's'}`}
                        />
                      </View>
                      {project.matches && project.matches.length > 0 && (
                        <View style={styles.matchPreviewRow}>
                          {project.matches.map((student) => (
                            <View key={student.student_id} style={styles.matchPreviewCard}>
                              <View style={styles.matchPreviewScore}>
                                <Text style={styles.matchPreviewScoreText}>
                                  {Math.round(student.score * 100)}%
                                </Text>
                              </View>
                              <Text style={styles.matchPreviewName} numberOfLines={1}>
                                {student.given_name || student.username}
                              </Text>
                              {student.headline ? (
                                <Text style={styles.matchPreviewHeadline} numberOfLines={2}>
                                  {student.headline}
                                </Text>
                              ) : null}
                              {student.skills && student.skills.length > 0 && (
                                <Text style={styles.matchPreviewSkills} numberOfLines={1}>
                                  {student.skills.slice(0, 2).join(' • ')}
                                </Text>
                              )}
                            </View>
                          ))}
                          {project.matchCount > project.matches.length ? (
                            <View style={styles.matchPreviewMore}>
                              <Text style={styles.matchPreviewMoreText}>
                                +{project.matchCount - project.matches.length} more
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
            </ScrollView>
      </WebsiteLayout>
    );
  }

  return (
    <SafeAreaView style={styles.mobileContainer}>
      <ScrollView
        style={styles.mobileScroll}
        contentContainerStyle={styles.mobileContent}
      >
        <View style={styles.mobileHeaderRow}>
          <AppIcon width={80} height={40} />
          <TouchableOpacity onPress={() => router.push('/(settings)')}>
            <Ionicons name="settings-outline" size={22} color={palette.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.mobileHeroCard}>
          <Text style={styles.mobileHeroTitle}>
            Hello {profile.professor_name || user.username}
          </Text>
          <Text style={styles.mobileHeroSubtitle}>
            Keep track of student interest on the go.
          </Text>
        </View>

        <View style={styles.mobileSection}>
          <Text style={styles.mobileSectionTitle}>Recent interest</Text>
          {projects.length === 0 ? (
            <Text style={styles.mobileEmptyText}>
              Publish a project to start receiving matches.
            </Text>
          ) : (
            projects.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={styles.mobileProjectCard}
                onPress={() =>
                  router.push({
                    pathname: '/(dashboard)/project-matches',
                    params: { projectId: project.id.toString() },
                  })
                }
              >
                <Text style={styles.mobileProjectTitle}>{project.title}</Text>
                <Text style={styles.mobileProjectMeta}>
                  {project.matchCount} interested · {project.capacity} openings
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <WebsiteLayout showHeader={false}>
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingMessage}>{message}</Text>
      </View>
    </WebsiteLayout>
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
    <WebsiteLayout showHeader={false}>
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyDescription}>{description}</Text>
        <Button title={actionLabel} onPress={onAction} style={styles.reloadButton} />
      </View>
    </WebsiteLayout>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
          <Ionicons name="arrow-forward" size={14} color={palette.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function PanelLoader({ message }: { message: string }) {
  return (
    <View style={styles.panelLoader}>
      <ActivityIndicator size="small" color={palette.primary} />
      <Text style={styles.panelLoaderText}>{message}</Text>
    </View>
  );
}

function PanelError({ message }: { message: string }) {
  return (
    <View style={styles.panelError}>
      <Ionicons name="alert-circle" size={20} color={palette.danger} />
      <Text style={styles.panelErrorText}>{message}</Text>
    </View>
  );
}

function PanelEmpty({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.panelEmpty}>
      <Text style={styles.panelEmptyTitle}>{title}</Text>
      <Text style={styles.panelEmptyDescription}>{description}</Text>
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={styles.panelEmptyButton}
          textStyle={styles.studentHeroPrimaryText}
        />
      ) : null}
    </View>
  );
}

function StatBlock({ label, value, icon }: { label: string; value: number | string; icon: any }) {
  return (
    <View style={styles.statBlock}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={18} color={palette.primary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MetaPill({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.metaPill}>
      <Ionicons name={icon} size={14} color={palette.textSubtle} />
      <Text style={styles.metaPillText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboardScroll: {
    paddingBottom: getPadding(80),
  },
  dashboardContainer: {
    width: '100%',
    gap: getPadding(32),
  },
  studentHero: {
    backgroundColor: palette.surface,
    borderRadius: radii.xl,
    padding: getPadding(32),
    borderWidth: 1,
    borderColor: palette.border,
    gap: getPadding(24),
    ...(shadows.sm as any),
  },
  studentHeroHeader: {
    gap: getPadding(16),
  },
  studentHeroBadge: {
    alignSelf: 'flex-start',
    paddingVertical: getPadding(6),
    paddingHorizontal: getPadding(12),
    backgroundColor: palette.primarySoft,
    borderRadius: radii.pill,
  },
  studentHeroBadgeText: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: palette.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  studentHeroTitle: {
    fontSize: getFontSize(32),
    fontWeight: '700',
    color: palette.text,
    lineHeight: getFontSize(42),
  },
  studentHeroSubtitle: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
    lineHeight: getFontSize(24),
  },
  studentHeroActions: {
    flexDirection: 'row',
    gap: getPadding(12),
  },
  studentHeroPrimary: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
    paddingHorizontal: getPadding(24),
  },
  studentHeroPrimaryText: {
    color: palette.textOnPrimary,
  },
  studentHeroSecondary: {
    borderColor: palette.textMuted,
    backgroundColor: palette.surface,
    paddingHorizontal: getPadding(24),
  },
  studentHeroSecondaryText: {
    color: palette.text,
  },
  studentHeroStats: {
    flexDirection: 'row',
    gap: getPadding(16),
    flexWrap: 'wrap',
  },
  statBlock: {
    flex: 1,
    minWidth: 180,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    padding: getPadding(20),
    borderWidth: 1,
    borderColor: palette.border,
    gap: getPadding(8),
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: getFontSize(24),
    fontWeight: '700',
    color: palette.text,
  },
  statLabel: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  panel: {
    backgroundColor: palette.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: palette.border,
    padding: getPadding(28),
    gap: getPadding(20),
    ...(shadows.sm as any),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: getFontSize(22),
    fontWeight: '600',
    color: palette.text,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionActionText: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.primary,
  },
  matchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(16),
  },
  matchCard: {
    flexBasis: '48%',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    padding: getPadding(20),
    borderWidth: 1,
    borderColor: palette.border,
    gap: getPadding(12),
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.primarySoft,
    borderRadius: radii.pill,
    paddingHorizontal: getPadding(10),
    paddingVertical: getPadding(4),
  },
  matchScoreValue: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.primary,
  },
  matchTitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
    lineHeight: getFontSize(24),
  },
  matchProfessor: {
    fontSize: getFontSize(14),
    color: palette.textSubtle,
  },
  matchDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    lineHeight: getFontSize(22),
  },
  matchMeta: {
    flexDirection: 'row',
    gap: getPadding(10),
    flexWrap: 'wrap',
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(8),
  },
  skillTag: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    paddingHorizontal: getPadding(10),
    paddingVertical: getPadding(4),
    borderWidth: 1,
    borderColor: palette.border,
  },
  skillTagText: {
    fontSize: getFontSize(12),
    color: palette.text,
  },
  skillTagOverflow: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
    alignSelf: 'center',
  },
  projectWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(16),
  },
  projectCard: {
    flexBasis: '48%',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    padding: getPadding(20),
    borderWidth: 1,
    borderColor: palette.border,
    gap: getPadding(12),
  },
  projectTitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
  },
  projectDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    lineHeight: getFontSize(22),
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectMetaText: {
    fontSize: getFontSize(13),
    color: palette.textSubtle,
  },
  projectLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  projectLinkText: {
    fontSize: getFontSize(13),
    color: palette.primary,
    fontWeight: '600',
  },
  panelLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getPadding(8),
  },
  panelLoaderText: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
  },
  panelError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getPadding(8),
    padding: getPadding(12),
    borderRadius: radii.md,
    backgroundColor: palette.dangerSoft,
  },
  panelErrorText: {
    color: palette.danger,
    fontSize: getFontSize(14),
  },
  panelEmpty: {
    alignItems: 'flex-start',
    gap: getPadding(12),
  },
  panelEmptyTitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
  },
  panelEmptyDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    lineHeight: getFontSize(22),
  },
  panelEmptyButton: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
    paddingHorizontal: getPadding(22),
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: getPadding(10),
    paddingVertical: getPadding(6),
    backgroundColor: palette.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: palette.border,
  },
  metaPillText: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
  },
  professorHero: {
    backgroundColor: palette.surface,
    borderRadius: radii.xl,
    padding: getPadding(32),
    borderWidth: 1,
    borderColor: palette.border,
    gap: getPadding(24),
    ...(shadows.sm as any),
  },
  professorHeroContent: {
    gap: getPadding(16),
  },
  professorHeroTitle: {
    fontSize: getFontSize(30),
    fontWeight: '700',
    color: palette.text,
  },
  professorHeroSubtitle: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
    lineHeight: getFontSize(24),
  },
  professorHeroActions: {
    flexDirection: 'row',
    gap: getPadding(12),
  },
  professorStatRow: {
    flexDirection: 'row',
    gap: getPadding(16),
  },
  projectTable: {
    gap: getPadding(20),
  },
  projectRow: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    padding: getPadding(20),
    borderWidth: 1,
    borderColor: palette.border,
    gap: getPadding(12),
  },
  projectRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectRowTitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
    flex: 1,
    marginRight: getPadding(16),
  },
  viewMatchesLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewMatchesText: {
    fontSize: getFontSize(13),
    color: palette.primary,
    fontWeight: '600',
  },
  projectRowDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    lineHeight: getFontSize(22),
  },
  projectRowMeta: {
    flexDirection: 'row',
    gap: getPadding(12),
    flexWrap: 'wrap',
  },
  matchPreviewRow: {
    flexDirection: 'row',
    gap: getPadding(12),
    flexWrap: 'wrap',
  },
  matchPreviewCard: {
    width: 160,
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    padding: getPadding(12),
    gap: getPadding(6),
    borderWidth: 1,
    borderColor: palette.border,
  },
  matchPreviewScore: {
    alignSelf: 'flex-start',
    backgroundColor: palette.primarySoft,
    borderRadius: radii.pill,
    paddingHorizontal: getPadding(8),
    paddingVertical: getPadding(4),
  },
  matchPreviewScoreText: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: palette.primary,
  },
  matchPreviewName: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.text,
  },
  matchPreviewHeadline: {
    fontSize: getFontSize(12),
    color: palette.textMuted,
  },
  matchPreviewSkills: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
  },
  matchPreviewMore: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getPadding(16),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  matchPreviewMoreText: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: palette.textSubtle,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: getPadding(32),
    gap: getPadding(16),
  },
  loadingMessage: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
  },
  emptyTitle: {
    fontSize: getFontSize(24),
    fontWeight: '700',
    color: palette.text,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    textAlign: 'center',
    lineHeight: getFontSize(22),
  },
  reloadButton: {
    paddingHorizontal: getPadding(24),
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: palette.background,
  },
  mobileScroll: {
    flex: 1,
  },
  mobileContent: {
    padding: getPadding(20),
    gap: getPadding(20),
  },
  mobileHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileHeroCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: getPadding(20),
    gap: getPadding(12),
    borderWidth: 1,
    borderColor: palette.border,
  },
  mobileHeroTitle: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: palette.text,
  },
  mobileHeroSubtitle: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
  },
  mobileHeroButton: {
    marginTop: getPadding(8),
  },
  mobileSection: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: getPadding(20),
    gap: getPadding(12),
    borderWidth: 1,
    borderColor: palette.border,
  },
  mobileSectionTitle: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: palette.text,
  },
  mobileMatchCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: getPadding(16),
    gap: getPadding(6),
    backgroundColor: palette.surfaceMuted,
  },
  mobileMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileMatchTitle: {
    fontSize: getFontSize(15),
    fontWeight: '600',
    color: palette.text,
    flex: 1,
    marginRight: getPadding(12),
  },
  mobileMatchScore: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.primary,
  },
  mobileMatchProfessor: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
  },
  mobileEmptyText: {
    fontSize: getFontSize(13),
    color: palette.textSubtle,
  },
  mobileProjectCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: getPadding(16),
    gap: getPadding(6),
    backgroundColor: palette.surfaceMuted,
  },
  mobileProjectTitle: {
    fontSize: getFontSize(15),
    fontWeight: '600',
    color: palette.text,
  },
  mobileProjectMeta: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
  },
});