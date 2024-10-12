import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo'; // Assuming you're using Clerk for authentication

const windowWidth = Dimensions.get('window').width;

export default function RequestPage() {
  const router = useRouter();
  const { user } = useUser(); // Get the logged-in user's information
  const [name, setName] = useState(user?.fullName || ''); // Automatically fill the user's name
  const [contact, setContact] = useState('');
  const [assistanceType, setAssistanceType] = useState('');
  const [details, setDetails] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    GetCategoryList();
  }, []);

  // Fetching the category list from Firestore
  const GetCategoryList = async () => {
    const q = query(collection(db, 'Category'));
    const querySnapshot = await getDocs(q);
    const fetchedCategories = [];

    querySnapshot.forEach((doc) => {
      fetchedCategories.push(doc.data());
    });

    setCategoryList(fetchedCategories);
  };

  const handleSubmit = async () => {
    if (!contact || !assistanceType) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      // Save request to Firestore
      const requestDoc = await addDoc(collection(db, 'AssistanceRequests'), {
        name,
        contact,
        assistanceType,
        details,
        timestamp: new Date(),
      });

      // Simulated email sending
      await sendEmail({
        to: 'it22000880@my.sllit.lk',
        subject: `Assistance Request from ${name}`,
        body: `Name: ${name}\nContact: ${contact}\nAssistance Type: ${assistanceType}\nDetails: ${details}`,
      });

      Alert.alert('Request Submitted', 'Thank you! Our team will reach out to you shortly.');
      setName(user?.fullName || ''); // Reset name to logged-in user's name
      setContact('');
      setAssistanceType('');
      setDetails('');
    } catch (error) {
      console.error('Error submitting request: ', error);
      Alert.alert('Error', 'Could not submit request. Try again.');
    }
  };

  const sendEmail = async ({ to, subject, body }) => {
    // Placeholder function for sending email
    // You will need to implement the actual email sending logic on your backend
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
  };

  const handleCategoryPress = (category) => {
    if (category.name) {
      setAssistanceType(category.name); // Set the assistance type from the category selected
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <FontAwesome5 name="hands-helping" size={24} color="#fff" />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Request Assistance</Text>
      <Text style={styles.subtitle}>
        If you or someone you know needs help creating a program or charity initiative, we’re here to help. Please select a service from the list below:
      </Text>

      <FlatList
        data={categoryList}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={windowWidth / 4}
      />

      <Text style={styles.formTitle}>Fill Out Your Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        editable={false} // Make it read-only since it's set automatically
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Information"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Type of Assistance Needed"
        value={assistanceType}
        editable={false} // Make it read-only since it's set by category selection
      />
      <TextInput
        style={[styles.input, styles.detailsInput]}
        placeholder="Additional Details (optional)"
        value={details}
        onChangeText={setDetails}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Request</Text>
      </TouchableOpacity>

      <Text style={styles.contactPrompt}>Need Immediate Assistance?</Text>
      <TouchableOpacity style={styles.contactButton} onPress={() => router.push('/contactform')}>
        <Text style={styles.contactButtonText}>Contact Us Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop : 50,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4c669f',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
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
    marginBottom: 20,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  categoryItem: {
    backgroundColor: '#4c669f',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  detailsInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4c669f',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  contactPrompt: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
