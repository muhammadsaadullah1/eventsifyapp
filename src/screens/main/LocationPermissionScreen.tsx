import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { View as GradientView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/theme';

type LocationPermissionScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList
>;

const { width, height } = Dimensions.get('window');

const LocationPermissionScreen: React.FC = () => {
  const navigation = useNavigation<LocationPermissionScreenNavigationProp>();
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const mapCircleAnim = useRef(new Animated.Value(0)).current;
  // Animation reference (no lottie)

  useEffect(() => {
    // Start pulse animation (location marker)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Start fade in animation for text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Start slide up animation for text
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();

    // Start button entrance animation
    Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 800,
      delay: 400,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();

    // Map circle expanding animation
    Animated.timing(mapCircleAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Check if we already have location permission
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setPermissionStatus(status);
    
    // If permission is already granted, navigate to events screen after a short delay
    if (status === 'granted') {
      setTimeout(() => {
        navigation.navigate('MainTabs', { screen: 'Map' });
      }, 1000);
    }
  };

  const requestLocationPermission = async () => {
    // Play animation effect with existing animations
    
    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);
    
    if (status === 'granted') {
      // Get the user's current location
      try {
        await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        // Navigate to Events screen after a short delay
        setTimeout(() => {
          navigation.navigate('MainTabs', { screen: 'Map' });
        }, 1500);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    }
  };

  // Map circle size animation
  const circleSize = mapCircleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.6, width * 0.9]
  });

  // Button scale interpolation for press animation
  const buttonScale = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1]
  });

  return (
    <GradientView
      style={[styles.container, { backgroundColor: COLORS.DEEP_PURPLE }]}
    >
      <View style={styles.mapContainer}>
        <Animated.View
          style={[
            styles.mapCircle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize,
            },
          ]}
        />
        
        <Animated.View
          style={[
            styles.markerContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.marker}>
            <FontAwesome5 name="map-marker-alt" size={40} color={COLORS.LASER_GREEN} />
          </View>
          <View style={styles.markerShadow} />
        </Animated.View>
      </View>

      <View style={styles.contentContainer}>
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          Discover Events Near You
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          Eventsify needs your location to find amazing local events!
        </Animated.Text>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonAnim,
              transform: [{ scale: buttonScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={requestLocationPermission}
            activeOpacity={0.8}
          >
            <GradientView
              style={[styles.buttonGradient, { backgroundColor: COLORS.NEON_PINK }]}
            >
              <Text style={styles.buttonText}>
                {permissionStatus === 'denied'
                  ? 'Enable Location Access'
                  : 'Allow Location Access'}
              </Text>
              <FontAwesome5 name="location-arrow" size={18} color="#FFFFFF" />
            </GradientView>
          </TouchableOpacity>

          {/* Animation placeholder since Lottie is not available */}
          <View style={styles.lottieContainer}>
            <Animated.View 
              style={[
                styles.animationCircle,
                {
                  transform: [{ scale: pulseAnim }],
                  backgroundColor: COLORS.LASER_GREEN
                }
              ]}
            />
          </View>
        </Animated.View>

        {permissionStatus === 'denied' && (
          <Animated.Text
            style={[
              styles.errorText,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            Location access is required to show you nearby events.
          </Animated.Text>
        )}

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Map' })}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  animationCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.LASER_GREEN,
    shadowColor: COLORS.LASER_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: COLORS.LASER_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  markerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerShadow: {
    position: 'absolute',
    bottom: -8,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: COLORS.LASER_GREEN,
    opacity: 0.6,
    transform: [{ scaleX: 2.5 }],
    shadowColor: COLORS.LASER_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 10,
  },
  contentContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: '90%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: '90%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: COLORS.NEON_PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  lottieContainer: {
    position: 'absolute',
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    top: -30,
    opacity: 0.9,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  errorText: {
    color: '#FFD166',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LocationPermissionScreen;
