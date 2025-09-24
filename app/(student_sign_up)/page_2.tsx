import { 
  View, 
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React from 'react'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// import components and assets
import AppLogo from "../../assets/app_icon/in_app_logo.svg";
import ProgressBar from "../../component/ProgressBar";
import UploadFileButton from '../../component/UploadFileButton';
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useStudentForm } from "../../context/studentFormContext";


export default function page_2() {
  const router = useRouter();
  const { formData, setFormData } = useStudentForm(); // ✅ now includes setFormData

  return (
    <SafeAreaView style= { styles.page }>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={hp(3)}
      >
        <ScrollView contentContainerStyle= {{ flexGrow: 1, paddingBottom: hp(10) }} showsVerticalScrollIndicator={false}>
          {/* HEADER SECTION FOR LOGO AND PROGRESS BAR */}
          <View style = { styles.header }>
            <AppLogo/>
            <ProgressBar process={0.6}/>
          </View>

          {/* BODY SECTION FOR FILLING THE FORM AND UPLOAD THE FILES */}
          <View style = {styles.body}>
            <View style = {styles.form_group}>
              {/* Preferred location */}
              <View style={styles.input_form_wrap}>
                <Text style={styles.text}>Location</Text>
                <TextInput
                  placeholder='Preferred Locations'
                  style = {styles.text_input}
                  keyboardType='default'
                  value={formData.location}
                  onChangeText={(text) => 
                    setFormData({...formData, location: text || ''})} // Update formData state
                />
              </View>

              {/* MIDDLE NAME */}
              <View style={[styles.input_form_wrap, {paddingTop: hp(1)}]}>
                <Text style={styles.text}>Phone Number</Text>
                <TextInput
                  placeholder='Your Phone No.'
                  style = {styles.text_input}
                  keyboardType='numeric'
                  value={formData.phone_number}
                  onChangeText={(text) => 
                    setFormData({...formData, phone_number: text})} // Update formData state
                />
              </View>
            </View>
            <Text style = {[styles.text, { paddingTop: hp(2)}]}>Current Grade Transcript</Text>
            <UploadFileButton
              onFileSelected={(file) => setFormData({ ...formData, transcript: file })}
            />

            <Text style={[styles.text, { paddingTop: hp(2) }]}>Your Resume</Text>
            <UploadFileButton
              onFileSelected={(file) => setFormData({ ...formData, resume: file })}
            />
          </View>

          {/* FOOTER SECTION FOR GOING TO THE NEXT AND PREVIOUS PAGE */}
          <View style = {styles.footer}>
          <Pressable onPress ={() => router.push("/(student_sign_up)")}>
            <AntDesign name="leftcircleo" size={hp(5)} color="#A5CBE1"/>
          </Pressable>
          <Pressable onPress ={() => router.push("/(student_sign_up)/page_3")}>
            <AntDesign name="rightcircleo" size={hp(5)} color="#A5CBE1"/>
          </Pressable>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create ({
  page: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    height: "100%",
    paddingHorizontal: 31,
  },

  header:{
    paddingTop: hp(2),
    flex : 0.6,
    alignItems: "center",
  },

  
  body:{
    flex:2,
    paddingTop: hp(2),
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footer:{
    flexDirection: "row",
    justifyContent: "space-between",
    flex:1,
    paddingTop: hp(3),
  },

  form_group:{
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  input_form_wrap:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width:"100%"
  },

  text_input:{
    backgroundColor: "f2f2f2",
    borderRadius: 5,
    width: wp(50),
    height: hp(5),
    fontFamily: "Inter-Regular",
    alignItems: "center",
    textAlign: "left",
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderWidth: 1,
  },

  text:{
    fontFamily: "Inter-Regular",
    fontSize: hp(2),
    textAlign: "left",
  },

});
