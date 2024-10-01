import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function ProgramListCard({ program }) {
  // Calculate donation percentage
  const donationPercentage = (program.donatedAmount / program.goalAmount) * 100;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: program.imageUrl }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.programName}>{program.name}</Text>
        <Text style={styles.donationText}>
          {`$${program.donatedAmount} / $${program.goalAmount}`}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${donationPercentage}%` }]} />
        </View>
        <Text style={styles.percentageText}>
          {donationPercentage.toFixed(2)}% of goal achieved
        </Text>
      </View>
    </View>
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
    fontFamily: 'outfit-regular',
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
    backgroundColor: '#0a7ea4',
    borderRadius: 5,
  },
  percentageText: {
    fontFamily: 'outfit-regular',
    fontSize: 12,
  },
});
