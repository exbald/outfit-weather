# OutFitWeather

A Progressive Web App (PWA) that shows users what to wear based on current weather at their location.

## Features

- 🌡️ Real-time weather data from Open-Meteo API
- 👔 Emoji-based outfit recommendations with friendly one-liners
- 📍 GPS location detection with reverse geocoding
- 🔄 Pull-to-refresh for updated weather
- 📱 PWA support - installable on mobile devices
- ⏰ Now/Today/Tomorrow outfit views
- 🌙 Adaptive backgrounds based on weather conditions
- ♿ Accessible with WCAG AA compliance

## Quick Start

```bash
# Run the setup script
./init.sh
```

The script will:
1. Check Node.js version (requires 20+)
2. Install dependencies
3. Build the React app
4. Start the development server

## Manual Setup

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Type check
npm run check
```

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **PWA**: Service Worker with offline caching
- **API**: Open-Meteo (weather) + Reverse Geocoding
- **Location**: Browser Geolocation API

## Project Structure

```
outfit-weather/
├── public/          # Static assets, PWA manifest
├── src/             # React components
│   ├── components/  # Reusable components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utilities, API clients
│   └── App.tsx      # Main app component
├── prompts/         # Agent prompts and specs
└── features.db      # Feature database (SQLite)
```

## Development

The development server runs on `http://localhost:5173`.

### PWA Testing

To test PWA features:
1. Open DevTools → Application
2. Check Service Worker status
3. Test manifest validity
4. Test offline mode in Network tab

## License

MIT
