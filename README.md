# Crosstalk

Turn X threads into scroll-stopping LinkedIn posts and authentic Reddit posts. Unlimited. $12/month.

---

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Environment Variables](#environment-variables)
3. [Supabase Setup](#supabase-setup)
4. [Local Development](#local-development)
5. [GitHub + Vercel Deployment](#github--vercel-deployment)
6. [NowPayments Setup](#nowpayments-setup)
7. [Admin Panel Guide](#admin-panel-guide)
8. [Credits System Guide](#credits-system-guide)
9. [Switching to Lemon Squeezy](#switching-to-lemon-squeezy)
10. [Switching to SMTP Email](#switching-to-smtp-email)
11. [Changing the AI Model](#changing-the-ai-model)

---

## Folder Structure

All files live in the root — no subfolders.

```
crosstalk/
├── Admin.jsx              # Admin panel (your email only)
├── App.jsx                # Router + auth state
├── Dashboard.jsx          # Main conversion page
├── DemoBox.jsx            # Live demo on landing page
├── Footer.jsx
├── History.jsx            # Past conversions
├── Landing.jsx            # Landing page
├── Login.jsx
├── Navbar.jsx
├── OutputTabs.jsx         # LinkedIn/Reddit output tabs
├── Pricing.jsx            # NowPayments checkout
├── ProtectedRoute.jsx
├── Signup.jsx
├── auth.js                # Supabase auth helpers
├── groq.js                # AI conversion + master prompt
├── index.css              # Tailwind + custom styles
├── index.html
├── main.jsx
├── package.json
├── payment.js             # Payment logic (swap here for Lemon Squeezy)
├── postcss.config.js
├── supabase.js            # Supabase client + all DB helpers
├── tailwind.config.js
├── vercel.json            # SPA routing fix for Vercel
├── vite.config.js
├── webhook.js             # NowPayments IPN webhook
├── SUPABASE_SETUP.sql     # Run this in Supabase SQL Editor
├── .env.example
├── .gitignore
└── README.md
```

---

## Environment Variables

Create a `.env` file in the root and fill in all values:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_SUPABASE_URL=https://ylgyuebspaawetgoskbd.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
VITE_NOWPAYMENTS_API_KEY=your_nowpayments_api_key_here
VITE_NOWPAYMENTS_IPN_KEY=your_nowpayments_ipn_key_here
```

**Security rules:**
- `VITE_` prefix = safe to use on the frontend
- `SUPABASE_SERVICE_ROLE_KEY` = server only. NEVER add VITE_ prefix. NEVER use in any .jsx file.
- Find your Service Role Key: Supabase Dashboard → Settings → API → service_role

---

## Supabase Setup

### Step 1: Run the SQL

1. Go to Supabase Dashboard → SQL Editor → New Query
2. Open `SUPABASE_SETUP.sql` from this project
3. Copy the entire contents and paste into the SQL editor
4. Click Run

This creates all 4 tables, RLS policies, indexes, and the trigger that gives every new signup 5 free credits automatically.

### Step 2: Disable email confirmations (recommended for launch)

Supabase Dashboard → Authentication → Settings → Email → disable "Confirm email"

This lets users sign in immediately after signup without waiting for email.

If you want email confirmation ON (more secure):
- Keep it enabled
- The signup page already handles this and shows "Check your email" screen

### Step 3: Update Auth URLs after deployment

After you deploy to Vercel, come back and update:
- Supabase Dashboard → Authentication → URL Configuration
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Fill in all your keys

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

---

## GitHub + Vercel Deployment

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Crosstalk"
git branch -M main
git remote add origin https://github.com/yourusername/crosstalk.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to vercel.com → Add New Project
2. Import your GitHub repo
3. Framework preset: **Vite**
4. Root directory: leave empty (files are in root)
5. Add all environment variables (copy from your .env file)
6. Click Deploy

### Step 3: Add environment variables on Vercel

Vercel Dashboard → Your Project → Settings → Environment Variables. Add all 6 keys from your .env file.

### Step 4: Fix 404 on page refresh

Already handled — `vercel.json` is included and routes all paths to `index.html`.

---

## NowPayments Setup

### Step 1: Get your API key

NowPayments Dashboard → Store Settings → API Keys → copy your API key

### Step 2: Set up IPN (webhook)

1. NowPayments Dashboard → Store Settings → IPN Settings
2. IPN callback URL: `https://your-app.vercel.app/api/webhook`
3. Copy your IPN Secret Key → paste in .env as `VITE_NOWPAYMENTS_IPN_KEY`

### Step 3: How the payment flow works

```
User clicks Subscribe
→ App creates NowPayments invoice via API
→ User lands on NowPayments payment page
→ User sends $12 in USDT (TRX network)
→ NowPayments detects the payment
→ NowPayments sends IPN to /api/webhook
→ Webhook verifies the signature
→ Supabase sets is_subscribed = true and subscription_expires = 30 days from now
→ User gets full access automatically
```

### Step 4: Subscription renewal

NowPayments sends users a renewal invoice by email each month. When they pay, the IPN fires again and resets their subscription_expires to another 30 days.

---

## Admin Panel Guide

Access: Log in with `bundepunemmanuel@gmail.com` then go to `/admin`

Anyone else who tries to visit `/admin` gets silently redirected to `/dashboard`.

**What you can see:**
- Total users, active subscribers, monthly revenue
- Landing page visits: today, this week, all time
- Signup conversion rate
- Every user: email, status, credits, conversion count, join date

**Adding credits to a user:**
1. Find the user in the table (search by email)
2. Type a number in the credits input next to their row
3. Click `+Credits`
4. Credits added instantly

**Activating / deactivating a user:**
- Click `Activate` to manually give someone a subscription without payment
- Click `Deactivate` to remove their subscription access
- Useful for refunds, free trials, influencer access, or handling failed payments

---

## Credits System Guide

**How credits work:**
- Every new user gets **5 free credits** automatically on signup
- 1 credit = 1 conversion (both LinkedIn + Reddit output)
- Credits are only used when user has no active subscription
- Active subscribers: unlimited conversions, credits ignored
- Credits never expire

**Use cases:**
- Give influencers 50 credits so they can try the product free
- Give extra credits to early adopters as a thank you
- Give credits instead of refunds
- Manually reward referrals

**Updating existing users to 5 credits:**
If you already have users in Supabase with 0 credits, run this SQL:
```sql
UPDATE public.profiles SET credits = 5 WHERE credits = 0 AND is_subscribed = FALSE;
```

---

## Switching to Lemon Squeezy

When ready (month 4+), only ONE file needs to change: `payment.js`

### Step 1: Create Lemon Squeezy account

1. Go to lemonsqueezy.com → Create store
2. Create a product → set price $12/month recurring
3. Copy your API Key, Store ID, and Variant ID

### Step 2: Add new environment variables

Add to `.env` and Vercel:
```env
VITE_LEMONSQUEEZY_API_KEY=your_key
VITE_LEMONSQUEEZY_STORE_ID=your_store_id
VITE_LEMONSQUEEZY_VARIANT_ID=your_variant_id
```

Remove:
```env
VITE_NOWPAYMENTS_API_KEY
VITE_NOWPAYMENTS_IPN_KEY
```

### Step 3: Replace payment.js

Replace the entire contents of `payment.js` with:

```js
const LEMON_API_KEY = import.meta.env.VITE_LEMONSQUEEZY_API_KEY
const STORE_ID = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID
const VARIANT_ID = import.meta.env.VITE_LEMONSQUEEZY_VARIANT_ID

export const createInvoice = async (userEmail, userId) => {
  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LEMON_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: { email: userEmail, custom: { user_id: userId } }
        },
        relationships: {
          store: { data: { type: 'stores', id: STORE_ID } },
          variant: { data: { type: 'variants', id: VARIANT_ID } }
        }
      }
    })
  })
  const data = await response.json()
  return { invoiceUrl: data.data.attributes.url }
}
```

### Step 4: Update webhook.js

Replace the webhook handler to listen for Lemon Squeezy events:
- Event: `subscription_payment_success`
- Same logic: set `is_subscribed = true` and `subscription_expires = 30 days`
- Update webhook URL in Lemon Squeezy dashboard

### Step 5: Email existing users

Let your NowPayments users know you're switching and ask them to resubscribe via the new link. Give them 1 free month of credits as compensation.

---

## Switching to SMTP Email

When you hit 50+ users or want branded emails:

1. Create account at brevo.com (free — 300 emails/day)
2. Get SMTP credentials from Brevo dashboard
3. Supabase Dashboard → Settings → Auth → SMTP Settings
4. Fill in:
   - Host: `smtp-relay.brevo.com`
   - Port: `587`
   - Username: your Brevo login email
   - Password: your Brevo SMTP key
5. Save — all auth emails now use your branding

---

## Changing the AI Model

Open `groq.js` and find this line:

```js
model: 'llama-3.1-8b-instant',
```

Replace with any Groq model:

```js
model: 'llama3-70b-8192',      // smarter but slower
model: 'llama-3.1-8b-instant', // current — fast and good
model: 'mixtral-8x7b-32768',   // good for long threads
```

Check available models at console.groq.com
