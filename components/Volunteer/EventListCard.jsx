// EventListCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function EventListCard({ event }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: event.img }} style={styles.image} resizeMode="cover" />
      <Text style={styles.name}>{event.name}</Text>
      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
      width: '45%',
      marginVertical: 10, // Adds spacing between rows
      marginHorizontal: 10,
      borderRadius: 15, // Slightly rounded corners
      backgroundColor: '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
      padding: 15,
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: 120,
      borderRadius: 10,
      marginBottom: 10,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      marginBottom: 10,
    },
    joinButton: {
      backgroundColor: '#007bff', // A nice blue color
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 20,
    },
    joinButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
  });
