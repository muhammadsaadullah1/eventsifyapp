import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, getThemeColors } from '../../constants/theme';
import { createTextStyle } from '../../utils/styleUtils';
import Button from '../../components/Button';
import supabase from '../../supabase/supabase';
import { Event } from '../../types';

const ProfileScreen: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const { state: authState, signOut } = useAuth();
  const colors = getThemeColors(mode);
  
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  
  useEffect(() => {
    if (authState.user) {
      fetchUserProfile();
      fetchUserEvents();
    }
  }, [authState.user]);

  const fetchUserProfile = async () => {
    try {
      if (!authState.user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', authState.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setUsername(data.username || '');
        setProfileImage(data.avatar_url || null);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      if (!authState.user) return;
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', authState.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUserEvents(data as Event[]);
      }
    } catch (error) {
      console.error('Error fetching user events:', error);
      Alert.alert('Error', 'Failed to load your events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        
        // Upload image to Supabase Storage
        const fileExt = uri.split('.').pop();
        const filePath = `${authState.user?.id}/profile.${fileExt}`;
        
        const formData = new FormData();
        formData.append('file', {
          uri,
          name: `profile.${fileExt}`,
          type: `image/${fileExt}`,
        } as any);

        setLoading(true);
        
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(filePath, formData, { upsert: true });
        
        if (error) {
          throw error;
        }
        
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        // Update profile with new avatar URL
        await supabase
          .from('profiles')
          .update({ avatar_url: urlData.publicUrl })
          .eq('id', authState.user?.id);
        
        setProfileImage(urlData.publicUrl);
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      Alert.alert('Error', 'Failed to update profile image');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: signOut, style: 'destructive' }
      ]
    );
  };

  if (!authState.user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
        <View style={styles.centeredContent}>
          <Text style={[styles.errorText, { color: colors.TEXT }]}>
            Please sign in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.PRIMARY }]}>Your Profile</Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: colors.SURFACE }]}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.PRIMARY }]}>
                <FontAwesome5 name="user-alt" size={40} color="#FFFFFF" />
              </View>
            )}
            <View style={[styles.editIcon, { backgroundColor: colors.SECONDARY }]}>
              <FontAwesome5 name="pencil-alt" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.username, { color: colors.TEXT }]}>
            {username || authState.user.email}
          </Text>
          <Text style={[styles.email, { color: colors.TEXT }]}>
            {authState.user.email}
          </Text>
        </View>

        <View style={[styles.settingsSection, { backgroundColor: colors.SURFACE }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT }]}>
            Settings
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <FontAwesome5 name={mode === 'sunsetVibes' ? 'sun' : 'moon'} size={18} color={colors.PRIMARY} />
              <Text style={[styles.settingLabel, { color: colors.TEXT }]}>
                {mode === 'sunsetVibes' ? 'Sunset Vibes' : 'Cosmic Purple'} Theme
              </Text>
            </View>
            <Switch
              value={mode === 'cosmicPurple'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.SURFACE, true: colors.PRIMARY }}
              thumbColor={colors.ACCENT}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <FontAwesome5 name="bell" size={18} color={colors.PRIMARY} />
              <Text style={[styles.settingLabel, { color: colors.TEXT }]}>
                Notifications
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: '#767577', true: colors.PRIMARY }}
              thumbColor={'#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.eventsSection, { backgroundColor: colors.SURFACE }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT }]}>
            Your Events
          </Text>
          
          {loading ? (
            <Text style={[styles.placeholderText, { color: colors.TEXT }]}>
              Loading your events...
            </Text>
          ) : userEvents.length > 0 ? (
            userEvents.map((event) => (
              <View 
                key={event.id} 
                style={[styles.eventCard, { borderColor: `${colors.PRIMARY}30` }]}
              >
                <View style={styles.eventHeader}>
                  <Text style={[styles.eventTitle, { color: colors.TEXT }]}>
                    {event.title}
                  </Text>
                  <Text style={[styles.eventSource, { backgroundColor: colors.PRIMARY }]}>
                    {event.source === 'twitter' ? 'Twitter' : 'App'}
                  </Text>
                </View>
                <Text style={[styles.eventDescription, { color: colors.TEXT }]} numberOfLines={2}>
                  {event.description}
                </Text>
                <View style={styles.eventFooter}>
                  <Text style={[styles.eventDate, { color: `${colors.TEXT}80` }]}>
                    {new Date(event.created_at).toLocaleDateString()}
                  </Text>
                  <TouchableOpacity style={styles.shareButton}>
                    <FontAwesome5 name="share-alt" size={16} color={colors.PRIMARY} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.placeholderText, { color: colors.TEXT }]}>
              You haven't created any events yet.
            </Text>
          )}
        </View>

        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleSignOut}
          containerStyle={styles.signOutButton}
        />
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
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.L,
  },
  header: {
    padding: SPACING.L,
  },
  title: {
    ...createTextStyle(TYPOGRAPHY.HEADINGS, 'XL'),
    marginBottom: SPACING.XS,
  },
  profileCard: {
    marginHorizontal: SPACING.L,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.L,
    alignItems: 'center',
    ...SHADOWS.MEDIUM,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.M,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  username: {
    fontFamily: TYPOGRAPHY.HEADINGS.fontFamily,
    fontSize: 20,
    marginBottom: SPACING.XS,
  },
  email: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: 16,
    opacity: 0.7,
  },
  settingsSection: {
    marginTop: SPACING.L,
    marginHorizontal: SPACING.L,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.L,
    ...SHADOWS.SMALL,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 18,
    marginBottom: SPACING.M,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.M,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00000020',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: 16,
    marginLeft: SPACING.M,
  },
  eventsSection: {
    marginTop: SPACING.L,
    marginHorizontal: SPACING.L,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.L,
    ...SHADOWS.SMALL,
  },
  eventCard: {
    marginBottom: SPACING.M,
    borderBottomWidth: 1,
    paddingBottom: SPACING.M,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  eventTitle: {
    fontFamily: TYPOGRAPHY.HEADINGS.fontFamily,
    fontSize: 16,
    flex: 1,
  },
  eventSource: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 10,
    color: '#FFFFFF',
    paddingHorizontal: SPACING.S,
    paddingVertical: 2,
    borderRadius: 4,
  },
  eventDescription: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: 14,
    marginBottom: SPACING.S,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDate: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 12,
  },
  shareButton: {
    padding: SPACING.XS,
  },
  placeholderText: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: 16,
    textAlign: 'center',
    padding: SPACING.L,
  },
  signOutButton: {
    marginTop: SPACING.L,
    marginHorizontal: SPACING.L,
  },
  errorText: {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
