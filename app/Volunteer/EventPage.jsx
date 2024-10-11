// EventPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator , TouchableOpacity } from 'react-native';
import { db } from '../../configs/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


export default function EventPage() {
  const route = useRoute(); // Get the route object using useRoute hook
  const { documentId } = route.params || {}; // Safe fallback if route or params is undefined
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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
          setEvent(eventSnap.data());
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

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loading} />;
  }

  if (!event) {
    return <Text>No event details found</Text>;
  }

  return (
    <View style={styles.container}>

            {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Image source={{ uri: event.img }} style={styles.image} />
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.description}>{event.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:20,
    paddingTop:30,
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
});
