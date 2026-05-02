-- ============================================================
-- CROSSTALK — Supabase SQL Setup
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Profiles table (credits DEFAULT 5 — every new user gets 5 free credits)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  is_subscribed BOOLEAN DEFAULT FALSE,
  subscription_date TIMESTAMPTZ,
  subscription_expires TIMESTAMPTZ,
  credits INTEGER DEFAULT 5,
  nowpayments_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversions table
CREATE TABLE IF NOT EXISTS public.conversions (
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

-- Demo conversions (IP limiting for free demo)
CREATE TABLE IF NOT EXISTS public.demo_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page visits (landing page analytics)
CREATE TABLE IF NOT EXISTS public.page_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Row Level Security ────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- ─── Policies ──────────────────────────────────────────────
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own conversions"
  ON public.conversions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversions"
  ON public.conversions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can insert demo conversions"
  ON public.demo_conversions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read demo conversions"
  ON public.demo_conversions FOR SELECT USING (true);

CREATE POLICY "Anyone can insert page visits"
  ON public.page_visits FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read page visits"
  ON public.page_visits FOR SELECT USING (true);

-- ─── Auto-create profile on signup with 5 FREE credits ─────
-- This trigger fires every time a new user signs up
-- It creates their profile and gives them 5 free credits automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (NEW.id, NEW.email, 5)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if it exists and recreate cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Indexes for performance ───────────────────────────────
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON public.conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON public.conversions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_conversions_ip ON public.demo_conversions(ip_address);
CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON public.page_visits(visited_at DESC);

-- ─── If you already have tables, run this to update existing users ──
-- UPDATE public.profiles SET credits = 5 WHERE credits = 0 AND is_subscribed = FALSE;
