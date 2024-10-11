import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { db } from '../../configs/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import EventListCard from '../../components/Volunteer/EventListCard';
import VolunteerSlider from '../../components/Volunteer/VolunteerSlider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import VolunteerHeader from '../../components/Volunteer/VolunteerHeader';

export default function EventList() {
  const [events, setEvents] = useState([]);

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

    <VolunteerHeader/>

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
    marginTop:40,
    
    height: 120,
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust top margin as needed for safe area
    left: 10,
    padding: 10,
    zIndex: 10,
  },

});
