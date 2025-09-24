import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  useWindowDimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
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
import axios from 'axios';

import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';

// Import components and assets
import AppLogo from '../../assets/app_icon/in_app_logo.svg';
import ProgressBar from '../../component/ProgressBar';
import { Ionicons } from '@expo/vector-icons';
import ArrowDown from '../../assets/banner_page/arrow_down_icon.svg';
import { useCompanyForm } from '../../context/companyFormContext';

const { height: screenHeight } = Dimensions.get('window');

export default function CompanyPage3() {
  const router = useRouter();
  const { formData, setFormData } = useCompanyForm();
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const SWIPE_THRESHOLD = windowHeight * 0.2;

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      Alert.alert('Missing Fields', 'Please complete all required fields.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('username', formData.username);
      payload.append('email', formData.email);
      payload.append('password', formData.password);

      // Use canonical professor keys
      payload.append('professor_name', formData.professor_name);
      payload.append('university', formData.university);
      payload.append('description', formData.description);
      // Position description now moved inside projects; keep if needed for compatibility
      if (formData.position_description) payload.append('position_description', formData.position_description);

      if (formData.team_image) payload.append('profile_image', formData.team_image);
      if (formData.lab_first_image) payload.append('lab_first_image', formData.lab_first_image);
      if (formData.lab_second_image) payload.append('lab_second_image', formData.lab_second_image);
      if (formData.lab_third_image) payload.append('lab_third_image', formData.lab_third_image);

      // Include projects as JSON
      try {
        const projectsJson = JSON.stringify(formData.projects || []);
        payload.append('projects', projectsJson);
      } catch (e) {}

      // 192.168.10.15 (home ip address)
      // 192.168.0.118 (msia home ip address)
      // 172.20.10.3 (phone data ip address)
      // 192.168.0.104 (taiping home ip address)
      const res = await axios.post('http://localhost:8000/api/user/register/professor/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Submitted successfully:', res.data);
      router.push('/(dashboard)');
    } catch (error: any) {
      console.error('Submission error:', error.response?.data || error.message);
      Alert.alert('Submission Failed', 'Please try again later.');
    }
  };

  const swipeUpGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      const shouldNavigate = event.translationY < -SWIPE_THRESHOLD || event.velocityY < -1000;
      if (shouldNavigate) {
        translateY.value = withTiming(-windowHeight, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(handleSubmit)();
          }
        });
      } else {
        translateY.value = withSpring(0, { damping: 10 });
      }
    });

  return (
    <GestureDetector gesture={swipeUpGesture}>
      <Animated.View style={[styles.container, cardStyle]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.page}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
              <AppLogo />
              <ProgressBar process={1} />
            </View>

            <View style={styles.body}>
              <Text style={[styles.text, { paddingBottom: hp(2) }]}>FINAL STEP</Text>
              <View style={styles.form_group}>
                <View style={styles.input_form_wrap}>
                  <Text style={styles.text}>Username</Text>
                  <TextInput
                    placeholder="Enter Your Username"
                    style={styles.input_box}
                    value={formData.username || ''}
                    onChangeText={(text) => setFormData({ ...formData, username: text })}
                  />
                </View>

                <View style={[styles.input_form_wrap, { paddingTop: hp(1) }]}>
                  <Text style={styles.text}>Email</Text>
                  <TextInput
                    placeholder="Enter Your Email"
                    style={styles.input_box}
                    keyboardType="email-address"
                    value={formData.email || ''}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                  />
                </View>

                <View style={[styles.input_form_wrap, { paddingTop: hp(1) }]}>
                  <Text style={styles.text}>Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      placeholder="Enter Your Password"
                      style={styles.passwordInput}
                      secureTextEntry={!passwordVisible}
                      value={formData.password || ''}
                      onChangeText={(text) => setFormData({ ...formData, password: text })}
                    />
                    <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                      <Ionicons
                        name={passwordVisible ? 'eye-off' : 'eye'}
                        size={20}
                        color="gray"
                        style={{ marginLeft: 8 }}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.swipe_up_container}>
                <Text style={styles.swipe_up_text}>SWIPE UP TO FINISH REGISTRATION</Text>
                <ArrowDown style={styles.arrow_down} width={25} height={25} />
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: hp(2),
  },
  body: {
    flex: 1,
    paddingHorizontal: wp(8),
  },
  text: {
    fontSize: hp(2),
    fontWeight: '600',
  },
  input_form_wrap: {
    marginBottom: hp(2),
  },
  input_box: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  form_group: {
    marginTop: hp(2),
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
  },
  swipe_up_container: {
    alignItems: 'center',
  },
  swipe_up_text: {
    fontSize: hp(1.8),
    color: '#999',
    marginBottom: 5,
  },
  arrow_down: {
    marginTop: 5,
  },
});