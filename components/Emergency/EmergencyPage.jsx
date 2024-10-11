import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, TextInput, Vibration, Linking, Image } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
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

  const emergencyIcons = {
    Medical: 'hospital',
    Fire: 'fire-extinguisher',
    'Natural Disaster': 'cloud-showers-heavy',
    Accident: 'car-crash',
    Violence: 'shield-alt',
    Rescue: 'life-ring',
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
    Linking.openURL(`tel:${mainNumber}`);
    emergencyContacts.forEach(contact => {
      if (contact) {
        sendEmergencyMessage(contact);
      }
    });
    Vibration.vibrate([500, 1000, 500]);
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
          initiateEmergencyCall('911');
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
      <View style={styles.header}>
        <Image source={require('../../assets/images/contactus.jpeg')} style={styles.headerImage} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Are you in an emergency?</Text>
          <Text style={styles.subtitle}>
            Press the SOS button, and your live location will be shared with the nearest help center and your emergency contacts.
          </Text>
        </View>
      </View>

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
            <FontAwesome5 name={emergencyIcons[service]} size={24} color="#333" />
            <Text style={styles.emergencyOptionText}>{service}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addContactButton}
        onPress={() => setShowAddContactModal(true)}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
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
    marginTop : 100,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
    width : "100%",
    height : "100%"
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  headerImage: {
    width: 150,
    height: 170,
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom : 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
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
    marginTop :20,
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
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5,
  },
  emergencyOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  addContactButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
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
    backgroundColor: '#4CAF50',
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
    backgroundColor: '#ff4d4d',
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
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
