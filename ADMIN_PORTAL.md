# AUAPW Admin & Customer Portal

This document contains all login credentials and access information for the AUAPW platform.

---

## Admin Portal

### Admin Dashboard URL
```
/admin/login
```

### Default Admin Credentials

**Email:** `admin@auapw.com`  
**Password:** `AUAPWAdmin123!`

### Admin Portal Features

After logging in, admins have access to:

- **KPI Dashboard** - Live metrics including:
  - Daily Revenue
  - Total Orders
  - Average Order Value (AOV)
  - Approval Rate
  - Fraud Rate
  - Chargeback Rate
  - Refund Rate
  - Customer Satisfaction Score
  - Average Response Time
  - Average Shipping Time

- **Admin Actions**
  - View Pending Approvals
  - Manage Sellers
  - View Fraud Alerts

### How to Access Admin Portal

1. Navigate to: `http://localhost:3000/admin/login` (local) or `https://yourdomain.com/admin/login` (production)
2. Enter credentials:
   - Email: `admin@auapw.com`
   - Password: `AUAPWAdmin123!`
3. Click "Sign In"
4. You'll be redirected to the Admin Dashboard

### Admin Features Included

- Real-time KPI monitoring
- Session management with logout
- Secure token-based authentication
- Admin-specific actions and controls

---

## Customer Portal

### Customer Login URL
```
/customer/login
```

### How to Create a Customer Account

1. Navigate to: `http://localhost:3000/customer/login` (local) or `https://yourdomain.com/customer/login` (production)
2. Click "Create Account"
3. Enter your email and create a password (minimum 6 characters)
4. Click "Create Account"
5. You'll automatically be logged in and redirected to your dashboard

### Customer Portal Features

Once logged in, customers have access to:

- **Dashboard Overview**
  - Total Orders
  - Total Spent
  - Wishlist Items
  - Quick action buttons

- **Order History**
  - View all orders
  - Order status tracking (Pending, Shipped, Delivered, Cancelled)
  - Tracking numbers
  - Order totals

- **Wishlist**
  - Save favorite parts
  - View wishlist items
  - Get quotes for wishlist items

- **Account Settings**
  - View/manage account information
  - Change password
  - Delete account

---

## Testing Credentials

### Test Admin Account
- Email: `admin@auapw.com`
- Password: `AUAPWAdmin123!`
- Role: Administrator
- Access: Full admin dashboard with KPIs

### Test Customer Accounts
You can create multiple test customer accounts with any email:
- Email: `test@example.com`
- Password: `Password123` (must be 6+ characters)

---

## Environment Variables

### Admin Configuration

Set these in your `.env.local` or Vercel environment:

```env
# Admin credentials
ADMIN_EMAIL=admin@auapw.com
ADMIN_PASSWORD=AUAPWAdmin123!

# Better Auth (required for customer sessions)
BETTER_AUTH_SECRET=your-secret-key-here
```

### Generate BETTER_AUTH_SECRET

If not set, generate a secure secret:

```bash
openssl rand -base64 32
```

---

## API Endpoints

### Admin Authentication

**POST** `/api/admin/auth/login`

Request body:
```json
{
  "username": "admin@auapw.com",
  "password": "AUAPWAdmin123!"
}
```

Response (success):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "base64_encoded_token",
  "user": {
    "email": "admin@auapw.com",
    "role": "admin"
  }
}
```

### Customer Authentication

**POST** `/api/customer/auth/login`

Request body:
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

Response (success):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "base64_encoded_token",
  "customerId": "cust_xxxxx",
  "user": {
    "email": "customer@example.com",
    "role": "customer"
  }
}
```

**POST** `/api/customer/auth/signup`

Request body:
```json
{
  "email": "newcustomer@example.com",
  "password": "password123"
}
```

Response (success):
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "base64_encoded_token",
  "customerId": "cust_xxxxx",
  "user": {
    "email": "newcustomer@example.com",
    "role": "customer"
  }
}
```

---

## Routes Overview

| Route | Purpose | Access |
|-------|---------|--------|
| `/admin/login` | Admin login page | Public |
| `/admin/dashboard` | Admin KPI dashboard | Authenticated Admin |
| `/customer/login` | Customer login/signup | Public |
| `/customer/dashboard` | Customer account dashboard | Authenticated Customer |
| `/api/admin/auth/login` | Admin authentication API | Public |
| `/api/customer/auth/login` | Customer login API | Public |
| `/api/customer/auth/signup` | Customer signup API | Public |

---

## Security Notes

1. **Change default admin password** in production
2. **Set strong BETTER_AUTH_SECRET** environment variable
3. **Use HTTPS** in production
4. **Store credentials securely** - never commit to version control
5. **Implement MFA** for admin accounts (recommended for future)
6. **Regular security audits** recommended

---

## Next Steps

### Phase 2 Features to Implement

1. **CRM Integration** - HubSpot sync
2. **Payment Processing** - Stripe Connect, Chase Merchant Services
3. **Fraud Detection** - Signifyd, Sift, SEON integration
4. **Email Notifications** - SendGrid templates
5. **Inventory Management** - Warehouse management system
6. **Business Intelligence** - Power BI integration
7. **Team Collaboration** - Microsoft Teams integration
8. **Customer Reviews** - Google Reviews, Trustpilot integration
9. **AI Assistant** - Product recommendations & support

---

## Support

For issues or questions about the admin/customer portal:

1. Check environment variables are set correctly
2. Clear browser cache and localStorage
3. Review console logs for errors
4. Contact: support@auapw.com

---

**Last Updated:** January 2024  
**Version:** 1.0
