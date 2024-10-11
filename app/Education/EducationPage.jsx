import { View, FlatList, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;

export default function EducationPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Access user data here
  const navigation = useNavigation();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const q = query(collection(db, 'EducationCourses'));
      const querySnapshot = await getDocs(q);
      const fetchedCourses = [];

      querySnapshot.forEach((doc) => {
        fetchedCourses.push({ id: doc.id, ...doc.data() }); // Include doc ID
      });

      setCourses(fetchedCourses);
      
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.courseItem} 
      onPress={() => navigation.push('Courses/CourseDetailsPage', { course: item })} // Use push to navigate to ExternalCoursesPage
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.courseImage} 
        resizeMode="cover" 
        onError={(error) => console.log('Image loading error:', error.nativeEvent.error)} 
      />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{item.name}</Text>
        <Text style={styles.courseAbout}>{item.about || 'Description not available.'}</Text>

        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }, (_, index) => (
            <Text key={index} style={styles.star}>
              {index < item.rating ? '★' : '☆'} {/* Display filled or empty stars based on rating */}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleExternalCoursesPress = () => {
    navigation.navigate('Courses/ExternalCoursesPage'); // Navigate to ExternalCoursesPage
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.userInfoContainer}>
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
        <TouchableOpacity style={styles.roundButton} onPress={handleExternalCoursesPress}>
          <Text style={styles.buttonText}>External Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundButton}>
          <Text style={styles.buttonText}>Certificates</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.popularCourseHeader}>
        <Text style={styles.popularCoursesText}>Popular Courses</Text>
      </View>

      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA', // Light background for contrast
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 10,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  learningBox: {
    backgroundColor: '#007AFF', // Bright blue box for emphasis
    padding: 30, // Increased padding for larger box
    borderRadius: 12,
    marginBottom: 70,
    alignItems: 'center',
    height: 170,
  },
  learningText: {
    fontSize: 40,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  exploreText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  roundButton: {
    backgroundColor: '#F1F3F5', // Light background color
    borderRadius: 50,
    paddingVertical: 15,
    width: windowWidth * 0.28, // Responsive button width
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.41,
    elevation: 3,
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14, // Increased font size for better readability
  },
  popularCourseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  popularCoursesText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  courseItem: {
    backgroundColor: '#ffffff',
    padding: 20, // Increased padding for course items
    marginBottom: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  courseInfo: {
    marginLeft: 15,
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  courseAbout: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 18,
    color: '#FFD700', // Gold color for stars
    marginRight: 3,
  },
  courseImage: {
    width: 70, // Increased width for better visibility
    height: 70, // Increased height for better visibility
    borderRadius: 10,
  },
});
