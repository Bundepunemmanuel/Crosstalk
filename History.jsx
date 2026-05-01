import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import OutputTabs from './OutputTabs'
import { getUserConversions } from './supabase'

export default function History({ user }) {
  const [conversions, setConversions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (user) {
      getUserConversions(user.id).then(({ data }) => {
        setConversions(data || [])
        setLoading(false)
      })
    }
  }, [user])

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const truncate = (str, n = 80) => str?.length > n ? str.slice(0, n) + '...' : str

  const selectedOutput = selected ? {
    linkedin: selected.linkedin_output,
    redditSubredditPrimary: selected.reddit_subreddit_primary,
    redditSubredditAlt1: selected.reddit_subreddit_alt1,
    redditSubredditAlt2: selected.reddit_subreddit_alt2,
    redditTitle: selected.reddit_title,
    redditBody: selected.reddit_body,
  } : null

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh">
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-1">History</h1>
          <p className="text-white/40 text-sm">All your past conversions, saved automatically.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <svg className="animate-spin w-6 h-6 text-violet-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        ) : conversions.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-white/30 text-sm">No conversions yet. Go convert your first thread!</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* List */}
            <div className="space-y-3">
              {conversions.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                  className={`w-full text-left card hover:border-violet-500/20 transition-all duration-200 ${
                    selected?.id === c.id ? 'border-violet-500/40 bg-violet-500/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-sm leading-relaxed truncate">
                        {truncate(c.input_text)}
                      </p>
                      <p className="text-white/25 text-xs mt-2 font-mono">{formatDate(c.created_at)}</p>
                    </div>
                    <svg
                      width="14" height="14" viewBox="0 0 14 14" fill="none"
                      className={`flex-shrink-0 mt-1 transition-transform duration-200 text-violet-400 ${selected?.id === c.id ? 'rotate-180' : ''}`}
                    >
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Preview panel */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {selected && selectedOutput ? (
                <div className="animate-fade-in">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Output</p>
                  <OutputTabs output={selectedOutput} />
                </div>
              ) : (
                <div className="card flex items-center justify-center py-16 border-dashed border-white/10">
                  <p className="text-white/20 text-sm">Select a conversion to preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
