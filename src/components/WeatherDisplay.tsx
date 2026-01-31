import { useWeather } from '../hooks/useWeather'

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
 */
export function WeatherDisplay({ lat, lon, locationName }: WeatherDisplayProps) {
  const { weather, loading, refreshing, error, cacheAge, offline, retry } = useWeather(lat, lon)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        {/* Animated weather emoji loading indicator */}
        <div className="text-6xl animate-pulse">🌤️</div>
        <p className="text-gray-600 text-lg">Fetching weather data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 px-4">
        <div className="text-6xl">⚠️</div>
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Couldn't fetch weather</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={retry}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!weather) {
    return null
  }

  return (
    <div className="flex flex-col items-center space-y-6 py-8">
      {/* Location name */}
      {locationName && (
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">{locationName}</p>
        </div>
      )}

      {/* Weather icon */}
      <div className="text-8xl" role="img" aria-label={weather.condition}>
        {weather.icon}
      </div>

      {/* Current temperature - prominent display */}
      <div className="text-center">
        <p className="text-7xl font-bold text-gray-900 tracking-tight">
          {Math.round(weather.temperature)}°
        </p>
      </div>

      {/* Weather condition text */}
      <div className="text-center">
        <p className="text-xl text-gray-700">{weather.condition}</p>
      </div>

      {/* Additional info - wind speed */}
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
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
      </div>

      {/* Location coordinates (small, subtle) */}
      {!locationName && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {weather.location.latitude.toFixed(4)}°, {weather.location.longitude.toFixed(4)}°
          </p>
          <p className="text-xs text-gray-400">{weather.location.timezone}</p>
        </div>
      )}

      {/* Cache age timestamp */}
      <div className="text-center">
        <p className={`text-xs ${offline ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>
          {offline && '📡 '}
          {refreshing ? 'Updating...' : offline ? `Offline · ${formatCacheAge(cacheAge)}` : formatCacheAge(cacheAge)}
        </p>
      </div>
    </div>
  )
}
