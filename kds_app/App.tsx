import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, LogBox, AppRegistry, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initializeSupabase, testConnection, getUniqueStatuses } from './src/services/supabase';

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
        try {
          initializeSupabase();
          console.log('✅ Supabase client initialized');
        } catch (initError) {
          console.error('❌ Supabase initialization failed:', initError);
          throw new Error('Failed to initialize Supabase client');
        }
        
        // Test database connection
        const { success, error } = await testConnection();
        
        if (!success) {
          console.error('❌ Database connection failed:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          Alert.alert(
            'Connection Error',
            `Failed to connect to the database: ${error?.message || 'Unknown error'}. Please check your Supabase configuration in src/constants/config.ts`,
            [{ text: 'OK' }]
          );
        } else {
          console.log('✅ Database connection successful');
          
          // Check available statuses in database
          try {
            await getUniqueStatuses();
          } catch (statusError) {
            console.warn('Could not fetch unique statuses:', statusError);
          }
          
          console.log('🎯 Kitchen Display System ready!');
        }
        
        // Mark app as ready to render screens
        setIsAppReady(true);
      } catch (error) {
        console.error('❌ App initialization error:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        Alert.alert(
          'Initialization Error',
          `Failed to initialize the app: ${error instanceof Error ? error.message : 'Unknown error'}. Please restart and check your configuration.`,
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing Kitchen Display System...</Text>
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

// Register the main component
AppRegistry.registerComponent('main', () => App);
