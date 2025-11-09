import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { isWeb } from '../../utils/platform';
import { useProjectMatches } from '../../hooks/useProjectMatches';
import { getFontSize, getPadding } from '../../utils/responsive';
import { Ionicons } from '@expo/vector-icons';

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
          <ActivityIndicator size="large" color="#7da0ca" />
          <Text style={styles.loadingText}>Loading student matches...</Text>
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
        </View>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout showHeader={!isWeb}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#7da0ca" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Matched Students</Text>
          <Text style={styles.subtitle}>
            {matches.length} student{matches.length !== 1 ? 's' : ''} matched for this project
          </Text>
        </View>

        {matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
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
                    <Ionicons name="school" size={16} color="#9c27b0" />
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
                    <Ionicons name="mail" size={16} color="#7da0ca" />
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
    color: '#7da0ca',
    marginLeft: 4,
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
  studentName: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: getPadding(4),
  },
  studentEmail: {
    fontSize: getFontSize(14),
    color: '#666',
    marginBottom: getPadding(12),
  },
  headline: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: getPadding(8),
  },
  summary: {
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
  majorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getPadding(12),
  },
  majorLabel: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  majorText: {
    fontSize: getFontSize(14),
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
    paddingTop: getPadding(16),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: getPadding(12),
    gap: 8,
  },
  contactText: {
    fontSize: getFontSize(14),
    color: '#7da0ca',
    fontWeight: '600',
  },
});

