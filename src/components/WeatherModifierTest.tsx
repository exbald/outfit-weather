import { useState } from 'react'
import {
  getOutfitWithWeather,
  isRainWeather,
  isSnowWeather,
  getWeatherModifier,
  type TemperatureBucket,
} from '../lib/outfitLogic'

/**
 * Test component for weather code modifiers
 * Displays outfit recommendations with rain/snow modifiers
 */
export function WeatherModifierTest() {
  const [selectedBucket, setSelectedBucket] = useState<TemperatureBucket>('mild')
  const [weatherCode, setWeatherCode] = useState<number>(0)

  const buckets: TemperatureBucket[] = [
    'freezing',
    'cold',
    'cool',
    'mild',
    'warm',
    'hot',
  ]

  // Test cases for different weather conditions
  const testCases = [
    { code: 0, description: 'Clear sky', expected: 'none' },
    { code: 2, description: 'Partly cloudy', expected: 'none' },
    { code: 51, description: 'Light drizzle', expected: 'rain' },
    { code: 63, description: 'Moderate rain', expected: 'rain' },
    { code: 71, description: 'Slight snow', expected: 'snow' },
    { code: 73, description: 'Moderate snow', expected: 'snow' },
    { code: 81, description: 'Rain showers', expected: 'rain' },
    { code: 85, description: 'Snow showers', expected: 'snow' },
    { code: 95, description: 'Thunderstorm', expected: 'rain' },
  ]

  const currentOutfit = getOutfitWithWeather(selectedBucket, weatherCode)
  const modifier = getWeatherModifier(weatherCode)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Weather Modifier Test</h1>

        {/* Interactive Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Interactive Test</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Temperature Bucket Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Temperature Bucket:
              </label>
              <select
                value={selectedBucket}
                onChange={(e) =>
                  setSelectedBucket(e.target.value as TemperatureBucket)
                }
                className="w-full p-2 border rounded-md"
              >
                {buckets.map((bucket) => (
                  <option key={bucket} value={bucket}>
                    {bucket}
                  </option>
                ))}
              </select>
            </div>

            {/* Weather Code Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Weather Code: {weatherCode}
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={weatherCode}
                onChange={(e) => setWeatherCode(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Result Display */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">
              Temperature: <span className="font-semibold">{selectedBucket}</span>
              <br />
              Weather Code: <span className="font-semibold">{weatherCode}</span>
              <br />
              Modifier:{' '}
              <span className="font-semibold">
                {modifier === 'none' ? 'None' : modifier}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Outfit Emojis:</div>
              <div className="text-4xl tracking-wider">{currentOutfit.join(' ')}</div>
              <div className="text-sm text-gray-500 mt-2">
                {currentOutfit.length} items
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases Grid */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Weather Modifier Tests</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Code</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Is Rain</th>
                  <th className="text-left p-2">Is Snow</th>
                  <th className="text-left p-2">Modifier</th>
                </tr>
              </thead>
              <tbody>
                {testCases.map((test) => (
                  <tr key={test.code} className="border-b">
                    <td className="p-2 font-mono">{test.code}</td>
                    <td className="p-2">{test.description}</td>
                    <td className="p-2">
                      {isRainWeather(test.code) ? '✅ Yes' : '❌ No'}
                    </td>
                    <td className="p-2">
                      {isSnowWeather(test.code) ? '✅ Yes' : '❌ No'}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          getWeatherModifier(test.code) === 'rain'
                            ? 'bg-blue-100 text-blue-800'
                            : getWeatherModifier(test.code) === 'snow'
                            ? 'bg-cyan-100 text-cyan-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getWeatherModifier(test.code)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outfit Combinations by Weather */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Outfit Combinations by Weather
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Clear Weather */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Clear Weather (Code 0)</h3>
              {buckets.map((bucket) => (
                <div key={bucket} className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">
                    {bucket}:
                  </div>
                  <div className="text-2xl">
                    {getOutfitWithWeather(bucket, 0).join(' ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Rain Weather */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Rainy Weather (Code 63)</h3>
              {buckets.map((bucket) => (
                <div key={bucket} className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">
                    {bucket}:
                  </div>
                  <div className="text-2xl">
                    {getOutfitWithWeather(bucket, 63).join(' ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Snow Weather */}
            <div className="bg-cyan-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Snowy Weather (Code 73)</h3>
              {buckets.map((bucket) => (
                <div key={bucket} className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">
                    {bucket}:
                  </div>
                  <div className="text-2xl">
                    {getOutfitWithWeather(bucket, 73).join(' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rain Code Coverage */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Rain Code Coverage</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { code: 51, desc: 'Light drizzle' },
              { code: 53, desc: 'Moderate drizzle' },
              { code: 55, desc: 'Dense drizzle' },
              { code: 56, desc: 'Light freezing drizzle' },
              { code: 57, desc: 'Dense freezing drizzle' },
              { code: 61, desc: 'Slight rain' },
              { code: 63, desc: 'Moderate rain' },
              { code: 65, desc: 'Heavy rain' },
              { code: 66, desc: 'Light freezing rain' },
              { code: 67, desc: 'Heavy freezing rain' },
              { code: 80, desc: 'Slight rain showers' },
              { code: 81, desc: 'Moderate rain showers' },
              { code: 82, desc: 'Violent rain showers' },
              { code: 95, desc: 'Thunderstorm' },
              { code: 96, desc: 'Thunderstorm + hail' },
              { code: 99, desc: 'Thunderstorm + heavy hail' },
            ].map(({ code, desc }) => (
              <div
                key={code}
                className={`p-2 rounded text-sm ${
                  isRainWeather(code)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <div className="font-mono font-semibold">{code}</div>
                <div className="text-xs">{desc}</div>
                <div className="text-xs mt-1">
                  {isRainWeather(code) ? '✅ Rain' : '❌ Not rain'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Snow Code Coverage */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Snow Code Coverage</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { code: 71, desc: 'Slight snow' },
              { code: 73, desc: 'Moderate snow' },
              { code: 75, desc: 'Heavy snow' },
              { code: 77, desc: 'Snow grains' },
              { code: 85, desc: 'Slight snow showers' },
              { code: 86, desc: 'Heavy snow showers' },
            ].map(({ code, desc }) => (
              <div
                key={code}
                className={`p-2 rounded text-sm ${
                  isSnowWeather(code)
                    ? 'bg-cyan-100 text-cyan-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <div className="font-mono font-semibold">{code}</div>
                <div className="text-xs">{desc}</div>
                <div className="text-xs mt-1">
                  {isSnowWeather(code) ? '✅ Snow' : '❌ Not snow'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
