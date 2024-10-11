import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import { useUser, useAuth } from '@clerk/clerk-expo';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const { user } = useUser();
  const { signOut } = useAuth();

  useEffect(() => {
    const fetchFirestoreData = async () => {
      try {
        // Fetch Users Data
        const usersSnapshot = await getDocs(collection(db, 'Users'));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);

        // Fetch Programs Data
        const programsSnapshot = await getDocs(collection(db, 'ProgramList'));
        const programsData = programsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchFirestoreData();
  }, []);

  const handleDeleteProgram = async (programId) => {
    try {
      await deleteDoc(doc(db, 'ProgramList', programId));
      setPrograms(programs.filter(program => program.id !== programId));
      Alert.alert('Success', 'Program deleted successfully!');
    } catch (error) {
      console.error('Error deleting program: ', error);
      Alert.alert('Error', 'Failed to delete the program.');
    }
  };

  const handleUpdateProgram = async (programId) => {
    try {
      // Example of updating the program's name (can be extended as needed)
      await updateDoc(doc(db, 'ProgramList', programId), {
        name: 'Updated Program Name'
      });
      setPrograms(programs.map(program => program.id === programId ? { ...program, name: 'Updated Program Name' } : program));
      Alert.alert('Success', 'Program updated successfully!');
    } catch (error) {
      console.error('Error updating program: ', error);
      Alert.alert('Error', 'Failed to update the program.');
    }
  };

  const handleLogout = async () => {
    await signOut();
    Alert.alert('Logged Out', 'You have been logged out successfully.');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Hello Admin {user?.fullName || 'User'}!</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.subHeader}>User Donations</Text>
        {users.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.cardTitle}>User ID: {user.id}</Text>
            {user.donatedPrograms?.map((program, index) => (
              <View key={index} style={styles.donationDetail}>
                <Text>Program: {program.programName}</Text>
                <Text>Amount Donated: Rs{program.amountDonated.toLocaleString()}</Text>
              </View>
            ))}
            <Text>Total Donations: Rs{user.totalDonations?.toLocaleString() || 0}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Programs List</Text>
        {programs.map((program) => (
          <View key={program.id} style={styles.card}>
            <Text style={styles.cardTitle}>{program.name}</Text>
            <Text>About: {program.about}</Text>
            <Text>Category: {program.category}</Text>
            <Text>Donated Amount: Rs{program.donatedAmount.toLocaleString()}</Text>
            <Text>Goal Amount: Rs{program.goalAmount.toLocaleString()}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProgram(program.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateProgram(program.id)}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#4b7bec',
  },
  logoutButton: {
    backgroundColor: '#eb3b5a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    color: '#3867d6',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  donationDetail: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 16,
    color: '#7f8c8d',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  deleteButton: {
    backgroundColor: '#eb3b5a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  updateButton: {
    backgroundColor: '#4b7bec',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});