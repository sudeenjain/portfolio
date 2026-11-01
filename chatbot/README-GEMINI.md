# SJ Bot — Gemini setup (GitHub Pages)

How it works
- `knowledge-base.js` holds everything about Sudeen (generated from `data/portfolio-data.js`).
- Without Gemini, the widget answers from that knowledge by itself (works offline, free).
- With Gemini, free-text questions go to a small proxy (`gemini-proxy/worker.js`) that holds
  your API key, adds the knowledge, and tells Gemini to answer ONLY from it.
  Quick-reply chips, greetings and the contact/resume cards always use the built-in answers.
- If the proxy or Gemini fails, the widget silently falls back to the built-in answers.

Why a proxy? GitHub Pages is static. A key placed in `sudeen-chatbot.js` would be visible to
everyone who opens the site. Never put the key in any file in this repo.

## 1. Deploy the proxy (Cloudflare Workers — free)
1. Create a free account at dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker**
   (use the "Hello World" template), name it e.g. `sj-bot`, click **Deploy**.
2. Click **Edit code**, delete everything, paste the full contents of `gemini-proxy/worker.js`, click **Deploy**.
3. Worker → **Settings → Variables and Secrets** → **Add**:
   - Type **Secret**, name `GEMINI_API_KEY`, value = your key from Google AI Studio.
   - (optional) Type **Text**, name `GEMINI_MODEL` — default is `gemini-3.5-flash`.
     If Google retires that name, set another current Flash model here; no code change needed.
   - (optional) Type **Text**, name `ALLOWED_ORIGINS` — default allows
     `https://sudeenjain.github.io` and localhost (ports 5500 / 8000). If you use a custom domain,
     set e.g. `https://sudeenjain.github.io,https://www.yourdomain.com`.
4. Copy the Worker URL (looks like `https://sj-bot.<your-name>.workers.dev`).

## 2. Connect the widget
Open `chatbot/sudeen-chatbot.js`, find `CONFIG` near the "KNOWLEDGE BASE" section and set:

    geminiProxyUrl: 'https://sj-bot.<your-name>.workers.dev',

Commit and push to GitHub. Done — no other page needs editing.

## 3. Updating the bot's knowledge
After changing `data/portfolio-data.js` (or the `EXTRAS` block at the top of `build-knowledge.js`):

    node chatbot/build-knowledge.js

This rewrites `knowledge-base.js` and `gemini-proxy/worker.js`. Push to GitHub, then paste the new
`worker.js` into the Cloudflare editor and Deploy again.
(Edit `gemini-proxy/worker.template.js` for prompt changes — never edit `worker.js` directly.)

## Protect your key / quota
- In Google AI Studio keep the key on a project with a quota or budget limit.
- In Cloudflare: Security → WAF → Rate limiting rules (e.g. 30 requests / minute / IP) for extra safety.
- If the key ever leaks, create a new one and update the `GEMINI_API_KEY` secret.

## Files
- `sudeen-chatbot.js` — the widget (UI + local answers + Gemini call)
- `knowledge-base.js` — generated knowledge (do not edit by hand)
- `build-knowledge.js` — generator
- `gemini-proxy/` — Cloudflare Worker (`worker.template.js` source, `worker.js` generated)
- `chatbot-engine.js` — old unused engine (no page loads it; safe to delete)

## Voice
- Speech is cleaned before it is read: links, emails, phone numbers, emojis and symbols are skipped,
  long answers are shortened, and "The full details are shown on screen." is added. Text on screen is unchanged.
- The bot prefers a natural male English voice (India, then UK, then US). Voices come from the visitor's
  device, so availability differs (Edge/Windows has the best natural male voices).
- Speaker button: mutes/unmutes voice and sounds, stops speech instantly, and remembers the choice.
- Pick a voice manually: in the browser console run `SudeenChatbot.voices()` to list them, then
  `SudeenChatbot.setVoice('Microsoft Ryan Online (Natural) - English (United Kingdom)')`.
- Defaults live in `CONFIG` in `sudeen-chatbot.js`: `voiceOnByDefault`, `voiceName`, `voiceRate`, `maxSpokenChars`.
