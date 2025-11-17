import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { palette } from '../../constants/theme';

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textSubtle,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
          paddingBottom: 6,
          paddingTop: 6,
          height: 68,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ focused, color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => (
            <Feather name="message-circle" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="project-matches"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="student"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="professor"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}