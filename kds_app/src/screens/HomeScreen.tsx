import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  KitchenDisplay: undefined;
  ManagementDashboard: undefined;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5E5', // Soft neumorphic background
    padding: 24,
  },
  card: {
    width: '95%',
    maxWidth: 800,
    alignItems: 'center',
    padding: 32,
    borderRadius: 32,
    backgroundColor: '#f3efefff',
    // Neumorphic dual shadow
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -10, height: -10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
    ...Platform.select({
      android: {
        elevation: 8,
      },
    }),
    marginBottom: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F0F0F3',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
    color: '#4b5AE3',
    letterSpacing: 1.2,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 12,
  },
  button: {
    width: 260,
    height: 110,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1,
    backgroundColor: '#E5E5E5',
    // Neumorphic dual shadow
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F3',
  },
  buttonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    shadowColor: '#AEAEC0',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  kitchenButton: {
    borderColor: '#4b5AE3',
  },
  managementButton: {
    borderColor: '#3d4ac6',
  },
  buttonText: {
    color: '#4b5AE3',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 1,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim1, { toValue: 1.01, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim1, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim2, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim2, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim1, pulseAnim2]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Eren</Text>
        <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: pulseAnim1 }] }]}> 
          <TouchableOpacity
            style={[styles.button, styles.kitchenButton]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('KitchenDisplay')}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>Kitchen Mode</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: pulseAnim2 }] }]}> 
          <TouchableOpacity
            style={[styles.button, styles.managementButton]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ManagementDashboard')}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>Management Mode</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}