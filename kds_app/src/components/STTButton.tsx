import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
// import * as Permissions from 'expo-permissions';
// import * as SpeechToText from 'expo-speech-to-text'; // Placeholder, replace with actual STT lib if needed
import { getTask } from '../stt/getTask';
// import Voice from '@react-native-voice/voice';

interface STTButtonProps {
  onResult?: (data: any) => void;
}

export const STTButton: React.FC<STTButtonProps> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const isMounted = useRef(true);

  // STT functionality is commented out for now so the app can run
  const handlePress = async () => {
    Alert.alert('STT Disabled', 'Speech-to-text functionality is currently disabled.');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress} disabled={isListening || isProcessing}>
        <MaterialIcons name="mic" size={32} color={isListening ? 'red' : 'black'} />
        <Text style={styles.label}>{isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Speak'}</Text>
      </TouchableOpacity>
  {/* STT functionality is disabled, so no status or result shown */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 24,
    padding: 10,
    elevation: 2,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
});
