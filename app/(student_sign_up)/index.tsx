import {  
  View,
  Text, 
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Pressable,
} from 'react-native';

import React from 'react';

import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { getFontSize, getPadding, getMaxWidth } from "../../utils/responsive";
import { isWeb } from "../../utils/platform";

// import components and assets
import AppLogo from "../../assets/app_icon/in_app_logo.svg";
import ProgressBar from "../../component/ProgressBar";
import ProfileImage from "../../component/ProfileImagePicker";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useStudentForm } from "../../context/studentFormContext";
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { FormContainer } from '../../components/FormContainer';
import { FormField } from '../../components/FormField';
import { FormRow } from '../../components/FormRow';
import { Button } from '../../components/Button';

export default function index () {
  const router = useRouter();

  // State hooks to store user input
  const { formData, setFormData } = useStudentForm();

  const handleSubmit = () => {
    router.push("/(student_sign_up)/page_2");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <WebsiteLayout showHeader={isWeb}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={hp(3)}
          style={{ flex: 1, width: '100%' }}
        >
          {!isWeb && (
            <SafeAreaView>
              <StatusBar barStyle="dark-content"/>
            </SafeAreaView>
          )}
          
          <View style={styles.content}>
            <View style={styles.header}>
              {!isWeb && <AppLogo width={65} height={65}/>}
              <ProgressBar process={0.25}/>
              <Text style={styles.sectionTitle}>Student Registration</Text>
              <Text style={styles.sectionSubtitle}>Step 1 of 4: Personal Information</Text>
            </View>

            <FormContainer>

                <View style={styles.profileSection}>
                  <ProfileImage/>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.sectionLabel}>Basic Information</Text>
                  <FormRow>
                    <FormField
                      label="Given Name"
                      placeholder="Enter your given name"
                      value={formData.given_name}
                      onChangeText={(text) => setFormData({...formData, given_name: text})}
                      required
                    />
                    <FormField
                      label="Last Name"
                      placeholder="Enter your last name"
                      value={formData.last_name}
                      onChangeText={(text) => setFormData({...formData, last_name: text})}
                      required
                    />
                  </FormRow>

                  <FormRow>
                    <FormField
                      label="Middle Name"
                      placeholder="(Optional)"
                      value={formData.middle_name}
                      onChangeText={(text) => setFormData({...formData, middle_name: text})}
                    />
                    <FormField
                      label="Age"
                      placeholder="Your age"
                      value={formData.age}
                      onChangeText={(text) => setFormData({...formData, age: text})}
                      keyboardType="numeric"
                      required
                    />
                  </FormRow>

                  <FormRow>
                    <FormField
                      label="Nationality"
                      placeholder="Your nationality"
                      value={formData.nationality}
                      onChangeText={(text) => setFormData({...formData, nationality: text})}
                      required
                    />
                    <FormField
                      label="Languages"
                      placeholder="Languages you speak"
                      value={formData.language}
                      onChangeText={(text) => setFormData({...formData, language: text})}
                      required
                    />
                  </FormRow>

                  <View style={styles.educationSection}>
                    <Text style={styles.sectionLabel}>Education</Text>
                    <FormRow>
                      <FormField
                        label="Graduation Year"
                        placeholder="Expected graduation year"
                        value={formData.graduation_year}
                        onChangeText={(text) => setFormData({...formData, graduation_year: text})}
                        keyboardType="numeric"
                        required
                      />
                      <FormField
                        label="Major"
                        placeholder="Your major"
                        value={formData.major_chosen}
                        onChangeText={(text) => setFormData({...formData, major_chosen: text})}
                        required
                      />
                    </FormRow>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    title="Back"
                    onPress={() => router.push("/log_in_page")}
                    variant="outline"
                    style={styles.backButton}
                  />
                  <Button
                    title="Continue"
                    onPress={() => {
                      handleSubmit();
                      router.push("/(student_sign_up)/page_2");
                    }}
                    style={styles.nextButton}
                  />
                </View>
            </FormContainer>
          </View>
        </KeyboardAvoidingView>
      </WebsiteLayout>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: 900,
    marginHorizontal: 'auto',
  },
  header: {
    alignItems: 'center',
    marginBottom: getPadding(32),
    width: '100%',
    paddingTop: isWeb ? 0 : getPadding(20),
  },
  sectionTitle: {
    fontSize: getFontSize(28),
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: getPadding(24),
    marginBottom: getPadding(8),
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: getFontSize(14),
    color: '#666',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: getPadding(32),
  },
  formSection: {
    width: '100%',
  },
  sectionLabel: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: '#7da0ca',
    marginBottom: getPadding(16),
    marginTop: getPadding(8),
    fontFamily: 'Inter-Regular',
  },
  educationSection: {
    marginTop: getPadding(24),
    paddingTop: getPadding(24),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  buttonContainer: {
    flexDirection: isWeb ? 'row' : 'column',
    justifyContent: 'space-between',
    marginTop: getPadding(32),
    gap: getPadding(12),
  },
  backButton: {
    flex: isWeb ? 1 : undefined,
    marginBottom: isWeb ? 0 : getPadding(12),
  },
  nextButton: {
    flex: isWeb ? 1 : undefined,
  },
});
