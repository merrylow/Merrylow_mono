const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

async function testGhanaianDishes() {
  console.log('🍽️ Testing Ghanaian dish pronunciation...');
  
  try {
    const client = new TextToSpeechClient({
      keyFilename: './credentials.json',
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    });
    
    // Test different Ghanaian dishes with proper pronunciation
    const testCases = [
      {
        name: 'banku',
        ssml: '<speak>Table 5: <phoneme alphabet="ipa" ph="ˈbɑnku">Banku</phoneme> with tilapia</speak>',
        file: 'banku-test.mp3'
      },
      {
        name: 'fufu', 
        ssml: '<speak>Table 3: <phoneme alphabet="ipa" ph="ˈfufu">Fufu</phoneme> with palm nut soup</speak>',
        file: 'fufu-test.mp3'
      },
      {
        name: 'kelewele',
        ssml: '<speak>Table 7: <phoneme alphabet="ipa" ph="kɛlɛˈwɛlɛ">Kelewele</phoneme> with peanuts</speak>',
        file: 'kelewele-test.mp3'
      }
    ];
    
    for (const test of testCases) {
      console.log(`🔊 Testing pronunciation: ${test.name}`);
      
      const request = {
        input: { ssml: test.ssml },
        voice: { languageCode: 'en-US', name: 'en-US-Standard-J' },
        audioConfig: { 
          audioEncoding: 'MP3',
          speakingRate: 0.9,
          volumeGainDb: 6.0
        }
      };
      
      const [response] = await client.synthesizeSpeech(request);
      fs.writeFileSync(test.file, response.audioContent, 'binary');
      
      console.log(`💾 Saved: ${test.file}`);
      
      // Play the audio
      exec(`start ${test.file}`, () => {});
      
      // Wait 3 seconds before next test
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('✅ All pronunciation tests complete!');
    console.log('📁 Audio files saved: banku-test.mp3, fufu-test.mp3, kelewele-test.mp3');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testGhanaianDishes();
