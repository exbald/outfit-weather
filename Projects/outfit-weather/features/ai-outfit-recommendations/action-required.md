# Action Required: AI-Powered Outfit Recommendations

Manual steps needed for this feature.

## Setup (Before Implementation)

- [ ] **Get OpenRouter API Key**
  1. Go to https://openrouter.ai
  2. Sign up / log in
  3. Go to Keys section
  4. Create new API key
  5. Copy the key (starts with `sk-or-...`)

- [ ] **Add API Key to Environment**
  1. Create `.env` file in project root (if not exists)
  2. Add: `VITE_OPENROUTER_KEY=sk-or-your-key-here`
  3. Restart dev server (`npm run dev`)

## During Implementation

- [x] **Verify .gitignore** - Ensure `.env` is listed to prevent key exposure

## After Implementation

- [ ] **Test API Connection**
  - Open app, trigger outfit recommendation
  - Check Network tab for `openrouter.ai` request
  - Verify response returns valid JSON

- [ ] **Monitor Usage**
  - Check OpenRouter dashboard for API usage
  - Verify cost is ~$0.0001 per request

---

## Notes

- API key will be visible in browser Network tab (expected for client-side apps)
- For production with many users, consider adding a backend proxy
- Free tier on OpenRouter should be sufficient for personal use
