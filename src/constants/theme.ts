/**
 * Theme.ts
 * Main theme file that re-exports all theme-related constants
 */

// Import from our modular theme files
import { COLORS, THEMES, ThemeMode, ThemeColors, withOpacity } from './colors';
import { FONTS, FONT_SIZE, LINE_HEIGHT, TYPOGRAPHY, scaleFont } from './typography';
import { SPACING, BORDER_RADIUS, SHADOWS, SCREEN, LAYOUT, Z_INDEX } from './layout';

// Re-export everything for backward compatibility
export {
  // Colors
  COLORS,
  THEMES,
  withOpacity,
  
  // Typography
  FONTS,
  FONT_SIZE,
  LINE_HEIGHT,
  TYPOGRAPHY,
  scaleFont,
  
  // Layout
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  SCREEN,
  LAYOUT,
  Z_INDEX,
};

// Export types
export type { ThemeMode, ThemeColors };

// Helper functions
export const getThemeColors = (mode: ThemeMode): ThemeColors => {
  switch(mode) {
    case 'cosmicPurple':
      return THEMES.cosmicPurple;
    case 'oceanBlue':
      return THEMES.oceanBlue;
    case 'sunsetVibes':
      return THEMES.sunsetVibes;
    default:
      return THEMES.cosmicPurple; // Default fallback
  }
};

