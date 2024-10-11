import React from 'react'
import { Tabs } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="donations" 
        options={{
          tabBarLabel: 'Donations',
          tabBarIcon: ({ color }) => <Entypo name="wallet" size={24} color={color} />
        }}
      />
      </Tabs>
  )
}