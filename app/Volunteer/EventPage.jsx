// EventPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { db } from '../../configs/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EventPage() {
  const route = useRoute();
  const { documentId } = route.params || {};
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const router = useRouter();

  useEffect(() => {
    if (!documentId) {
      console.error("No documentId provided in route params.");
      return;
    }

    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, 'events', documentId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          const eventData = eventSnap.data();

          // Format start and end timestamps to date and time strings
          if (eventData.start) {
            eventData.start = eventData.start.toDate(); // Convert Firestore timestamp to JS Date object
          }
          if (eventData.end) {
            eventData.end = eventData.end.toDate(); // Convert Firestore timestamp to JS Date object
          }

          setEvent(eventData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [documentId]);

//   const handleJoin = () => {
//     Alert.alert("Joined", "You have successfully joined this event.");
//     // Additional logic for joining the event can be added here
//   };
    const handleJoin = () => {
    Alert.alert("Joined", "You have successfully joined this event.", [
      {
        text: "OK",
        onPress: () => router.push('/Volunteer/VolunteerJoinedPrompt')
      }
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loading} />;
  }

  if (!event) {
    return <Text>No event details found</Text>;
  }

  // Helper function to format date and time
  const formatDateTime = (date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.titleVoluntterOpp}>{event.name}</Text>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Event Image */}
        <Image source={{ uri: event.img }} style={styles.image} />

        {/* Combined Content Container */}
        <View style={styles.combinedContainer}>
          <Text style={styles.title}>{event.name}</Text>
          <Text style={styles.description}>{event.description}</Text>

          {/* Event Details */}
          <Text style={styles.detailsTitle}>Event Details</Text>
          <Text style={styles.detail}>Location: {event.location || 'N/A'}</Text>
          <Text style={styles.detail}>Schedule Start: {event.start ? formatDateTime(event.start) : 'N/A'}</Text>
          <Text style={styles.detail}>Schedule End: {event.end ? formatDateTime(event.end) : 'N/A'}</Text>
          <Text style={styles.detail}>Capacity: {event.capacity || 'N/A'} Seats</Text>
          <Text style={styles.detail}>Available Seats: {event.availableSeats || 'N/A'}</Text>
        </View>

        {/* Join Button */}
        <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    padding: 10,
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  combinedContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  joinButton: {
    backgroundColor: '#738FFE',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  titleVoluntterOpp: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginVertical: 20,
    color: '#333',
  },
});
