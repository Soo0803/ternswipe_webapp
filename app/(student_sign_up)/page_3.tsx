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
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import * as React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';
import { isWeb } from '../../utils/platform';

import axios from 'axios';
import { getApiUrl } from '../../utils/apiConfig';

import AppLogo from '../../assets/app_icon/in_app_logo.svg';
import ProgressBar from '../../component/ProgressBar';
import { Ionicons } from '@expo/vector-icons';
import ArrowDown from '../../assets/banner_page/arrow_down_icon.svg';
import { useStudentForm } from '../../context/studentFormContext';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { palette, radii, shadows } from '../../constants/theme';
import { getFontSize, getPadding } from '../../utils/responsive';

const { height } = Dimensions.get("window");

const credentialHighlights = [
  'Create a username professors and peers will recognize.',
  'Use an academic email so we can verify your enrollment quickly.',
  'Set a secure password to keep your research conversations protected.',
];

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

  if (isWeb) {
    return (
      <WebsiteLayout showHeader>
        <View style={styles.webPage}>
          <View style={styles.webShell}>
            <View style={styles.webIntro}>
              <View style={styles.webBadge}>
                <Text style={styles.webBadgeText}>Student onboarding</Text>
              </View>
              <Text style={styles.webTitle}>Finish your secure account setup.</Text>
              <Text style={styles.webSubtitle}>
                Use your academic contact details so professors can trust the match requests you send.
              </Text>
              <View style={styles.webList}>
                {credentialHighlights.map((item) => (
                  <View key={item} style={styles.webListItem}>
                    <Ionicons name="checkmark-circle" size={18} color={palette.primary} />
                    <Text style={styles.webListText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.webFormCard}>
              <View style={styles.webProgressHeader}>
                <View style={styles.webProgressRow}>
                  <Text style={styles.webProgressTitle}>Student Registration</Text>
                  <Text style={styles.webProgressStep}>Step 4 of 4</Text>
                </View>
                <Text style={styles.webProgressSubtitle}>Account credentials</Text>
                <ProgressBar process={1} />
              </View>

              <ScrollView
                contentContainerStyle={styles.webFormContent}
                showsVerticalScrollIndicator={false}
              >
                <FormField
                  label="Username"
                  placeholder="Choose a username"
                  value={formData.username || ''}
                  onChangeText={(text) => setFormData({ ...formData, username: text })}
                  fullWidth
                  required
                />

                <FormField
                  label="Email"
                  placeholder="Enter your academic email"
                  keyboardType="email-address"
                  value={formData.email || ''}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  fullWidth
                  required
                />

                <View style={styles.webPasswordContainer}>
                  <FormField
                    label="Password"
                    placeholder="Create a secure password"
                    secureTextEntry={!passwordVisible}
                    value={formData.password || ''}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    fullWidth
                    required
                  />
                  <Pressable
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style={styles.webEyeIcon}
                  >
                    <Ionicons
                      name={passwordVisible ? 'eye-off' : 'eye'}
                      size={22}
                      color={palette.textSubtle}
                    />
                  </Pressable>
                </View>

                <View style={styles.webHelper}>
                  <Text style={styles.webHelperText}>
                    Password must be at least 8 characters. Keep this private to protect your matches.
                  </Text>
                </View>

                <View style={styles.webButtonGroup}>
                  <Button
                    title="Back to profile details"
                    variant="outline"
                    onPress={() => router.push('/(student_sign_up)/page_4')}
                    style={styles.webBackButton}
                  />
                  <Button
                    title="Create account"
                    onPress={handleSubmit}
                    style={styles.webSubmitButton}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </WebsiteLayout>
    );
  }

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
    flex: 1,
  },
  webPage:{
    width: '100%',
    minHeight: '100vh' as any,
    paddingVertical: getPadding(96),
    paddingHorizontal: getPadding(56),
  },
  webShell:{
    width: '100%',
    maxWidth: 1440,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    gap: getPadding(64),
    alignItems: 'flex-start',
  },
  webIntro:{
    flex: 1,
    maxWidth: 520,
    gap: getPadding(24),
  },
  webBadge:{
    alignSelf: 'flex-start',
    paddingVertical: getPadding(6),
    paddingHorizontal: getPadding(14),
    backgroundColor: palette.primarySoft,
    borderRadius: radii.pill,
  },
  webBadgeText:{
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: palette.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  webTitle:{
    fontSize: getFontSize(38),
    fontWeight: '700',
    color: palette.text,
    lineHeight: getFontSize(48),
    fontFamily: 'Inter-Regular',
  },
  webSubtitle:{
    fontSize: getFontSize(18),
    color: palette.textMuted,
    lineHeight: getFontSize(28),
    fontFamily: 'Inter-Regular',
  },
  webList:{
    gap: getPadding(14),
  },
  webListItem:{
    flexDirection: 'row',
    gap: getPadding(12),
    alignItems: 'flex-start',
  },
  webListText:{
    flex: 1,
    fontSize: getFontSize(15),
    color: palette.textMuted,
    lineHeight: getFontSize(24),
    fontFamily: 'Inter-Regular',
  },
  webFormCard:{
    flex: 1,
    maxWidth: 640,
    width: '100%',
    backgroundColor: palette.surface,
    borderRadius: radii.xl,
    padding: getPadding(40),
    borderWidth: 1,
    borderColor: palette.border,
    ...(shadows.md as any),
  },
  webProgressHeader:{
    gap: getPadding(12),
    marginBottom: getPadding(24),
  },
  webProgressRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  webProgressTitle:{
    fontSize: getFontSize(28),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
  },
  webProgressStep:{
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.textSubtle,
  },
  webProgressSubtitle:{
    fontSize: getFontSize(16),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  webFormContent:{
    paddingBottom: getPadding(12),
    gap: getPadding(20),
  },
  webPasswordContainer:{
    position: 'relative',
    width: '100%',
  },
  webEyeIcon:{
    position: 'absolute',
    right: getPadding(16),
    top: getPadding(40),
    zIndex: 10,
  },
  webHelper:{
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.lg,
    padding: getPadding(16),
    borderWidth: 1,
    borderColor: palette.border,
  },
  webHelperText:{
    fontSize: getFontSize(13),
    color: palette.textSubtle,
    lineHeight: getFontSize(20),
  },
  webButtonGroup:{
    flexDirection: 'row',
    gap: getPadding(12),
    marginTop: getPadding(12),
  },
  webBackButton:{
    flex: 1,
  },
  webSubmitButton:{
    flex: 1,
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
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    width: wp(56),
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  passwordInputContainer:{
    height: hp(5),
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
