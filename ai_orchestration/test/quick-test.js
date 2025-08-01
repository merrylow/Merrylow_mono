// Quick test - modify the order text below and run: node quick-test.js

const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const ORDER_TEXT = 'Table 8: Jollof rice, Banku with okra soup, and Kelewele'; // ← Change this!

async function quickTest() {
  const client = new TextToSpeechClient({
    keyFilename: './credentials.json',
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
  });
  
  // Enhanced pronunciation
  const enhancedText = ORDER_TEXT
    .replace(/banku/gi, '<phoneme alphabet="ipa" ph="ˈbɑnku">Banku</phoneme>')
    .replace(/fufu/gi, '<phoneme alphabet="ipa" ph="ˈfufu">Fufu</phoneme>')
    .replace(/kelewele/gi, '<phoneme alphabet="ipa" ph="kɛlɛˈwɛlɛ">Kelewele</phoneme>');
  
  const [response] = await client.synthesizeSpeech({
    input: { ssml: `<speak>${enhancedText}</speak>` },
    voice: { languageCode: 'en-US', name: 'en-US-Standard-J' },
    audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9, volumeGainDb: 6.0 }
  });
  
  fs.writeFileSync('quick-test.mp3', response.audioContent, 'binary');
  console.log('🔊 Playing:', ORDER_TEXT);
  exec('start quick-test.mp3');
}

quickTest().catch(console.error);
