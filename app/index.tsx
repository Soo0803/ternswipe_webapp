import { StyleSheet, Image, Text, View, Dimensions, StatusBar, useWindowDimensions, TouchableOpacity, Platform, ScrollView } from "react-native";
import * as React from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS
} from "react-native-reanimated";

import { useRouter} from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { isWeb } from "../utils/platform";
import { getFontSize, getPadding, getMaxWidth } from "../utils/responsive";

import PhotoCrop from "./../assets/banner_page/banner_photo_cropper.svg";
import AppLogo from "./../assets/app_icon/in_app_logo.svg";
import CsIcon from "./../assets/banner_page/customer_service_logo.svg";
import ArrowDown from "./../assets/banner_page/arrow_down_icon.svg";
import { WebsiteLayout } from '../components/WebsiteLayout';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
// import Photo_1 from "../../assets/banner_page/pict_1.png";
// import Photo_2 from "../../assets/banner_page/pict_2.png";

{/*
Typescript file
export default function Banner() {}

IS EQUIVALENT TO

Javascript XML
const Banner = () => {}
export default Banner;


FURTHER DEVELOPMENTS THAT ARE NEEDED TO BE CONSIDERED
- Using a things called <SafeAreaView>
*/}


const {height, width} = Dimensions.get("window");

export default function index() {
  const router = useRouter();

  if (isWeb) {
    return (
      <WebsiteLayout showHeader={true}>
        <View style={styles.webContainer}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Connect Students with Research Opportunities</Text>
              <Text style={styles.heroSubtitle}>
                TernSwipe is your first intern delivery tool. A student solution, built by students.
                Match with professors and find the perfect research project for your academic journey.
              </Text>
              <View style={styles.heroButtons}>
                <Button
                  title="Get Started as Student"
                  onPress={() => router.push("/(student_sign_up)")}
                  style={styles.heroButtonPrimary}
                />
                <Button
                  title="Register as Professor"
                  onPress={() => router.push("/(company_sign_up)")}
                  variant="outline"
                  style={styles.heroButtonSecondary}
                />
              </View>
              <TouchableOpacity 
                onPress={() => router.push("/log_in_page")}
                style={styles.loginLink}
              >
                <Text style={styles.loginLinkText}>Already have an account? Sign in</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.heroImage}>
              <Image 
                style={styles.heroImage1} 
                source={require("../assets/banner_page/pict_1.png")} 
                resizeMode="cover" 
              />
              <Image 
                style={styles.heroImage2} 
                source={require("../assets/banner_page/pict_2.png")} 
                resizeMode="cover" 
              />
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Why Choose TernSwipe?</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <Ionicons name="search" size={48} color="#7da0ca" />
                <Text style={styles.featureTitle}>Smart Matching</Text>
                <Text style={styles.featureDescription}>
                  Our algorithm matches students with research projects based on skills, interests, and availability.
                </Text>
              </View>
              <View style={styles.featureCard}>
                <Ionicons name="people" size={48} color="#7da0ca" />
                <Text style={styles.featureTitle}>Connect with Professors</Text>
                <Text style={styles.featureDescription}>
                  Directly connect with professors and research labs looking for talented students.
                </Text>
              </View>
              <View style={styles.featureCard}>
                <Ionicons name="school" size={48} color="#7da0ca" />
                <Text style={styles.featureTitle}>Academic Growth</Text>
                <Text style={styles.featureDescription}>
                  Find opportunities that align with your academic goals and career aspirations.
                </Text>
              </View>
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
            <Text style={styles.ctaSubtitle}>
              Join hundreds of students and professors already using TernSwipe
            </Text>
            <View style={styles.ctaButtons}>
              <Button
                title="Register Now"
                onPress={() => router.push("/(student_sign_up)")}
                style={styles.ctaButton}
                textStyle={styles.ctaButtonText}
              />
            </View>
          </View>
        </View>
      </WebsiteLayout>
    );
  }

  // Mobile version - keep original design
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const SWIPE_THRESHOLD = windowHeight * 0.2;

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleNavigate = () => {
    router.push("/log_in_page");
  };

  const swipeUpGesture = Gesture.Pan()
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
            runOnJS(router.push)("/log_in_page"); 
          }
        });
      } else {
        translateY.value = withSpring(0, { damping: 10 });
      }
    });

  return (
    <GestureDetector gesture={swipeUpGesture}>
      <Animated.View style={[styles.container, cardStyle]}>  
        <SafeAreaView style={styles.landing_page}>
          <StatusBar barStyle="dark-content"/>
          <View style={styles.header}>
            <AppLogo width={65} height={54}/>
            <CsIcon width={48} height={48} />
          </View>

          <View style={styles.body_wrap}>
            <View style={styles.body}>
              <Image style={styles.photo_1} source={require("../assets/banner_page/pict_1.png")} resizeMode="cover" />
              <Image style={styles.photo_2} source={require("../assets/banner_page/pict_2.png")} resizeMode="cover" />              
              <PhotoCrop style={styles.photoCrop} />
              <View style={styles.app_name_wrap}>
                <View style={styles.app_name}>
                  <Text style={styles.app_name_text}>TERNSWIPE</Text>
                </View>
                <View style={styles.motto_1}>
                  <Text style={styles.motto_1_text}>YOUR FIRST INTERN DELIVERY TOOL</Text>
                </View>
                <View style={styles.motto_2}>
                  <Text style={styles.motto_2_text}>STUDENT SOLUTION, BUILD BY STUDENT</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.swipe_up_text}>SWIPE UP TO CONTINUE</Text>
            <ArrowDown style={styles.arrow_down} width={25} height={25}/>
          </View>
        </SafeAreaView>
      </Animated.View>
    </GestureDetector> 
  );
}



{/*
  o) What does flex : 1 means?
  It means that the component will take up all the available space in its parent container.
  It is a shorthand for flexGrow: 1, flexShrink: 1, and flexBasis: 0.
  The flex-grow property specifies how much of the available space within a container an element should take up, relative to the other elements.

  o) What does flexDirection : "row" means?
  It means that the children of the component will be arranged in a row.
  
  o) What does justifyContent : "center" means?
  It means that the children of the component will be centered in the parent container.
  
  o) What does alignItems : "center" means?
  It means that the children of the component will be aligned in the center of the parent container.
  
  o) What does backgroundColor : "fff" means?
  It means that the background color of the component will be white.
  
  o) What does width : "100%" means?
  It means that the width of the component will be 100% of the parent container.
  
  o) What does height : "100%" means?
  It means that the height of the component will be 100% of the parent container.
  
  o) What does resizeMode : "contain" means?
  It means that the image will be resized to fit the container while maintaining its aspect ratio.

  o) What does resizeMode : "cover" means?
  It means that the image will be resized to cover the container while maintaining its aspect ratio.

  o) What does resizeMode : "stretch" means?
  It means that the image will be stretched to fit the container.

  o) What does overflow: "hidden" means?
  It means that any content that overflows the container will be hidden.
  It is used to prevent content from overflowing the container and causing layout issues.

  o) What does position: "absolute" means?
  It means that the component will be positioned relative to its parent container.
  It is used to position the component in a specific location within the parent container.

  o) What does top: 0 means?
  It means that the component will be positioned at the top of the parent container.

*/}

const styles = StyleSheet.create({
  // Web styles
  webContainer: {
    width: '100%',
    paddingVertical: 0,
  },
  heroSection: {
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getPadding(80),
    paddingHorizontal: getPadding(24),
    gap: getPadding(60),
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  heroContent: {
    flex: 1,
    maxWidth: isWeb ? 600 : '100%',
  },
  heroTitle: {
    fontSize: getFontSize(48),
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: getPadding(24),
    fontFamily: 'Inter-Regular',
    lineHeight: getFontSize(56),
  },
  heroSubtitle: {
    fontSize: getFontSize(18),
    color: '#666',
    marginBottom: getPadding(40),
    fontFamily: 'Inter-Regular',
    lineHeight: getFontSize(28),
  },
  heroButtons: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: getPadding(16),
    marginBottom: getPadding(24),
  },
  heroButtonPrimary: {
    flex: isWeb ? 0 : 1,
    minWidth: isWeb ? 200 : undefined,
  },
  heroButtonSecondary: {
    flex: isWeb ? 0 : 1,
    minWidth: isWeb ? 200 : undefined,
  },
  loginLink: {
    marginTop: getPadding(16),
  },
  loginLinkText: {
    fontSize: getFontSize(14),
    color: '#7da0ca',
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'underline',
  },
  heroImage: {
    flex: 1,
    flexDirection: 'row',
    gap: getPadding(16),
    maxWidth: isWeb ? 500 : '100%',
    alignItems: 'center',
  },
  heroImage1: {
    width: isWeb ? 240 : wp(45),
    height: isWeb ? 320 : hp(40),
    borderRadius: 12,
  },
  heroImage2: {
    width: isWeb ? 240 : wp(45),
    height: isWeb ? 320 : hp(40),
    borderRadius: 12,
    marginTop: getPadding(40),
  },
  featuresSection: {
    paddingVertical: getPadding(80),
    paddingHorizontal: getPadding(24),
    backgroundColor: '#fff',
    width: '100%',
  },
  sectionTitle: {
    fontSize: getFontSize(36),
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: getPadding(60),
    fontFamily: 'Inter-Regular',
  },
  featuresGrid: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: getPadding(32),
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: getPadding(24),
  },
  featureCard: {
    flex: 1,
    padding: getPadding(32),
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 280,
  },
  featureTitle: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: getPadding(24),
    marginBottom: getPadding(12),
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: getFontSize(14),
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    lineHeight: getFontSize(22),
  },
  ctaSection: {
    paddingVertical: getPadding(80),
    paddingHorizontal: getPadding(24),
    backgroundColor: '#7da0ca',
    width: '100%',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: getFontSize(36),
    fontWeight: '700',
    color: '#fff',
    marginBottom: getPadding(16),
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: getFontSize(18),
    color: '#fff',
    marginBottom: getPadding(40),
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    opacity: 0.9,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: getPadding(16),
  },
  ctaButton: {
    minWidth: 200,
    backgroundColor: '#fff',
  },
  ctaButtonText: {
    color: '#7da0ca',
  },
  // Mobile styles (keep original)
  container: {
    overflow: "hidden",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: hp(100),
    width: wp(100),
  },
  landing_page: {
    backgroundColor: "#fff",
    width: wp(100),
    height: hp(100),
    flex: 1,
    overflow: "hidden",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 31,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#fff",
    width: wp(100),
  },
  body_wrap: {
    flex: 10,
    alignItems: "center",
    width: wp(100),
    paddingHorizontal: 31,
  },
  body: {
    flex: 10,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  photo_1: {
    marginLeft: 1,
    width: wp(90),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  photo_2: {
    marginLeft: 1,
    top: 5,
  },
  photoCrop: {
    left: 0,
    position: "absolute",
    top: 143,
  },
  app_name_wrap: {
    top: 355,
    height: 87,
    width: 246,
    left: 0,
    position: "absolute",
  },
  app_name: {
    paddingBottom: 8,
    width: 148,
    left: 0,
    top: 0,
  },
  app_name_text: {
    fontSize: 22,
    color: "#c1e8ff",
    textAlign: "left",
    fontFamily: "Inter-Regular"
  },
  motto_1: {
    paddingBottom: 8,
    width: 248,
    left: 0,
    top: 0,
  },
  motto_1_text: {
    textAlign: "left",
    fontFamily: "Inter-Regular",
  },
  motto_2: {
    paddingBottom: 8,
    width: 260,
    left: 0,
    top: 0,
  },
  motto_2_text: {
    textAlign: "left",
    fontFamily: "Inter-Regular",
  },
  footer: {
    flex: 0.7,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  swipe_up_text: {
    fontFamily: "Inter-Regular",
    textAlign: "center",
    fontSize: 12,
  },
  arrow_down: {
    overflow: "hidden"
  },
})