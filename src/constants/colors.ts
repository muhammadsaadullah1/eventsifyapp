/**
 * Eventsify Color System
 * 
 * A vibrant, eye-catching color palette that creates an engaging and modern experience
 * Each color has meaningful name and purpose to maintain consistency across the app
 */

// Base color palette - Super vibrant and eye-catching with shocking contrasts
export const COLORS = {
  // Primary palette - Core brand colors with boosted vibrancy
  VIBRANT_PURPLE: '#9C27B0', // More saturated purple - Primary brand color
  ELECTRIC_BLUE: '#2979FF', // More electric blue - Secondary brand color
  SUNSET_ORANGE: '#FF3D00', // Brighter orange - Highlight color
  LIVELY_GREEN: '#00E676', // Neon green - Success indicator
  
  // Accent & Highlight Colors - Ultra-bright for maximum visual impact
  SUNSHINE_YELLOW: '#FFEA00', // Electrified yellow - Attention-grabbing accent
  NEON_PINK: '#F50057', // Shocking pink - Eye-catching highlight
  DEEP_PURPLE: '#6200EA', // Intensified purple - Premium/featured elements
  TURQUOISE: '#00E5FF', // Glowing turquoise - Interactive elements
  LASER_GREEN: '#76FF03', // Laser green - For extreme emphasis
  NEON_BLUE: '#304FFE', // Neon blue - For electric effects
  MAGENTA: '#D500F9', // Bright magenta - For vibrant contrast
  
  // Background spectrum - Creates depth
  SNOW_WHITE: '#FFFFFF', // Pure white background
  CLOUD_WHITE: '#F9FAFB', // Subtle off-white
  WHISPER_GRAY: '#F5F5F5', // Very light gray background
  SOFT_LAVENDER: '#F3E5F5', // Subtle purple tint background
  SOFT_AZURE: '#E1F5FE', // Subtle blue tint background
  
  // Text hierarchy
  INK_BLACK: '#212121', // Primary text
  CHARCOAL: '#424242', // Secondary text
  STEEL: '#757575', // Tertiary/hint text
  SILVER: '#9E9E9E', // Disabled text
  
  // Functional colors - Convey meaning
  SUCCESS_GREEN: '#00C853', // Success states
  WARNING_AMBER: '#FFB300', // Warning states
  ERROR_RED: '#D50000', // Error states
  INFO_BLUE: '#2196F3', // Information states
  
  // UI Elements
  DIVIDER: '#E0E0E0', // Subtle separation
  SHADOW: '#000000', // For elevation shadows
  OVERLAY: '#000000', // For modal overlays
  SCRIM: '#000000', // Semi-transparent overlay
  
  // Social Engagement
  LIKE_RED: '#F44336', // Likes/Favorites
  SHARE_GREEN: '#4CAF50', // Share actions
  ATTENDANCE_BLUE: '#2196F3', // Attending status
  REPORT_AMBER: '#FFC107', // Report flags
};

// Theme definitions - Updated with vibrant eye-catching combinations
export const THEMES = {
  // Vibrant purple theme (default)
  cosmicPurple: {
    PRIMARY: COLORS.VIBRANT_PURPLE,
    SECONDARY: COLORS.ELECTRIC_BLUE,
    BACKGROUND: COLORS.SNOW_WHITE,
    SURFACE: COLORS.SOFT_LAVENDER,
    TEXT: COLORS.INK_BLACK,
    ACCENT: COLORS.NEON_PINK,
    // Additional semantic colors
    SUCCESS: COLORS.SUCCESS_GREEN,
    WARNING: COLORS.WARNING_AMBER,
    ERROR: COLORS.ERROR_RED,
    INFO: COLORS.INFO_BLUE,
  },
  // Vibrant blue theme
  oceanBlue: {
    PRIMARY: COLORS.ELECTRIC_BLUE,
    SECONDARY: COLORS.TURQUOISE,
    BACKGROUND: COLORS.CLOUD_WHITE,
    SURFACE: COLORS.SOFT_AZURE,
    TEXT: COLORS.CHARCOAL,
    ACCENT: COLORS.DEEP_PURPLE,
    // Additional semantic colors
    SUCCESS: COLORS.SUCCESS_GREEN,
    WARNING: COLORS.WARNING_AMBER,
    ERROR: COLORS.ERROR_RED,
    INFO: COLORS.INFO_BLUE,
  },
  // Energetic orange theme
  sunsetVibes: {
    PRIMARY: COLORS.SUNSET_ORANGE,
    SECONDARY: COLORS.SUNSHINE_YELLOW,
    BACKGROUND: COLORS.SNOW_WHITE,
    SURFACE: COLORS.WHISPER_GRAY,
    TEXT: COLORS.INK_BLACK,
    ACCENT: COLORS.VIBRANT_PURPLE,
    // Additional semantic colors
    SUCCESS: COLORS.SUCCESS_GREEN,
    WARNING: COLORS.WARNING_AMBER,
    ERROR: COLORS.ERROR_RED,
    INFO: COLORS.INFO_BLUE,
  },
};

// Export types for better TypeScript support
export type ThemeMode = 'cosmicPurple' | 'oceanBlue' | 'sunsetVibes';
export type ThemeColors = typeof THEMES.cosmicPurple | typeof THEMES.oceanBlue | typeof THEMES.sunsetVibes;

// Opacity helpers
export const withOpacity = (color: string, opacity: number): string => {
  // Ensure opacity is between 0 and 1
  const validOpacity = Math.max(0, Math.min(1, opacity));
  
  // Convert opacity to hex
  const alpha = Math.round(validOpacity * 255).toString(16).padStart(2, '0');
  
  // Return color with opacity
  return `${color}${alpha}`;
};
