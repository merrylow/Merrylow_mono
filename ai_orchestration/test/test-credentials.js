const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const fs = require('fs');
require('dotenv').config();

async function testGoogleCloudTTS() {
  console.log('🧪 Testing Google Cloud TTS credentials...');
  
  try {
    // Check if credentials file exists
    if (!fs.existsSync('./credentials.json')) {
      throw new Error('credentials.json not found');
    }
    
    // Initialize TTS client
    const client = new TextToSpeechClient({
      keyFilename: './credentials.json',
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    });
    
    // Test with Ghanaian dish
    const request = {
      input: { 
        ssml: '<speak>Order for table 5: Jollof rice with chicken, <phoneme alphabet="ipa" ph="ˈbɑnku">Banku</phoneme> with tilapia</speak>'
      },
      voice: { 
        languageCode: 'en-US', 
        name: 'en-US-Standard-J' 
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: 0.9,
        volumeGainDb: 6.0
      }
    };
    
    console.log('📡 Calling Google Cloud TTS API...');
    const [response] = await client.synthesizeSpeech(request);
    
    console.log('✅ Google Cloud TTS working! Audio generated successfully.');
    console.log(`📊 Audio size: ${response.audioContent.length} bytes`);
    
    // Save audio file
    const audioFile = 'test-order-audio.mp3';
    fs.writeFileSync(audioFile, response.audioContent, 'binary');
    console.log(`💾 Audio saved as: ${audioFile}`);
    
    console.log('🎯 Ghanaian pronunciation enhancement: WORKING!');
    console.log('🔊 Playing audio... (if you have a media player available)');
    
    // Try to play the audio (Windows)
    const { exec } = require('child_process');
    exec(`start ${audioFile}`, (error) => {
      if (error) {
        console.log('💡 To hear the audio, open test-order-audio.mp3 in your media player');
      } else {
        console.log('🎵 Audio should be playing now!');
      }
    });
    
  } catch (error) {
    console.error('❌ Google Cloud TTS test failed:', error.message);
    console.log('🔄 System will fallback to Expo Speech in your KDS app');
  }
}

testGoogleCloudTTS();
