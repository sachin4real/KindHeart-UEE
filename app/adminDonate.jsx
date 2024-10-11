// AdminDashboard.jsx

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import ReceivedMessages from './ReceivedMessages';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [activeProgramsCount, setActiveProgramsCount] = useState(0);
  const [donatorsCount, setDonatorsCount] = useState(0);
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // State for side navigation and current view
  const [showNav, setShowNav] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const fetchFirestoreData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'Users'));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        setDonatorsCount(usersData.length);

        const programsSnapshot = await getDocs(collection(db, 'ProgramList'));
        const programsData = programsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrograms(programsData);
        setActiveProgramsCount(programsData.length);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchFirestoreData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    Alert.alert('Logged Out', 'You have been logged out successfully.');
  };

  // Render received messages or admin dashboard based on the current view
  const renderContent = () => {
    if (currentView === 'receivedMessages') {
      return <ReceivedMessages onBack={() => setCurrentView('dashboard')} />;
    }

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>All Programs</Text>
            <Text style={styles.summaryValue}>{activeProgramsCount}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>All Donators</Text>
            <Text style={styles.summaryValue}>{donatorsCount}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Programs List</Text>
          {programs.map((program) => (
            <View key={program.id} style={styles.card}>
              <Image source={{ uri: program.imageUrl }} style={styles.programImage} />
              <Text style={styles.cardTitle}>{program.name}</Text>
              <Text>About: {program.about}</Text>
              <Text>Category: {program.category}</Text>
              <Text>Donated Amount: Rs{program.donatedAmount.toLocaleString()}</Text>
              <Text>Goal Amount: Rs{program.goalAmount.toLocaleString()}</Text>
              <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.viewButton} onPress={() => router.push(`/adminPrograms/${program.id}`)}>
  <Text style={styles.buttonText}>View</Text>
</TouchableOpacity>

              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Hello Admin {user?.fullName || 'User'}!</Text>
        <TouchableOpacity style={styles.profileImageContainer}>
          <Image source={{ uri: user?.profileImageUrl }} style={styles.profileImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowNav(true)} style={styles.navButton}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {renderContent()}

      {/* Side Navigation Modal */}
      <Modal visible={showNav} animationType="slide" transparent>
        <View style={styles.navContainer}>
          <View style={styles.navContent}>
            <Text style={styles.navTitle}>Navigation</Text>
            <TouchableOpacity style={styles.navItem} onPress={() => setCurrentView('dashboard')}>
              <Text style={styles.navText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setCurrentView('receivedMessages')}>
              <Text style={styles.navText}>Received Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowNav(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4b7bec',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    backgroundColor: '#4b7bec',
    borderRadius: 20,
    padding: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: '#738FFE',
    padding: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
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
  programImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  viewButton: {
    backgroundColor: '#4b7bec',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
  navContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  navContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  navItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  navText: {
    fontSize: 18,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});