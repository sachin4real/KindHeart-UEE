import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import Category from '../../components/Home/category';
import ProgramList from '../../components/Home/ProgramList';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All' by default

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name); // Store the selected category name
  };

  return (
    <View style={styles.container}>
      <Header />
      <Slider />
      <Category onCategorySelect={handleCategorySelect} />
      <ProgramList selectedCategory={selectedCategory} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
