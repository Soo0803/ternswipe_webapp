import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  StatusBar,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiUrl } from '../utils/apiConfig';
import { isWeb } from '../utils/platform';
import { getFontSize, getPadding, getMaxWidth } from '../utils/responsive';

import AppLogo from "./../assets/app_icon/in_app_logo.svg";
import { TextInput } from 'react-native-gesture-handler';
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { WebsiteLayout } from '../components/WebsiteLayout';
import { FormContainer } from '../components/FormContainer';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';

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
        getApiUrl("api/user/login/"),
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
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        console.error("Network/connection error:", error.message);
        const apiUrl = getApiUrl("api/user/login/");
        alert(`Cannot connect to backend server.\n\nPlease ensure:\n1. Backend is running on ${apiUrl}\n2. Backend server is started (see backend/README.md)\n3. CORS is enabled for web connections`);
      } else {
        console.error("Network/other error:", error.message);
        alert(`Network error: ${error.message}\n\nPlease check if backend is running.`);
      }
    }
  };
  // Wei Jie update to connect API 

  const content = (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <WebsiteLayout showHeader={isWeb}>
        <View style={styles.content}>
          {!isWeb && (
            <SafeAreaView>
              <StatusBar barStyle="dark-content"/>
              <Pressable onPress={() => router.push("/")} style={styles.mobileLogoContainer}>
                <AppLogo width={65} height={65}/>
              </Pressable>
            </SafeAreaView>
          )}
          
          <FormContainer>
            <View style={styles.formHeader}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Enter your credentials to access your account</Text>
            </View>

              <View style={styles.form}>
                <FormField
                  label="Email or Username"
                  placeholder="Enter your email or username"
                  value={username}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  required
                  fullWidth
                />

                <View style={styles.passwordContainer}>
                  <FormField
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    required
                    fullWidth
                    containerStyle={styles.passwordField}
                  />
                  <Pressable 
                    onPress={() => setPassWordVisible(!passwordVisible)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={passwordVisible ? "eye-off" : "eye"}
                      size={22}
                      color="#666"
                    />
                  </Pressable>
                </View>

                <View style={styles.forgotPasswordContainer}>
                  <Pressable>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                  </Pressable>
                  <Pressable>
                    <Text style={styles.forgotPassword}>Forgot username?</Text>
                  </Pressable>
                </View>

                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  fullWidth
                  style={styles.loginButton}
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Button
                  title="Register as Student"
                  onPress={() => router.push("/(student_sign_up)")}
                  variant="outline"
                  fullWidth
                  style={styles.registerButton}
                />

                <Button
                  title="Register as Professor"
                  onPress={() => router.push("/(company_sign_up)")}
                  variant="outline"
                  fullWidth
                  style={styles.registerButton}
                />
              </View>
            </FormContainer>
          </View>
      </WebsiteLayout>
    </TouchableWithoutFeedback>
  );

  return content;
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: 500,
    marginHorizontal: 'auto',
    paddingVertical: isWeb ? getPadding(60) : getPadding(20),
  },
  mobileLogoContainer: {
    alignSelf: 'center',
    marginBottom: getPadding(20),
    paddingTop: getPadding(20),
  },
  formHeader: {
    marginBottom: getPadding(32),
    textAlign: 'center',
  },
  title: {
    fontSize: getFontSize(32),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: getPadding(12),
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: getFontSize(16),
    color: '#666',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: getFontSize(24),
  },
  form: {
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordField: {
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: getPadding(16),
    top: getPadding(36),
    zIndex: 10,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getPadding(24),
    marginTop: getPadding(-8),
  },
  forgotPassword: {
    fontSize: getFontSize(13),
    color: '#7da0ca',
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginBottom: getPadding(16),
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: getPadding(24),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: getPadding(16),
    fontSize: getFontSize(12),
    color: '#999',
    fontFamily: 'Inter-Regular',
  },
  registerButton: {
    marginBottom: getPadding(12),
  },
});