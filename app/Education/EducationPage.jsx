import { View, FlatList, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';

const windowWidth = Dimensions.get('window').width;

export default function EducationPage({ user }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const q = query(collection(db, 'EducationCourses'));
    const querySnapshot = await getDocs(q);
    const fetchedCourses = [];

    querySnapshot.forEach((doc) => {
      fetchedCourses.push(doc.data());
    });

    setCourses(fetchedCourses);
  };

  const renderCourseItem = ({ item }) => (
    <View style={styles.courseItem}>
      <Text style={styles.courseTitle}>{item.name}</Text>
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.courseImage} 
        resizeMode="cover" 
        onError={(error) => console.log('Image loading error:', error.nativeEvent.error)} 
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello {user?.firstName}!</Text>
        </View>
        <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
      </View>

      <View style={styles.learningBox}>
        <Text style={styles.learningText}>Learning is the best thing</Text>
      </View>

      <Text style={styles.exploreText}>Explore Topics</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.roundButton}>
          <Text style={styles.buttonText}>Quizzes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundButton}>
          <Text style={styles.buttonText}>External Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundButton}>
          <Text style={styles.buttonText}>Certificates</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  learningBox: {
    backgroundColor: '#A3C1DA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  learningText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
  exploreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  roundButton: {
    backgroundColor: '#738FFE',
    borderRadius: 50,
    padding: 15,
    width: '25%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  courseItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
});
