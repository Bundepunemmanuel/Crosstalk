import { useState } from 'react'
import { convertThread } from './groq'
import { checkDemoLimit, recordDemoUsage } from './supabase'
import OutputTabs from './OutputTabs'
import { Link } from 'react-router-dom'

const SAMPLE_THREAD = `Just hit $1k MRR with my side project. Here's what nobody tells you about that milestone:

It took 14 months. Not 2 weeks like the Twitter success stories.

Month 1-6: Built in complete silence. Zero users. Questioned everything daily.

Month 7: First paying customer. $29. Felt like winning the lottery.

Month 8-11: Slow grind. 3-5 new users a month. Still had a day job.

Month 12: Something clicked. Word of mouth started. Didn't know why.

Month 14: $1k MRR. Quit nothing yet. But now I believe it's real.

The thing nobody says: the hardest part isn't building. It's staying consistent when nothing seems to work.

Most people quit in month 3. That's why month 14 feels so quiet.`

export default function DemoBox({ user }) {
  const [text, setText] = useState(SAMPLE_THREAD)
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoUsed, setDemoUsed] = useState(false)
  const [showWall, setShowWall] = useState(false)

  const handleConvert = async () => {
    if (!text.trim()) { setError('Paste your X thread first.'); return }
    setError('')
    setLoading(true)

    try {
      // Check demo limit by IP
      const ipRes = await fetch('https://api.ipify.org?format=json').catch(() => null)
      const ip = ipRes ? (await ipRes.json()).ip : 'unknown'

      if (!user) {
        const allowed = await checkDemoLimit(ip)
        if (!allowed) {
          setShowWall(true)
          setLoading(false)
          return
        }
      }

      const result = await convertThread(text)
      setOutput(result)

      if (!user) {
        await recordDemoUsage(ip)
        setDemoUsed(true)
      }
    } catch (err) {
      setError('Conversion failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Input area */}
      <div className="card glow-border mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Your X Thread</p>
          <button
            onClick={() => setText(SAMPLE_THREAD)}
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Load sample
          </button>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your X thread here... (tip: copy all tweets in the thread)"
          rows={8}
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
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h7M2 8h12M7 12h7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Convert Free
              </>
            )}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {/* Output */}
      {output && (
        <div className="relative animate-slide-up">
          <OutputTabs output={output} blurred={showWall} />

          {/* Signup wall overlay */}
          {(showWall || demoUsed) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-dark-900/90 backdrop-blur-sm border border-violet-500/20 p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1l2.39 4.84L18 6.91l-4 3.9.94 5.5L10 13.77l-4.94 2.54L6 10.81 2 6.91l5.61-.67L10 1z" fill="#8b5cf6"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-2">Like what you see?</h3>
              <p className="text-white/50 text-sm mb-6 max-w-xs">
                Get unlimited conversions for $12/month. No limits, no credits counter.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup" className="btn-primary text-sm">
                  Get Started — $12/mo
                </Link>
                <Link to="/login" className="btn-ghost text-sm">
                  I have an account
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show wall even before output if limit hit */}
      {showWall && !output && (
        <div className="card glow-border flex flex-col items-center justify-center py-12 text-center animate-slide-up">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 1l2.39 4.84L18 6.91l-4 3.9.94 5.5L10 13.77l-4.94 2.54L6 10.81 2 6.91l5.61-.67L10 1z" fill="#8b5cf6"/>
            </svg>
          </div>
          <h3 className="font-display font-bold text-white text-xl mb-2">You've used your free conversion</h3>
          <p className="text-white/50 text-sm mb-6 max-w-xs">
            Unlock unlimited conversions for $12/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/signup" className="btn-primary text-sm">Get Started — $12/mo</Link>
            <Link to="/login" className="btn-ghost text-sm">I have an account</Link>
          </div>
        </div>
      )}
    </div>
  )
}
