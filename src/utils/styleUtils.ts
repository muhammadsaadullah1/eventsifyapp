/**
 * Style utilities to handle typography styles properly
 */

// These are the valid React Native Text style property names
const validTextStyleProps = [
  'color',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'textAlign',
  'textDecorationLine',
  'textDecorationStyle',
  'textDecorationColor',
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
  'textTransform',
  'includeFontPadding',
  'marginBottom',
  'marginTop',
  'marginLeft',
  'marginRight',
  'margin',
  'padding',
  'paddingBottom',
  'paddingTop',
  'paddingLeft',
  'paddingRight',
];

/**
 * Extracts only valid Text style properties from a typography object
 * to avoid React Native warnings about invalid style properties
 */
export const extractTextStyle = (typographyObj: any): any => {
  const validStyle: Record<string, any> = {};
  
  // Only copy valid style properties
  Object.keys(typographyObj).forEach(key => {
    if (validTextStyleProps.includes(key)) {
      validStyle[key] = typographyObj[key];
    }
  });
  
  return validStyle;
};

/**
 * Creates a proper Text style object from typography constants
 */
export const createTextStyle = (
  typographyObj: any, 
  fontSizeKey: string = 'SIZE',
  additionalStyles: Record<string, any> = {}
): any => {
  return {
    fontFamily: typographyObj.fontFamily,
    fontSize: typographyObj[fontSizeKey],
    ...additionalStyles,
  };
};
