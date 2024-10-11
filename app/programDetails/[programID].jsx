import { View, Text, ActivityIndicator, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; 

export default function ProgramDetails() {
  const { programID } = useLocalSearchParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    GetProgramDetailsById();
  }, []);

  const GetProgramDetailsById = async () => {
    setLoading(true);
    const docRef = doc(db, 'ProgramList', programID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProgram(docSnap.data());
    } else {
      console.log("No such Document");
    }
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: '70%' }} size={'large'} />;
  }

  if (!program) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Program details not available</Text>
      </View>
    );
  }

  const donationPercentage = (program.donatedAmount / program.goalAmount) * 100;

  const handleHelpNowPress = () => {
    // Check if the donation goal is already met
    if (program.donatedAmount >= program.goalAmount) {
      Alert.alert("Goal Reached", "This charity program has already reached its donation goal.");
    } else {
      // Navigate to payment if the goal hasn't been reached
      router.push(`/payment/${programID}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Program Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: program.imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartButton}>
          <FontAwesome name="heart-o" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.imageOverlay} />
      </View>

      {/* Program Info Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{program.name}</Text>

        {/* Donation Progress */}
        <Text style={styles.donationText}>
          {`Rs${program.donatedAmount} / Rs${program.goalAmount}`}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(donationPercentage, 100)}%` }]} />
        </View>

        {/* About Section */}
        <Text style={styles.aboutHeader}>About</Text>
        <Text style={styles.aboutText}>{program.about}</Text>

        {/* Help Now Button */}
        <TouchableOpacity style={styles.helpNowButton} onPress={handleHelpNowPress}>
          <Text style={styles.helpNowButtonText}>Help Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    opacity: 0.9,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
    zIndex: 2,
  },
  heartButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
    zIndex: 2,
  },
  contentContainer: {
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'outfit-medium',
    marginBottom: 10,
  },
  donationText: {
    fontFamily: 'outfit',
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#738FFE',
    borderRadius: 5,
  },
  aboutHeader: {
    fontSize: 20,
    fontFamily: 'outfit-medium',
    marginBottom: 10,
  },
  aboutText: {
    fontFamily: 'outfit',
    fontSize: 14,
    marginBottom: 20,
  },
  helpNowButton: {
    backgroundColor: '#738FFE',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  helpNowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'outfit-medium',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
