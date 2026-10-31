# VOLTX – Premium Energy Drink E-Commerce & Analytics Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## ⚡ Overview

**VOLTX** is a production-grade, full-stack web application for a futuristic, premium energy drink brand. Engineered with a dark neon cyberpunk aesthetic, modern glassmorphic surfaces, and seamless transitions, the platform contains two unified portals:

1. **Customer Dashboard**: Immersive storefront, responsive 3D flavor showcase, catalog filters, persistent shopping cart, coupon discount engine, Razorpay / Cash on Delivery / Demo checkout modes, and real-time order tracking.
2. **Admin Command Center**: Executive KPI analytics, interactive Recharts graphs with date range filtering, product catalog CRUD with image uploads, live vault inventory tracking with low-stock alerts, customer lifetime spending metrics, and downloadable CSV financial reports.

---

## 🎨 Brand & Design System

- **Brand Personality**: Energetic, Futuristic, Premium, Bold, Sporty, Technology-Inspired.
- **Color Palette**:
  - Background: `#080B09`
  - Secondary Card Background: `#111713` / `#16201a`
  - Primary Electric Neon: `#B7FF32`
  - Secondary Neon: `#79D900`
  - Typography: Pure White `#FFFFFF` with muted steel `#A0AAA2`
- **Product Assets**: All product variants and hero displays are directly derived from the authentic high-resolution VOLTX can photograph.

---

## 🚀 Key Features

### Customer Experience
- **Hero & Storytelling**: High-impact neon hero with authentic can rendering, key formulation metrics (160mg bio-available caffeine, 0g sugar, 4-salt electrolytes), and interactive frequency selector.
- **Signature 5-Flavor Carousel**: Real-time flavor switcher across *Original Neon*, *Cyber Berry*, *Electric Citrus*, *Arctic Frost*, and *Midnight Voltage*.
- **Searchable Catalog**: Multi-category filtering (*Classic*, *Zero Sugar*, *High-Volt*, *Variety Pack*), price sorting, and stock warnings.
- **Product Details & Field Reports**: Detailed nutrition matrix, live stock indicators, quantity stepper, and customer star rating reviews.
- **Persistent Shopping Cart**: Syncs across sessions for authenticated users with automatic subtotal, coupon discount, GST (5%), and free express delivery calculations.
- **Checkout & Payments**:
  - **Razorpay Sandbox Integration**: Server-side cryptographic HMAC-SHA256 signature verification.
  - **Cash on Delivery (COD)**: Doorstep verification.
  - **Safe Demo Mode**: Clearly labeled instant demo checkout when external payment gateway keys are not provided.
- **Interactive Order Tracking**: Visual 5-step delivery pipeline (*Pending* → *Confirmed* → *Processing* → *Shipped* → *Delivered*) with tracking numbers, itemized invoices, and customer cancellation before dispatch.

### Admin Command Center
- **Executive Overview**: 6 core KPI metrics with percentage comparisons (*Total Revenue*, *Total Orders*, *Total Products Sold*, *Total Customers*, *Average Order Value*, *Vault Stock*).
- **Sales Analytics with Recharts**:
  - *Revenue Over Time* (Interactive Line Chart)
  - *Orders Velocity* (Area Chart)
  - *Category Sales Share* (Donut Chart)
  - *Best-Selling Flavors* (Horizontal Bar Chart)
  - *Timeframe Filters*: Last 7 Days, Last 30 Days, Last 90 Days, Last 12 Months.
- **Product Management**: Full CRUD modal, Cloudinary / Data URI persistent image upload, price updates, category changes, stock levels, featured flags, and catalog visibility toggles.
- **Vault Inventory**: Real-time stock status (*In Stock*, *Low Stock < 15*, *Out of Stock*), units sold counter, and inline quick-adjust stepper (`+10`, `+1`, `-1`, `-5`).
- **Order Dispatch Management**: Real-time order status transitions, payment status updates, shipping destination inspection, and customer communication info.
- **Customer Directory**: Registered customer profiles, contact info, total orders placed, and lifetime spend ranking.
- **Financial Reports & CSV Export**: Daily, weekly, monthly, and annual revenue summaries with instant downloadable `.csv` sales ledger.
- **Coupon System**: Create, toggle, and delete promotional discount codes (`VOLT20`, `ENERGY100`).

---

## 🔐 Credentials for Immediate Testing

You can use the built-in demo credentials on the `/login` page:

| Role | Email | Password | Destination |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@voltx.com` | `AdminVoltX2025!` | Redirects to `/admin` |
| **Customer** | `alex@voltx.com` | `Customer123!` | Redirects to `/shop` |

*Note: You can also register a new Customer account via `/register`. Public registration is strictly restricted from creating admin accounts.*

---

## 🏷️ Test Promotional Coupons

Enter these during cart or checkout:
- `VOLT20`: **20% OFF** entire order (Minimum spend: ₹299).
- `ENERGY100`: **₹100 Instant Discount** (Minimum spend: ₹499).
- `FIRSTVOLT`: **15% OFF** with no minimum order threshold.

---

## 🛠️ Tech Stack & Architecture

```
VOLTX Architecture:
├── Framework: Next.js 15 (App Router, Server Components & Server Actions)
├── Language: TypeScript 5.7
├── Database: MongoDB Atlas (via Mongoose 8) + Serverless In-Memory Fallback
├── Styling: Tailwind CSS 3.4 with custom glow & neon tokens
├── Charts: Recharts 2.15
├── Auth: JWT via `jose` (HS256) stored in Secure HTTP-Only Cookies + `bcryptjs`
├── Icons: Lucide React
└── Image Storage: Cloudinary Cloud CDN + Base64 Persistent Fallback
```

---

## 📦 Local Development Setup

### 1. Prerequisites
- Node.js `v18+` or `v20+` or `v22+`
- npm `v9+` or `v10+`

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/voltx.git
cd voltx
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment settings:
```env
# MongoDB Atlas Cloud Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/voltx?retryWrites=true&w=majority

# JWT Authentication Secret
AUTH_SECRET=voltx_super_secure_jwt_secret_key_2025_998877

# Administrator Credentials
ADMIN_EMAIL=admin@voltx.com
ADMIN_PASSWORD=AdminVoltX2025!

# Optional Cloudinary Credentials (for persistent image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional Razorpay Credentials (Test Mode)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### 4. Seed the Database
Populate the cloud database with initial admin credentials, products, and historical analytics:
```bash
npm run seed
```

### 5. Run the Integration Test Suite
```bash
npx tsx scripts/test-app.ts
```

### 6. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ MongoDB Atlas Setup Guide

1. **Create an Atlas Account**: Visit [mongodb.com/atlas](https://www.mongodb.com/atlas) and register for a free M0 tier cluster.
2. **Create a Database User**:
   - Navigate to **Security** → **Database Access**.
   - Click **Add New Database User**.
   - Select **Password Authentication**, set username & password, and grant `Read and write to any database`.
3. **Configure Network Access**:
   - Navigate to **Security** → **Network Access**.
   - Click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`) so Vercel serverless functions can connect.
4. **Obtain Connection String**:
   - Go to **Deployments** → **Database** → **Connect**.
   - Choose **Drivers** (Node.js).
   - Copy the URI and replace `<password>` with your database user password.
   - Paste into `.env.local` as `MONGODB_URI`.

---

## 🌐 Deploying to Vercel

1. Push your code to a GitHub or GitLab repository.
2. Go to [vercel.com](https://vercel.com/) and click **Add New Project**.
3. Import your `voltx` repository.
4. In the **Environment Variables** section, add:
   - `MONGODB_URI`
   - `AUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - *(Optional)* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - *(Optional)* `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
5. Click **Deploy**. Vercel will automatically build the project with optimized static pages and serverless API endpoints.
6. Once deployed, run `npm run seed` targeting your Atlas URI to populate the production cluster.

---

## 🛡️ Security Features
- **Strict Role-Based Middleware**: Customer sessions cannot navigate to `/admin` or invoke admin API routes.
- **Password Protection**: Passwords hashed using bcrypt with salt rounds of 10.
- **Client Security**: HTTP-only secure cookie transport prevents XSS token theft.
- **Atomic Stock Checks**: Server-side inventory deduction guarantees that overselling cannot occur.
- **Signature Verification**: Payment webhooks and receipts verified using SHA-256 HMAC before order finalization.

---

## 📄 License
MIT License. Crafted for **VOLTX Hyper-Energy Inc.**
