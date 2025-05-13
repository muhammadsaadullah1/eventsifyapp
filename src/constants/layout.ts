/**
 * Layout Constants
 * Centralized layout definitions for the Eventsify app
 */
import { Dimensions } from 'react-native';

// Screen dimensions
export const SCREEN = {
  WIDTH: Dimensions.get('window').width,
  HEIGHT: Dimensions.get('window').height,
};

// Spacing constants
export const SPACING = {
  XS: 4,
  S: 8,
  M: 16,
  L: 24,
  XL: 32,
  XXL: 48,
};

// Border radius constants
export const BORDER_RADIUS = {
  XS: 2,
  S: 4,
  M: 8,
  L: 16,
  XL: 24,
  ROUND: 999,
};

// Shadow styles
export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
};

// Z-index levels
export const Z_INDEX = {
  BASE: 0,
  CARD: 10,
  HEADER: 20,
  MODAL: 30,
  TOOLTIP: 40,
  OVERLAY: 50,
};

// Common layout constants
export const LAYOUT = {
  // Standard container padding
  CONTAINER_PADDING: SPACING.M,
  
  // Header height
  HEADER_HEIGHT: 60,
  
  // Tab bar height
  TAB_BAR_HEIGHT: 60,
  
  // Icon sizes
  ICON: {
    SMALL: 16,
    MEDIUM: 24,
    LARGE: 32,
  },
};
