import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { KitchenDisplayScreen } from '../screens/KitchenDisplayScreen';
import { ManagementScreen } from '../screens/ManagementScreen';
import { ModeSelector } from '../components/ModeSelector';
import { AppMode } from '../types/menu';
import { COLORS } from '../constants/theme';

/**
 * Main navigation component for the Kitchen Display System
 * Supports both Kitchen Mode and Management Mode
 */
export function AppNavigator() {
  const [currentMode, setCurrentMode] = useState<AppMode>('kitchen');

  const handleModeChange = (mode: AppMode) => {
    setCurrentMode(mode);
  };

  return (
    <View style={styles.container}>
      <ModeSelector 
        currentMode={currentMode} 
        onModeChange={handleModeChange}
      />
      
      <View style={styles.content}>
        {currentMode === 'kitchen' && <KitchenDisplayScreen />}
        {currentMode === 'management' && <ManagementScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  content: {
    flex: 1,
  },
});
