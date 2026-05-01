# Crosstalk 🚀

Turn X threads into LinkedIn + Reddit posts. Unlimited. $12/month.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Environment Variables](#environment-variables)
4. [Supabase Setup](#supabase-setup)
5. [NowPayments Setup](#nowpayments-setup)
6. [Groq Setup](#groq-setup)
7. [Local Development](#local-development)
8. [Vercel Deployment](#vercel-deployment)
9. [Admin Panel Guide](#admin-panel-guide)
10. [Credits System Guide](#credits-system-guide)
11. [Switching to Lemon Squeezy](#switching-to-lemon-squeezy)
12. [Switching to SMTP Email](#switching-to-smtp-email)
13. [Changing the AI Model](#changing-the-ai-model)

---

## Project Overview

Crosstalk converts raw X (Twitter) threads into:
- **LinkedIn posts** — hook, paragraphs, hashtags, CTA
- **Reddit posts** — subreddit suggestions, title, body

Key features:
- Tone detection (motivational, technical, failure, win)
- Voice preservation (sounds like YOU, not AI)
- 3 subreddit suggestions per conversion
- Live demo on landing page (1 free per IP)
- Credits system for rewarding users
- Admin panel for full control
- Landing page visitor tracking

---

## Folder Structure

```
crosstalk/
├── api/
│   └── webhook.js              # NowPayments IPN webhook (Vercel serverless)
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── DemoBox.jsx         # Live demo on landing page
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── OutputTabs.jsx      # LinkedIn/Reddit tab output
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Admin.jsx           # Admin panel (your email only)
│   │   ├── Dashboard.jsx       # Main conversion page
│   │   ├── History.jsx         # Past conversions
│   │   ├── Landing.jsx         # Landing page with live demo
│   │   ├── Login.jsx
│   │   ├── Pricing.jsx         # NowPayments checkout
│   │   └── Signup.jsx
│   ├── services/
│   │   ├── auth.js             # Supabase auth helpers
│   │   ├── groq.js             # Groq AI + master prompt
│   │   ├── payment.js          # NowPayments (swap for Lemon Squeezy later)
│   │   └── supabase.js         # Supabase client
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Environment Variables

Create a `.env` file in root:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_SUPABASE_URL=https://ylgyuebspaawetgoskbd.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
VITE_NOWPAYMENTS_API_KEY=your_nowpayments_api_key_here
VITE_NOWPAYMENTS_IPN_KEY=your_nowpayments_ipn_key_here
```

⚠️ NEVER prefix SUPABASE_SERVICE_ROLE_KEY with VITE_ — it must stay server-side only.

### Where to find each key:

**Groq:** console.groq.com → API Keys → Create Key

**Supabase:** Project → Settings → API
- Project URL → VITE_SUPABASE_URL
- anon public → VITE_SUPABASE_ANON_KEY
- service_role secret → SUPABASE_SERVICE_ROLE_KEY

**NowPayments:** Dashboard → Store Settings → API Keys
- API Key → VITE_NOWPAYMENTS_API_KEY
- IPN Secret Key → VITE_NOWPAYMENTS_IPN_KEY

---

## Supabase Setup

### Step 1: Run SQL Schema

Go to Supabase → SQL Editor → New Query → paste and run:

```sql
-- Profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  is_subscribed BOOLEAN DEFAULT FALSE,
  subscription_date TIMESTAMPTZ,
  subscription_expires TIMESTAMPTZ,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversions table
CREATE TABLE public.conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  linkedin_output TEXT,
  reddit_subreddit_primary TEXT,
  reddit_subreddit_alt1 TEXT,
  reddit_subreddit_alt2 TEXT,
  reddit_title TEXT,
  reddit_body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo conversions (IP tracking)
CREATE TABLE public.demo_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page visits
CREATE TABLE public.page_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own conversions" ON public.conversions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversions" ON public.conversions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can insert demo conversions" ON public.demo_conversions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read demo conversions" ON public.demo_conversions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert page visits" ON public.page_visits FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_conversions_user_id ON public.conversions(user_id);
CREATE INDEX idx_conversions_created_at ON public.conversions(created_at);
CREATE INDEX idx_demo_conversions_ip ON public.demo_conversions(ip_address);
CREATE INDEX idx_page_visits_visited_at ON public.page_visits(visited_at);
```

### Step 2: Configure Auth

1. Authentication → Settings
2. Site URL → your Vercel URL
3. Redirect URLs → add your Vercel URL

---

## NowPayments Setup

### Create Subscription Plan
1. nowpayments.io → Subscriptions → Create Plan
2. Amount: 12, Currency: USDT, Interval: Monthly
3. Copy Plan ID

### IPN Webhook
1. Store Settings → IPN Settings
2. IPN URL: `https://your-vercel-url.vercel.app/api/webhook`
3. Save IPN Secret Key to .env

### Payment Flow
User clicks pay → App creates invoice → User pays USDT/TRX → NowPayments fires IPN → Webhook verifies → Supabase updates is_subscribed = true → User gets access

---

## Groq Setup

1. console.groq.com → API Keys → Create Key
2. Paste into .env as VITE_GROQ_API_KEY

Current model: `llama-3.1-8b-instant`

---

## Local Development

```bash
npm install
npm run dev
# Runs at http://localhost:5173
```

---

## Vercel Deployment

### Push to GitHub
```bash
git init
git add .
git commit -m "Initial Crosstalk commit"
git branch -M main
git remote add origin https://github.com/yourusername/crosstalk.git
git push -u origin main
```

### Deploy
1. vercel.com → Add New Project → Import GitHub repo
2. Framework: Vite
3. Deploy

### Add Environment Variables
Vercel → Project → Settings → Environment Variables
Add all 6 variables from your .env file. Redeploy after.

### Update Supabase
Authentication → Settings → update Site URL and Redirect URLs to Vercel URL.

---

## Admin Panel Guide

Access: `/admin` — only bundepunemmanuel@gmail.com can enter. Everyone else silently redirected to dashboard.

### Analytics Dashboard
- Landing page visits: today / this week / all time
- Conversion rate: visits → signups
- Daily traffic chart
- Total users, active subscribers, monthly revenue

### User Management
- Search user by email
- View conversion count and subscription status
- Activate or deactivate account instantly

### Add Credits to a User
1. Search user by email
2. Enter credit amount
3. Click "Add Credits"
4. Applied instantly — user can convert without subscribing

### Deactivate Account
Click "Deactivate" next to any user → is_subscribed = false → immediate paywall.

---

## Credits System Guide

- Subscribed users → unlimited (credits ignored)
- Unsubscribed + credits → 1 credit per conversion
- Unsubscribed + 0 credits → paywall shown

Use cases: reward early users, influencer access, refund alternative, bug reporters.

To give all new signups 5 free credits by default:
```sql
ALTER TABLE public.profiles ALTER COLUMN credits SET DEFAULT 5;
```

---

## Switching to Lemon Squeezy

Only 2 files to change:

### Step 1: Add env variables
```env
VITE_LEMONSQUEEZY_API_KEY=your_key
VITE_LEMONSQUEEZY_STORE_ID=your_store_id
VITE_LEMONSQUEEZY_VARIANT_ID=your_variant_id
```

### Step 2: Update `src/services/payment.js`
Replace NowPayments functions with:
```js
export const createCheckout = async (userEmail) => {
  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_LEMONSQUEEZY_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: { email: userEmail },
        },
        relationships: {
          store: { data: { type: 'stores', id: import.meta.env.VITE_LEMONSQUEEZY_STORE_ID }},
          variant: { data: { type: 'variants', id: import.meta.env.VITE_LEMONSQUEEZY_VARIANT_ID }},
        },
      },
    }),
  });
  const data = await res.json();
  return data.data.attributes.url;
};
```

### Step 3: Update `api/webhook.js`
Replace IPN verification with Lemon Squeezy signature verification using `crypto` and your LS webhook secret.

### Step 4: Add new env vars to Vercel → Redeploy

---

## Switching to SMTP Email

1. Supabase → Settings → Auth → SMTP Settings → Enable
2. Recommended: Brevo (brevo.com) — free 300 emails/day
3. Fill in Brevo SMTP credentials:
   - Host: smtp-relay.brevo.com
   - Port: 587
   - Username: your Brevo email
   - Password: your Brevo SMTP key

---

## Changing the AI Model

Open `src/services/groq.js` and change:
```js
model: "llama-3.1-8b-instant"
```

Options:
- `llama-3.1-8b-instant` — fastest (default)
- `llama3-70b-8192` — smarter, slower
- `mixtral-8x7b-32768` — good for long threads

---

Built by bundepunemmanuel@gmail.com
