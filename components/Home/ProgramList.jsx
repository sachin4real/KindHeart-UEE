import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import ProgramListCard from './ProgramListCard';

export default function ProgramList({ selectedCategory }) {
  const [programList, setProgramList] = useState([]);

  useEffect(() => {
    GetProgramList();
  }, [selectedCategory]); // Fetch programs whenever the selected category changes

  const GetProgramList = async () => {
    setProgramList([]); // Clear current list

    let q;
    if (selectedCategory === 'All') {
      // Fetch all programs if 'All' is selected
      q = query(collection(db, 'ProgramList'));
    } else {
      // Fetch programs based on the selected category
      q = query(collection(db, 'ProgramList'), where('category', '==', selectedCategory));
    }

    const querySnapshot = await getDocs(q);
    const fetchedPrograms = [];
    querySnapshot.forEach((doc) => {
      fetchedPrograms.push(doc.data());
    });
    setProgramList(fetchedPrograms);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Trending Programs</Text>
      <FlatList
        data={programList}
        renderItem={({ item, index }) => (
          <ProgramListCard key={index} program={item} />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent} // This style will ensure proper padding
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make sure the container takes full available height
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    paddingLeft: 20,
    fontSize: 20,
    fontFamily: 'outfit-medium',
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 50, // Add bottom padding to ensure scrolling feels smooth
  },
});
