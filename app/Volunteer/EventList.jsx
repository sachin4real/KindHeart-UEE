import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity , Image } from 'react-native';
import { db } from '../../configs/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import EventListCard from '../../components/Volunteer/EventListCard';
import VolunteerSlider from '../../components/Volunteer/VolunteerSlider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import VolunteerHeader from '../../components/Volunteer/VolunteerHeader';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function EventList() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const { user } = useUser();

  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>

  <Text style={styles.title}>Volunteer Oppotunities</Text>

    {/* profile */}
    <Image
         source={{ uri: user?.imageUrl }}
        style={styles.profileImage}
         />

       {/* Back Button */}
       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

    <VolunteerSlider style={styles.slider}/>

      <View style={styles.container}>
        <Text style={styles.title}>All Events</Text>
        <FlatList
          data={events}
          renderItem={({ item }) => <EventListCard event={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // Add your onPress action here, such as navigating to an event creation screen
          router.push('/Volunteer/AddEvent');
          console.log('FAB pressed');
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Matches the container background color
  },
  container: {
    marginTop:20,
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  slider: {
    marginTop: 20, 
    marginHorizontal: 16, 
    height: 120,
   
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust top margin as needed for safe area
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    position: 'absolute',
    top: 15, // Position it at the top of the header
    right: 16, // Align it to the right side
    zIndex: 10,
    },
    fab: {
      position: 'absolute',
      bottom: 50,
      right: 20,
      backgroundColor: '#007bff',
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5, // Adds shadow for Android
      shadowColor: '#000', // Adds shadow for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },

});
