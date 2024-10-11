import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { db } from '../../configs/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AddEvent() {
  const [name, setName] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const navigation = useNavigation();

  // Function to handle event addition
  const handleAddEvent = async () => {
    if (!name || !imgUrl) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      await addDoc(collection(db, 'events'), {
        name: name,
        img: imgUrl,
      });
      Alert.alert('Success', 'Event added successfully');
      
      // Navigate back to the event list or another screen if needed
      navigation.goBack();
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Could not add event. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Add Volunteer Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imgUrl}
        onChangeText={(text) => setImgUrl(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
