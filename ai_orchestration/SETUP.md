# Setup Instructions

## 1. Get Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable "Cloud Text-to-Speech API"
3. Create service account with "Text-to-Speech User" role
4. Download JSON key file
5. Save as `credentials.json` in this folder

## 2. Configure Environment

Edit `.env` file:
```env
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
```

## 3. Test

```bash
npm test
```

## 4. Use in KDS App

Replace your `speakOrder` function:

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

That's it! System will use Google Cloud TTS if available, otherwise falls back to Expo Speech.
