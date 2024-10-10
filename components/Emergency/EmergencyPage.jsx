// EmergencyPage.jsx

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, TextInput, Vibration, Linking } from 'react-native';
import * as SMS from 'expo-sms';

export default function EmergencyPage() {
  const [showSosModal, setShowSosModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [selectedService, setSelectedService] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [contactNumber, setContactNumber] = useState('');
  const countdownInterval = useRef(null);
  const holdTimeout = useRef(null);

  const emergencyNumbers = {
    Medical: '1990',
    Fire: '110',
    'Natural Disaster': '102',
    Accident: '103',
    Violence: '104',
    Rescue: '105',
  };

  const handleEmergencySelection = (service) => {
    setSelectedService(service);
    setShowConfirmModal(true);
  };

  const handleConfirmCall = () => {
    setShowConfirmModal(false);
    const emergencyNumber = emergencyNumbers[selectedService];
    initiateEmergencyCall(emergencyNumber);
  };

  const initiateEmergencyCall = (mainNumber) => {
    // Call main emergency number
    Linking.openURL(`tel:${mainNumber}`);
    // Send emergency SMS to all contacts
    emergencyContacts.forEach(contact => {
      if (contact) {
        sendEmergencyMessage(contact);
      }
    });
    Vibration.vibrate([500, 1000, 500]); // Vibration pattern
  };

  const sendEmergencyMessage = async (number) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(number, "It's an emergency. Please assist!");
    } else {
      Alert.alert("Error", "SMS service is not available on this device.");
    }
  };

  const handlePressIn = () => {
    holdTimeout.current = setTimeout(() => {
      startSosCountdown();
    }, 5000);
  };

  const handlePressOut = () => {
    clearTimeout(holdTimeout.current);
  };

  const startSosCountdown = () => {
    Vibration.vibrate([500, 500, 500, 500, 500], true);
    setShowSosModal(true);
    setCountdown(5);

    countdownInterval.current = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval.current);
          Vibration.cancel();
          initiateEmergencyCall('911'); // Main emergency number for SOS
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const cancelSosCall = () => {
    clearInterval(countdownInterval.current);
    Vibration.cancel();
    setShowSosModal(false);
  };

  const addContact = () => {
    setEmergencyContacts([...emergencyContacts, contactNumber]);
    setShowAddContactModal(false);
    setContactNumber('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you in an emergency?</Text>
      <Text style={styles.subtitle}>
        Press the SOS button to quickly contact emergency services or select a specific type of emergency below.
      </Text>

      <TouchableOpacity
        style={styles.sosButton}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.sosButtonText}>SOS</Text>
        <Text style={styles.sosButtonSubtext}>Hold for 5 seconds</Text>
      </TouchableOpacity>

      <Text style={styles.emergencyText}>What's your emergency?</Text>
      <View style={styles.emergencyOptions}>
        {Object.keys(emergencyNumbers).map((service) => (
          <TouchableOpacity
            key={service}
            style={[styles.emergencyOption, { backgroundColor: getColor(service) }]}
            onPress={() => handleEmergencySelection(service)}
          >
            <Text style={styles.emergencyOptionText}>{service}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addContactButton}
        onPress={() => setShowAddContactModal(true)}
      >
        <Text style={styles.addContactButtonText}>Add Emergency Contact</Text>
      </TouchableOpacity>

      {/* SOS Countdown Modal */}
      <Modal
        transparent={true}
        visible={showSosModal}
        onRequestClose={cancelSosCall}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calling Emergency Services in {countdown}...</Text>
            <TouchableOpacity onPress={cancelSosCall} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal for Specific Services */}
      <Modal
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Call to {selectedService} Services?</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity onPress={handleConfirmCall} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowConfirmModal(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Emergency Contact Modal */}
      <Modal
        transparent={true}
        visible={showAddContactModal}
        onRequestClose={() => setShowAddContactModal(false)}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />
            <TouchableOpacity onPress={addContact} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getColor = (service) => {
  switch (service) {
    case 'Medical': return '#C1E1C1';
    case 'Fire': return '#FFCCCC';
    case 'Natural Disaster': return '#D5F5E3';
    case 'Accident': return '#D7BDE2';
    case 'Violence': return '#F5B7B1';
    case 'Rescue': return '#FAD7A0';
    default: return '#ffffff';
  }
};

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
    marginBottom: 20,
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
  emergencyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  emergencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emergencyOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  emergencyOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  addContactButton: {
    backgroundColor: '#4c669f',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  addContactButtonText: {
    color: '#fff',
    fontSize: 16,
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
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#4c669f',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#bbb',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4c669f',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});