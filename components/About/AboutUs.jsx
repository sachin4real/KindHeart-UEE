// components/About/AboutUs.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function AboutUs({ onBack }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <FontAwesome5 name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>About Us</Text>
      <Text style={styles.subtitle}>Making a Difference Together</Text>
      
      <Text style={styles.content}>
        Welcome to our platform! We are dedicated to creating a community where individuals can come together to support each other and make a positive impact. Our app offers various features designed to help you engage and contribute in meaningful ways.
      </Text>

      <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <FontAwesome5 name="hands-helping" size={40} color="#4c669f" />
          <Text style={styles.featureTitle}>Add Fundraise</Text>
          <Text style={styles.featureDescription}>
            Start a fundraising campaign to support a cause you believe in. Our platform makes it easy to reach out to others for support.
          </Text>
        </View>

        <View style={styles.feature}>
          <FontAwesome5 name="user-friends" size={40} color="#4c669f" />
          <Text style={styles.featureTitle}>Join as a Volunteer</Text>
          <Text style={styles.featureDescription}>
            Connect with others by joining volunteer programs. You can make a real difference by giving your time and effort to those in need.
          </Text>
        </View>

        <View style={styles.feature}>
          <FontAwesome5 name="ambulance" size={40} color="#4c669f" />
          <Text style={styles.featureTitle}>Emergency Services</Text>
          <Text style={styles.featureDescription}>
            Access emergency services instantly. Our app provides quick access to help when you need it the most.
          </Text>
        </View>

        <View style={styles.feature}>
          <FontAwesome5 name="hand-holding-heart" size={40} color="#4c669f" />
          <Text style={styles.featureTitle}>Donate or Create Donations</Text>
          <Text style={styles.featureDescription}>
            Whether you want to contribute to an existing cause or start your own, our platform facilitates all forms of donations.
          </Text>
        </View>

        <View style={styles.feature}>
          <FontAwesome5 name="book" size={40} color="#4c669f" />
          <Text style={styles.featureTitle}>Free Educational Programs</Text>
          <Text style={styles.featureDescription}>
            Access a variety of free educational programs designed to empower you with new knowledge and skills.
          </Text>
        </View>
      </View>

      <Text style={styles.content}>
        We’re constantly working to improve our app and expand our offerings. Thank you for being a part of our community. Together, we can make a difference!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 60,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4c669f',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  feature: {
    width: '100%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
