import React from 'react'
import { Tabs } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="home" 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />
        }}
      />
      
      

      <Tabs.Screen 
        name="emergency" 
        options={{
          tabBarLabel: 'Emergency',
          tabBarIcon: ({ color }) => <FontAwesome name="ambulance" size={24} color={color} />
        }}
      />

      <Tabs.Screen 
        name="contact" 
        options={{
          tabBarLabel: 'Contact Us',
          tabBarIcon: ({ color }) => <Feather name="phone" size={24} color={color} />
        }}
      />

<Tabs.Screen 
        name="profile" 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />
        }}
      />
    </Tabs>
  )
}
