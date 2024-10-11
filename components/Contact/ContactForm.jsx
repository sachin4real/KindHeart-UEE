import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Animated, Alert, Keyboard, TouchableWithoutFeedback, Linking, ScrollView, Image } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { db } from '../../configs/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function ContactForm({ onShowAboutUs }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const contactNumber = '+94714337912';
  const contactEmail = 'nexcodiainc@gmail.com';

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
      
      setShowSuccessModal(true);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
      
      setTimeout(() => {
        setShowSuccessModal(false);
        fadeAnim.setValue(0);
      }, 2000);
    } catch (error) {
      console.error('Error sending message: ', error);
      Alert.alert('Error', 'There was an issue sending your message. Please try again later.');
    }
  };

  const openWhatsApp = () => {
    const url = `whatsapp://send?phone=${contactNumber}&text=Hello! I would like to get in touch.`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on this device');
    });
  };

  const openEmail = () => {
    const url = `mailto:${contactEmail}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const openPhone = () => {
    const url = `tel:${contactNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to make a call');
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.mainTitle}>Contact Us</Text>
        <Image source={require('../../assets/images/contactus.jpeg')} style={styles.headerImage} />
        <Text style={styles.mainSubtitle}>We are here to assist you. Reach out to us through any of the methods below, and we'll get back to you as soon as possible!</Text>

{/* About Us Button */}
<TouchableOpacity onPress={onShowAboutUs} style={styles.aboutUsButton}>
          <FontAwesome name="info-circle" size={24} color="#fff" style={styles.aboutUsIcon} />
          <Text style={styles.aboutUsButtonText}>About Us</Text>
        </TouchableOpacity>

        {/* Contact Details */}
        <View style={styles.contactDetails}>
          <Text style={styles.sectionTitle}>How Can We Help?</Text>
          <View style={styles.contactRow}>
            <FontAwesome name="phone" size={24} />
            <Text style={styles.contactText}>Phone: <Text style={styles.contactDetailText}>{contactNumber}</Text></Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesome name="envelope" size={24} />
            <Text style={styles.contactText}>Email: <Text style={styles.contactDetailText}>{contactEmail}</Text></Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesome name="whatsapp" size={24} />
            <Text style={styles.contactText}>WhatsApp: <Text style={styles.contactDetailText}>{contactNumber}</Text></Text>
          </View>
        </View>

        {/* Action Buttons */}
        <Text style={styles.sectionTitle}>Connect with Us</Text>
        <View style={styles.contactOptions}>
          <TouchableOpacity onPress={openPhone} style={styles.actionButton}>
            <MaterialIcons name="call" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openWhatsApp} style={styles.actionButton}>
            <FontAwesome name="whatsapp" size={20} color="#25D366" />
            <Text style={styles.actionButtonText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openEmail} style={styles.actionButton}>
            <MaterialIcons name="email" size={20} color="#FF2D55" />
            <Text style={styles.actionButtonText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFormModal(true)} style={styles.actionButton}>
            <FontAwesome name="comments" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Contact Form</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Form Modal */}
        <Modal transparent={true} visible={showFormModal} animationType="slide" onRequestClose={() => setShowFormModal(false)}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => setShowFormModal(false)} style={styles.closeButton}>
                  <FontAwesome name="close" size={24} color="#333" />
                </TouchableOpacity>
                
                <Text style={styles.title}>Send Us a Message</Text>
                <Text style={styles.subtitle}>Our team will get back to you as soon as possible.</Text>

                <FloatingInput label="Name" value={name} onChangeText={setName} error={errors.name} />
                <FloatingInput label="Email" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" />
                <FloatingInput label="Phone Number" value={phone} onChangeText={setPhone} error={errors.phone} keyboardType="phone-pad" />
                <FloatingInput label="Subject" value={subject} onChangeText={setSubject} error={errors.subject} />
                <FloatingInput label="Message" value={message} onChangeText={setMessage} error={errors.message} multiline numberOfLines={4} isTextArea />

                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Success Modal */}
        <Modal transparent={true} visible={showSuccessModal} animationType="fade" onRequestClose={() => setShowSuccessModal(false)}>
          <View style={styles.modalBackground}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <FontAwesome name="check-circle" size={64} color="#4caf50" />
              <Text style={styles.modalText}>Message Sent!</Text>
              <Text style={styles.modalText}>We will get back to you soon.</Text>
            </Animated.View>
          </View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
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
  container: {
    flexGrow: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerImage: {
    width: 350,
    height: 180,
    borderRadius: 15,
    marginBottom: 15,
    marginTop: 15,
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  aboutUsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  aboutUsButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactDetails: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 30,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#333',
  },
  contactDetailText: {
    fontWeight: 'bold',
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  actionButtonText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d4ed8',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
    width: '100%',
  },
  input: {
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  inputError: {
    borderBottomColor: '#ff4d4d',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
});
