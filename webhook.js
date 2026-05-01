import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const ipnSecret = process.env.VITE_NOWPAYMENTS_IPN_KEY
    const receivedSignature = req.headers['x-nowpayments-sig']
    if (!receivedSignature) return res.status(400).json({ error: 'Missing signature' })

    const sortedBody = sortObject(req.body)
    const hmac = crypto.createHmac('sha512', ipnSecret).update(JSON.stringify(sortedBody)).digest('hex')
    if (hmac !== receivedSignature) return res.status(401).json({ error: 'Invalid signature' })

    const { payment_status, order_id } = req.body

    // order_id format: userId-timestamp (dash separator)
    const userId = order_id?.split('-')[0]
    if (!userId) return res.status(400).json({ error: 'Invalid order_id' })

    if (payment_status === 'finished' || payment_status === 'confirmed') {
      await supabase.from('profiles').update({
        is_subscribed: true,
        subscription_date: new Date().toISOString(),
        subscription_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        nowpayments_payment_id: String(req.body.payment_id || ''),
      }).eq('id', userId)
    }

    if (payment_status === 'failed' || payment_status === 'expired') {
      await supabase.from('profiles').update({ is_subscribed: false }).eq('id', userId)
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function sortObject(obj) {
  return Object.keys(obj).sort().reduce((result, key) => {
    result[key] = obj[key] && typeof obj[key] === 'object' ? sortObject(obj[key]) : obj[key]
    return result
  }, {})
}
