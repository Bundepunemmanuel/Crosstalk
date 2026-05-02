const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const MASTER_PROMPT = `You are CrossTalk, the world's best content repurposer for indie hackers and solopreneurs.

Transform the X thread into a LinkedIn post AND a Reddit post.

TONE DETECTION:
- Motivational/inspiring → quiet confidence and forward momentum
- Technical/educational → clarity and genuine insight  
- Failure/struggle → vulnerability and raw honesty
- Win/milestone → humble pride, not arrogance
- Funny/casual → preserve the humor

VOICE PRESERVATION (critical):
- Amplify the author's voice, never replace it
- Match their energy exactly
- Output sounds like THEM on their best day

BANNED WORDS: delve, leverage, utilize, innovative, game-changer, groundbreaking, revolutionary, paradigm, synergy, robust, seamlessly, empower, transformative

LINKEDIN RULES:
- Bold hook on line 1 — never start with "I am" or "We are"
- Short paragraphs, max 2-3 lines each
- Aggressive white space
- 0-2 emojis max
- Exactly 5 relevant hashtags at end
- End with an engagement question
- 900-1200 characters sweet spot

REDDIT RULES:
- Primary subreddit: best fit
- Alt1: broader community
- Alt2: niche community
- Title: honest and curious, never clickbait
- Body: genuine community member tone
- No hashtags, no emojis ever
- End with a real discussion question

YOU MUST RESPOND IN EXACTLY THIS FORMAT — no intro text, no explanation, just this:

LINKEDIN_OUTPUT: [full linkedin post]
REDDIT_SUBREDDIT_PRIMARY: r/[name]
REDDIT_SUBREDDIT_ALT1: r/[name]
REDDIT_SUBREDDIT_ALT2: r/[name]
REDDIT_TITLE: [title]
REDDIT_BODY: [full body]`

export const convertThread = async (threadText) => {
  if (!threadText?.trim()) throw new Error('Thread text is empty')

  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('Groq API key not configured')

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 2000,
      temperature: 0.75,
      messages: [
        { role: 'system', content: MASTER_PROMPT },
        { role: 'user', content: `Convert this X thread:\n\n${threadText}` }
      ]
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content
  if (!raw) throw new Error('Empty response from AI')

  return parseOutput(raw)
}

const parseOutput = (raw) => {
  const get = (key) => {
    // Match key: then capture everything until next KEY: or end of string
    const regex = new RegExp(`${key}:\\s*([\\s\\S]*?)(?=\\n(?:LINKEDIN_OUTPUT|REDDIT_SUBREDDIT_PRIMARY|REDDIT_SUBREDDIT_ALT1|REDDIT_SUBREDDIT_ALT2|REDDIT_TITLE|REDDIT_BODY):|$)`)
    const match = raw.match(regex)
    return match ? match[1].trim() : ''
  }

  return {
    linkedin: get('LINKEDIN_OUTPUT'),
    redditSubredditPrimary: get('REDDIT_SUBREDDIT_PRIMARY'),
    redditSubredditAlt1: get('REDDIT_SUBREDDIT_ALT1'),
    redditSubredditAlt2: get('REDDIT_SUBREDDIT_ALT2'),
    redditTitle: get('REDDIT_TITLE'),
    redditBody: get('REDDIT_BODY'),
  }
}
