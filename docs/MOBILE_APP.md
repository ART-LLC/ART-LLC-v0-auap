# AUAPW Mobile App - iOS & Android

Complete documentation for the AUAPW React Native mobile application.

## Overview

AUAPW Mobile is a native iOS and Android app built with React Native and Expo, providing a seamless experience for browsing used auto parts across 50+ brands and 9 parts categories.

- **Framework**: React Native with Expo
- **Platforms**: iOS 12.0+, Android 7.0+
- **Language**: TypeScript
- **Package Manager**: npm / yarn / pnpm
- **Build Tool**: Expo Application Services (EAS)

## Quick Start

### Installation

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install
# or
pnpm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Prerequisites

- Node.js 18+ installed
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS) or Android Studio (all platforms)
- Physical device with Expo Go app (for testing on device)

## Architecture

### Project Structure

```
mobile/
├── App.tsx                 # Main app entry with navigation
├── screens/               # Screen components
│   ├── HomeScreen.tsx     # Home/Featured brands
│   ├── BrandsScreen.tsx   # All brands list
│   ├── PartsScreen.tsx    # Parts categories
│   ├── SearchScreen.tsx   # Product search
│   ├── ProfileScreen.tsx  # User profile
│   └── [DetailScreens].tsx
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
│   └── useIntercomJWT.ts # Intercom authentication
├── api/                   # API integration
│   └── client.ts         # Axios instance with interceptors
├── lib/                   # Utilities and helpers
├── utils/                 # Common utilities
├── app.json              # Expo config
├── eas.json              # EAS build config
└── package.json
```

### Navigation Structure

Bottom tab navigation with 5 main screens:

```
App (NavigationContainer)
├── Home Stack
│   ├── HomeScreen
│   ├── ProductDetail (modal)
│   └── BrandDetail (modal)
├── Brands Stack
│   ├── BrandsScreen
│   └── BrandDetail (modal)
├── Parts Screen
│   └── Category list & filters
├── Search Screen
│   └── Global product search
└── Profile Screen
    └── User account & preferences
```

## Intercom Integration

### Authentication with JWT

Intercom uses secure JWT tokens for authenticated users, with automatic fallback for anonymous visitors.

```typescript
import { useIntercomJWT } from '@/hooks/useIntercomJWT'

function MyScreen() {
  const user = { userId: 'user-123', email: 'user@example.com' }
  const { isInitialized, error } = useIntercomJWT(user)
  
  return isInitialized ? <Content /> : <LoadingSpinner />
}
```

### Features

- Secure JWT token generation server-side
- User identification and conversation history
- Anonymous visitor support
- Offline token caching for reliability
- Background sync when connection restores

### JWT Token Flow

1. User opens app or logs in
2. App calls `/api/intercom-token` endpoint with user data
3. Backend generates HS256-signed JWT token
4. App receives token and passes to `Intercom.setUserHash()`
5. Intercom messenger displays with user identification
6. Token cached locally for offline support

### API Endpoint

```
POST https://www.auapw.com/api/intercom-token

Request:
{
  "userId": "user-123",
  "email": "user@example.com",
  "name": "John Smith"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## API Integration

### Backend Connection

All API calls go through the shared backend at `https://www.auapw.com`:

```typescript
// Products
GET /api/brands              # List all brands
GET /brands/{slug}           # Brand details & products
GET /parts/{category}        # Parts by category

// Images
GET /api/product-image/{brand}/{sku}  # Product images

// Intercom
POST /api/intercom-token     # JWT token generation
```

### Offline Support

Axios interceptors cache successful API responses:

```typescript
// Automatic caching
const response = await api.get('/brands')  // Cached on success
// On offline, returns cached data
```

AsyncStorage persists:
- JWT tokens (1 hour expiration)
- Recent searches
- Favorite brands
- Cart contents
- User preferences

## Build & Deployment

### iOS Deployment

```bash
# Build for iOS TestFlight
npm run build:ios

# Submit to App Store
eas submit --platform ios
```

**Requirements:**
- Apple Developer account
- Provisioning profiles configured in EAS
- App Store Connect access

### Android Deployment

```bash
# Build for Google Play
npm run build:android

# Submit to Google Play
eas submit --platform android
```

**Requirements:**
- Google Play Developer account
- Keystore configured in EAS
- Google Play Console access

## Screen Components

### HomeScreen
- Featured brands grid
- Quick action buttons (Search, Browse, Support)
- Stats (verified yards, brands, shipping)
- Promotional content

### BrandsScreen
- All 50+ brands with search/filter
- Brand product count
- Navigation to brand details
- Sorting options

### PartsScreen
- 9 parts categories
- Sub-categories and variants
- Browse or search within category
- Used parts (9 variants)

### SearchScreen
- Global product search
- Filters by brand, category, price
- Recent searches
- Popular products

### ProfileScreen
- User account management
- Order history
- Saved favorites
- Support & settings
- Intercom messenger link

## Performance Optimization

### Caching Strategy

- **API responses**: 5 minutes (refreshable)
- **JWT tokens**: 1 hour expiration
- **Images**: Progressive loading with blur placeholder
- **Navigation**: Route-based code splitting

### Bundle Size

- Main app: ~2.5 MB
- With dependencies: ~15 MB (EAS optimized)
- Lazy-loaded screens: ~500 KB each

## Troubleshooting

### Intercom Not Appearing

1. Check JWT token in AsyncStorage
2. Verify API endpoint is reachable
3. Check network conditions
4. Review console logs for errors

```bash
# Debug JWT token
console.log(await AsyncStorage.getItem('intercom-jwt-{userId}'))
```

### Slow API Responses

1. Check backend availability
2. Review cached data in AsyncStorage
3. Enable offline mode for testing
4. Check network conditions

### Build Errors

```bash
# Clear cache and rebuild
npm run build:clean
npm run build:ios  # or android
```

## Development Tips

### Hot Reload

```bash
# Fast refresh with code changes
npm start
# Changes appear in <1 second

# Full app reload if needed
r  # In Expo CLI
```

### Debugging

```typescript
// Remote debugger
console.log('[v0] Debug message:', data)

// React Native Debugger
# Download from: https://github.com/jhen0409/react-native-debugger
```

### Environment Variables

```bash
# .env file (not committed)
REACT_APP_API_BASE=https://www.auapw.com
REACT_APP_INTERCOM_APP_ID=pldz9zi1
```

## Testing

### Manual Testing Checklist

- [ ] Intercom loads and displays messenger
- [ ] JWT authentication works for identified users
- [ ] Anonymous access works without JWT
- [ ] Search functions correctly
- [ ] Brand browsing and filtering works
- [ ] Images load progressively
- [ ] Offline mode uses cached data
- [ ] Navigation between tabs smooth
- [ ] Forms submit correctly
- [ ] Error handling displays gracefully

### Device Testing

- iOS: iPhone 12+, iPad
- Android: Pixel 6+, Samsung S22+
- Network: 4G LTE, WiFi, offline mode

## Support

For issues or questions:

1. Check app logs via Expo CLI
2. Review backend API status
3. Contact via Intercom messenger in-app
4. Submit issue on GitHub

## Version History

- **v1.0.0** (Current)
  - React Native 0.73
  - Expo 50
  - Intercom JWT integration
  - All 5 main screens
  - Offline support
  - iOS & Android parity
