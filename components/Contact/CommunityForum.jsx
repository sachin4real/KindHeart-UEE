import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Alert, Image, Keyboard } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { db } from '../../configs/FirebaseConfig';
import { collection, addDoc, onSnapshot, orderBy, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo'; // Assuming you're using Clerk for authentication

export default function CommunityPage() {
  const { user } = useUser(); // Get the current user's information
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    const messagesRef = collection(db, 'CommunityMessages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddOrUpdateMessage = async () => {
    if (currentMessage.trim() === '') {
      Alert.alert('Error', 'Message cannot be empty.');
      return;
    }

    try {
      if (editingMessage) {
        // Update existing message
        const messageRef = doc(db, 'CommunityMessages', editingMessage.id);
        await updateDoc(messageRef, { content: currentMessage });
        setEditingMessage(null);
      } else {
        // Add new message
        const messagesRef = collection(db, 'CommunityMessages');
        await addDoc(messagesRef, {
          userName: user.fullName || 'Anonymous', // Replace with actual user name
          avatarUrl: user.profileImageUrl || 'https://via.placeholder.com/40', // Replace with actual user avatar
          content: currentMessage,
          timestamp: new Date(),
          userId: user.id, // Store the user ID for later reference
        });
      }

      setCurrentMessage('');
      setShowModal(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error posting message: ', error);
      Alert.alert('Error', 'Could not post message. Try again.');
    }
  };

  const handleEditMessage = (message) => {
    if (message.userId !== user.id) {
      Alert.alert('Error', 'You can only edit your own messages.');
      return;
    }
    setCurrentMessage(message.content);
    setEditingMessage(message);
    setShowModal(true);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const messageRef = doc(db, 'CommunityMessages', messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error('Error deleting message: ', error);
      Alert.alert('Error', 'Could not delete message. Try again.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.timeText}>{new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}</Text>
        <Text style={styles.messageText}>{item.content}</Text>
        <View style={styles.actionContainer}>
          {item.userId === user.id && ( // Show edit and delete buttons only for the message owner
            <>
              <TouchableOpacity onPress={() => handleEditMessage(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={16} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteMessage(item.id)} style={styles.actionButton}>
                <FontAwesome name="trash" size={16} color="#FF3B30" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello {user.fullName || 'User'}!</Text>
      <Text style={styles.subtitle}>Wellness Hub</Text>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <MaterialIcons name="edit" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingMessage ? 'Edit Message' : 'Add a New Message'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your message here..."
              value={currentMessage}
              onChangeText={setCurrentMessage}
              multiline
            />
            <TouchableOpacity style={styles.postButton} onPress={handleAddOrUpdateMessage}>
              <Text style={styles.postButtonText}>{editingMessage ? 'Update' : 'Post'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
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
    width: "100%",
    backgroundColor: '#f8fafc',
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#6e44ff',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageList: {
    paddingHorizontal: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  messageContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  actionContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 28,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
  },
  postButton: {
    marginTop: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
  },
});
