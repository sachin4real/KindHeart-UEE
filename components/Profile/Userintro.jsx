import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useRouter } from 'expo-router';

export default function Userintro() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [donations, setDonations] = useState(0);
  const [programsContributed, setProgramsContributed] = useState([]);
  const [achievements, setAchievements] = useState(null);
  const [nextAchievement, setNextAchievement] = useState(50000);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

        if (userData.donatedPrograms && userData.donatedPrograms.length > 0) {
          setProgramsContributed(userData.donatedPrograms);
        }

        calculateAchievements(totalDonations);
      } else {
        console.log('No user data found!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = (totalDonations) => {
    let achievement = null;
    let next = 50000;

    if (totalDonations >= 1000000) {
      achievement = 'gold';
      next = 1000000;
    } else if (totalDonations >= 500000) {
      achievement = 'silver';
      next = 1000000;
    } else if (totalDonations >= 100000) {
      achievement = 'bronze';
      next = 500000;
    }

    setAchievements(achievement);
    setNextAchievement(next);
    setProgress((totalDonations / next) * 100);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/"); // Redirects to the root screen after sign-out
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {user?.imageUrl ? (
        <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
      ) : (
        <Text style={styles.fallbackText}>No Image Available</Text>
      )}

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
            <Text style={styles.highlight}>Rs{donations.toLocaleString()} Donations!</Text>
          </Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{programsContributed.length}</Text>
          <Text style={styles.statLabel}>Programs Contributed</Text>
        </View>
      </View>

      <View style={styles.impactContainer}>
        <Text style={styles.impactTitle}>Your Impact</Text>
        <Text style={styles.progressText}>
          Rs{donations.toLocaleString()} donated towards Rs{nextAchievement.toLocaleString()}!
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <TouchableOpacity style={styles.fundraiseButton} onPress={() => router.push('/fundraise/FundraiseForm')}>
        <Text style={styles.fundraiseButtonText}>Start a Fundraise</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.MyVolunteer} onPress={() => router.push('/Volunteer/MyVolunteerEvents')}>
        <Text style={styles.MyVolunteerButtonText}>My Volunteering</Text>
      </TouchableOpacity>

      <Text style={styles.programsText}>Programs Contributed:</Text>
    </View>
  );

  const renderFooter = () => (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
     
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={programsContributed}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.programItem}>
          <Ionicons name="heart-outline" size={24} color="#738FFE" style={styles.programIcon} />
          <View style={styles.programDetails}>
            <Text style={styles.programName}>{item.programName}</Text>
            <Text style={styles.programDonation}>
              Donated: <Text style={styles.highlight}>Rs{item.amountDonated.toLocaleString()}</Text>
            </Text>
          </View>
        </View>
      )}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter} // Add logout button at the end of the list
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#738FFE',
    marginBottom: 20,
  },
  achievementContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 22,
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#555',
  },
  donationsText: {
    fontSize: 18,
    color: '#738FFE',
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
    justifyContent: 'center',
    width: '100%',
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  impactContainer: {
    width: '100%',
    marginVertical: 20,
    alignItems: 'center',
  },
  impactTitle: {
    fontSize: 18,
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    color: '#777',
    marginVertical: 10,
  },
  progressBar: {
    height: 10,
    width: '90%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#738FFE',
    borderRadius: 5,
  },
  programsText: {
    fontSize: 18,
    color: '#333',
    marginVertical: 10,
  },
  programItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  programIcon: {
    marginRight: 10,
  },
  programDetails: {
    flex: 1,
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
    fontSize: 16,
    color: '#738FFE',
    marginBottom: 10,
  },
  fundraiseButton: {
    backgroundColor: '#738FFE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  MyVolunteer: {
    backgroundColor: '#738FFE',
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
  MyVolunteerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5C5C',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
   
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
   
  },
});
