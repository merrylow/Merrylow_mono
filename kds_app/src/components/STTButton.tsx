import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
// import * as Permissions from 'expo-permissions';
// import * as SpeechToText from 'expo-speech-to-text'; // Placeholder, replace with actual STT lib if needed
import { getTask } from '../stt/getTask';
// @ts-ignore
import Voice from '@react-native-voice/voice';

interface STTButtonProps {
  onResult?: (data: any) => void;
}

export const STTButton: React.FC<STTButtonProps> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const isMounted = useRef(true);

  React.useEffect(() => {
    isMounted.current = true;
    Voice.onSpeechStart = () => {
      if (!isMounted.current) return;
      setIsListening(true);
      setError(null);
      setResult('');
    };
    Voice.onSpeechEnd = () => {
      if (!isMounted.current) return;
      setIsListening(false);
    };
    Voice.onSpeechError = (e: any) => {
      if (!isMounted.current) return;
      setError(e.error?.message || 'Speech recognition error');
      setIsListening(false);
    };
    Voice.onSpeechResults = (e: any) => {
      if (!isMounted.current) return;
      const text = e.value?.[0] || '';
      setResult(text);
      handleRecognizedSpeech(text);
    };
    return () => {
      isMounted.current = false;
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleRecognizedSpeech = async (speech: string) => {
    setIsProcessing(true);
    try {
      const { data, message } = await getTask(speech);
      if (onResult) onResult(data);
      if (message) Speech.speak(message);
    } catch (err) {
      Alert.alert('STT Error', 'Failed to process speech command.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePress = async () => {
    setError(null);
    setResult('');
    try {
      await Voice.start('en-US');
    } catch (e) {
      setError('Could not start voice recognition.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress} disabled={isListening || isProcessing}>
        <MaterialIcons name="mic" size={32} color={isListening ? 'red' : 'black'} />
        <Text style={styles.label}>{isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Speak'}</Text>
      </TouchableOpacity>
      {(isListening || isProcessing) && <ActivityIndicator style={{ marginLeft: 10 }} />}
      {error && <Text style={{ color: 'red', marginLeft: 10 }}>{error}</Text>}
      {result && !isListening && !isProcessing && (
        <Text style={{ marginLeft: 10, color: 'green' }}>Heard: {result}</Text>
      )}
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
