import { useState } from 'react'
import { useWeather } from '../hooks/useWeather'
import {
  saveWeatherData,
  loadWeatherData,
  clearWeatherData,
  getCacheAge,
  hasValidCache
} from '../lib/weatherStorage'

/**
 * Test component for weather caching functionality
 * Displays all caching operations and their results
 */
export function WeatherCacheTest() {
  const [coords] = useState({ lat: 37.7749, lon: -122.4194 })
  const [testResults, setTestResults] = useState<string[]>([])

  const { weather, loading, error, cacheAge, fetchWeather, retry, clearCache } =
    useWeather(coords.lat, coords.lon)

  const addResult = (message: string) => {
    setTestResults((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev])
  }

  const runAllTests = async () => {
    setTestResults([])
    addResult('🧪 Starting Cache Tests...')

    // Test 1: Save weather data
    const testData = {
      temperature: 22.5,
      weatherCode: 0,
      condition: 'Clear sky',
      icon: '☀️',
      windSpeed: 10.5,
      isDay: 1,
      location: { latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
      daily: {
        today: {
          time: '2026-01-31',
          temperatureMax: 25.0,
          temperatureMin: 18.0,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 5
        },
        tomorrow: {
          time: '2026-02-01',
          temperatureMax: 24.0,
          temperatureMin: 17.0,
          weatherCode: 1,
          precipitationProbabilityMax: 10,
          uvIndexMax: 4
        }
      }
    }

    try {
      saveWeatherData(testData, 37.7749, -122.4194)
      addResult('✅ Test 1: Save weather data to localStorage - PASSED')
    } catch (e) {
      addResult(`❌ Test 1: Save weather data - FAILED: ${e}`)
    }

    // Test 2: Load cached data
    try {
      const loaded = loadWeatherData(37.7749, -122.4194)
      if (loaded && loaded.temperature === testData.temperature) {
        addResult('✅ Test 2: Load cached data - PASSED')
      } else {
        addResult('❌ Test 2: Load cached data - FAILED: Data mismatch')
      }
    } catch (e) {
      addResult(`❌ Test 2: Load cached data - FAILED: ${e}`)
    }

    // Test 3: Check cache age
    try {
      const age = getCacheAge()
      if (age >= 0) {
        addResult(`✅ Test 3: Get cache age - PASSED (${age}s)`)
      } else {
        addResult('❌ Test 3: Get cache age - FAILED: No cache found')
      }
    } catch (e) {
      addResult(`❌ Test 3: Get cache age - FAILED: ${e}`)
    }

    // Test 4: Check hasValidCache
    try {
      const hasCache = hasValidCache(37.7749, -122.4194)
      if (hasCache) {
        addResult('✅ Test 4: hasValidCache - PASSED')
      } else {
        addResult('❌ Test 4: hasValidCache - FAILED: Should have valid cache')
      }
    } catch (e) {
      addResult(`❌ Test 4: hasValidCache - FAILED: ${e}`)
    }

    // Test 5: Location mismatch validation
    try {
      const farAway = loadWeatherData(40.7128, -74.0060) // New York
      if (farAway === null) {
        addResult('✅ Test 5: Location mismatch validation - PASSED')
      } else {
        addResult('❌ Test 5: Location mismatch - FAILED: Should reject far location')
      }
    } catch (e) {
      addResult(`❌ Test 5: Location mismatch - FAILED: ${e}`)
    }

    // Test 6: Clear cache
    try {
      clearWeatherData()
      const afterClear = getCacheAge()
      if (afterClear === -1) {
        addResult('✅ Test 6: Clear cache - PASSED')
      } else {
        addResult('❌ Test 6: Clear cache - FAILED: Cache still exists')
      }
    } catch (e) {
      addResult(`❌ Test 6: Clear cache - FAILED: ${e}`)
    }

    // Test 7: Serialization/Deserialization
    try {
      const complexData = {
        temperature: -15.7,
        weatherCode: 71,
        condition: 'Slight snow',
        icon: '🌨️',
        windSpeed: 25.3,
        isDay: 0,
        location: {
          latitude: 61.2181,
          longitude: -149.9003,
          timezone: 'America/Anchorage'
        },
        daily: {
          today: {
            time: '2026-01-31',
            temperatureMax: -10.0,
            temperatureMin: -20.0,
            weatherCode: 71,
            precipitationProbabilityMax: 80,
            uvIndexMax: 1
          },
          tomorrow: {
            time: '2026-02-01',
            temperatureMax: -8.0,
            temperatureMin: -18.0,
            weatherCode: 65,
            precipitationProbabilityMax: 70,
            uvIndexMax: 1
          }
        }
      }

      saveWeatherData(complexData, 61.2181, -149.9003)
      const loaded = loadWeatherData(61.2181, -149.9003)

      if (
        loaded &&
        loaded.temperature === complexData.temperature &&
        loaded.weatherCode === complexData.weatherCode &&
        loaded.condition === complexData.condition &&
        loaded.icon === complexData.icon &&
        loaded.windSpeed === complexData.windSpeed &&
        loaded.isDay === complexData.isDay &&
        loaded.location.latitude === complexData.location.latitude &&
        loaded.location.longitude === complexData.location.longitude &&
        loaded.location.timezone === complexData.location.timezone
      ) {
        addResult('✅ Test 7: Serialization/Deserialization - PASSED')
      } else {
        addResult('❌ Test 7: Serialization/Deserialization - FAILED: Data mismatch')
      }

      // Clean up
      clearWeatherData()
    } catch (e) {
      addResult(`❌ Test 7: Serialization/Deserialization - FAILED: ${e}`)
    }

    addResult('✅ All cache tests completed!')
  }

  return (
    <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">💾</span>
        Weather Cache Test
      </h2>

      {/* Current cache status */}
      <div className="mb-4 p-4 bg-white rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Cache Status</h3>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Cache Age:</span>{' '}
            {cacheAge >= 0 ? `${cacheAge}s` : 'No cache'}
          </p>
          <p>
            <span className="font-medium">Has Valid Cache:</span>{' '}
            {hasValidCache(coords.lat, coords.lon) ? '✅ Yes' : '❌ No'}
          </p>
          <p>
            <span className="font-medium">Coordinates:</span>{' '}
            {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Live weather from useWeather hook */}
      <div className="mb-4 p-4 bg-white rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Live Weather (via useWeather)</h3>
        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {weather && (
          <div className="text-sm">
            <p>
              <span className="font-medium">Temperature:</span> {weather.temperature}°C
            </p>
            <p>
              <span className="font-medium">Condition:</span> {weather.condition} {weather.icon}
            </p>
            <p>
              <span className="font-medium">Wind:</span> {weather.windSpeed} km/h
            </p>
            <p>
              <span className="font-medium">Day/Night:</span>{' '}
              {weather.isDay === 1 ? '☀️ Day' : '🌙 Night'}
            </p>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => fetchWeather(coords.lat, coords.lon)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          type="button"
        >
          Fetch Weather
        </button>
        <button
          onClick={retry}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          type="button"
        >
          Retry
        </button>
        <button
          onClick={clearCache}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          type="button"
        >
          Clear Cache
        </button>
        <button
          onClick={runAllTests}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          type="button"
        >
          Run All Tests
        </button>
      </div>

      {/* Test results log */}
      <div className="p-4 bg-gray-900 rounded-lg max-h-80 overflow-y-auto">
        <h3 className="font-semibold text-white mb-2">Test Results</h3>
        <div className="font-mono text-xs space-y-1">
          {testResults.length === 0 ? (
            <p className="text-gray-500">Click "Run All Tests" to begin</p>
          ) : (
            testResults.map((result, i) => (
              <p
                key={i}
                className={
                  result.includes('✅')
                    ? 'text-green-400'
                    : result.includes('❌')
                      ? 'text-red-400'
                      : 'text-blue-400'
                }
              >
                {result}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
