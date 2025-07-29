# AI Orchestration for KDS App

AI enhancements specifically for the Kitchen Display System (KDS) app to improve order announcements and kitchen workflow.

## Structure

```
ai_orchestration/
├── services/
│   ├── tts/                    # Enhanced TTS for kitchen
│   │   ├── humanizedTTS.ts     # Template-based natural announcements
│   │   ├── dishPronunciation.ts # Ghanaian dish pronunciation  
│   │   └── voiceProfiles.ts    # Kitchen-optimized voice settings
│   ├── stt/                    # Kitchen voice commands 
│   │   ├── speechToText.ts     # Voice commands for KDS
│   │   └── orderProcessing.ts  # Process kitchen voice commands
│   └── nlp/                    # Kitchen context understanding
│       └── contextualUnderstanding.ts # Kitchen workflow awareness
├── config/
│   ├── dishDictionary.json     # Ghanaian dish pronunciations
│   ├── announcementTemplates.json # Natural announcement templates
│   └── voiceSettings.ts        # KDS-specific configurations
└── utils/
    ├── audioProcessor.ts       # Kitchen audio optimization
    └── aiOrchestrator.ts       # Main service for KDS integration
```

## Purpose for KDS App

This enhances the existing KDS app (`kds_app/`) with:

### **Phase 1 (Immediate)**
- **Better dish pronunciation** - "BAHN-koo" instead of "banku"
- **Varied announcement templates** - Multiple ways to announce orders naturally
- **Kitchen-optimized voice settings** - Slower, clearer speech for busy kitchen

### **Phase 2 (this week)**  
- **Smart template selection** - Different templates based on order size, urgency
- **Contextual announcements** - "Rush order for table 5" vs "New order for table 3"

### **Phase 3 (next week)**
- **Voice kitchen commands** - "Mark table 5 ready", "Cancel order 123"
- **Hands-free operation** - Voice shortcuts while cooking

## Integration with KDS App

**Current Integration Point:**
- `kds_app/src/utils/formatOrder.ts` → Replace `speakOrder()` function

**Future Integration Points:**
- Kitchen screens → Add voice command buttons
- Order status updates → Voice confirmations
- Real-time order queue → Enhanced context

## Current State

All files contain detailed TODO comments for KDS-specific implementation. Ready for gradual enhancement of existing kitchen workflow.
