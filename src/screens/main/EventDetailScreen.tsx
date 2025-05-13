import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  Dimensions,
  Platform
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import { FontAwesome5 } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { THEMES, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import supabase from '../../supabase/supabase';
import { Event } from '../../types';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

type EventDetailRouteProp = RouteProp<MainStackParamList, 'EventDetail'>;
type EventDetailNavigationProp = StackNavigationProp<MainStackParamList>;

const { width } = Dimensions.get('window');

const EventDetailScreen: React.FC = () => {
  const navigation = useNavigation<EventDetailNavigationProp>();
  const route = useRoute<EventDetailRouteProp>();
  const { mode } = useTheme();
  const colors = mode === 'vividSunset' ? THEMES.VIVID_SUNSET : THEMES.COOL_AQUA;
  
  const { eventId, event: initialEvent } = route.params;
  const [event, setEvent] = useState<Event | null>(initialEvent || null);
  const [loading, setLoading] = useState(!initialEvent);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  useEffect(() => {
    // Start animations
    headerOpacity.value = withSpring(1, { damping: 15 });
    contentTranslateY.value = withSpring(0, { damping: 15 });
    
    // If we don't have the event data already, fetch it
    if (!initialEvent) {
      fetchEventDetails();
    }
  }, []);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setEvent(data as Event);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (!event) return;
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      await Share.share({
        message: `Check out this event: ${event.title} ${event.deep_link}`,
        url: event.deep_link,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const openInMaps = () => {
    if (!event) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const { latitude, longitude } = event.location;
    const label = event.title;
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });
    
    if (url) {
      Linking.openURL(url);
    }
  };

  const navigateNextImage = () => {
    if (!event || !event.media_urls.length) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentImageIndex < event.media_urls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  if (!event) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.TEXT }]}>
            {loading ? 'Loading event details...' : 'Event not found'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const eventDate = new Date(event.created_at).toLocaleDateString();
  const eventTime = new Date(event.created_at).toLocaleTimeString();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.SURFACE }]}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={16} color={colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT }]} numberOfLines={1}>
          {event.title}
        </Text>
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: colors.SURFACE }]}
          onPress={handleShare}
        >
          <FontAwesome5 name="share-alt" size={16} color={colors.PRIMARY} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {event.media_urls && event.media_urls.length > 0 ? (
            <TouchableOpacity 
              style={styles.mediaContainer}
              activeOpacity={0.9}
              onPress={navigateNextImage}
            >
              <Image 
                source={{ uri: event.media_urls[currentImageIndex] }} 
                style={styles.mediaImage}
                resizeMode="cover"
              />
              {event.media_urls.length > 1 && (
                <View style={styles.mediaCounter}>
                  <Text style={styles.mediaCounterText}>
                    {currentImageIndex + 1}/{event.media_urls.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <View style={[styles.mediaPlaceholder, { backgroundColor: colors.SURFACE }]}>
              <FontAwesome5 name="image" size={32} color={colors.PRIMARY} />
              <Text style={{ color: colors.TEXT, marginTop: SPACING.S }}>No images</Text>
            </View>
          )}
          
          <View style={styles.eventInfo}>
            <Text style={[styles.eventTitle, { color: colors.TEXT }]}>{event.title}</Text>
            
            <View style={styles.eventMeta}>
              <View style={styles.metaItem}>
                <FontAwesome5 name="calendar-alt" size={14} color={colors.PRIMARY} />
                <Text style={[styles.metaText, { color: colors.TEXT }]}>{eventDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <FontAwesome5 name="clock" size={14} color={colors.PRIMARY} />
                <Text style={[styles.metaText, { color: colors.TEXT }]}>{eventTime}</Text>
              </View>
              <View style={styles.metaItem}>
                <FontAwesome5 
                  name={event.source === 'twitter' ? 'twitter' : 'mobile-alt'} 
                  size={14} 
                  color={colors.PRIMARY} 
                />
                <Text style={[styles.metaText, { color: colors.TEXT }]}>
                  {event.source === 'twitter' ? 'Twitter' : 'App'}
                </Text>
              </View>
            </View>

            {event.tags && event.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {event.tags.map((tag, index) => (
                  <View 
                    key={index} 
                    style={[styles.tag, { backgroundColor: `${colors.PRIMARY}20` }]}
                  >
                    <Text style={[styles.tagText, { color: colors.PRIMARY }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            <Text style={[styles.eventDescription, { color: colors.TEXT }]}>
              {event.description}
            </Text>

            <View style={[styles.mapSection, { backgroundColor: colors.SURFACE }]}>
              <Text style={[styles.sectionTitle, { color: colors.TEXT }]}>Location</Text>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={{
                    latitude: event.location.latitude,
                    longitude: event.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: event.location.latitude,
                      longitude: event.location.longitude,
                    }}
                  >
                    <View style={[styles.markerContainer, { backgroundColor: colors.PRIMARY }]}>
                      <FontAwesome5 name="map-pin" size={16} color="#FFFFFF" />
                    </View>
                  </Marker>
                </MapView>
                {event.location.address && (
                  <Text style={[styles.addressText, { color: colors.TEXT }]}>
                    {event.location.address}
                  </Text>
                )}
              </View>
              <TouchableOpacity 
                style={[styles.directionsButton, { backgroundColor: colors.PRIMARY }]}
                onPress={openInMaps}
              >
                <FontAwesome5 name="directions" size={16} color="#FFFFFF" />
                <Text style={styles.directionsButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.L,
  },
  loadingText: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: TYPOGRAPHY.BODY.SIZE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.M,
  },
  headerTitle: {
    flex: 1,
    fontFamily: TYPOGRAPHY.HEADINGS.fontFamily,
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: SPACING.S,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  mediaContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#F0F0F0',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaCounter: {
    position: 'absolute',
    bottom: SPACING.M,
    right: SPACING.M,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.S,
    paddingVertical: 4,
  },
  mediaCounterText: {
    color: '#FFFFFF',
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 12,
  },
  eventInfo: {
    padding: SPACING.L,
  },
  eventTitle: {
    fontFamily: TYPOGRAPHY.HEADINGS.fontFamily,
    fontSize: TYPOGRAPHY.HEADINGS.XL,
    marginBottom: SPACING.M,
  },
  eventMeta: {
    flexDirection: 'row',
    marginBottom: SPACING.M,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.L,
    marginBottom: SPACING.S,
  },
  metaText: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 14,
    marginLeft: SPACING.XS,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.M,
  },
  tag: {
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.S,
    paddingVertical: 4,
    marginRight: SPACING.XS,
    marginBottom: SPACING.XS,
  },
  tagText: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 12,
  },
  eventDescription: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: TYPOGRAPHY.BODY.SIZE,
    lineHeight: 24,
    marginBottom: SPACING.L,
  },
  mapSection: {
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    ...SHADOWS.SMALL,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 16,
    marginBottom: SPACING.S,
  },
  mapContainer: {
    marginBottom: SPACING.M,
  },
  map: {
    height: 150,
    borderRadius: BORDER_RADIUS.S,
    marginBottom: SPACING.S,
  },
  addressText: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: 14,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.M,
    borderRadius: BORDER_RADIUS.M,
  },
  directionsButtonText: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: SPACING.S,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default EventDetailScreen;
