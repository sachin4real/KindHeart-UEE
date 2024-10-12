import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';

export default function ThankYou() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Thank You Animation */}
      <Animatable.View animation="zoomIn" duration={1000} style={styles.iconContainer}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' }} // Replace with your own icon or image
          style={styles.icon}
        />
      </Animatable.View>

      {/* Thank You Message */}
      <Animatable.Text animation="fadeInUp" delay={500} style={styles.thankYouText}>
        Thank You!
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" delay={700} style={styles.subText}>
        Your generous donation has been successfully processed.
      </Animatable.Text>

      {/* Back to Home Button */}
      <Animatable.View animation="fadeInUp" delay={1000}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/home')} // Navigate back to the home page
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  iconContainer: {
    backgroundColor: '#4E6AFF',
    padding: 30,
    borderRadius: 100,
    marginBottom: 30,
  },
  icon: {
    width: 100,
    height: 100,
  },
  thankYouText: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    color: '#333',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: '#4E6AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'outfit-medium',
  },
});
