import { useState, useEffect, useRef } from 'react'
import { useWeather } from '../hooks/useWeather'
import { useAdaptiveTextColors } from '../hooks/useAdaptiveTextColors'
import { WeatherSkeleton } from './WeatherSkeleton'
import { formatTemperature, formatWindSpeed } from '../lib/unitConversion'
import { useSettingsContext } from '../contexts/SettingsContext'

interface WeatherDisplayProps {
  /** Latitude coordinate */
  lat: number
  /** Longitude coordinate */
  lon: number
  /** Optional location name to display */
  locationName?: string
}

/**
 * Compare two weather data objects to detect changes
 * Returns object with boolean flags for each field that changed
 */
function compareWeatherData(
  prev: ReturnType<typeof useWeather>['weather'],
  next: ReturnType<typeof useWeather>['weather']
): {
  temperatureChanged: boolean
  apparentTemperatureChanged: boolean
  conditionChanged: boolean
  iconChanged: boolean
  windSpeedChanged: boolean
} {
  if (!prev || !next) {
    return {
      temperatureChanged: false,
      apparentTemperatureChanged: false,
      conditionChanged: false,
      iconChanged: false,
      windSpeedChanged: false
    }
  }

  const temperatureChanged = Math.abs(prev.temperature - next.temperature) >= 0.5
  const apparentTemperatureChanged = Math.abs(prev.apparentTemperature - next.apparentTemperature) >= 0.5
  const conditionChanged = prev.condition !== next.condition
  const iconChanged = prev.icon !== next.icon
  const windSpeedChanged = Math.abs(prev.windSpeed - next.windSpeed) >= 1

  return {
    temperatureChanged,
    apparentTemperatureChanged,
    conditionChanged,
    iconChanged,
    windSpeedChanged
  }
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
 * Seamless updates:
 * - Detects changes between cached and fresh data
 * - Applies smooth transitions to changed values only
 * - Prevents jarring full-page flashes during background refresh
 *
 * Accessibility:
 * - All text colors adapt to background for WCAG AA compliance
 * - Uses semantic HTML and ARIA labels
 */
export function WeatherDisplay({ lat, lon, locationName }: WeatherDisplayProps) {
  const { weather, loading, refreshing, showSkeleton, error, cacheAge, offline, retry } = useWeather(lat, lon)
  const { temperatureUnit, windSpeedUnit } = useSettingsContext()

  // Track previous weather data for change detection
  const prevWeatherRef = useRef<typeof weather>(null)
  const [changes, setChanges] = useState({
    temperatureChanged: false,
    apparentTemperatureChanged: false,
    conditionChanged: false,
    iconChanged: false,
    windSpeedChanged: false
  })

  // Detect changes when weather updates
  useEffect(() => {
    if (weather && prevWeatherRef.current) {
      const detectedChanges = compareWeatherData(prevWeatherRef.current, weather)
      setChanges(detectedChanges)

      // Clear change flags after transition completes (500ms)
      const timer = setTimeout(() => {
        setChanges({
          temperatureChanged: false,
          apparentTemperatureChanged: false,
          conditionChanged: false,
          iconChanged: false,
          windSpeedChanged: false
        })
      }, 500)

      return () => clearTimeout(timer)
    }

    // Update ref after change detection
    prevWeatherRef.current = weather
  }, [weather])

  // Compute adaptive text colors for WCAG AA compliance
  const { classes: textColors } = useAdaptiveTextColors(
    weather?.temperature ?? null,
    weather?.weatherCode ?? null,
    weather?.isDay ?? null
  )

  // Show skeleton after 1 second of loading (instead of simple emoji)
  if (showSkeleton) {
    return (
      <WeatherSkeleton
        temperature={weather?.temperature ?? null}
        weatherCode={weather?.weatherCode ?? null}
        isDay={weather?.isDay ?? null}
      />
    )
  }

  // Show initial loading state for the first second (calm pulse animation)
  if (loading) {
    return (
      <section aria-live="polite" aria-busy="true" aria-label="Loading weather data" className="flex flex-col items-center justify-center py-16 space-y-4">
        {/* Animated weather emoji loading indicator */}
        <div className="text-6xl animate-pulse" role="img" aria-label="Loading weather">🌤️</div>
        <p className={`text-lg ${textColors.secondary}`}>Fetching weather data...</p>
      </section>
    )
  }

  // Show error screen only if we have no cached data to display
  // If we have cached data (offline mode), we'll show it below with an offline indicator
  if (error && !weather) {
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

  // If we have an error but also have cached weather data, show the weather
  // with a prominent offline indicator at the top

  return (
    <section aria-label="Current weather" className="flex flex-col items-center space-y-6 py-8">
      {/* Offline indicator banner - shown when using cached data due to API error */}
      {error && offline && (
        <div className="w-full max-w-sm mx-auto px-4">
          <div
            role="status"
            aria-live="polite"
            className="bg-orange-100 border border-orange-300 rounded-lg px-4 py-3 flex items-start space-x-3"
          >
            <span className="text-2xl flex-shrink-0" role="img" aria-label="Offline indicator">
              📡
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-orange-900">
                Using cached data
              </p>
              <p className="text-xs text-orange-700 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Location name */}
      {locationName && (
        <div className="text-center">
          <p className={`text-sm font-medium ${textColors.secondary}`}>{locationName}</p>
        </div>
      )}

      {/* Weather icon */}
      <div
        className={`text-8xl transition-all duration-300 ease-out ${
          changes.iconChanged ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}
        role="img"
        aria-label={weather.condition}
      >
        {weather.icon}
      </div>

      {/* Current temperature - prominent display (large text) */}
      <section aria-label="Temperature">
        <p
          className={`text-7xl font-bold tracking-tight transition-all duration-300 ease-out ${
            textColors.primary} ${changes.temperatureChanged ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {formatTemperature(weather.temperature, temperatureUnit)}
        </p>
        {/* Feels like temperature - shown when differs from actual by >2° */}
        {Math.abs(weather.temperature - weather.apparentTemperature) > 2 && (
          <p
            className={`text-lg mt-1 transition-all duration-300 ease-out ${
              textColors.secondary} ${changes.apparentTemperatureChanged ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            Feels like {formatTemperature(weather.apparentTemperature, temperatureUnit)}
          </p>
        )}
      </section>

      {/* Weather condition text */}
      <section aria-label="Weather condition">
        <p
          className={`text-xl transition-all duration-300 ease-out ${
            textColors.secondary} ${changes.conditionChanged ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {weather.condition}
        </p>
      </section>

      {/* Additional info - wind speed */}
      <section aria-label="Weather details" className={`flex items-center justify-center space-x-4 text-sm ${textColors.tertiary}`}>
        <div className={`flex items-center space-x-1 transition-all duration-300 ease-out ${
          changes.windSpeedChanged ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}>
          <span className="text-lg" role="img" aria-label="Wind">
            💨
          </span>
          <span>{formatWindSpeed(weather.windSpeed, windSpeedUnit)}</span>
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
