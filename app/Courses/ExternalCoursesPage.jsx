import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import CourseCard from './CourseDetails';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is imported
import { useRouter } from 'expo-router';

const ExternalCoursesPage = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, 'EducationCourses');
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    } catch (error) {
      console.error('Error fetching courses: ', error);
    }
  };

  const renderCourse = ({ item }) => (
    <CourseCard
      id={item.id}
      name={item.name}
      rating={item.rating}
      reviews={item.reviews}
      imageUrl={item.imageUrl}
      style={styles.courseCard}
    />
  );

  return (
    <View style={styles.container}>
      {/* Back Button at the Top */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Education/EducationPage')}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>External Courses</Text>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Learning is the best thing</Text>
      </View>

      {/* FlatList (no ScrollView wrapping it) */}
      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContainer} // Added padding for the list
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 50, // Increased top space for the title
    marginBottom: 20, // Add some space below the title
  },
  banner: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 30,
    marginTop: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  bannerText: {
    fontSize: 40,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  list: {
    flexGrow: 1,
  },
  listContainer: {
    paddingBottom: 20, // Added padding to the bottom of the list
  },
  courseCard: {
    marginBottom: 15,
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjusted to fit the layout
    left: 20,
    backgroundColor: '#2196F3',
    padding: 10, // Adjust padding to balance icon size and button appearance
    borderRadius: 30, // Set to 50 to make it round
    zIndex: 10, // Ensure it stays on top
  },
});

export default ExternalCoursesPage;
