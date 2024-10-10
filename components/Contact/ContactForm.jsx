// ContactForm.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Animated, Alert } from 'react-native';
import { db } from '../../configs/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!phone || phone.length < 10) newErrors.phone = 'Valid phone number is required';
    if (!subject) newErrors.subject = 'Subject is required';
    if (!message) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    try {
      const contactMessagesRef = collection(db, 'ContactMessages');
      await addDoc(contactMessagesRef, {
        name,
        email,
        phone,
        subject,
        message,
        timestamp: new Date(),
      });
      
      setShowModal(true);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
      
      setTimeout(() => {
        setShowModal(false);
        fadeAnim.setValue(0);
      }, 2000);
    } catch (error) {
      console.error('Error sending message: ', error);
      Alert.alert('Error', 'There was an issue sending your message. Please try again later.');
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Contact <Text style={styles.highlight}>us</Text></Text>
      <Text style={styles.subtitle}>We’re here to help you!</Text>

      <FloatingInput label="Name" value={name} onChangeText={setName} error={errors.name} />
      <FloatingInput label="Email" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" />
      <FloatingInput label="Phone Number" value={phone} onChangeText={setPhone} error={errors.phone} keyboardType="phone-pad" />
      <FloatingInput label="Subject" value={subject} onChangeText={setSubject} error={errors.subject} />
      <FloatingInput label="Message" value={message} onChangeText={setMessage} error={errors.message} multiline numberOfLines={6} isTextArea />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={showModal} animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <FontAwesome name="check-circle" size={64} color="#4caf50" />
            <Text style={styles.modalText}>Your message has been sent!</Text>
            <Text style={styles.modalText}>We will respond to you soon.</Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const FloatingInput = ({ label, value, onChangeText, error, isTextArea, ...props }) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={[styles.input, isTextArea && styles.textArea, error && styles.inputError]}
      placeholder={label}
      placeholderTextColor="#aaa"
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  formContainer: {
    width: '90%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  highlight: {
    color: '#4c669f',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    height: 48,
    backgroundColor: '#f1f3f6',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 120,
    paddingVertical: 10, // Additional padding for text area
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4c669f',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '75%',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 12,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
});
