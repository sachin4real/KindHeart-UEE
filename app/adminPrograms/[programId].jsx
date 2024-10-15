// adminPrograms/[programId].jsx

import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ProgramDetails() {
  const { programId } = useLocalSearchParams(); // Retrieves the dynamic parameter from URL
  const [program, setProgram] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const docRef = doc(db, 'ProgramList', programId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProgram({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching program details: ', error);
      }
    };

    if (programId) {
      fetchProgramDetails();
    }
  }, [programId]);

  const handleDeleteProgram = async () => {
    try {
      await deleteDoc(doc(db, 'ProgramList', programId));
      Alert.alert('Success', 'Program deleted successfully!');
      router.back();
    } catch (error) {
      console.error('Error deleting program: ', error);
      Alert.alert('Error', 'Failed to delete the program.');
    }
  };

  const handleUpdateProgram = async () => {
    try {
      const docRef = doc(db, 'ProgramList', programId);
      await updateDoc(docRef, {
        goalAmount: parseFloat(newGoalAmount),
      });
      setProgram(prev => ({ ...prev, goalAmount: parseFloat(newGoalAmount) }));
      setIsEditing(false);
      Alert.alert('Success', 'Goal amount updated successfully!');
    } catch (error) {
      console.error('Error updating goal amount: ', error);
      Alert.alert('Error', 'Failed to update the goal amount.');
    }
  };

  if (!program) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Image source={{ uri: program.imageUrl }} style={styles.programImage} />
          <Text style={styles.programTitle}>{program.name}</Text>
          <Text style={styles.programCategory}>Category: {program.category}</Text>
          <Text style={styles.programAbout}>{program.about}</Text>
          <Text style={styles.programDonated}>
            Donated Amount: Rs{program.donatedAmount.toLocaleString()}
          </Text>
          <Text style={styles.programGoal}>
            Goal Amount: Rs{program.goalAmount.toLocaleString()}
          </Text>

          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter new goal amount"
                value={newGoalAmount}
                keyboardType="numeric"
                onChangeText={setNewGoalAmount}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProgram}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProgram}>
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.updateButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Update Goal Amount</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  backButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  programImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  programTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  programCategory: {
    fontSize: 20,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  programAbout: {
    fontSize: 18,
    marginBottom: 15,
    color: '#000',
    textAlign: 'justify',
  },
  programDonated: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 5,
    textAlign: 'center',
  },
  programGoal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#eb3b5a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  updateButton: {
    backgroundColor: '#4b7bec',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  editContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    color: '#ffffff',
  },
});