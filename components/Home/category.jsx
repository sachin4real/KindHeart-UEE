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

  const GetCategoryList = async () => {
    const q = query(collection(db, 'Category'));
    const querySnapshot = await getDocs(q);
    const fetchedCategories = [];

    querySnapshot.forEach((doc) => {
      fetchedCategories.push(doc.data());
    });

    const sortedCategories = fetchedCategories.sort((a, b) =>
      a.name === 'All' ? -1 : b.name === 'All' ? 1 : 0
    );

    setCategoryList(sortedCategories);
  };

  const handleCategoryPress = (category) => {
    if (category.name === 'Education') {
      // Navigate to the education page
      router.push('/Education/EducationPage');
    } else {
      onCategorySelect(category);
    }
  };

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
