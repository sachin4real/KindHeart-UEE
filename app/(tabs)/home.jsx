import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Slider from '../../components/Home/Slider'
import Category from '../../components/Home/category'


export default function home() {
  return (
    <View>
      <Header/>

      <Slider/>

      <Category/>
    </View>
  )
}