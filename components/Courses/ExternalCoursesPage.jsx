import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
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
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>External Courses</Text>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Learning is the best thing</Text>
      </View>
      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  banner: {
    backgroundColor: '#B7E0FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExternalCoursesPage;
