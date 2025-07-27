import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KitchenDisplayScreen } from '../screens/KitchenDisplayScreen';
import { COLORS } from '../constants/theme';

/**
 * Main navigation component for the Kitchen Display System
 * Now uses a single screen with collapsible tabs instead of stack navigation
 */
export function AppNavigator() {
  return (
    <View style={styles.container}>
      <KitchenDisplayScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
