import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { THEMES, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, getThemeColors } from '../../constants/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import supabase from '../../supabase/supabase';
import { MainStackParamList } from '../../navigation/types';

type CreateEventScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}

const CreateEventScreen: React.FC = () => {
  const navigation = useNavigation<CreateEventScreenNavigationProp>();
  const { mode } = useTheme();
  const { state: authState } = useAuth();
  const colors = getThemeColors(mode); // Use the helper function to get the correct theme colors

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need media library permissions to upload photos and videos!'
        );
      }
    })();

    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to tag your event.'
        );
        setLoadingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // Get address of the location
      const [addressData] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addressData) {
        const address = [
          addressData.name,
          addressData.street,
          addressData.city,
          addressData.region,
          addressData.postalCode,
          addressData.country,
        ]
          .filter(Boolean)
          .join(', ');

        setLocation(prevState => ({
          ...prevState!,
          address,
        }));
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get your current location');
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newMedia = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          fileName: asset.fileName,
        } as MediaItem));

        if (media.length + newMedia.length > 5) {
          Alert.alert('Limit Exceeded', 'You can only upload up to 5 media items.');
          return;
        }

        setMedia([...media, ...newMedia]);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const updateLocation = (e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    setLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for your event');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please enter a description for your event');
      return false;
    }

    if (!location) {
      Alert.alert('Missing Information', 'Please set a location for your event');
      return false;
    }

    return true;
  };

  const createEvent = async () => {
    if (!validateForm()) return;
    if (!authState.user) {
      Alert.alert('Authentication Error', 'You must be logged in to create an event');
      return;
    }

    try {
      setLoading(true);

      // Upload media files to Supabase Storage
      const mediaUrls = [];
      if (media.length > 0) {
        for (const item of media) {
          const fileExt = item.uri.split('.').pop();
          const fileName = `${authState.user.id}/${new Date().getTime()}.${fileExt}`;
          const filePath = `${fileName}`;

          // For simplicity, we're assuming image here, but this would need to handle videos too
          const formData = new FormData();
          formData.append('file', {
            uri: item.uri,
            name: item.fileName || `upload.${fileExt}`,
            type: item.type === 'image' ? 'image/jpeg' : 'video/mp4',
          } as any);

          const { data, error } = await supabase.storage
            .from('event-media')
            .upload(filePath, formData);

          if (error) {
            throw error;
          }

          const { data: urlData } = supabase.storage
            .from('event-media')
            .getPublicUrl(filePath);

          mediaUrls.push(urlData.publicUrl);
        }
      }

      // Parse tags
      const tagList = tags.trim() 
        ? tags.split(',').map(tag => tag.trim()) 
        : [];

      // Create event in database
      const eventData = {
        title,
        description,
        location,
        media_urls: mediaUrls,
        user_id: authState.user.id,
        created_at: new Date().toISOString(),
        tags: tagList,
        source: 'app',
      };

      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Generate deep link
      const deepLink = `https://eventsify.page.link/event/${data.id}`;

      // Update event with deep link
      await supabase
        .from('events')
        .update({ deep_link: deepLink })
        .eq('id', data.id);

      Alert.alert(
        'Success!',
        'Your event has been created successfully',
        [{ text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'Map' }) }]
      );

      // Clear form
      setTitle('');
      setDescription('');
      setTags('');
      setMedia([]);
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.PRIMARY }]}>Create Event</Text>
          <Text style={[styles.subtitle, { color: colors.TEXT }]}>
            Share what's happening around you
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Event Title"
            placeholder="Enter a title for your event"
            value={title}
            onChangeText={setTitle}
            icon="calendar-alt"
          />

          <Input
            label="Description"
            placeholder="What's happening? Give some details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            icon="align-left"
          />

          <Input
            label="Tags (comma separated)"
            placeholder="e.g. music, outdoor, free"
            value={tags}
            onChangeText={setTags}
            icon="tags"
          />

          <Text style={[styles.sectionTitle, { color: colors.TEXT }]}>Location</Text>
          {loadingLocation ? (
            <View style={[styles.mapPlaceholder, { backgroundColor: colors.SURFACE }]}>
              <ActivityIndicator size="large" color={colors.PRIMARY} />
              <Text style={{ color: colors.TEXT, marginTop: SPACING.M }}>
                Getting your location...
              </Text>
            </View>
          ) : location ? (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={updateLocation}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  draggable
                  onDragEnd={updateLocation}
                >
                  <View style={[styles.markerContainer, { backgroundColor: colors.PRIMARY }]}>
                    <FontAwesome5 name="map-pin" size={16} color="#FFFFFF" />
                  </View>
                </Marker>
              </MapView>
              {location.address && (
                <View style={[styles.addressContainer, { backgroundColor: colors.SURFACE }]}>
                  <Text style={[styles.addressText, { color: colors.TEXT }]}>
                    {location.address}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.mapPlaceholder, { backgroundColor: colors.SURFACE }]}
              onPress={getCurrentLocation}
            >
              <FontAwesome5 name="map-marker-alt" size={24} color={colors.PRIMARY} />
              <Text style={{ color: colors.TEXT, marginTop: SPACING.S }}>
                Tap to set location
              </Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.sectionTitle, { color: colors.TEXT }]}>Media</Text>
          <View style={styles.mediaSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaList}>
              {media.map((item, index) => (
                <View key={index} style={styles.mediaItemContainer}>
                  <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
                  <TouchableOpacity 
                    style={[styles.removeButton, { backgroundColor: colors.PRIMARY }]}
                    onPress={() => removeMedia(index)}
                  >
                    <FontAwesome5 name="times" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
              {media.length < 5 && (
                <TouchableOpacity 
                  style={[styles.addMediaButton, { backgroundColor: colors.SURFACE }]}
                  onPress={pickImage}
                >
                  <FontAwesome5 name="plus" size={24} color={colors.PRIMARY} />
                  <Text style={[styles.addMediaText, { color: colors.TEXT }]}>
                    Add Photos/Videos
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          <Button
            title="Create Event"
            onPress={createEvent}
            loading={loading}
            containerStyle={styles.submitButton}
          />
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
    paddingBottom: SPACING.XXL,
  },
  header: {
    padding: SPACING.L,
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
    padding: SPACING.L,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.M,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: TYPOGRAPHY.LABELS.SIZE,
    marginTop: SPACING.L,
    marginBottom: SPACING.M,
  },
  mapContainer: {
    height: 200,
    borderRadius: BORDER_RADIUS.M,
    overflow: 'hidden',
    marginBottom: SPACING.M,
    ...SHADOWS.MEDIUM,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    height: 200,
    borderRadius: BORDER_RADIUS.M,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.M,
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
  addressContainer: {
    position: 'absolute',
    bottom: SPACING.M,
    left: SPACING.M,
    right: SPACING.M,
    padding: SPACING.S,
    borderRadius: BORDER_RADIUS.S,
    ...SHADOWS.SMALL,
  },
  addressText: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: 12,
  },
  mediaSection: {
    marginBottom: SPACING.L,
  },
  mediaList: {
    flexDirection: 'row',
  },
  mediaItemContainer: {
    marginRight: SPACING.M,
    position: 'relative',
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.M,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },
  addMediaButton: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.M,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00000020',
    borderStyle: 'dashed',
  },
  addMediaText: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 12,
    marginTop: SPACING.XS,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: SPACING.L,
  },
});

export default CreateEventScreen;
