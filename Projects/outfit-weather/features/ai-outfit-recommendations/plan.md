# Plan: AI-Powered Outfit Recommendations

**Parent Project:** OutFitWeather
**Estimated Effort:** 2-3 hours

---

## Phase 1: Fix Temperature Unit Bug

**Priority:** Critical (blocks accurate recommendations)

### Tasks
- [x] ~~Update `src/hooks/useOutfit.ts` to import `useSettingsContext`~~ (Alternative fix: recognize API returns Celsius)
- [x] ~~Get `temperatureUnit` from settings context~~ (Fixed by using 'C' directly since API returns Celsius)
- [x] Pass correct unit to `getTemperatureBucket()` calls (lines ~79, ~100, ~120)
- [x] Test: 16°C should show "cool" bucket outfit

### Files
- `src/hooks/useOutfit.ts`

---

## Phase 2: Create OpenRouter API Client

**Priority:** High

### Tasks
- [x] Create `src/lib/openrouter.ts`
- [x] Implement `generateOutfitRecommendation(weather)` function
- [x] Add request timeout (5 seconds)
- [x] Add JSON response parsing with validation
- [ ] Add single retry on failure (not implemented)
- [x] Add TypeScript types for request/response

### Files
- `src/lib/openrouter.ts` (new)

### API Structure
```typescript
interface AIOutfitResponse {
  emojis: string      // "🧥👕👖👟"
  oneLiner: string    // "Perfect for a light jacket!"
}

async function generateOutfitRecommendation(
  temperature: number,
  temperatureUnit: 'C' | 'F',
  condition: string,
  windSpeed: number,
  uvIndex: number
): Promise<AIOutfitResponse | null>
```

---

## Phase 3: Create AI Outfit Hook

**Priority:** High

### Tasks
- [x] Create `src/hooks/useAIOutfit.ts`
- [x] Implement weather signature cache key generator
- [x] Add localStorage caching (1-hour expiry)
- [x] Handle loading/error states
- [x] Return fallback-compatible interface

### Files
- `src/hooks/useAIOutfit.ts` (new)

### Cache Key Example
```typescript
// Input: 16°C, overcast (code 3), 11 km/h wind, UV 2
// Output: "cool_3_calm_low"
function getWeatherSignature(weather): string
```

---

## Phase 4: Environment Setup

**Priority:** Medium

### Tasks
- [x] Create `.env.example` with `VITE_OPENROUTER_KEY=your_key_here`
- [ ] Add `VITE_OPENROUTER_KEY` to `.env` (gitignored) — *User action required*
- [x] Update `.gitignore` if needed to ensure `.env` is ignored

### Files
- `.env.example` (new)
- `.env` (new, gitignored)
- `.gitignore` (verify)

---

## Phase 5: Integration

**Priority:** High

### Tasks
- [x] ~~Update `src/hooks/useOutfit.ts` to try AI first~~ (Done in `App.tsx` instead - hooks compose at component level)
- [x] Implement fallback to static logic on AI failure (AI merges with static, falls back automatically)
- [x] Merge AI emojis with weather modifiers (umbrella for rain, etc.) — implemented in `App.tsx:329-342`
- [x] Test full flow: weather → AI → display

### Files
- `src/hooks/useOutfit.ts`

### Integration Logic
```typescript
// In useOutfit.ts
const aiResult = await useAIOutfit(weather)
if (aiResult) {
  return { emojis: aiResult.emojis, oneLiner: aiResult.oneLiner }
}
// Fallback to existing static logic
return staticOutfitLogic(weather)
```

---

## Phase 6: Testing & Polish

**Priority:** Medium

### Tasks
- [ ] Test with various weather conditions
- [ ] Test cache hit/miss (check Network tab)
- [ ] Test fallback by removing API key
- [ ] Test offline mode
- [ ] Verify cost per request is ~$0.0001

### Verification Checklist
- [ ] 16°C → "cool" outfit (bug fixed)
- [ ] AI response displayed correctly
- [ ] Cache prevents duplicate API calls
- [ ] Fallback works seamlessly
- [ ] No console errors in production
