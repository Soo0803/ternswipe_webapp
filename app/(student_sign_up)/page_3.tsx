import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  useWindowDimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity
} from 'react-native';

import * as React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS
} from "react-native-reanimated";

import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from "expo-router";
import { TextInput } from 'react-native-gesture-handler';
import { isWeb } from '../../utils/platform';

import axios from 'axios';
import { getApiUrl } from '../../utils/apiConfig';

import AppLogo from "../../assets/app_icon/in_app_logo.svg";
import ProgressBar from "../../component/ProgressBar";
import { Ionicons } from "@expo/vector-icons";
import ArrowDown from "../../assets/banner_page/arrow_down_icon.svg";
import { useStudentForm } from '../../context/studentFormContext';

const { height } = Dimensions.get("window");

export default function page_3() {
  const router = useRouter();
  const { formData, setFormData } = useStudentForm(); // ✅ now includes setFormData
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const SWIPE_THRESHOLD = windowHeight * 0.2;

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));


  const handleSubmit = async () => {
    if (!formData.email || !formData.password || !formData.username) {
      Alert.alert("Missing Fields", "Please fill in all required information.");
      router.push("/(student_sign_up)/page_2");
      return;
    }
  
    try {
      const payload = new FormData();
      payload.append("username", formData.username);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
  
      payload.append("given_name", formData.given_name);
      payload.append("middle_name", formData.middle_name);
      payload.append("last_name", formData.last_name);
      payload.append("nationality", formData.nationality);
      payload.append("age", formData.age);
      payload.append("language", formData.language);
      payload.append("graduation_year", formData.graduation_year);
      payload.append("major_chosen", formData.major_chosen);
      payload.append("location", formData.location);
      payload.append("phone_number", formData.phone_number);
  
      // Algorithm-required fields
      payload.append("headline", formData.headline || '');
      payload.append("summary", formData.summary || '');
      payload.append("courses", JSON.stringify(formData.courses || []));
      payload.append("skills", JSON.stringify(formData.skills || []));
      payload.append("skills_text", formData.skills_text || '');
      payload.append("gpa", formData.gpa || '');
      payload.append("hrs_per_week", formData.hrs_per_week || '');
      payload.append("avail_start", formData.avail_start || '');
      payload.append("avail_end", formData.avail_end || '');
      if (formData.reliability) {
        payload.append("reliability", formData.reliability);
      }
  
      if (formData.transcript) {
        payload.append("transcript", formData.transcript as any);
      }
      
      if (formData.resume) {
        payload.append("resume", formData.resume as any);
      }
  
      const res = await axios.post(getApiUrl('api/user/register/student/'), payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log("Submitted successfully:", res.data);
      router.push("/(dashboard)");
    } catch (error: any) {
      console.error("Submission error:", error.response?.data || error.message);
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        const apiUrl = getApiUrl('api/user/register/student/');
        Alert.alert(
          "Connection Error",
          `Cannot connect to backend server.\n\nPlease ensure:\n1. Backend is running\n2. Backend server is started\n3. Server URL: ${apiUrl}\n\nSee backend/README.md for instructions.`
        );
      } else if (error.response) {
        Alert.alert("Submission failed", error.response.data?.detail || error.response.data?.message || "Please check your input and try again.");
      } else {
        Alert.alert("Submission failed", error.message || "Please try again later.");
      }
    }
  };
  
  const handleSwipeSubmit = () => {
    if (isWeb) {
      translateY.value = withTiming(-windowHeight, { duration: 300 }, (finished) => {
        if (finished) {
          handleSubmit();
        }
      });
    } else {
      handleSubmit();
    }
  };

  const swipeUpGesture = !isWeb ? Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      const swipeDistance = event.translationY;
      const swipeVelocity = event.velocityY;
      const shouldNavigate = swipeDistance < -SWIPE_THRESHOLD || swipeVelocity < -1000;

      if (shouldNavigate) {
        translateY.value = withTiming(-windowHeight, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(handleSubmit)(); // ✅ safe JS execution after animation
          }
        });
      } else {
        translateY.value = withSpring(0, { damping: 10 });
      }
    }) : undefined;

  const content = (
    <Animated.View style={[styles.container, cardStyle]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.page}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            <View style={styles.header}>
              <AppLogo />
              <ProgressBar process={1} />
            </View>

            {/* FORM BODY */}
            <View style={styles.body}>
              <Text style={[styles.text, { paddingBottom: hp(2) }]}>FINAL STEP</Text>
              <View style={styles.form_group}>

                {/* Username */}
                <View style={styles.input_form_wrap}>
                  <Text style={styles.text}>Username</Text>
                  <TextInput
                    placeholder='Enter Your Username'
                    style={styles.input_box}
                    value={formData.username || ''}
                    onChangeText={(text) =>
                      setFormData({ ...formData, username: text })
                    }
                  />
                </View>

                {/* Email */}
                <View style={[styles.input_form_wrap, { paddingTop: hp(1) }]}>
                  <Text style={styles.text}>Email</Text>
                  <TextInput
                    placeholder='Enter Your Email'
                    style={styles.input_box}
                    keyboardType='email-address'
                    value={formData.email || ''}
                    onChangeText={(text) =>
                      setFormData({ ...formData, email: text })
                    }
                  />
                </View>

                {/* Password */}
                <View style={[styles.input_form_wrap, { paddingTop: hp(1) }]}>
                  <Text style={styles.text}>Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      placeholder='Enter Your Password'
                      style={styles.passwordInput}
                      keyboardType='default'
                      secureTextEntry={!passwordVisible}
                      value={formData.password || ''}
                      onChangeText={(text) =>
                        setFormData({ ...formData, password: text })
                      }
                    />
                    <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                      <Ionicons
                        name={passwordVisible ? "eye-off" : "eye"}
                        size={20}
                        color="gray"
                        style={{ marginLeft: 8 }}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              {isWeb ? (
                <TouchableOpacity onPress={handleSwipeSubmit} style={[styles.swipe_up_container, { cursor: 'pointer' }]}>
                  <Text style={styles.swipe_up_text}>CLICK TO FINISH REGISTRATION</Text>
                  <ArrowDown style={styles.arrow_down} width={25} height={25} />
                </TouchableOpacity>
              ) : (
                <View style={styles.swipe_up_container}>
                  <Text style={styles.swipe_up_text}>SWIPE UP TO FINISH REGISTRATION</Text>
                  <ArrowDown style={styles.arrow_down} width={25} height={25} />
                </View>
              )}
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
    </Animated.View>
  );

  if (isWeb || !swipeUpGesture) {
    return content;
  }

  return (
    <GestureDetector gesture={swipeUpGesture}>
      {content}
    </GestureDetector>
  );
}


const styles = StyleSheet.create({
  container:{
    overflow: "hidden",
    //flex: 1,
  },

  page:{
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 31,
    backgroundColor: "#fff",
    height: "100%",
  },

  header:{
    paddingTop: hp(2),
    flex: 0.8,
    alignItems: "center",
  },

  body:{
    flex:1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent:"flex-start",
  },

  footer:{
    paddingTop: hp(10),
    alignItems: "center",
    justifyContent: "center",
    flex:0.3,
  },

  text:{
    fontFamily: "Inter-Regular",
  },

  form_group:{
    flexDirection: "column",
    justifyContent: "space-between",
  },

  input_form_wrap:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width:"100%",
  },

  input_box:{
    height: hp(5),
    //flex: 0.9,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    width: wp(56),
    paddingHorizontal: 10,
    paddingVertical: 0,
  },

  passwordInputContainer:{
    height: hp(5),
    //flex:0.9,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 8,
    width: wp(56),
  },

  passwordInput:{
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontFamily: "Inter-Regular",
    textAlign: "left",
  },

  swipe_up_container:{
    flexDirection: "column",
    //justifyContent: "center",
    alignItems: "center",
    paddingTop: hp(2),
    borderRadius: 8,
    width: wp(80),
    height: hp(10),
    backgroundColor: "#A5CBE1",
  },

  arrow_down:{
    overflow: "hidden",
  },

  swipe_up_text:{
    fontFamily: "Inter-Regular",
    textAlign: "center",
    fontSize:12,
  },
});
