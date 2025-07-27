import { Order } from '../types/order';
import * as Speech from 'expo-speech';

/**
 * Format order data into the required display string
 * Format: "[name] [price] order for table [table_no] with note [note]"
 * 
 * @param order - The order object to format
 * @returns Formatted order string
 */
export function formatOrderString(order: Order): string {
  const priceFormatted = order.price.toFixed(2);
  const baseString = `${order.name} ${priceFormatted} order for ${order.table_no}`;
  
  // Add note if it exists and is not empty
  if (order.note && order.note.trim() !== '') {
    return `${baseString} with note ${order.note}`;
  }
  
  return baseString;
}

/**
 * Format price for display
 * 
 * @param price - The price number
 * @returns Formatted price string (e.g., "25.00")
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * Format timestamp for display
 * 
 * @param timestamp - ISO timestamp string or undefined
 * @returns Formatted time string (e.g., "2:30 PM") or "N/A" if no timestamp
 */
export function formatTime(timestamp?: string): string {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get time elapsed since order creation
 * 
 * @param timestamp - ISO timestamp string or undefined
 * @returns Time elapsed string (e.g., "5 min ago") or "Unknown time" if no timestamp
 */
export function getTimeElapsed(timestamp?: string): string {
  if (!timestamp) return 'Unknown time';
  
  const now = new Date();
  const orderTime = new Date(timestamp);
  const diffMs = now.getTime() - orderTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  } else {
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ${diffMinutes % 60}m ago`;
  }
}

/**
 * Format order data for TTS announcement
 * Format: "incoming order for table [table_no] ...the dish is [name] [price] with order note [note]"
 * 
 * @param order - The order object to format for TTS
 * @returns Formatted TTS string
 */
export function formatOrderForTTS(order: Order): string {
  const priceFormatted = order.price.toFixed(2);
  let ttsString = `Incoming order for table ${order.table_no}. The dish is ${order.name} ${priceFormatted} Ghana cedis`;
  
  // Add note if it exists and is not empty
  if (order.note && order.note.trim() !== '') {
    ttsString += ` with order note ${order.note}`;
  }
  
  return ttsString;
}

/**
 * Speak the order details using TTS
 * 
 * @param order - The order to announce
 * @param options - Optional TTS options
 */
export async function speakOrder(order: Order, options?: Speech.SpeechOptions): Promise<void> {
  try {
    const ttsText = formatOrderForTTS(order);
    
    const defaultOptions: Speech.SpeechOptions = {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9, // Slightly slower for clarity
      voice: undefined, // Use system default voice
      ...options,
    };
    
    console.log('🔊 TTS:', ttsText);
    await Speech.speak(ttsText, defaultOptions);
  } catch (error) {
    console.error('Error with TTS:', error);
  }
}

/**
 * Stop any ongoing TTS speech
 */
export function stopSpeaking(): void {
  try {
    Speech.stop();
  } catch (error) {
    console.error('Error stopping TTS:', error);
  }
}

/**
 * Check if TTS is currently speaking
 * 
 * @returns Promise<boolean> - true if speaking, false otherwise
 */
export async function isSpeaking(): Promise<boolean> {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error('Error checking TTS status:', error);
    return false;
  }
}
