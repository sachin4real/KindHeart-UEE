import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import React from 'react'
import { useUser } from '@clerk/clerk-expo';

export default function VolunteerHeader() {
    const { user } = useUser();
  return (
    <View>

       <Image
         source={{ uri: user?.imageUrl }}
        style={styles.profileImage}
         />
    </View>
  )
}

const styles = StyleSheet.create({
    profileImage: {
    marginTop:20,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    position: 'absolute',
    top: 15, // Position it at the top of the header
    right: 16, // Align it to the right side
    },
});