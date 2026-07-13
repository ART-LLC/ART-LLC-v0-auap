# Quick Start Guide - AUAPW Website

## For Users
Start here: **[Main Documentation](./README.md)**

### Finding Intercom Support
Intercom messenger is available on **every page** - look for the chat bubble in the **bottom-right corner**.

- **Pages covered:** All 57 pages (homepage, products, cart, checkout, policies, etc.)
- **Availability:** 24/7
- **Authentication:** Works with or without login
- **Support:** Click bubble → send message → receive reply

## For Developers
Start here: **[Master Index](./MASTER_INDEX.md)**

### Quick Navigation
1. **Want to see all pages?** → Read `docs/SITE_INDEX.md`
2. **Need API endpoints?** → Read `docs/API.md`
3. **Looking for components?** → Read `docs/FEATURES.md`
4. **Understanding everything?** → Read `docs/MASTER_INDEX.md`

### Setup
```bash
# Clone and install
git clone <repo>
cd v0-project
pnpm install

# Add environment variable
echo "INTERCOM_API_SECRET=es2OvSafq_aUEZD3j4r1xuBCVTrtuhe5iR3NddTuZfs" >> .env.development.local

# Start dev server
pnpm dev

# Visit http://localhost:3000
# Look for Intercom bubble in bottom-right corner
```

### Testing Intercom
```bash
# Check Intercom loads on any page
curl http://localhost:3000/ | grep -i intercom

# Test JWT endpoint
curl -X POST http://localhost:3000/api/intercom-token \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","email":"test@example.com","name":"Test User"}'

# Should return: {"token":"eyJhbGc..."}
```

### Common Tasks

#### Add New Page
1. Create `app/new-page/page.tsx`
2. Intercom automatically included (via root layout)
3. No additional setup needed

#### Add New Product Category
1. Create `app/parts/new-category/page.tsx`
2. Add data to `data/brands/`
3. Deploy

#### Update Intercom Settings
1. Edit `components/intercom-provider.tsx`
2. Change app_id, session duration, or other configs
3. Restart dev server

#### Test Multiple Pages
```bash
# Homepage
curl http://localhost:3000/

# Product page
curl http://localhost:3000/brands/ford

# Parts category
curl http://localhost:3000/parts/engines

# Checkout
curl http://localhost:3000/checkout

# All return 200 with Intercom enabled
```

## File Locations Reference

| What | Where |
|------|-------|
| Intercom setup | `components/intercom-provider.tsx` |
| JWT generation | `app/api/intercom-token/route.ts` |
| Root layout | `app/layout.tsx` |
| Homepage | `app/page.tsx` |
| Product pages | `app/brands/[brand]/[sku]/page.tsx` |
| API endpoints | `app/api/*/route.ts` |
| Brand data | `data/brands/*.json` |
| Images | `public/product-images/` |
| Styles | `app/globals.css` |
| Config | `next.config.js`, `tailwind.config.js` |

## Debugging

### Intercom not showing?
```javascript
// In browser console:
console.log(window.Intercom); // Should be function

// If function, manually show:
window.Intercom('show');

// Get visitor ID:
window.Intercom('getVisitorId');
```

### JWT token error?
```bash
# Check env variable is set
grep INTERCOM_API_SECRET .env.development.local

# Check API response
curl -X POST http://localhost:3000/api/intercom-token \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","email":"test@ex.com"}'

# Should show token or error message
```

### Messages not sending?
1. Check network tab - `/api/intercom-token` should return 200 with token
2. Check `INTERCOM_API_SECRET` is set correctly
3. Verify Intercom app_id is `pldz9zi1`
4. Clear browser cache and reload

## Production Deployment

### Before Deploy
1. Verify all 57 pages load (check `SITE_INDEX.md`)
2. Test Intercom on main, product, and checkout pages
3. Verify `INTERCOM_API_SECRET` is set in Vercel environment
4. Test JWT token generation: `/api/intercom-token`

### Deploy
```bash
# Push to main branch
git push origin main

# Vercel auto-deploys
# Verify: Check bottom-right for Intercom bubble on production
```

## Support

### Getting Help
1. **For users:** Use Intercom messenger on any page
2. **For developers:** See full docs in `docs/MASTER_INDEX.md`
3. **For API issues:** Check `docs/API.md` for endpoints
4. **For components:** Check `docs/FEATURES.md` for registry

## Documentation Map

```
Start Here: README.md
     ↓
   Choose:
   ├─ Users → Browse website, use Intercom
   ├─ Developers → MASTER_INDEX.md
   │                ├─ SITE_INDEX.md (pages)
   │                ├─ API.md (endpoints)
   │                ├─ FEATURES.md (components)
   │                └─ QUICK_START.md (this file)
   └─ Troubleshooting → MASTER_INDEX.md → Debugging section
```

## Key Stats

- **Total Pages:** 57
- **Components:** 40+
- **API Endpoints:** 10+
- **Brands:** 50+
- **Engine Photos:** 101
- **Transmission Photos:** 53
- **Intercom Coverage:** 100%
- **Support Availability:** 24/7

---

**Last Updated:** 2026-07-13  
**Status:** ✅ Ready for Production
