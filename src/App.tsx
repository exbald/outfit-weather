import { Layout } from './components/Layout'
import { WeatherDisplay } from './components/WeatherDisplay'
import { OutfitEmojiTest } from './components/OutfitEmojiTest'
import { WeatherCodeTest } from './components/WeatherCodeTest'
import { WeatherModifierTest } from './components/WeatherModifierTest'
import { WeatherCacheTest } from './components/WeatherCacheTest'
import { WindModifierTest } from './components/WindModifierTest'
import { ServiceWorkerTest } from './components/ServiceWorkerTest'
import { useGeolocation } from './hooks/useGeolocation'

/**
 * Location permission screen component
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
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium"
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
  const { position, error: locationError, loading: locationLoading, requestLocation } = useGeolocation()

  // Handle location loading state
  if (locationLoading) {
    return (
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
    )
  }

  // Handle location error state
  if (locationError) {
    return (
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
    )
  }

  // If we have position, show weather
  if (position) {
    return (
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
    )
  }

  // Fallback: should not reach here
  return null
}

export default App
