import { 
  View, 
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';

import { TextInput } from 'react-native-gesture-handler';
import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCompanyForm } from '../../context/companyFormContext';

// Import components and assets
import AppLogo from "../../assets/app_icon/in_app_logo.svg";
import ProgressBar from "../../component/ProgressBar";

export default function index() {
  const router = useRouter();

  // State hooks to store user input
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const { formData, setFormData } = useCompanyForm();

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={hp(3)}
      >
        <ScrollView contentContainerStyle = {{ flexGrow: 1, paddingBottom: hp(10)}} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <AppLogo/>
            <ProgressBar process={0.35}/>
            <Text style={[styles.text, {paddingTop: hp(1), paddingBottom: hp(1), color: "#A5CBE1"}]}>YOUR RELEVANCE</Text>
          </View>

          <View style={styles.body}> 
              <View style={styles.input_form_wrap}>
                <Text style={styles.text}>Name </Text>
                <TextInput
                  placeholder="Enter Professor's Name"
                  style = {styles.input_text}
                  keyboardType='default'
                  value={formData.professor_name}
                  onChangeText={(text) => setFormData({ ...formData, professor_name: text })}
                />
              </View>

              
              <View style={styles.input_form_wrap}>
                <Text style={styles.text}>University</Text>
                <TextInput
                  placeholder="Enter University Name"
                  style = {styles.input_text}
                  keyboardType='default'
                  value={formData.university}
                  onChangeText={(text) => setFormData({ ...formData, university: text })}
                />
              </View>

              <Text style={styles.company_description}>Description</Text>
              <TextInput
                placeholder='Enter Research/Project Description'
                style = {styles.input_text_company_description}
                keyboardType='default'
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />
          </View>

  {/* FOOTER SECTION FOR GOING TO THE NEXT AND PREVIOUS PAGE */}
          <View style = {styles.footer}>
          <Pressable onPress ={() => router.push("/log_in_page")}>
            <AntDesign name="leftcircleo" size={hp(5)} color="#A5CBE1"/>
          </Pressable>
            <Pressable onPress ={() => { router.push("/(company_sign_up)/page_2"); }}>
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
  flex: 1,
  backgroundColor: "#fff",
  height: "100%",
  paddingHorizontal: 31,
},

header:{
  paddingTop: hp(3),
  flex: 0.6,
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
  flex:0.5,
  paddingTop: hp(3),
},

text: {
  fontFamily: "Inter-Regular",
},

input_form_wrap:{
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: hp(1),
  width: "100%",
},

input_text:{
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

company_description:{
  width:"100%",
  textAlign: "left",
  fontFamily: "Inter-Regular",
  paddingTop: hp(2),
},

input_text_company_description:{
  backgroundColor: "#f2f2f2",
  borderRadius: 5,
  width: "100%",
  height: hp(20),
  fontFamily: "Inter-Regular",
  alignItems: "center",
  textAlign: "left",
}

});