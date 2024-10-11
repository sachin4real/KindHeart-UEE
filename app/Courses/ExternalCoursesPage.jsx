// app/Courses/ExternalCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import CourseCard from './CourseDetails';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is imported

const ExternalCoursesPage = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);

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
      {/* Title with increased top space */}
      <Text style={styles.title}>External Courses</Text>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>Learning is the best thing</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          data={courses}
          renderItem={renderCourse}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      </ScrollView>

      {/* Back Button at the Bottom */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
    marginTop:20,
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
  scrollContainer: {
    paddingBottom: 20,
  },
  list: {
    flexGrow: 1,
  },
  courseCard: {
    marginBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20, // Space above and below the button
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#007AFF', // Color for the back button text
  },
});

export default ExternalCoursesPage;
