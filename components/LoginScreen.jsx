import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import * as WebBrowser from "expo-web-browser"
import { useOAuth } from '@clerk/clerk-expo'
import { useWarmUpBrowser } from "./../hooks/useWarmUpBrowser"

WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow()
      if (createdSessionId) {
        setActive({ session: createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}
        onPress = {onPress}>
        <Text style={styles.buttonText}>SignUp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Vertically center the content
    alignItems: 'center', // Horizontally center the content
    backgroundColor: '#f8f8f8' // Background color if you want
  },
  button: {
    backgroundColor: '#ff6347', // Button color
    paddingVertical: 15, // Vertical padding
    paddingHorizontal: 30, // Horizontal padding
    borderRadius: 10, // Rounded corners
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 18, // Font size for the button text
  }
});
