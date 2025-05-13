import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

type AuthScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Auth'
>;

const { width, height } = Dimensions.get('window');

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { signIn, signUp, state } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [nameValid, setNameValid] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const formSlideAnim = useRef(new Animated.Value(width)).current;
  const logoAnim = useRef(new Animated.Value(0.5)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);

  // Start animations on mount
  useEffect(() => {
    // Sequence of animations
    Animated.parallel([
      // Logo animation
      Animated.spring(logoAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      // Background animation
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      // Text fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Text slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      // Form slide in from right
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Button pulse animation
    startButtonPulse();
  }, []);

  // Animation when switching between login and signup
  useEffect(() => {
    Animated.sequence([
      // Slide form out
      Animated.timing(formSlideAnim, {
        toValue: -30,
        duration: 250,
        useNativeDriver: true,
      }),
      // Slide form back in
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isLogin]);

  const startButtonPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleSuccess = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (lottieRef.current) {
      lottieRef.current.play();
    }
    
    Animated.timing(successAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    setTimeout(() => {
      navigation.navigate('Main');
    }, 2000);
  };

  const handleSubmit = () => {
    // Basic validation
    let isValid = true;
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailValid(false);
      isValid = false;
    } else {
      setEmailValid(true);
    }
    
    if (!password || password.length < 6) {
      setPasswordValid(false);
      isValid = false;
    } else {
      setPasswordValid(true);
    }
    
    if (!isLogin && (!name || name.length < 2)) {
      setNameValid(false);
      isValid = false;
    } else {
      setNameValid(true);
    }
    
    if (!isValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (isLogin) {
      // In a production app, this would call a real authentication service
      setTimeout(() => {
        // Simulate successful login
        handleSuccess();
      }, 1500);
    } else {
      // In a production app, this would call a real registration service
      setTimeout(() => {
        // Simulate successful registration
        handleSuccess();
      }, 1500);
    }
  };

  const handleGoogleAuth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // In a production app, this would call a real Google authentication service
    setTimeout(() => {
      // Simulate successful login
      handleSuccess();
    }, 1500);
  };

  // Gradient colors animation
  const gradientColors = bgAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      [COLORS.DEEP_PURPLE, COLORS.VIBRANT_PURPLE, COLORS.ELECTRIC_BLUE],
      [COLORS.ELECTRIC_BLUE, COLORS.NEON_PINK, COLORS.SUNSET_ORANGE],
      [COLORS.SUNSET_ORANGE, COLORS.VIBRANT_PURPLE, COLORS.DEEP_PURPLE]
    ]
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Animated background gradient */}
      <Animated.View style={styles.gradientContainer}>
        <LinearGradient
          colors={gradientColors as any}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative elements */}
          <View style={styles.bubbleDecor1} />
          <View style={styles.bubbleDecor2} />
          <View style={styles.bubbleDecor3} />
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo and title section */}
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoAnim }],
                opacity: fadeAnim
              }
            ]}
          >
            <Image 
              source={require('../../../assets/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            
            <Animated.Text 
              style={[
                styles.appTitle,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              Eventsify
            </Animated.Text>
            
            <Animated.Text 
              style={[
                styles.slogan,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              Discover amazing events near you
            </Animated.Text>
          </Animated.View>

          {/* Form section */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                transform: [{ translateX: formSlideAnim }]
              }
            ]}
          >
            {/* Form header */}
            <Text style={styles.formTitle}>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Text>
            
            <Text style={styles.formSubtitle}>
              {isLogin 
                ? 'Sign in to continue the excitement' 
                : 'Join the community of event enthusiasts'}
            </Text>

            {/* Form fields */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <FontAwesome5 name="user" size={18} color={COLORS.STEEL} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, !nameValid && styles.inputError]}
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.SILVER}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
                {!nameValid && (
                  <Text style={styles.errorText}>Please enter your name</Text>
                )}
              </View>
            )}

            <View style={styles.inputContainer}>
              <FontAwesome5 name="envelope" size={18} color={COLORS.STEEL} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !emailValid && styles.inputError]}
                placeholder="Email Address"
                placeholderTextColor={COLORS.SILVER}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {!emailValid && (
                <Text style={styles.errorText}>Please enter a valid email</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="lock" size={18} color={COLORS.STEEL} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !passwordValid && styles.inputError]}
                placeholder="Password"
                placeholderTextColor={COLORS.SILVER}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <FontAwesome5 
                  name={isPasswordVisible ? 'eye-slash' : 'eye'} 
                  size={18} 
                  color={COLORS.STEEL} 
                />
              </TouchableOpacity>
              {!passwordValid && (
                <Text style={styles.errorText}>Password must be at least 6 characters</Text>
              )}
            </View>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {/* Submit button */}
            <Animated.View 
              style={[
                {
                  transform: [{ scale: buttonScaleAnim }],
                  shadowColor: COLORS.NEON_PINK,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 6,
                  elevation: 8,
                  width: '100%',
                  marginTop: 20,
                }
              ]}
            >
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.NEON_PINK, COLORS.SUNSET_ORANGE]}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Social login */}
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleAuth}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="google" size={20} color="#DB4437" style={styles.googleIcon} />
              <Text style={styles.googleText}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Switch between login and signup */}
            <TouchableOpacity
              style={styles.toggleContainer}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text style={styles.toggleAction}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Success animation overlay */}
      <Animated.View 
        style={[
          styles.successOverlay,
          {
            opacity: successAnim
          }
        ]}
        pointerEvents={successAnim._value > 0 ? 'auto' : 'none'}
      >
        <View style={styles.lottieContainer}>
          <LottieView
            ref={lottieRef}
            source={require('../../../assets/animations/success.json')}
            style={styles.lottie}
            loop={false}
            autoPlay={false}
          />
          <Text style={styles.successText}>
            {isLogin ? 'Welcome Back!' : 'Account Created!'}
          </Text>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  slogan: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.INK_BLACK,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: COLORS.STEEL,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    paddingHorizontal: 46,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.INK_BLACK,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.ERROR_RED,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  errorText: {
    color: COLORS.ERROR_RED,
    fontSize: 12,
    marginLeft: 16,
    marginTop: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.VIBRANT_PURPLE,
    fontSize: 14,
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  submitGradient: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    paddingHorizontal: 10,
    color: COLORS.STEEL,
    fontSize: 14,
  },
  googleButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    color: COLORS.INK_BLACK,
    fontSize: 16,
    fontWeight: '500',
  },
  toggleContainer: {
    alignItems: 'center',
  },
  toggleText: {
    color: COLORS.STEEL,
    fontSize: 14,
  },
  toggleAction: {
    color: COLORS.VIBRANT_PURPLE,
    fontWeight: '600',
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(124, 77, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  },
  bubbleDecor1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -20,
    right: -40,
  },
  bubbleDecor2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: 100,
    left: -30,
  },
  bubbleDecor3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: 120,
    right: 40,
  },
});

export default AuthScreen;
