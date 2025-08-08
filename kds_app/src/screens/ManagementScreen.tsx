import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ManagementDashboard } from './ManagementDashboard';
import { MenuManagement } from './MenuManagement';
import { COLORS } from '../constants/theme';

export type ManagementView = 'dashboard' | 'menu';

export function ManagementScreen() {
  const [currentView, setCurrentView] = useState<ManagementView>('dashboard');

  const navigateToMenu = () => {
    setCurrentView('menu');
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <View style={styles.container}>
      {currentView === 'dashboard' && (
        <ManagementDashboard onNavigateToMenu={navigateToMenu} />
      )}
      {currentView === 'menu' && (
        <MenuManagement onBack={navigateToDashboard} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
