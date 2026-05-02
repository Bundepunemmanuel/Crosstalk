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

YOU MUST RESPOND IN EXACTLY THIS FORMAT WITH ALL 6 FIELDS — no intro, no explanation:

LINKEDIN_OUTPUT: [full linkedin post here]
REDDIT_SUBREDDIT_PRIMARY: r/[name]
REDDIT_SUBREDDIT_ALT1: r/[name]
REDDIT_SUBREDDIT_ALT2: r/[name]
REDDIT_TITLE: [title here]
REDDIT_BODY: [full reddit post body here]`

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
      max_tokens: 2500,
      temperature: 0.7,
      messages: [
        { role: 'system', content: MASTER_PROMPT },
        { role: 'user', content: `Convert this X thread and return ALL 6 fields:\n\n${threadText}` }
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

  const parsed = parseOutput(raw)

  // If Reddit body is empty, retry once with a stricter prompt
  if (!parsed.redditBody || parsed.redditBody.length < 20) {
    return await retryForReddit(threadText, apiKey, parsed)
  }

  return parsed
}

const retryForReddit = async (threadText, apiKey, existingParsed) => {
  const retryResponse = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: `Generate a Reddit post for this X thread. Return ONLY these 4 fields, nothing else:

REDDIT_SUBREDDIT_PRIMARY: r/[best subreddit]
REDDIT_SUBREDDIT_ALT1: r/[alternative]
REDDIT_SUBREDDIT_ALT2: r/[another alternative]
REDDIT_TITLE: [compelling title]
REDDIT_BODY: [full genuine community post, no hashtags, no emojis, end with a question]

X Thread:
${threadText}`
        }
      ]
    })
  })

  if (!retryResponse.ok) return existingParsed

  const retryData = await retryResponse.json()
  const retryRaw = retryData.choices?.[0]?.message?.content || ''
  const retryParsed = parseOutput(retryRaw)

  return {
    linkedin: existingParsed.linkedin,
    redditSubredditPrimary: retryParsed.redditSubredditPrimary || 'r/SideProject',
    redditSubredditAlt1: retryParsed.redditSubredditAlt1 || 'r/entrepreneur',
    redditSubredditAlt2: retryParsed.redditSubredditAlt2 || 'r/indiehackers',
    redditTitle: retryParsed.redditTitle || '',
    redditBody: retryParsed.redditBody || '',
  }
}

const parseOutput = (raw) => {
  const get = (key) => {
    const regex = new RegExp(
      `${key}:\\s*([\\s\\S]*?)(?=\\n(?:LINKEDIN_OUTPUT|REDDIT_SUBREDDIT_PRIMARY|REDDIT_SUBREDDIT_ALT1|REDDIT_SUBREDDIT_ALT2|REDDIT_TITLE|REDDIT_BODY):|$)`
    )
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
