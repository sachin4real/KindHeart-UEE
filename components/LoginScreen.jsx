import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from "./../hooks/useWarmUpBrowser";

// Completing OAuth session
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const onPress = React.useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();
            if (createdSessionId) {
                setActive({ session: createdSessionId });
            }
        } catch (err) {
            console.error('OAuth error', err);
        }
    }, []);

    return (
        <View style={styles.container}>
            {/* Add the Image */}
            <Image 
                source={require('../assets/images/loading.png')}
                style={styles.image} 
                resizeMode="contain" 
                onError={(e) => console.error("Image loading error:", e.nativeEvent.error)}
            />

            {/* Get Started Button */}
            <TouchableOpacity style={styles.getStartedButton} onPress={onPress}>
                <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#738FFE',  // Background color for the entire screen
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: '90%',  // Increased width to make the image larger
        height: '70%', // Adjust height to make the image taller
        marginBottom: 20,  // Space between image and button
    },
    getStartedButton: {
        position: 'absolute',  // Position the button at the bottom
        bottom: 70,            // Adjust as needed to position above the very bottom edge
        backgroundColor: '#E6FDA3',
        paddingVertical: 15, 
        paddingHorizontal: 30, 
        borderRadius: 10,
    },
    getStartedText: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600',
    },
});
