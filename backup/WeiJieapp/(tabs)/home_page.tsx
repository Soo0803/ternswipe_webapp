import * as React from "react";
import { ScrollView, StyleSheet, View, Text, Pressable, Image, ImageBackground } from "react-native";
import Group8 from "../../assets/SVGs/student_buildprofile_Group 8.svg"
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, ParamListBase } from "@react-navigation/native";
import Mynauihome from "../../assets/SVGs/home_page/mynauihome.svg"
import Notif from "../../assets/SVGs/home_page/notif.svg"
import Mynauichat from "../../assets/SVGs/home_page/myauichat.svg"
import Codiconaccount from "../../assets/SVGs/home_page/codiconaccount.svg"
import Materialsymbolslightcreditscoreoutlinerounded from "../../assets/SVGs/home_page/material-symbols-light_credit-score-outline-rounded.svg"
import Solarsettingsoutline from "../../assets/SVGs/home_page/solarsettingsoutline.svg"

const newsImages = [
  require("../../assets/images/home_page/news_1.png"),
  require("../../assets/images/home_page/news_2.png"),
  require("../../assets/images/home_page/NEWS_3.png"),
];

const partTimeImages = [
  require("../../assets/images/home_page/image 9.png"),
  require("../../assets/images/home_page/image 10.png"),
  require("../../assets/images/home_page/image 11.png"),
  require("../../assets/images/home_page/image 12.png"),
  require("../../assets/images/home_page/image 13.png")
];

const newsItems = [
    {
      title: "SJTU & GERMANY'S FRAUNHOFER SOCIETY SIGNED A NEW STRATEGIC AGREEMENT",
      image: require("../../assets/images/home_page/news_1.png"),
    },
    {
      title: "SJTU WARMLY WELCOMED PRIME MINISTER MARK BROWN OF THE COOK ISLANDS WITH DEEP SEA EXPLORATION DISCUSSION",
      image: require("../../assets/images/home_page/news_2.png"),
    },
    {
      title: "TAKE A LOOK AT SJTU CLUB FAIR CARNIVAL",
      image: require("../../assets/images/home_page/NEWS_3.png"),
    },
];

const partTimeJobs = [
    {
      title: "Walking a Dog",
      area: "Xuhui",
      pay: "$10 - 15/hour",
      img: require("../../assets/images/home_page/image 9.png"),
    },
    {
      title: "English Tutoring",
      area: "Minhang",
      pay: "$15 - 20/hour",
      img: require("../../assets/images/home_page/image 10.png"),
    },
    {
      title: "Tennis Coaching",
      area: "Pudong",
      pay: "$20 - 30/hour",
      img: require("../../assets/images/home_page/image 11.png"),
    },
    {
      title: "Football Coaching",
      area: "Yangpu",
      pay: "$18 - 25/hour",
      img: require("../../assets/images/home_page/image 12.png"),
    },
    {
      title: "Swimming Coaching",
      area: "Huangpu",
      pay: "$22 - 35/hour",
      img: require("../../assets/images/home_page/image 13.png"),
    },
  ];

const dailyRecommendations = [
    {
      title: "Mechanical Engineering (30)",
      duration: "3 - 7.5 months",
      starting: "April 2024 - August 2025",
      salary: "$1500 - 2000",
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


const HomePage = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.topPadding} />

        <View style={styles.headerRow}>
          <Group8 width={65} height={54} />
          <Solarsettingsoutline width={32} height={32} />
        </View>

        <Text style={styles.sectionTitle}>NEWS</Text>
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

        {/* <Text style={styles.sectionTitle}>Daily Part - Time Highlights</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalDeck}>
          {partTimeImages.map((img, idx) => (
            <View key={idx} style={styles.partTimeCard}>
              <Image
                style={styles.imageThumb}
                resizeMode="cover"
                source={img}
              />
              <View style={styles.cardTextBlock}>
                <Text style={styles.cardTitle}>
                  {[
                    "Walking a Dog",
                    "English Tutoring",
                    "Tennis Coaching",
                    "Football Coaching",
                    "Swimming Coaching"
                  ][idx]}
                </Text>
                <View style={styles.cardDetailsRow}>
                  <Text style={styles.detailLabel}>Area</Text>
                  <Text style={styles.detailText}>Xuhui</Text>
                </View>
                <View style={styles.cardDetailsRow}>
                  <Text style={styles.detailText}>$10 - 15/hour</Text>
                  <View style={styles.detailRating}>
                    <Materialsymbolslightcreditscoreoutlinerounded width={18} height={18} />
                    <Text style={styles.detailText}>+12</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView> */}

        <Text style={styles.sectionTitle}>Daily Part Time - Highlights</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalDeck}>
        {partTimeJobs.map((job, idx) => (
            <View key={idx} style={styles.partTimeCard}>
                <Image
                    style={styles.imageThumb}
                    resizeMode="cover"
                    source={job.img}
                />
                <View style={styles.cardTextBlock}>
                    <Text style={styles.cardTitle}>{job.title}</Text>
                    <View style={styles.cardDetailsRow}>
                    <Text style={styles.detailLabel}>Area</Text>
                    <Text style={styles.detailText}>{job.area}</Text>
                    </View>

                    <View style={styles.cardDetailsRow}>
                    <Text style={styles.detailText}>
                        {job.pay}
                    </Text>
                    <View style={styles.detailRating}>
                        <Materialsymbolslightcreditscoreoutlinerounded width={18} height={18} />
                        <Text style={styles.detailText}>+12</Text>
                    </View>
                    </View>
                </View>
            </View>
        ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Daily Recommendation</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalDeck}>
        {dailyRecommendations.map((item, idx) => (
            <View key={idx} style={[styles.recommendationCard, { backgroundColor: item.color }]}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.detailText}>Duration: {item.duration}</Text>
            <Text style={styles.detailText}>Starting: {item.starting}</Text>
            <Text style={styles.detailText}>Salary: {item.salary}</Text>
            </View>
        ))}
        </ScrollView>

        <View style={styles.bottomNav}>
        <Pressable><Mynauihome width={24} height={24} /><Text style={styles.navText}>Home</Text></Pressable>
        <Pressable><Notif width={24} height={24} /><Text style={styles.navText}>Notifications</Text></Pressable>
        <Pressable><Mynauichat width={24} height={24} /><Text style={styles.navText}>Messages</Text></Pressable>
        <Pressable><Codiconaccount width={24} height={24} /><Text style={styles.navText}>Profile</Text></Pressable>
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContent: {
    paddingBottom: 40,
    alignItems: "center",
  },
  topPadding: {
    height: 60, // Adjusted for Group8 + StatusBar
  },
  headerRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 12,
  },
  horizontalDeck: {
    paddingHorizontal: 16,
    gap: 16,
  },
  newsCard: {
    width: 300,
    height: 160,
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
  partTimeCard: {
    flexDirection: "row",
    backgroundColor: "#304830",
    borderRadius: 10,
    height: 128,
    width: 328,
    overflow: "hidden",
  },
  imageThumb: {
    width: 110,
    height: 128,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardTextBlock: {
    padding: 8,
    flex: 1,
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cardDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: "#ccc",
    fontSize: 12,
  },
  detailText: {
    color: "#fff",
    fontSize: 13,
  },
  detailRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verticalDeck: {
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  recommendationCard: {
    borderRadius: 12,
    padding: 16,
    width: 280,
    height: 160,
    justifyContent: "space-between",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    width: "100%",
    backgroundColor: "#fff",
    marginTop: 32,
  },
  navText: {
    fontSize: 10,
    color: "#8f8b8b",
    textAlign: "center",
  },
});

export default HomePage;