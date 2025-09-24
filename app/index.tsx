import { StyleSheet, Image, Text, View, Dimensions, StatusBar, useWindowDimensions } from "react-native";
import * as Svg from "react-native-svg";
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

import PhotoCrop from "./../assets/banner_page/banner_photo_cropper.svg";
import AppLogo from "./../assets/app_icon/in_app_logo.svg";
import CsIcon from "./../assets/banner_page/customer_service_logo.svg";
import ArrowDown from "./../assets/banner_page/arrow_down_icon.svg";
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

  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const SWIPE_THRESHOLD = windowHeight * 0.2;

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const swipeUpGesture = Gesture.Pan()
  .onUpdate((event) => {
    // Only respond to upward drag (negative Y translation)
    if (event.translationY < 0) {
      translateY.value = event.translationY;
    }
  })

  .onEnd((event) => {
    // Determine if swipe is far/fast enough to trigger navigation
    const swipeDistance = event.translationY;     // this will be negative for upward swipes
    const swipeVelocity = event.velocityY;        // negative velocity means moving up quickly
    const shouldNavigate = swipeDistance < -SWIPE_THRESHOLD || swipeVelocity < -1000;
    if (shouldNavigate) {
      // Animate card off the screen (slide up) then navigate
      translateY.value = withTiming(-windowHeight, { duration: 300 }, (finished) => {
        if (finished) {
          // Call navigation on the JS thread after animation completes
          runOnJS(router.push)("/log_in_page"); 
          // If using useNavigation: runOnJS(navigation.navigate)("log_in");
        }
      });
    } else {
      // Not far/fast enough: snap back to original position
      translateY.value = withSpring(0, { damping: 10 });
    }
  });

  return (
    <GestureDetector gesture={swipeUpGesture}>
      <Animated.View style={[ styles.container, cardStyle ]}>  
        <SafeAreaView style = {styles.landing_page}>
          <StatusBar barStyle="dark-content"/>
          {/* For App Logo and Customer Service Button*/}
          <View style = {styles.header}>
            <AppLogo width={65} height={54}/>
            <CsIcon width={48} height={48} />
          </View>

          <View style = {styles.body_wrap}>
            <View style={styles.body}>
            <Image style={styles.photo_1} source={require("../assets/banner_page/pict_1.png")} resizeMode="cover" />
            <Image style={styles.photo_2} source={require("../assets/banner_page/pict_2.png")} resizeMode="cover" />              
            <PhotoCrop style={styles.photoCrop} />
              <View style = {styles.app_name_wrap}>
                <View style = {styles.app_name}>
                  <Text style = {styles.app_name_text}>TERNSWIPE</Text>
                </View>
                <View style = {styles.motto_1}>
                  <Text style = {styles.motto_1_text}>YOUR FIRST INTERN DELIVERY TOOL</Text>
                </View>
                <View style = {styles.motto_2}>
                  <Text style = {styles.motto_2_text}>STUDENT SOLUTION, BUILD BY STUDENT</Text>
                </View>
              </View>
            </View>
          </View>

          <View style = {styles.footer}>
            <Text style = {styles.swipe_up_text}>SWIPE UP TO CONTINUE</Text>
            <ArrowDown style = {styles.arrow_down} width={25} height={25}/>
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
  container: {
  overflow: "hidden", // Prevents overflow of child elements
  flex: 1, // Occupies the full height and width of the parent
  justifyContent: 'center', // Centers content vertically
  alignItems: 'center', // Centers content horizontally
  backgroundColor: '#fff', // Sets a white background color
  borderBottomLeftRadius: 5,
  borderBottomRightRadius: 5,
  height: hp(100),
  width: wp(100),
  },
  
  cardStyle: {
  width: 250,
  height: 250,
  borderRadius: 10,
  backgroundColor: '#fff',
  // Shadow properties for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  // Elevation for Android
  elevation: 5,
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
  
  body_wrap:{
  flex:10,
  alignItems: "center",
  width: wp(100),
  paddingHorizontal: 31,
  },
  
  body: {
  flex:10,
  flexDirection: "column",
  alignItems: "flex-end",
  },
  
  photo_1: {
  marginLeft:1,
  width: wp(90),
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  },
  
  /*
  The width(88) of photo_1 is important since it determine the width of the whole group (body_group) since body group didnt specify the
  width required or stricted */
  
  photo_2 : {
  marginLeft:1,
  top: 5,
  },
  
  photoCrop : {
  left:0,
  position: "absolute",
  top: 143,
  //width: wp(60),
  },
  
  app_name_wrap:{
  top:355,
  height: 87,
  width: 246,
  left: 0,
  position: "absolute",
  },
  
  app_name :{
  paddingBottom: 8,
  width: 148,
  left: 0,
  top: 0,
  },
  
  app_name_text:{
  fontSize: 22,
  color: "#c1e8ff",
  textAlign: "left",
  fontFamily: "Inter-Regular"
  },
  
  motto_1 :{
  paddingBottom: 8,
  width: 248,
  left: 0,
  top: 0,
  },
  
  motto_1_text : {
  textAlign: "left",
  fontFamily: "Inter-Regular",
  },
  
  motto_2 :{
  paddingBottom: 8,
  width: 260,
  left: 0,
  top: 0,
  },
  
  motto_2_text : {
  textAlign: "left",
  fontFamily: "Inter-Regular",
  },
  
  footer: {
  flex:0.7,
  alignItems: "center",
  backgroundColor: "#fff"
  },
  
  swipe_up_text:{
  fontFamily: "Inter-Regular",
  textAlign: "center",
  fontSize:12,
  },
  
  arrow_down: {
  overflow: "hidden"
  }
})