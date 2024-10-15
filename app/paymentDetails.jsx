import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function PaymentDetails() {
  const { amount, programID } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');

  const validatePaymentDetails = () => {
    if (!cardName || !cardNumber || !expirationDate || !cvc) {
      Alert.alert('Error', 'All fields are required.');
      return false;
    }
    if (cardNumber.length !== 19) { // 16 digits with spaces
      Alert.alert('Error', 'Card number must be 16 digits.');
      return false;
    }
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expirationDate)) {
      Alert.alert('Error', 'Expiration date must be in MM/YY format.');
      return false;
    }
    const [month, year] = expirationDate.split('/');
    const currentDate = new Date();
    const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2), 10);
    const currentMonth = currentDate.getMonth() + 1;
    if (parseInt(year, 10) < currentYear || (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)) {
      Alert.alert('Error', 'Card expiration date cannot be in the past.');
      return false;
    }
    if (cvc.length !== 3) {
      Alert.alert('Error', 'CVC must be 3 digits.');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validatePaymentDetails()) {
      return;
    }
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

  const handleCardNumberChange = (text) => {
    const formattedText = text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formattedText);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Back Button */}
        
          
          <View style={styles.headerContainer}>
  <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} color="#4E6AFF" />
  </TouchableOpacity>
  <Text style={styles.amountText}>Total Price</Text>
</View>
          <Text style={styles.amountValue}>Rs{amount}</Text>

          {/* Image between Payment Selection and Card Form */}
          <Image 
            source={require('../assets/images/card.png')} 
            style={styles.image} 
            resizeMode='contain' 
          />

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
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              maxLength={19}
            />
            <View style={styles.row}>
              <TextInput
  style={[styles.input, styles.smallInput]}
  placeholder="MM/YY"
  placeholderTextColor="#A1A1A1"
  value={expirationDate}
  onChangeText={(text) => setExpirationDate(text.length === 2 && !text.includes('/') ? text + '/' : text)}
  keyboardType="numeric"
  maxLength={5}
/>
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="CVV"
                placeholderTextColor="#A1A1A1"
                value={cvc}
                onChangeText={setCvc}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            <TextInput
  style={styles.input}
  placeholder="Cardholder Name"
  placeholderTextColor="#A1A1A1"
  value={cardName}
  onChangeText={setCardName}
  keyboardType="default"
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
  backButton: {
    marginBottom: 10,
  },
  backIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#738FFE',
  },
  amountText: {
    fontSize: 20,
    color: '#A1A1A1',
    textAlign: 'left',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4E6AFF',
    textAlign: 'left',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
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
    backgroundColor: '#4E6AFF',
    borderColor: '#4E6AFF',
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
    backgroundColor: '#4E6AFF',
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