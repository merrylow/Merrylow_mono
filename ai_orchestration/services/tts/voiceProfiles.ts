/**
 * Voice profiles optimized for different kitchen scenarios
 * Provides contextual voice settings for Google Cloud TTS
 */

interface VoiceConfig {
  languageCode: string;
  voiceName?: string;
  gender: 'MALE' | 'FEMALE' | 'NEUTRAL';
  rate: number;
  pitch: number;
  volume: number;
  emphasis?: 'strong' | 'moderate' | 'reduced';
}

interface KitchenContext {
  urgent?: boolean;
  timeOfDay?: 'morning' | 'day' | 'evening' | 'night';
  kitchenStatus?: 'busy' | 'normal' | 'quiet';
  orderSize?: 'small' | 'medium' | 'large';
}

export class VoiceProfiles {
  private profiles: { [key: string]: VoiceConfig };

  constructor() {
    this.profiles = {
      // Standard kitchen profile - clear and steady
      standard: {
        languageCode: 'en-US',
        voiceName: 'en-US-Wavenet-D', // Clear female voice
        gender: 'FEMALE',
        rate: 0.9,
        pitch: -2,
        volume: 2,
        emphasis: 'moderate'
      },

      // Urgent orders - faster and attention-grabbing
      urgent: {
        languageCode: 'en-US',
        voiceName: 'en-US-Wavenet-B', // Authoritative male voice
        gender: 'MALE',
        rate: 1.1,
        pitch: 2,
        volume: 4,
        emphasis: 'strong'
      },

      // Busy kitchen - slower and clearer
      busy_kitchen: {
        languageCode: 'en-US',
        voiceName: 'en-US-Wavenet-D',
        gender: 'FEMALE',
        rate: 0.8,
        pitch: -1,
        volume: 6,
        emphasis: 'strong'
      },

      // Quiet hours - softer and calmer
      quiet_hours: {
        languageCode: 'en-US',
        voiceName: 'en-US-Wavenet-F', // Softer female voice
        gender: 'FEMALE',
        rate: 0.85,
        pitch: -3,
        volume: 1,
        emphasis: 'reduced'
      },

      // Large orders - more measured pace
      large_order: {
        languageCode: 'en-US',
        voiceName: 'en-US-Wavenet-D',
        gender: 'FEMALE',
        rate: 0.75,
        pitch: -2,
        volume: 3,
        emphasis: 'moderate'
      }
    };
  }

  /**
   * Get voice configuration based on kitchen context
   */
  getVoiceConfig(context: KitchenContext = {}): VoiceConfig {
    // Priority order: urgent > busy kitchen > large order > time-based > standard
    
    if (context.urgent) {
      return this.profiles.urgent;
    }

    if (context.kitchenStatus === 'busy') {
      return this.profiles.busy_kitchen;
    }

    if (context.orderSize === 'large') {
      return this.profiles.large_order;
    }

    if (context.timeOfDay === 'night' || context.kitchenStatus === 'quiet') {
      return this.profiles.quiet_hours;
    }

    return this.profiles.standard;
  }

  /**
   * Get profile by name
   */
  getProfile(profileName: string): VoiceConfig {
    return this.profiles[profileName] || this.profiles.standard;
  }

  /**
   * Add or update a voice profile
   */
  setProfile(name: string, config: VoiceConfig) {
    this.profiles[name] = config;
  }

  /**
   * Get all available profile names
   */
  getAvailableProfiles(): string[] {
    return Object.keys(this.profiles);
  }
}

export const voiceProfiles = new VoiceProfiles();
