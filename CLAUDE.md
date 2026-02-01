# OutFitWeather - Project Instructions

## Required Reading

**Before starting any session, read the project brief:**
- `docs/project_brief.md` - Contains tech stack, architecture, and key patterns

## Project Overview

OutFitWeather is a PWA that shows outfit recommendations based on weather. It uses:
- React 19 + Vite + TypeScript (strict)
- Tailwind CSS 4.x
- Open-Meteo API (weather) + BigDataCloud (geocoding)
- localStorage for caching and settings
- No backend - client-side only

## Key Patterns

### Immutability
Always create new objects, never mutate:
```typescript
// WRONG
user.name = newName

// CORRECT
const updatedUser = { ...user, name: newName }
```

### Adaptive Colors
Background and text colors adapt to weather conditions and dark mode. Use the hooks:
- `useAdaptiveBackground()` - returns background style
- `useAdaptiveTextColors()` - returns text color classes
- `useDarkMode()` - detects system dark mode

Always pass `isDarkMode` to these hooks for consistent behavior.

### Error Handling
- User-friendly messages (no technical jargon)
- Retry buttons on error screens
- Show cached data when available during errors

## Important Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app, permission flows |
| `src/components/Drawer.tsx` | Outfit drawer with spring animation |
| `src/components/WeatherDisplay.tsx` | Weather UI |
| `src/hooks/useWeather.ts` | Weather fetch + cache |
| `src/hooks/useOutfit.ts` | Outfit logic |
| `src/lib/outfitLogic.ts` | Temperature buckets + emojis |

## Development

```bash
npm run dev      # Start dev server (port 5173)
npm run check    # TypeScript check
npm run build    # Build for production
```

## Testing Notes

- DevTests can be toggled via `HIDE_DEV_TESTS` flag in `src/components/DevTests.tsx`
- Set to `true` to hide dev tests for end-user testing
- Set to `false` to show development test panels
