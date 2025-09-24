import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  ScrollView,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import AppIcon from "../../assets/app_icon/in_app_logo.svg"
import { useCompanyJobs } from "../../hooks/useCompanyJobs";
// import News1 from "../../assets/home_page/news_section/news_1.png";
// import News2 from "../../assets/home_page/news_section/news_2.png";
// import News3 from "../../assets/home_page/news_section/news_3.png";
//import { FlatList } from 'react-native-gesture-handler';

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

const urgentResearchhiring = [
  {
    title: "Machine Learning research to assist medical diagnosis",
    faculty : "Biomedical Engineering school",
    pay: "certiciation",
    image: require("../../assets/home_page/part_time/part_time_1.png"),
    link: "/(daily_part_time)",
  },

  {
    title: "Computer Vision research for autonomous vehicles",
    area : "Mechanical Engineering school",
    pay: "scholarship",
    image: require("../../assets/home_page/part_time/part_time_2.png"),
    link: "/(daily_part_time)",
  },

  {
    title: "semiconductor chips design",
    area : "SJTU GC",
    pay: "$20 - 30/hour",
    image: require("../../assets/home_page/part_time/part_time_3.png"),
    link: "/(daily_part_time)",
  },

  {
    title: "Football Coaching",
    area : "Yangpu",
    pay: "$18 - 25/hour",
    image: require("./../../assets/home_page/part_time/part_time_4.png"),
    link: "/(daily_part_time)",
  },

  {
    title: "Swimming Coaching",
    area : "Huangpu",
    pay: "$22 - 35/hour",
    image: require("./../../assets/home_page/part_time/part_time_5.png"),
    link: "/(daily_part_time)",
  },
];

const dailyRecommendations = [
  {
    title: "Mechanical Engineering (30)",
    duration: "3 - 7.5 months",
    starting: "April 2024 - August 2025",
    salary: "Certification + $1000 - 1500",
    color: "#1a79b0",
  },
  {
    title: "Electrical Engineering (10)",
    duration: "3 - 5 months",
    starting: "April - August 2025",
    salary: "$1000 - 1200",
    color: "#559ac3",
  },
  {
    title: "Accountancy (50)",
    duration: "3 - 12 months",
    starting: "April - December 2025",
    salary: "$800 - 1200",
    color: "#4569c2",
  },
];

export default function home_dashboard(){
  const router = useRouter();
  return(
    <SafeAreaView style={styles.home_page}>
      <StatusBar barStyle="dark-content"/>

      <View style = {styles.header}>
        {/* For Header Purpose */}
        <Pressable onPress = {() => router.push("/(dashboard)")}>
          <AppIcon/>
        </Pressable>
        <Pressable onPress = {() => router.push("/(settings)")}>
          <Feather name="settings" size={28} color="black"/>
        </Pressable>
      </View>

      <View style = {styles.news_container}>
        {/* News Title Section */}
        <Pressable onPress = {() => router.push("/")}>
          <Text style = {styles.section_title}>NEWS</Text>
        </Pressable>

        {/* Auto Horizontal Scroll for NEWS section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalDeck}>
        {newsItems.map((news, idx) => (
            <ImageBackground
            key={idx}
            style={styles.newsCard}
            resizeMode="cover"
            source={news.image}
            >
            <Text style={styles.newsText}>{news.title}</Text>
            </ImageBackground>
        ))}
        </ScrollView>

        {/* FLATLIST FURTHER DEVELOPMENT IS NEEDED */}
        
      </View>

      <View style = {styles.daily_part_time_container}>
        {/* Title for Daily Part - Time Section */}
        <View style = {styles.titles_container}>
          <Text style = {styles.section_title}>Urgent Project Researcher Hiring</Text>
          <Pressable style = {styles.see_more_container} onPress = {() => router.push("/(daily_part_time)")}>
            <Text style = {styles.see_more}>See More</Text>
            <MaterialCommunityIcons name="greater-than" size={15} color= "#7da0ca"/>
          </Pressable>
        </View>

        {/* Horizontal Scroll View for Daily Part - Time Container */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalDeck}>
          {urgentResearchhiring.map((job, idx) => (
            // Try use job.link or need further development since we want in a way when a user clicked the card it direct user to the page that relates to the information
            <Pressable key={idx} style = {styles.see_more_container} onPress = {() => router.push("/(project_and_research)")}> 
              <View key={idx} style={styles.partTimeCard}>
                  <Image
                      style={styles.imageThumb}
                      resizeMode="cover"
                      source={job.image}
                  />
                  <View style={styles.cardTextBlock}>
                      <Text style={styles.cardTitle}>{job.title}</Text>
                      <View style={styles.cardDetailsRow}>
                      <Text style={styles.detailLabel}>Area</Text>
                      <Text style={styles.detailText}>{job.area}</Text>
                      </View>

                      <View style={styles.cardDetailsRow}>
                        <Text style={styles.detailText}>{(job as any).job_internship_vancancy || "Vacancy"} </Text>
                        <View style={styles.detailRating}>
                          {/* <Materialsymbolslightcreditscoreoutlinerounded width={18} height={18} /> */}
                          <Text style={styles.detailText}>+12</Text>
                        </View>
                      </View>


                  </View>
              </View>
            </Pressable>
          ))}
          </ScrollView>

        {/* Further Development Flatlist Function */}
      </View>

      <View style = {styles.daily_recommendation_container}>
        {/* Title for Daily Recommendation Section */}
        <View style = {styles.titles_container}>
          <Text style = {styles.section_title}>Research Project Opportunities</Text>
          <Pressable style = {styles.see_more_container} onPress = {() => router.push("/(swiping_page)")}>
            <Text style = {styles.see_more}>See More</Text>
            <MaterialCommunityIcons name="greater-than" size={12} color= "#7da0ca" />
          </Pressable>
        </View>

        {/* Horizontal Scroll View for Daily Recommendation Container */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalDeck}>
        {dailyRecommendations.map((item, idx) => (
          <Pressable key = {idx} style = {styles.see_more_container} onPress = {() => router.push("/(swiping_page)")}>
            <View key={idx} style={[styles.recommendationCard, { backgroundColor: item.color }]}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <View style = {styles.duration_wrap}>
                <Text style={styles.detailText}>Duration</Text>
                <Text style={styles.detailText}>{item.duration}</Text>
              </View>

              <View style = {styles.starting_wrap}>
                <Text style={styles.detailText}>Starting</Text>
                <Text style={styles.detailText}>{item.starting}</Text>
              </View>

              <View style = {styles.salary_wrap}>
                <Text style={styles.detailText}>Salary</Text>
                <Text style={styles.detailText}>{item.salary}</Text>
              </View>
            </View>
          </Pressable>
        ))}
        </ScrollView>

        {/* FLATLIST FURTHER DEVELOPMENT IS NEEDED */}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  home_page:{
    backgroundColor: "#fff",
    paddingHorizontal: 31,
    justifyContent: "center",
    height:"100%",
    width: "100%",
  },

  header:{
    flex:0.6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center"
  },

  news_container: {
    alignItems:"center"
  },

  daily_part_time_container: {
    paddingTop: hp(1.5),
    flexDirection: "column",
    justifyContent: "center",
  },

  titles_container:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
  },

  see_more :{
    alignItems:"center",
    justifyContent : "center",
    fontFamily: "Inter-Regular",
    textDecorationLine: "underline",
    color: "#7da0ca",
    fontSize: 12,
  },

  see_more_container:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  daily_recommendation_container: {
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: hp(1.5),
  },

  section_title:{
    fontWeight: "bold",
    fontSize: 16,
    //fontFamily: "calibri",
    //fontFamily: "Inter-Regular",
  },

  newsCard: {
    width: wp(80),
    height: wp(35),
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    justifyContent: "flex-end",
    backgroundColor: "#ccc",
  },

  newsText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  horizontalDeck: {
    paddingTop: hp(0.5),
    borderRadius: 10,
    paddingRight:10,
    gap: wp(3.8),
  },

  partTimeCard: {
    flexDirection: "row",
    backgroundColor: "#304830",
    borderRadius: 10,
    height: wp(35),
    width: wp(80),
    //overflow: "hidden",
  },

  imageThumb: {
    width: 110,
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  cardTextBlock: {
    padding: 5,
    flex: 1,
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },

  cardDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detailLabel: {
    color: "#ccc",
    fontSize: 16,
  },
  detailText: {
    color: "#fff",
    fontSize: 16,
  },

  detailRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  recommendationCard: {
    borderRadius: 12,
    padding: 8,
    width: wp(80),
    height: wp(48),
    justifyContent: "space-between",
    //alignItems: "center",
  },

  salary_wrap:{
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor:"gray",
    flexDirection:"row",
    justifyContent: "space-between",
    borderRadius: 5,
    //alignItems: "center",
  },

  starting_wrap:{
    paddingBottom: 2,
  },

  duration_wrap:{
  },
});
