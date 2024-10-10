import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { db } from '../../configs/FirebaseConfig';
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
      const programListRef = collection(db, 'ProgramList');
      await addDoc(programListRef, {
        name: programName,
        goalAmount: Number(goalAmount),
        about,
        category,
        imageUrl,
        donatedAmount: 0,
      });

      router.push('/profile');
    } catch (error) {
      console.error('Error creating fundraise: ', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Create a New Fundraiser</Text>
          
          {/* Decorative Image */}
          <Image 
            source={require('../../assets/images/donate.jpg')} 
            style={styles.decorativeImage} 
            resizeMode="contain"
          />

          {/* Form Inputs */}
          <TextInput
            style={styles.input}
            placeholder="Program Name"
            placeholderTextColor="#738FFE"
            value={programName}
            onChangeText={setProgramName}
          />
          <TextInput
            style={styles.input}
            placeholder="Goal Amount"
            placeholderTextColor="#738FFE"
            keyboardType="numeric"
            value={goalAmount}
            onChangeText={setGoalAmount}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="About the Program"
            placeholderTextColor="#738FFE"
            multiline
            value={about}
            onChangeText={setAbout}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            placeholderTextColor="#738FFE"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            placeholderTextColor="#738FFE"
            value={imageUrl}
            onChangeText={setImageUrl}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleCreateFundraise}>
            <Text style={styles.buttonText}>Create Fundraise</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  scrollContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontFamily: 'outfit-bold',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4A4A4A',
    marginBottom: 20,
  },
  decorativeImage: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    borderRadius: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#738FFE',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: '#333',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#738FFE',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
