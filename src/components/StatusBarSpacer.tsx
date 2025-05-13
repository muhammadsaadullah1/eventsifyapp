import React from 'react';
import { View, StatusBar, Platform, StyleSheet } from 'react-native';

interface StatusBarSpacerProps {
  backgroundColor?: string;
}

/**
 * A component that adds appropriate spacing at the top of the screen to account for
 * the status bar height on different devices, preventing content from collapsing
 * with the top of mobile screens.
 */
const StatusBarSpacer: React.FC<StatusBarSpacerProps> = ({ backgroundColor = 'white' }) => {
  // Get the current height of the status bar
  const statusBarHeight = StatusBar.currentHeight || (Platform.OS === 'ios' ? 44 : 0);
  
  return (
    <View style={[styles.spacer, { height: statusBarHeight, backgroundColor }]} />
  );
};

const styles = StyleSheet.create({
  spacer: {
    width: '100%',
  },
});

export default StatusBarSpacer;
