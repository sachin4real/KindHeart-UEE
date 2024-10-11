import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProgramListCard({ program }) {
  const router = useRouter();
  // Calculate donation percentage, ensuring it caps at 100
  const donationPercentage = Math.min((program.donatedAmount / program.goalAmount) * 100, 100);

  return (
    <TouchableOpacity style={styles.card}
      onPress={() => router.push('/programDetails/' + program.id)}
    >
      <Image
        source={{ uri: program.imageUrl }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.programName}>{program.name}</Text>
        <Text style={styles.donationText}>
          {`Rs${program.donatedAmount} / Rs${program.goalAmount}`}
        </Text>
        <View style={styles.progressBar}>
          {/* Set width to 100% if donationPercentage is 100 or higher */}
          <View style={[styles.progressFill, { width: `${donationPercentage}%` }]} />
        </View>
        <Text style={styles.percentageText}>
          {donationPercentage >= 100 ? 'Completed' : `${donationPercentage.toFixed(2)}% of goal achieved`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  programName: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginBottom: 5,
  },
  donationText: {
    fontFamily: 'outfit',
    fontSize: 14,
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#738FFE',
    borderRadius: 5,
  },
  percentageText: {
    fontFamily: 'outfit',
    fontSize: 12,
  },
});
