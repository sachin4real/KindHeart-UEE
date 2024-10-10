// contact.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import ContactForm from '../../components/Contact/ContactForm';

export default function Contact() {
  return (
    <View style={styles.container}>
      <ContactForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
    padding: 20,
  },
});
