import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function PaymentDetails() {
  const { amount, programID } = useLocalSearchParams(); // Get donation amount and programID from params

  const handlePayment = () => {
    alert(`Processing payment of $${amount} for Program ID: ${programID}`);
    // Here you can integrate with your payment API (e.g., Stripe, PayPal, etc.)
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

      {/* Mock Card UI */}
      <Image source={{ uri: 'https://example.com/card_image.png' }} style={styles.cardImage} />

      {/* Payment Info */}
      <Text style={styles.infoText}>Cardholder Name: John Doe</Text>
      <Text style={styles.infoText}>Card Number: 0000 0000 0000 0000</Text>
      <Text style={styles.infoText}>Expiration Date: 00/00</Text>
      <Text style={styles.infoText}>CVC: ***</Text>

      {/* Donate Now Button */}
      <TouchableOpacity style={styles.donateButton} onPress={handlePayment}>
        <Text style={styles.donateButtonText}>Donate ${amount}</Text>
      </TouchableOpacity>
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
  cardImage: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
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
