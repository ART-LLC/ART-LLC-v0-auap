# AUAPW LLC Mobile App

React Native mobile app for iOS and Android using Expo.

## Features

- Browse 50+ auto brands
- Shop 9 parts categories
- Search products in real-time
- Intercom Messenger for support (on all screens)
- Secure JWT authentication
- Mobile-optimized design (375px - 1920px)
- Offline-first architecture

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
mobile/
├── App.tsx                          # Main app entry point
├── app.json                         # Expo configuration
├── screens/                         # Screen components
│   ├── HomeScreen.tsx              # Home/dashboard
│   ├── BrandsScreen.tsx            # Browse brands
│   ├── PartsScreen.tsx             # Shop by parts
│   ├── SearchScreen.tsx            # Product search
│   ├── ProfileScreen.tsx           # User profile
│   ├── BrandDetailScreen.tsx       # Brand details
│   └── ProductDetailScreen.tsx     # Product details
└── assets/                          # Icons, splashes, images
```

## Integration with Backend

The mobile app integrates with the AUAPW LLC backend:

- **Base URL:** https://www.auapw.com
- **JWT Endpoint:** `/api/intercom-token` (POST)
- **Brand API:** `/api/brands` (GET)
- **Products:** `/brands/[brand]` (GET)
- **Images:** `/product-images/[type]/[id].png` (GET)

## Intercom Messenger

Intercom Messenger is integrated on all screens for 24/7 customer support:

```typescript
// JWT-secured authentication
const token = await fetchIntercomJWT(userId)
await Intercom.setUserHash(token)
await Intercom.displayMessenger()
```

- **App ID:** pldz9zi1
- **API Base:** https://api-iam.intercom.io
- **Authentication:** HS256 JWT tokens

## Building for Stores

### iOS (App Store)

```bash
npm run ios -- --release
# Or use EAS:
eas build --platform ios
```

### Android (Google Play)

```bash
npm run android -- --release
# Or use EAS:
eas build --platform android
```

## Design System

- **Primary Color:** #d4ddf5 (light silver)
- **Background:** #5a5f68 (medium gray)
- **Cards:** #3a3f48 (darker gray)
- **Text:** #f5f7fc (off-white)
- **Secondary:** #a5b0c0 (muted text)
- **Font:** Roboto (system font)

## Development

### Adding New Screens

1. Create component in `screens/[ScreenName].tsx`
2. Add to tab navigator in `App.tsx`
3. Export from screen file

### Debugging

Use React Native Debugger or Expo DevTools:

```bash
npm start
# Press 'j' to open React Native Debugger
```

## Troubleshooting

- **Intercom not showing:** Check JWT endpoint and INTERCOM_API_SECRET env var
- **Crashes on Android:** Update gradle version in `build.gradle`
- **iOS build fails:** Run `pod install` in ios directory

## Support

For issues or questions, contact support via Intercom Messenger (bottom-right, on all screens) or email support@auapw.com.

## License

AUAPW LLC Mobile App (c) 2024. All rights reserved.
