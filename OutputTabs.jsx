import { useState } from 'react'

const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 text-white/60 hover:text-violet-300 transition-all duration-200"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1 8V2a1 1 0 011-1h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

export default function OutputTabs({ output, blurred = false }) {
  const [activeTab, setActiveTab] = useState('linkedin')

  const tabs = [
    { id: 'linkedin', label: 'LinkedIn', icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    )},
    { id: 'reddit', label: 'Reddit', icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm5.16 11.75a3.47 3.47 0 01.09.78c0 2.5-2.91 4.53-6.5 4.53S4.25 17.03 4.25 14.53c0-.27.03-.53.09-.78a1.5 1.5 0 01-.84-1.31 1.5 1.5 0 012.6-1.03c.9-.58 2.1-.95 3.4-.99l.77-3.57a.37.37 0 01.44-.28l2.5.52a1.13 1.13 0 011.06-.73 1.13 1.13 0 010 2.25 1.12 1.12 0 01-1.1-.9l-2.22-.46-.66 3.07c1.27.05 2.42.43 3.29 1a1.5 1.5 0 012.59 1.03 1.5 1.5 0 01-.81 1.4z" fill="white"/>
      </svg>
    )},
  ]

  return (
    <div className={`rounded-2xl border border-white/10 overflow-hidden bg-dark-800 ${blurred ? 'blur-output' : ''}`}>
      {/* Tab headers */}
      <div className="flex border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !blurred && setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-violet-400 border-b-2 border-violet-500 bg-violet-500/5'
                : 'text-white/40 hover:text-white/70 border-b-2 border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* LinkedIn Tab */}
      {activeTab === 'linkedin' && (
        <div className="p-5 animate-fade-in">
          <div className="flex justify-end mb-3">
            <CopyButton text={output.linkedin} label="Copy post" />
          </div>
          <div className="bg-dark-700 rounded-xl p-4 border border-white/5">
            <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap font-body">
              {output.linkedin}
            </p>
          </div>
        </div>
      )}

      {/* Reddit Tab */}
      {activeTab === 'reddit' && (
        <div className="p-5 animate-fade-in space-y-4">
          {/* Subreddit suggestions */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-2">Suggested Subreddits</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-mono">
                🎯 {output.redditSubredditPrimary}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-mono">
                {output.redditSubredditAlt1}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-mono">
                {output.redditSubredditAlt2}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Title</p>
              <CopyButton text={output.redditTitle} label="Copy title" />
            </div>
            <div className="bg-dark-700 rounded-xl p-4 border border-white/5">
              <p className="text-white font-semibold text-sm">{output.redditTitle}</p>
            </div>
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Post Body</p>
              <CopyButton text={output.redditBody} label="Copy body" />
            </div>
            <div className="bg-dark-700 rounded-xl p-4 border border-white/5">
              <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap font-body">
                {output.redditBody}
              </p>
            </div>
          </div>

          {/* Copy all */}
          <div className="flex justify-end">
            <CopyButton
              text={`Title: ${output.redditTitle}\n\n${output.redditBody}`}
              label="Copy all"
            />
          </div>
        </div>
      )}
    </div>
  )
}
