// emergency.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import CommunityForum from '../../components/Contact/CommunityForum';

export default function Community() {
  return (
    <View style={styles.container}>
      <CommunityForum />
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
