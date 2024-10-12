import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Button, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { db } from '../../configs/FirebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddEvent() {
  const [name, setName] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startSchedule, setStartSchedule] = useState(new Date());
  const [capacity, setCapacity] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);

  const navigation = useNavigation();

  const handleAddEvent = async () => {
    if (!name || !imgUrl || !description || !location || !startSchedule || !capacity || !availableSeats) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'events'), {
        name,
        img: imgUrl,
        description,
        location,
        startSchedule: Timestamp.fromDate(startSchedule), // Store as Firestore Timestamp
        capacity: parseInt(capacity, 10),
        availableSeats: parseInt(availableSeats, 10),
      });
      Alert.alert('Success', 'Event added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Could not add event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startSchedule;
    setShowStartPicker(false);
    setStartSchedule(currentDate);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Volunteer Event</Text>

        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., Food for Needy"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.inputDescription}
          placeholder="E.g., We aim to provide food packs..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., https://example.com/event-image.jpg"
          value={imgUrl}
          onChangeText={setImgUrl}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., Malabe Child Care"
          value={location}
          onChangeText={setLocation}
        />

        {/* Start Schedule Date */}
        <Text style={styles.label}>Start Schedule</Text>
        <TextInput
          style={styles.input}
          value={startSchedule.toDateString()} // Display only date
          editable={false}
        />
        <Button title="Set Start Date" onPress={() => setShowStartPicker(true)} />
        {showStartPicker && (
          <DateTimePicker
            value={startSchedule}
            mode="date" // Set to date only
            display="default"
            onChange={handleStartDateChange}
          />
        )}

        <Text style={styles.label}>Capacity</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., 20"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Available Seats</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., 5"
          value={availableSeats}
          onChangeText={setAvailableSeats}
          keyboardType="numeric"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
            <Text style={styles.buttonText}>Add Event</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    width: '90%',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'left',
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10, // Reduced bottom margin here
    backgroundColor: '#fff',
    color: '#333',
  },
  inputDescription: {
    height: 90,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#738FFE',
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
