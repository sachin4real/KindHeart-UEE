import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  FlatList,
} from 'react-native';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const AdminRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestTypes, setRequestTypes] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsSnapshot = await getDocs(collection(db, 'AssistanceRequests'));
        const requestsData = requestsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(requestsData);
        
        // Categorize requests by type
        const types = [...new Set(requestsData.map(req => req.assistanceType))];
        setRequestTypes(types);
      } catch (error) {
        console.error('Error fetching requests: ', error);
      }
    };

    fetchRequests();
  }, []);

  const handleDeleteRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'AssistanceRequests', requestId));
      setRequests(requests.filter(request => request.id !== requestId));
      Alert.alert('Success', 'Request deleted successfully!');
    } catch (error) {
      console.error('Error deleting request: ', error);
      Alert.alert('Error', 'Failed to delete the request.');
    }
  };

  const openPhone = (number) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to make a call');
    });
  };

  const handleRequestPress = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.assistanceType}</Text>
      <Text style={styles.messageText}>From: {item.name}</Text>
      <Text style={styles.messageText}>Contact: {item.contact}</Text>
      <Text style={styles.messageText}>Details: {item.details}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.callButton} onPress={() => openPhone(item.contact)}>
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRequest(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailsButton} onPress={() => handleRequestPress(item)}>
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRequestTypeSection = (type) => (
    <View style={styles.section}>
      <Text style={styles.subHeader}>{type} Requests</Text>
      <FlatList
        data={requests.filter(req => req.assistanceType === type)}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.requestList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assistance Requests</Text>
      <ScrollView>
        {requestTypes.map((type, index) => (
          <View key={index}>{renderRequestTypeSection(type)}</View>
        ))}
      </ScrollView>

      {/* Request Details Modal */}
      <Modal
        transparent={true}
        visible={showDetailsModal}
        onRequestClose={closeDetailsModal}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Details</Text>
            {selectedRequest && (
              <>
                <Text style={styles.modalText}>Name: {selectedRequest.name}</Text>
                <Text style={styles.modalText}>Contact: {selectedRequest.contact}</Text>
                <Text style={styles.modalText}>Type: {selectedRequest.assistanceType}</Text>
                <Text style={styles.modalText}>Details: {selectedRequest.details}</Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4b7bec',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    color: '#3867d6',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  messageText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  callButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#eb3b5a',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: '#4b7bec',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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

export default AdminRequestPage;
