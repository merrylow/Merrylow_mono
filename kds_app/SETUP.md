# Quick Setup Guide - Kitchen Display System

## 🚀 5-Minute Setup

Follow these commands to get your Kitchen Display System running:

### 1. Navigate to Project
```bash
cd "C:\Users\User\OneDrive\Desktop\folder of folders\Merrylow\kds_app"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the App
```bash
npm start
```

## ✅ What Should Work

After running these commands, you should see:

1. **Terminal Output**:
   ```
   Starting Metro Bundler...
   Metro waiting on exp://...
   ```

2. **Browser Opens**: Expo DevTools with QR code

3. **Mobile Testing**: 
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `w` for web browser testing

4. **App Interface**:
   - "Kitchen Display System" header
   - Two sections: "Incoming Orders" and "Processing Orders"
   - Sample orders from your Supabase database
   - Status update buttons on each order

## 🗄️ Database Setup (Already Done)

Your Supabase is already configured with:
- ✅ URL: `https://izjzinivxxyhxzsmgfwc.supabase.co`
- ✅ Anon Key: Configured in `src/constants/config.ts`
- ✅ Sample data: Available in `sample_data.sql`

## 🔧 If Something Goes Wrong

### Metro Bundler Issues:
```bash
# Clear cache and restart
npm start -- --clear
```

### Dependency Issues:
```bash
# Remove and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Supabase Connection Issues:
1. Check `src/constants/config.ts` has correct URL and key
2. Run sample SQL in your Supabase SQL Editor
3. Verify table `orders_demo` exists

## 📱 Testing the App

1. **Active Orders Screen**:
   - Should show incoming and processing orders
   - Tap status buttons to move orders between sections
   - Pull down to refresh

2. **Real-time Updates**:
   - Add/edit orders in Supabase dashboard
   - Changes should appear instantly in the app

3. **Navigation**:
   - Use navigation header to switch between screens
   - ActiveOrders ↔ CompletedOrders

## 🎯 Expected Behavior

**Order Display Format**:
```
"1 jollof rice, 1 chicken 25.00 order for Table 4 with note No onions"
```

**Status Flow**:
```
INCOMING → [Mark as Processing] → PROCESSING → [Mark as Ready] → COMPLETE
```

**Real-time**:
- Orders move between sections instantly
- New orders appear automatically
- Status changes sync across all devices

---

**🎉 Your Kitchen Display System is ready!**

For detailed documentation, see `README.md`
