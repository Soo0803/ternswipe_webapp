import * as React from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import Mynauihome from "../../assets/SVGs/home_page/mynauihome.svg";
import Notif from "../../assets/SVGs/home_page/notif.svg";
import Mynauichat from "../../assets/SVGs/home_page/myauichat.svg";
import Codiconaccount from "../../assets/SVGs/home_page/codiconaccount.svg";

const notifications = [
  {
    company: "BOSCH",
    position: "Mechanical Engineering",
    status: "Matched",
    period: "August - December 2025",
    role: "Product Quality Testing Assistant",
    color: "#4b8e62"
  },
  {
    company: "BOEING",
    position: "Mechanical Engineering",
    status: "Failed",
    period: "August - December 2025",
    role: "Product Quality Testing Assistant",
    color: "#8e574b"
  },
  {
    company: "Walking a Dog",
    position: "Part - Time",
    status: "Matched",
    period: "Thursday 09.00 am",
    role: "Xuhui, Shanghai",
    color: "#4b8e62"
  },
  {
    company: "English Tutoring",
    position: "Part - Time",
    status: "Matched",
    period: "Thursday 09.00 am",
    role: "Xuhui, Shanghai",
    color: "#4b8e62"
  },
  {
    company: "Lawning Yard",
    position: "Part Time",
    status: "Failed",
    period: "Friday 4 - 5 am",
    role: "Pudong, Shanghai",
    color: "#8e574b"
  },
  {
    company: "Bytedance",
    position: "Computer Science",
    status: "Matched",
    period: "July - September 2025",
    role: "OpDevs",
    color: "#4b8e62"
  }
];

const Notification = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOTIFICATIONS</Text>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {notifications.map((item, idx) => (
          <View key={idx} style={[styles.card, { backgroundColor: item.color }]}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardText}>{item.company}</Text>
              <Text style={styles.cardText}>{item.position}</Text>
            </View>
            <View style={styles.rowBetween}>
              <View style={styles.column}>
                <Text style={styles.cardText}>Status</Text>
                <Text style={styles.cardText}>{item.status}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.cardText}>Period</Text>
                <Text style={styles.cardText}>{item.period}</Text>
              </View>
            </View>
            <View style={styles.roleBox}>
              <Text style={styles.cardText}>{item.role}</Text>
            </View>
          </View>
        ))}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 80,
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000"
  },
  scrollArea: {
    paddingHorizontal: 20,
    gap: 16
  },
  card: {
    borderRadius: 10,
    padding: 16,
    width: 328,
    gap: 12
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  column: {
    gap: 4
  },
  cardText: {
    color: "#fff",
    fontSize: 14
  },
  roleBox: {
    backgroundColor: "#1e4f75",
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: "center",
    marginTop: 8
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
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        borderTopColor: "#ccc",
        borderTopWidth: 1,
        width: "100%",
        backgroundColor: "#fff",
        marginTop: 5,
    }
    
});

export default Notification;
