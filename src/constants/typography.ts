/**
 * Typography Constants
 * Centralized typography definitions for the Eventsify app
 */

// Font family definitions
export const FONTS = {
  POPPINS_REGULAR: 'Poppins-Regular',
  POPPINS_SEMIBOLD: 'Poppins-SemiBold',
  POPPINS_BOLD: 'Poppins-Bold',
  INTER_REGULAR: 'Inter-Regular',
  INTER_MEDIUM: 'Inter-Medium',
  INTER_SEMIBOLD: 'Inter-SemiBold',
};

// Font size definitions
export const FONT_SIZE = {
  XS: 12,
  S: 14,
  M: 16,
  L: 18,
  XL: 20,
  XXL: 24,
  XXXL: 28,
  HUGE: 32,
};

// Line height definitions
export const LINE_HEIGHT = {
  XS: 16,
  S: 20,
  M: 24,
  L: 28,
  XL: 32,
  XXL: 36,
  XXXL: 40,
};

// Typography variants
export const TYPOGRAPHY = {
  HEADINGS: {
    fontFamily: FONTS.POPPINS_SEMIBOLD,
    XL: FONT_SIZE.XXXL,
    XXL: FONT_SIZE.HUGE,
    XXXL: 36,
  },
  BODY: {
    fontFamily: FONTS.INTER_REGULAR,
    SIZE: FONT_SIZE.M,
    LARGE: FONT_SIZE.L,
  },
  LABELS: {
    fontFamily: FONTS.INTER_MEDIUM,
    SIZE: FONT_SIZE.S,
  },
  BUTTON: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    SIZE: FONT_SIZE.M,
  },
  CAPTION: {
    fontFamily: FONTS.INTER_REGULAR,
    SIZE: FONT_SIZE.XS,
  },
};

// Helper for responsive typography
export const scaleFont = (size: number, factor = 0.1): number => {
  return Math.round(size + (size * factor));
};
