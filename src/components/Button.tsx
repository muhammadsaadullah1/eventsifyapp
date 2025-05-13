import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, getThemeColors } from '../constants/theme';
import { createTextStyle } from '../utils/styleUtils';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  containerStyle,
  textStyle,
  ...props
}) => {
  const { mode } = useTheme();
  const colors = getThemeColors(mode);

  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.PRIMARY,
          borderColor: colors.PRIMARY,
        };
      case 'secondary':
        return {
          backgroundColor: colors.SECONDARY,
          borderColor: colors.SECONDARY,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.PRIMARY,
        };
      default:
        return {
          backgroundColor: colors.PRIMARY,
          borderColor: colors.PRIMARY,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return colors.PRIMARY;
    }
    // For primary and secondary buttons, use text color that contrasts with background
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyles(),
        props.disabled && styles.disabled,
        containerStyle,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {title.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: BORDER_RADIUS.M,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.L,
    borderWidth: 2,
  },
  text: {
    ...createTextStyle(TYPOGRAPHY.LABELS),
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
