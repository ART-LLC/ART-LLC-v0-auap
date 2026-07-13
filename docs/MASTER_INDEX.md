# MASTER INDEX - Complete Website Reference

**Last Updated:** 2026-07-13  
**Total Pages:** 57  
**Total Components:** 40+  
**Total APIs:** 5+  
**Intercom Coverage:** 100% (All Pages)

---

## Table of Contents
1. [Quick Links](#quick-links)
2. [Pages & Routes](#pages--routes)
3. [Components Registry](#components-registry)
4. [API Endpoints](#api-endpoints)
5. [Data Sources](#data-sources)
6. [Features & Systems](#features--systems)
7. [Intercom Integration Map](#intercom-integration-map)
8. [Environment Variables](#environment-variables)
9. [File Structure](#file-structure)

---

## Quick Links

| Resource | Location | Purpose |
|----------|----------|---------|
| **Site Map** | `docs/SITE_INDEX.md` | All 57 pages with Intercom availability |
| **API Reference** | `docs/API.md` | Complete endpoint documentation |
| **Features** | `docs/FEATURES.md` | Technical component index |
| **Main README** | `docs/README.md` | Getting started guide |
| **This File** | `docs/MASTER_INDEX.md` | Complete master index |

---

## Pages & Routes

### Main Pages (4)
- **`/`** - Homepage with hero, featured products, brand values, gallery
- **`/about`** - Company information and mission
- **`/contact`** - Contact form and support information
- **`/search`** - Product search interface

### Parts Categories (9)
- **`/parts/engines`** - Engine parts listing (50+ brands)
- **`/parts/transmissions`** - Transmission parts (all brands)
- **`/parts/brakes`** - Brake systems
- **`/parts/suspension`** - Suspension components
- **`/parts/exhaust`** - Exhaust systems
- **`/parts/radiators`** - Cooling systems
- **`/parts/electrical`** - Electrical components
- **`/parts/drivetrain`** - Drivetrain parts
- **`/parts/interior`** - Interior components

### Used Parts Categories (9)
- **`/used-parts/complete-engines`**
- **`/used-parts/transmissions`**
- **`/used-parts/doors-windows`**
- **`/used-parts/fenders`**
- **`/used-parts/hoods`**
- **`/used-parts/bumpers`**
- **`/used-parts/lights`**
- **`/used-parts/seats`**
- **`/used-parts/electronics`**

### Brand Pages (50+)
- **`/brands/[brand]`** - Dynamic brand pages with filtering by engine/transmission type
- Covers: Acura, Audi, BMW, Cadillac, Chevrolet, Chrysler, Dodge, Ford, GMC, Honda, Hummer, Hyundai, Infiniti, Jeep, Kia, Land Rover, Lexus, Lincoln, Maserati, Mazda, Mercedes-Benz, Mini, Mitsubishi, Nissan, Pontiac, Porsche, Range Rover, Saab, Subaru, Suzuki, Tesla, Toyota, Volkswagen, Volvo, + more

### Product Pages
- **`/brands/[brand]/[sku]`** - Individual product detail pages with images, specs, pricing
- **`/product/[id]`** - Product lookup by ID

### Shopping Pages
- **`/cart`** - Shopping cart
- **`/checkout`** - Checkout page
- **`/order-confirmation`** - Order confirmation

### Account Pages
- **`/account`** - User dashboard
- **`/account/orders`** - Order history
- **`/account/wishlist`** - Saved items
- **`/account/profile`** - Profile settings

### Policy & Legal (7)
- **`/policies/privacy`** - Privacy policy
- **`/policies/terms`** - Terms of service
- **`/policies/shipping`** - Shipping information
- **`/policies/returns`** - Return policy
- **`/policies/warranty`** - Warranty information
- **`/policies/faq`** - Frequently asked questions
- **`/policies/accessibility`** - Accessibility statement

### Utility Pages
- **`/404`** - Not found page
- **`/500`** - Error page
- **`/search`** - Search results
- **`/compare`** - Product comparison tool

---

## Components Registry

### Layout Components
| Component | Location | Purpose |
|-----------|----------|---------|
| RootLayout | `app/layout.tsx` | Root provider with Intercom |
| Header | `components/header.tsx` | Navigation header |
| Footer | `components/footer.tsx` | Footer with links |
| Sidebar | `components/sidebar.tsx` | Navigation sidebar |
| MobileNav | `components/mobile-nav.tsx` | Mobile navigation |

### Intercom Components
| Component | Location | Purpose |
|-----------|----------|---------|
| IntercomProvider | `components/intercom-provider.tsx` | JWT auth + boot |
| IntercomButton | `components/intercom-button.tsx` | Manual launch button |
| IntercomIndicator | `components/intercom-indicator.tsx` | Unread message badge |

### Page Components
| Component | Location | Purpose |
|-----------|----------|---------|
| HeroSection | `components/home/hero-section.tsx` | Homepage hero |
| HeroSlider | `components/home/hero-slider.tsx` | Image carousel |
| FeaturedProducts | `components/home/featured-products-section.tsx` | Featured 8 parts |
| BrandValues | `components/home/brand-values-section.tsx` | Why choose us |
| ShowcaseGallery | `components/home/showcase-gallery-section.tsx` | Delivery showcase |
| CategoriesSection | `components/home/categories-section.tsx` | Parts categories |
| ContentSection | `components/home/content-section.tsx` | Banner section |

### Product Components
| Component | Location | Purpose |
|-----------|----------|---------|
| ProductCard | `components/product/product-card.tsx` | Product listing card |
| ProductGrid | `components/product/product-grid.tsx` | Grid layout |
| ProductFilter | `components/product/product-filter.tsx` | Filtering interface |
| ProductDetail | `components/product/product-detail.tsx` | Detail page layout |
| PriceDisplay | `components/product/price-display.tsx` | Price with formatting |
| RatingStars | `components/product/rating-stars.tsx` | Star rating display |

### UI Components (shadcn)
- Button, Card, Badge, Tag, Modal, Toast, Dropdown, Tabs, Accordion, Checkbox, Input, Textarea, Select, etc.

---

## API Endpoints

### Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/intercom-token` | POST | Generate secure JWT token |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/register` | POST | User registration |
| `/api/auth/verify` | GET | Verify JWT token |

### Products
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products` | GET | List all products with filters |
| `/api/products/[id]` | GET | Get product details |
| `/api/products/search` | GET | Search products |
| `/api/products/[id]/reviews` | GET | Product reviews |
| `/api/product-image/[brand]/[sku]` | GET | Product image endpoint |

### Brands
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/brands` | GET | List all brands |
| `/api/brands/[slug]` | GET | Get brand details |
| `/api/brands/[slug]/products` | GET | Brand products with filters |

### Shopping
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cart` | GET, POST, PUT | Cart operations |
| `/api/cart/items` | GET | Get cart items |
| `/api/checkout` | POST | Process checkout |
| `/api/orders` | GET, POST | Order operations |

### Messaging
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/messages` | GET, POST | Message CRUD |
| `/api/messages/[id]` | GET, PUT, DELETE | Single message |
| `/api/messages/[id]/attachments` | POST | Upload attachments |

### Intercom
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/intercom-token` | POST | JWT token generation |
| Request Body | - | `{userId, email, name}` |
| Response | - | `{token: "jwt..."}` |

---

## Data Sources

### Brand Data
- **Location:** `data/brands/` (50+ JSON files)
- **Schema:** `{slug, name, products: [{slug, name, sku, ...}]}`
- **Example:** `data/brands/ford.json`, `data/brands/toyota.json`

### Product Images
- **Location:** `public/product-images/`
  - `engine/` - 101 engine photos (50 brands × 2 variants)
  - `transmission/` - 53 transmission photos (CVT, manual, automatic)
  - `[category]/` - Category-specific images
  - `section-*.png` - Hero and showcase images

### Styles & Theme
- **Global Styles:** `app/globals.css` (4900+ lines)
- **Theme Colors:** CSS variables (background, foreground, primary, accent, etc.)
- **Tailwind Config:** `tailwind.config.js` or Tailwind v4 in `globals.css`

### Configuration
- **Environment:** `.env.development.local`
- **Next.js:** `next.config.js`
- **Package Manager:** `pnpm` (pnpm-lock.yaml)

---

## Features & Systems

### 1. Intercom Messenger (100% Site Coverage)
- **Status:** ✅ Active on all 57 pages
- **Location:** Bottom-right corner
- **Authentication:** JWT tokens with HS256
- **Availability:** 24/7, anonymous + authenticated
- **App ID:** `pldz9zi1`
- **Integration:** Root layout provider (automatic global)

### 2. Product Search & Filtering
- **50+ brands** with dynamic inventory
- **9 engine types** with professional photos
- **9 transmission types** with type-specific photos
- **Filter by:** Brand, engine type, transmission, mileage, condition
- **Search:** Full-text product search

### 3. Product Images
- **Coverage:**
  - Engines: 101 photos (all 50 brands)
  - Transmissions: 53 photos (all brands with type fallback)
  - Other parts: Category-specific photos
- **API:** `/api/product-image/[brand]/[sku]`
- **Dimensions:** Locked 4:3 aspect ratio, no CLS

### 4. Homepage Showcase
- **Hero Slider:** 5+ banner images with smooth transitions
- **Featured Products:** 8 premium parts with ratings/reviews
- **Brand Values:** Why Choose Us section with 4 images
- **Showcase Gallery:** Warehouse, delivery, appointment, assembly images
- **Responsive:** Mobile-first design with breakpoints

### 5. Shopping Cart & Checkout
- **Add to Cart:** All product pages
- **Cart Persistence:** Local + server-side options
- **Checkout:** Secure payment processing
- **Order Confirmation:** Email + dashboard tracking

### 6. User Accounts
- **Authentication:** JWT-based with secure tokens
- **Dashboard:** Order history, wishlist, profile
- **Profile Management:** User settings, preferences
- **Security:** HTTPS, secure cookies, CSRF protection

### 7. Mobile Responsive
- **Breakpoints:** xs (320px), sm (640px), md (768px), lg (1024px), xl (1280px)
- **Components:** Mobile nav, responsive grid, touch-friendly buttons
- **Performance:** Optimized images, lazy loading

---

## Intercom Integration Map

### On Every Page (57 Total)

**Intercom Widget Location:** Bottom-right corner, always visible

| Page Type | Route | Status | Features |
|-----------|-------|--------|----------|
| Homepage | `/` | ✅ Active | Chat, product help |
| Brand Pages | `/brands/[brand]` | ✅ Active | Inventory questions |
| Parts Categories | `/parts/[category]` | ✅ Active | Part selection help |
| Used Parts | `/used-parts/[category]` | ✅ Active | Condition questions |
| Product Detail | `/brands/[brand]/[sku]` | ✅ Active | Specs, pricing, warranty |
| Cart | `/cart` | ✅ Active | Shipping, delivery |
| Checkout | `/checkout` | ✅ Active | Payment support, issues |
| Confirmation | `/order-confirmation` | ✅ Active | Order tracking |
| Search Results | `/search?q=...` | ✅ Active | Search assistance |
| Policies | `/policies/*` | ✅ Active | Policy clarifications |
| Account | `/account/*` | ✅ Active | Account help |
| 404/500 Errors | Various | ✅ Active | Support recovery |

### JWT Authentication Flow

```
User loads page
    ↓
IntercomProvider component initializes
    ↓
If user is authenticated:
  - Fetch JWT token from /api/intercom-token
  - Token is signed with INTERCOM_API_SECRET (HS256)
  - Token includes: user_id, email, name (1-hour expiry)
    ↓
window.Intercom('boot', {
  app_id: 'pldz9zi1',
  intercom_user_jwt: token,
  api_base: 'https://api-iam.intercom.io'
})
    ↓
User can send messages, Intercom has secure identity
    ↓
If unauthenticated:
  - Boot as anonymous visitor
  - Can still chat, but no user context
  - Automatic visitor ID assigned by Intercom
```

---

## Environment Variables

| Variable | Required | Location | Purpose |
|----------|----------|----------|---------|
| `INTERCOM_API_SECRET` | ✅ Yes | `.env.development.local` | JWT signing secret |
| `NEXT_PUBLIC_INTERCOM_APP_ID` | Optional | Environment | Public app ID (overrides hardcoded) |
| `NODE_ENV` | Auto | System | Environment mode |
| `VERCEL_URL` | Optional | Vercel | Deployment URL |

**Setup:**
```bash
# Add to .env.development.local
INTERCOM_API_SECRET=es2OvSafq_aUEZD3j4r1xuBCVTrtuhe5iR3NddTuZfs
```

---

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                 # Root layout with IntercomProvider
│   ├── page.tsx                   # Homepage
│   ├── globals.css                # Global styles (4900+ lines)
│   ├── api/
│   │   ├── intercom-token/        # JWT generation
│   │   ├── products/              # Product endpoints
│   │   ├── brands/                # Brand endpoints
│   │   └── product-image/         # Image serving
│   ├── brands/
│   │   ├── page.tsx               # Brand listing
│   │   ├── [brand]/
│   │   │   ├── page.tsx           # Brand detail
│   │   │   └── [sku]/
│   │   │       └── page.tsx       # Product detail
│   ├── parts/
│   │   ├── page.tsx               # Parts listing
│   │   └── [category]/
│   │       └── page.tsx           # Category detail
│   ├── cart/page.tsx              # Shopping cart
│   ├── checkout/page.tsx          # Checkout
│   ├── account/page.tsx           # User dashboard
│   └── policies/page.tsx          # Legal pages
│
├── components/
│   ├── intercom-provider.tsx      # ⭐ Intercom JWT + boot
│   ├── header.tsx                 # Navigation
│   ├── footer.tsx                 # Footer
│   ├── mobile-theme-fab.tsx       # Mobile theme toggle
│   ├── home/
│   │   ├── hero-section.tsx
│   │   ├── featured-products-section.tsx
│   │   ├── showcase-gallery-section.tsx
│   │   └── ...
│   ├── product/
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   └── ...
│   └── ui/                        # shadcn components
│
├── lib/
│   ├── brand-catalog.ts           # Brand/product data
│   ├── auth-context.ts            # Auth provider
│   └── utils.ts                   # Utilities
│
├── public/
│   ├── images/                    # Homepage images
│   ├── product-images/
│   │   ├── engine/                # 101 engine photos
│   │   ├── transmission/          # 53 transmission photos
│   │   └── [category]/
│   └── fonts/
│
├── data/
│   └── brands/                    # 50+ brand JSON files
│
├── docs/
│   ├── README.md                  # Main documentation
│   ├── API.md                     # API reference
│   ├── FEATURES.md                # Features index
│   ├── SITE_INDEX.md              # Site map
│   └── MASTER_INDEX.md            # ⭐ This file
│
├── .env.development.local         # Environment variables (LOCAL)
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind configuration
├── package.json                   # Dependencies
└── pnpm-lock.yaml                 # Lock file
```

---

## Quick Reference

### Adding New Features
1. **New Page:** Create in `app/[route]/page.tsx` (Intercom auto-included)
2. **New API:** Create in `app/api/[route]/route.ts`
3. **New Brand:** Add JSON to `data/brands/[brand].json`
4. **New Component:** Add to `components/[section]/[name].tsx`
5. **New Images:** Add to `public/product-images/[category]/`

### Testing Intercom
```bash
# Homepage
curl http://localhost:3000/

# Product page
curl http://localhost:3000/brands/ford/2015-ford-f-150-engine-ecoboost-3-5l

# Generate JWT token
curl -X POST http://localhost:3000/api/intercom-token \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","email":"user@example.com","name":"John"}'
```

### Debugging
```javascript
// Check Intercom is loaded
console.log(window.Intercom); // Should be function

// Check JWT token
fetch('/api/intercom-token', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({userId: 'test', email: 'test@ex.com'})
}).then(r => r.json()).then(d => console.log(d.token));

// Manually trigger Intercom
window.Intercom('show');
window.Intercom('getVisitorId');
```

---

## Documentation Links

- **Getting Started:** Read `docs/README.md`
- **API Reference:** See `docs/API.md`
- **Page Map:** View `docs/SITE_INDEX.md`
- **Features:** Check `docs/FEATURES.md`
- **This Index:** You are here (docs/MASTER_INDEX.md)

---

**Generated:** 2026-07-13  
**Status:** ✅ Complete  
**Last Updated:** As of latest commit
