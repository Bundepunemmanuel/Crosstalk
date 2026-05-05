import { useState } from 'react'

const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 text-white/60 hover:text-violet-300 transition-all duration-200">
      {copied ? (
        <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Copied!</>
      ) : (
        <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1 8V2a1 1 0 011-1h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>{label}</>
      )}
    </button>
  )
}

export default function OutputTabs({ output }) {
  const [activeTab, setActiveTab] = useState('reddit')

  if (!output) return null

  const hasLinkedin = output.linkedin && output.linkedin.length > 0
  const hasReddit = output.redditBody && output.redditBody.length > 0

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-dark-800">
      {/* Tab headers */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('linkedin')}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all duration-200 ${activeTab === 'linkedin' ? 'text-violet-400 border-b-2 border-violet-500 bg-violet-500/5' : 'text-white/40 hover:text-white/70 border-b-2 border-transparent'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </button>
        <button
          onClick={() => setActiveTab('reddit')}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all duration-200 ${activeTab === 'reddit' ? 'text-violet-400 border-b-2 border-violet-500 bg-violet-500/5' : 'text-white/40 hover:text-white/70 border-b-2 border-transparent'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm5 11.5a3 3 0 01.08.7c0 2.5-2.9 4.5-6.5 4.5S4.5 16.7 4.5 14.2c0-.24.03-.47.08-.7A1.5 1.5 0 016.9 11.2c.9-.58 2.1-.95 3.4-.99l.77-3.57a.37.37 0 01.44-.28l2.5.52a1.1 1.1 0 012.09.55 1.1 1.1 0 01-2.2 0l-2.2-.46-.66 3.07c1.27.05 2.42.43 3.29 1a1.5 1.5 0 012.67 1.46z" fill="white"/></svg>
          Reddit
        </button>
      </div>

      {/* LinkedIn Tab */}
      {activeTab === 'linkedin' && (
        <div className="p-5 animate-fade-in">
          {hasLinkedin ? (
            <>
              <div className="flex justify-end mb-3">
                <CopyButton text={output.linkedin} label="Copy post" />
              </div>
              <div className="bg-dark-700 rounded-xl p-4 border border-white/5">
                <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">{output.linkedin}</p>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-white/30 text-sm">LinkedIn output not available. Try converting again.</p>
            </div>
          )}
        </div>
      )}

      {/* Reddit Tab */}
      {activeTab === 'reddit' && (
        <div className="p-5 animate-fade-in space-y-4">
          {hasReddit ? (
            <>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-2">Suggested Subreddits</p>
                <div className="flex flex-wrap gap-2">
                  {output.redditSubredditPrimary && (
                    <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-mono">🎯 {output.redditSubredditPrimary}</span>
                  )}
                  {output.redditSubredditAlt1 && (
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-mono">{output.redditSubredditAlt1}</span>
                  )}
                  {output.redditSubredditAlt2 && (
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-mono">{output.redditSubredditAlt2}</span>
                  )}
                </div>
              </div>
              {output.redditTitle && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Title</p>
                    <CopyButton text={output.redditTitle} label="Copy title" />
                  </div>
                  <div className="bg-dark-700 rounded-xl p-4 border border-white/5">
                    <p className="text-white font-semibold text-sm">{output.redditTitle}</p>
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Post Body</p>
                  <CopyButton text={output.redditBody} label="Copy body" />
                </div>
                <div className="bg-dark-700 rounded-xl p-4 border border-white/5">
                  <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">{output.redditBody}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <CopyButton text={`Title: ${output.redditTitle}\n\n${output.redditBody}`} label="Copy all" />
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-white/30 text-sm">Reddit output not available. Try converting again.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
