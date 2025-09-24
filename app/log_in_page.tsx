import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  View, 
  Dimensions, 
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for token

import * as React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
// import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppLogo from "./../assets/app_icon/in_app_logo.svg";
import { TextInput } from 'react-native-gesture-handler';
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// SplashScreen.setOptions({
//   duration: 1000, // Match this with your transition duration
//   fade: true,
// });

const {height, width} = Dimensions.get("window");

export default function log_in_page() {
  const router = useRouter();
  const [passwordVisible, setPassWordVisible] = React.useState(false); //allow password to be visible or not

  // Wei Jie update to connect API 
  // State for input fields 
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login
  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both email/username and password");
      return;
    }
  
    try {
      const payload = {
        username: username,   // backend accepts username or email here
        password: password,
      };
  
      console.log("Login payload:", payload);
  
      const response = await axios.post(
        "http://localhost:8000/api/user/login/",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const token = response.data.token;
      console.log("Login successful. Token:", token);
  
      await AsyncStorage.setItem("auth_token", token);
  
      router.push("/(dashboard)");
    } catch (error: any) {
      if (error.response) {
        console.error(
          "Backend responded:",
          error.response.status,
          error.response.data
        );
        alert(
          `Login failed: ${
            error.response.data.detail || "Unauthorized (check credentials)"
          }`
        );
      } else {
        console.error("Network/other error:", error.message);
        alert("Network error — check if backend is running on localhost:8000");
      }
    }
  };
  // Wei Jie update to connect API 

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style = {styles.log_in_page}>
        <StatusBar barStyle="dark-content"/>
        <Pressable onPress={() => router.push("/")}>
          <AppLogo width={65} height={65}/>
        </Pressable>

        <View style={styles.log_in_form}>
          <View style={styles.input_form}>
            <Text style={styles.text}>Phone No./Email</Text>
              <TextInput
                placeholder='Enter Your Phone No./Email'
                style={styles.inputBox}
                keyboardType='email-address'
                value={username}
                onChangeText={setEmail}
              />
          </View>

          <View style={styles.input_form}>
            <Text style={styles.text}>Password</Text>
            <View style= {styles.passwordInputContainer}>
              <TextInput
                placeholder='Enter Your Password'
                style={styles.passwordInput}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setPassWordVisible(!passwordVisible)}>
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="gray"
                  style={{marginLeft: 8}}
                  />
              </Pressable>
            </View>
          </View>
          

          <View style={styles.link_click}>
            <Pressable>
              <Text style={styles.link_text}>Forgot password?</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.link_text}>Forgot username?</Text>
            </Pressable>
          </View>

          {/* Previous version */}
          {/* <Pressable style={styles.button} onPress={() => router.push("/(dashboard)")}>
            <Text style={(styles.buttonText)}>LOG IN</Text>
          </Pressable> */}
          {/* Previous version */}

          {/* Wei Jie update to connect API */}
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </Pressable>
          {/* Wei Jie update to connect API */}

          <Pressable style={styles.button} onPress={() => router.push("/(student_sign_up)")}>
            <Text style={(styles.buttonText)}>NEW REGISTER FOR STUDENT</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => router.push("/(company_sign_up)")}>
            <Text style={(styles.buttonText)}>NEW REGISTER FOR PROFESSOR</Text>
          </Pressable>

        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({

  log_in_page:{
    flex: 1,
    backgroundColor : "#fff",
    alignItems: "center",
    justifyContent: "center",

  },

  log_in_form:{
    width: wp(100),
    gap: 10,
    paddingHorizontal: 31,
    top: 20,
  },

  input_form:{
    flexDirection: "row",
    justifyContent: "center",
    gap:2,
    alignItems: "center",
  },

  text: {
    width: wp(20),
    fontFamily: "Inter-Regular",
  },

  inputBox: {
    backgroundColor: "light-grey",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 2,
    textAlign: "center",
    flex: 1,
    fontFamily: "Inter-Regular",
  },

  link_click:{
    flexDirection: "row",
    justifyContent: "space-between",
    //marginVertical: hp(2),
  },

  link_text:{
    fontFamily: "Inter-Regular",
    color: "#7da0ca",
    fontSize: 11,
    textDecorationLine: "underline",
  },

  button:{
    backgroundColor: "#7da0ca",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText:{
    textAlign: "center",
    fontFamily: "Inter-Regular",
    color: "#fff",
  },

  passwordInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  
  passwordInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontFamily: "Inter-Regular",
    textAlign: "center"
  },
});