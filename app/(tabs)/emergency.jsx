// emergency.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import EmergencyForm from '../../components/Emergency/EmergencyPage';

export default function Emergency() {
  return (
    <View style={styles.container}>
      <EmergencyForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
