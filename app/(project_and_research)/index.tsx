import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useCompanyJobs } from "../../hooks/useCompanyJobs";
import { useRouter } from "expo-router";

const notifications = [
  {
    company: "BOSCH reseach project",
    period: "August - December 2025",
    color: "#4b8e62",
  },
  {
    company: "BOEING research project",
    period: "August - December 2025",
    position: "Product Quality Testing Assistant",
    color: "#8e574b",
  },
  {
    company: "Machine Learning research to assist medical diagnosis",
    period: "Thursday 09.00 am",
    position: "Xuhui, Shanghai",
    color: "#4b8e62",
  },
  {
    company: "Computer Vision research for autonomous vehicles",
    period: "Thursday 09.00 am",
    position: "Xuhui, Shanghai",
    color: "#4b8e62",
  },
  {
    company: "semiconductor chips design",
    role: "Part Time",
    period: "Friday 4 - 5 am",
    position: "Pudong, Shanghai",
    color: "#8e574b",
  },
  {
    company: "Bytedance",
    role: "Computer Science",
    period: "July - September 2025",
    position: "OpDevs",
    color: "#4b8e62",
  },
];

const Research_and_Project = () => {
  const { data: jobs } = useCompanyJobs();
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projects and Researches</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {(jobs || []).map((item: any, index: number) => (
          <Pressable 
            key={index} 
            style={[styles.card, { backgroundColor: "#4b8e62" }]}
            onPress={() => router.push(`/(project_and_research)/${item.id || index}` as any)}
          >
            <View style={styles.row}>
              <Text style={styles.textWhite}>{item.professor_name || item.company_name}</Text>
              <Text style={styles.textWhite}>{item.position_description || item.job_internship_vancancy}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.textWhite}>University</Text>
              <Text style={styles.textWhite}>{item.university || item.company_location || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.textWhite}>Website</Text>
              <Text style={styles.textWhite}>{item.website || item.company_website || ""}</Text>
            </View>
            <View style={styles.footer}>
              <Text style={styles.positionText}>{item.description || item.company_description || ""}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default Research_and_Project;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  textWhite: {
    color: "#fff",
    fontSize: 16,
  },
  footer: {
    marginTop: 10,
    backgroundColor: "#1e4f75",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  positionText: {
    color: "#fff",
    fontSize: 16,
  },
});