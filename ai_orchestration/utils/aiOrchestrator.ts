/**
 * Main AI orchestration service for KDS app
 * Coordinates TTS, STT, and NLP services for enhanced kitchen operations
 */

import { HumanizedTTS } from '../services/tts/humanizedTTS';
import { AudioProcessor } from './audioProcessor';

interface KitchenOrder {
  id: string;
  table: string;
  items: string;
  priority?: 'high' | 'normal' | 'low';
  notes?: string;
  status?: 'pending' | 'preparing' | 'ready' | 'completed';
  created_at?: string;
}

interface KitchenContext {
  urgent?: boolean;
  timeOfDay?: 'morning' | 'day' | 'evening' | 'night';
  kitchenStatus?: 'busy' | 'normal' | 'quiet';
  orderSize?: 'small' | 'medium' | 'large';
  ambientNoise?: 'low' | 'medium' | 'high';
}

export class AIOrchestrator {
  private tts: HumanizedTTS;
  private audioProcessor: AudioProcessor;
  private isEnabled: boolean = true;

  constructor() {
    this.tts = new HumanizedTTS();
    this.audioProcessor = new AudioProcessor();
  }

  /**
   * Enhanced order announcement for KDS app
   * This replaces the existing speakOrder() function in formatOrder.ts
   */
  async announceKitchenOrder(order: KitchenOrder, context: KitchenContext = {}): Promise<void> {
    if (!this.isEnabled) {
      console.log('AI orchestration disabled, skipping announcement');
      return;
    }

    try {
      // Determine context automatically if not provided
      const enhancedContext = {
        urgent: context.urgent || order.priority === 'high',
        timeOfDay: context.timeOfDay || this.getCurrentTimeOfDay(),
        kitchenStatus: context.kitchenStatus || this.assessKitchenStatus(),
        orderSize: context.orderSize || this.determineOrderSize(order.items),
        ...context
      };

      console.log(`🔊 Announcing order ${order.id} for table ${order.table}`, enhancedContext);

      // Use enhanced TTS with Google Cloud or fallback to Expo Speech
      await this.tts.announceOrder(order, enhancedContext);

    } catch (error) {
      console.error('AI orchestration failed:', error);
      // Final fallback to basic announcement
      await this.basicFallbackAnnouncement(order);
    }
  }

  /**
   * Process kitchen voice commands (Future implementation)
   */
  async processVoiceCommand(audioBlob: Blob): Promise<{ command: string; confidence: number } | null> {
    try {
      // TODO: Implement STT processing
      console.log('🎤 Voice command processing not yet implemented');
      return null;
    } catch (error) {
      console.error('Voice command processing failed:', error);
      return null;
    }
  }

  /**
   * Contextual understanding for kitchen workflow (Future implementation)
   */
  async analyzeKitchenContext(): Promise<KitchenContext> {
    try {
      // TODO: Implement contextual analysis
      return {
        timeOfDay: this.getCurrentTimeOfDay(),
        kitchenStatus: this.assessKitchenStatus(),
        ambientNoise: 'medium'
      };
    } catch (error) {
      console.error('Context analysis failed:', error);
      return { kitchenStatus: 'normal' };
    }
  }

  /**
   * Enable/disable AI features
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`AI orchestration ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current enhancement status
   */
  getStatus(): { enabled: boolean; features: string[] } {
    return {
      enabled: this.isEnabled,
      features: [
        'Enhanced TTS with Ghanaian pronunciation',
        'Template-based announcements', 
        'Context-aware voice profiles',
        'Google Cloud TTS with Expo Speech fallback'
      ]
    };
  }

  // Private helper methods
  private getCurrentTimeOfDay(): 'morning' | 'day' | 'evening' | 'night' {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'day';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  private assessKitchenStatus(): 'busy' | 'normal' | 'quiet' {
    const hour = new Date().getHours();
    
    // Peak hours: lunch (11-14) and dinner (17-21)
    if ((hour >= 11 && hour <= 14) || (hour >= 17 && hour <= 21)) {
      return 'busy';
    }
    
    // Late night/early morning
    if (hour >= 22 || hour <= 6) {
      return 'quiet';
    }
    
    return 'normal';
  }

  private determineOrderSize(items: string): 'small' | 'medium' | 'large' {
    const itemCount = items.split(',').length;
    
    if (itemCount <= 2) return 'small';
    if (itemCount <= 4) return 'medium';
    return 'large';
  }

  private async basicFallbackAnnouncement(order: KitchenOrder): Promise<void> {
    try {
      // Very basic fallback using console or simple text
      console.log(`📢 FALLBACK: New order ${order.id} for table ${order.table}: ${order.items}`);
      
      // Try to use basic Expo Speech if available
      if (typeof require !== 'undefined') {
        try {
          const { Speech } = require('expo-av');
          await Speech.speak(`New order for table ${order.table}`);
        } catch (expoError) {
          console.warn('Expo Speech also failed:', expoError);
        }
      }
    } catch (error) {
      console.error('Even basic fallback failed:', error);
    }
  }
}

export const aiOrchestrator = new AIOrchestrator();
