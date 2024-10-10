// EmergencyPage.jsx

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Alert, Linking, Vibration } from 'react-native';

export default function EmergencyPage() {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const countdownInterval = useRef(null);
  const holdTimeout = useRef(null);

  const handlePressIn = () => {
    // Start a timeout to detect if the button is held for 5 seconds
    holdTimeout.current = setTimeout(() => {
      startCountdown();
    }, 5000);
  };

  const handlePressOut = () => {
    // Clear the timeout if the button is released before 5 seconds
    clearTimeout(holdTimeout.current);
  };

  const startCountdown = () => {
    Vibration.vibrate([500, 500, 500, 500, 500], true); // Start vibration pattern
    setShowModal(true);
    setCountdown(5);

    countdownInterval.current = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval.current);
          Vibration.cancel(); // Stop vibration
          makeEmergencyCall();
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const makeEmergencyCall = () => {
    setShowModal(false);
    Linking.openURL('tel:911'); // Replace with the appropriate emergency number
  };

  const cancelEmergencyCall = () => {
    clearInterval(countdownInterval.current);
    Vibration.cancel(); // Stop vibration if canceled
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you in an emergency?</Text>
      <Text style={styles.subtitle}>
        Press the SOS button, your live location will be shared with the nearest help centre and your emergency contacts.
      </Text>

      <TouchableOpacity
        style={styles.sosButton}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.sosButtonText}>SOS</Text>
        <Text style={styles.sosButtonSubtext}>Press and hold for 5 seconds</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={showModal}
        onRequestClose={cancelEmergencyCall}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calling Emergency Services in {countdown}...</Text>
            <TouchableOpacity onPress={cancelEmergencyCall} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d2d2d',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 40,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff4d4d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  sosButtonSubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4d4d',
    marginBottom: 20,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#4c669f',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
