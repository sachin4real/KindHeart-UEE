import { View, Text,ScrollView, Image, StyleSheet, TextInput, TouchableOpacity  } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

export default function home() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello John!</Text>
       
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image
            style={styles.profilePic}
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="gray" />
        <TextInput placeholder="Search" style={styles.searchInput} />
        <Icon name="mic" size={24} color="gray" />
      </View>

      {/* Category Icons */}
      <View style={styles.categoriesContainer}>
  <View style={styles.categoryWrapper}>
    <TouchableOpacity style={styles.category}>
      <Icon name="apps" size={24} color="red" />
    </TouchableOpacity>
    <Text style={styles.categoryText}>All</Text>
  </View>

  <View style={styles.categoryWrapper}>
    <TouchableOpacity style={styles.category}>
      <Icon name="local-hospital" size={24} color="red" />
    </TouchableOpacity>
    <Text style={styles.categoryText}>Medical</Text>
  </View>

  <View style={styles.categoryWrapper}>
    <TouchableOpacity style={styles.category}>
      <Icon name="school" size={24} color="red" />
    </TouchableOpacity>
    <Text style={styles.categoryText}>Education</Text>
  </View>

  <View style={styles.categoryWrapper}>
    <TouchableOpacity style={styles.category}>
      <Icon name="healing" size={24} color="red" />
    </TouchableOpacity>
    <Text style={styles.categoryText}>Volunteering</Text>
  </View>
</View>

      {/* Top Programs Section */}
      <Text style={styles.sectionTitle}>Top Programs</Text>
      <ScrollView horizontal={true} style={styles.programsContainer}>
        <View style={styles.programCard}>
          <Image source={require('../../assets/images/Donate1.jpg')} style={styles.programImage} />
          <TouchableOpacity style={styles.donateButton}>
            <Text style={styles.donateButtonText}>Donate</Text>
          </TouchableOpacity>
          <Text style={styles.programTitle}>09 Regional Consultation for Latin America and the Caribbean</Text>
        </View>

        <View style={styles.programCard}>
          <Image source={require('../../assets/images/Donate3.jpg')} style={styles.programImage} />
          <TouchableOpacity style={styles.donateButton}>
            <Text style={styles.donateButtonText}>Donate</Text>
          </TouchableOpacity>
          <Text style={styles.programTitle}>Building Sustainable Communities in the Caribbean</Text>
        </View>
      </ScrollView>

      {/* Trending Programs */}
      <Text style={styles.sectionTitle}>Trending Programs</Text>
      <View style={styles.trendingProgram}>
        {/* <Image source={require('./assets/person.png')} style={styles.trendingImage} /> */}
        <View style={styles.trendingInfo}>
          <Text style={styles.trendingTitle}>Capacity Building Workshop on Sub-national</Text>
          <Text style={styles.trendingAmount}>$ 85,000</Text>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.progressBar}
            start={[0, 0]}
            end={[1, 0]}
          >
            <View style={styles.progress}>
              <Text style={styles.progressText}>55%</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
     
      <View style={styles.trendingProgram}>
        {/* <Image source={require('./assets/person.png')} style={styles.trendingImage} /> */}
        <View style={styles.trendingInfo}>
          <Text style={styles.trendingTitle}>Capacity Building Workshop on Sub-national</Text>
          <Text style={styles.trendingAmount}>$ 85,000</Text>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.progressBar}
            start={[0, 0]}
            end={[1, 0]}
          >
            <View style={styles.progress}>
              <Text style={styles.progressText}>55%</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    
      <View style={styles.trendingProgram}>
        {/* <Image source={require('./assets/person.png')} style={styles.trendingImage} /> */}
        <View style={styles.trendingInfo}>
          <Text style={styles.trendingTitle}>Capacity Building Workshop on Sub-national</Text>
          <Text style={styles.trendingAmount}>$ 85,000</Text>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.progressBar}
            start={[0, 0]}
            end={[1, 0]}
          >
            <View style={styles.progress}>
              <Text style={styles.progressText}>55%</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    color: 'gray',
  },
  profileContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
   
  },
  categoryWrapper: {
    alignItems: 'center', // Center the icon and text together
    justifyContent: 'center',
  },
  category: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  categoryText: {
    marginTop: 8, // Space between the icon container and text
    fontSize: 12,
    color: '#000', // You can change this to your desired color
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  programsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  programCard: {
    width: 200,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginRight: 16,
    padding: 10,
  },
  programImage: {
    width: '100%',
    height: '60%',
    borderRadius: 10,
  },
  donateButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff6347',
    padding: 6,
    borderRadius: 4,
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  programTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  trendingProgram: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  trendingImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  trendingInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  trendingAmount: {
    fontSize: 14,
    color: 'gray',
  },
  progressBar: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  progress: {
    width: '55%', // 55% filled as per design
    height: '100%',
    backgroundColor: '#3b5998',
    borderRadius: 5,
  },
  progressText: {
    color: '#fff',
    textAlign: 'center',
  },
});