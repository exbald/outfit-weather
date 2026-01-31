import { useState } from 'react'
import { Layout } from './components/Layout'
import { WeatherDisplay } from './components/WeatherDisplay'
import { OutfitEmojiTest } from './components/OutfitEmojiTest'
import { WeatherCodeTest } from './components/WeatherCodeTest'
import { WeatherModifierTest } from './components/WeatherModifierTest'
import { WeatherCacheTest } from './components/WeatherCacheTest'
import { WindModifierTest } from './components/WindModifierTest'
import { ServiceWorkerTest } from './components/ServiceWorkerTest'
import { InstallButton } from './components/InstallButton'
import { useGeolocation } from './hooks/useGeolocation'
import { useAdaptiveBackground } from './hooks/useAdaptiveBackground'
import { useAdaptiveTextColors } from './hooks/useAdaptiveTextColors'
import { useWeather } from './hooks/useWeather'
import { usePwaInstall } from './hooks/usePwaInstall'

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
function LocationPermissionDenied({ onRetry, textColors }: { onRetry: () => void; textColors: ReturnType<typeof useAdaptiveTextColors>['classes'] }) {
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

function App() {
  const { position, error: locationError, loading: locationLoading, requestLocation, permissionShown, grantPermission } = useGeolocation()
  const { isInstallable, promptInstall } = usePwaInstall()
  const [weatherForBackground, setWeatherForBackground] = useState<{
    temperature: number
    weatherCode: number
    isDay: number
  } | null>(null)

  // Fetch weather for background when we have position
  const { weather: bgWeather } = useWeather(
    position?.latitude,
    position?.longitude
  )

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
          <LocationPermissionDenied onRetry={requestLocation} textColors={textColors} />
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

  // If we have position, show weather
  if (position) {
    return (
      <div style={backgroundStyle}>
        <Layout>
          <div className="py-8 space-y-8">
            {/* Main weather display */}
            <WeatherDisplay
              lat={position.latitude}
              lon={position.longitude}
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
