import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { KitchenDisplayScreen } from '../screens/KitchenDisplayScreen';
import { ModeSelector } from '../components/ModeSelector';
import { AppMode } from '../types/menu';
import { COLORS } from '../constants/theme';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { ManagementScreen } from '../screens/ManagementScreen';

/**
 * Main navigation component for the Kitchen Display System
 * Supports both Kitchen Mode and Management Mode
 */
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="KitchenDisplay" component={KitchenDisplayScreen} />
  <Stack.Screen name="ManagementDashboard" component={ManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();
