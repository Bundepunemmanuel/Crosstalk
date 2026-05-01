// ============================================================
// PAYMENT SERVICE — NowPayments
// To switch to Lemon Squeezy: replace functions below only.
// See README.md → "Switching to Lemon Squeezy" for full guide.
// ============================================================

const NOWPAYMENTS_API = 'https://api.nowpayments.io/v1'

export const createInvoice = async (userEmail, userId) => {
  const response = await fetch(`${NOWPAYMENTS_API}/invoice`, {
    method: 'POST',
    headers: {
      'x-api-key': import.meta.env.VITE_NOWPAYMENTS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_amount: 12,
      price_currency: 'usd',
      pay_currency: 'usdttrc20',
      order_id: `${userId}-${Date.now()}`,
      order_description: 'Crosstalk Monthly Subscription',
      ipn_callback_url: `${window.location.origin}/api/webhook`,
      success_url: `${window.location.origin}/dashboard?payment=success`,
      cancel_url: `${window.location.origin}/pricing?payment=cancelled`,
      customer_email: userEmail,
    })
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Failed to create payment')
  }

  const data = await response.json()
  // Return invoiceUrl so Pricing.jsx destructure works
  return { invoiceUrl: data.invoice_url }
}

export const getPaymentStatus = async (paymentId) => {
  const response = await fetch(`${NOWPAYMENTS_API}/payment/${paymentId}`, {
    headers: { 'x-api-key': import.meta.env.VITE_NOWPAYMENTS_API_KEY }
  })
  const data = await response.json()
  return data.payment_status
}
