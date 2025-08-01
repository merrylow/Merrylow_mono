/**
 * Voice and AI configuration settings for KDS app
 * Kitchen-optimized settings for TTS, STT, and voice commands
 */

interface KitchenVoiceSettings {
  // TTS Settings
  tts: {
    enabled: boolean;
    defaultRate: number;
    defaultPitch: number;
    defaultVolume: number;
    language: string;
    kitchenOptimized: boolean;
  };

  // Feature Flags
  features: {
    ghanaianDishPronunciation: boolean;
    enhancedKitchenTTS: boolean;
    voiceKitchenCommands: boolean;
    urgentOrderAlerts: boolean;
    templateBasedAnnouncements: boolean;
  };

  // Kitchen Environment
  environment: {
    backgroundNoiseLevel: 'low' | 'medium' | 'high';
    automaticVolumeAdjustment: boolean;
    speechEnhancement: boolean;
    emergencyAnnouncementPriority: boolean;
  };

  // Google Cloud TTS Configuration
  googleCloudTTS: {
    enabled: boolean;
    projectId?: string;
    keyFilePath?: string;
    preferredVoice: string;
    backupVoice: string;
    fallbackToExpoSpeech: boolean;
  };
}

export const kitchenVoiceSettings: KitchenVoiceSettings = {
  tts: {
    enabled: true,
    defaultRate: 0.9,        // Slightly slower for kitchen clarity
    defaultPitch: -2,        // Lower pitch for better intelligibility  
    defaultVolume: 6,        // Higher volume for noisy kitchen
    language: 'en-US',
    kitchenOptimized: true
  },

  features: {
    ghanaianDishPronunciation: true,    // ✅ Immediate improvement
    enhancedKitchenTTS: true,           // ✅ Template-based announcements
    voiceKitchenCommands: false,        // 🚧 Future implementation
    urgentOrderAlerts: true,            // ✅ Different voice for rush orders
    templateBasedAnnouncements: true    // ✅ Varied announcements
  },

  environment: {
    backgroundNoiseLevel: 'medium',
    automaticVolumeAdjustment: true,
    speechEnhancement: true,
    emergencyAnnouncementPriority: true
  },

  googleCloudTTS: {
    enabled: true,
    preferredVoice: 'en-US-Wavenet-D',  // Clear female voice for kitchen
    backupVoice: 'en-US-Standard-C',    // Fallback if Wavenet unavailable
    fallbackToExpoSpeech: true          // Always fallback to ensure reliability
  }
};

/**
 * Get voice settings based on current kitchen context
 */
export function getContextualVoiceSettings(context: {
  urgent?: boolean;
  timeOfDay?: 'morning' | 'day' | 'evening' | 'night';
  kitchenStatus?: 'busy' | 'normal' | 'quiet';
}) {
  const baseSettings = { ...kitchenVoiceSettings.tts };

  // Adjust for urgent orders
  if (context.urgent) {
    baseSettings.defaultRate = 1.1;
    baseSettings.defaultPitch = 2;
    baseSettings.defaultVolume = 8;
  }

  // Adjust for busy kitchen
  if (context.kitchenStatus === 'busy') {
    baseSettings.defaultRate = 0.8;  // Even slower
    baseSettings.defaultVolume = 10; // Louder
  }

  // Adjust for quiet periods
  if (context.kitchenStatus === 'quiet' || context.timeOfDay === 'night') {
    baseSettings.defaultVolume = 3;  // Quieter
    baseSettings.defaultRate = 0.85; // Slightly slower
  }

  return baseSettings;
}

/**
 * Kitchen shift-based profile switching
 */
export function getShiftBasedSettings(shift: 'morning' | 'lunch' | 'dinner' | 'late_night') {
  switch (shift) {
    case 'morning':
      return {
        ...kitchenVoiceSettings,
        tts: { ...kitchenVoiceSettings.tts, defaultVolume: 4 }
      };
    
    case 'lunch':
    case 'dinner':
      return {
        ...kitchenVoiceSettings,
        tts: { ...kitchenVoiceSettings.tts, defaultVolume: 8, defaultRate: 0.8 }
      };
    
    case 'late_night':
      return {
        ...kitchenVoiceSettings,
        tts: { ...kitchenVoiceSettings.tts, defaultVolume: 2, defaultRate: 0.85 }
      };
    
    default:
      return kitchenVoiceSettings;
  }
}


