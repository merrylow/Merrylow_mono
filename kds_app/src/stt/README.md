# Speech-to-Text (STT) Demo for Vendor App

This module provides a temporary speech-to-text (STT) integration for the Merrylow vendor app. It allows vendors to speak commands, which are then interpreted by either Gemini AI or a local fallback logic engine and mapped to defined system tasks such as fetching orders, updating statuses, or modifying menus.

This setup is designed to be modular and production-ready with the option to upgrade STT and AI interpretation services.

---

## Contents

- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [How It Works](#how-it-works)
- [Supported Tasks](#supported-tasks)
- [Installation and Setup](#installation-and-setup)
- [Using the STT System](#using-the-stt-system)
- [Vendor Requirements](#vendor-requirements)
- [Notes and Limitations](#notes-and-limitations)

---

## Overview

The STT system captures voice commands from a vendor, sends the speech text to an AI analyzer (preferably Gemini 2.5 Pro), and interprets which task the vendor intends to perform. Each task is executed with access to Supabase resources, and an appropriate message is generated for the vendor interface to speak back to the user.

The system is built using TypeScript and is intended to be run within a React Native or web-based vendor application.

---

## Folder Structure

The entire STT logic is located within the `src/stt/` directory. Below is an explanation of each file:

```

src/stt/
│
├── AiTaskAnalyzer.ts     # Uses Gemini AI to analyze speech and return a task string
├── getTask.ts            # Entry point function that receives vendor speech and returns task results
├── localAI.ts            # Fallback logic to interpret speech if AI is unavailable
├── performTask.ts        # Switches over task number and calls the appropriate vendor task
└── vendorTasks.ts        # Implementation of actual vendor task logic (Supabase queries, etc.)

```

---

## How It Works

1. **Speech Input**: Vendor speaks a command using the UI microphone button.
2. **Speech Text Processing**: The speech is passed into `getTask.ts` as a raw string.
3. **Task Analysis**: 
   - If internet or Gemini access is available, `AiTaskAnalyzer.ts` sends the prompt to Gemini.
   - Otherwise, `localAI.ts` provides a fallback logic engine that parses and matches tasks locally.
4. **Task Execution**:
   - The raw command (e.g., `"4, completed, 4323"`) is parsed inside `performTask.ts`.
   - The switch case identifies the appropriate task and forwards control to `vendorTasks.ts`.
5. **Final Output**:
   - The function returns: `{ data, message }`
     - `data`: result from Supabase (or internal operation)
     - `message`: text to be read back to the vendor via TTS (Text-to-Speech)

---

## Supported Tasks

| Task No | Command Description                                               |
|---------|-------------------------------------------------------------------|
| `1`     | Fetch latest N orders                                             |
| `2`     | Fetch/repeat order by table number                                |
| `3`     | Fetch/repeat order by order ID                                    |
| `4`     | Update the status of a given order ID                             |
| `5`     | Fetch orders based on their current status                        |
| `6`     | Fetch order summary for a given number of days                    |
| `7`     | Toggle vendor's accepting orders status (on/off)                 |
| `8`     | Update menu item (e.g., availability, price, or name)             |
| `99`    | Fallback for unrecognized/invalid requests                        |

The returned task string from AI or local logic always follows this format:

```

\<task\_number>, <arg1>, <arg2>, ...

````

---

## Installation and Setup

1. **Clone the repo or ensure you're in the vendor app workspace.**

2. **Ensure all dependencies are installed** (if Gemini or Supabase are used directly).

3. **Setup Supabase Client**  
   Inside a shared config file (e.g., `supabase.ts`):

```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
````

4. **Configure Gemini (optional, for AiTaskAnalyzer)**
   In `AiTaskAnalyzer.ts`, add your Gemini API key:

```ts
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

---

## Using the STT System

Here is a sample usage inside a vendor component:

```ts
import { getTask } from '@/stt/getTask';

const vendorSpeech = "mark order 4323 as completed";

const { data, message } = await getTask(vendorSpeech);

// Use `data` to update UI, use `message` for speech output
```

All logic is abstracted behind `getTask`, which handles:

* Calling Gemini or local AI
* Executing the task
* Returning relevant data and vendor-facing message

---

## Vendor Requirements

To use this system, ensure:

* The vendor is authenticated or associated with a unique context (if needed).
* Supabase tables are configured and available:

  * `orders`
  * `menus`
  * `vendor_settings` (optional but recommended)
* Permissions are set to allow read/write based on your security rules.
* An internet connection is available for Gemini-powered tasks (fallback logic is used otherwise).
* The vendor's device supports microphone access (for speech input) and TTS (for speech output).

---

## Notes and Limitations

* Currently built for demo purposes; no fine-grained error handling or retry logic is included.
* Speech recognition and synthesis must be implemented separately (e.g., using `react-native-voice`, `expo-speech`, or Web APIs).
* Gemini may return inconsistent task outputs if the prompt is poorly structured. Local fallback logic is recommended for critical commands.
* This module assumes a clean and normalized database schema.

---

## Next Steps

* Integrate real-time feedback into the vendor app using microphone events
* Allow vendor to confirm actions before execution
* Store vendor history or preferences in the `vendor_settings` table
* Extend support for multilingual voice commands
* Add customer message relay features

---

## Contact

For internal use and development by the Merrylow team. For any questions or assistance, reach out to the core developers or project lead.