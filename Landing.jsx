import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import DemoBox from './DemoBox'
import { recordPageVisit } from './supabase'

const steps = [
  {
    num: '01',
    title: 'Paste your thread',
    desc: 'Copy your X thread and paste it. No links, no setup — just raw text.'
  },
  {
    num: '02',
    title: 'AI rewrites it',
    desc: 'Our AI detects your tone, preserves your voice, and rewrites natively for each platform.'
  },
  {
    num: '03',
    title: 'Post everywhere',
    desc: 'Copy your LinkedIn post and Reddit post in one click. Done in seconds.'
  }
]

const testimonials = [
  {
    text: "I was spending 30 minutes manually rewriting each thread. Crosstalk does it in 10 seconds and the output actually sounds like me.",
    name: "Alex K.",
    role: "Indie hacker, $4k MRR"
  },
  {
    text: "The Reddit subreddit suggestions alone are worth $12. I had no idea where to post and now my threads get real traction.",
    name: "Sarah M.",
    role: "Solopreneur"
  },
  {
    text: "Every other tool made my LinkedIn posts sound like a press release. Crosstalk keeps my voice. That's all I needed.",
    name: "James T.",
    role: "Builder, 12k followers"
  }
]

const valueProps = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm-.5 3v4.25l3.5 2.1-.75 1.25-4.25-2.55V7h1.5z" fill="#8b5cf6"/>
      </svg>
    ),
    title: 'Saves you 30 min per thread',
    desc: 'Stop rewriting manually. Paste once, get two platform-native posts in under 10 seconds.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M9 12l2 2 4-4m-4-6a9 9 0 11-3.536 17.243A9 9 0 0111 2z" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Sounds like you, not a bot',
    desc: 'Voice preservation means your output sounds like you on your best writing day. Not generic. Not corporate.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13 7H7m6 4H7m4 4H7M5 3h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Reddit posts that don\'t get removed',
    desc: 'Most tools write Reddit posts that smell like ads. Ours are written to fit each community — and actually get upvotes.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10h14M10 3l7 7-7 7" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Double your content reach',
    desc: 'One thread becomes three posts: X, LinkedIn, Reddit. Same effort. 3x the audience.'
  },
]

const comparisonRows = [
  { feature: 'Sounds like you (voice preservation)', us: true, them: false },
  { feature: 'Tone detection', us: true, them: false },
  { feature: 'Smart subreddit suggestions', us: true, them: false },
  { feature: 'Reddit posts that don\'t get flagged', us: true, them: false },
  { feature: 'Unlimited conversions', us: true, them: false },
  { feature: 'Built for indie hackers', us: true, them: false },
]

export default function Landing({ user }) {
  useEffect(() => {
    recordPageVisit()
  }, [])

  return (
    <div className="min-h-screen bg-dark-900 noise-bg">
      <Navbar user={user} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse-slow"></span>
            Built for indie hackers & solopreneurs
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-white leading-[1.05] mb-6">
            Your X threads deserve<br/>
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              a bigger audience
            </span>
          </h1>

          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            Turn any X thread into a scroll-stopping LinkedIn post and an authentic Reddit post — in 10 seconds. Our AI detects your tone and keeps your voice.
          </p>

          {/* Value prop pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {['Saves 30 min per thread', 'Sounds like you', 'Subreddit suggestions', 'Unlimited conversions'].map(v => (
              <span key={v} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                ✓ {v}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link to="/signup" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
              Get Started — $12/month
            </Link>
            <a href="#demo" className="btn-ghost text-base px-8 py-3.5 w-full sm:w-auto">
              Try free demo ↓
            </a>
          </div>
          <p className="text-white/25 text-sm">Unlimited conversions. No credits. Cancel anytime.</p>
        </div>
      </section>

      {/* ── Value Proposition ────────────────────────────── */}
      <section className="py-16 px-4 border-y border-white/5 bg-dark-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
              Stop leaving reach on the table
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              You already wrote the thread. Most indie hackers stop there. Crosstalk turns that one piece of content into three posts across three platforms — in seconds.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valueProps.map((v, i) => (
              <div key={i} className="bg-dark-800 border border-white/5 rounded-2xl p-5 hover:border-violet-500/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-display font-semibold text-white text-sm mb-2 leading-snug">{v.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* The math */}
          <div className="mt-10 p-6 rounded-2xl bg-violet-600/5 border border-violet-500/15 text-center">
            <p className="text-white/60 text-sm mb-3">The simple math:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 font-display font-bold text-lg">
              <span className="text-white/40">1 thread written</span>
              <span className="text-violet-400 text-2xl">→</span>
              <span className="text-white">3 platform-native posts</span>
              <span className="text-violet-400 text-2xl">→</span>
              <span className="text-green-400">3× the reach</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Demo ────────────────────────────────────── */}
      <section id="demo" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
              See it work right now
            </h2>
            <p className="text-white/40 text-base">
              Paste any X thread and get your LinkedIn + Reddit posts instantly. Free, no signup needed.
            </p>
          </div>
          <DemoBox user={user} />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">How it works</h2>
            <p className="text-white/40">Three steps. Ten seconds. Done.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(step => (
              <div key={step.num} className="bg-dark-800 border border-white/5 rounded-2xl p-6 hover:border-violet-500/20 transition-all duration-300 group">
                <div className="font-mono text-violet-500/60 text-sm mb-4 group-hover:text-violet-400 transition-colors">{step.num}</div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Features ──────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
              The AI that gets your voice
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Most repurposing tools just reformat your content. Crosstalk rewrites it like you would — if you had unlimited time and energy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-dark-800 border border-violet-500/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2a7 7 0 100 14A7 7 0 009 2zm0 2a5 5 0 110 10A5 5 0 019 4zm0 2a1 1 0 00-1 1v2.586l-1.707 1.707a1 1 0 001.414 1.414L9.707 11A1 1 0 0010 10.293V9a1 1 0 00-1-1z" fill="#8b5cf6"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-3">Tone detection</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Motivational thread? Vulnerable story? Big win? The AI reads your energy and matches it in every output.
              </p>
              <div className="space-y-2">
                {[
                  ['Motivational', 'Quiet power & conviction'],
                  ['Struggle/failure', 'Raw honesty & resilience'],
                  ['Win/milestone', 'Humble confidence'],
                  ['Technical', 'Clear & insightful'],
                ].map(([tone, result]) => (
                  <div key={tone} className="flex items-center justify-between text-xs">
                    <span className="text-white/40 font-mono">{tone}</span>
                    <span className="text-violet-300">→ {result}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 5h12M3 9h8M3 13h5" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-3">Voice preservation</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Your output sounds like you on your best day. We amplify your voice — never replace it with generic AI tone.
              </p>
              <div className="bg-dark-700 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-white/30 font-mono mb-2">Example output style:</p>
                <p className="text-white/70 text-xs leading-relaxed italic">
                  "14 months.<br/>
                  Not 2 weeks like the success stories.<br/><br/>
                  Month 1-6: silence. Zero users.<br/>
                  Month 14: $1k MRR.<br/><br/>
                  Most people quit in month 3.<br/>
                  That's why month 14 feels so quiet."
                </p>
              </div>
            </div>

            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="#8b5cf6" strokeWidth="1.5"/>
                  <path d="M6 9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3" stroke="#8b5cf6" strokeWidth="1.2" strokeLinecap="round"/>
                  <circle cx="9" cy="9" r="1" fill="#8b5cf6"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-3">Smart subreddit matching</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Get 3 ranked subreddit suggestions. Primary + 2 alternatives. Never wonder where to post again.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-mono">🎯 r/SideProject</span>
                  <span className="text-xs text-white/25">primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 font-mono">r/entrepreneur</span>
                  <span className="text-xs text-white/25">alt 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 font-mono">r/indiehackers</span>
                  <span className="text-xs text-white/25">alt 2</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 9h14M9 2l7 7-7 7" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-3">Truly unlimited</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                No credits. No daily caps. No mental overhead. Convert as many threads as you want, every single day.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full" style={{width:'100%'}}></div>
                </div>
                <span className="text-xs text-violet-300 font-mono">∞</span>
              </div>
              <p className="text-xs text-white/25 mt-2">Unlimited conversions included</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison ───────────────────────────────────── */}
      <section className="py-16 px-4 bg-dark-800/30">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-white mb-3">
              Why not just use another tool?
            </h2>
            <p className="text-white/40 text-sm">Most repurposing tools reformat. Crosstalk rewrites.</p>
          </div>

          <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 border-b border-white/5 px-6 py-3">
              <span className="text-white/30 text-xs font-mono uppercase tracking-wider">Feature</span>
              <span className="text-violet-400 text-xs font-mono uppercase tracking-wider text-center">Crosstalk</span>
              <span className="text-white/30 text-xs font-mono uppercase tracking-wider text-center">Others</span>
            </div>
            {comparisonRows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 px-6 py-3.5 items-center ${i < comparisonRows.length - 1 ? 'border-b border-white/5' : ''}`}>
                <span className="text-white/60 text-sm">{row.feature}</span>
                <div className="flex justify-center">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 4-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M3 3l4 4M7 3l-4 4" stroke="#ffffff30" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Simple pricing</h2>
          <p className="text-white/40 mb-10">One plan. Everything included. No surprises.</p>

          <div className="bg-dark-800 border border-violet-500/30 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative">
              <div className="flex items-end justify-center gap-1 mb-1">
                <span className="text-5xl font-display font-bold text-white">$12</span>
                <span className="text-white/40 mb-2">/month</span>
              </div>
              <p className="text-white/30 text-sm mb-8">Paid in USDT · Cancel anytime</p>

              <ul className="text-left space-y-3 mb-8">
                {[
                  'Unlimited conversions',
                  'LinkedIn post generation',
                  'Reddit post + subreddit suggestions',
                  'Tone detection & voice preservation',
                  'Full conversion history',
                  'Priority support'
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l4 4 6-7" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="btn-primary w-full block text-center py-3.5">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-white mb-3">What builders say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-dark-800 border border-white/5 rounded-2xl p-6 hover:border-violet-500/20 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="12" height="12" viewBox="0 0 12 12" fill="#8b5cf6">
                      <path d="M6 1l1.24 3.8H11L8.12 6.9l1.24 3.8L6 8.6l-3.36 2.1L3.88 6.9 1 4.8h3.76L6 1z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-white/30 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Start repurposing today
          </h2>
          <p className="text-white/40 mb-3">Your threads are already written. Let them work harder.</p>
          <p className="text-white/25 text-sm mb-8">Join indie hackers turning one thread into three posts — every day.</p>
          <Link to="/signup" className="btn-primary text-base px-10 py-4 inline-block">
            Get Started — $12/month
          </Link>
          <p className="text-white/20 text-xs mt-4">Unlimited · No credits · Cancel anytime</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
