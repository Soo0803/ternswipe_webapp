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
  TouchableOpacity,
  TextInput,
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
import { TextInput as RNTextInput } from 'react-native-gesture-handler';
import { isWeb } from '../../utils/platform';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { palette, radii, shadows } from '../../constants/theme';
import { getFontSize, getPadding, getMaxWidth, scale } from '../../utils/responsive';

import AppLogo from '../../assets/app_icon/in_app_logo.svg';
import ProgressBar from '../../component/ProgressBar';
import { Ionicons } from '@expo/vector-icons';
import ArrowDown from '../../assets/banner_page/arrow_down_icon.svg';
import { useStudentForm } from '../../context/studentFormContext';
import SkillSelector from '../../component/SkillSelector';
import CourseInput from '../../component/CourseInput';

const { height } = Dimensions.get("window");

const profileHighlights = [
  'Summarize your academic story so professors grasp your focus.',
  'Highlight the skills and courses that make you ready for research.',
  'Share availability so matches align with your schedule.',
];

export default function page_4() {
  const router = useRouter();
  const { formData, setFormData } = useStudentForm();
  
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const SWIPE_THRESHOLD = windowHeight * 0.2;

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleNext = () => {
    // Validate required fields
    if (!formData.headline || !formData.summary || formData.skills.length === 0 || !formData.gpa || !formData.hrs_per_week) {
      Alert.alert("Missing Fields", "Please fill in all required fields: Headline, Summary, Skills, GPA, and Hours per Week.");
      return;
    }
    // Navigate to page_3 (credentials page)
    router.push("/(student_sign_up)/page_3");
  };

  const handleSwipeNext = () => {
    if (isWeb) {
      translateY.value = withTiming(-windowHeight, { duration: 300 }, (finished) => {
        if (finished) {
          handleNext();
        }
      });
    } else {
      handleNext();
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
              <Text style={styles.webTitle}>Share the context behind your expertise.</Text>
              <Text style={styles.webSubtitle}>
                We surface these details to match you with labs that fit your skills, interests, and availability.
              </Text>
              <View style={styles.webList}>
                {profileHighlights.map((item) => (
                  <View key={item} style={styles.webListItem}>
                    <Ionicons name="sparkles-outline" size={18} color={palette.primary} />
                    <Text style={styles.webListText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.webFormCard}>
              <View style={styles.webProgressHeader}>
                <View style={styles.webProgressRow}>
                  <Text style={styles.webProgressTitle}>Student Registration</Text>
                  <Text style={styles.webProgressStep}>Step 3 of 4</Text>
                </View>
                <Text style={styles.webProgressSubtitle}>Profile & readiness</Text>
                <ProgressBar process={0.75} />
              </View>

              <ScrollView
                contentContainerStyle={styles.webFormContent}
                showsVerticalScrollIndicator={false}
              >
                <FormField
                  label="Headline *"
                  placeholder="e.g., Statistics major with machine learning experience"
                  value={formData.headline}
                  onChangeText={(text) => setFormData({ ...formData, headline: text })}
                  fullWidth
                  required
                />

                <FormField
                  label="Summary *"
                  placeholder="Describe your background, interests, and goals..."
                  multiline
                  numberOfLines={4}
                  value={formData.summary}
                  onChangeText={(text) => setFormData({ ...formData, summary: text })}
                  fullWidth
                  required
                  style={styles.webTextArea}
                />

                <View style={styles.webSection}>
                  <SkillSelector
                    selectedSkills={formData.skills}
                    onSkillsChange={(skills) => setFormData({ ...formData, skills })}
                    label="Skills *"
                  />
                </View>

                <FormField
                  label="Additional skills description"
                  placeholder="Share extra context about your experience..."
                  multiline
                  numberOfLines={3}
                  value={formData.skills_text}
                  onChangeText={(text) => setFormData({ ...formData, skills_text: text })}
                  fullWidth
                  style={styles.webTextArea}
                />

                <View style={styles.webSection}>
                  <CourseInput
                    courses={formData.courses}
                    onCoursesChange={(courses) => setFormData({ ...formData, courses })}
                    label="Relevant courses"
                  />
                </View>

                <View style={styles.webFieldRow}>
                  <FormField
                    label="GPA *"
                    placeholder="e.g., 3.75"
                    keyboardType="decimal-pad"
                    value={formData.gpa}
                    onChangeText={(text) => setFormData({ ...formData, gpa: text })}
                    required
                    fullWidth
                  />
                  <FormField
                    label="Hours available per week *"
                    placeholder="e.g., 15"
                    keyboardType="numeric"
                    value={formData.hrs_per_week}
                    onChangeText={(text) => setFormData({ ...formData, hrs_per_week: text })}
                    required
                    fullWidth
                  />
                </View>

                <View style={styles.webFieldRow}>
                  <FormField
                    label="Availability start date"
                    placeholder="YYYY-MM-DD"
                    value={formData.avail_start}
                    onChangeText={(text) => setFormData({ ...formData, avail_start: text })}
                    fullWidth
                  />
                  <FormField
                    label="Availability end date"
                    placeholder="YYYY-MM-DD"
                    value={formData.avail_end}
                    onChangeText={(text) => setFormData({ ...formData, avail_end: text })}
                    fullWidth
                  />
                </View>

                <View style={styles.webButtonGroup}>
                  <Button
                    title="Back to documents"
                    variant="outline"
                    onPress={() => router.push('/(student_sign_up)/page_2')}
                    style={styles.webBackButton}
                  />
                  <Button
                    title="Continue to final step"
                    onPress={handleNext}
                    style={styles.webNextButton}
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
            runOnJS(handleNext)();
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
            <ProgressBar process={0.75} />
            <Text style={styles.headerText}>YOUR PROFILE</Text>
          </View>

          {/* FORM BODY */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.body}>
              <Text style={styles.sectionTitle}>Professional Information</Text>

              {/* Headline */}
              <View style={styles.inputFormWrap}>
                <Text style={styles.label}>Headline *</Text>
                <TextInput
                  placeholder="e.g., Statistics major with ML experience"
                  style={styles.textInput}
                  value={formData.headline}
                  onChangeText={(text) => setFormData({ ...formData, headline: text })}
                  maxLength={100}
                />
              </View>

              {/* Summary */}
              <View style={styles.inputFormWrap}>
                <Text style={styles.label}>Summary *</Text>
                <TextInput
                  placeholder="Describe your background, interests, and goals..."
                  style={[styles.textInput, styles.textArea]}
                  multiline
                  numberOfLines={4}
                  value={formData.summary}
                  onChangeText={(text) => setFormData({ ...formData, summary: text })}
                  textAlignVertical="top"
                />
              </View>

              {/* Skills */}
              <SkillSelector
                selectedSkills={formData.skills}
                onSkillsChange={(skills) => setFormData({ ...formData, skills })}
                label="Skills *"
              />

              {/* Skills Text (optional, for free-form input) */}
              <View style={styles.inputFormWrap}>
                <Text style={styles.label}>Additional Skills Description (Optional)</Text>
                <TextInput
                  placeholder="Describe any additional skills or experiences..."
                  style={[styles.textInput, styles.textArea]}
                  multiline
                  numberOfLines={3}
                  value={formData.skills_text}
                  onChangeText={(text) => setFormData({ ...formData, skills_text: text })}
                  textAlignVertical="top"
                />
              </View>

              {/* Courses */}
              <CourseInput
                courses={formData.courses}
                onCoursesChange={(courses) => setFormData({ ...formData, courses })}
                label="Relevant Courses"
              />

              <Text style={styles.sectionTitle}>Academic & Availability</Text>

              {/* GPA */}
              <View style={styles.inputFormWrap}>
                <Text style={styles.label}>GPA *</Text>
                <TextInput
                  placeholder="e.g., 3.75"
                  style={styles.textInput}
                  keyboardType="decimal-pad"
                  value={formData.gpa}
                  onChangeText={(text) => setFormData({ ...formData, gpa: text })}
                />
              </View>

              {/* Hours per Week */}
              <View style={styles.inputFormWrap}>
                <Text style={styles.label}>Hours Available per Week *</Text>
                <TextInput
                  placeholder="e.g., 15"
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={formData.hrs_per_week}
                  onChangeText={(text) => setFormData({ ...formData, hrs_per_week: text })}
                />
              </View>

              {/* Availability Start Date */}
              <View style={styles.inputFormWrap}>
                <Text style={styles.label}>Availability Start Date</Text>
                <TextInput
                  placeholder="YYYY-MM-DD (e.g., 2024-09-01)"
                  style={styles.textInput}
                  value={formData.avail_start}
                  onChangeText={(text) => setFormData({ ...formData, avail_start: text })}
                />
              </View>

              {/* Availability End Date */}
              <View style={styles.inputFormWrap}>
                <Text style={styles.label}>Availability End Date</Text>
                <TextInput
                  placeholder="YYYY-MM-DD (e.g., 2024-12-31)"
                  style={styles.textInput}
                  value={formData.avail_end}
                  onChangeText={(text) => setFormData({ ...formData, avail_end: text })}
                />
              </View>
            </View>
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.footer}>
            <View style={styles.navigationButtons}>
              <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#A5CBE1" />
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
              
              {isWeb ? (
                <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={24} color="#fff" />
                </TouchableOpacity>
              ) : (
                <View style={styles.swipeContainer}>
                  <Text style={styles.swipeText}>SWIPE UP TO CONTINUE</Text>
                  <ArrowDown style={styles.arrowDown} width={25} height={25} />
                </View>
              )}
            </View>
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

const maxWidth = getMaxWidth();

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },
  webPage: {
    width: '100%',
    minHeight: '100vh' as any,
    paddingVertical: getPadding(96),
    paddingHorizontal: getPadding(56),
  },
  webShell: {
    width: '100%',
    maxWidth: 1440,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    gap: getPadding(64),
    alignItems: 'flex-start',
  },
  webIntro: {
    flex: 1,
    maxWidth: 540,
    gap: getPadding(24),
  },
  webBadge: {
    alignSelf: 'flex-start',
    paddingVertical: getPadding(6),
    paddingHorizontal: getPadding(14),
    backgroundColor: palette.primarySoft,
    borderRadius: radii.pill,
  },
  webBadgeText: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: palette.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  webTitle: {
    fontSize: getFontSize(38),
    fontWeight: '700',
    color: palette.text,
    lineHeight: getFontSize(48),
    fontFamily: 'Inter-Regular',
  },
  webSubtitle: {
    fontSize: getFontSize(18),
    color: palette.textMuted,
    lineHeight: getFontSize(28),
    fontFamily: 'Inter-Regular',
  },
  webList: {
    gap: getPadding(14),
  },
  webListItem: {
    flexDirection: 'row',
    gap: getPadding(12),
    alignItems: 'flex-start',
  },
  webListText: {
    flex: 1,
    fontSize: getFontSize(15),
    color: palette.textMuted,
    lineHeight: getFontSize(24),
    fontFamily: 'Inter-Regular',
  },
  webFormCard: {
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
  webProgressHeader: {
    gap: getPadding(12),
    marginBottom: getPadding(24),
  },
  webProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  webProgressTitle: {
    fontSize: getFontSize(28),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
  },
  webProgressStep: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.textSubtle,
  },
  webProgressSubtitle: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  webFormContent: {
    paddingBottom: getPadding(16),
    gap: getPadding(20),
  },
  webSection: {
    width: '100%',
  },
  webFieldRow: {
    width: '100%',
    flexDirection: 'row',
    gap: getPadding(12),
  },
  webTextArea: {
    minHeight: scale(120),
    textAlignVertical: 'top',
  },
  webButtonGroup: {
    flexDirection: 'row',
    gap: getPadding(12),
    marginTop: getPadding(12),
  },
  webBackButton: {
    flex: 1,
  },
  webNextButton: {
    flex: 1,
  },
  page: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: getPadding(20),
    backgroundColor: '#fff',
    height: '100%',
    maxWidth: maxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingTop: getPadding(16),
    alignItems: 'center',
    marginBottom: getPadding(16),
  },
  headerText: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.primary,
    marginTop: getPadding(8),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: getPadding(20),
  },
  body: {
    flex: 1,
    width: '100%',
  },
  sectionTitle: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    marginTop: getPadding(16),
    marginBottom: getPadding(12),
    color: palette.text,
  },
  inputFormWrap: {
    marginBottom: getPadding(16),
    width: '100%',
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: getPadding(8),
    color: palette.text,
  },
  textInput: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.md,
    paddingHorizontal: getPadding(12),
    paddingVertical: getPadding(10),
    fontSize: getFontSize(14),
    backgroundColor: palette.surfaceMuted,
    color: palette.text,
    width: '100%',
  },
  textArea: {
    minHeight: scale(100),
    paddingTop: getPadding(12),
    textAlignVertical: 'top',
  },
  footer: {
    paddingVertical: getPadding(16),
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getPadding(8),
  },
  backButtonText: {
    marginLeft: getPadding(4),
    fontSize: getFontSize(14),
    color: palette.primary,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primary,
    paddingHorizontal: getPadding(20),
    paddingVertical: getPadding(12),
    borderRadius: radii.md,
  },
  nextButtonText: {
    color: palette.textOnPrimary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginRight: getPadding(8),
  },
  swipeContainer: {
    alignItems: 'center',
  },
  swipeText: {
    fontSize: getFontSize(12),
    color: palette.textSubtle,
    marginBottom: getPadding(4),
  },
  arrowDown: {
    overflow: 'hidden',
  },
});

