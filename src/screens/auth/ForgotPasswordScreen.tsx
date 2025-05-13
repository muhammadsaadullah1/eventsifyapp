import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import supabase from '../../supabase/supabase';
import { THEMES, TYPOGRAPHY, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { mode } = useTheme();
  const colors = mode === 'vividSunset' ? THEMES.VIVID_SUNSET : THEMES.COOL_AQUA;
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      
      if (error) {
        throw error;
      }
      
      setResetSent(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.PRIMARY }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors.TEXT }]}>
            {resetSent 
              ? 'Check your email for a password reset link' 
              : 'Enter your email to receive a password reset link'
            }
          </Text>
        </View>

        {!resetSent ? (
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

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <Button
              title="Send Reset Link"
              onPress={handleResetPassword}
              loading={loading}
              containerStyle={styles.button}
            />
          </View>
        ) : (
          <View style={styles.successContainer}>
            <View style={[styles.successBox, { backgroundColor: colors.SURFACE }]}>
              <Text style={[styles.successText, { color: colors.TEXT }]}>
                ✓ Password reset email sent. Please check your inbox and follow the instructions to reset your password.
              </Text>
            </View>
            <Button
              title="Back to Sign In"
              variant="secondary"
              onPress={() => navigation.navigate('SignIn')}
              containerStyle={styles.button}
            />
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={[styles.linkText, { color: colors.PRIMARY }]}>
              Back to Sign In
            </Text>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.XL,
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
  successContainer: {
    flex: 1,
  },
  successBox: {
    padding: SPACING.L,
    borderRadius: 8,
    marginBottom: SPACING.L,
  },
  successText: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: TYPOGRAPHY.BODY.SIZE,
    lineHeight: 24,
  },
});

export default ForgotPasswordScreen;
