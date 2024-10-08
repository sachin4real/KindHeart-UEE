// app/profile/Userintro.jsx

import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { doc, getDoc } from 'firebase/firestore'; // Firestore imports
import { db } from '../../configs/FirebaseConfig';
import { useRouter } from 'expo-router'; // Import useRouter

export default function Userintro() {
  const { user } = useUser(); // Clerk user
  const [donations, setDonations] = useState(0); // Initialize donations
  const [programsContributed, setProgramsContributed] = useState([]); // Programs user donated to
  const [achievements, setAchievements] = useState(null);
  const [nextAchievement, setNextAchievement] = useState(50000); // Default next achievement goal
  const [progress, setProgress] = useState(0); // Progress towards next achievement
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter(); // Initialize the router
  
  // Fetch user donations and program data from Firestore
  useEffect(() => {
    if (user?.id) {
      fetchUserData(user.id);
    }
  }, [user]);

  const fetchUserData = async (userID) => {
    try {
      const userDocRef = doc(db, 'Users', userID);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const totalDonations = userData.totalDonations || 0;

        setDonations(totalDonations);

        // Use the donatedPrograms field directly, which contains both program names and amounts
        if (userData.donatedPrograms && userData.donatedPrograms.length > 0) {
          setProgramsContributed(userData.donatedPrograms); // Set program names and amounts
        }

        calculateAchievements(totalDonations);
      } else {
        console.log('No user data found!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // End loading when data is fetched
    }
  };

  const calculateAchievements = (totalDonations) => {
    let achievement = null;
    let next = 50000; // Default for the gold medal

    if (totalDonations >= 50000) {
      achievement = 'gold';
      next = 100000; // Next achievement goal could be customized
    } else if (totalDonations >= 25000) {
      achievement = 'silver';
      next = 50000;
    } else if (totalDonations >= 10000) {
      achievement = 'bronze';
      next = 25000;
    }

    setAchievements(achievement);
    setNextAchievement(next);
    setProgress(totalDonations / next); // Progress is a ratio of totalDonations to next target
  };

  // Loading indicator
  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      {/* User Profile */}
      {user?.imageUrl ? (
        <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
      ) : (
        <Text style={styles.fallbackText}>No Image Available</Text>
      )}

      {/* Achievement Section */}
      {achievements && (
        <View style={styles.achievementContainer}>
          <Text style={styles.congratsText}>Congratulations 🎉 {user?.fullName || 'User'}!</Text>
          <Text style={styles.subText}>You have won a {achievements} medal!</Text>
          <Ionicons
            name="medal-outline"
            size={40}
            color={achievements === 'gold' ? '#FFD700' : achievements === 'silver' ? '#C0C0C0' : '#CD7F32'}
            style={styles.medalIcon}
          />
          <Text style={styles.donationsText}>
            <Text style={styles.highlight}>${donations.toLocaleString()} Donations!</Text>
          </Text>
        </View>
      )}

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{programsContributed.length}</Text>
          <Text style={styles.statLabel}>Programs Contributed</Text>
        </View>
      </View>

      {/* Progress Bar towards next achievement */}
      <View style={styles.impactContainer}>
        <Text style={styles.impactTitle}>Your Impact</Text>
        <Text style={styles.progressText}>
          Next Achievement: ${(nextAchievement - donations).toLocaleString()} left!
        </Text>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={progress}
          color="#007AFF"
          style={styles.progressBar}
        />
      </View>

      {/* Fundraise Button */}
      <TouchableOpacity style={styles.fundraiseButton} onPress={() => router.push('/fundraise/FundraiseForm')}>
        <Text style={styles.fundraiseButtonText}>Start a Fundraise</Text>
      </TouchableOpacity>

      {/* List Contributed Programs */}
      <Text style={styles.programsText}>Programs Contributed:</Text>
      <FlatList
        data={programsContributed}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.programItem}>
            <Text style={styles.programName}>{item.programName}</Text>
            <Text style={styles.programDonation}>
              Donated: <Text style={styles.highlight}>${item.amountDonated.toLocaleString()}</Text>
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    height: '100%',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#007AFF',
    marginBottom: 20,
  },
  achievementContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  congratsText: {
    fontFamily: 'outfit-bold',
    fontSize: 22,
    color: '#333',
  },
  subText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#555',
  },
  donationsText: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: '#007AFF',
    marginTop: 10,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  medalIcon: {
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'outfit-bold',
    fontSize: 22,
    color: '#333',
  },
  statLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: '#777',
  },
  impactContainer: {
    width: '100%',
    marginVertical: 20,
    alignItems: 'center',
  },
  impactTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    color: '#333',
  },
  progressText: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: '#777',
    marginVertical: 10,
  },
  progressBar: {
    width: '100%',
  },
  programsText: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    color: '#333',
    marginVertical: 10,
  },
  programItem: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  programName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  programDonation: {
    fontSize: 14,
    color: '#555',
  },
  fallbackText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  fundraiseButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  fundraiseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
