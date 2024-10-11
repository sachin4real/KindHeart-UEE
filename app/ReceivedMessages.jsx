// ReceivedMessages.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking, Modal } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function ReceivedMessages({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesSnapshot = await getDocs(collection(db, 'ContactMessages'));
        const messagesData = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages: ', error);
      }
    };

    fetchMessages();
  }, []);

  const openPhone = (number) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to make a call');
    });
  };

  const openWhatsApp = (number) => {
    const url = `whatsapp://send?phone=${number}&text=Hello!`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on this device');
    });
  };

  const openEmail = (email) => {
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const handleMessagePress = (message) => {
    setSelectedMessage(message);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(db, 'ContactMessages', messageId));
      setMessages(messages.filter(message => message.id !== messageId));
      Alert.alert('Success', 'Message deleted successfully!');
      closeDetailsModal(); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting message: ', error);
      Alert.alert('Error', 'Failed to delete the message.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Received Messages</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {messages.map((message) => (
          <View key={message.id} style={styles.card}>
            <TouchableOpacity onPress={() => handleMessagePress(message)}>
              <Text style={styles.cardTitle}>{message.subject}</Text>
              <Text style={styles.messageText}>From: {message.name}</Text>
              <Text style={styles.timestampText}>Received: {new Date(message.timestamp?.seconds * 1000).toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteMessage(message.id)} style={styles.deleteButton}>
              <Ionicons name="trash" size={20} color="#FF2D55" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Message Details Modal */}
      <Modal
        transparent={true}
        visible={showDetailsModal}
        onRequestClose={closeDetailsModal}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Message Details</Text>
            {selectedMessage && (
              <>
                <Text style={styles.modalText}>From: {selectedMessage.name}</Text>
                <Text style={styles.modalText}>Email: {selectedMessage.email}</Text>
                <Text style={styles.modalText}>Phone: {selectedMessage.phone}</Text>
                <Text style={styles.modalText}>Message: {selectedMessage.message}</Text>
                <Text style={styles.modalText}>Received: {new Date(selectedMessage.timestamp?.seconds * 1000).toLocaleString()}</Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => openPhone(selectedMessage.phone)} style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openWhatsApp(selectedMessage.phone)} style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>WhatsApp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openEmail(selectedMessage.email)} style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Email</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <TouchableOpacity onPress={closeDetailsModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
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
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4b7bec',
    marginLeft: 10,
  },
  scrollView: {
    marginTop: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#4b7bec',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  deleteButton: {
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4b7bec',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

