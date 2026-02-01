# OutFitWeather - Project Brief

## Overview

**OutFitWeather** is a Progressive Web App (PWA) that answers the daily question: "What should I wear?" It uses GPS location, fetches real-time weather from the Open-Meteo API, and displays emoji-based outfit recommendations with friendly one-liners.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 + Vite 6 |
| **Styling** | Tailwind CSS 4.x |
| **Language** | TypeScript 5.7 (strict mode) |
| **Backend** | None - client-side only |
| **Weather API** | Open-Meteo (free, no auth) |
| **Geocoding API** | BigDataCloud (reverse geocoding) |
| **Storage** | localStorage (weather cache + settings) |
| **PWA** | vite-plugin-pwa (service worker, offline) |
| **Testing** | Vitest + Testing Library |

## Project Structure

```
src/
├── components/     # React UI components
│   ├── App.tsx           # Main app with permission flows
│   ├── Layout.tsx        # Header + content + drawer
│   ├── WeatherDisplay.tsx # Weather info + pull-to-refresh
│   ├── Drawer.tsx        # Swipe-up outfit drawer
│   ├── SettingsModal.tsx # Unit settings
│   └── ...
├── hooks/          # Custom React hooks
│   ├── useWeather.ts     # Fetch + cache weather
│   ├── useOutfit.ts      # Generate recommendations
│   ├── useGeolocation.ts # GPS + permissions
│   ├── useAdaptiveBackground.ts
│   ├── useAdaptiveTextColors.ts
│   └── ...
├── lib/            # Business logic & utilities
│   ├── openmeteo.ts      # API client
│   ├── outfitLogic.ts    # Temperature buckets + emojis
│   ├── weatherStorage.ts # localStorage cache
│   └── ...
└── contexts/       # React context providers
    └── SettingsContext.tsx
```

## Key Features

### Weather Display
- Current temperature with "feels like"
- Location name (reverse geocoded)
- Weather condition + emoji icon
- High/low, UV index, wind speed, precipitation
- Adaptive background colors based on conditions
- Pull-to-refresh gesture

### Outfit Recommendations
- **Three views**: Now, Today, Tomorrow
- **8 temperature buckets**: extreme_freezing to extreme_hot
- **Weather modifiers**: Rain (umbrella), snow, wind, UV (sunglasses/hat)
- **Emoji display**: Large emojis with friendly one-liners

### Drawer Interaction
- Swipe-up gesture to reveal outfit recommendations
- Spring animation (iOS-like bounce)
- Previous/Next navigation between views
- Tap outside or swipe down to collapse

### Data & Caching
- 30-minute cache expiry in localStorage
- Background refresh while app is open
- Offline support with cached data
- Seamless updates (no jarring refreshes)

### Location Handling
- Browser Geolocation API
- Permission prompt with explanation
- Graceful fallback for denied/timeout
- Manual location entry option

## Architecture Patterns

### Immutability
All state updates use spread operators - never mutate objects directly.

### Adaptive Colors
Background and text colors adapt to:
- Weather conditions (rain = grey, hot = amber)
- Time of day (isDay flag)
- System dark mode preference

### Caching Strategy
1. Show cached data immediately on load
2. Fetch fresh data in background
3. Seamless transition when fresh data arrives
4. Fallback to cache if network fails

### Error Handling
- User-friendly messages (no technical jargon)
- Retry buttons on all error screens
- Cached data shown when available during errors

## Important Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app entry, permission flows |
| `src/components/Drawer.tsx` | Outfit drawer with spring animation |
| `src/components/WeatherDisplay.tsx` | Weather UI with pull-to-refresh |
| `src/hooks/useWeather.ts` | Weather fetching + caching |
| `src/hooks/useOutfit.ts` | Outfit recommendation logic |
| `src/lib/outfitLogic.ts` | Temperature buckets + emoji mapping |
| `src/lib/adaptiveBackground.ts` | Color calculations |
| `src/hooks/useSpringAnimation.ts` | Spring physics animation |

## Development Commands

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Type check + build
npm run check    # TypeScript check only
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Key Considerations

- **No backend** - All API calls from client
- **PWA** - Works offline, installable
- **Accessibility** - WCAG AA compliant, keyboard nav, screen reader support
- **Mobile-first** - Optimized for phones, acceptable on desktop
- **Dark mode** - Follows system preference
