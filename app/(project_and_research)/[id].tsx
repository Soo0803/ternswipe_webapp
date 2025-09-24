import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useCompanyJobs } from "../../hooks/useCompanyJobs";

const ProjectDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: jobs } = useCompanyJobs();

  // Find the project data by id
  const projectData = jobs?.find((job: any) => job.id === parseInt(id as string) || job.id === id) || {
    id: id,
    professor_name: "Professor",
    university: "University",
    description: "Research project description not available.",
    website: "",
    position_description: "Position details not available.",
    profile_image: null,
    lab_first_image: null,
    lab_second_image: null,
    lab_third_image: null,
  };

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
            router.back();
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Research Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Professor Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={(projectData as any).profile_image || (projectData as any).company_logo ? { uri: ((projectData as any).profile_image || (projectData as any).company_logo) } : require("../../assets/home_page/part_time/part_time_1.png")}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.professorName}>{(projectData as any).professor_name || (projectData as any).company_name || "Professor"}</Text>
          <Text style={styles.university}>{(projectData as any).university || (projectData as any).company_location || "University"}</Text>
          {((projectData as any).website || (projectData as any).company_website) && (
            <Text style={styles.website}>{(projectData as any).website || (projectData as any).company_website}</Text>
          )}
        </View>

        {/* Project Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Research</Text>
          <Text style={styles.description}>{(projectData as any).description || (projectData as any).company_description || "Research project description not available."}</Text>
        </View>

        {/* Position Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Position Details</Text>
          <Text style={styles.positionText}>{(projectData as any).position_description || (projectData as any).job_internship_vancancy || "Position details not available."}</Text>
        </View>

        {/* Lab Images */}
        {((projectData as any).lab_first_image || (projectData as any).lab_second_image || (projectData as any).lab_third_image || 
          (projectData as any).company_office_first_image || (projectData as any).company_office_second_image || (projectData as any).company_office_third_image) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lab Environment</Text>
            <View style={styles.imageGrid}>
              {((projectData as any).lab_first_image || (projectData as any).company_office_first_image) && (
                <Image
                  source={{ uri: (projectData as any).lab_first_image || (projectData as any).company_office_first_image }}
                  style={styles.labImage}
                  resizeMode="cover"
                />
              )}
              {((projectData as any).lab_second_image || (projectData as any).company_office_second_image) && (
                <Image
                  source={{ uri: (projectData as any).lab_second_image || (projectData as any).company_office_second_image }}
                  style={styles.labImage}
                  resizeMode="cover"
                />
              )}
              {((projectData as any).lab_third_image || (projectData as any).company_office_third_image) && (
                <Image
                  source={{ uri: (projectData as any).lab_third_image || (projectData as any).company_office_third_image }}
                  style={styles.labImage}
                  resizeMode="cover"
                />
              )}
            </View>
          </View>
        )}

        {/* Requirements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsList}>
            <Text style={styles.requirementItem}>• Strong background in Machine Learning</Text>
            <Text style={styles.requirementItem}>• Experience with Python and TensorFlow/PyTorch</Text>
            <Text style={styles.requirementItem}>• Knowledge of medical imaging is a plus</Text>
            <Text style={styles.requirementItem}>• Good communication skills in English</Text>
            <Text style={styles.requirementItem}>• Available for 6 months minimum</Text>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Gain</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>• Hands-on research experience</Text>
            <Text style={styles.benefitItem}>• Publication opportunities</Text>
            <Text style={styles.benefitItem}>• Networking with medical professionals</Text>
            <Text style={styles.benefitItem}>• Certificate of completion</Text>
            <Text style={styles.benefitItem}>• Potential for continued collaboration</Text>
          </View>
        </View>

        {/* Apply Button */}
        <View style={styles.applySection}>
          <Pressable style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply for this Position</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
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
    backgroundColor: "#f8f9fa",
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#4b8e62",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  professorName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  university: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  website: {
    fontSize: 14,
    color: "#4b8e62",
    textDecorationLine: "underline",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  positionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  labImage: {
    width: wp(28),
    height: wp(28),
    borderRadius: 10,
    marginBottom: 10,
  },
  requirementsList: {
    marginTop: 10,
  },
  requirementItem: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 8,
  },
  benefitsList: {
    marginTop: 10,
  },
  benefitItem: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 8,
  },
  applySection: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  applyButton: {
    backgroundColor: "#4b8e62",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
});

export default ProjectDetail;
