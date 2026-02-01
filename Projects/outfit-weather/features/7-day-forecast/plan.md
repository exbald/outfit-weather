# Plan: 7-Day Weather Forecast

**Parent Project:** OutFitWeather
**Estimated Effort:** 3-4 hours

---

## Phase 1: Data Layer

### 1.1 Create day label utility
**New file**: `src/lib/dayLabels.ts`

### Tasks
- [ ] Create `getDayLabel(dayIndex, date)` → "Today", "Tomorrow", "Wed", etc.
- [ ] Create `getDayFullName(dayIndex, date)` → Full name for accessibility

### 1.2 Update openmeteo.ts

### Tasks
- [ ] Add `dayIndex` and `dayLabel` to `DailyWeatherData` interface
- [ ] Update `parseDailyForecast()` to extract 7 days as array
- [ ] Return `{ days: DailyWeatherData[], today, tomorrow }` for backward compat

### 1.3 Update useWeather.ts

### Tasks
- [ ] Change `WeatherData.daily` to array-based structure
- [ ] Add `today` and `tomorrow` as aliases for `days[0]` and `days[1]`

---

## Phase 2: Outfit Logic

### 2.1 Update useOutfit.ts

### Tasks
- [ ] Change `OutfitView` type to `'now' | number` (day index 0-6)
- [ ] Generate outfit recommendations for all 7 days in `useMemo`
- [ ] Return `{ now, days[], today, tomorrow }` structure

### 2.2 Update useAIOutfit.ts

### Tasks
- [ ] Update `getWeatherContext()` to handle days 2-6
- [ ] Include day index in cache key signature

---

## Phase 3: UI Changes

### 3.1 Update WeatherDisplay.tsx

### Tasks
- [ ] Add `nowOutfit` prop
- [ ] Add "Now" outfit section below "Updated" timestamp
- [ ] Show outfit emojis + one-liner when viewing current weather

### 3.2 Update Drawer.tsx

### Tasks
- [ ] Change drawer title to "Swipe up · 👀 What to wear"
- [ ] Remove "Now" tab from drawer
- [ ] Create 7 scrollable tabs: Today, Tomorrow, Wed, Thu, Fri, Sat, Sun
- [ ] Add horizontal scroll container for tabs
- [ ] Update `ActiveView` type to `number` only (0-6)
- [ ] Update Prev/Next navigation for 7 days

### 3.3 Update Layout.tsx

### Tasks
- [ ] Update `ActiveView` type definition
- [ ] Update outfit prop types

---

## Phase 4: App Integration

### 4.1 Update App.tsx

### Tasks
- [ ] Update state: main page always shows "now", drawer uses day index
- [ ] Pass `nowOutfit` to WeatherDisplay
- [ ] Pass `days` array to Drawer
- [ ] Update AI response merge logic for 7 days

---

## Files Changed (in order)

| Order | File | Change |
|-------|------|--------|
| 1 | `src/lib/dayLabels.ts` | New - day label utilities |
| 2 | `src/lib/openmeteo.ts` | Extract 7 days, add dayLabel |
| 3 | `src/hooks/useWeather.ts` | Array-based daily structure |
| 4 | `src/hooks/useOutfit.ts` | Generate 7 outfit recommendations |
| 5 | `src/hooks/useAIOutfit.ts` | Support day indices 2-6 |
| 6 | `src/components/Layout.tsx` | Type updates |
| 7 | `src/components/WeatherDisplay.tsx` | Add "Now" outfit display |
| 8 | `src/components/Drawer.tsx` | 7 day tabs, emoji title |
| 9 | `src/App.tsx` | Integration |

---

## Verification

1. **TypeScript**: `npm run check`
2. **Dev server**: `npm run dev`
3. **Main page**: Verify outfit emojis appear below "Updated" time
4. **Drawer**: Verify 👀 emoji, 7 tabs, no "Now" tab
5. **Scroll**: Test horizontal tab scrolling
6. **AI**: Clear cache, verify different prompts per day
7. **Navigation**: Prev/Next arrows, keyboard nav
