/**
 * Weather Code Mapping Test Component
 * Tests the getWeatherCondition function with various weather codes
 */

import { getWeatherCondition } from '../lib/openmeteo'

export function WeatherCodeTest() {
  // Test all weather codes we have mapped
  const testCodes = [
    0, 1, 2, 3, 45, 48,
    51, 53, 55, 56, 57,
    61, 63, 65, 66, 67,
    71, 73, 75, 77,
    80, 81, 82, 85, 86,
    95, 96, 99
  ]

  // Test an unknown code for fallback
  const unknownCode = 100

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Weather Code Mapping Test</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Mapped Weather Codes</h2>
          <p className="text-gray-600 mb-4">
            Testing {testCodes.length} weather codes from Open-Meteo API
          </p>
        </div>

        <div className="grid gap-4">
          {testCodes.map((code) => {
            const condition = getWeatherCondition(code)
            return (
              <div
                key={code}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{condition.icon}</div>
                  <div>
                    <div className="font-mono text-sm text-gray-500">
                      Code: {code}
                    </div>
                    <div className="font-medium text-lg">
                      {condition.description}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      Category: {condition.category}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Unknown Code Test</h3>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{getWeatherCondition(unknownCode).icon}</div>
            <div>
              <div className="font-mono text-sm text-gray-500">
                Code: {unknownCode}
              </div>
              <div className="font-medium">
                {getWeatherCondition(unknownCode).description}
              </div>
              <div className="text-sm text-gray-500">
                Category: {getWeatherCondition(unknownCode).category}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-green-800 mb-2">✓ Verification Steps</h3>
          <ul className="list-disc list-inside space-y-1 text-green-700">
            <li>All mapped weather codes return valid conditions</li>
            <li>Each condition has a description and emoji icon</li>
            <li>Each condition is categorized for outfit logic</li>
            <li>Unknown codes fall back to a safe default</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
