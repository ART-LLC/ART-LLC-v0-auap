# Mobile & PWA Implementation Guide

Complete guide to AUAPW LLC mobile experience across iOS, Android, and web platforms.

## Overview

AUAPW LLC is available across three platforms with unified Intercom support:

1. **React Native Mobile App** (iOS & Android) - Expo-based native app
2. **Progressive Web App (PWA)** - Web app installable on all devices
3. **Responsive Web** (375px - 1920px) - Optimized for all screen sizes

All platforms share the same backend APIs and Intercom JWT authentication.

---

## 1. React Native Mobile App

### Installation

```bash
cd mobile
npm install
```

### Development

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run web version
npm run web
```

### Project Structure

```
mobile/
├── App.tsx                  # Main entry point with navigation
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── screens/
│   ├── HomeScreen.tsx       # Dashboard with featured items
│   ├── BrandsScreen.tsx     # Browse 50+ brands with search
│   ├── PartsScreen.tsx      # Shop by 9 categories
│   ├── SearchScreen.tsx     # Real-time product search
│   ├── ProfileScreen.tsx    # User profile & settings
│   ├── BrandDetailScreen.tsx
│   └── ProductDetailScreen.tsx
├── assets/                  # Icons and images
└── README.md
```

### Key Features

- **5 Core Screens**: Home, Brands, Parts, Search, Profile
- **Bottom Tab Navigation**: Quick access to all sections
- **Search Integration**: Real-time product search
- **Intercom Messenger**: JWT-secured support on all screens
- **Design System**: Matches web (5 colors, Roboto font, responsive)
- **API Integration**: Uses same backend endpoints as web

### Intercom in Mobile App

```typescript
// In App.tsx
import { Intercom } from '@intercom/react-native'

// Initialize with JWT token
const token = await fetchIntercomJWT(userId)
await Intercom.setUserHash(token)
await Intercom.displayMessenger()
```

**JWT Endpoint:** `https://www.auapw.com/api/intercom-token`
**App ID:** `pldz9zi1`
**API Base:** `https://api-iam.intercom.io`

### Building for Stores

#### iOS (App Store)

```bash
# Using Expo Application Services (EAS)
eas build --platform ios

# Then submit to App Store
eas submit --platform ios
```

**Requirements:**
- Apple Developer Account ($99/year)
- Bundle ID: `com.auapw.mobile`
- Provisioning profile

#### Android (Google Play)

```bash
# Build APK for testing
npm run android -- --release

# Build for Google Play
eas build --platform android

# Submit
eas submit --platform android
```

**Requirements:**
- Google Play Developer Account ($25 one-time)
- Package name: `com.auapw.mobile`
- Signed keystore

### App Distribution

**Current Status:** Development/Beta
**Stores:** Ready for submission

---

## 2. Progressive Web App (PWA)

### What is a PWA?

A PWA allows the web app to be installed on any device (iOS, Android, desktop) and work offline.

### Installation

**On iOS:**
1. Open https://www.auapw.com in Safari
2. Tap Share → Add to Home Screen
3. Name it "AUAPW"
4. Tap Add

**On Android:**
1. Open https://www.auapw.com in Chrome
2. Tap menu (⋮) → Install App
3. Tap Install

**On Desktop:**
1. Open https://www.auapw.com in Chrome/Edge
2. Click install icon in address bar
3. Click Install

### Files

- **public/manifest.json** - App metadata, icons, shortcuts
- **public/sw.js** - Service Worker for offline/caching
- **components/pwa-register.tsx** - Service Worker registration

### Caching Strategy

```
HTML Pages:
  ├─ Network-first (try network, fallback to cache)
  └─ Fallback: Offline page

APIs (/api/*):
  ├─ Network-first (try network, fallback to cache)
  └─ Cache Intercom and product data

Static Assets:
  ├─ Cache-first (use cache, fallback to network)
  └─ Images, CSS, JS cached for fast loading
```

### Features

- **Offline Support**: Browse cached products and parts
- **Fast Loading**: Cached assets load instantly
- **Background Sync**: Sync Intercom messages when online
- **Push Notifications** (Ready): Support for 24/7 alerts
- **App Shortcuts**: Quick access to Brands and Search from home screen
- **Home Screen Icon**: Customize with maskable icon for adaptive displays

### Service Worker

The service worker is registered automatically and:

1. Precaches essential assets on first load
2. Updates cached content from network
3. Falls back to cache on network errors
4. Checks for updates every 60 seconds
5. Cleans up old caches on activation

**Update Handling:**
When a new version is available, users see a prompt to refresh.

### Manifest Customization

Edit `public/manifest.json` to change:

- App name
- Theme colors
- Shortcuts
- Icons
- Categories
- Display mode

---

## 3. Responsive Web Design

### Breakpoints

```
Mobile:   375px - 640px
Tablet:   640px - 1024px
Desktop:  1024px - 1600px
Large:    1600px+
```

### Design System

**Colors:**
- Primary: #d4ddf5 (light silver)
- Background: #5a5f68 (medium gray)
- Cards: #3a3f48 (darker gray)
- Text: #f5f7fc (off-white)
- Secondary: #a5b0c0 (muted)

**Typography:**
- Font: Roboto
- Weights: 300, 400, 500, 700, 900
- Line Height: 1.4-1.6

**Layout:**
- Flexbox for most layouts
- Mobile-first approach
- Touch-friendly buttons (44px min)
- Proper spacing on all screens

### Mobile Optimization Checklist

- ✓ Viewport meta tag
- ✓ Touch targets (44px minimum)
- ✓ Readable fonts (14px minimum)
- ✓ Responsive images
- ✓ Fast load time (< 3s on 4G)
- ✓ Tap-friendly interactive elements
- ✓ Proper color contrast
- ✓ Test on real devices

---

## 4. Intercom Across All Platforms

### Web

```typescript
// Automatically initialized in root layout
// JWT-secured for authenticated users
// Bottom-right messenger bubble on all 57 pages
```

### Mobile App (React Native)

```typescript
// Initialized in App.tsx
// JWT-secured for authenticated users
// Available on all 5 screens
```

### PWA

```typescript
// Same as responsive web
// Service Worker syncs messages offline
// Push notifications when available
```

### All Platforms Features

- 24/7 customer support
- JWT-secured (no password exposed)
- Persistent conversation history
- Offline message queuing (mobile & PWA)
- Real-time updates when online

---

## 5. Backend API Integration

All platforms use the same backend:

### Endpoints

```
# Intercom JWT
POST /api/intercom-token
Body: { userId, email, name }
Returns: { token }

# Brands
GET /api/brands
Returns: List of 50+ brands

# Products
GET /brands/[brand]
Returns: Products for brand

# Product Images
GET /product-images/[type]/[id].png
Types: engine, transmission, brakes, etc.
```

### Environment Variables

```
INTERCOM_API_SECRET    # For JWT signing (backend only)
NEXT_PUBLIC_APP_ID     # Intercom app ID
API_BASE_URL           # Backend API (usually www.auapw.com)
```

---

## 6. Testing

### Web Testing

```bash
# Test responsive design
# Browser DevTools → Toggle Device Toolbar (Ctrl+Shift+M)

# Test PWA
# Chrome DevTools → Application → Service Workers

# Test offline
# DevTools → Network → Offline

# Test performance
# Lighthouse: DevTools → Lighthouse
```

### Mobile Testing

```bash
# iOS
npm run ios
# Simulator or real device via Xcode

# Android
npm run android
# Emulator or real device via Android Studio
```

### Cross-Device Testing

- Physical iPhone/iPad
- Physical Android phone/tablet
- Desktop browsers (Chrome, Firefox, Safari)
- Tablet modes in DevTools

---

## 7. Deployment

### Web (Next.js)

```bash
npm run build
npm start

# Or deploy to Vercel
vercel deploy
```

### Mobile App

See App Store and Google Play submission guides above.

### PWA

No additional deployment needed - works automatically when web app is live.

---

## 8. Monitoring & Analytics

### Web Analytics
- Vercel Analytics (built-in)
- Google Analytics integration available
- Performance monitoring

### Mobile Analytics
- Expo Analytics
- Intercom user tracking
- Custom event tracking available

### PWA Metrics
- Service Worker activation
- Cache hit rates
- Offline usage

---

## 9. Troubleshooting

### PWA Won't Install

- Check manifest.json is valid
- Ensure HTTPS (or localhost for dev)
- Clear browser cache
- Check Service Worker is registered

### Intercom Not Showing

- Verify app_id: pldz9zi1
- Check INTERCOM_API_SECRET is set
- Ensure JWT endpoint is reachable
- Check browser console for errors

### Offline Issues

- Service Worker may not have cached yet
- Try accessing page again
- Check DevTools → Application → Cache
- Manually clear cache and refresh

### Mobile Build Failures

- Update Expo CLI: `npm install -g expo-cli@latest`
- Clear cache: `expo cache:clear`
- Rebuild: `eas build --platform [ios|android] --clean`

---

## 10. Future Enhancements

- Push notifications
- Wishlist/favorites
- Order tracking
- Real-time inventory
- Voice search
- AR part visualization
- Biometric login

---

**Support:** Contact via Intercom (all platforms) or support@auapw.com
