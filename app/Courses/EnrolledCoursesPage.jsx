// app/Courses/EnrolledCoursesPage.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db } from '../../configs/FirebaseConfig';

const EnrolledCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const enrolledCoursesCollection = collection(db, 'EnrollCourses');
      const enrolledCoursesSnapshot = await getDocs(enrolledCoursesCollection);
      const enrolledCoursesList = enrolledCoursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEnrolledCourses(enrolledCoursesList);
    } catch (error) {
      console.error('Error fetching enrolled courses: ', error);
    }
  };

  const renderCourse = ({ item }) => (
    <View style={styles.courseCard}>
      <Image source={{ uri: item.ImageUri }} style={styles.courseImage} />
      <Text style={styles.courseName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Enrolled Courses</Text>

      {/* Course List */}
      <FlatList
        data={enrolledCourses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 70,
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default EnrolledCoursesPage;
