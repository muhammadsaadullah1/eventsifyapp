import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { MainStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { TYPOGRAPHY, SPACING, SHADOWS, FONT_SIZE, getThemeColors } from '../../constants/theme';
import { createTextStyle } from '../../utils/styleUtils';
import mockEvents, { Event as MockEvent, getNearbyEvents } from '../../data/mockEvents';
import { calculateDistance } from '../../data/mockEvents';
import { COLORS } from '../../constants/colors';

type ExploreScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const { mode } = useTheme();
  const colors = getThemeColors(mode);
  
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [events, setEvents] = useState<MockEvent[]>([]);
  const [searchRadius, setSearchRadius] = useState(5); // Default 5km radius
  const [showAllEvents, setShowAllEvents] = useState(false); // New state to toggle showing all events
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    // Set initial events immediately to prevent infinite loading
    setEvents(mockEvents);
    setLoading(false);
    
    // Then get user location
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation || customLocation) {
      fetchNearbyEvents();
    }
  }, [userLocation, customLocation, searchRadius]);

  const getUserLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Eventsify needs location permission to show events near you.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: getUserLocation }
          ]
        );
        setLoading(false);
        setLoadingLocation(false);
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setUserLocation(location);
      setLoadingLocation(false);
    } catch (error) {
      console.error('Error getting user location:', error);
      setLoadingLocation(false);
      setLoading(false);
      Alert.alert('Error', 'Failed to get your location. Please try again or enter a location manually.');
    }
  };

  const fetchNearbyEvents = () => {
    try {
      setLoading(true);
      
      let eventsToFilter = [];
      
      // If showAllEvents is true, use all mock events regardless of location
      if (showAllEvents) {
        eventsToFilter = mockEvents; // Always use all events when showAllEvents is true
      } else {
        // Otherwise filter by location and radius
        let latitude, longitude;
        if (customLocation) {
          latitude = customLocation.latitude;
          longitude = customLocation.longitude;
        } else if (userLocation) {
          latitude = userLocation.coords.latitude;
          longitude = userLocation.coords.longitude;
        } else {
          // Default to a US location if none is available
          latitude = 37.7749; // San Francisco
          longitude = -122.4194;
        }
        
        // Only apply radius filter if searchRadius > 0
        if (searchRadius > 0) {
          eventsToFilter = getNearbyEvents(
            latitude,
            longitude,
            searchRadius
          );
        } else {
          // If radius is 0 (filter off), show all events but calculate distance
          eventsToFilter = mockEvents.map(event => {
            const eventWithDistance = {...event};
            eventWithDistance.distance = calculateDistance(
              latitude, longitude, event.location.latitude, event.location.longitude
            );
            return eventWithDistance;
          });
        }
      }
      
      // Filter by search query if needed
      const filteredEvents = searchQuery 
        ? eventsToFilter.filter(event => 
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
            event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : eventsToFilter;

      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching nearby events:', error);
      Alert.alert('Error', 'Failed to load events near you. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchByLocation = async (locationName: string) => {
    try {
      setLoadingLocation(true);
      const geocoded = await Location.geocodeAsync(locationName);
      
      if (geocoded && geocoded.length > 0) {
        const { latitude, longitude } = geocoded[0];
        setCustomLocation({ latitude, longitude });
      } else {
        Alert.alert('Location Not Found', 'Could not find the location you entered. Please try a different location.');
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      Alert.alert('Error', 'Failed to search for that location. Please try again.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleEventPress = (event: MockEvent) => {
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

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      // Check if it looks like a location search (has words like "in", "near", "at")
      const locationTerms = ["in", "near", "at", "around"];
      const containsLocationTerm = locationTerms.some(term => 
        searchQuery.toLowerCase().includes(` ${term} `));
      
      if (containsLocationTerm) {
        // Extract potential location after location terms
        for (const term of locationTerms) {
          const index = searchQuery.toLowerCase().indexOf(` ${term} `);
          if (index !== -1) {
            const location = searchQuery.slice(index + term.length + 2).trim();
            if (location) {
              searchByLocation(location);
              // Set search query to part before location term
              setSearchQuery(searchQuery.slice(0, index).trim());
              return;
            }
          }
        }
      }
    }
    
    // Regular search by keywords
    fetchNearbyEvents();
  };

  const renderEventItem = ({ item }: { item: MockEvent }) => {
    // Calculate how far the event is from the user
    const distance = userLocation ? 
      calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        item.location.latitude,
        item.location.longitude
      ) : (item.distance || 0);
    
    return (
      <TouchableOpacity 
        style={[styles.eventCard, { backgroundColor: colors.SURFACE }]} 
        onPress={() => handleEventPress(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.coverImage }} style={styles.eventImage} />
        
        <View style={styles.contentContainer}>
          <Text style={[styles.eventTitle, { color: colors.TEXT }]}>{item.title}</Text>
          
          <View style={styles.detailsRow}>
            <FontAwesome5 name="calendar-alt" size={14} color={colors.SECONDARY} />
            <Text style={[styles.detailText, { color: colors.SECONDARY }]}>
              {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
          
          <View style={styles.detailsRow}>
            <FontAwesome5 name="map-marker-alt" size={14} color={colors.SECONDARY} />
            <Text style={[styles.detailText, { color: colors.SECONDARY }]} numberOfLines={1}>
              {item.location.address}, {item.location.city}
            </Text>
          </View>
          
          <View style={styles.detailsRow}>
            <FontAwesome5 name="route" size={14} color={colors.SECONDARY} />
            <Text style={[styles.detailText, { color: colors.SECONDARY }]}>
              {distance.toFixed(1)} km away
            </Text>
          </View>
          
          <View style={styles.categoryContainer}>
            <Text style={[styles.category, { backgroundColor: colors.PRIMARY, color: COLORS.SNOW_WHITE }]}>
              {item.category}
            </Text>
            {item.price === 'free' && (
              <Text style={[styles.freeTag, { backgroundColor: colors.ACCENT, color: COLORS.SNOW_WHITE }]}>
                Free
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => {
    // Change message based on current search state
    let mainMessage = "No events found";
    let subMessage = "";
    
    if (searchQuery) {
      mainMessage = "No events match your search";
      subMessage = "Try different keywords or clear your search";
    } else if (showAllEvents) {
      mainMessage = "No events available";
      subMessage = "Check back later for new events";
    } else {
      mainMessage = "No events found nearby";
      subMessage = "Try increasing the search radius or searching in a different location";
    }
    
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome5 name="search-location" size={64} color={colors.SECONDARY} />
        <Text style={[styles.emptyText, { color: colors.TEXT }]}>{mainMessage}</Text>
        <Text style={[styles.emptySubtext, { color: colors.SECONDARY }]}>
          {subMessage}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaWrapper backgroundColor={colors.BACKGROUND} barStyle={mode.includes('dark') ? 'light-content' : 'dark-content'}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        >
          <FontAwesome5 name="arrow-left" size={22} color={colors.TEXT} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT }]}>Explore Events</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.SURFACE, color: colors.TEXT }]}
          placeholder="Search events or locations..."
          placeholderTextColor={colors.SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.PRIMARY }]} onPress={handleSearch}>
          <FontAwesome5 name="search" size={16} color={COLORS.SNOW_WHITE} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filtersContainer}>
        <Text style={[styles.filterLabel, { color: colors.SECONDARY }]}>Radius:</Text>
        <View style={styles.radiusOptions}>
          {[5, 10, 20].map((radius) => (
            <TouchableOpacity 
              key={radius}
              style={[
                styles.radiusOption,
                { 
                  backgroundColor: searchRadius === radius ? colors.PRIMARY : colors.SURFACE,
                  borderColor: searchRadius === radius ? colors.PRIMARY : COLORS.DIVIDER 
                }
              ]}
              onPress={() => {
                // Toggle off if same radius clicked again
                if (searchRadius === radius) {
                  setSearchRadius(0); // 0 means no radius filter
                } else {
                  setSearchRadius(radius);
                }
              }}
            >
              <Text 
                style={{ 
                  color: searchRadius === radius ? COLORS.SNOW_WHITE : colors.SECONDARY,
                  fontWeight: searchRadius === radius ? 'bold' : 'normal'
                }}
              >
                {radius} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.showAllContainer}>
          <TouchableOpacity 
            style={[
              styles.showAllButton,
              { 
                backgroundColor: showAllEvents ? colors.PRIMARY : colors.SURFACE,
                borderColor: showAllEvents ? colors.PRIMARY : COLORS.DIVIDER 
              }
            ]}
            onPress={() => {
              const newValue = !showAllEvents;
              setShowAllEvents(newValue);
              // If turning on show all, we should reset any radius filter
              if (newValue) {
                setSearchRadius(0); // Reset radius filter when showing all events
              }
              setTimeout(() => fetchNearbyEvents(), 0); // Allow state to update first
            }}
          >
            <Text 
              style={{ 
                color: showAllEvents ? COLORS.SNOW_WHITE : colors.SECONDARY,
                fontWeight: showAllEvents ? 'bold' : 'normal'
              }}
            >
              {showAllEvents ? 'Showing All Events' : 'Show All Events'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.locationInfo}>
          {loadingLocation ? (
            <ActivityIndicator size="small" color={colors.PRIMARY} />
          ) : userLocation ? (
            <Text style={[styles.locationText, { color: colors.SECONDARY }]}>
              <FontAwesome5 name="location-arrow" size={12} color={colors.PRIMARY} /> Using your current location
            </Text>
          ) : customLocation ? (
            <Text style={[styles.locationText, { color: colors.SECONDARY }]}>
              <FontAwesome5 name="map-pin" size={12} color={colors.PRIMARY} /> Using custom location
            </Text>
          ) : (
            <TouchableOpacity onPress={getUserLocation} style={styles.getLocationButton}>
              <Text style={[styles.getLocationText, { color: colors.PRIMARY }]}>
                <FontAwesome5 name="location-arrow" size={12} color={colors.PRIMARY} /> Use my location
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.PRIMARY} />
          <Text style={[styles.loadingText, { color: colors.SECONDARY }]}>Finding events near you...</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
        />
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.M,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...createTextStyle(TYPOGRAPHY.HEADINGS, undefined, {
      fontSize: FONT_SIZE.XL,
      fontWeight: 'bold',
    }),
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.M,
    marginBottom: SPACING.S,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: SPACING.L,
    marginRight: SPACING.S,
    ...createTextStyle(TYPOGRAPHY.BODY, undefined, {
      fontSize: FONT_SIZE.M,
    }),
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },
  filtersContainer: {
    marginHorizontal: SPACING.M,
    marginBottom: SPACING.M,
  },
  filterLabel: {
    ...createTextStyle(TYPOGRAPHY.CAPTION),
    marginBottom: 4,
  },
  radiusOptions: {
    flexDirection: 'row',
    marginBottom: SPACING.S,
  },
  radiusOption: {
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.XS,
    borderRadius: 16,
    marginRight: SPACING.S,
    borderWidth: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  showAllContainer: {
    marginTop: SPACING.S,
    marginBottom: SPACING.S,
  },
  showAllButton: {
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.XS,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  locationText: {
    ...createTextStyle(TYPOGRAPHY.CAPTION),
  },
  getLocationButton: {
    paddingVertical: 4,
  },
  getLocationText: {
    ...createTextStyle(TYPOGRAPHY.CAPTION),
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: SPACING.M,
    paddingBottom: SPACING.XL,
  },
  eventCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginBottom: SPACING.M,
    overflow: 'hidden',
    ...SHADOWS.MEDIUM,
  },
  eventImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: SPACING.M,
  },
  eventTitle: {
    ...createTextStyle(TYPOGRAPHY.HEADINGS, undefined, {
      fontSize: FONT_SIZE.M,
      fontWeight: 'bold',
      marginBottom: SPACING.S,
    }),
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    ...createTextStyle(TYPOGRAPHY.BODY),
    marginLeft: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: SPACING.S,
  },
  category: {
    paddingHorizontal: SPACING.S,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    ...createTextStyle(TYPOGRAPHY.CAPTION),
    fontWeight: 'bold',
  },
  freeTag: {
    paddingHorizontal: SPACING.S,
    paddingVertical: 4,
    borderRadius: 12,
    ...createTextStyle(TYPOGRAPHY.CAPTION, undefined, {
      fontSize: FONT_SIZE.XS,
      fontWeight: 'bold',
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.M,
  },
  loadingText: {
    ...createTextStyle(TYPOGRAPHY.BODY, undefined, {
      fontSize: FONT_SIZE.M,
      marginTop: SPACING.M,
    }),
  },
  emptyContainer: {
    padding: SPACING.XL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...createTextStyle(TYPOGRAPHY.HEADINGS, undefined, {
      fontSize: FONT_SIZE.M,
      marginTop: SPACING.M,
      textAlign: 'center',
    }),
  },
  emptySubtext: {
    ...createTextStyle(TYPOGRAPHY.BODY, undefined, {
      fontSize: FONT_SIZE.M,
      marginTop: SPACING.S,
      textAlign: 'center',
    }),
  },
});

export default ExploreScreen;
