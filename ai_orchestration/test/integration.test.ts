/**
 * Test file for Google Cloud TTS integration
 * Run this to verify that all components work together
 */

import { aiOrchestrator } from '../utils/aiOrchestrator';
import { humanizedTTS } from '../services/tts/humanizedTTS';
import { dishPronunciation } from '../services/tts/dishPronunciation';

// Sample test order with Ghanaian dishes
const testOrder = {
  id: 'test-001',
  table: '5',
  items: 'Jollof rice with chicken, Banku with tilapia, Kelewele, Waakye with stew',
  priority: 'normal' as const,
  notes: 'Extra spicy',
  status: 'pending' as const,
  created_at: new Date().toISOString()
};

const urgentOrder = {
  id: 'test-002',
  table: '12',
  items: 'Fufu with goat soup, Tuo Zaafi, Red red with gari',
  priority: 'high' as const,
  notes: 'Rush order',
  status: 'pending' as const,
  created_at: new Date().toISOString()
};

/**
 * Test basic dish pronunciation enhancement
 */
async function testDishPronunciation() {
  console.log('\n🧪 Testing Dish Pronunciation Enhancement...');
  
  const originalText = "Jollof rice, Banku with tilapia, Kelewele";
  const enhancedText = dishPronunciation.enhanceText(originalText);
  
  console.log('Original:', originalText);
  console.log('Enhanced:', enhancedText);
}

/**
 * Test template-based TTS
 */
async function testTemplateTTS() {
  console.log('\n🧪 Testing Template-Based TTS...');
  
  try {
    // Test standard announcement
    await humanizedTTS.announceOrder(testOrder, {
      timeOfDay: 'day',
      kitchenStatus: 'normal'
    });
    
    // Test urgent announcement
    await humanizedTTS.announceOrder(urgentOrder, {
      urgent: true,
      kitchenStatus: 'busy'
    });
    
    console.log('✅ Template TTS tests completed');
  } catch (error) {
    console.error('❌ Template TTS test failed:', error);
  }
}

/**
 * Test AI orchestrator integration
 */
async function testAIOrchestrator() {
  console.log('\n🧪 Testing AI Orchestrator...');
  
  try {
    // Test normal order announcement
    await aiOrchestrator.announceKitchenOrder(testOrder, {
      timeOfDay: 'day',
      kitchenStatus: 'busy'
    });
    
    // Test urgent order announcement
    await aiOrchestrator.announceKitchenOrder(urgentOrder, {
      urgent: true,
      timeOfDay: 'evening'
    });
    
    // Test status and configuration
    const status = aiOrchestrator.getStatus();
    console.log('AI Orchestrator Status:', status);
    
    console.log('✅ AI Orchestrator tests completed');
  } catch (error) {
    console.error('❌ AI Orchestrator test failed:', error);
  }
}

/**
 * Test Google Cloud TTS (requires valid credentials)
 */
async function testGoogleCloudTTS() {
  console.log('\n🧪 Testing Google Cloud TTS Integration...');
  
  try {
    const audioBuffer = await humanizedTTS.synthesizeOrder(testOrder, {
      timeOfDay: 'day',
      kitchenStatus: 'normal'
    });
    
    if (audioBuffer) {
      console.log(`✅ Google Cloud TTS successful! Audio size: ${audioBuffer.length} bytes`);
    } else {
      console.log('🔄 Google Cloud TTS failed, fallback used');
    }
  } catch (error) {
    console.error('❌ Google Cloud TTS test failed:', error);
    console.log('💡 Make sure GOOGLE_APPLICATION_CREDENTIALS is set');
  }
}

/**
 * Integration test with KDS app format
 */
async function testKDSIntegration() {
  console.log('\n🧪 Testing KDS App Integration...');
  
  // Simulate order from KDS app format
  const kdsOrder = {
    id: 'ord_123456',
    table_number: '8',
    items: [
      { name: 'Jollof Rice', quantity: 2, notes: 'with chicken' },
      { name: 'Banku', quantity: 1, notes: 'with tilapia' },
      { name: 'Kelewele', quantity: 1, notes: 'extra spicy' }
    ],
    order_status: 'pending',
    priority: 'normal',
    created_at: new Date().toISOString()
  };
  
  // Convert to our format
  const formattedOrder = {
    id: kdsOrder.id,
    table: kdsOrder.table_number,
    items: kdsOrder.items.map(item => 
      `${item.quantity}x ${item.name}${item.notes ? ' (' + item.notes + ')' : ''}`
    ).join(', '),
    priority: kdsOrder.priority as 'high' | 'normal' | 'low',
    status: kdsOrder.order_status as any,
    created_at: kdsOrder.created_at
  };
  
  console.log('KDS Order Format:', kdsOrder);
  console.log('Converted Format:', formattedOrder);
  
  try {
    await aiOrchestrator.announceKitchenOrder(formattedOrder);
    console.log('✅ KDS integration test successful');
  } catch (error) {
    console.error('❌ KDS integration test failed:', error);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting Google Cloud TTS Integration Tests...');
  console.log('================================================');
  
  await testDishPronunciation();
  await testTemplateTTS();
  await testAIOrchestrator();
  await testGoogleCloudTTS();
  await testKDSIntegration();
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Set up Google Cloud credentials: export GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json"');
  console.log('2. Update KDS app to use: import { aiOrchestrator } from "ai_orchestration/utils/aiOrchestrator"');
  console.log('3. Replace speakOrder() calls with: aiOrchestrator.announceKitchenOrder(order)');
}

// Export for use in other files
export {
  testDishPronunciation,
  testTemplateTTS,
  testAIOrchestrator,
  testGoogleCloudTTS,
  testKDSIntegration,
  runAllTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
