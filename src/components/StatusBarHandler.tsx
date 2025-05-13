import React from 'react';
import { StatusBar, StatusBarProps, Platform, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../constants/theme';

interface StatusBarHandlerProps extends StatusBarProps {
  children: React.ReactNode;
}

const StatusBarHandler: React.FC<StatusBarHandlerProps> = ({ 
  barStyle = 'light-content', 
  backgroundColor,
  children,
  ...props 
}) => {
  const { mode } = useTheme();
  const colors = getThemeColors(mode);
  
  const statusBarBgColor = backgroundColor || colors.PRIMARY;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={statusBarBgColor}
        translucent={true}
        {...props}
      />
      {/* Extra padding for iOS devices with notch */}
      {Platform.OS === 'ios' && (
        <View style={[styles.statusBarFill, { backgroundColor: statusBarBgColor }]} />
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarFill: {
    height: Platform.OS === 'ios' ? 50 : 0, // Extra padding for iOS notches
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});

export default StatusBarHandler;
