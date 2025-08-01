/**
 * Enhanced TTS service with Google Cloud Text-to-Speech integration
 * Provides natural, template-based announcements with proper Ghanaian dish pronunciation
 * Falls back to Expo Speech for reliability
 */

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { dishPronunciation } from './dishPronunciation';
import { voiceProfiles } from './voiceProfiles';

interface OrderContext {
  urgent?: boolean;
  timeOfDay?: 'morning' | 'day' | 'evening' | 'night';
  kitchenStatus?: 'busy' | 'normal' | 'quiet';
  orderSize?: 'small' | 'medium' | 'large';
}

interface Order {
  id: string;
  table: string;
  items: string;
  priority?: 'high' | 'normal' | 'low';
  notes?: string;
}

export class HumanizedTTS {
  private client: TextToSpeechClient;
  private templates: any;
  private templateRotation: { [key: string]: number } = {};

  constructor() {
    this.client = new TextToSpeechClient();
    this.loadTemplates();
  }

  async loadTemplates() {
    try {
      this.templates = require('../../config/announcementTemplates.json');
    } catch (error) {
      console.warn('Could not load announcement templates, using fallbacks');
      this.templates = {
        templates: {
          standard: "New order for table {table}... {items}",
          urgent: "Rush order! {items} for table {table} - priority!",
          large_order: "Big order coming in... {items} for table {table}",
          quiet_hours: "Gentle reminder... {items} for table {table}",
          busy_hours: "Kitchen alert! {items} for table {table}"
        }
      };
    }
  }

  /**
   * Main synthesis method with Google Cloud TTS
   */
  async synthesizeOrder(order: Order, context: OrderContext = {}): Promise<Buffer | null> {
    try {
      // 1. Apply dish pronunciation improvements
      const pronouncedText = dishPronunciation.enhanceText(order.items);
      
      // 2. Select appropriate template with rotation
      const template = this.selectTemplate(order, context);
      
      // 3. Format with template and SSML
      const ssmlText = this.formatWithSSML(pronouncedText, template, order);
      
      // 4. Get voice settings for current context
      const voiceConfig = voiceProfiles.getVoiceConfig({
        urgent: context.urgent || order.priority === 'high',
        timeOfDay: context.timeOfDay || this.getCurrentTimeOfDay(),
        kitchenStatus: context.kitchenStatus || 'normal',
        orderSize: context.orderSize || this.determineOrderSize(order.items)
      });
      
      // 5. Synthesize with Google Cloud TTS
      const audioContent = await this.synthesizeSSML(ssmlText, voiceConfig);
      
      console.log('✅ Google Cloud TTS synthesis successful');
      return audioContent;
      
    } catch (error) {
      console.error('TTS synthesis failed:', error);
      // Fallback to existing Expo Speech
      await this.fallbackToExpoSpeech(order);
      return null;
    }
  }

  /**
   * Synthesize SSML text using Google Cloud TTS
   */
  private async synthesizeSSML(ssmlText: string, voiceConfig: any): Promise<Buffer> {
    const request = {
      input: { ssml: ssmlText },
      voice: {
        languageCode: voiceConfig.languageCode || 'en-US',
        name: voiceConfig.voiceName,
        ssmlGender: voiceConfig.gender || 'NEUTRAL',
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
        speakingRate: voiceConfig.rate || 0.9,
        pitch: voiceConfig.pitch || 0,
        volumeGainDb: voiceConfig.volume || 0,
        effectsProfileId: ['handset-class-device'], // Kitchen-optimized
      },
    };

    const [response] = await this.client.synthesizeSpeech(request);
    
    if (!response.audioContent) {
      throw new Error('No audio content received from Google Cloud TTS');
    }
    
    return response.audioContent as Buffer;
  }

  /**
   * Format text with SSML and template variables
   */
  private formatWithSSML(text: string, template: string, order: Order): string {
    // Replace template variables
    let formattedTemplate = template
      .replace('{items}', text)
      .replace('{table}', order.table)
      .replace('{notes}', order.notes || '');

    // Wrap in SSML with kitchen-optimized prosody
    return `
      <speak>
        <prosody rate="0.9" pitch="-2st" volume="loud">
          ${formattedTemplate}
        </prosody>
      </speak>
    `.trim();
  }

  /**
   * Select appropriate template based on context with rotation
   */
  private selectTemplate(order: Order, context: OrderContext): string {
    let templateType = 'standard';

    // Determine template type based on context
    if (context.urgent || order.priority === 'high') {
      templateType = 'urgent';
    } else if (context.kitchenStatus === 'busy') {
      templateType = 'busy_hours';
    } else if (context.orderSize === 'large' || this.determineOrderSize(order.items) === 'large') {
      templateType = 'large_order';
    } else if (context.kitchenStatus === 'quiet' || context.timeOfDay === 'night') {
      templateType = 'quiet_hours';
    }

    // Get template with rotation if multiple variants exist
    const templates = this.templates.templates || this.templates;
    let selectedTemplate = templates[templateType];

    // If it's an array of templates, rotate through them
    if (Array.isArray(selectedTemplate)) {
      const rotationIndex = this.templateRotation[templateType] || 0;
      selectedTemplate = selectedTemplate[rotationIndex];
      this.templateRotation[templateType] = (rotationIndex + 1) % selectedTemplate.length;
    }

    return selectedTemplate || templates.standard;
  }

  /**
   * Fallback to Expo Speech if Google Cloud TTS fails
   */
  private async fallbackToExpoSpeech(order: Order): Promise<void> {
    try {
      // Import existing speakOrder function from KDS app
      const { speakOrder } = require('../../../kds_app/src/utils/formatOrder');
      
      // Apply pronunciation enhancements even in fallback
      const enhancedOrder = {
        ...order,
        items: dishPronunciation.enhanceText(order.items)
      };
      
      await speakOrder(enhancedOrder);
      console.log('🔄 Fallback to Expo Speech successful');
    } catch (fallbackError) {
      console.error('Both TTS methods failed:', fallbackError);
    }
  }

  /**
   * Determine current time of day
   */
  private getCurrentTimeOfDay(): 'morning' | 'day' | 'evening' | 'night' {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'day';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  /**
   * Determine order size based on items text
   */
  private determineOrderSize(items: string): 'small' | 'medium' | 'large' {
    const itemCount = items.split(',').length;
    
    if (itemCount <= 2) return 'small';
    if (itemCount <= 4) return 'medium';
    return 'large';
  }

  /**
   * Create enhanced announcement for kitchen display
   * This is the main method that replaces the existing speakOrder function
   */
  async announceOrder(order: Order, context: OrderContext = {}): Promise<void> {
    try {
      const audioBuffer = await this.synthesizeOrder(order, context);
      
      if (audioBuffer) {
        // TODO: Implement audio playback for React Native/Web platform
        // For now, log success and fall back to Expo Speech
        console.log('🎵 Audio synthesized, playing with fallback method');
        await this.fallbackToExpoSpeech(order);
      }
    } catch (error) {
      console.error('Order announcement failed:', error);
      await this.fallbackToExpoSpeech(order);
    }
  }
}

export const humanizedTTS = new HumanizedTTS();