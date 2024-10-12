import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import CategoryItem from '../CategoryItem';
import { useRouter } from 'expo-router';

const windowWidth = Dimensions.get('window').width;

export default function Category({ onCategorySelect }) {
  const [categoryList, setCategoryList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetCategoryList();
  }, []);

  // Fetching the category list from Firestore
  const GetCategoryList = async () => {
    const q = query(collection(db, 'Category'));
    const querySnapshot = await getDocs(q);
    const fetchedCategories = [];

    querySnapshot.forEach((doc) => {
      fetchedCategories.push(doc.data());
    });

    // Sort categories with 'All' appearing first
    const sortedCategories = fetchedCategories.sort((a, b) =>
      a.name === 'All' ? -1 : b.name === 'All' ? 1 : 0
    );

    setCategoryList(sortedCategories);
  };

  // Handling the category press based on the category name
  const handleCategoryPress = (category) => {
    if (category.name === 'Education') {
      // Navigate to the education page
      router.push('/Education/EducationPage');
    } else if (category.name === 'Volunteer') {
      // Navigate to the volunteer page
      router.push('/Volunteer/EventList');
    } else if (category.name === 'Request') {
      // Navigate to the Request page
      router.push('/Request/RequestPage');
    }
    else{
      onCategorySelect(category);
    }
  };

  // Rendering each category item
  const renderCategoryItem = ({ item }) => (
    <CategoryItem category={item} onCategoryPress={handleCategoryPress} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categoryList}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={windowWidth / 4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  flatListContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
