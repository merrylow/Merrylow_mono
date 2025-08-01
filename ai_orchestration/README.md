# ✅ Google Cloud TTS for KDS App

Enhanced TTS with proper Ghanaian dish pronunciation for your kitchen display system.

## 🚀 Quick Setup

1. **Install dependencies** (already done):
   ```bash
   npm install @google-cloud/text-to-speech
   ```

2. **Get Google Cloud credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts)
   - Create service account with "Text-to-Speech User" role
   - Download JSON key as `credentials.json`

3. **Configure environment**:
   Edit `.env` file with your project ID and credential path.

4. **Use in your KDS app**:
   ```typescript
   import { aiOrchestrator } from '../../../ai_orchestration/utils/aiOrchestrator';

   export async function speakOrder(order: Order): Promise<void> {
     await aiOrchestrator.announceKitchenOrder({
       id: order.id,
       table: order.table_number,
       items: formatOrderForTTS(order),
       priority: order.priority || 'normal'
     });
   }
   ```

## ✅ What You Get

- **Proper pronunciation**: "BAHN-koo" instead of "banku"
- **Natural announcements**: Varied templates reduce fatigue
- **Kitchen-optimized**: Slower, clearer speech for busy environments
- **Reliable**: Falls back to Expo Speech if Google Cloud fails

## 🔧 Files

- `services/tts/` - TTS services
- `config/` - Pronunciation dictionary and templates  
- `utils/aiOrchestrator.ts` - Main integration point
- `.env` - Your credentials (edit this!)

Works immediately without Google Cloud setup (uses Expo Speech fallback), gets better when you add credentials.
