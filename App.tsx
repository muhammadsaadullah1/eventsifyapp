// Core polyfills needed for Supabase and other libraries
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Import custom polyfills
import './src/polyfills';

// Import ReadableStream from web-streams-polyfill (version 3.3.3)
import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill/ponyfill';

// Make streams available globally using type assertions to avoid TypeScript errors
(globalThis as any).ReadableStream = ReadableStream;
(globalThis as any).WritableStream = WritableStream;
(globalThis as any).TransformStream = TransformStream;

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// IMPORTANT: Enable screens before importing navigation components
import { enableScreens } from 'react-native-screens';
enableScreens();

// Context Providers
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

// Navigation
import RootNavigator from './src/navigation/RootNavigator';

// Supabase
import 'react-native-url-polyfill/auto';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Reanimated 2',
  'AsyncStorage has been extracted',
  'Non-serializable values were found in the navigation state',
  // Silence any warning about mismatched dependencies for now
  'Require cycle:',
]);

// Set explicit require configuration for React Navigation compatibility with v6
// This resolves potential issues with React Navigation's internal dependencies
if ((Text as any).defaultProps == null) {
  (Text as any).defaultProps = {};
  (Text as any).defaultProps.allowFontScaling = false;
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Load custom fonts
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Poppins-Regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
          'Poppins-SemiBold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
          'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('./src/assets/fonts/Inter-Medium.ttf'),
          'Inter-SemiBold': require('./src/assets/fonts/Inter-SemiBold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Continue without custom fonts if there's an error
        setFontsLoaded(true);
      } finally {
        setInitializing(false);
      }
    }

    loadFonts();
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Eventsify...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5E6', // Default background color
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B', // Default primary color
  },
});
