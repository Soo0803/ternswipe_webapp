import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { getApiUrl } from "../../utils/apiConfig";
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { isWeb } from '../../utils/platform';
import { getFontSize, getPadding } from '../../utils/responsive';
import { useProjectMatches } from '../../hooks/useProjectMatches';
import { Button } from '../../components/Button';
import { palette, radii } from '../../constants/theme';

const ProjectDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: studentMatches, loading: matchesLoading } = useProjectMatches(
    id ? parseInt(id as string) : 0,
    10
  );

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl(`api/user/projects/`));
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const projects = await response.json();
        const foundProject = projects.find((p: any) => p.id === parseInt(id as string));
        if (foundProject) {
          setProject(foundProject);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleApply = () => {
    Alert.alert(
      "Apply to Research Position",
      "Are you sure you want to apply for this research position?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Apply",
          onPress: () => {
            Alert.alert("Success", "Your application has been submitted!");
          }
        },
      ]
    );
  };

  const handleViewMatches = () => {
    router.push(`/(dashboard)/project-matches?projectId=${id}`);
  };

  if (loading) {
    return (
      <WebsiteLayout showHeader={!isWeb}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>Loading project details...</Text>
        </View>
      </WebsiteLayout>
    );
  }

  if (error || !project) {
    return (
      <WebsiteLayout showHeader={!isWeb}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={palette.danger} />
          <Text style={styles.errorText}>{error || 'Project not found'}</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </WebsiteLayout>
    );
  }

  const content = (
    <>
      {/* Header */}
      <View style={[styles.header, isWeb && styles.webHeader]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
          {isWeb && <Text style={styles.backText}>Back</Text>}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Research Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Professor Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {project.profile_image ? (
              <Image
                source={{ uri: project.profile_image }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person-circle" size={100} color={palette.textSubtle} />
            )}
          </View>
          <Text style={styles.professorName}>
            {project.professor_name || "Professor"}
          </Text>
          <Text style={styles.university}>
            {project.university || "University"}
          </Text>
        </View>

        {/* Project Title */}
        <View style={styles.section}>
          <Text style={styles.projectTitle}>{project.title}</Text>
        </View>

        {/* Project Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Research</Text>
          <Text style={styles.description}>
            {project.description || "Research project description not available."}
          </Text>
        </View>

        {/* Project Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Details</Text>
          <View style={styles.detailsGrid}>
            {project.required_skills && project.required_skills.length > 0 && (
              <View style={styles.detailItem}>
                <Ionicons name="code-slash" size={20} color={palette.primary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Required Skills</Text>
                  <View style={styles.skillsContainer}>
                    {project.required_skills.map((skill: string, idx: number) => (
                      <View key={idx} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
            {project.hrs_per_week && (
              <View style={styles.detailItem}>
                <Ionicons name="time" size={20} color={palette.primary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Hours per Week</Text>
                  <Text style={styles.detailValue}>{project.hrs_per_week} hrs/week</Text>
                </View>
              </View>
            )}
            {project.start_date && (
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={20} color={palette.primary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Start Date</Text>
                  <Text style={styles.detailValue}>
                    {new Date(project.start_date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
            {project.end_date && (
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={20} color={palette.primary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>End Date</Text>
                  <Text style={styles.detailValue}>
                    {new Date(project.end_date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
            {project.location && (
              <View style={styles.detailItem}>
                <Ionicons name="location" size={20} color="#7da0ca" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{project.location}</Text>
                </View>
              </View>
            )}
            {project.modality && (
              <View style={styles.detailItem}>
                <Ionicons name="desktop" size={20} color="#7da0ca" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Modality</Text>
                  <Text style={styles.detailValue}>{project.modality}</Text>
                </View>
              </View>
            )}
            <View style={styles.detailItem}>
              <Ionicons name="people" size={20} color="#7da0ca" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Capacity</Text>
                <Text style={styles.detailValue}>
                  {project.capacity} position{project.capacity !== 1 ? 's' : ''} available
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Matching Students Section (for professors) */}
        {studentMatches && studentMatches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Matched Students</Text>
              <TouchableOpacity onPress={handleViewMatches}>
                <Text style={styles.seeAllLink}>View All →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {studentMatches.slice(0, 5).map((student: any, idx: number) => (
                <View key={student.student_id} style={styles.studentCard}>
                  <View style={styles.studentScoreBadge}>
                    <Text style={styles.studentScoreText}>
                      {Math.round(student.score * 100)}%
                    </Text>
                  </View>
                  <Text style={styles.studentName} numberOfLines={1}>
                    {student.given_name || ''} {student.last_name || ''} {student.username}
                  </Text>
                  <Text style={styles.studentEmail} numberOfLines={1}>
                    {student.email}
                  </Text>
                  <View style={styles.studentStats}>
                    <Text style={styles.studentStatText}>
                      {Math.round(student.skill_coverage * 100)}% Skills
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Apply Button (for students) */}
        <View style={styles.applySection}>
          <Button
            title="Apply for this Position"
            onPress={handleApply}
            style={styles.applyButton}
          />
          {studentMatches && studentMatches.length > 0 && (
            <Button
              title="View Matched Students"
              onPress={handleViewMatches}
              variant="outline"
              style={styles.viewMatchesButton}
            />
          )}
        </View>
      </ScrollView>
    </>
  );

  if (isWeb) {
    return (
      <WebsiteLayout showHeader={false}>
        <View style={styles.webContainer}>
          {content}
        </View>
      </WebsiteLayout>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  webContainer: {
    width: '100%',
    maxWidth: 900,
    marginHorizontal: 'auto',
    paddingHorizontal: getPadding(24),
    paddingVertical: getPadding(32),
    gap: getPadding(24),
  },
  loadingContainer: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getPadding(32),
    gap: getPadding(16),
  },
  errorText: {
    marginTop: getPadding(16),
    fontSize: getFontSize(18),
    color: palette.text,
    textAlign: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: isWeb ? getPadding(0) : 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    marginBottom: getPadding(20),
  },
  webHeader: {
    paddingHorizontal: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: radii.md,
  },
  backText: {
    fontSize: getFontSize(14),
    color: palette.primary,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: isWeb ? getFontSize(24) : 18,
    fontWeight: "600",
    color: palette.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.xl,
    marginBottom: getPadding(24),
    borderWidth: 1,
    borderColor: palette.border,
    gap: getPadding(12),
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: palette.primary,
    backgroundColor: palette.surface,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  professorName: {
    fontSize: isWeb ? getFontSize(24) : 24,
    fontWeight: "bold",
    color: palette.text,
    marginBottom: 5,
  },
  university: {
    fontSize: getFontSize(16),
    color: palette.textSubtle,
    marginBottom: 5,
  },
  section: {
    paddingHorizontal: isWeb ? 0 : 20,
    paddingVertical: 20,
    marginBottom: getPadding(20),
    gap: getPadding(12),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getPadding(16),
  },
  sectionTitle: {
    fontSize: isWeb ? getFontSize(20) : 20,
    fontWeight: "bold",
    color: palette.text,
    marginBottom: 15,
  },
  projectTitle: {
    fontSize: isWeb ? getFontSize(28) : 24,
    fontWeight: "700",
    color: palette.text,
    marginBottom: getPadding(8),
  },
  description: {
    fontSize: getFontSize(16),
    lineHeight: getFontSize(24),
    color: palette.textMuted,
  },
  detailsGrid: {
    gap: getPadding(16),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: getPadding(12),
    paddingBottom: getPadding(16),
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.text,
    marginBottom: getPadding(4),
  },
  detailValue: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(8),
    marginTop: getPadding(4),
  },
  skillTag: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    paddingHorizontal: getPadding(10),
    paddingVertical: getPadding(6),
    borderWidth: 1,
    borderColor: palette.border,
  },
  skillText: {
    fontSize: getFontSize(12),
    color: palette.primary,
    fontWeight: '500',
  },
  seeAllLink: {
    fontSize: getFontSize(14),
    color: palette.primary,
    fontWeight: '600',
  },
  studentCard: {
    width: 200,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    padding: getPadding(16),
    marginRight: getPadding(12),
    borderWidth: 1,
    borderColor: palette.border,
  },
  studentScoreBadge: {
    backgroundColor: palette.primarySoft,
    borderRadius: radii.md,
    paddingVertical: getPadding(4),
    paddingHorizontal: getPadding(8),
    alignSelf: 'flex-start',
    marginBottom: getPadding(8),
  },
  studentScoreText: {
    fontSize: getFontSize(12),
    fontWeight: '700',
    color: palette.primary,
  },
  studentName: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.text,
    marginBottom: getPadding(4),
  },
  studentEmail: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
    marginBottom: getPadding(8),
  },
  studentStats: {
    paddingTop: getPadding(8),
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  studentStatText: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
  },
  applySection: {
    paddingHorizontal: isWeb ? 0 : 20,
    paddingVertical: 20,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.xl,
    marginTop: getPadding(20),
    gap: getPadding(12),
    borderWidth: 1,
    borderColor: palette.border,
  },
  applyButton: {
    width: '100%',
  },
  viewMatchesButton: {
    width: '100%',
  },
});

export default ProjectDetail;
