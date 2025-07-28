# Kitchen Display System (KDS) - React Native App

A modern, scalable TypeScript-based React Native kitchen display system built with Expo and Supabase for real-time order management.

## 🏗️ Project Structure

```
kds_app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── OrderCard.tsx    # Order display component
│   │   └── StatusButton.tsx # Status update button
│   ├── screens/             # Screen components
│   │   ├── ActiveOrdersScreen.tsx    # Incoming & processing orders
│   │   └── CompletedOrdersScreen.tsx # Completed orders
│   ├── services/            # External service integrations
│   │   └── supabase.ts     # Supabase client & API calls
│   ├── types/              # TypeScript interfaces
│   │   ├── order.ts        # Order-related types
│   │   └── navigation.ts   # Navigation types
│   ├── navigation/         # Navigation setup
│   │   └── AppNavigator.tsx # Stack navigator
│   ├── constants/          # App configuration
│   │   ├── config.ts       # Supabase & app config
│   │   └── theme.ts        # Design system
│   └── utils/              # Helper functions
│       └── formatOrder.ts  # Order formatting utilities
├── App.tsx                 # Root component
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── app.json              # Expo configuration
└── sample_data.sql       # Database setup & sample data
```

## 🚀 Features

- **Real-time Updates**: Live order synchronization via Supabase
- **Status Management**: Easy order status transitions (incoming → processing → complete)
- **Tablet Optimized**: Large text and touch-friendly interface for 7-10" tablets
- **Clean Architecture**: Modular, scalable codebase with TypeScript
- **Modern UI**: Minimalistic design with subtle shadows and neutral colors
- **Offline Resilience**: Optimistic updates with error handling

## 📋 Database Schema

The app connects to a `orders_demo` table with the following structure:

```sql
CREATE TABLE orders_demo (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,           -- e.g., "1 jollof rice, 1 chicken"
  table_no TEXT NOT NULL,       -- e.g., "Table 4" or "Takeaway"
  price DECIMAL(10,2) NOT NULL, -- e.g., 25.00
  note TEXT DEFAULT '',         -- e.g., "No onions"
  status TEXT NOT NULL,         -- "incoming", "processing", "complete"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd kds_app
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Update `src/constants/config.ts` with your credentials:

```typescript
export const SUPABASE_CONFIG = {
  URL: 'your-project-url',
  ANON_KEY: 'your-anon-key',
};
```

### 3. Setup Database

1. Go to your Supabase project's SQL Editor
2. Run the SQL commands from `sample_data.sql` to create the table and insert sample data

### 4. Start the App

```bash
# Start Expo development server
npm start

# For web development
npm run web

# For iOS simulator
npm run ios

# For Android emulator
npm run android
```

## 📱 Usage

### Active Orders Screen
- **Incoming Section**: Shows new orders that need to be started
- **Processing Section**: Shows orders currently being prepared
- **Actions**: Tap "Mark as Processing" or "Mark as Ready" to update status

### Completed Orders Screen
- Shows all orders marked as complete
- Navigate via the header menu or programmatically

### Real-time Updates
- Orders automatically appear and move between sections
- Status changes are reflected instantly across all devices
- Pull-to-refresh available on both screens

## 🎨 Design System

The app uses a consistent design system defined in `src/constants/theme.ts`:

- **Colors**: Neutral palette with status-specific colors
- **Typography**: Large, readable fonts optimized for tablets
- **Spacing**: Consistent spacing scale for layouts
- **Shadows**: Subtle elevation for modern feel

## 🔧 Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **TypeScript**: Type safety and better developer experience
- **React Navigation**: Screen navigation and routing
- **Supabase**: Backend-as-a-service with real-time capabilities
- **PostgreSQL**: Robust database with real-time subscriptions

## 📈 Scalability Features

- **Modular Architecture**: Easy to add new screens and features
- **Type Safety**: Comprehensive TypeScript interfaces
- **Reusable Components**: DRY principle with shared UI components
- **Service Layer**: Separated business logic from UI components
- **Configuration Management**: Centralized app settings
- **Error Handling**: Graceful error states and user feedback

## 🔄 Real-time Architecture

The app uses Supabase's real-time subscriptions to provide instant updates:

1. **Client Connection**: Establishes WebSocket connection to Supabase
2. **Table Subscription**: Listens to all changes on `orders_demo` table
3. **Event Processing**: Handles INSERT, UPDATE, and DELETE events
4. **UI Updates**: Automatically updates local state and re-renders UI
5. **Optimistic Updates**: Immediate UI feedback for better UX

## 🎯 Next Steps

1. **Install dependencies**: `npm install`
2. **Configure Supabase**: Update config with your credentials
3. **Setup database**: Run the SQL from `sample_data.sql`
4. **Test the app**: `npm start` and scan QR code with Expo Go
5. **Add your data**: Insert real orders into the database
6. **Customize**: Modify theme, add features, or integrate with POS system

## 📞 Support

For technical support or questions about the Kitchen Display System:

1. Check the console logs for error messages
2. Verify Supabase configuration and database setup
3. Ensure real-time subscriptions are enabled in Supabase
4. Test with sample data before adding real orders

---

**Built with ❤️ for restaurant efficiency and modern kitchen operations.**
