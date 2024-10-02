import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import ProgramListCard from './ProgramListCard';

export default function ProgramList({ selectedCategory }) {
  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState(true);  // To manage the loading state

  useEffect(() => {
    GetProgramList();
  }, [selectedCategory]); // Re-run whenever selectedCategory changes

  // Function to fetch programs from Firestore based on category
  const GetProgramList = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      let q;
      if (selectedCategory === 'All') {
        q = query(collection(db, 'ProgramList')); // Fetch all programs if 'All' is selected
      } else {
        q = query(collection(db, 'ProgramList'), where('category', '==', selectedCategory)); // Fetch programs by category
      }

      const querySnapshot = await getDocs(q);
      const fetchedPrograms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProgramList(fetchedPrograms); // Set the fetched programs to state
    } catch (error) {
      console.error("Error fetching programs: ", error); // Handle any error
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Trending Programs</Text>
      
      {/* Show loading indicator if data is still being fetched */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={programList}
          renderItem={({ item }) => (
            <ProgramListCard key={item.id} program={item} />  // Render each program card
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes the full available height
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
    paddingBottom: 50, // Add bottom padding for smooth scrolling experience
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'outfit-medium',
  },
});
