import { useFonts } from "expo-font";
import { Stack, useRouter, Slot } from "expo-router";
import { ClerkProvider, ClerkLoaded, SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Text } from "react-native-elements";
import LoginScreen from './../components/LoginScreen'
import * as SecureStore from 'expo-secure-store'
import { useEffect } from 'react';

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
};

export default function RootLayout() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf')
  });

  if (!fontsLoaded) {
    return null; // You can return a loading screen here if desired
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <SignedIn>
          <AdminRedirect />
          <Slot />
        </SignedIn>
        <SignedOut>
          <LoginScreen />
        </SignedOut>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function AdminRedirect() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const adminEmail = "dulanimalka1@gmail.com"; // Replace with your admin email address
      if (user.primaryEmailAddress?.emailAddress === adminEmail) {
        // Redirect to admin dashboard if email matches
        setTimeout(() => {
          router.replace('/admin');
        }, 0);
      }
    }
  }, [user]);

  return null;
}
