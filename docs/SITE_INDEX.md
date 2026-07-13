# 🌐 AUAPW LLC - Complete Site Index & Intercom Messenger Guide

## ℹ️ Intercom Messenger Availability

**The Intercom messenger is available on EVERY page of this website.** Customers can access support 24/7 via the messenger bubble in the bottom-right corner of any page.

---

## 📋 Complete Site Map (57 Pages)

### 🏠 Main Pages
| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/` | Main landing page with featured parts |
| Shop All Parts | `/shop` | Browse all available parts |
| Parts Catalog | `/catalog` | Complete catalog view |
| Inventory | `/inventory` | Real-time inventory status |

### 🔧 Parts by Category (Organized)
| Category | Listing Page | Single Item Page | Used Parts Page |
|----------|--------------|-----------------|-----------------|
| **Engines** | `/parts/engines` | `/parts/engines/[part]` | `/used-engines-parts` |
| **Transmissions** | `/parts/transmissions` | `/parts/transmissions/[part]` | `/used-transmissions-parts` |
| **Body Parts** | `/parts/body` | `/parts/body/[part]` | `/used-body-parts` |
| **Brakes** | `/parts/brakes` | `/parts/brakes/[part]` | `/used-brakes-parts` |
| **Cooling** | `/parts/cooling` | `/parts/cooling/[part]` | `/used-cooling-parts` |
| **Drivetrain** | `/parts/drivetrain` | `/parts/drivetrain/[part]` | `/used-drivetrain-parts` |
| **Electrical** | `/parts/electrical` | `/parts/electrical/[part]` | N/A |
| **Exhaust** | `/parts/exhaust` | `/parts/exhaust/[part]` | `/used-exhaust-parts` |
| **Suspension** | `/parts/suspension` | `/parts/suspension/[part]` | `/used-suspension-parts` |

### 🏭 Brands & Manufacturers
| Page | URL | Purpose |
|------|-----|---------|
| All Brands | `/brands` | Browse all 50+ brands |
| Specific Brand | `/brands/[brand]` | Brand-specific inventory |
| Brand Models | `/brands/[brand]/[model]` | Model-level parts filtering |
| Makes Directory | `/makes` | Organized by manufacturer |
| Specific Make | `/makes/[brand]` | Make inventory view |
| Acura Parts (Featured) | `/acura-parts` | Acura brand showcase |
| Acura Items | `/acura-parts/[id]` | Individual Acura parts |

### 🛍️ Shopping & Checkout
| Page | URL | Purpose |
|------|-----|---------|
| Cart | `/cart` | View shopping cart |
| Checkout | `/checkout` | Purchase parts |
| Quote Request | `/quote` | Request custom quote |
| Comparison | `/comparison` | Compare multiple parts |
| Wishlist | `/wishlist` | Saved parts list |

### 📁 Product Pages
| Page | URL | Purpose |
|------|-----|---------|
| Product Detail (v1) | `/product/[id]` | Individual product page |
| Product Detail (v2) | `/products/[id]` | Alternative product route |

### 🔍 Search & Discovery
| Page | URL | Purpose |
|------|-----|---------|
| Search Results | `/search` | Search results page |
| AI Search | `/ai-search` | AI-powered parts search |

### 📖 Information Pages
| Page | URL | Purpose |
|------|-----|---------|
| About Us | `/about` | Company information |
| Contact | `/contact` | Contact form & info |
| Blog | `/blog` | Articles & updates |
| Analytics | `/analytics` | Site statistics |

### ⚖️ Legal & Policy Pages
| Page | URL | Purpose |
|------|-----|---------|
| Terms of Service | `/terms` | Legal terms |
| Privacy Policy | `/privacy-policy` | Data privacy info |
| Return Policy | `/return-policy` | Return procedures |
| Shipping Policy | `/shipping-policy` | Shipping info |
| Cookie Policy | `/cookie-policy` | Cookie usage |
| Disclaimer | `/disclaimer` | Legal disclaimer |
| Acceptable Use | `/acceptable-use` | Usage guidelines |

### 🧪 Testing & Utility Pages
| Page | URL | Purpose |
|------|-----|---------|
| Responsive Preview | `/responsive-preview` | Design testing |
| Test Plan | `/test-plan` | QA testing plan |
| Sitemap | `/sitemap-page` | Site structure map |

---

## 💬 Intercom Messenger Integration

### ✅ What You Get
- **24/7 Availability**: Message support anytime
- **Secure JWT Authentication**: User data protected
- **Persistent Across All Pages**: Always accessible
- **Mobile Responsive**: Works on all devices
- **Smart Fallback**: Works for anonymous & authenticated users

### 🚀 How Customers Access Support

**Desktop:**
1. Look for the messenger bubble in the **bottom-right corner**
2. Click to open the conversation panel
3. Type your message and send
4. Agent responds in real-time

**Mobile:**
1. Same messenger bubble appears in **bottom-right**
2. Tap to open conversation
3. Type and send messages
4. Instant support replies

### 📍 Where Intercom Works
- ✅ Homepage & main pages
- ✅ All category pages (`/parts/[category]`)
- ✅ All product detail pages
- ✅ All brand pages (`/brands/[brand]`)
- ✅ Search results pages
- ✅ Shopping cart & checkout
- ✅ Account & profile pages
- ✅ Legal/policy pages
- ✅ Every single page on the site

---

## 🔐 Security & Authentication

### JWT Token Flow
```
User Opens Page
    ↓
Intercom Provider Loads
    ↓
If User Logged In:
  - Fetch JWT token from /api/intercom-token
  - Pass token to Intercom ('boot' with JWT)
  - User identified with secure credentials
    ↓
If User Anonymous:
  - Boot Intercom without JWT
  - User can still message support
  - No authentication required
```

### Environment Requirements
- `INTERCOM_API_SECRET`: Set in `.env.development.local`
- `INTERCOM_APP_ID`: `pldz9zi1` (configured in provider)

---

## 📊 Page Performance Index

### Category Landing Pages (8 total)
- `/parts/engines` - 200 OK
- `/parts/transmissions` - 200 OK
- `/parts/body` - 200 OK
- `/parts/brakes` - 200 OK
- `/parts/cooling` - 200 OK
- `/parts/drivetrain` - 200 OK
- `/parts/electrical` - 200 OK
- `/parts/exhaust` - 200 OK
- `/parts/suspension` - 200 OK

### Brand Pages (50+ brands)
- `/brands/ford` - 200 OK
- `/brands/chevrolet` - 200 OK
- `/brands/acura` - 200 OK
- ... and 47+ more brands

### Dynamic Pages
- Product detail pages: Dynamic routes with real-time inventory
- Brand filter pages: Dynamic filtering by model/year
- Search results: Real-time search across catalog

---

## 🎯 Key Features by Page Type

### Product Pages
- Product images & specifications
- Real-time pricing
- Inventory status
- **Intercom** for questions about parts

### Brand Pages
- All parts from that brand
- Advanced filtering (model, year, category)
- Bulk pricing if available
- **Intercom** for brand-specific inquiries

### Category Pages
- Browse by part type
- Filter by price, condition, mileage
- Related products
- **Intercom** for category questions

### Shopping Pages
- Add to cart functionality
- Secure checkout
- Quote requests
- **Intercom** for order support

---

## 📱 Mobile & Responsive

All 57 pages are fully responsive and the Intercom messenger adapts to:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Ultra-wide displays (1600px+)

**Messenger positioning**: Bottom-right on all screen sizes

---

## 🆘 Customer Support Flow

1. **Customer finds a part** on any of the 57 pages
2. **Clicks Intercom messenger** (bottom-right)
3. **Types their question** (about pricing, shipping, specs, etc.)
4. **Support agent responds** in real-time
5. **Customer gets instant help** without leaving the page

---

## 📈 Site Metrics

- **Total Pages**: 57
- **Category Pages**: 9 main + 9 "used" variants
- **Brand Pages**: 50+
- **Product Routes**: 2 (dynamic)
- **Policy Pages**: 7
- **Support Pages**: 2

---

## 🔗 Quick Links for Support

**Need Help?**
- Messenger: Bottom-right corner on ANY page
- Email: Contact form at `/contact`
- Phone: Available through Intercom
- Live Chat: Via Intercom messenger

**Intercom is available on all 57 pages - no exceptions!**

---

*Last Updated: 2026*
*Intercom App ID: pldz9zi1*
*JWT Endpoint: /api/intercom-token*
