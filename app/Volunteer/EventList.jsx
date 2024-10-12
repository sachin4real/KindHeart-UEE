// EventList.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { db } from '../../configs/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import EventListCard from '../../components/Volunteer/EventListCard';
import VolunteerSlider from '../../components/Volunteer/VolunteerSlider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function EventList() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(true); // State to toggle view
  const { user } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all events
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch user-specific events from myEvents collection
        const myEventsCollection = collection(db, 'myEvents');
        const myEventsSnapshot = await getDocs(myEventsCollection);
        const myEventsList = myEventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(eventsList);
        setMyEvents(myEventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventPress = (eventId) => {
    router.push({
      pathname: '/Volunteer/EventPage',
      params: { documentId: eventId },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Text style={styles.titleVoluntterOpp}>Volunteer Opportunities</Text>

      {/* Profile Image */}
      <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <VolunteerSlider style={styles.slider} />

      {/* Toggle Buttons for All Events and My Events */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, showAllEvents && styles.activeButton]}
          onPress={() => setShowAllEvents(true)}
        >
          <Text style={styles.buttonText}>All Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !showAllEvents && styles.activeButton]}
          onPress={() => setShowAllEvents(false)}
        >
          <Text style={styles.buttonText}>My Events</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={showAllEvents ? events : myEvents} // Toggle between all events and my events
        renderItem={({ item }) => (
          <EventListCard
            event={item}
            onPress={() => handleEventPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/Volunteer/AddEvent')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    marginTop: 20,
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
  titleVoluntterOpp: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginVertical: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  toggleButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#4E6AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    top: 40,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    position: 'absolute',
    top: 35,
    right: 16,
    zIndex: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#4E6AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
});
