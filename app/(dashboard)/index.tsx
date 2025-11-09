import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { isWeb } from '../../utils/platform';
import { getFontSize, getPadding } from '../../utils/responsive';
import { useStudentMatches } from '../../hooks/useStudentMatches';
import { useAllProjects } from '../../hooks/useAllProjects';
import { Button } from '../../components/Button';
import AppIcon from "../../assets/app_icon/in_app_logo.svg";

const newsItems = [
  {
    title: "SJTU & GERMANY'S FRAUNHOFER SOCIETY SIGNED A NEW STRATEGIC AGREEMENT",
    image: require("../../assets/home_page/news_section/news_1.png"),
  },
  {
    title: "SJTU WARMLY WELCOMED PRIME MINISTER MARK BROWN OF THE COOK ISLANDS WITH DEEP SEA EXPLORATION DISCUSSION",
    image: require("../../assets/home_page/news_section/news_2.png"),
  },
  {
    title: "Find your next research opportunity and never stop learning!",
    image: require("../../assets/home_page/news_section/news_3.png"),
  },
];

export default function home_dashboard() {
  const router = useRouter();
  const { data: matches, loading: matchesLoading } = useStudentMatches(6);
  const { data: projects, loading: projectsLoading } = useAllProjects();

  if (isWeb) {
    return (
      <WebsiteLayout showHeader={false}>
        <View style={styles.webContainer}>
          {/* Header */}
          <View style={styles.webHeader}>
            <Pressable onPress={() => router.push("/(dashboard)")}>
              <AppIcon width={120} height={40} />
            </Pressable>
            <View style={styles.webNav}>
              <TouchableOpacity 
                onPress={() => router.push("/(dashboard)/matches")}
                style={styles.navButton}
              >
                <Ionicons name="search" size={20} color="#7da0ca" />
                <Text style={styles.navButtonText}>My Matches</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.push("/(project_and_research)")}
                style={styles.navButton}
              >
                <Ionicons name="briefcase" size={20} color="#7da0ca" />
                <Text style={styles.navButtonText}>All Projects</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.push("/(dashboard)/profile")}
                style={styles.navButton}
              >
                <Ionicons name="person" size={20} color="#7da0ca" />
                <Text style={styles.navButtonText}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Welcome to Your Dashboard</Text>
            <Text style={styles.heroSubtitle}>
              Discover research opportunities matched to your skills and interests
            </Text>
            <View style={styles.heroButtons}>
              <Button
                title="View My Matches"
                onPress={() => router.push("/(dashboard)/matches")}
                style={styles.heroButton}
              />
              <Button
                title="Browse All Projects"
                onPress={() => router.push("/(project_and_research)")}
                variant="outline"
                style={styles.heroButton}
              />
            </View>
          </View>

          {/* Top Matches Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Top Matches</Text>
              <TouchableOpacity onPress={() => router.push("/(dashboard)/matches")}>
                <Text style={styles.seeAllLink}>See All →</Text>
              </TouchableOpacity>
            </View>
            
            {matchesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7da0ca" />
              </View>
            ) : matches.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {matches.map((match) => (
                  <TouchableOpacity
                    key={match.project_id}
                    style={styles.matchCard}
                    onPress={() => router.push(`/(project_and_research)/${match.project_id}`)}
                  >
                    <View style={styles.matchScoreBadge}>
                      <Text style={styles.matchScoreText}>
                        {Math.round(match.score * 100)}%
                      </Text>
                    </View>
                    <Text style={styles.matchCardTitle} numberOfLines={2}>
                      {match.title}
                    </Text>
                    <Text style={styles.matchCardProf} numberOfLines={1}>
                      {match.professor_name}
                    </Text>
                    <Text style={styles.matchCardDesc} numberOfLines={3}>
                      {match.description || 'No description'}
                    </Text>
                    <View style={styles.matchCardFooter}>
                      <View style={styles.matchCardStat}>
                        <Ionicons name="checkmark-circle" size={14} color="#4caf50" />
                        <Text style={styles.matchCardStatText}>
                          {Math.round(match.skill_coverage * 100)}%
                        </Text>
                      </View>
                      <Text style={styles.matchCardView}>View →</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No matches yet</Text>
                <Text style={styles.emptySubtext}>
                  Complete your profile to get matched with projects
                </Text>
              </View>
            )}
          </View>

          {/* All Projects Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Projects</Text>
              <TouchableOpacity onPress={() => router.push("/(project_and_research)")}>
                <Text style={styles.seeAllLink}>See All →</Text>
              </TouchableOpacity>
            </View>

            {projectsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7da0ca" />
              </View>
            ) : projects.length > 0 ? (
              <View style={styles.projectsGrid}>
                {projects.slice(0, 6).map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    style={styles.projectCard}
                    onPress={() => router.push(`/(project_and_research)/${project.id}`)}
                  >
                    <Text style={styles.projectCardTitle} numberOfLines={2}>
                      {project.title}
                    </Text>
                    <Text style={styles.projectCardDesc} numberOfLines={3}>
                      {project.description || 'No description'}
                    </Text>
                    {project.required_skills && project.required_skills.length > 0 && (
                      <View style={styles.projectSkills}>
                        {project.required_skills.slice(0, 3).map((skill, idx) => (
                          <View key={idx} style={styles.projectSkillTag}>
                            <Text style={styles.projectSkillText}>{skill}</Text>
                          </View>
                        ))}
                        {project.required_skills.length > 3 && (
                          <Text style={styles.moreSkillsText}>
                            +{project.required_skills.length - 3}
                          </Text>
                        )}
                      </View>
                    )}
                    <View style={styles.projectCardFooter}>
                      <Text style={styles.projectCapacity}>
                        {project.capacity} position{project.capacity !== 1 ? 's' : ''}
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="#7da0ca" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="briefcase-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No projects available</Text>
              </View>
            )}
          </View>

          {/* News Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Latest News</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {newsItems.map((news, idx) => (
                <ImageBackground
                  key={idx}
                  style={styles.newsCard}
                  resizeMode="cover"
                  source={news.image}
                >
                  <View style={styles.newsOverlay}>
                    <Text style={styles.newsText}>{news.title}</Text>
                  </View>
                </ImageBackground>
              ))}
            </ScrollView>
          </View>
        </View>
      </WebsiteLayout>
    );
  }

  // Mobile version - keep original design with updates
  return (
    <SafeAreaView style={styles.mobileContainer}>
      <StatusBar barStyle="dark-content"/>
      <View style={styles.mobileHeader}>
        <Pressable onPress={() => router.push("/(dashboard)")}>
          <AppIcon width={65} height={54} />
        </Pressable>
        <Pressable onPress={() => router.push("/(settings)")}>
          <Ionicons name="settings" size={28} color="black"/>
        </Pressable>
      </View>

      <ScrollView style={styles.mobileScroll} contentContainerStyle={styles.mobileScrollContent}>
        {/* News Section */}
        <View style={styles.mobileNewsContainer}>
          <Text style={styles.mobileSectionTitle}>NEWS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {newsItems.map((news, idx) => (
              <ImageBackground
                key={idx}
                style={styles.mobileNewsCard}
                resizeMode="cover"
                source={news.image}
              >
                <Text style={styles.mobileNewsText}>{news.title}</Text>
              </ImageBackground>
            ))}
          </ScrollView>
        </View>

        {/* Matches Section */}
        <View style={styles.mobileSection}>
          <View style={styles.mobileSectionHeader}>
            <Text style={styles.mobileSectionTitle}>Your Matches</Text>
            <TouchableOpacity onPress={() => router.push("/(dashboard)/matches")}>
              <Text style={styles.mobileSeeMore}>See More →</Text>
            </TouchableOpacity>
          </View>
          {matchesLoading ? (
            <ActivityIndicator size="small" color="#7da0ca" />
          ) : matches.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {matches.slice(0, 3).map((match) => (
                <TouchableOpacity
                  key={match.project_id}
                  style={styles.mobileMatchCard}
                  onPress={() => router.push(`/(project_and_research)/${match.project_id}`)}
                >
                  <Text style={styles.mobileMatchTitle}>{match.title}</Text>
                  <Text style={styles.mobileMatchScore}>
                    {Math.round(match.score * 100)}% Match
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.mobileEmptyText}>No matches yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Web styles
  webContainer: {
    width: '100%',
    paddingBottom: getPadding(60),
  },
  webHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getPadding(24),
    paddingVertical: getPadding(20),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  webNav: {
    flexDirection: 'row',
    gap: getPadding(16),
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: getPadding(12),
    paddingVertical: getPadding(8),
  },
  navButtonText: {
    fontSize: getFontSize(14),
    color: '#7da0ca',
    fontWeight: '500',
  },
  heroSection: {
    paddingVertical: getPadding(60),
    paddingHorizontal: getPadding(24),
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: getFontSize(40),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: getPadding(16),
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: getFontSize(18),
    color: '#666',
    marginBottom: getPadding(32),
    textAlign: 'center',
    maxWidth: 600,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: getPadding(16),
  },
  heroButton: {
    minWidth: 180,
  },
  section: {
    paddingVertical: getPadding(40),
    paddingHorizontal: getPadding(24),
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getPadding(24),
  },
  sectionTitle: {
    fontSize: getFontSize(28),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  seeAllLink: {
    fontSize: getFontSize(14),
    color: '#7da0ca',
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: getPadding(40),
    alignItems: 'center',
  },
  horizontalScroll: {
    gap: getPadding(16),
    paddingRight: getPadding(24),
  },
  matchCard: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: getPadding(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  matchScoreBadge: {
    backgroundColor: '#7da0ca',
    borderRadius: 8,
    paddingVertical: getPadding(6),
    paddingHorizontal: getPadding(12),
    alignSelf: 'flex-start',
    marginBottom: getPadding(12),
  },
  matchScoreText: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: '#fff',
  },
  matchCardTitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: getPadding(8),
  },
  matchCardProf: {
    fontSize: getFontSize(14),
    color: '#666',
    marginBottom: getPadding(12),
  },
  matchCardDesc: {
    fontSize: getFontSize(14),
    color: '#666',
    lineHeight: getFontSize(20),
    marginBottom: getPadding(16),
  },
  matchCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: getPadding(16),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  matchCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchCardStatText: {
    fontSize: getFontSize(12),
    color: '#666',
  },
  matchCardView: {
    fontSize: getFontSize(14),
    color: '#7da0ca',
    fontWeight: '600',
  },
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(16),
  },
  projectCard: {
    flex: 1,
    minWidth: 280,
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: getPadding(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  projectCardTitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: getPadding(12),
  },
  projectCardDesc: {
    fontSize: getFontSize(14),
    color: '#666',
    lineHeight: getFontSize(20),
    marginBottom: getPadding(16),
  },
  projectSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getPadding(6),
    marginBottom: getPadding(16),
  },
  projectSkillTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    paddingHorizontal: getPadding(8),
    paddingVertical: getPadding(4),
  },
  projectSkillText: {
    fontSize: getFontSize(12),
    color: '#333',
  },
  moreSkillsText: {
    fontSize: getFontSize(12),
    color: '#999',
    alignSelf: 'center',
  },
  projectCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: getPadding(16),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  projectCapacity: {
    fontSize: getFontSize(14),
    color: '#666',
  },
  emptyState: {
    paddingVertical: getPadding(60),
    alignItems: 'center',
  },
  emptyText: {
    marginTop: getPadding(16),
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    marginTop: getPadding(8),
    fontSize: getFontSize(14),
    color: '#666',
    textAlign: 'center',
  },
  newsCard: {
    width: 400,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: getPadding(16),
  },
  newsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: getPadding(16),
  },
  newsText: {
    color: '#fff',
    fontSize: getFontSize(16),
    fontWeight: '600',
  },
  // Mobile styles
  mobileContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mobileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getPadding(20),
    paddingVertical: getPadding(16),
  },
  mobileScroll: {
    flex: 1,
  },
  mobileScrollContent: {
    paddingBottom: getPadding(20),
  },
  mobileNewsContainer: {
    paddingHorizontal: getPadding(20),
    marginBottom: getPadding(20),
  },
  mobileSection: {
    paddingHorizontal: getPadding(20),
    marginBottom: getPadding(20),
  },
  mobileSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getPadding(12),
  },
  mobileSectionTitle: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  mobileSeeMore: {
    fontSize: getFontSize(14),
    color: '#7da0ca',
  },
  mobileNewsCard: {
    width: 280,
    height: 150,
    borderRadius: 10,
    marginRight: getPadding(12),
    justifyContent: 'flex-end',
    padding: getPadding(12),
  },
  mobileNewsText: {
    color: '#fff',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  mobileMatchCard: {
    width: 200,
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    padding: getPadding(16),
    marginRight: getPadding(12),
  },
  mobileMatchTitle: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: getPadding(8),
  },
  mobileMatchScore: {
    fontSize: getFontSize(14),
    color: '#7da0ca',
    fontWeight: '600',
  },
  mobileEmptyText: {
    fontSize: getFontSize(14),
    color: '#999',
    textAlign: 'center',
    paddingVertical: getPadding(20),
  },
});
