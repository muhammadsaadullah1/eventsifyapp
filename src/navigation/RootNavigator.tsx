import React, { useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Linking } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES, getThemeColors } from '../constants/theme';
import { RootStackParamList } from './types';

// Import stacks
import AuthStack from './AuthStack';
import MainStack from './MainStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { state } = useAuth();
  const { mode } = useTheme();
  const navigationRef = useRef<any>(null);
  const colors = getThemeColors(mode);

  // Custom theme
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.PRIMARY,
      background: colors.BACKGROUND,
      card: colors.SURFACE,
      text: colors.TEXT,
    },
  };

  // Deep link handling
  useEffect(() => {
    // Handle deep links when app is already open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Handle deep links when app is opened from link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [state.user]);

  const handleDeepLink = (url: string) => {
    // Parse the URL to extract the event ID
    const eventMatch = url.match(/\/event\/([^\/]+)/);
    if (eventMatch && eventMatch[1]) {
      const eventId = eventMatch[1];
      
      // Only navigate if user is authenticated
      if (state.user && navigationRef.current) {
        // Navigate to the event detail screen
        navigationRef.current.navigate('Main', {
          screen: 'EventDetail',
          params: { eventId },
        });
      }
    }
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.user ? (
          <Stack.Screen name="Main" component={MainStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
