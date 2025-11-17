import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { WebsiteLayout } from '../../components/WebsiteLayout';
import { FormField } from '../../components/FormField';
import { FormRow } from '../../components/FormRow';
import { Button } from '../../components/Button';
import ProfileImage from '../../component/ProfileImagePicker';
import UploadFileButton from '../../component/UploadFileButton';
import SkillSelector from '../../component/SkillSelector';
import CourseInput from '../../component/CourseInput';
import { useStudentForm } from '../../context/studentFormContext';
import { signUpStudent } from '../../services/supabaseAuth';
import { getFontSize, getPadding } from '../../utils/responsive';
import { palette, radii, shadows } from '../../constants/theme';
import { isWeb } from '../../utils/platform';
import { Ionicons } from '@expo/vector-icons';

export default function StudentSignUp() {
  const router = useRouter();
  const { formData, setFormData } = useStudentForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || !formData.password || !formData.given_name || !formData.last_name) {
      Alert.alert('Missing fields', 'Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);

      const { user, session } = await signUpStudent({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profileData: {
          given_name: formData.given_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          nationality: formData.nationality,
          age: formData.age,
          language: formData.language,
          graduation_year: formData.graduation_year,
          major_chosen: formData.major_chosen,
          location: formData.location,
          phone_number: formData.phone_number,
          headline: formData.headline,
          summary: formData.summary,
          courses: formData.courses || [],
          skills: formData.skills || [],
          skills_text: formData.skills_text,
          gpa: formData.gpa,
          hrs_per_week: formData.hrs_per_week,
          avail_start: formData.avail_start,
          avail_end: formData.avail_end,
          reliability: formData.reliability,
          transcript: formData.transcript,
          resume: formData.resume,
          profile_image: formData.profile_image,
        },
      });

      await AsyncStorage.multiSet([
        ['auth_token', session.access_token],
        ['auth_user', JSON.stringify(user)],
      ]);

      router.replace('/(dashboard)');
    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert('Submission failed', error.message || 'Please check your input and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formContent = (
    <ScrollView
      contentContainerStyle={styles.formScrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.profileSection}>
        <ProfileImage
          onImageSelected={(file) => setFormData({ ...formData, profile_image: file })}
        />
      </View>

      <Text style={styles.sectionTitle}>Personal Information</Text>
      <FormRow>
        <FormField
          label="Given Name"
          placeholder="First name"
          value={formData.given_name}
          onChangeText={(text) => setFormData({ ...formData, given_name: text })}
          required
        />
        <FormField
          label="Last Name"
          placeholder="Last name"
          value={formData.last_name}
          onChangeText={(text) => setFormData({ ...formData, last_name: text })}
          required
        />
      </FormRow>

      <FormRow>
        <FormField
          label="Middle Name"
          placeholder="Optional"
          value={formData.middle_name}
          onChangeText={(text) => setFormData({ ...formData, middle_name: text })}
        />
        <FormField
          label="Age"
          placeholder="Age"
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          keyboardType="numeric"
        />
      </FormRow>

      <FormRow>
        <FormField
          label="Nationality"
          placeholder="Nationality"
          value={formData.nationality}
          onChangeText={(text) => setFormData({ ...formData, nationality: text })}
        />
        <FormField
          label="Languages"
          placeholder="Languages"
          value={formData.language}
          onChangeText={(text) => setFormData({ ...formData, language: text })}
        />
      </FormRow>

      <Text style={styles.sectionTitle}>Education</Text>
      <FormRow>
        <FormField
          label="Graduation Year"
          placeholder="Year"
          value={formData.graduation_year}
          onChangeText={(text) => setFormData({ ...formData, graduation_year: text })}
          keyboardType="numeric"
        />
        <FormField
          label="Major"
          placeholder="Major"
          value={formData.major_chosen}
          onChangeText={(text) => setFormData({ ...formData, major_chosen: text })}
        />
      </FormRow>

      <Text style={styles.sectionTitle}>Contact</Text>
      <FormField
        label="Location"
        placeholder="Preferred location"
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
        fullWidth
      />
      <FormField
        label="Phone Number"
        placeholder="Phone number"
        value={formData.phone_number}
        onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
        keyboardType="phone-pad"
        fullWidth
      />

      <Text style={styles.sectionTitle}>Documents</Text>
      <View style={styles.uploadRow}>
        <Text style={styles.uploadLabel}>Transcript</Text>
        <UploadFileButton
          onFileSelected={(file) => setFormData({ ...formData, transcript: file })}
          label={formData.transcript ? 'Replace' : 'Upload'}
        />
      </View>
      <View style={styles.uploadRow}>
        <Text style={styles.uploadLabel}>Resume</Text>
        <UploadFileButton
          onFileSelected={(file) => setFormData({ ...formData, resume: file })}
          label={formData.resume ? 'Replace' : 'Upload'}
        />
      </View>

      <Text style={styles.sectionTitle}>Professional Profile</Text>
      <FormField
        label="Headline"
        placeholder="Brief professional headline"
        value={formData.headline}
        onChangeText={(text) => setFormData({ ...formData, headline: text })}
        fullWidth
      />
      <FormField
        label="Summary"
        placeholder="Describe your background and goals"
        multiline
        numberOfLines={4}
        value={formData.summary}
        onChangeText={(text) => setFormData({ ...formData, summary: text })}
        fullWidth
        style={styles.textArea}
      />
      <SkillSelector
        selectedSkills={formData.skills}
        onSkillsChange={(skills) => setFormData({ ...formData, skills })}
        label="Skills"
      />
      <CourseInput
        courses={formData.courses}
        onCoursesChange={(courses) => setFormData({ ...formData, courses })}
        label="Relevant Courses"
      />
      <FormRow>
        <FormField
          label="GPA"
          placeholder="GPA"
          keyboardType="decimal-pad"
          value={formData.gpa}
          onChangeText={(text) => setFormData({ ...formData, gpa: text })}
        />
        <FormField
          label="Hours/Week"
          placeholder="Hours"
          keyboardType="numeric"
          value={formData.hrs_per_week}
          onChangeText={(text) => setFormData({ ...formData, hrs_per_week: text })}
        />
      </FormRow>
      <FormRow>
        <FormField
          label="Start Date"
          placeholder="YYYY-MM-DD"
          value={formData.avail_start}
          onChangeText={(text) => setFormData({ ...formData, avail_start: text })}
        />
        <FormField
          label="End Date"
          placeholder="YYYY-MM-DD"
          value={formData.avail_end}
          onChangeText={(text) => setFormData({ ...formData, avail_end: text })}
        />
      </FormRow>

      <Text style={styles.sectionTitle}>Account Credentials</Text>
      <FormField
        label="Username"
        placeholder="Choose a username"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
        required
        fullWidth
      />
      <FormField
        label="Email"
        placeholder="Your email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        required
        fullWidth
      />
      <View style={styles.passwordContainer}>
        <FormField
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry={!passwordVisible}
          required
          fullWidth
          containerStyle={styles.passwordField}
        />
        <Pressable onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <Ionicons
            name={passwordVisible ? 'eye-off' : 'eye'}
            size={22}
            color={palette.textSubtle}
          />
        </Pressable>
      </View>

      <View style={styles.buttonGroup}>
        <Button
          title="Back to sign in"
          variant="outline"
          onPress={() => router.push('/log_in_page')}
          style={styles.backButton}
        />
        <Button
          title={submitting ? 'Creating account...' : 'Create account'}
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={submitting}
        />
      </View>
    </ScrollView>
  );

  const webView = (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.title}>Student Registration</Text>
        {formContent}
      </View>
    </View>
  );

  const mobileView = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mobileFlex}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.mobileSafe}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.mobileHeader}>
            <Text style={styles.mobileTitle}>Student Registration</Text>
          </View>
          {formContent}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

  return (
    <WebsiteLayout showHeader={isWeb}>
      {isWeb ? webView : mobileView}
    </WebsiteLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    ...(isWeb ? { minHeight: '100vh' as any } : { flex: 1 }),
    paddingVertical: isWeb ? getPadding(48) : getPadding(20),
    paddingHorizontal: isWeb ? getPadding(80) : getPadding(24),
  },
  content: {
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: getFontSize(42),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
    marginBottom: getPadding(40),
  },
  formScrollContent: {
    paddingBottom: getPadding(12),
    gap: getPadding(20),
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: getPadding(8),
  },
  sectionTitle: {
    fontSize: getFontSize(24),
    fontWeight: '600',
    color: palette.primary,
    marginTop: getPadding(24),
    marginBottom: getPadding(16),
    fontFamily: 'Inter-Regular',
  },
  uploadRow: {
    marginBottom: getPadding(16),
  },
  uploadLabel: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
    marginBottom: getPadding(12),
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
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
  buttonGroup: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: getPadding(12),
    marginTop: getPadding(24),
  },
  backButton: {
    flex: isWeb ? 1 : undefined,
  },
  submitButton: {
    flex: isWeb ? 1 : undefined,
  },
  mobileFlex: {
    flex: 1,
  },
  mobileSafe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  mobileHeader: {
    alignItems: 'center',
    paddingTop: getPadding(20),
    paddingBottom: getPadding(16),
    gap: getPadding(12),
  },
  mobileTitle: {
    fontSize: getFontSize(32),
    fontWeight: '700',
    color: palette.text,
    textAlign: 'center',
  },
});
