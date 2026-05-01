import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import OutputTabs from './OutputTabs'
import { convertThread } from './groq'
import { saveConversion, getProfile } from './supabase'

export default function Dashboard({ user }) {
  const [text, setText] = useState('')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      getProfile(user.id).then(({ data }) => setProfile(data))
    }
  }, [user])

  const canConvert = profile?.is_subscribed || (profile?.credits > 0)

  const handleConvert = async () => {
    if (!text.trim()) { setError('Paste your X thread first.'); return }
    if (!canConvert) return
    setError('')
    setLoading(true)
    setSaved(false)

    try {
      const result = await convertThread(text)
      setOutput(result)

      await saveConversion(user.id, {
        input_text: text,
        linkedin_output: result.linkedin,
        reddit_subreddit_primary: result.redditSubredditPrimary,
        reddit_subreddit_alt1: result.redditSubredditAlt1,
        reddit_subreddit_alt2: result.redditSubredditAlt2,
        reddit_title: result.redditTitle,
        reddit_body: result.redditBody,
      })
      setSaved(true)

      if (!profile?.is_subscribed && profile?.credits > 0) {
        setProfile(p => ({ ...p, credits: p.credits - 1 }))
      }
    } catch (err) {
      setError('Conversion failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-1">Convert a thread</h1>
          <p className="text-white/40 text-sm">Paste your X thread and get LinkedIn + Reddit posts instantly.</p>
        </div>

        {/* Status bar */}
        {profile && (
          <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-dark-800 border border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${profile.is_subscribed ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span className="text-sm text-white/60">
                {profile.is_subscribed
                  ? 'Active subscription — unlimited conversions'
                  : profile.credits > 0
                  ? `${profile.credits} credits remaining`
                  : 'No active subscription'}
              </span>
            </div>
            {!profile.is_subscribed && (
              <Link to="/pricing" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Subscribe →
              </Link>
            )}
          </div>
        )}

        {/* Paywall */}
        {profile && !canConvert && (
          <div className="card glow-border text-center py-12 mb-8">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 1l2.39 4.84L18 6.91l-4 3.9.94 5.5L10 13.77l-4.94 2.54L6 10.81 2 6.91l5.61-.67L10 1z" fill="#8b5cf6"/>
              </svg>
            </div>
            <h3 className="font-display font-bold text-white text-xl mb-2">Subscribe to convert</h3>
            <p className="text-white/40 text-sm mb-6 max-w-xs mx-auto">Get unlimited conversions for $12/month.</p>
            <Link to="/pricing" className="btn-primary inline-block">Subscribe — $12/month</Link>
          </div>
        )}

        {/* Input */}
        {canConvert && (
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Your X Thread</p>
              {saved && (
                <span className="text-xs text-green-400/70 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 5l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </svg>
                  Saved to history
                </span>
              )}
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your X thread here..."
              rows={9}
              className="input-field resize-none text-sm leading-relaxed"
              maxLength={5000}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-white/20 font-mono">{text.length}/5000</span>
              <button
                onClick={handleConvert}
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Converting...
                  </>
                ) : 'Convert →'}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Your output</p>
              <button
                onClick={() => { setOutput(null); setText(''); setSaved(false) }}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Clear
              </button>
            </div>
            <OutputTabs output={output} />
          </div>
        )}
      </main>
    </div>
  )
}
