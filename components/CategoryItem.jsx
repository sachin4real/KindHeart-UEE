import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';

// Get device width
const windowWidth = Dimensions.get('window').width;

export default function CategoryItem({ category, onCategoryPress }) {
  return (
    <TouchableOpacity onPress={() => onCategoryPress(category)} style={styles.categoryItem}>
      <View style={styles.iconContainer}>
        <Image source={{ uri: category.icon }} style={styles.icon} />
      </View>
      <Text style={styles.categoryText}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: windowWidth / 20, // Space between items
  },
  iconContainer: {
    backgroundColor: '#B7E0FF', // Icon background color
    borderRadius: 50,
    padding: 10,
    marginBottom: 5,
  },
  icon: {
    width: 50,
    height: 50,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'outfit-medium',
    textAlign: 'center',
  },
});
