import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { isWeb } from '../../utils/platform';
import { useProjectMatches } from '../../hooks/useProjectMatches';
import { getFontSize, getPadding } from '../../utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { palette, radii } from '../../constants/theme';

export default function ProjectMatchesPage() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { data: matches, loading, error } = useProjectMatches(
    projectId ? parseInt(projectId) : 0,
    50
  );

  if (loading) {
    return (
      <WebsiteLayout showHeader={!isWeb}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>Loading student matches...</Text>
        </View>
      </WebsiteLayout>
    );
  }

  if (error) {
    return (
      <WebsiteLayout showHeader={!isWeb}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color={palette.danger} />
          <Text style={styles.errorText}>Error loading matches</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout showHeader={!isWeb}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={palette.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Matched Students</Text>
          <Text style={styles.subtitle}>
            {matches.length} student{matches.length !== 1 ? 's' : ''} matched for this project
          </Text>
        </View>

        {matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={palette.textSubtle} />
            <Text style={styles.emptyText}>No matches found</Text>
            <Text style={styles.emptySubtext}>
              No students match the requirements for this project
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {matches.map((match, index) => (
              <View key={match.student_id} style={styles.matchCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>{Math.round(match.score * 100)}%</Text>
                    <Text style={styles.scoreLabel}>Match</Text>
                  </View>
                  <View style={styles.cardHeaderRight}>
                    <Text style={styles.matchRank}>#{index + 1}</Text>
                  </View>
                </View>

                <Text style={styles.studentName}>
                  {match.given_name || ''} {match.last_name || ''} {match.username}
                </Text>
                <Text style={styles.studentEmail}>{match.email}</Text>

                {match.headline && (
                  <Text style={styles.headline}>{match.headline}</Text>
                )}

                {match.summary && (
                  <Text style={styles.summary} numberOfLines={3}>
                    {match.summary}
                  </Text>
                )}

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="checkmark-circle" size={16} color={palette.success} />
                    <Text style={styles.statText}>
                      {Math.round(match.skill_coverage * 100)}% Skills
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="calendar" size={16} color={palette.info} />
                    <Text style={styles.statText}>
                      {Math.round(match.availability * 100)}% Available
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="school" size={16} color={palette.primary} />
                    <Text style={styles.statText}>
                      {match.gpa ? `GPA: ${match.gpa.toFixed(2)}` : 'No GPA'}
                    </Text>
                  </View>
                </View>

                {match.major_chosen && (
                  <View style={styles.majorContainer}>
                    <Text style={styles.majorLabel}>Major:</Text>
                    <Text style={styles.majorText}>{match.major_chosen}</Text>
                  </View>
                )}

                {match.skills && match.skills.length > 0 && (
                  <View style={styles.skillsContainer}>
                    {match.skills.slice(0, 5).map((skill, idx) => (
                      <View key={idx} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {match.skills.length > 5 && (
                      <Text style={styles.moreSkills}>
                        +{match.skills.length - 5} more
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <View style={styles.contactButton}>
                    <Ionicons name="mail" size={16} color={palette.primary} />
                    <Text style={styles.contactText}>Contact Student</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </WebsiteLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 1000,
    marginHorizontal: 'auto',
    paddingHorizontal: getPadding(24),
    paddingVertical: getPadding(32),
    gap: getPadding(24),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getPadding(32),
    gap: getPadding(16),
  },
  loadingText: {
    marginTop: getPadding(16),
    fontSize: getFontSize(16),
    color: palette.textMuted,
  },
  errorText: {
    marginTop: getPadding(16),
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: palette.text,
  },
  errorDetail: {
    marginTop: getPadding(8),
    fontSize: getFontSize(14),
    color: palette.textMuted,
    textAlign: 'center',
  },
  header: {
    marginBottom: getPadding(32),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getPadding(16),
  },
  backText: {
    fontSize: getFontSize(16),
    color: palette.primary,
    marginLeft: 4,
  },
  title: {
    fontSize: getFontSize(32),
    fontWeight: '700',
    color: palette.text,
    marginBottom: getPadding(8),
  },
  subtitle: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: getPadding(80),
    gap: getPadding(14),
  },
  emptyText: {
    marginTop: getPadding(16),
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: palette.text,
  },
  emptySubtext: {
    marginTop: getPadding(8),
    fontSize: getFontSize(14),
    color: palette.textMuted,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: getPadding(32),
  },
  matchCard: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    padding: getPadding(20),
    marginBottom: getPadding(16),
    borderWidth: 1,
    borderColor: palette.border,
    gap: getPadding(12),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getPadding(16),
  },
  scoreBadge: {
    backgroundColor: palette.primarySoft,
    borderRadius: radii.md,
    paddingHorizontal: getPadding(12),
    paddingVertical: getPadding(8),
    alignItems: 'center',
  },
  scoreText: {
    fontSize: getFontSize(20),
    fontWeight: '700',
    color: palette.primary,
  },
  scoreLabel: {
    fontSize: getFontSize(10),
    color: palette.textSubtle,
    marginTop: 2,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  matchRank: {
    fontSize: getFontSize(14),
    color: palette.textSubtle,
    fontWeight: '600',
  },
  studentName: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: palette.text,
    marginBottom: getPadding(4),
  },
  studentEmail: {
    fontSize: getFontSize(14),
    color: palette.textSubtle,
    marginBottom: getPadding(12),
  },
  headline: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: palette.text,
    marginBottom: getPadding(8),
  },
  summary: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    lineHeight: getFontSize(20),
    marginBottom: getPadding(16),
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(12),
    marginBottom: getPadding(16),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
  },
  majorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getPadding(12),
  },
  majorLabel: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.text,
    marginRight: 8,
  },
  majorText: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(8),
    marginBottom: getPadding(16),
  },
  skillTag: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    paddingHorizontal: getPadding(8),
    paddingVertical: getPadding(4),
    borderWidth: 1,
    borderColor: palette.border,
  },
  skillText: {
    fontSize: getFontSize(12),
    color: palette.text,
  },
  moreSkills: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
    alignSelf: 'center',
  },
  cardFooter: {
    paddingTop: getPadding(16),
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primarySoft,
    borderRadius: radii.md,
    padding: getPadding(12),
    gap: 8,
    borderWidth: 1,
    borderColor: palette.primary,
  },
  contactText: {
    fontSize: getFontSize(14),
    color: palette.primary,
    fontWeight: '600',
  },
});

