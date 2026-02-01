# OutFitWeather

**Type:** Progressive Web App (PWA)
**Stack:** React 19 + Vite + TypeScript + Tailwind CSS 4
**Status:** Active Development

## Overview

OutFitWeather answers the daily question: "What should I wear?" It uses GPS location, fetches real-time weather from Open-Meteo API, and displays emoji-based outfit recommendations with friendly one-liners.

## Key Features

- Real-time weather display with adaptive backgrounds
- Outfit recommendations based on temperature buckets + weather modifiers
- Three views: Now, Today, Tomorrow
- Swipe-up drawer with spring physics animation
- PWA with offline support
- Dark mode support

## Architecture

- **Client-side only** - No backend server
- **APIs:** Open-Meteo (weather), BigDataCloud (geocoding)
- **Storage:** localStorage for caching and settings
- **Caching:** 30-minute weather cache, 5-minute fetch skip

## Links

- Docs: `docs/project_brief.md`
- Instructions: `CLAUDE.md`
