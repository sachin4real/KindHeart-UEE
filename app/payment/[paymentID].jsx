import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Add useRouter
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';

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
        {/* Program Image */}
        <Image source={{ uri: program.imageUrl }} style={styles.image} />

        {/* Program Title */}
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
            Donate ${donationAmount || predefinedAmount}
          </Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
    opacity: 0.9,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'outfit-medium',
    marginBottom: 20,
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
    backgroundColor: '#0a7ea4',
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
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  amountButtonSelected: {
    backgroundColor: '#e0e0ff',
    borderColor: '#8a2be2',
  },
  amountText: {
    fontSize: 16,
    color: '#000',
  },
  amountTextSelected: {
    color: '#8a2be2',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 20,
  },
  donateButton: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'outfit-medium',
  },
});
