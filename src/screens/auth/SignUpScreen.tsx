import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { THEMES, TYPOGRAPHY, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';

type SignUpScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'SignUp'
>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { mode } = useTheme();
  const { signUp, signInWithGoogle, state } = useAuth();
  const colors = mode === 'vividSunset' ? THEMES.VIVID_SUNSET : THEMES.COOL_AQUA;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSignUp = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Error', 'Passwords do not match');
      return;
    }
    
    await signUp(email.trim(), password);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.PRIMARY }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.TEXT }]}>
              Sign up to discover events around you
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
              error={emailError}
              icon="envelope"
              onBlur={() => validateEmail(email)}
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              icon="lock"
              onBlur={() => validatePassword(password)}
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon="lock"
            />

            {state.error && (
              <Text style={styles.errorText}>{state.error}</Text>
            )}

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={state.loading}
              containerStyle={styles.button}
            />
            
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.TEXT }]} />
              <Text style={[styles.dividerText, { color: colors.TEXT }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.TEXT }]} />
            </View>
            
            <Button
              title="Sign up with Google"
              variant="outline"
              onPress={signInWithGoogle}
              containerStyle={styles.button}
              loading={state.loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.TEXT }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={[styles.linkText, { color: colors.PRIMARY }]}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    fontFamily: TYPOGRAPHY.HEADINGS.fontFamily,
    fontSize: TYPOGRAPHY.HEADINGS.XL,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: TYPOGRAPHY.BODY.SIZE,
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: SPACING.L,
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
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SPACING.XL,
  },
  footerText: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
  },
  linkText: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: SPACING.S,
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: 14,
  },
});

export default SignUpScreen;
