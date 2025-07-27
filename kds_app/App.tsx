import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, LogBox, AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initializeSupabase, testConnection } from './src/services/supabase';

// Ignore specific warnings for cleaner development experience
LogBox.ignoreLogs([
  'Warning: AsyncStorage has been extracted from react-native',
  'Require cycle:',
]);

/**
 * Root component for the Kitchen Display System
 * Initializes Supabase connection and sets up navigation
 */
export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const setupApp = async () => {
      try {
        console.log('🚀 Initializing Kitchen Display System...');
        
        // Initialize Supabase client FIRST
        initializeSupabase();
        console.log('✅ Supabase client initialized');
        
        // Test database connection
        const { success, error } = await testConnection();
        
        if (!success) {
          console.error('❌ Database connection failed:', error);
          Alert.alert(
            'Connection Error',
            'Failed to connect to the database. Please check your Supabase configuration in src/constants/config.ts',
            [{ text: 'OK' }]
          );
        } else {
          console.log('✅ Database connection successful');
          console.log('🎯 Kitchen Display System ready!');
        }
        
        // Mark app as ready to render screens
        setIsAppReady(true);
      } catch (error) {
        console.error('❌ App initialization error:', error);
        Alert.alert(
          'Initialization Error',
          'Failed to initialize the app. Please restart and check your configuration.',
          [{ text: 'OK' }]
        );
        // Still set ready to true to show some UI
        setIsAppReady(true);
      }
    };

    setupApp();
  }, []);

  // Don't render navigation until Supabase is initialized
  if (!isAppReady) {
    return null; // or a loading screen
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}

// Register the main component
AppRegistry.registerComponent('main', () => App);
