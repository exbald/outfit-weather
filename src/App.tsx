import { useState } from 'react'
import { Layout } from './components/Layout'
import { WeatherDisplay } from './components/WeatherDisplay'
import { OutfitEmojiTest } from './components/OutfitEmojiTest'
import { WeatherCodeTest } from './components/WeatherCodeTest'
import { WeatherModifierTest } from './components/WeatherModifierTest'
import { WeatherCacheTest } from './components/WeatherCacheTest'
import { WindModifierTest } from './components/WindModifierTest'
import { ServiceWorkerTest } from './components/ServiceWorkerTest'
import { useGeolocation } from './hooks/useGeolocation'
import { useAdaptiveBackground } from './hooks/useAdaptiveBackground'
import { useWeather } from './hooks/useWeather'

/**
 * Location permission prompt screen component
 * Shown before requesting geolocation to explain why location is needed
 */
function LocationPermissionPrompt({ onAllow }: { onAllow: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 px-4">
      <div className="text-6xl">📍</div>
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Enable Location Access
        </h2>
        <p className="text-gray-600 mb-2">
          OutFitWeather needs your location to show accurate weather and outfit recommendations for your area.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Your location is only used to fetch weather data and is never stored or shared.
        </p>
        <button
          onClick={onAllow}
          className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium"
          type="button"
        >
          Allow Location Access
        </button>
      </div>
    </div>
  )
}

/**
 * Location permission denied screen component
 * Shown when user denies location access
 */
function LocationPermissionDenied({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 px-4">
      <div className="text-6xl">📍</div>
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          We need your location
        </h2>
        <p className="text-gray-600 mb-2">
          OutFitWeather uses your location to show accurate weather and outfit recommendations.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Your location is only used to fetch weather data and is never stored or shared.
        </p>
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium"
            type="button"
          >
            Try Again
          </button>
          <p className="text-xs text-gray-500">
            To enable location: Open your browser settings and allow location access for this site.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading screen shown while fetching location
 */
function LocationLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="text-6xl animate-pulse">📍</div>
      <p className="text-gray-600 text-lg">Finding your location...</p>
    </div>
  )
}

function App() {
  const { position, error: locationError, loading: locationLoading, requestLocation, permissionShown, grantPermission } = useGeolocation()
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

  // Show permission prompt before requesting location
  if (permissionShown) {
    return (
      <div style={backgroundStyle}>
        <Layout>
          <LocationPermissionPrompt onAllow={grantPermission} />
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Development Tests</h2>
            <div className="space-y-8">
              <ServiceWorkerTest />
              <WeatherCacheTest />
              <OutfitEmojiTest />
              <WeatherCodeTest />
              <WeatherModifierTest />
              <WindModifierTest />
            </div>
          </div>
        </Layout>
      </div>
    )
  }

  // Handle location loading state
  if (locationLoading) {
    return (
      <div style={backgroundStyle}>
        <Layout>
          <LocationLoading />
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Development Tests</h2>
            <div className="space-y-8">
              <ServiceWorkerTest />
              <WeatherCacheTest />
              <OutfitEmojiTest />
              <WeatherCodeTest />
              <WeatherModifierTest />
              <WindModifierTest />
            </div>
          </div>
        </Layout>
      </div>
    )
  }

  // Handle location error state
  if (locationError) {
    return (
      <div style={backgroundStyle}>
        <Layout>
          <LocationPermissionDenied onRetry={requestLocation} />
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Development Tests</h2>
            <div className="space-y-8">
              <ServiceWorkerTest />
              <WeatherCacheTest />
              <OutfitEmojiTest />
              <WeatherCodeTest />
              <WeatherModifierTest />
              <WindModifierTest />
            </div>
          </div>
        </Layout>
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
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Development Tests</h2>
              <div className="space-y-8">
                <WeatherCacheTest />
                <OutfitEmojiTest />
                <WeatherCodeTest />
                <WeatherModifierTest />
                <WindModifierTest />
              </div>
            </div>
          </div>
        </Layout>
      </div>
    )
  }

  // Fallback: should not reach here
  return null
}

export default App
