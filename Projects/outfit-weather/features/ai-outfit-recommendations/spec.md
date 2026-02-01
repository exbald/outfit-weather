# Feature: AI-Powered Outfit Recommendations

**Project:** OutFitWeather
**Created:** 2026-02-01
**Priority:** P1
**Status:** Implemented (pending user API key setup)

## Overview

Replace static emoji/one-liner logic with AI-generated outfit recommendations that are contextually aware of weather conditions, creating more natural and varied suggestions.

Also fixes critical bug: temperature unit mismatch causing 16°C to show "Freezing temps".

## User Story

As a user, I want to see intelligent, contextual outfit suggestions so that the recommendations feel more personalized and accurate for the actual weather conditions.

## Requirements

### Must Have
- Fix temperature unit bug (16°C showing as freezing)
- Integrate OpenRouter API for AI-generated outfit suggestions
- Generate both outfit emojis and one-liner text via AI
- Fall back to static logic when AI is unavailable
- Cache AI responses to minimize API calls

### Should Have
- Use fast/cheap model (GPT-4o-mini or Claude Haiku)
- Weather-based cache key to reuse responses for similar conditions
- Seamless fallback (user shouldn't notice AI failure)

### Out of Scope
- User-configurable AI models
- Backend proxy for API key security
- User-provided API keys
- Streaming responses

## Technical Notes

### API Configuration
- **Provider:** OpenRouter
- **Model:** `openai/gpt-4o-mini` (~$0.0001/request)
- **Auth:** `VITE_OPENROUTER_KEY` environment variable
- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`

### Temperature Bug Fix
Root cause in `src/hooks/useOutfit.ts:79`:
```typescript
getTemperatureBucket(temperature, 'F')  // Always assumes Fahrenheit
```
Fix: Use `temperatureUnit` from settings context.

### Caching Strategy
Cache key format: `${tempBucket}_${weatherCode}_${windCategory}_${uvCategory}`
Example: `cool_3_calm_low`
Expiry: 1 hour

## UX Flow

1. User opens app / switches drawer view
2. System checks cache for matching weather signature
3. If cache miss: Call OpenRouter API with weather context
4. AI returns JSON: `{"emojis": "🧥👕👖👟", "oneLiner": "Perfect for a light jacket!"}`
5. System displays AI response (or static fallback on error)
6. Response cached for future similar weather

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| API key missing | Use static logic, log warning |
| API timeout (>5s) | Cancel request, use static logic |
| Invalid JSON response | Use static logic, log error |
| Rate limited | Use static logic, retry next request |
| Network offline | Use static logic (existing offline support) |

## Success Criteria

- [x] 16°C shows "cool" outfit (not freezing) — Fixed: API returns Celsius, uses 'C' unit
- [x] AI generates varied, contextual one-liners — Implemented via OpenRouter
- [x] Same weather conditions don't trigger repeat API calls — 1-hour cache via weather signature
- [x] API failures are invisible to user (fallback works) — Falls back to static outfit
- [ ] Cost stays under $0.01 for typical daily usage — Requires user testing with API key
