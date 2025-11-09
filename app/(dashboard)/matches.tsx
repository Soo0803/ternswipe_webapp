import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { isWeb } from '../../utils/platform';
import { useStudentMatches } from '../../hooks/useStudentMatches';
import { getFontSize, getPadding } from '../../utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';

export default function StudentMatchesPage() {
  const router = useRouter();
  const { data: matches, loading, error } = useStudentMatches(50);

  if (loading) {
    return (
      <WebsiteLayout showHeader={!isWeb}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7da0ca" />
          <Text style={styles.loadingText}>Loading your matches...</Text>
        </View>
      </WebsiteLayout>
    );
  }

  if (error) {
    return (
      <WebsiteLayout showHeader={!isWeb}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>Error loading matches</Text>
          <Text style={styles.errorDetail}>{error}</Text>
          <Button
            title="Try Again"
            onPress={() => router.push('/(dashboard)')}
            style={styles.retryButton}
          />
        </View>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout showHeader={!isWeb}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Matched Projects</Text>
          <Text style={styles.subtitle}>
            {matches.length} project{matches.length !== 1 ? 's' : ''} matched based on your profile
          </Text>
        </View>

        {matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No matches found</Text>
            <Text style={styles.emptySubtext}>
              Complete your profile to get better matches
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {matches.map((match, index) => (
              <TouchableOpacity
                key={match.project_id}
                style={styles.matchCard}
                onPress={() => router.push(`/(project_and_research)/${match.project_id}`)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>{Math.round(match.score * 100)}%</Text>
                    <Text style={styles.scoreLabel}>Match</Text>
                  </View>
                  <View style={styles.cardHeaderRight}>
                    <Text style={styles.matchRank}>#{index + 1}</Text>
                  </View>
                </View>

                <Text style={styles.projectTitle}>{match.title}</Text>
                <Text style={styles.professorName}>
                  {match.professor_name} · {match.university}
                </Text>

                <Text style={styles.description} numberOfLines={3}>
                  {match.description || 'No description available'}
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
                    <Text style={styles.statText}>
                      {Math.round(match.skill_coverage * 100)}% Skills
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="calendar" size={16} color="#2196f3" />
                    <Text style={styles.statText}>
                      {Math.round(match.availability * 100)}% Available
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="time" size={16} color="#ff9800" />
                    <Text style={styles.statText}>{match.hrs_per_week} hrs/week</Text>
                  </View>
                </View>

                {match.required_skills && match.required_skills.length > 0 && (
                  <View style={styles.skillsContainer}>
                    {match.required_skills.slice(0, 5).map((skill, idx) => (
                      <View key={idx} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {match.required_skills.length > 5 && (
                      <Text style={styles.moreSkills}>
                        +{match.required_skills.length - 5} more
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <Text style={styles.capacityText}>
                    {match.capacity} position{match.capacity !== 1 ? 's' : ''} available
                  </Text>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => router.push(`/(project_and_research)/${match.project_id}`)}
                  >
                    <Text style={styles.viewButtonText}>View Details</Text>
                    <Ionicons name="arrow-forward" size={16} color="#7da0ca" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getPadding(32),
  },
  loadingText: {
    marginTop: getPadding(16),
    fontSize: getFontSize(16),
    color: '#666',
  },
  errorText: {
    marginTop: getPadding(16),
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: '#333',
  },
  errorDetail: {
    marginTop: getPadding(8),
    fontSize: getFontSize(14),
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: getPadding(24),
  },
  header: {
    marginBottom: getPadding(32),
  },
  title: {
    fontSize: getFontSize(32),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: getPadding(8),
  },
  subtitle: {
    fontSize: getFontSize(16),
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: getPadding(80),
  },
  emptyText: {
    marginTop: getPadding(16),
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    marginTop: getPadding(8),
    fontSize: getFontSize(14),
    color: '#666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: getPadding(32),
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: getPadding(20),
    marginBottom: getPadding(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getPadding(16),
  },
  scoreBadge: {
    backgroundColor: '#7da0ca',
    borderRadius: 8,
    paddingHorizontal: getPadding(12),
    paddingVertical: getPadding(8),
    alignItems: 'center',
  },
  scoreText: {
    fontSize: getFontSize(20),
    fontWeight: '700',
    color: '#fff',
  },
  scoreLabel: {
    fontSize: getFontSize(10),
    color: '#fff',
    marginTop: 2,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  matchRank: {
    fontSize: getFontSize(14),
    color: '#999',
    fontWeight: '600',
  },
  projectTitle: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: getPadding(8),
  },
  professorName: {
    fontSize: getFontSize(14),
    color: '#666',
    marginBottom: getPadding(12),
  },
  description: {
    fontSize: getFontSize(14),
    color: '#666',
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
    color: '#666',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(8),
    marginBottom: getPadding(16),
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    paddingHorizontal: getPadding(8),
    paddingVertical: getPadding(4),
  },
  skillText: {
    fontSize: getFontSize(12),
    color: '#333',
  },
  moreSkills: {
    fontSize: getFontSize(12),
    color: '#999',
    alignSelf: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: getPadding(16),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  capacityText: {
    fontSize: getFontSize(14),
    color: '#666',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewButtonText: {
    fontSize: getFontSize(14),
    color: '#7da0ca',
    fontWeight: '600',
  },
});

