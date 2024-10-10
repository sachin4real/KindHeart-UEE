import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Add useRouter
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // For the back button icon

export default function Payment() {
  const { paymentID } = useLocalSearchParams();
  const [donationAmount, setDonationAmount] = useState('');
  const [program, setProgram] = useState(null);
  const [predefinedAmount, setPredefinedAmount] = useState('15.00'); // Default selected amount
  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    GetProgramDetailsById();
  }, []);

  const GetProgramDetailsById = async () => {
    const docRef = doc(db, 'ProgramList', paymentID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProgram(docSnap.data());
    } else {
      console.log('No such Document');
    }
  };

  const handleDonate = () => {
    const amount = donationAmount || predefinedAmount; // Use predefined or typed amount
    // Navigate to the new payment details page with donation amount as a parameter
    router.push({
      pathname: '/paymentDetails',
      params: { amount, programID: paymentID },
    });
  };

  if (!program) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Calculate donation percentage
  const donationPercentage = (program.donatedAmount / program.goalAmount) * 100;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Program Image Section with Back Button */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: program.imageUrl }} style={styles.image} />
          <View style={styles.imageOverlay} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Program Title */}
        <View style={styles.contentWrapper}>
          <Text style={styles.headerText}>{program.name}</Text>

          {/* Donation Progress */}
          <Text style={styles.donationText}>{`$${program.donatedAmount} / $${program.goalAmount}`}</Text>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${donationPercentage}%` }]} />
          </View>

          {/* Predefined Donation Amounts */}
          <Text style={styles.label}>Donation Amount</Text>
          <View style={styles.predefinedAmounts}>
            {['5.00', '15.00', '25.00'].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  predefinedAmount === amount && styles.amountButtonSelected,
                ]}
                onPress={() => setPredefinedAmount(amount)}
              >
                <Text style={[styles.amountText, predefinedAmount === amount && styles.amountTextSelected]}>
                  ${amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Donation Amount Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter your donation amount"
            keyboardType="numeric"
            value={donationAmount}
            onChangeText={(value) => setDonationAmount(value)}
            returnKeyType="done" // Adds a "Done" button on the keyboard
            onSubmitEditing={handleDonate} // Trigger donation when done is pressed
          />

          {/* Donate Button */}
          <TouchableOpacity onPress={handleDonate} style={styles.donateButton}>
            <Text style={styles.donateButtonText}>
              Donate Rs{donationAmount || predefinedAmount}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darker overlay for text visibility
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
  contentWrapper: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'outfit-medium',
    marginBottom: 10,
    marginTop: 10,
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
  label: {
    fontSize: 16,
    fontFamily: 'outfit',
    marginBottom: 10,
  },
  predefinedAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  amountButtonSelected: {
    backgroundColor: '#738FFE',
    borderColor: '#738FFE',
  },
  amountText: {
    fontSize: 16,
    color: '#000',
  },
  amountTextSelected: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  donateButton: {
    backgroundColor: '#738FFE',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'outfit-medium',
  },
});
