import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EventPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { event } = route.params; // Get event data from route

  const handleJoinEvent = () => {
    // Mock functionality - in a real app, you could update the database to register the join action
    Alert.alert('Joined', `You have joined the event: ${event.name}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Image source={{ uri: event.img }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Event Details</Text>
          <Text style={styles.infoText}>Location: {event.location}</Text>
          <Text style={styles.infoText}>Start: {event.start}</Text>
          <Text style={styles.infoText}>End: {event.end}</Text>
          <Text style={styles.infoText}>Capacity: {event.capacity} Seats</Text>
          <Text style={styles.infoText}>Available Seats: {event.availableSeats}</Text>
        </View>

        <TouchableOpacity style={styles.joinButton} onPress={handleJoinEvent}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 60,
    marginBottom: 20,
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  joinButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
