# 🐝 BeeGo Admin Panel & Backend API Server

> **Official Admin Command Center & REST API Backend for BeeGo E-Commerce Store ([bee-go.vercel.app](https://bee-go.vercel.app))**  
> Serving Virajpete Town & Kodagu District with 30-Minute Ultra-Fast Delivery.

---

## 🚀 Features Overview

- 📊 **Executive Analytics & Live KPIs**: Total revenue in ₹, pending orders in queue, low stock warnings, weekly sales trajectories, and audit logs.
- 🛒 **Products & Stock Management**: Add, edit, delete items, toggle in-stock status with 1-click, configure pricing, original strike-through prices, badges (`Bestseller`, `Organic`, `Hot Deal`), and preset image libraries.
- 📂 **Categories & Department Control**: Manage categories (Food, Groceries, Medicines, Fruits & Veggies, Coorg Specials, Dairy, Beverages) with gradient color palettes, emoji icons, and banner graphics.
- 🛵 **Orders Pipeline & WhatsApp Dispatch**: Kanban board (`Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`). 1-Click WhatsApp messaging for customers and rider dispatch to `+91 8105326568`.
- 🖨️ **Thermal Receipt & Invoices**: Formatted 80mm printable kitchen slip & customer delivery bill.
- 🏷️ **Coupons & Discount Engine**: Percentage (%) and Fixed (₹) discount codes, min order requirements, expiry dates, and usage counters.
- 📍 **Delivery Zones & Riders**: Configurable coverage areas in Virajpete (Clock Tower, Main Bazaar, College Road, Maletirike, Bethu, Arji) with per-zone fees and free delivery rules.
- 🌐 **Storefront REST API & Sync**: Single-endpoint JSON catalog (`/api/storefront/catalog`) ready to connect directly to the live [bee-go.vercel.app](https://bee-go.vercel.app) frontend.
- 💾 **Data Portability**: 1-click full JSON backup export & restore.
- 🎨 **Modern Aesthetics**: Rich dark & light mode with BeeGo Honey Yellow (`#EAB308`) and Emerald themes.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, CORS, File-backed persistent JSON / SQLite database.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Messaging / Dispatch**: WhatsApp Web Deep Links with formatted templates.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```
*(or run `npm install` in the root and in the `client/` folder)*

### 2. Run in Development Mode (Backend + Frontend concurrently)
```bash
npm run dev
```
- **Admin Panel UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Storefront Catalog**: [http://localhost:5000/api/storefront/catalog](http://localhost:5000/api/storefront/catalog)

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/storefront/catalog` | Complete active catalog bundle for `bee-go.vercel.app` |
| `POST` | `/api/storefront/order` | Place order directly from storefront into admin board |
| `GET` | `/api/storefront/status` | Quick ping for store open/closed status |
| `GET` | `/api/products` | Get all products (query: `category`, `inStock`, `search`) |
| `POST` | `/api/products` | Create new product |
| `PUT` | `/api/products/:id` | Update product details |
| `PATCH`| `/api/products/:id/stock` | Quick toggle stock status / count |
| `DELETE`| `/api/products/:id` | Remove product |
| `GET` | `/api/categories` | Get all categories |
| `POST` | `/api/categories` | Create new category |
| `GET` | `/api/orders` | Get orders list (filter by status or search) |
| `PATCH`| `/api/orders/:id/status` | Update pipeline status (`preparing`, `delivered`, etc.) |
| `GET` | `/api/orders/:id/whatsapp-links` | Generates customer and rider WhatsApp dispatch URLs |
| `GET` | `/api/coupons` | Get promo coupons |
| `POST` | `/api/coupons` | Add new promo coupon |
| `GET` | `/api/zones` | Get delivery zones & rates |
| `GET` | `/api/settings` | Get store profile & delivery settings |
| `PUT` | `/api/settings` | Update store profile & WhatsApp number |
| `GET` | `/api/settings/backup/export` | Download full database backup JSON |
| `POST` | `/api/settings/backup/restore` | Restore database from JSON |
| `GET` | `/api/analytics` | Sales stats, daily revenue & metrics |

---

## 🔗 Connecting to `bee-go.vercel.app`

In your frontend application, simply fetch the live catalog:

```javascript
fetch('http://localhost:5000/api/storefront/catalog') // Or your deployed backend URL
  .then(res => res.json())
  .then(data => {
    console.log('Categories:', data.categories);
    console.log('Products:', data.products);
    console.log('Coupons:', data.coupons);
    console.log('Store Open Status:', data.store.isOpen);
  });
```

---

## 📜 License
MIT License • Developed for **BeeGo Virajpete Express Delivery**.
