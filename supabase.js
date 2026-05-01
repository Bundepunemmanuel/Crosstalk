import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Record page visit
export const recordPageVisit = async () => {
  try {
    await supabase.from('page_visits').insert({
      user_agent: navigator.userAgent,
      visited_at: new Date().toISOString(),
    })
  } catch (e) {
    // Silent fail
  }
}

// Check if IP has used demo
export const checkDemoLimit = async (ip) => {
  const { data } = await supabase
    .from('demo_conversions')
    .select('id')
    .eq('ip_address', ip)
    .limit(1)
  return !(data && data.length > 0) // true = allowed
}

// Record demo usage
export const recordDemoUsage = async (ip) => {
  await supabase.from('demo_conversions').insert({ ip_address: ip })
}

// Get user profile
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

// Save conversion
export const saveConversion = async (userId, conversionData) => {
  const { data, error } = await supabase
    .from('conversions')
    .insert({ user_id: userId, ...conversionData })
    .select()
    .single()
  return { data, error }
}

// Get user conversions
export const getUserConversions = async (userId) => {
  const { data, error } = await supabase
    .from('conversions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

// Get page visit stats for admin
export const getPageVisitStats = async () => {
  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString()
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [total, today, week] = await Promise.all([
    supabase.from('page_visits').select('id', { count: 'exact', head: true }),
    supabase.from('page_visits').select('id', { count: 'exact', head: true }).gte('visited_at', todayStart),
    supabase.from('page_visits').select('id', { count: 'exact', head: true }).gte('visited_at', weekStart),
  ])

  return {
    total: total.count || 0,
    today: today.count || 0,
    week: week.count || 0,
  }
}

// Set user subscribed status
export const setUserSubscribed = async (userId, subscribed) => {
  const { error } = await supabase.from('profiles').update({
    is_subscribed: subscribed,
    subscription_date: subscribed ? new Date().toISOString() : null,
    subscription_expires: subscribed
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null,
  }).eq('id', userId)
  return { error }
}
