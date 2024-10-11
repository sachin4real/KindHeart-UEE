import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig'; // Update the import path if needed
import CourseCard from './CourseDetails'; // Ensure correct import path for your CourseDetails component

const ExternalCoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const coursesCollection = collection(db, 'EducationCourses');
    const courseSnapshot = await getDocs(coursesCollection);
    const courseList = courseSnapshot.docs.map((doc) => doc.data());
    setCourses(courseList);
  };

  const renderCourse = ({ item }) => (
    <CourseCard 
      name={item.name} 
      rating={item.rating} 
      reviews={item.reviews} 
      imageUrl={item.imageUrl}
      style={styles.courseCard} // Add custom styling if needed in CourseCard
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>External Courses</Text>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Learning is the best thing</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          data={courses}
          renderItem={renderCourse}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Light background color
    padding: 20,
  },
  title: {
    textAlign:'center',
    fontSize: 26, // Increased font size
    fontWeight: 'bold',
    color: '#333', // Darker color for better contrast
    //marginVertical: 15,
  },
  banner: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 30,
    marginTop:50,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    
  },
  bannerText: {
    fontSize: 40,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  scrollContainer: {
    paddingBottom: 20, // Add padding at the bottom for better scrolling
  },
  list: {
    flexGrow: 1, // Ensure FlatList grows correctly in ScrollView
  },
  courseCard: {
    marginBottom: 15, // Space between cards
  },
});

export default ExternalCoursesPage;
