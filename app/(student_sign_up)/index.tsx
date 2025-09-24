import {  View,
          Text, 
          StyleSheet,
          ScrollView,
          Platform,
          KeyboardAvoidingView
} from 'react-native';

import React from 'react';

import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, TextInput } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

// import components and assets
import AppLogo from "../../assets/app_icon/in_app_logo.svg";
import ProgressBar from "../../component/ProgressBar";
import ProfileImage from "../../component/ProfileImagePicker";
import AntDesign from '@expo/vector-icons/AntDesign';
// import axios from 'axios';
import { useStudentForm } from "../../context/studentFormContext";

export default function index () {
  const router = useRouter();

  // State hooks to store user input
  const { formData, setFormData } = useStudentForm();

  const handleSubmit = () => {
    router.push("/(student_sign_up)/page_2");
  };

  return (
    <SafeAreaView style = {styles.page}>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height"}
        //style={{ flex: 1}}
        keyboardVerticalOffset={hp(3)}
        >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(10)}} showsVerticalScrollIndicator={false}>
        {/* HEADER SECTION FOR LOGO AND PROGRESS BAR */}
        <View style = {styles.header}>
          <AppLogo/>
          <ProgressBar process={0.333}/>
          <Text style = {[styles.text, {paddingTop: hp(1), paddingBottom: hp(1), color: "#A5CBE1"}]}>WHO ARE YOU?</Text>
        </View>

        {/* BODY SECTION FOR FILL IN FORM INCLUDES PHOTO AND TEXT INPUT */}
        <View style = {styles.body}>
          <ProfileImage/>
          <View style = {styles.form_group}>
            {/* GIVEN NAME */}
            <View style={styles.input_form_wrap}>
              <Text style={styles.text}>Given Name</Text>
              <TextInput
                placeholder='Enter Your Given Name'
                style = {styles.text_input}
                keyboardType='default'
                value={formData.given_name}
                onChangeText={(text) => 
                  setFormData({...formData, given_name: text})} 
              />
            </View>

            {/* MIDDLE NAME */}
            <View style={[styles.input_form_wrap, {paddingTop: hp(1)}]}>
              <Text style={styles.text}>Middle Name</Text>
              <TextInput
                placeholder='(Optional / if any)'
                style = {styles.text_input}
                keyboardType='default'
                value={formData.middle_name}
                onChangeText={(text) => 
                  setFormData({...formData, middle_name: text})}
              />
            </View>

            {/* LAST NAME */}
            <View style={[styles.input_form_wrap, {paddingTop: hp(1)}]}>
              <Text style={styles.text}>Last Name</Text>
              <TextInput
                placeholder='Enter Your Last Name'
                style = {styles.text_input}
                keyboardType='default'
                value={formData.last_name}
                onChangeText={(text) => 
                  setFormData({...formData, last_name: text})}
              />
            </View>

            {/* NATIONALITY */}
            <View style={[styles.input_form_wrap, {paddingTop: hp(1)}]}>
              <Text style={styles.text}>Nationality</Text>
              <TextInput
                placeholder='Your Nationality'
                style = {styles.text_input}
                keyboardType='default'
                value={formData.nationality}
                onChangeText={(text) =>
                  setFormData({...formData, nationality: text})}
              />
            </View>

            {/* AGE */}
            <View style={[styles.input_form_wrap, {paddingTop: hp(1)}]}>
              <Text style={styles.text}>Age</Text>
              <TextInput
                placeholder='Your Age'
                style = {styles.text_input}
                keyboardType='numeric'
                value={formData.age}
                onChangeText={(text) => 
                  setFormData({...formData, age: text})}
              />
            </View>

            {/* LANGUAGE */}
            <View style={[styles.input_form_wrap, {paddingTop: hp(1)}]}>
              <Text style={styles.text}>Language</Text>
              <TextInput
                placeholder='Languages You Speak'
                style = {styles.text_input}
                keyboardType='default'
                value= {formData.language}
                onChangeText={(text) => 
                  setFormData({...formData, language: text})}
              />
            </View>
          </View>

          <Text style = {[styles.text, {color: "#A5CBE1", paddingTop: hp(2), fontSize: hp(2.8)}]}>EDUCATION</Text>
          
          <View style = {[styles.form_group, {paddingTop: hp(2)}]}>
            {/* GRADUATION YEAR */}
            <View style={styles.input_form_wrap}>
              <Text style={styles.text}>Grad Year</Text>
              <TextInput
                placeholder='Grad Year'
                style = {styles.text_input}
                keyboardType='numeric'
                value={formData.graduation_year}
                onChangeText={(text) => 
                  setFormData({...formData, graduation_year: text})}
              />
            </View>

            {/* Major Chosen */}
            <View style={[styles.input_form_wrap, {paddingTop: hp(1)}]}>
              <Text style={styles.text}>Major Chosen</Text>
              <TextInput
                placeholder='Your Major Chosen'
                style = {styles.text_input}
                keyboardType='default'
                value={formData.major_chosen}
                onChangeText={(text) => 
                  setFormData({...formData, major_chosen: text})}
              />
            </View>
          </View>


        </View>

        {/* FOOTER SECTION FOR NEXT BUTTON */}
        <View style = {styles.footer}>
          <Pressable onPress ={() => router.push("/log_in_page")}>
            <AntDesign name="leftcircleo" size={hp(5)} color="#A5CBE1"/>
          </Pressable>
          <Pressable onPress ={() => { handleSubmit(); router.push("/(student_sign_up)/page_2") }}>
            <AntDesign name="rightcircleo" size={hp(5)} color="#A5CBE1"/>
          </Pressable>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create ({
  page:{
    flex:1,
    backgroundColor: "#fff",
    height: "100%", 
    paddingHorizontal: 31,
  },

  header:{
    paddingTop: hp(2),
    flex: 0.6,
    alignItems: "center",
  },

  body:{
    flex:2,
    paddingTop: hp(0),
    flexDirection: "column",
    justifyContent: "space-between",
  },

  form_group:{
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

  input_form_wrap:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width:"100%"
  },

  text_input:{
    backgroundColor: "f2f2f2",
    borderRadius: 5,
    width: wp(56),
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
