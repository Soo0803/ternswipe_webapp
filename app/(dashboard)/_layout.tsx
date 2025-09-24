import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import HomeIcon from "../../assets/tab_bar_icons/home_icon.svg";
import NotifIcon from "../../assets/tab_bar_icons/notification_icon.svg";
import MessageIcon from "../../assets/tab_bar_icons/messages_icon.svg";
import ProfileIcon from "../../assets/tab_bar_icons/profile_icon.svg";

import Feather from '@expo/vector-icons/Feather'; // HOME ICON


export default function DashboardLayout() {
    return (
        <Tabs screenOptions = {{ 
            headerShown: false,
            tabBarActiveTintColor: "green",
            tabBarItemStyle: {
                justifyContent: 'center',
                alignItems: 'center',
            },
            //tabBarShowLabel: false, 
            }}>

            <Tabs.Screen 
                name="index" 
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) =>  (
                        <Feather name="home" size={24} color = { focused? "green" : "gray" } />
                        //<HomeIcon stroke={focused ? "green" : "gray"} />
                    )
                }} 
            />

            <Tabs.Screen 
                name="notification" 
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="notifications-outline" size={24} color={ focused ? "green" : "gray" } />
                        //<NotifIcon/>
                    )
                }}
            />

            <Tabs.Screen 
                name="messages" 
                options={{ 
                    title: 'Messages',
                    tabBarIcon: ({ focused }) => (
                        <Feather name="message-circle" size={24} color={focused ? "green" : "gray"}/>
                        //<MessageIcon/>
                    )
                }}
            />

            <Tabs.Screen 
                name="profile" 
                options={{ 
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="person-outline" size={24} color={ focused ? "green" : "gray"}/>
                        // <ProfileIcon/>
                    )
                }}
            />
        </Tabs>
    );
}