import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Easing } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { THEMES, TYPOGRAPHY, SPACING, BORDER_RADIUS, COLORS, getThemeColors } from '../../constants/theme';
import { createTextStyle } from '../../utils/styleUtils';
import { useTheme } from '../../contexts/ThemeContext';
import { TEST_USER } from '../../utils/testAuth';

const TestLoginScreen: React.FC = () => {
  const { signInWithTestUser, signIn, state } = useAuth();
  const { mode } = useTheme();
  const colors = getThemeColors(mode);

  // Animation values
  const titleOpacity = new Animated.Value(0);
  const titleScale = new Animated.Value(0.5);
  const cardTranslateY = new Animated.Value(50);
  const buttonScale = new Animated.Value(0.95);
  
  // Run animations on component mount
  useEffect(() => {
    // Title animation - fade in and scale up
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5))
      }),
      Animated.timing(titleScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.7))
      })
    ]).start();
    
    // Card animation - slide up
    Animated.timing(cardTranslateY, {
      toValue: 0,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1.5))
    }).start();
    
    // Button animation - subtle pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin)
        }),
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin)
        })
      ])
    ).start();
  }, []);
  
  const handleTestSignIn = () => {
    signInWithTestUser();
  };
  
  const handleManualSignIn = () => {
    signIn(TEST_USER.email, TEST_USER.password);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <View style={styles.contentContainer}>
        <Animated.Text 
          style={[
            styles.title, 
            { 
              color: COLORS.DEEP_PURPLE, 
              opacity: titleOpacity,
              transform: [{ scale: titleScale }],
              textShadowColor: COLORS.NEON_PINK,
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 10
            }
          ]}
        >
          Eventsify
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.subtitle, 
            { 
              color: colors.TEXT,
              opacity: titleOpacity 
            }
          ]}
        >
          Test Authentication
        </Animated.Text>
        
        <Animated.View 
          style={[
            styles.card, 
            { 
              backgroundColor: colors.SURFACE,
              transform: [{ translateY: cardTranslateY }],
              borderWidth: 1,
              borderColor: COLORS.NEON_PINK,
              shadowColor: COLORS.DEEP_PURPLE
            }
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.TEXT }]}>Test User Credentials</Text>
          
          <View style={styles.credentialRow}>
            <Text style={[styles.credentialLabel, { color: colors.TEXT }]}>Email:</Text>
            <Text style={[styles.credentialValue, { color: colors.SECONDARY }]}>{TEST_USER.email}</Text>
          </View>
          
          <View style={styles.credentialRow}>
            <Text style={[styles.credentialLabel, { color: colors.TEXT }]}>Password:</Text>
            <Text style={[styles.credentialValue, { color: colors.SECONDARY }]}>{TEST_USER.password}</Text>
          </View>
        </Animated.View>
        
        {state.error && (
          <Text style={[styles.errorText, { color: colors.ACCENT }]}>{state.error}</Text>
        )}
        
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[
              styles.button, 
              { 
                backgroundColor: COLORS.VIBRANT_PURPLE,
                borderWidth: 2,
                borderColor: COLORS.NEON_PINK,
                shadowColor: COLORS.NEON_PINK,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 8
              }
            ]}
            onPress={handleTestSignIn}
            disabled={state.loading}
            activeOpacity={0.8}
          >
          {state.loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign In with Test User</Text>
          )}
        </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 12 }}>
          <TouchableOpacity
            style={[
              styles.button, 
              { 
                backgroundColor: COLORS.ELECTRIC_BLUE,
                borderWidth: 2,
                borderColor: COLORS.TURQUOISE,
                shadowColor: COLORS.TURQUOISE,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 8
              }
            ]}
            onPress={handleManualSignIn}
            disabled={state.loading}
            activeOpacity={0.8}
          >
          {state.loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Standard Sign In</Text>
          )}
        </TouchableOpacity>
        </Animated.View>
        
        <Text style={[styles.note, { color: colors.TEXT }]}>
          Note: This is only for testing purposes. The test user will be automatically created
          if it doesn't exist in your Supabase project.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.L,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    ...createTextStyle(TYPOGRAPHY.HEADINGS, undefined, {
      fontSize: 42,
      fontWeight: 'bold',
      marginBottom: SPACING.XS,
      textAlign: 'center',
      letterSpacing: 1.5,
    }),
  },
  subtitle: {
    ...createTextStyle(TYPOGRAPHY.BODY, undefined, {
      fontSize: 16,
      marginBottom: SPACING.L,
      textAlign: 'center',
    }),
  },
  card: {
    padding: SPACING.L,
    borderRadius: BORDER_RADIUS.M,
    marginBottom: SPACING.L,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    ...createTextStyle(TYPOGRAPHY.LABELS, undefined, {
      fontSize: 18,
      marginBottom: SPACING.M,
      textAlign: 'center',
    }),
  },
  credentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.M,
  },
  credentialLabel: {
    ...createTextStyle(TYPOGRAPHY.LABELS, undefined, {
      fontSize: 16,
    }),
  },
  credentialValue: {
    ...createTextStyle(TYPOGRAPHY.BODY, undefined, {
      fontSize: 16,
      fontWeight: '500',
    }),
  },
  button: {
    borderRadius: BORDER_RADIUS.L,
    paddingVertical: SPACING.M,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.L,
    height: 55,
  },
  buttonText: {
    color: '#FFFFFF',
    ...createTextStyle(TYPOGRAPHY.LABELS, undefined, {
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    }),
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  errorText: {
    ...createTextStyle(TYPOGRAPHY.BODY, undefined, {
      fontSize: 14,
      marginBottom: SPACING.M,
      textAlign: 'center',
    }),
  },
  note: {
    ...createTextStyle(TYPOGRAPHY.BODY, undefined, {
      fontSize: 12,
      marginTop: SPACING.L,
      textAlign: 'center',
      opacity: 0.7,
    }),
  },
});

export default TestLoginScreen;
