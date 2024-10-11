import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; 

export default function CourseDetailPage() {
  const { courseID } = useLocalSearchParams(); // Assuming courseID is passed as a param
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCourseDetailsById();
  }, []);

  const fetchCourseDetailsById = async () => {
    setLoading(true);
    const docRef = doc(db, 'EducationCourses', courseID); // Change the collection name if necessary
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setCourse(docSnap.data());
    } else {
      console.log("No such document");
    }
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: '70%' }} size={'large'} />;
  }

  if (!course) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Course details not available</Text>
      </View>
    );
  }

  const handleEnrollPress = () => {
    // Implement enrollment logic here
    Alert.alert("Enrolled", `You have successfully enrolled in ${course.name}!`);
    // Optionally navigate to another page or perform an action after enrollment
  };

  return (
    <ScrollView style={styles.container}>
      {/* Course Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: course.imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartButton}>
          <FontAwesome name="heart-o" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.imageOverlay} />
      </View>

      {/* Course Info Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{course.name}</Text>

        {/* About Section */}
        <Text style={styles.aboutHeader}>About</Text>
        <Text style={styles.aboutText}>{course.about}</Text>

        {/* Rating Section */}
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>{course.rating} ({course.reviews})</Text>
        </View>

        {/* Enroll Button */}
        <TouchableOpacity style={styles.enrollButton} onPress={handleEnrollPress}>
          <Text style={styles.enrollButtonText}>Enroll Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    opacity: 0.9,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
    zIndex: 2,
  },
  heartButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
    zIndex: 2,
  },
  contentContainer: {
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutHeader: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 15,
  },
  aboutText: {
    fontSize: 16,
    marginVertical: 10,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  rating: {
    fontSize: 16,
    marginLeft: 5,
  },
  enrollButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  enrollButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
});
