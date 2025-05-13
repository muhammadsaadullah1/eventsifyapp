import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { TYPOGRAPHY, SPACING, getThemeColors } from '../../constants/theme';
import { createTextStyle } from '../../utils/styleUtils';
import Button from '../../components/Button';

type WelcomeScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Welcome'
>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { mode } = useTheme();
  const colors = getThemeColors(mode);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={[styles.appName, { color: colors.PRIMARY }]}>Eventsify</Text>
          <Text style={[styles.tagline, { color: colors.TEXT }]}>
            Discover what's happening around you
          </Text>
        </View>

        <View style={styles.illustrationContainer}>
          {/* Placeholder for illustration - replace with actual image */}
          <View style={[styles.placeholderImage, { backgroundColor: colors.SURFACE }]}>
            <Text style={{ color: colors.TEXT }}>App Illustration</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            variant="primary"
            containerStyle={styles.button}
            onPress={() => navigation.navigate('SignIn')}
          />
          <Button
            title="Create Account"
            variant="outline"
            containerStyle={styles.button}
            onPress={() => navigation.navigate('SignUp')}
          />
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
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.XXL,
  },
  appName: {
    ...createTextStyle(TYPOGRAPHY.HEADINGS, 'XXL'),
    marginBottom: SPACING.XS,
  },
  tagline: {
    ...createTextStyle(TYPOGRAPHY.BODY),
    textAlign: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: SPACING.XL,
  },
  button: {
    marginBottom: SPACING.M,
  },
});

export default WelcomeScreen;
