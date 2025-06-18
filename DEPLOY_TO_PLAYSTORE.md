# Deploy Young Eagles App to Google Play Store

## Overview
This guide will help you convert your PWA (Progressive Web App) into a native Android app and deploy it to the Google Play Store.

## Prerequisites
- Google Play Console account ($25 one-time fee)
- Android Studio installed
- Node.js and npm/yarn installed
- A code signing certificate

## Method 1: Using Capacitor (Recommended)

### Step 1: Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init "Young Eagles" "com.youngeagles.homework" --web-dir=dist
```

### Step 2: Add Android Platform
```bash
npx cap add android
```

### Step 3: Build Your Web App
```bash
npm run build
```

### Step 4: Sync with Capacitor
```bash
npx cap sync android
```

### Step 5: Open in Android Studio
```bash
npx cap open android
```

### Step 6: Configure App Icons and Splash Screen
Place your app icons in `android/app/src/main/res/` folders:
- `mipmap-hdpi/` (72x72)
- `mipmap-mdpi/` (48x48)
- `mipmap-xhdpi/` (96x96)
- `mipmap-xxhdpi/` (144x144)
- `mipmap-xxxhdpi/` (192x192)

### Step 7: Update App Permissions
Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Method 2: Using PWA Builder

### Step 1: Visit PWA Builder
Go to https://www.pwabuilder.com/

### Step 2: Enter Your URL
Enter your deployed PWA URL: `https://your-app-domain.com`

### Step 3: Generate Android Package
- Select "Android" platform
- Choose "Trusted Web Activity" (TWA)
- Configure your app details
- Download the generated Android project

## Method 3: Using Cordova

### Step 1: Install Cordova
```bash
npm install -g cordova
cordova create youngeagles com.youngeagles.homework "Young Eagles"
cd youngeagles
```

### Step 2: Add Android Platform
```bash
cordova platform add android
```

### Step 3: Copy Your Web Files
Copy your built web app files to the `www/` directory.

### Step 4: Build for Android
```bash
cordova build android
```

## Preparing for Play Store

### 1. Create a Signed APK/AAB

#### Generate Keystore
```bash
keytool -genkey -v -keystore youngeagles-release-key.keystore -alias youngeagles -keyalg RSA -keysize 2048 -validity 10000
```

#### Sign Your App (Android Studio)
1. In Android Studio: Build → Generate Signed Bundle/APK
2. Select "Android App Bundle" (AAB format - required by Play Store)
3. Use your keystore file
4. Choose "release" build variant

### 2. App Store Listing Requirements

#### App Information
- **App Title**: "Young Eagles - Homework Helper"
- **Short Description**: "Interactive homework app for students with activities, file uploads, and progress tracking"
- **Full Description**: Include features, benefits, and target audience
- **Category**: Education
- **Content Rating**: Everyone or Everyone 10+

#### Visual Assets Required
- **High-res icon**: 512x512 PNG
- **Feature graphic**: 1024x500 PNG
- **Screenshots**: At least 2, up to 8 (phone screenshots)
- **Phone screenshots**: 16:9 or 9:16 aspect ratio
- **Tablet screenshots**: Optional but recommended

#### Privacy Policy
Create a privacy policy that covers:
- Data collection (homework submissions, user info)
- Firebase usage
- File storage
- Analytics (if any)

### 3. Technical Requirements

#### App Manifest Updates
Update your `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.youngeagles.homework',
  appName: 'Young Eagles',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true,
    backgroundColor: '#3B82F6',
    webContentsDebuggingEnabled: false
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3B82F6",
      showSpinner: false
    }
  }
};

export default config;
```

## Deployment Steps

### 1. Create Google Play Console Account
- Visit https://play.google.com/console
- Pay $25 registration fee
- Complete developer verification

### 2. Create New App
1. Click "Create app"
2. Fill in app details:
   - App name: "Young Eagles - Homework Helper"
   - Default language: English
   - App or game: App
   - Free or paid: Free
3. Accept Play Console Developer Policy

### 3. Complete App Setup

#### App Access
- Choose if app has restricted access or is available to all users

#### Ads
- Declare if your app contains ads

#### Content Rating
1. Complete content rating questionnaire
2. For education app, select appropriate age group

#### Target Audience
- Select age groups your app is designed for
- For homework app: likely "Ages 6-17"

#### Data Safety
1. Complete data safety form
2. Declare what data you collect:
   - Personal info (name, email)
   - Files and docs (homework submissions)
   - App activity (homework progress)

### 4. Upload Your App

#### Internal Testing (Recommended First)
1. Go to Testing → Internal testing
2. Create new release
3. Upload your AAB file
4. Add release notes
5. Add test users (up to 100)
6. Review and rollout

#### Production Release
1. Go to Production
2. Create new release
3. Upload your AAB file
4. Add release notes
5. Review rollout percentage (start with 20%)
6. Submit for review

### 5. Store Listing

#### Main Store Listing
- Upload screenshots (at least 2)
- Upload feature graphic
- Write app description
- Add high-res icon
- Select app category: Education
- Add contact details
- Set content rating

#### Pricing & Distribution
- Select countries/regions
- Confirm app is free
- Opt in to Google Play for Education (recommended)

## Post-Launch

### App Updates
1. Build new version with incremented version code
2. Upload new AAB to Play Console
3. Add release notes describing changes
4. Choose rollout percentage
5. Submit for review

### Marketing
- Share app link: `https://play.google.com/store/apps/details?id=com.youngeagles.homework`
- Create promotional materials
- Encourage user reviews
- Monitor app performance in Play Console

## Troubleshooting

### Common Issues
1. **Target SDK Version**: Ensure you're targeting latest Android API level
2. **64-bit Requirement**: Play Store requires 64-bit support
3. **App Signing**: Let Google Play handle app signing (recommended)
4. **Privacy Policy**: Required for apps that collect user data

### Performance Optimization
- Enable ProGuard/R8 for code shrinking
- Optimize images and assets
- Use WebP format for images
- Minimize APK/AAB size

## Resources
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [PWA Builder](https://www.pwabuilder.com/)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)

## Cost Breakdown
- Google Play Console Registration: $25 (one-time)
- Domain for privacy policy: ~$10/year (optional)
- App Store optimization tools: Free - $50/month (optional)

**Estimated Time**: 2-5 days for first-time deployment
**Review Time**: 1-3 days typically

