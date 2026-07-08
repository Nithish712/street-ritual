# Street Ritual — Clothing Brand Website

**Stack**: React + Vite · Node.js/Express · Supabase · Stripe · Vercel + Render

---

## Project Structure

```
Cloth/
├── client/    → Customer storefront (React + Vite)
├── admin/     → Admin dashboard (React + Vite)
└── backend/   → REST API (Node.js + Express)
```

---

## 🚀 Local Development

### 1. Backend
```bash
cd backend
cp .env.example .env   # Fill in your keys
npm run dev            # Runs on :5000
```

### 2. Client (Storefront)
```bash
cd client
npm run dev            # Runs on :5173
```

### 3. Admin
```bash
cd admin
npm run dev            # Runs on :5174
```

---

## 🗄️ Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → Run `backend/schema.sql`
3. Copy **Project URL** and **service_role key** → paste into `backend/.env`

---

## 💳 Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Enable **Indian payments** (INR)
3. Copy **Secret Key** → `STRIPE_SECRET_KEY` in `.env`
4. For webhooks (after deploy): Dashboard → Webhooks → Add endpoint → `/api/stripe/webhook`
5. Copy **Webhook Secret** → `STRIPE_WEBHOOK_SECRET` in `.env`

**Test Card**: `4242 4242 4242 4242` · Any future date · Any CVV

---

## 🌐 Deployment

### Backend → Render
1. Push code to GitHub
2. New Web Service → select `backend/` folder
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all env vars from `.env`

### Client → Vercel
1. New Project → select `client/` folder
2. Add env var: `VITE_API_URL=https://your-render-url.onrender.com`
3. Deploy

### Admin → Vercel
1. New Project → select `admin/` folder
2. Add env vars:
   - `VITE_API_URL=https://your-render-url.onrender.com`
   - `VITE_ADMIN_SECRET=your_secret`
3. Deploy

### Update Backend CORS
After deploying frontend, update `ALLOWED_ORIGINS` in Render env:
```
CLIENT_URL=https://your-client.vercel.app
```

---

## 🔐 Admin Login
- Default secret: `streetritual_admin_2024`  
- **Change this** in `backend/.env` before deploying → update `VITE_ADMIN_SECRET` in admin Vercel env too

---

## 📦 Product Categories
- `tshirts` · `shirts` · `hoodies` · `jeans`
