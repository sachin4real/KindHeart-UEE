// app/fundraise/FundraiseForm.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../../configs/FirebaseConfig'; // Import your Firebase config
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function FundraiseForm() {
  const router = useRouter();
  const [programName, setProgramName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [about, setAbout] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleCreateFundraise = async () => {
    try {
      // Add new program to Firestore
      const programListRef = collection(db, 'ProgramList');
      await addDoc(programListRef, {
        name: programName,
        goalAmount: Number(goalAmount),
        about,
        category,
        imageUrl,
        donatedAmount: 0, // Default donated amount
      });

      // Navigate back after successful creation
      router.push('/profile'); // Go back to profile after the fundraise is created
    } catch (error) {
      console.error('Error creating fundraise: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Fundraiser</Text>

      <TextInput
        style={styles.input}
        placeholder="Program Name"
        value={programName}
        onChangeText={setProgramName}
      />
      <TextInput
        style={styles.input}
        placeholder="Goal Amount"
        keyboardType="numeric"
        value={goalAmount}
        onChangeText={setGoalAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="About the Program"
        value={about}
        onChangeText={setAbout}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateFundraise}>
        <Text style={styles.buttonText}>Create Fundraise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
