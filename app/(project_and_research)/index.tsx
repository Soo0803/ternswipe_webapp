import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAllProjects } from "../../hooks/useAllProjects";
import { useRouter } from "expo-router";
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { isWeb } from '../../utils/platform';
import { getFontSize, getPadding } from '../../utils/responsive';
import { Ionicons } from '@expo/vector-icons';

export default function Research_and_Project() {
  const { data: projects, loading, error } = useAllProjects();
  const router = useRouter();

  if (isWeb) {
    return (
      <WebsiteLayout showHeader={true}>
        <View style={styles.webContainer}>
          <View style={styles.webHeader}>
            <Text style={styles.webTitle}>Research Projects</Text>
            <Text style={styles.webSubtitle}>
              Browse all available research opportunities
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7da0ca" />
              <Text style={styles.loadingText}>Loading projects...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
              <Text style={styles.errorText}>Error loading projects</Text>
              <Text style={styles.errorDetail}>{error}</Text>
            </View>
          ) : projects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No projects available</Text>
              <Text style={styles.emptySubtext}>
                Check back later for new research opportunities
              </Text>
            </View>
          ) : (
            <View style={styles.projectsGrid}>
              {projects.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={styles.projectCard}
                  onPress={() => router.push(`/(project_and_research)/${project.id}`)}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.projectTitle} numberOfLines={2}>
                        {project.title}
                      </Text>
                    </View>
                    {project.is_open && (
                      <View style={styles.openBadge}>
                        <Text style={styles.openBadgeText}>Open</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.projectDescription} numberOfLines={3}>
                    {project.description || 'No description available'}
                  </Text>

                  {project.required_skills && project.required_skills.length > 0 && (
                    <View style={styles.skillsContainer}>
                      {project.required_skills.slice(0, 4).map((skill, idx) => (
                        <View key={idx} style={styles.skillTag}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                      {project.required_skills.length > 4 && (
                        <Text style={styles.moreSkills}>
                          +{project.required_skills.length - 4} more
                        </Text>
                      )}
                    </View>
                  )}

                  <View style={styles.projectDetails}>
                    {project.hrs_per_week && (
                      <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          {project.hrs_per_week} hrs/week
                        </Text>
                      </View>
                    )}
                    {project.location && (
                      <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>{project.location}</Text>
                      </View>
                    )}
                    {project.modality && (
                      <View style={styles.detailItem}>
                        <Ionicons name="desktop-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>{project.modality}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.capacityText}>
                      {project.capacity} position{project.capacity !== 1 ? 's' : ''} available
                    </Text>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => router.push(`/(project_and_research)/${project.id}`)}
                    >
                      <Text style={styles.viewButtonText}>View Details</Text>
                      <Ionicons name="arrow-forward" size={16} color="#7da0ca" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </WebsiteLayout>
    );
  }

  // Mobile version
  return (
    <View style={styles.mobileContainer}>
      <Text style={styles.mobileTitle}>Projects and Researches</Text>
      {loading ? (
        <View style={styles.mobileLoadingContainer}>
          <ActivityIndicator size="large" color="#7da0ca" />
        </View>
      ) : error ? (
        <View style={styles.mobileErrorContainer}>
          <Text style={styles.mobileErrorText}>Error: {error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.mobileScrollContent}>
          {projects.map((project, index) => (
            <Pressable
              key={project.id}
              style={styles.mobileCard}
              onPress={() => router.push(`/(project_and_research)/${project.id}`)}
            >
              <Text style={styles.mobileCardTitle}>{project.title}</Text>
              <Text style={styles.mobileCardDescription} numberOfLines={3}>
                {project.description || 'No description available'}
              </Text>
              {project.required_skills && project.required_skills.length > 0 && (
                <View style={styles.mobileSkillsContainer}>
                  {project.required_skills.slice(0, 3).map((skill, idx) => (
                    <View key={idx} style={styles.mobileSkillTag}>
                      <Text style={styles.mobileSkillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={styles.mobileCardFooter}>
                <Text style={styles.mobileCapacity}>
                  {project.capacity} position{project.capacity !== 1 ? 's' : ''}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#7da0ca" />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Web styles
  webContainer: {
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: getPadding(24),
    paddingVertical: getPadding(40),
  },
  webHeader: {
    marginBottom: getPadding(40),
  },
  webTitle: {
    fontSize: getFontSize(36),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: getPadding(8),
  },
  webSubtitle: {
    fontSize: getFontSize(16),
    color: '#666',
  },
  loadingContainer: {
    paddingVertical: getPadding(80),
    alignItems: 'center',
  },
  loadingText: {
    marginTop: getPadding(16),
    fontSize: getFontSize(16),
    color: '#666',
  },
  errorContainer: {
    paddingVertical: getPadding(80),
    alignItems: 'center',
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
  },
  emptyContainer: {
    paddingVertical: getPadding(80),
    alignItems: 'center',
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
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(20),
  },
  projectCard: {
    flex: 1,
    minWidth: 320,
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: getPadding(24),
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
  cardHeaderLeft: {
    flex: 1,
    marginRight: getPadding(12),
  },
  projectTitle: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: getFontSize(26),
  },
  openBadge: {
    backgroundColor: '#4caf50',
    borderRadius: 6,
    paddingHorizontal: getPadding(8),
    paddingVertical: getPadding(4),
  },
  openBadgeText: {
    fontSize: getFontSize(12),
    color: '#fff',
    fontWeight: '600',
  },
  projectDescription: {
    fontSize: getFontSize(14),
    color: '#666',
    lineHeight: getFontSize(20),
    marginBottom: getPadding(16),
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(8),
    marginBottom: getPadding(16),
  },
  skillTag: {
    backgroundColor: '#f0f7ff',
    borderRadius: 6,
    paddingHorizontal: getPadding(10),
    paddingVertical: getPadding(6),
  },
  skillText: {
    fontSize: getFontSize(12),
    color: '#7da0ca',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: getFontSize(12),
    color: '#999',
    alignSelf: 'center',
  },
  projectDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(12),
    marginBottom: getPadding(16),
    paddingBottom: getPadding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: getFontSize(12),
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  // Mobile styles
  mobileContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  mobileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  mobileLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileErrorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  mobileErrorText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
  mobileScrollContent: {
    paddingBottom: 100,
  },
  mobileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mobileCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  mobileCardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  mobileSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  mobileSkillTag: {
    backgroundColor: '#f0f7ff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  mobileSkillText: {
    fontSize: 12,
    color: '#7da0ca',
  },
  mobileCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  mobileCapacity: {
    fontSize: 14,
    color: '#666',
  },
});
