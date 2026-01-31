import { useState } from 'react'
import { Layout } from './components/Layout'
import { WeatherDisplay } from './components/WeatherDisplay'
import { OutfitEmojiTest } from './components/OutfitEmojiTest'
import { WeatherCodeTest } from './components/WeatherCodeTest'
import { WeatherModifierTest } from './components/WeatherModifierTest'
import { WeatherCacheTest } from './components/WeatherCacheTest'
import { WindModifierTest } from './components/WindModifierTest'
import { UVModifierTest } from './components/UVModifierTest'
import { ServiceWorkerTest } from './components/ServiceWorkerTest'
import { InstallButton } from './components/InstallButton'
import { useGeolocation } from './hooks/useGeolocation'
import { useAdaptiveBackground } from './hooks/useAdaptiveBackground'
import { useAdaptiveTextColors } from './hooks/useAdaptiveTextColors'
import { useWeather } from './hooks/useWeather'
import { useOutfit } from './hooks/useOutfit'
import { usePwaInstall } from './hooks/usePwaInstall'
import { useLocationName } from './hooks/useLocationName'

/**
 * Location permission prompt screen component
 * Shown before requesting geolocation to explain why location is needed
 */
function LocationPermissionPrompt({ onAllow, textColors }: { onAllow: () => void; textColors: ReturnType<typeof useAdaptiveTextColors>['classes'] }) {
  return (
    <section aria-labelledby="permission-title" className="flex flex-col items-center justify-center py-16 space-y-6 px-4">
      <div className="text-6xl" role="img" aria-label="Location icon">📍</div>
      <div className="text-center max-w-md">
        <h2 id="permission-title" className={`text-xl font-semibold ${textColors.primary} mb-3`}>
          Enable Location Access
        </h2>
        <p className={`${textColors.secondary} mb-2`}>
          OutFitWeather needs your location to show accurate weather and outfit recommendations for your area.
        </p>
        <p className={`text-sm ${textColors.muted} mb-6`}>
          Your location is only used to fetch weather data and is never stored or shared.
        </p>
        <button
          onClick={onAllow}
          className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium text-lg"
          type="button"
        >
          Allow Location Access
        </button>
      </div>
    </section>
  )
}

/**
 * Location permission denied screen component
 * Shown when user denies location access
 */
function LocationPermissionDenied({
  onRetry,
  onManualLocation,
  textColors
}: {
  onRetry: () => void
  onManualLocation: () => void
  textColors: ReturnType<typeof useAdaptiveTextColors>['classes']
}) {
  return (
    <section role="alert" aria-labelledby="permission-denied-title" className="flex flex-col items-center justify-center py-16 space-y-6 px-4">
      <div className="text-6xl" role="img" aria-label="Location icon">📍</div>
      <div className="text-center max-w-md">
        <h2 id="permission-denied-title" className={`text-xl font-semibold ${textColors.primary} mb-3`}>
          We need your location
        </h2>
        <p className={`${textColors.secondary} mb-2`}>
          OutFitWeather uses your location to show accurate weather and outfit recommendations.
        </p>
        <p className={`text-sm ${textColors.muted} mb-6`}>
          Your location is only used to fetch weather data and is never stored or shared.
        </p>
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium text-lg"
            type="button"
          >
            Try Again
          </button>
          <button
            onClick={onManualLocation}
            className="w-full px-6 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium text-lg border border-gray-300"
            type="button"
          >
            Enter Location Manually
          </button>
          <p className={`text-xs ${textColors.muted}`}>
            To enable location: Open your browser settings and allow location access for this site.
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * Loading screen shown while fetching location
 */
function LocationLoading({ textColors }: { textColors: ReturnType<typeof useAdaptiveTextColors>['classes'] }) {
  return (
    <section aria-live="polite" aria-busy="true" aria-label="Finding your location" className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="text-6xl animate-pulse" role="img" aria-label="Loading location">📍</div>
      <p className={`${textColors.secondary} text-lg`}>Finding your location...</p>
    </section>
  )
}

/**
 * Location timeout error screen component
 * Shown when GPS location request times out (10 seconds)
 */
export function LocationTimeout({ onRetry, textColors }: { onRetry: () => void; textColors: ReturnType<typeof useAdaptiveTextColors>['classes'] }) {
  return (
    <section role="alert" aria-labelledby="timeout-title" className="flex flex-col items-center justify-center py-16 space-y-6 px-4">
      <div className="text-6xl" role="img" aria-label="Clock icon">⏱️</div>
      <div className="text-center max-w-md">
        <h2 id="timeout-title" className={`text-xl font-semibold ${textColors.primary} mb-3`}>
          Taking longer than expected
        </h2>
        <p className={`${textColors.secondary} mb-2`}>
          We couldn't find your location within 10 seconds.
        </p>
        <p className={`text-sm ${textColors.muted} mb-6`}>
          This can happen if GPS signal is weak or you're indoors. Try moving near a window or going outside.
        </p>
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium text-lg"
            type="button"
          >
            Try Again
          </button>
        </div>
      </div>
    </section>
  )
}

/**
 * Manual location entry screen component
 * Shown when user chooses to enter location manually
 */
function ManualLocationEntry({
  onSubmit,
  onCancel,
  textColors
}: {
  onSubmit: (lat: number, lon: number) => void
  onCancel: () => void
  textColors: ReturnType<typeof useAdaptiveTextColors>['classes']
}) {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const lat = parseFloat(latitude)
    const lon = parseFloat(longitude)

    // Validate inputs
    if (isNaN(lat) || isNaN(lon)) {
      setError('Please enter valid numbers for latitude and longitude.')
      return
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90.')
      return
    }

    if (lon < -180 || lon > 180) {
      setError('Longitude must be between -180 and 180.')
      return
    }

    onSubmit(lat, lon)
  }

  const handleCancel = () => {
    setLatitude('')
    setLongitude('')
    setError('')
    onCancel()
  }

  return (
    <section aria-labelledby="manual-location-title" className="flex flex-col items-center justify-center py-16 space-y-6 px-4">
      <div className="text-6xl" role="img" aria-label="Map pin icon">🗺️</div>
      <div className="w-full max-w-md">
        <h2 id="manual-location-title" className={`text-xl font-semibold ${textColors.primary} mb-3 text-center`}>
          Enter Your Location
        </h2>
        <p className={`${textColors.secondary} mb-6 text-center text-sm`}>
          Enter your latitude and longitude to get weather data for your area.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="latitude" className={`block ${textColors.secondary} text-sm font-medium mb-2`}>
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g., 40.7128"
              min="-90"
              max="90"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              aria-describedby="latitude-hint"
            />
            <p id="latitude-hint" className={`text-xs ${textColors.muted} mt-1`}>
              Between -90 and 90
            </p>
          </div>

          <div>
            <label htmlFor="longitude" className={`block ${textColors.secondary} text-sm font-medium mb-2`}>
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g., -74.0060"
              min="-180"
              max="180"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              aria-describedby="longitude-hint"
            />
            <p id="longitude-hint" className={`text-xs ${textColors.muted} mt-1`}>
              Between -180 and 180
            </p>
          </div>

          {error && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium text-lg"
            >
              Get Weather
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full px-6 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium text-lg border border-gray-300"
            >
              Cancel
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className={`text-xs ${textColors.muted} text-center mb-2`}>
              You can find your coordinates by searching "my coordinates" on Google Maps.
            </p>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 text-center block"
            >
              Open Google Maps →
            </a>
          </div>
        </form>
      </div>
    </section>
  )
}

function App() {
  const { position, error: locationError, loading: locationLoading, requestLocation, permissionShown, grantPermission } = useGeolocation()
  const { isInstallable, promptInstall } = usePwaInstall()
  // Manual location entry state
  const [manualLocation, setManualLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [weatherForBackground, setWeatherForBackground] = useState<{
    temperature: number
    weatherCode: number
    isDay: number
  } | null>(null)

  // Handlers for manual location (used in LocationPermissionDenied and ManualLocationEntry)
  const handleManualLocationClick = () => setShowManualEntry(true)
  const handleManualLocationSubmit = (lat: number, lon: number) => {
    setManualLocation({ latitude: lat, longitude: lon })
    setShowManualEntry(false)
  }

  // Fetch weather for background when we have position (GPS or manual)
  const currentPosition = position || manualLocation
  const { weather: bgWeather } = useWeather(
    currentPosition?.latitude,
    currentPosition?.longitude
  )

  // Generate outfit recommendations based on weather
  const { getCurrentOutfit } = useOutfit(bgWeather)

  // Update background weather data when available
  if (bgWeather && !weatherForBackground) {
    setWeatherForBackground({
      temperature: bgWeather.temperature,
      weatherCode: bgWeather.weatherCode,
      isDay: bgWeather.isDay,
    })
  }

  // Compute adaptive background
  const { backgroundStyle } = useAdaptiveBackground(
    weatherForBackground?.temperature ?? null,
    weatherForBackground?.weatherCode ?? null,
    weatherForBackground?.isDay ?? null
  )

  // Compute adaptive text colors for WCAG AA compliance
  const { classes: textColors } = useAdaptiveTextColors(
    weatherForBackground?.temperature ?? null,
    weatherForBackground?.weatherCode ?? null,
    weatherForBackground?.isDay ?? null
  )

  // Show manual location entry form
  if (showManualEntry) {
    return (
      <div style={backgroundStyle}>
        <Layout>
          <ManualLocationEntry
            onSubmit={handleManualLocationSubmit}
            onCancel={() => setShowManualEntry(false)}
            textColors={textColors}
          />
          <section aria-labelledby="dev-tests-title" className="border-t border-black/5 pt-8">
            <h2 id="dev-tests-title" className={`text-lg font-semibold ${textColors.secondary} mb-4`}>Development Tests</h2>
            <div className="space-y-8">
              <ServiceWorkerTest />
              <WeatherCacheTest />
            </div>
          </section>
        </Layout>
      </div>
    )
  }

  // Show permission prompt before requesting location
  if (permissionShown) {
    return (
      <div style={backgroundStyle}>
        <Layout>
          <LocationPermissionPrompt onAllow={grantPermission} textColors={textColors} />
          <section aria-labelledby="dev-tests-title" className="border-t border-black/5 pt-8">
            <h2 id="dev-tests-title" className={`text-lg font-semibold ${textColors.secondary} mb-4`}>Development Tests</h2>
            <div className="space-y-8">
              <ServiceWorkerTest />
              <WeatherCacheTest />
              <OutfitEmojiTest />
              <WeatherCodeTest />
              <WeatherModifierTest />
              <WindModifierTest />
              <UVModifierTest />
            </div>
          </section>
        </Layout>
      </div>
    )
  }

  // Handle location loading state
  if (locationLoading) {
    return (
      <div style={backgroundStyle}>
        <Layout>
          <LocationLoading textColors={textColors} />
          <section aria-labelledby="dev-tests-title" className="border-t border-black/5 pt-8">
            <h2 id="dev-tests-title" className={`text-lg font-semibold ${textColors.secondary} mb-4`}>Development Tests</h2>
            <div className="space-y-8">
              <ServiceWorkerTest />
              <WeatherCacheTest />
              <OutfitEmojiTest />
              <WeatherCodeTest />
              <WeatherModifierTest />
              <WindModifierTest />
              <UVModifierTest />
            </div>
          </section>
        </Layout>
        <InstallButton isInstallable={isInstallable} onInstall={promptInstall} />
      </div>
    )
  }

  // Handle location error state - show appropriate error screen based on error code
  if (locationError) {
    // Error code 3 = timeout, show timeout-specific screen
    if (locationError.code === 3) {
      return (
        <div style={backgroundStyle}>
          <Layout>
            <LocationTimeout onRetry={requestLocation} textColors={textColors} />
            <section aria-labelledby="dev-tests-title" className="border-t border-black/5 pt-8">
              <h2 id="dev-tests-title" className={`text-lg font-semibold ${textColors.secondary} mb-4`}>Development Tests</h2>
              <div className="space-y-8">
                <ServiceWorkerTest />
                <WeatherCacheTest />
                <OutfitEmojiTest />
                <WeatherCodeTest />
                <WeatherModifierTest />
                <WindModifierTest />
              </div>
            </section>
          </Layout>
          <InstallButton isInstallable={isInstallable} onInstall={promptInstall} />
        </div>
      )
    }

    // Error code 1 = permission denied, show permission-specific screen
    // Error code 2 = position unavailable, show generic error screen
    return (
      <div style={backgroundStyle}>
        <Layout>
          <LocationPermissionDenied
            onRetry={requestLocation}
            onManualLocation={handleManualLocationClick}
            textColors={textColors}
          />
          <section aria-labelledby="dev-tests-title" className="border-t border-black/5 pt-8">
            <h2 id="dev-tests-title" className={`text-lg font-semibold ${textColors.secondary} mb-4`}>Development Tests</h2>
            <div className="space-y-8">
              <ServiceWorkerTest />
              <WeatherCacheTest />
              <OutfitEmojiTest />
              <WeatherCodeTest />
              <WeatherModifierTest />
              <WindModifierTest />
              <UVModifierTest />
            </div>
          </section>
        </Layout>
        <InstallButton isInstallable={isInstallable} onInstall={promptInstall} />
      </div>
    )
  }

  // If we have position (GPS or manual), show weather
  const positionForDisplay = position || manualLocation
  if (positionForDisplay) {
    const currentOutfit = getCurrentOutfit()
    return (
      <div style={backgroundStyle}>
        <Layout
          outfit={currentOutfit ?? undefined}
          temperature={bgWeather?.temperature}
          weatherCode={bgWeather?.weatherCode}
          isDay={bgWeather?.isDay}
        >
          <div className="py-8 space-y-8">
            {/* Main weather display */}
            <WeatherDisplay
              lat={positionForDisplay.latitude}
              lon={positionForDisplay.longitude}
            />

            {/* Test components for development */}
            <section aria-labelledby="dev-tests-title" className="border-t border-black/5 pt-8">
              <h2 id="dev-tests-title" className={`text-lg font-semibold ${textColors.secondary} mb-4`}>Development Tests</h2>
              <div className="space-y-8">
                <WeatherCacheTest />
                <OutfitEmojiTest />
                <WeatherCodeTest />
                <WeatherModifierTest />
                <WindModifierTest />
                <UVModifierTest />
              </div>
            </section>
          </div>
        </Layout>
        <InstallButton isInstallable={isInstallable} onInstall={promptInstall} />
      </div>
    )
  }

  // Fallback: should not reach here
  return null
}

export default App
