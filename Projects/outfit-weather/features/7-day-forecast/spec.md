# Feature: 7-Day Weather Forecast

**Project:** OutFitWeather
**Created:** 2026-02-01
**Priority:** P1
**Status:** Not Started

## Overview

Extend the weather forecast from 2 days (Today/Tomorrow) to 7 days, with a redesigned layout:
- **Main page**: Show current ("Now") outfit emojis + one-liner below the "Updated" timestamp
- **Drawer**: Future forecasts only (Today through 6 days out)
- **Day labels**: Today, Tomorrow, Wed, Thu, Fri, Sat, Sun

## User Story

As a user, I want to see outfit recommendations for the next 7 days so that I can plan my wardrobe for the week ahead.

## Requirements

### Must Have
- Show 7 days of forecast (Today + 6 more days)
- Move "Now" outfit display to main page (below Updated time)
- Drawer shows only future days (no "Now" tab)
- Day labels use weekday names (Wed, Thu, Fri...)
- Each day shows outfit emojis + one-liner based on that day's forecast
- Horizontally scrollable tabs for 7 days

### Should Have
- Add eye emoji to drawer title: "Swipe up · 👀 What to wear"
- AI recommendations work for all 7 days
- Smooth horizontal scroll on tabs

### Out of Scope
- Extended forecast beyond 7 days (API supports 16, but UI gets cluttered)
- Hourly breakdown within each day
- Weather alerts/warnings

## Technical Notes

### API Capability
Open-Meteo already returns 16 days of forecast data by default. No API changes needed - just extract more days from the response.

### Data Structure Changes
- `parseDailyForecast()` returns array of 7 days instead of `{today, tomorrow}`
- `WeatherData.daily` becomes `{ days: DailyWeatherData[], today, tomorrow }`
- `OutfitView` type changes from `'now' | 'today' | 'tomorrow'` to `'now' | number`

### Key Files
- `src/lib/openmeteo.ts` - Extract 7 days
- `src/hooks/useWeather.ts` - Array-based daily structure
- `src/hooks/useOutfit.ts` - Generate 7 outfit recommendations
- `src/components/Drawer.tsx` - 7 scrollable tabs
- `src/components/WeatherDisplay.tsx` - Add "Now" outfit section

## UX Flow

### Main Page
1. User opens app
2. Sees current weather + temperature
3. Below "Updated X mins ago", sees outfit emojis + one-liner for NOW
4. Drawer handle shows "Swipe up · 👀 What to wear"

### Drawer
1. User swipes up drawer
2. Sees 7 tabs: Today, Tomorrow, Wed, Thu, Fri, Sat, Sun
3. Horizontal scroll if tabs don't fit
4. Each tab shows forecast + outfit for that day
5. Prev/Next arrows cycle through days

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| API returns fewer than 7 days | Show available days only |
| Day crosses timezone boundary | Use user's local timezone from API |
| Tab overflow on small screens | Horizontal scroll with fade indicators |
| AI fails for a day | Fall back to static outfit logic |

## Success Criteria

- [ ] Main page shows "Now" outfit below Updated time
- [ ] Drawer has 7 day tabs (no "Now" tab)
- [ ] Each day shows correct forecast data
- [ ] Day labels show weekday names
- [ ] Drawer title has 👀 emoji
- [ ] Horizontal scroll works for tabs
- [ ] AI recommendations work for all days
