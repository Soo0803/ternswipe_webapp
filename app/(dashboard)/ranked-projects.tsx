import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { isWeb } from '../../utils/platform';
import { getFontSize, getPadding } from '../../utils/responsive';
import { palette, radii, shadows } from '../../constants/theme';
import { useRankedProjects } from '../../hooks/useRankedProjects';
import { Ionicons } from '@expo/vector-icons';

export default function RankedProjects() {
  const router = useRouter();
  const { rankedProjects, loading, error, refetch } = useRankedProjects();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <WebsiteLayout showHeader={isWeb}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>Ranking projects with AI...</Text>
        </View>
      </WebsiteLayout>
    );
  }

  const content = (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI-Ranked Projects</Text>
          <Text style={styles.subtitle}>
            Projects ranked by AI based on your profile and preferences
          </Text>
        </View>
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={20} color={palette.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      {rankedProjects.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={64} color={palette.textSubtle} />
          <Text style={styles.emptyTitle}>No projects available</Text>
          <Text style={styles.emptyDescription}>
            There are currently no open projects to rank.
          </Text>
        </View>
      ) : (
        <View style={styles.projectsList}>
          {rankedProjects.map((item, index) => (
            <TouchableOpacity
              key={item.project.id || index}
              style={styles.projectCard}
              onPress={() => router.push(`/(project_and_research)/${item.project.id}`)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankNumber}>#{item.rank}</Text>
                </View>
                {item.score !== undefined && (
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>
                      {Math.round(item.score * 100)}% match
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.projectTitle} numberOfLines={2}>
                {item.project.title}
              </Text>

              <View style={styles.projectMeta}>
                <Text style={styles.projectProfessor}>
                  {item.project.professor_name} • {item.project.university}
                </Text>
              </View>

              <Text style={styles.projectDescription} numberOfLines={3}>
                {item.project.description}
              </Text>

              {item.reasoning && (
                <View style={styles.reasoningContainer}>
                  <Text style={styles.reasoningLabel}>Why this match:</Text>
                  <Text style={styles.reasoningText}>{item.reasoning}</Text>
                </View>
              )}

              <View style={styles.projectFooter}>
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
                <View style={styles.projectDetails}>
                  <Text style={styles.detailText}>
                    {item.project.modality || 'Not specified'} • {item.project.hrs_per_week || 'N/A'} hrs/week
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: getPadding(16),
  },
  loadingText: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  header: {
    marginBottom: getPadding(32),
    paddingHorizontal: isWeb ? 0 : getPadding(20),
  },
  title: {
    fontSize: getFontSize(36),
    fontWeight: '700',
    color: palette.text,
    marginBottom: getPadding(8),
    fontFamily: 'Inter-Regular',
  },
  subtitle: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
    lineHeight: getFontSize(24),
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getPadding(8),
    marginTop: getPadding(16),
    padding: getPadding(12),
    backgroundColor: palette.dangerSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.danger,
  },
  errorText: {
    flex: 1,
    fontSize: getFontSize(14),
    color: palette.danger,
    fontFamily: 'Inter-Regular',
  },
  projectsList: {
    gap: getPadding(16),
    paddingHorizontal: isWeb ? 0 : getPadding(20),
    paddingBottom: getPadding(32),
  },
  projectCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: getPadding(24),
    borderWidth: 1,
    borderColor: palette.border,
    ...(shadows.sm as any),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getPadding(16),
  },
  rankBadge: {
    backgroundColor: palette.primary,
    borderRadius: radii.pill,
    paddingVertical: getPadding(8),
    paddingHorizontal: getPadding(16),
    minWidth: 60,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: palette.textOnPrimary,
    fontFamily: 'Inter-Regular',
  },
  scoreBadge: {
    backgroundColor: palette.successSoft,
    borderRadius: radii.pill,
    paddingVertical: getPadding(6),
    paddingHorizontal: getPadding(12),
  },
  scoreText: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: palette.success,
    fontFamily: 'Inter-Regular',
  },
  projectTitle: {
    fontSize: getFontSize(24),
    fontWeight: '700',
    color: palette.text,
    marginBottom: getPadding(8),
    fontFamily: 'Inter-Regular',
  },
  projectMeta: {
    marginBottom: getPadding(12),
  },
  projectProfessor: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  projectDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    lineHeight: getFontSize(20),
    marginBottom: getPadding(16),
    fontFamily: 'Inter-Regular',
  },
  reasoningContainer: {
    backgroundColor: palette.primarySoft,
    borderRadius: radii.md,
    padding: getPadding(12),
    marginBottom: getPadding(16),
    borderLeftWidth: 3,
    borderLeftColor: palette.primary,
  },
  reasoningLabel: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: palette.primary,
    marginBottom: getPadding(4),
    fontFamily: 'Inter-Regular',
  },
  reasoningText: {
    fontSize: getFontSize(13),
    color: palette.text,
    lineHeight: getFontSize(18),
    fontFamily: 'Inter-Regular',
  },
  projectFooter: {
    marginTop: getPadding(8),
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(6),
    alignItems: 'center',
    marginBottom: getPadding(12),
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
  projectDetails: {
    marginTop: getPadding(8),
  },
  detailText: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
    fontFamily: 'Inter-Regular',
  },
  emptyState: {
    padding: getPadding(60),
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
  },
});

