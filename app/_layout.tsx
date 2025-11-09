import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import './global.css';
import * as SplashScreen from 'expo-splash-screen';
import { withTiming } from "react-native-reanimated";
import React from "react";
import { StackCardInterpolationProps } from "@react-navigation/stack";
import { Easing, Platform } from "react-native";
import { isWeb } from "../utils/platform";


// const forFade = ({ current }: StackCardInterpolationProps) => ({
//   cardStyle: {
//     opacity: current.progress, // Bind opacity to the transition progress
//   },
// });

// const fadeTransitionSpec = {
//   open: {
//     animation: "timing",
//     config: {
//       duration: 10000, // Set fade-in duration to 1000ms (1 second)
//       easing: Easing.linear,
//     },
//   },
//   close: {
//     animation: "timing",
//     config: {
//       duration: 10000, // Set fade-out duration to 1000ms (1 second)
//       easing: Easing.linear,
//     },
//   },
// };

export default function RootLayout() {
  const stackContent = (
    <Stack
      screenOptions={{ 
      headerShown: false,
      gestureEnabled: !isWeb, // Disable gestures on web for better performance
      animation: "none",
      }}>
      {/* We can also configure screens here (e.g., disable default animation for log_in) */}
      <Stack.Screen name="index" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="log_in_page" options={{ animation: 'fade' }} />
      <Stack.Screen name="(dashboard)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(settings)" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="(swiping_page)" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="(daily_part_time)" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );

  // On web, GestureHandlerRootView may cause issues, so we conditionally wrap it
  if (isWeb) {
    return stackContent;
  }

  return (
    // Wrap the navigation stack in GestureHandlerRootView to enable gestures on mobile
    <GestureHandlerRootView style={{ flex: 1 }}>
      {stackContent}
    </GestureHandlerRootView>
  );
}
  
