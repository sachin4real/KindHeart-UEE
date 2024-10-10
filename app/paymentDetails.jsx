import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import * as Animatable from 'react-native-animatable';

export default function PaymentDetails() {
  const { amount, programID } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');

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
        `Your donation of Rs${amount} was successful to ${programName}.`,
        [{ text: 'OK', onPress: () => router.push('/thankYou') }]
      );

    } catch (error) {
      console.error('Error processing payment: ', error);
      Alert.alert('Payment failed', 'Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <Text style={styles.headerText}>Payment data</Text>
          <Text style={styles.amountText}>Total price</Text>
          <Text style={styles.amountValue}>Rs{amount}</Text>

          {/* Payment Method Selection */}
          <View style={styles.paymentOptions}>
            <TouchableOpacity style={[styles.paymentOption, styles.selectedOption]}>
              <Text style={[styles.paymentOptionText, styles.selectedOptionText]}>Credit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentOption}>
              <Text style={styles.paymentOptionText}>PayPal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentOption}>
              <Text style={styles.paymentOptionText}>Wallet</Text>
            </TouchableOpacity>
          </View>

          {/* Card Details Form */}
          <Animatable.View animation="fadeInUp" delay={200} style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Card number"
              placeholderTextColor="#A1A1A1"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Month / Year"
                placeholderTextColor="#A1A1A1"
                value={expirationDate}
                onChangeText={setExpirationDate}
              />
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="CVV"
                placeholderTextColor="#A1A1A1"
                value={cvc}
                onChangeText={setCvc}
                keyboardType="numeric"
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Cardholder Name"
              placeholderTextColor="#A1A1A1"
              value={cardName}
              onChangeText={setCardName}
            />
          </Animatable.View>

          {/* Donate Button */}
          <Animatable.View animation="pulse" iterationCount="infinite">
            <TouchableOpacity style={styles.donateButton} onPress={handlePayment}>
              <Text style={styles.donateButtonText}>Proceed to confirm</Text>
            </TouchableOpacity>
          </Animatable.View>
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
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  amountText: {
    fontSize: 16,
    color: '#A1A1A1',
    textAlign: 'left',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#738FFE',
    textAlign: 'left',
    marginBottom: 20,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  paymentOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#F0F0F0',
  },
  selectedOption: {
    backgroundColor: '#738FFE',
    borderColor: '#738FFE',
  },
  paymentOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#FFF',
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    width: '48%',
  },
  donateButton: {
    backgroundColor: '#738FFE',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  donateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
