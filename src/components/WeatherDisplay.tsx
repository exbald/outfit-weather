import { useWeather } from '../hooks/useWeather'
import { useAdaptiveTextColors } from '../hooks/useAdaptiveTextColors'

interface WeatherDisplayProps {
  /** Latitude coordinate */
  lat: number
  /** Longitude coordinate */
  lon: number
  /** Optional location name to display */
  locationName?: string
}

/**
 * Format cache age into human-readable string
 * @param seconds - Age in seconds
 * @returns Formatted string (e.g., "Updated just now", "Updated 5 mins ago")
 */
function formatCacheAge(seconds: number): string {
  if (seconds <= 0) return 'Updated just now'
  if (seconds < 60) return 'Updated just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `Updated ${minutes} min${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`
}

/**
 * WeatherDisplay component
 * Shows current weather information including temperature, condition, and location
 *
 * Caching behavior:
 * - Shows cached data immediately if available
 * - Displays subtle loading indicator when refreshing in background
 * - Shows full loading indicator (calm pulse animation) only when no cached data exists
 *
 * Accessibility:
 * - All text colors adapt to background for WCAG AA compliance
 * - Uses semantic HTML and ARIA labels
 */
export function WeatherDisplay({ lat, lon, locationName }: WeatherDisplayProps) {
  const { weather, loading, refreshing, error, cacheAge, offline, retry } = useWeather(lat, lon)

  // Compute adaptive text colors for WCAG AA compliance
  const { classes: textColors } = useAdaptiveTextColors(
    weather?.temperature ?? null,
    weather?.weatherCode ?? null,
    weather?.isDay ?? null
  )

  if (loading) {
    return (
      <section aria-live="polite" aria-busy="true" aria-label="Loading weather data" className="flex flex-col items-center justify-center py-16 space-y-4">
        {/* Animated weather emoji loading indicator */}
        <div className="text-6xl animate-pulse" role="img" aria-label="Loading weather">🌤️</div>
        <p className={`text-lg ${textColors.secondary}`}>Fetching weather data...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section role="alert" aria-labelledby="weather-error-title" className="flex flex-col items-center justify-center py-16 space-y-4 px-4">
        <div className="text-6xl" role="img" aria-label="Error">⚠️</div>
        <div className="text-center max-w-md">
          <h2 id="weather-error-title" className={`text-xl font-semibold ${textColors.primary} mb-2`}>Couldn't fetch weather</h2>
          <p className={textColors.secondary + ' mb-4'}>{error}</p>
          <button
            onClick={retry}
            className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors text-lg font-medium"
            type="button"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  if (!weather) {
    return null
  }

  return (
    <section aria-label="Current weather" className="flex flex-col items-center space-y-6 py-8">
      {/* Location name */}
      {locationName && (
        <div className="text-center">
          <p className={`text-sm font-medium ${textColors.secondary}`}>{locationName}</p>
        </div>
      )}

      {/* Weather icon */}
      <div className="text-8xl" role="img" aria-label={weather.condition}>
        {weather.icon}
      </div>

      {/* Current temperature - prominent display (large text) */}
      <section aria-label="Temperature">
        <p className={`text-7xl font-bold tracking-tight ${textColors.primary}`}>
          {Math.round(weather.temperature)}°
        </p>
      </section>

      {/* Weather condition text */}
      <section aria-label="Weather condition">
        <p className={`text-xl ${textColors.secondary}`}>{weather.condition}</p>
      </section>

      {/* Additional info - wind speed */}
      <section aria-label="Weather details" className={`flex items-center justify-center space-x-4 text-sm ${textColors.tertiary}`}>
        <div className="flex items-center space-x-1">
          <span className="text-lg" role="img" aria-label="Wind">
            💨
          </span>
          <span>{Math.round(weather.windSpeed)} km/h</span>
        </div>
        {weather.isDay === 1 ? (
          <div className="flex items-center space-x-1">
            <span className="text-lg" role="img" aria-label="Day">
              ☀️
            </span>
            <span>Day</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <span className="text-lg" role="img" aria-label="Night">
              🌙
            </span>
            <span>Night</span>
          </div>
        )}
      </section>

      {/* Location coordinates (small, subtle) */}
      {!locationName && (
        <section aria-label="Location coordinates" className="text-center">
          <p className={`text-xs ${textColors.tertiary}`}>
            {weather.location.latitude.toFixed(4)}°, {weather.location.longitude.toFixed(4)}°
          </p>
          <p className={`text-xs ${textColors.muted}`}>{weather.location.timezone}</p>
        </section>
      )}

      {/* Cache age timestamp */}
      <div className="text-center">
        <p className={`text-xs ${offline ? 'text-orange-600 font-medium' : textColors.muted}`}>
          {offline && '📡 '}
          {refreshing ? 'Updating...' : offline ? `Offline · ${formatCacheAge(cacheAge)}` : formatCacheAge(cacheAge)}
        </p>
      </div>
    </section>
  )
}
