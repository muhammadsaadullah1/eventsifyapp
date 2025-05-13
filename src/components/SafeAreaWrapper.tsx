import React from 'react';
import { View, StatusBar, StyleSheet, Platform, Dimensions } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../constants/theme';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: Edge[];
  backgroundColor?: string;
  barStyle?: 'light-content' | 'dark-content';
}

/**
 * A wrapper component that provides safe area insets and proper status bar handling
 * to prevent content from collapsing with the top of mobile devices.
 */
const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  edges = ['top', 'right', 'bottom', 'left'],
  backgroundColor,
  barStyle = 'dark-content',
}) => {
  const { mode } = useTheme();
  const colors = getThemeColors(mode);
  
  // Use provided backgroundColor or default to theme background
  const bgColor = backgroundColor || colors.BACKGROUND;
  
  // Get the current status bar height based on platform and device
  const getStatusBarHeight = (): number => {
    if (Platform.OS === 'ios') {
      // For iOS we use a standard height based on device type
      const windowHeight = Dimensions.get('window').height;
      return windowHeight >= 812 ? 44 : 20; // 44px for iPhone X and newer, 20px for older iPhones
    } else {
      // For Android we use the actual status bar height
      return StatusBar.currentHeight || 0;
    }
  };
  
  // Get the standard status bar height for the current device
  const STATUSBAR_HEIGHT = getStatusBarHeight();
  
  // Calculate additional padding needed (minimal, just to ensure good spacing)
  const additionalTopPadding = Platform.OS === 'ios' ? 
    (Platform.isPad ? 0 : 10) : // 10px extra for iPhones, none for iPads 
    8; // 8px extra for Android devices
  
  // This creates a standard status bar height across all devices
  
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={barStyle}
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={[styles.statusBarSpacer, { height: additionalTopPadding, backgroundColor: bgColor }]} />
      <SafeAreaView style={styles.safeArea} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  statusBarSpacer: {
    width: '100%',
  },
});

export default SafeAreaWrapper;
