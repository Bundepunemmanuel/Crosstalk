import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from './auth'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError('')
    const { data, error: err } = await signUp(email, password)
    setLoading(false)
    if (err) { setError(err.message); return }

    // If email confirmation is required, show success message
    if (data?.user && !data?.session) {
      setSuccess(true)
    } else {
      navigate('/dashboard')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark-900 bg-mesh flex flex-col items-center justify-center px-4">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h7M2 8h12M7 12h7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white text-lg">Crosstalk</span>
        </Link>
        <div className="w-full max-w-sm">
          <div className="card glow-border text-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-display font-bold text-white text-2xl mb-2">Check your email</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-2">
              We sent a verification link to
            </p>
            <p className="text-violet-300 text-sm font-mono mb-5">{email}</p>
            <p className="text-white/30 text-xs leading-relaxed mb-6">
              Click the link in your email to verify your account, then come back and sign in.
            </p>
            <Link to="/login" className="btn-primary w-full block text-center py-3">
              Go to Sign In
            </Link>
            <p className="text-white/20 text-xs mt-4">
              Didn't get it? Check your spam folder.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh flex flex-col items-center justify-center px-4">
      <Link to="/" className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h7M2 8h12M7 12h7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-display font-bold text-white text-lg">Crosstalk</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="card glow-border">
          <h1 className="font-display font-bold text-2xl text-white mb-1">Create your account</h1>
          <p className="text-white/40 text-sm mb-8">Start with 5 free credits — no payment needed</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()}
                  placeholder="Min. 6 characters"
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Free credits badge */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1l1.56 3.17L12 4.73l-2.5 2.44.59 3.44L7 8.9l-3.09 1.71.59-3.44L2 4.73l3.44-.56L7 1z" fill="#8b5cf6"/>
              </svg>
              <p className="text-violet-300 text-xs">You get <span className="font-bold">5 free credits</span> when you sign up</p>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <p className="text-center text-white/20 text-xs mt-5 leading-relaxed">
            By signing up you agree to our terms of service.<br/>
            Fair use: up to 500 conversions/month.
          </p>

          <p className="text-center text-white/30 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
