import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { isWeb } from '../../utils/platform';
import { useStudentMatches } from '../../hooks/useStudentMatches';
import { getFontSize, getPadding } from '../../utils/responsive';
import { palette, radii } from '../../constants/theme';
import { Button } from '../../components/Button';

export default function StudentMatchesPage() {
  const router = useRouter();
  const { data: matches, loading, error } = useStudentMatches(50);

  const averageScore = useMemo(() => {
    if (!matches || matches.length === 0) return null;
    const total = matches.reduce((sum, item) => sum + item.score * 100, 0);
    return Math.round(total / matches.length);
  }, [matches]);

  if (loading) {
    return (
      <WebsiteLayout showHeader={!isWeb}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.centerMessage}>Finding projects that fit your profile…</Text>
        </View>
      </WebsiteLayout>
    );
  }

  if (error) {
    return (
      <WebsiteLayout showHeader={!isWeb}>
        <View style={styles.centerContainer}>
          <Ionicons name='alert-circle' size={42} color={palette.danger} />
          <Text style={styles.errorTitle}>We couldn’t load your matches</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button
            title='Back to dashboard'
            onPress={() => router.replace('/(dashboard)')}
            style={styles.retryButton}
            textStyle={styles.retryButtonText}
          />
        </View>
      </WebsiteLayout>
    );
  }

  const emptyState = (
    <View style={styles.emptyState}>
      <Ionicons name='search-outline' size={48} color={palette.textSubtle} />
      <Text style={styles.emptyTitle}>No matches yet</Text>
      <Text style={styles.emptyDescription}>
        Update your profile with skills, availability, and interests to unlock tailored recommendations.
      </Text>
      <Button
        title='Open profile'
        onPress={() => router.push('/(dashboard)/profile')}
        style={styles.panelButton}
        textStyle={styles.panelButtonText}
      />
    </View>
  );

  if (!matches || matches.length === 0) {
    return (
      <WebsiteLayout showHeader={!isWeb}>
        <View style={styles.container}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Matched projects</Text>
            <Text style={styles.pageSubtitle}>
              We’ll keep scanning the research catalog and notify you when new fits arrive.
            </Text>
          </View>
          {emptyState}
        </View>
      </WebsiteLayout>
    );
  }

  if (isWeb) {
    return (
      <WebsiteLayout showHeader={false}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>Your matched projects</Text>
              <Text style={styles.pageSubtitle}>
                {matches.length} opportunities curated for your profile{averageScore ? ` · Avg fit ${averageScore}%` : ''}
              </Text>
            </View>

            <View style={styles.matchGrid}>
              {matches.map((match, index) => (
                <View key={match.project_id} style={styles.matchCard}>
                  <View style={styles.matchHeader}>
                    <View style={styles.matchBadge}>
                      <Text style={styles.matchBadgeValue}>{Math.round(match.score * 100)}%</Text>
                      <Text style={styles.matchBadgeLabel}>fit</Text>
                    </View>
                    <Text style={styles.matchIndex}>#{index + 1}</Text>
                  </View>

                  <Text style={styles.matchTitle} numberOfLines={2}>{match.title}</Text>
                  <Text style={styles.matchProfessor} numberOfLines={1}>
                    {match.professor_name} · {match.university}
                  </Text>

                  <Text style={styles.matchDescription} numberOfLines={3}>
                    {match.description || 'Professor will update the description soon. Tap view for full context.'}
                  </Text>

                  <View style={styles.metaRow}>
                    <MetaChip icon='checkmark-circle' label={`${Math.round(match.skill_coverage * 100)}% skill alignment`} />
                    <MetaChip icon='calendar-outline' label={`${Math.round(match.availability * 100)}% availability`} />
                    {match.hrs_per_week ? (
                      <MetaChip icon='time-outline' label={`${match.hrs_per_week} hrs / week`} />
                    ) : null}
                  </View>

                  {match.required_skills && match.required_skills.length > 0 && (
                    <View style={styles.skillRow}>
                      {match.required_skills.slice(0, 6).map((skill) => (
                        <View key={skill} style={styles.skillTag}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                      {match.required_skills.length > 6 ? (
                        <Text style={styles.skillOverflow}>
                          +{match.required_skills.length - 6}
                        </Text>
                      ) : null}
                    </View>
                  )}

                  <View style={styles.cardFooter}>
                    <View style={styles.footerLeft}>
                      <Ionicons name='people-outline' size={14} color={palette.textSubtle} />
                      <Text style={styles.footerText}>
                        {match.capacity} position{match.capacity === 1 ? '' : 's'} open
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => router.push(`/(project_and_research)/${match.project_id}`)}
                    >
                      <Text style={styles.viewButtonText}>View project</Text>
                      <Ionicons name='arrow-forward' size={14} color={palette.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout showHeader={false}>
      <ScrollView
        style={styles.mobileScroll}
        contentContainerStyle={styles.mobileContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mobileTitle}>Matched projects</Text>
        <Text style={styles.mobileSubtitle}>
          {matches.length} opportunities customized to your profile
        </Text>

        {matches.map((match) => (
          <TouchableOpacity
            key={match.project_id}
            style={styles.mobileCard}
            onPress={() => router.push(`/(project_and_research)/${match.project_id}`)}
          >
            <View style={styles.mobileCardHeader}>
              <Text style={styles.mobileCardTitle}>{match.title}</Text>
              <Text style={styles.mobileCardScore}>{Math.round(match.score * 100)}%</Text>
            </View>
            <Text style={styles.mobileCardProfessor} numberOfLines={1}>
              {match.professor_name}
            </Text>
            <Text style={styles.mobileCardDescription} numberOfLines={2}>
              {match.description || 'Preview the full description for details.'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </WebsiteLayout>
  );
}

function MetaChip({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.metaChip}>
      <Ionicons name={icon} size={14} color={palette.textSubtle} />
      <Text style={styles.metaChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: getPadding(80),
  },
  container: {
    width: '100%',
    gap: getPadding(24),
  },
  pageHeader: {
    gap: getPadding(10),
  },
  pageTitle: {
    fontSize: getFontSize(32),
    fontWeight: '700',
    color: palette.text,
  },
  pageSubtitle: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
  },
  matchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(18),
  },
  matchCard: {
    flexBasis: '48%',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: getPadding(22),
    gap: getPadding(14),
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchBadge: {
    alignItems: 'center',
    paddingHorizontal: getPadding(10),
    paddingVertical: getPadding(6),
    borderRadius: radii.pill,
    backgroundColor: palette.primarySoft,
  },
  matchBadgeValue: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: palette.primary,
  },
  matchBadgeLabel: {
    fontSize: getFontSize(10),
    color: palette.textSubtle,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  matchIndex: {
    fontSize: getFontSize(13),
    color: palette.textSubtle,
  },
  matchTitle: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: palette.text,
    lineHeight: getFontSize(26),
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
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(10),
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: getPadding(10),
    paddingVertical: getPadding(6),
    borderRadius: radii.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  metaChipText: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(8),
  },
  skillTag: {
    paddingHorizontal: getPadding(10),
    paddingVertical: getPadding(4),
    borderRadius: radii.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  skillText: {
    fontSize: getFontSize(12),
    color: palette.text,
  },
  skillOverflow: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
    alignSelf: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getPadding(6),
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewButtonText: {
    fontSize: getFontSize(13),
    fontWeight: '600',
    color: palette.primary,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: getPadding(16),
    padding: getPadding(32),
  },
  centerMessage: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
  },
  errorTitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
  },
  errorMessage: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: getPadding(22),
  },
  retryButtonText: {
    color: palette.textOnPrimary,
  },
  emptyState: {
    alignItems: 'center',
    gap: getPadding(14),
    paddingVertical: getPadding(60),
    paddingHorizontal: getPadding(24),
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.border,
  },
  emptyTitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
  },
  emptyDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    textAlign: 'center',
    lineHeight: getFontSize(22),
  },
  panelButton: {
    paddingHorizontal: getPadding(24),
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  panelButtonText: {
    color: palette.textOnPrimary,
  },
  mobileScroll: {
    flex: 1,
    backgroundColor: palette.background,
  },
  mobileContent: {
    padding: getPadding(20),
    gap: getPadding(14),
  },
  mobileTitle: {
    fontSize: getFontSize(24),
    fontWeight: '700',
    color: palette.text,
  },
  mobileSubtitle: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
  },
  mobileCard: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: getPadding(18),
    gap: getPadding(8),
  },
  mobileCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileCardTitle: {
    flex: 1,
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: palette.text,
    marginRight: getPadding(12),
  },
  mobileCardScore: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.primary,
  },
  mobileCardProfessor: {
    fontSize: getFontSize(13),
    color: palette.textSubtle,
  },
  mobileCardDescription: {
    fontSize: getFontSize(13),
    color: palette.textMuted,
    lineHeight: getFontSize(20),
  },
});

