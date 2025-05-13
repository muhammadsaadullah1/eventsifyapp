import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES, TYPOGRAPHY, SPACING, BORDER_RADIUS, getThemeColors } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: string;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  icon,
  secureTextEntry,
  ...props
}) => {
  const { mode } = useTheme();
  const colors = getThemeColors(mode);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.TEXT }]}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        { borderColor: error ? '#FF3B30' : colors.SECONDARY },
        props.editable === false && { backgroundColor: colors.SURFACE },
      ]}>
        {icon && (
          <FontAwesome5
            name={icon}
            size={18}
            color={colors.SECONDARY}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { color: colors.TEXT },
            icon ? { paddingLeft: SPACING.XS } : null
          ]}
          placeholderTextColor={`${colors.TEXT}80`}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibilityIcon}>
            <FontAwesome5
              name={isPasswordVisible ? 'eye-slash' : 'eye'}
              size={18}
              color={colors.SECONDARY}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.M,
  },
  label: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: TYPOGRAPHY.LABELS.SIZE,
    marginBottom: SPACING.XS,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.M,
    height: 50,
    paddingHorizontal: SPACING.M,
  },
  input: {
    flex: 1,
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    fontSize: TYPOGRAPHY.BODY.SIZE,
    height: '100%',
  },
  icon: {
    marginRight: SPACING.S,
  },
  visibilityIcon: {
    padding: SPACING.XS,
  },
  errorText: {
    fontFamily: TYPOGRAPHY.LABELS.fontFamily,
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});

export default Input;
