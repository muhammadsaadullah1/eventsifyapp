import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  RefreshControl,
  StatusBar,
  Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';

import { MainStackParamList, RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/theme';
import mockEvents, { Event as MockEvent, getFeaturedEvents, getHotEvents, getNearbyEvents } from '../../data/mockEvents';
import { Event } from '../../types';

type EventsScreenNavigationProp = StackNavigationProp<RootStackParamList & MainStackParamList>;

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.25;
const SPACING = 12;

const EventsScreen: React.FC = () => {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const { mode } = useTheme();
  const { state: authState } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  
  // Animated values
  const scrollY = useRef(new Animated.Value(0)).current;
  const listAnimation = useRef(new Animated.Value(0)).current;
  
  // Event data
  const [featuredEvents, setFeaturedEvents] = useState<MockEvent[]>([]);
  const [hotEvents, setHotEvents] = useState<MockEvent[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<MockEvent[]>([]);
  
  useEffect(() => {
    // Start list entrance animation
    Animated.timing(listAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Load events data
    loadEvents();
    
    // Get user location
    getUserLocation();
  }, []);
  
  const getUserLocation = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        
        // Update nearby events based on user location
        setNearbyEvents(getNearbyEvents(
          location.coords.latitude,
          location.coords.longitude,
          10 // 10km radius
        ));
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };
  
  const loadEvents = () => {
    setFeaturedEvents(getFeaturedEvents());
    setHotEvents(getHotEvents());
    setNearbyEvents(mockEvents.slice(0, 5)); // Initially show some events before we get location
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, you would fetch fresh data here
    await new Promise(resolve => setTimeout(resolve, 1500));
    loadEvents();
    await getUserLocation();
    setRefreshing(false);
  };
  
  const handleEventPress = (event: MockEvent) => {
    // Convert our mock event to the format expected by the app
    // Create a compatible event object for navigation
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
      // Add additional fields that might be expected by the app
      media_urls: event.media.map(m => m.url),
      deep_link: `eventsify://event/${event.id}`
    };
    navigation.navigate('EventDetail', { eventId: event.id, event: eventForNavigation });
  };
  
  const handleMapPress = () => {
    navigation.navigate('MainTabs', { screen: 'Map' });
  };
  
  // Animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [StatusBar.currentHeight || 44, 100],
    extrapolate: 'clamp',
  });
  
  const renderFeaturedEvent = ({ item, index }: { item: MockEvent; index: number }) => {
    // Animation for staggered entrance
    const animatedStyle = {
      opacity: listAnimation,
      transform: [
        {
          translateY: listAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
    };
    
    return (
      <Animated.View style={[styles.featuredCardContainer, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleEventPress(item)}
          style={styles.featuredCard}
        >
          <Image source={{ uri: item.coverImage }} style={styles.featuredImage} />
          
          <View style={styles.gradientOverlay} />
          
          {item.isFeatured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
          )}
          
          <View style={styles.cardContent}>
            <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
            
            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <FontAwesome5 name="calendar-alt" size={14} color="#FFFFFF" style={styles.icon} />
                <Text style={styles.detailText}>
                  {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <FontAwesome5 name="map-marker-alt" size={14} color="#FFFFFF" style={styles.icon} />
                <Text style={styles.detailText} numberOfLines={1}>
                  {item.location.address}
                </Text>
              </View>
              
              <View style={styles.attendeeRow}>
                {item.attendees.slice(0, 3).map((attendee, idx) => (
                  <Image
                    key={attendee.id}
                    source={{ uri: attendee.avatar }}
                    style={[
                      styles.attendeeAvatar,
                      { marginLeft: idx > 0 ? -10 : 0, zIndex: 3 - idx },
                    ]}
                  />
                ))}
                {item.attendees.length > 3 && (
                  <View style={styles.moreAttendeesCircle}>
                    <Text style={styles.moreAttendeesText}>+{item.attendees.length - 3}</Text>
                  </View>
                )}
                <Text style={styles.attendeeText}>Going</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderEventCard = ({ item, index }: { item: MockEvent; index: number }) => {
    // Animation for staggered entrance
    const animatedStyle = {
      opacity: listAnimation,
      transform: [
        {
          translateY: listAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [50 + index * 10, 0],
          }),
        },
      ],
    };
    
    return (
      <Animated.View style={[styles.eventCardContainer, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleEventPress(item)}
          style={styles.eventCard}
        >
          <Image source={{ uri: item.coverImage }} style={styles.eventImage} />
          
          {item.isHot && (
            <View style={styles.hotBadge}>
              <FontAwesome5 name="fire" size={10} color="#FFFFFF" />
              <Text style={styles.hotBadgeText}>Hot</Text>
            </View>
          )}
          
          <View style={styles.eventCardContent}>
            <Text style={styles.eventCardTitle} numberOfLines={1}>{item.title}</Text>
            
            <View style={styles.eventCardDetails}>
              <View style={styles.detailRow}>
                <FontAwesome5 name="calendar-alt" size={12} color={COLORS.STEEL} style={styles.icon} />
                <Text style={styles.eventCardDetailText}>
                  {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <FontAwesome5 name="map-marker-alt" size={12} color={COLORS.STEEL} style={styles.icon} />
                <Text style={styles.eventCardDetailText} numberOfLines={1}>
                  {item.location.city}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.goingButton}
                onPress={() => {
                  if (!authState.user) {
                    // Just navigate to Auth stack, let it handle which screen to show
                                    // Navigate to test login for simplicity
                    navigation.navigate('Auth', { screen: 'TestLogin' });
                  } else {
                    Alert.alert("Success", "You're now attending this event!");
                  }
                }}
              >
                <Text style={styles.goingButtonText}>I'm Going</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderNearbyEvent = ({ item, index }: { item: MockEvent; index: number }) => {
    // Animation for staggered entrance with sideways slide
    const animatedStyle = {
      opacity: listAnimation,
      transform: [
        {
          translateX: listAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          }),
        },
      ],
    };
    
    return (
      <Animated.View style={[styles.nearbyCardContainer, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleEventPress(item)}
          style={styles.nearbyCard}
        >
          <Image source={{ uri: item.coverImage }} style={styles.nearbyImage} />
          
          <View style={styles.nearbyContent}>
            <Text style={styles.nearbyTitle} numberOfLines={2}>{item.title}</Text>
            
            <View style={styles.nearbyDetails}>
              <View style={styles.detailRow}>
                <FontAwesome5 name="map-marker-alt" size={12} color={COLORS.STEEL} style={styles.icon} />
                <Text style={styles.nearbyDetailText}>
                  {item.distance ? `${item.distance.toFixed(1)} km away` : 'Nearby'}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <FontAwesome5 name="calendar-alt" size={12} color={COLORS.STEEL} style={styles.icon} />
                <Text style={styles.nearbyDetailText}>
                  {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const HeaderComponent = () => (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>
          {authState.user ? `Hi, ${authState.user.email?.split('@')[0] || 'there'}!` : 'Welcome to Eventsify!'}
        </Text>
        <Text style={styles.headerTitle}>Discover amazing events</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.locationButton} onPress={handleMapPress}>
            <View style={[styles.locationGradient, { backgroundColor: COLORS.NEON_BLUE }]}>
              <FontAwesome5 name="map-marked-alt" size={16} color="#FFFFFF" />
              <Text style={styles.locationText}>Map View</Text>
            </View>
          </TouchableOpacity>
          
          {!authState.user && (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => {
                // Reset navigation to Auth stack
                navigation.navigate('Auth', { screen: 'TestLogin' })
              }}
            >
              <View style={[styles.loginGradient, { backgroundColor: COLORS.NEON_PINK }]}>
                <FontAwesome5 name="user" size={16} color="#FFFFFF" />
                <Text style={styles.loginText}>Sign In</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Featured Events Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={featuredEvents}
          renderItem={renderFeaturedEvent}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          snapToAlignment="center"
        />
      </View>
      
      {/* Nearby Events Section */}
      {userLocation && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Near You</Text>
            <TouchableOpacity onPress={handleMapPress}>
              <Text style={styles.seeAllText}>View Map</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={nearbyEvents}
            renderItem={renderNearbyEvent}
            keyExtractor={(item) => `nearby-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.nearbyList}
          />
        </View>
      )}
      
      {/* Hot Events Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Hot Right Now</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
    </>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated header that appears on scroll */}
      <Animated.View style={[
        styles.animatedHeader,
        { 
          opacity: headerOpacity,
          height: headerHeight
        }
      ]}>
        <View style={styles.blurHeader}>
          <Text style={styles.headerText}>Eventsify</Text>
        </View>
      </Animated.View>
      
      <Animated.FlatList
        data={hotEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={HeaderComponent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.VIBRANT_PURPLE}
            colors={[COLORS.VIBRANT_PURPLE, COLORS.NEON_PINK, COLORS.SUNSET_ORANGE]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  blurHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: COLORS.DEEP_PURPLE,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.DEEP_PURPLE,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationButton: {
    flex: 1,
    height: 46,
    marginRight: 10,
    borderRadius: 23,
    overflow: 'hidden',
    shadowColor: COLORS.DEEP_PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  locationGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  loginButton: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    shadowColor: COLORS.NEON_PINK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  loginGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.INK_BLACK,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.VIBRANT_PURPLE,
    fontWeight: '600',
  },
  featuredList: {
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  featuredCardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: SPACING / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  featuredCard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.NEON_PINK,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  eventDetails: {
    marginTop: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 6,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  attendeeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  moreAttendeesCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  moreAttendeesText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.DEEP_PURPLE,
  },
  attendeeText: {
    marginLeft: 6,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
  },
  eventCardContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 110,
  },
  eventImage: {
    width: 110,
    height: '100%',
  },
  hotBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.SUNSET_ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  hotBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  eventCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.INK_BLACK,
    marginBottom: 5,
  },
  eventCardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eventCardDetailText: {
    fontSize: 12,
    color: COLORS.CHARCOAL,
  },
  goingButton: {
    backgroundColor: COLORS.VIBRANT_PURPLE,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  goingButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  nearbyList: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  nearbyCardContainer: {
    width: 180,
    height: 220,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  nearbyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    height: '100%',
  },
  nearbyImage: {
    width: '100%',
    height: 120,
  },
  nearbyContent: {
    padding: 12,
    flex: 1,
  },
  nearbyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.INK_BLACK,
    marginBottom: 6,
  },
  nearbyDetails: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  nearbyDetailText: {
    fontSize: 12,
    color: COLORS.CHARCOAL,
  },
});

export default EventsScreen;
