import { useState } from 'react'
import { fetchCurrentWeather } from '../lib/openmeteo'

/**
 * Test component to verify Open-Meteo API client functionality
 * This component is for testing purposes during development
 */
export function WeatherApiTest() {
  const [result, setResult] = useState<{
    success: boolean
    data?: any
    error?: string
  } | null>(null)
  const [testing, setTesting] = useState(false)

  const testApi = async () => {
    setTesting(true)
    setResult(null)

    try {
      // Test with San Francisco coordinates
      const data = await fetchCurrentWeather(37.7749, -122.4194)

      setResult({
        success: true,
        data: {
          temperature: data.current.temperature,
          weatherCode: data.current.weathercode,
          windSpeed: data.current.windspeed,
          isDay: data.current.is_day,
          location: `${data.latitude}, ${data.longitude}`,
          timezone: data.timezone
        }
      })
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Open-Meteo API Test</h2>
      <p className="text-gray-600 mb-4">
        Testing API client with San Francisco coordinates (37.7749, -122.4194)
      </p>

      <button
        onClick={testApi}
        disabled={testing}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {testing ? 'Testing...' : 'Test API'}
      </button>

      {result && (
        <div className="mt-6">
          {result.success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Success!</h3>
              <pre className="text-sm text-gray-800 overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
              <p className="text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
