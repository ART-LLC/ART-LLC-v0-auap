# Intercom Messenger Integration Guide

## Overview

Intercom Messenger is implemented across the entire AUAPW website for seamless customer support. The messenger appears in the bottom-right corner on every page, enabling real-time customer communication.

## Features

- **Universal Availability**: Present on all pages (homepage, brand pages, product pages, category pages)
- **Secure JWT Authentication**: Uses JSON Web Tokens for authenticated users
- **Anonymous Support**: Works for non-authenticated visitors
- **Real-time Messaging**: Live customer support conversations
- **Device Responsive**: Works on desktop, tablet, and mobile

## How It Works

### Implementation Architecture

```
IntercomProvider (Client Component)
├── Imports @intercom/messenger-js-sdk
├── On Mount: Initializes Intercom with app_id "pldz9zi1"
├── For Authenticated Users: 
│   ├── Fetches JWT token from /api/intercom-token
│   ├── Includes user_id, email, name in JWT
│   └── Boots Intercom with secure token
└── For Anonymous Users: Boots Intercom without token
```

### File Structure

- **Component**: `components/intercom-provider.tsx`
- **API Endpoint**: `app/api/intercom-token/route.ts`
- **Imported In**: `app/layout.tsx` (Root layout - appears on all pages)
- **Environment**: `INTERCOM_API_SECRET` in `.env.development.local`

## API Reference

### JWT Token Endpoint

**URL**: `POST /api/intercom-token`

**Request Body**:
```json
{
  "userId": "user-123",
  "email": "user@example.com",
  "name": "John Smith"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**JWT Payload Structure**:
```javascript
{
  user_id: "user-123",      // Required
  email: "user@example.com", // Optional
  name: "John Smith"         // Optional
}
```

- **Algorithm**: HS256
- **Expiration**: 1 hour
- **Signed With**: INTERCOM_API_SECRET

### Intercom Boot Configuration

```javascript
{
  app_id: "pldz9zi1",
  api_base: "https://api-iam.intercom.io",
  intercom_user_jwt: "<JWT_TOKEN>"  // Only for authenticated users
}
```

## Page Coverage

The Intercom messenger is available on:

| Page Type | URL Pattern | Status |
|-----------|------------|--------|
| Homepage | `/` | ✓ Active |
| Brand Pages | `/brands/[brand]` | ✓ Active |
| Brand Products | `/brands/[brand]/[sku]` | ✓ Active |
| Engine Parts | `/parts/engines` | ✓ Active |
| Transmission Parts | `/parts/transmissions` | ✓ Active |
| All Dynamic Pages | `*` | ✓ Active (via root layout) |

## Environment Variables

**Required**:
- `INTERCOM_API_SECRET`: Secret key for JWT signing (from Intercom workspace)

**Location**: `.env.development.local`

```
INTERCOM_API_SECRET=es2OvSafq_aUEZD3j4r1xuBCVTrtuhe5iR3NddTuZfs
```

## Testing

### Test Anonymous Access
```bash
# Visit any page
curl http://localhost:3000/
# Intercom messenger should load
```

### Test Authenticated Access
```bash
# With user session
# Fetch JWT token
curl -X POST http://localhost:3000/api/intercom-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-demo",
    "email": "demo@example.com",
    "name": "Demo User"
  }'
# Response includes JWT token
```

## User Support Queue

### Incoming Message Routing

1. **Customer Sends Message** via Intercom messenger
2. **Intercom Cloud** receives and queues the message
3. **Notification** sent to AUAPW support team
4. **Agent Response** appears in messenger
5. **Notification** displayed to user

### Support Team Access

Support team members access conversations via:
- Intercom web inbox: `app.intercom.com`
- Mobile app notifications
- Email alerts

## Troubleshooting

### Messenger Not Loading

1. **Check App ID**: Verify `pldz9zi1` in provider
2. **Network**: Check browser network tab for Intercom script
3. **Console Errors**: Look for JS errors in DevTools console
4. **CSP Headers**: Ensure Intercom domains are whitelisted

### JWT Token Issues

1. **Check Secret**: Verify `INTERCOM_API_SECRET` is set
2. **Token Format**: Should be base64-encoded JWT string
3. **Expiration**: Tokens expire after 1 hour (normal)
4. **Test Endpoint**: POST to `/api/intercom-token` to verify

## Security

- JWT tokens signed with HS256 algorithm
- Sensitive data NOT sent in plain text
- Tokens expire after 1 hour
- API secret stored in environment variables (not committed)
- User identification secure and verified server-side

## Support

For issues:
1. Check `/docs/API.md` for endpoint details
2. Review console logs: `[Intercom] ...` messages
3. Check Intercom workspace settings for app configuration
4. Verify environment variables are set correctly

## Related Documentation

- `/docs/API.md` - JWT token endpoint specification
- `/docs/FEATURES.md` - Feature index
- `/docs/README.md` - General index
- `components/intercom-provider.tsx` - Component source code
- `app/api/intercom-token/route.ts` - API endpoint source code
