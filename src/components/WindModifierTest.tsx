/**
 * Wind Modifier Test Component
 * Demonstrates wind speed modifier logic (Feature #22)
 */

import { useState } from 'react'
import {
  isWindy,
  getOutfitWithWeather,
  getTemperatureBucket,
  type WindSpeedUnit,
} from '../lib/outfitLogic'

export function WindModifierTest() {
  const [windSpeed, setWindSpeed] = useState(10)
  const [unit, setUnit] = useState<WindSpeedUnit>('kmh')
  const [temperature, setTemperature] = useState(60)
  const [weatherCode, setWeatherCode] = useState(2) // Partly cloudy

  const bucket = getTemperatureBucket(temperature, 'F')
  const isWindyCondition = isWindy(windSpeed, unit)
  const outfit = getOutfitWithWeather(bucket, weatherCode, windSpeed, unit)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🧪 Wind Speed Modifier Test
        </h1>
        <p className="text-gray-600 mb-8">Feature #22 - Wind Speed Modifier Logic</p>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wind Speed Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wind Speed: {windSpeed} {unit.toUpperCase()}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="0.1"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            {/* Unit Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wind Speed Unit
              </label>
              <div className="flex gap-2">
                {(['kmh', 'mph', 'ms', 'kn'] as WindSpeedUnit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      unit === u
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {temperature}°F (Bucket: {bucket})
              </label>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>20°F (freezing)</span>
                <span>60°F (cool)</span>
                <span>100°F (hot)</span>
              </div>
            </div>

            {/* Weather Code Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weather Code: {weatherCode}
              </label>
              <select
                value={weatherCode}
                onChange={(e) => setWeatherCode(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">0 - Clear sky</option>
                <option value="2">2 - Partly cloudy</option>
                <option value="3">3 - Overcast</option>
                <option value="63">63 - Rain</option>
                <option value="73">73 - Snow</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wind Condition Status */}
          <div
            className={`rounded-2xl shadow-lg p-6 ${
              isWindyCondition ? 'bg-orange-50 border-2 border-orange-300' : 'bg-green-50 border-2 border-green-300'
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4">Wind Condition</h2>
            <div className="text-center">
              <div className="text-6xl mb-4">{isWindyCondition ? '💨' : '🍃'}</div>
              <div
                className={`text-3xl font-bold mb-2 ${
                  isWindyCondition ? 'text-orange-600' : 'text-green-600'
                }`}
              >
                {isWindyCondition ? 'WINDY' : 'CALM'}
              </div>
              <div className="text-gray-600">
                {windSpeed} {unit.toUpperCase()}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {isWindyCondition ? (
                  <span>⚠️ Wind speed ≥ 15 km/h threshold</span>
                ) : (
                  <span>✅ Below 15 km/h threshold</span>
                )}
              </div>
            </div>
          </div>

          {/* Outfit Display */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Outfit Recommendation</h2>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">
                {bucket.toUpperCase()} bucket
              </div>
              <div className="text-6xl mb-4 tracking-wider">{outfit.join('')}</div>
              <div className="text-lg font-medium text-gray-700 mb-2">
                {outfit.length} items
              </div>
              {isWindyCondition && (
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                  🧥 Windbreaker added
                </div>
              )}
              {!isWindyCondition && (
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                  No windbreaker needed
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Test Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setWindSpeed(5)}
              className="px-4 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
            >
              🍃 Calm (5 km/h)
            </button>
            <button
              onClick={() => setWindSpeed(15)}
              className="px-4 py-3 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors"
            >
              💨 At threshold (15 km/h)
            </button>
            <button
              onClick={() => setWindSpeed(25)}
              className="px-4 py-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
            >
              🌪️ Very windy (25 km/h)
            </button>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">✅ Verification Checklist</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <span className={isWindy(10, 'kmh') ? 'text-green-500' : 'text-gray-300'}>
                □
              </span>
              <span className={isWindy(10, 'kmh') ? 'text-green-700' : 'text-gray-600'}>
                Below threshold (10 km/h) is not windy: {String(isWindy(10, 'kmh'))}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className={isWindy(15, 'kmh') ? 'text-green-500' : 'text-gray-300'}>
                □
              </span>
              <span className={isWindy(15, 'kmh') ? 'text-green-700' : 'text-gray-600'}>
                At threshold (15 km/h) is windy: {String(isWindy(15, 'kmh'))}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className={isWindy(20, 'kmh') ? 'text-green-500' : 'text-gray-300'}>
                □
              </span>
              <span className={isWindy(20, 'kmh') ? 'text-green-700' : 'text-gray-600'}>
                Above threshold (20 km/h) is windy: {String(isWindy(20, 'kmh'))}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className={isWindy(12, 'mph') ? 'text-green-500' : 'text-gray-300'}>
                □
              </span>
              <span className={isWindy(12, 'mph') ? 'text-green-700' : 'text-gray-600'}>
                Wind detection in mph (12 mph): {String(isWindy(12, 'mph'))}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className={getOutfitWithWeather('cool', 2, 20, 'kmh').includes('🧥') ? 'text-green-500' : 'text-gray-300'}>
                □
              </span>
              <span className={getOutfitWithWeather('cool', 2, 20, 'kmh').includes('🧥') ? 'text-green-700' : 'text-gray-600'}>
                Windbreaker added when windy: {getOutfitWithWeather('cool', 2, 20, 'kmh').join('')}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
