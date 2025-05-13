import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert
} from 'react-native';
// Import MapView without explicit provider for better compatibility
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { TYPOGRAPHY, SPACING, SHADOWS, getThemeColors } from '../../constants/theme';
import { Event } from '../../types';
import supabase from '../../supabase/supabase';
import { MainStackParamList } from '../../navigation/types';

type MapScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const { mode, toggleTheme } = useTheme();
  const colors = getThemeColors(mode);
  
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);

  // Animated marker size for a "pop" effect when they appear
  const markerScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermission) {
      getCurrentPosition();
      fetchEvents();
    }
  }, [locationPermission]);

  useEffect(() => {
    // Animate markers with a "pop" effect
    Animated.spring(markerScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [events]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Eventsify needs location permission to show events near you.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: requestLocationPermission }
          ]
        );
        return;
      }
      
      setLocationPermission(true);
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission.');
    }
  };

  const getCurrentPosition = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;
      
      setRegion({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      
      // Animate to user's current location
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    } catch (error) {
      console.error('Error getting current position:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Assuming we have a function to get events within a certain radius
      // Here we're simulating the query, but you would use PostGIS in Supabase
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setEvents(data as Event[]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (event: Event) => {
    navigation.navigate('EventDetail', { eventId: event.id, event });
  };

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChange}
          showsUserLocation
        >
          {events.map((event) => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.location.latitude,
                longitude: event.location.longitude,
              }}
              onPress={() => handleMarkerPress(event)}
            >
              <Animated.View 
                style={[
                  styles.markerContainer,
                  { backgroundColor: colors.PRIMARY },
                  { transform: [{ scale: markerScale }] }
                ]}
              >
                <FontAwesome5 
                  name={event.source === 'twitter' ? 'twitter' : 'calendar-alt'} 
                  size={16} 
                  color="#FFFFFF" 
                />
              </Animated.View>
            </Marker>
          ))}
        </MapView>
      </View>

      <View style={styles.header}>
        <View style={[styles.headerContent, { backgroundColor: colors.SURFACE }, SHADOWS.MEDIUM]}>
          <Text style={[styles.title, { color: colors.PRIMARY }]}>
            Eventsify
          </Text>
          <TouchableOpacity 
            style={[styles.themeToggle, { backgroundColor: colors.PRIMARY }]}
            onPress={toggleTheme}
          >
            <FontAwesome5 
              name={mode === 'sunsetVibes' ? 'moon' : 'sun'} 
              size={16} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.refreshButtonContainer}>
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: colors.SURFACE }, SHADOWS.MEDIUM]}
          onPress={() => {
            getCurrentPosition();
            fetchEvents();
          }}
        >
          <FontAwesome5 name="sync" size={20} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: SPACING.L,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.L,
    zIndex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    borderRadius: 8,
  },
  title: {
    fontFamily: TYPOGRAPHY.HEADINGS.fontFamily,
    fontSize: 22,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonContainer: {
    position: 'absolute',
    bottom: SPACING.XL,
    right: SPACING.L,
    zIndex: 1,
  },
  refreshButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default MapScreen;
