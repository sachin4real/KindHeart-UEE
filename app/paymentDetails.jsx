import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore'; // Firestore imports
import { db } from '../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo'; // Import Clerk's useUser hook
import * as Animatable from 'react-native-animatable'; // For simple animations

export default function PaymentDetails() {
  const { amount, programID } = useLocalSearchParams(); // Get donation amount and programID from params
  const router = useRouter();
  
  // Use Clerk's useUser hook to get the authenticated user
  const { user } = useUser();

  // State to hold card details
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Handle Payment Function
  const handlePayment = async () => {
    try {
      const userID = user?.id; // Fetch the authenticated user's ID from Clerk

      // Fetch the program name from Firestore using the programID
      const programDocRef = doc(db, 'ProgramList', programID);
      const programDocSnap = await getDoc(programDocRef);

      if (!programDocSnap.exists()) {
        throw new Error('Program not found');
      }

      const programData = programDocSnap.data();
      const programName = programData?.name;

      // Fetch the user's document
      const userDocRef = doc(db, 'Users', userID);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // If user exists, update their donation amount and programs
        const userData = userDocSnap.data();
        const existingPrograms = userData.donatedPrograms || [];
        const existingProgram = existingPrograms.find(p => p.programName === programName);

        if (existingProgram) {
          // If the user already donated to this program, update the donation amount
          await updateDoc(userDocRef, {
            donatedPrograms: existingPrograms.map(p =>
              p.programName === programName
                ? { programName: p.programName, amountDonated: p.amountDonated + Number(amount) }
                : p
            ),
            totalDonations: increment(Number(amount)), // Update the total donations
          });
        } else {
          // If the user hasn't donated to this program before, add a new entry
          await updateDoc(userDocRef, {
            donatedPrograms: arrayUnion({ programName, amountDonated: Number(amount) }), // Add new donation for the program
            totalDonations: increment(Number(amount)), // Update the total donations
          });
        }
      } else {
        // Create a new user document with initial donation data and add the first donated program
        await setDoc(userDocRef, {
          totalDonations: Number(amount),
          achievements: [],
          donatedPrograms: [{ programName, amountDonated: Number(amount) }], // Initialize with the current program and amount
        });
      }

      // Update the donatedAmount in the ProgramList
      await updateDoc(programDocRef, {
        donatedAmount: increment(Number(amount)),
      });

      // Show success alert
      Alert.alert(
        'Thank You!',
        `Your donation of $${amount} was successful to ${programName}.`,
        [{ text: 'OK', onPress: () => router.push('/thankYou') }]
      );

    } catch (error) {
      console.error('Error processing payment: ', error);
      Alert.alert('Payment failed', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Payment Options UI */}
      <View style={styles.paymentOptions}>
        <TouchableOpacity style={styles.paymentOption}>
          <Text>Credit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
          <Text>Venmo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
          <Text>PayPal</Text>
        </TouchableOpacity>
      </View>

      {/* Animated Card Details Form */}
      <Animatable.View animation="fadeInUp" delay={200} style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Cardholder Name"
          value={cardName}
          onChangeText={setCardName}
        />
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="Expiration Date (MM/YY)"
            value={expirationDate}
            onChangeText={setExpirationDate}
          />
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="CVC"
            value={cvc}
            onChangeText={setCvc}
            keyboardType="numeric"
          />
        </View>
      </Animatable.View>

      {/* Donate Now Button with animation */}
      <Animatable.View animation="pulse" iterationCount="infinite">
        <TouchableOpacity style={styles.donateButton} onPress={handlePayment}>
          <Text style={styles.donateButtonText}>Donate ${amount}</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  paymentOption: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    width: '48%',
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
  },
});
