import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { TYPOGRAPHY, SPACING, getThemeColors } from '../../constants/theme';
import { createTextStyle } from '../../utils/styleUtils';
import Button from '../../components/Button';
import Input from '../../components/Input';

type SignInScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'SignIn'
>;

const SignInScreen: React.FC = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const { mode } = useTheme();
  const { state, signIn, continueAsGuest, signInWithGoogle } = useAuth();
  const colors = getThemeColors(mode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Password Required', 'Please enter your password');
      return;
    }
    
    await signIn(email, password);
  };

  const handleMagicLinkSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to receive a magic link');
      return;
    }
    
    // In a real app, this would send a magic link email
    // For this example, we'll just show a success message
    setIsMagicLinkSent(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.PRIMARY }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.TEXT }]}>
            Sign in to continue with Eventsify
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            icon="envelope"
          />
          
          {!isMagicLinkSent && (
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              icon="lock"
            />
          )}

          {state.error && (
            <Text style={styles.errorText}>{state.error}</Text>
          )}

          {isMagicLinkSent ? (
            <View style={styles.magicLinkMessage}>
              <Text style={[styles.magicLinkText, { color: colors.TEXT }]}>
                ✓ Magic link sent! Check your email inbox.
              </Text>
              <TouchableOpacity onPress={() => setIsMagicLinkSent(false)}>
                <Text style={[styles.linkText, { color: colors.PRIMARY }]}>
                  Try another method
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Button
                title="Sign In"
                onPress={handleSignIn}
                loading={state.loading}
                containerStyle={styles.button}
              />
              
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={[styles.linkText, { color: colors.PRIMARY }]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
              
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.TEXT }]} />
                <Text style={[styles.dividerText, { color: colors.TEXT }]}>OR</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.TEXT }]} />
              </View>
              
              <Button
                title="Sign in with Magic Link"
                variant="secondary"
                onPress={handleMagicLinkSignIn}
                containerStyle={styles.button}
                loading={state.loading}
              />
              
              <Button
                title="Sign in with Google"
                variant="outline"
                onPress={signInWithGoogle}
                containerStyle={styles.button}
                loading={state.loading}
              />
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.TEXT }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[styles.linkText, { color: colors.PRIMARY }]}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.L,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: SPACING.XL,
    marginBottom: SPACING.XL,
  },
  title: {
    ...createTextStyle(TYPOGRAPHY.HEADINGS, 'XL'),
    marginBottom: SPACING.XS,
  },
  subtitle: {
    ...createTextStyle(TYPOGRAPHY.BODY),
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: SPACING.M,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: SPACING.M,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.L,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  dividerText: {
    paddingHorizontal: SPACING.M,
    ...createTextStyle(TYPOGRAPHY.LABELS, undefined, {
      fontSize: 12,
    }),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.XL,
  },
  footerText: {
    ...createTextStyle(TYPOGRAPHY.BODY),
  },
  linkText: {
    ...createTextStyle(TYPOGRAPHY.BODY),
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: SPACING.S,
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: 14,
  },
  magicLinkMessage: {
    backgroundColor: '#E5F9E0',
    padding: SPACING.M,
    borderRadius: 8,
    marginTop: SPACING.L,
  },
  magicLinkText: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    marginBottom: SPACING.S,
  },
});

export default SignInScreen;
