import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';

export default function Header() {
    const { user } = useUser();

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {/* Greeting and User Profile */}
                <View style={styles.greetingContainer}>
                    <Text style={styles.greetingText}>Hello {user?.firstName}!</Text>
                    <Text style={styles.subText}>Small change, big difference!</Text>
                </View>

                {/* Profile Image */}
                <Image
                    source={{ uri: user?.imageUrl }}
                    style={styles.profileImage}
                />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search" 
                    placeholderTextColor="#aaa"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: '#4E6AFF',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greetingContainer: {
        flex: 1,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    subText: {
        fontSize: 14,
        color: '#fff',
        marginTop: 4,
    },
    profileImage: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
    },
    searchContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#000',
    },
});
