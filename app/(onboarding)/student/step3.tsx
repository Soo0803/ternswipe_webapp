import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebsiteLayout } from '../../../components/WebsiteLayout';
import { FormField } from '../../../components/FormField';
import { FormRow } from '../../../components/FormRow';
import { Button } from '../../../components/Button';
import SkillSelector from '../../../component/SkillSelector';
import CourseInput from '../../../component/CourseInput';
import { useStudentForm } from '../../../context/studentFormContext';
import { getCurrentUser, completeStudentOnboarding } from '../../../services/supabaseAuth';
import { storage } from '../../../utils/storage';
import { getFontSize, getPadding } from '../../../utils/responsive';
import { palette } from '../../../constants/theme';
import { isWeb } from '../../../utils/platform';

export default function StudentOnboardingStep3() {
  const router = useRouter();
  const { formData, setFormData } = useStudentForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'STUDENT') {
          router.replace('/(auth)/signup');
          return;
        }
        setLoading(false);
      } catch (error) {
        router.replace('/(auth)/signup');
      }
    }
    checkAuth();
  }, []);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'Please sign in again.');
        router.replace('/(auth)/signup');
        return;
      }

      await completeStudentOnboarding(user.id, {
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
      });

      // Update user in storage
      const updatedUser = await getCurrentUser();
      if (updatedUser) {
        await storage.setItem('auth_user', JSON.stringify({
          id: parseInt(updatedUser.id) || 0,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
        }));
      }

      router.replace('/(dashboard)/student');
    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert('Submission failed', error.message || 'Please check your input and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const formContent = (
    <ScrollView
      contentContainerStyle={styles.formScrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Professional Profile</Text>
        <Text style={styles.subtitle}>Step 3 of 3</Text>
      </View>

      <FormField
        label="Headline"
        placeholder="Brief professional headline"
        value={formData.headline || ''}
        onChangeText={(text) => setFormData({ ...formData, headline: text })}
        fullWidth
      />
      <FormField
        label="Summary"
        placeholder="Describe your background and goals"
        multiline
        numberOfLines={4}
        value={formData.summary || ''}
        onChangeText={(text) => setFormData({ ...formData, summary: text })}
        fullWidth
        style={styles.textArea}
      />
      <SkillSelector
        selectedSkills={formData.skills || []}
        onSkillsChange={(skills) => setFormData({ ...formData, skills })}
        label="Skills"
      />
      <CourseInput
        courses={formData.courses || []}
        onCoursesChange={(courses) => setFormData({ ...formData, courses })}
        label="Relevant Courses"
      />
      <FormRow>
        <FormField
          label="GPA"
          placeholder="GPA"
          keyboardType="decimal-pad"
          value={formData.gpa || ''}
          onChangeText={(text) => setFormData({ ...formData, gpa: text })}
        />
        <FormField
          label="Hours/Week"
          placeholder="Hours"
          keyboardType="numeric"
          value={formData.hrs_per_week || ''}
          onChangeText={(text) => setFormData({ ...formData, hrs_per_week: text })}
        />
      </FormRow>
      <FormRow>
        <FormField
          label="Start Date"
          placeholder="YYYY-MM-DD"
          value={formData.avail_start || ''}
          onChangeText={(text) => setFormData({ ...formData, avail_start: text })}
        />
        <FormField
          label="End Date"
          placeholder="YYYY-MM-DD"
          value={formData.avail_end || ''}
          onChangeText={(text) => setFormData({ ...formData, avail_end: text })}
        />
      </FormRow>

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          variant="outline"
          onPress={handleBack}
          style={styles.backButton}
        />
        <Button
          title={submitting ? 'Completing...' : 'Complete Registration'}
          onPress={handleSubmit}
          disabled={submitting}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );

  const webView = (
    <View style={styles.page}>
      <View style={styles.content}>{formContent}</View>
    </View>
  );

  const mobileView = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.mobileFlex}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.mobileSafe}>
          <StatusBar barStyle="light-content" />
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
  formScrollContent: {
    paddingBottom: getPadding(12),
    gap: getPadding(20),
  },
  header: {
    marginBottom: getPadding(24),
  },
  title: {
    fontSize: getFontSize(42),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
    marginBottom: getPadding(8),
  },
  subtitle: {
    fontSize: getFontSize(18),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: getPadding(12),
    marginTop: getPadding(24),
  },
  backButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
  },
  loadingText: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
  },
  mobileFlex: {
    flex: 1,
  },
  mobileSafe: {
    flex: 1,
    backgroundColor: palette.background,
  },
});

