// contact.jsx

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ContactForm from '../../components/Contact/ContactForm';
import AboutUs from '../../components/About/AboutUs';

export default function Contact() {
  const [showAboutUs, setShowAboutUs] = useState(false);

  const handleShowAboutUs = () => {
    setShowAboutUs(true);
  };

  const handleBackToContact = () => {
    setShowAboutUs(false);
  };

  return (
    <View style={styles.container}>
      {showAboutUs ? (
        <AboutUs onBack={handleBackToContact} />
      ) : (
        <ContactForm onShowAboutUs={handleShowAboutUs} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
