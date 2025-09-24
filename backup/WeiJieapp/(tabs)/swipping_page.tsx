import * as React from "react";
import { Text, StyleSheet, View, Image, Pressable, ScrollView } from "react-native";
import Group8 from "../../assets/SVGs/student_buildprofile_Group 8.svg";
import Mynauihome from "../../assets/SVGs/home_page/mynauihome.svg";
import Notif from "../../assets/SVGs/home_page/notif.svg";
import Mynauichat from "../../assets/SVGs/home_page/myauichat.svg";
import Codiconaccount from "../../assets/SVGs/home_page/codiconaccount.svg";
import Carbonsettingsadjust from "../../assets/SVGs/swipping_page/carbon_settings-adjust.svg";

const SwipingPage = () => {
  return (
    <View style={styles.swipingPage}>
      <View style={styles.topSection}>
        <Group8 width={65} height={54} />
        <Carbonsettingsadjust width={32} height={32} />
      </View>
        

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <Image
          style={[styles.heroImage, styles.imageRadius]}
          resizeMode="cover"
          source={require("../../assets/images/swipping_page/image 5.png")}
        />
        <Image
          style={styles.heroImage}
          resizeMode="cover"
          source={require("../../assets/images/swipping_page/image 7.png")}
        />
        <Image
          style={styles.heroImage}
          resizeMode="cover"
          source={require("../../assets/images/swipping_page/image 6.png")}
        />
        <Image
          style={styles.heroImage}
          resizeMode="cover"
          source={require("../../assets/images/swipping_page/image 4.png")}
        />
        <Image
          style={styles.heroImage}
          resizeMode="cover"
          source={require("../../assets/images/swipping_page/image 8.png")}
        />

        <View style={styles.companyProfileContainer}>
          <Text style={styles.companyTitle}>Company Profile</Text>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.info}>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</Text>
          <Text style={styles.label}>Revenue</Text>
          <Text style={styles.info}>$1300 m</Text>
          <Text style={styles.label}>No. of Employee</Text>
          <Text style={styles.info}>1200</Text>
          <Text style={styles.label}>Year Established</Text>
          <Text style={styles.info}>1977</Text>
          <Text style={styles.label}>Position Requirements</Text>
          <Text style={styles.info}>- Be able to communicate with team
- Strong fundamental in Python
- Understanding in Linear Algebra
- Research experience in university
- Withstand high load pressure</Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton}><Text style={styles.buttonText}>APPLY</Text></Pressable>
          <Pressable style={styles.secondaryButton}><Text style={styles.buttonText}>MESSAGE</Text></Pressable>
        </View>
      </ScrollView>

        <View style={[styles.instanceParent, styles.parentFlexBox]}>
            <Pressable style={[styles.mynauihomeParent, styles.parentFlexBox]} onPress={()=>{}}>
            <Mynauihome style={styles.mynauihomeIcon} width={24} height={24} />
            <Text style={[styles.notifications, styles.notificationsTypo]}>Home</Text>
            </Pressable>
            <View style={[styles.mynauihomeParent, styles.parentFlexBox]}>
            <Notif style={styles.mynauihomeIcon} width={24} height={24} />
            <Text style={[styles.notifications1, styles.notificationsTypo]}>Notifications</Text>
            </View>
            <Pressable style={[styles.mynauihomeParent, styles.parentFlexBox]} onPress={()=>{}}>
            <Mynauichat style={styles.mynauihomeIcon} width={24} height={24} />
            <Text style={[styles.notifications, styles.notificationsTypo]}>Messages</Text>
            </Pressable>
            <Pressable style={[styles.mynauihomeParent, styles.parentFlexBox]} onPress={()=>{}}>
            <Codiconaccount style={styles.mynauihomeIcon} width={24} height={24} />
            <Text style={[styles.notifications, styles.notificationsTypo]}>Profile</Text>
            </Pressable>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  swipingPage: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  heroImage: {
    height: 500,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  imageRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  companyProfileContainer: {
    gap: 8,
    marginTop: 20,
  },
  companyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a79b0",
    marginTop: 12,
  },
  info: {
    fontSize: 13,
    color: "#333",
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  primaryButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#559ac3",
    borderRadius: 30,
    alignItems: "center",
    paddingVertical: 8,
  },
  secondaryButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#6298b9",
    borderRadius: 30,
    alignItems: "center",
    paddingVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  parentFlexBox: {
    alignItems: "center",
    flex: 1
    },
    notificationsTypo: {
    width: 48,
    textAlign: "center",
    fontFamily: "Inter-Regular",
    lineHeight: 22,
    fontSize: 8
    },
    mynauihomeIcon: {
    overflow: "hidden"
    },
    notifications: {
    color: "#8f8b8b"
    },
    mynauihomeParent: {
    paddingHorizontal: 0,
    paddingVertical: 5
    },
    notifications1: {
    color: "#6298b9"
    },
    instanceParent: {
        position: "absolute",     // fix at bottom
        bottom: 0,                // pin to bottom
        left: 0,
        right: 0,
        height: 100,  
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        borderTopColor: "#ccc",
        borderTopWidth: 1,
        width: "100%",
        backgroundColor: "#fff",
        marginTop: 32,
      }
});

export default SwipingPage;
