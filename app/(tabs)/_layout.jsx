import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';


export default function TabLayout() {
  return (
   <Tabs screenOptions={{headerShown:false}}>
    <Tabs.Screen name = 'home' 
    options={{
      tabBarLabel:'Home',
      tabBarIcon:({color}) =><Entypo name="home" size={24} color="black" />
    }}
    />
    <Tabs.Screen name = 'profile'
    options={{
      tabBarLabel:'Profile',
      tabBarIcon:({color}) =><Feather name="user" size={24} color="black" />
    }}
    />
   </Tabs>
  )
}