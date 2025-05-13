import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert
} from 'react-native';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
// Import MapView without explicit provider for better compatibility
import MapView, { Marker, Region, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { TYPOGRAPHY, SPACING, SHADOWS, FONT_SIZE, getThemeColors } from '../../constants/theme';
import { createTextStyle } from '../../utils/styleUtils';
import { COLORS } from '../../constants/colors';
import mockEvents, { Event as MockEvent, getNearbyEvents } from '../../data/mockEvents';
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
  const [events, setEvents] = useState<MockEvent[]>(mockEvents);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);

  // Animated marker size for a "pop" effect when they appear
  const markerScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Load all mock events immediately
    setEvents(mockEvents);
    setLoading(false);
    
    // Request location permissions and get user location
    requestLocationPermission();
    
    // Animate marker appearance
    Animated.spring(markerScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
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
      
      // Always display all mock events to ensure markers show up
      setEvents(mockEvents);
      
      // You can also filter by region if needed in the future
      // But for now, we show all events to ensure markers are visible
      /*
      if (region) {
        const nearbyEvents = getNearbyEvents(
          region.latitude,
          region.longitude,
          15 // 15km radius
        );
        setEvents(nearbyEvents);
      }
      */
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (event: MockEvent) => {
    // Convert our mock event to the format expected by the app
    const eventForNavigation: any = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      location: {
        latitude: event.location.latitude,
        longitude: event.location.longitude,
        address: event.location.address
      },
      user_id: event.organizer.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: 'app',
      images: event.media.filter(m => m.type === 'image').map(m => m.url),
      media_urls: event.media.map(m => m.url),
      deep_link: `eventsify://event/${event.id}`
    };
    navigation.navigate('EventDetail', { eventId: event.id, event: eventForNavigation });
  };

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  return (
    <SafeAreaWrapper backgroundColor={colors.BACKGROUND}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChange}
          showsUserLocation
          showsCompass={true}
          showsScale={true}
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
                  name={getIconForCategory(event.category)} 
                  size={16} 
                  color="#FFFFFF" 
                />
              </Animated.View>
              <Callout tooltip>
                <View style={[styles.calloutContainer, { backgroundColor: colors.SURFACE }]}>
                  <Text style={[styles.calloutTitle, { color: colors.TEXT }]} numberOfLines={1}>{event.title}</Text>
                  <Text style={[styles.calloutAddress, { color: colors.SECONDARY }]} numberOfLines={1}>{event.location.address}</Text>
                </View>
              </Callout>
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
    </SafeAreaWrapper>
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
    ...createTextStyle(TYPOGRAPHY.HEADINGS, undefined, { fontSize: 22 }),
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    borderRadius: 8,
    ...SHADOWS.MEDIUM
  },
  calloutTitle: {
    ...createTextStyle(TYPOGRAPHY.HEADINGS, undefined, {
      fontSize: FONT_SIZE.S,
      fontWeight: 'bold',
      marginBottom: 4,
    }),
  },
  calloutAddress: {
    ...createTextStyle(TYPOGRAPHY.CAPTION, undefined, {
      fontSize: 12,
    }),
  },
});

// Helper function to get an appropriate icon for each event category
const getIconForCategory = (category: string): string => {
  switch (category) {
    case 'Music':
      return 'music';
    case 'Food & Drink':
      return 'utensils';
    case 'Business':
      return 'briefcase';
    case 'Sports':
      return 'running';
    case 'Arts & Culture':
      return 'palette';
    case 'Charity':
      return 'hand-holding-heart';
    case 'Technology':
      return 'laptop-code';
    case 'Education':
      return 'graduation-cap';
    case 'Health & Wellness':
      return 'heartbeat';
    case 'Fashion':
      return 'tshirt';
    case 'Community':
      return 'users';
    case 'Nightlife':
      return 'glass-cheers';
    case 'Travel & Outdoor':
      return 'mountain';
    case 'Family & Kids':
      return 'child';
    default:
      return 'calendar-alt';
  }
};

export default MapScreen;
