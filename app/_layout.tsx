import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import './global.css';
import * as SplashScreen from 'expo-splash-screen';
import { withTiming } from "react-native-reanimated";
import React from "react";
import { StackCardInterpolationProps } from "@react-navigation/stack";
import { Easing } from "react-native";


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
  return (
    // Wrap the navigation stack in GestureHandlerRootView to enable gestures
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{ 
        headerShown: false,
        gestureEnabled: true,
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
    </GestureHandlerRootView>
  );
}
  
