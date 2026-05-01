import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { createInvoice } from './payment'

export default function Pricing({ user }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async () => {
    if (!user) { navigate('/signup'); return }
    setLoading(true)
    setError('')
    try {
      const { invoiceUrl } = await createInvoice(user.email, user.id)
      window.location.href = invoiceUrl
    } catch (err) {
      setError('Failed to create payment. Please try again.')
      setLoading(false)
    }
  }

  const features = [
    'Unlimited conversions — no caps, ever',
    'LinkedIn post with tone detection',
    'Reddit post + 3 subreddit suggestions',
    'Voice preservation — sounds like you',
    'Full conversion history',
    'Priority support',
  ]

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh">
      <Navbar user={user} />

      <main className="max-w-lg mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl text-white mb-3">Simple pricing</h1>
          <p className="text-white/40">One plan. Everything included. No surprises.</p>
        </div>

        <div className="card glow-border p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative">
            <div className="flex items-end gap-1 mb-1">
              <span className="font-display font-bold text-5xl text-white">$12</span>
              <span className="text-white/40 pb-2">/month</span>
            </div>
            <p className="text-white/30 text-sm mb-8">Paid in USDT · Cancel anytime</p>

            <ul className="space-y-3 mb-8">
              {features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-5 h-5 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 4-4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating invoice...
                </span>
              ) : user ? 'Subscribe Now' : 'Sign up to Subscribe'}
            </button>

            <div className="mt-5 flex items-center gap-3 justify-center">
              <div className="flex items-center gap-1.5 text-white/25 text-xs">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 2v4l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Renewed monthly
              </div>
              <span className="text-white/10">·</span>
              <div className="flex items-center gap-1.5 text-white/25 text-xs">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M9 4L5 8M3 6l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                USDT on TRX network
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6 leading-relaxed">
          Fair use: up to 500 conversions/month.<br/>
          Need more? Contact us.
        </p>
      </main>
    </div>
  )
}
