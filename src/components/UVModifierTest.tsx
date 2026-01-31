/**
 * UV Modifier Test Component
 * Interactive test component for Feature #23 - UV index modifier (sunglasses)
 */

import { useState } from 'react'
import {
  getUVModifierEmojis,
  getOutfitWithUV,
  getUVIndexCategoryDisplayName
} from '../lib/outfitLogic'

export function UVModifierTest() {
  const [uvIndex, setUVIndex] = useState<number>(5)
  const [isDay, setIsDay] = useState<number>(1)
  const baseOutfit = ['👕', '👖', '👟']
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const uvEmojis = getUVModifierEmojis(uvIndex, isDay)
  const fullOutfit = getOutfitWithUV(baseOutfit, uvIndex, isDay)
  const categoryName = getUVIndexCategoryDisplayName(
    uvIndex <= 2 ? 'low' :
    uvIndex <= 5 ? 'moderate' :
    uvIndex <= 7 ? 'high' : 'extreme'
  )

  const runAllTests = () => {
    const results: Record<string, boolean> = {}

    // Test 1: Low UV (0-2) - no protection
    results['Low UV (0-2): No protection'] =
      getUVModifierEmojis(1, 1).length === 0

    // Test 2: Moderate UV (3-5) - sunglasses only
    const modUV = getUVModifierEmojis(4, 1)
    results['Moderate UV (3-5): Sunglasses only'] =
      modUV.length === 1 && modUV.includes('🕶️') && !modUV.includes('🧢')

    // Test 3: High UV (6-7) - sunglasses + hat
    const highUV = getUVModifierEmojis(6, 1)
    results['High UV (6-7): Sunglasses + hat'] =
      highUV.length === 2 && highUV.includes('🕶️') && highUV.includes('🧢')

    // Test 4: Extreme UV (8+) - sunglasses + hat
    const extremeUV = getUVModifierEmojis(10, 1)
    results['Extreme UV (8+): Sunglasses + hat'] =
      extremeUV.length === 2 && extremeUV.includes('🕶️') && extremeUV.includes('🧢')

    // Test 5: Nighttime - no protection regardless of UV
    results['Nighttime: No protection (UV 10)'] =
      getUVModifierEmojis(10, 0).length === 0

    // Test 6: Boundary at UV 3 (moderate threshold)
    const uv3 = getUVModifierEmojis(3, 1)
    results['UV 3: Sunglasses added (moderate threshold)'] =
      uv3.length === 1 && uv3.includes('🕶️')

    // Test 7: Boundary at UV 6 (high threshold - hat added)
    const uv6 = getUVModifierEmojis(6, 1)
    results['UV 6: Hat added (high threshold)'] =
      uv6.length === 2 && uv6.includes('🕶️') && uv6.includes('🧢')

    // Test 8: Just below moderate (UV 2)
    results['UV 2: No protection (below moderate)'] =
      getUVModifierEmojis(2, 1).length === 0

    // Test 9: Just below high (UV 5)
    const uv5 = getUVModifierEmojis(5, 1)
    results['UV 5: Sunglasses only (below high)'] =
      uv5.length === 1 && uv5.includes('🕶️') && !uv5.includes('🧢')

    // Test 10: Integration with base outfit
    const testOutfit = getOutfitWithUV(['🧥', '👕', '👖'], 7, 1)
    results['Integration: Outfit + UV modifiers'] =
      testOutfit.length === 5 &&
      testOutfit.includes('🧥') &&
      testOutfit.includes('👕') &&
      testOutfit.includes('👖') &&
      testOutfit.includes('🕶️') &&
      testOutfit.includes('🧢')

    setTestResults(results)
  }

  const passingTests = Object.values(testResults).filter(v => v).length
  const totalTests = Object.keys(testResults).length
  const allPassed = totalTests > 0 && passingTests === totalTests

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🕶️ UV Modifier Test (Feature #23)</h2>

      {/* Interactive Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">Interactive Test</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              UV Index: {uvIndex}
            </label>
            <input
              type="range"
              min="0"
              max="12"
              value={uvIndex}
              onChange={(e) => setUVIndex(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              Category: <span className="font-semibold">{categoryName}</span>
              {uvIndex <= 2 && ' (0-2)'}
              {uvIndex >= 3 && uvIndex <= 5 && ' (3-5)'}
              {uvIndex >= 6 && uvIndex <= 7 && ' (6-7)'}
              {uvIndex >= 8 && ' (8+)'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Time of Day
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDay(1)}
                className={`flex-1 py-2 px-4 rounded ${
                  isDay === 1
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                ☀️ Day
              </button>
              <button
                onClick={() => setIsDay(0)}
                className={`flex-1 py-2 px-4 rounded ${
                  isDay === 0
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                🌙 Night
              </button>
            </div>
          </div>
        </div>

        {/* Quick Test Cases */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setUVIndex(1)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
          >
            Low (1)
          </button>
          <button
            onClick={() => setUVIndex(4)}
            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm"
          >
            Moderate (4)
          </button>
          <button
            onClick={() => setUVIndex(6)}
            className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm"
          >
            High (6)
          </button>
          <button
            onClick={() => setUVIndex(10)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
          >
            Extreme (10)
          </button>
          <button
            onClick={() => setUVIndex(3)}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm"
          >
            Boundary UV 3
          </button>
          <button
            onClick={() => setUVIndex(6)}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm"
          >
            Boundary UV 6
          </button>
        </div>

        {/* Live Results */}
        <div className="bg-white rounded p-4 border">
          <div className="text-sm text-gray-600 mb-2">
            Base Outfit: <span className="text-xl">{baseOutfit.join('')}</span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            UV Modifiers: <span className="text-2xl">{uvEmojis.length > 0 ? uvEmojis.join('') : 'None'}</span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Full Outfit: <span className="text-3xl">{fullOutfit.join('')}</span>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p className="text-sm">
              <strong>Analysis:</strong>{' '}
              {isDay === 0 ? (
                <span className="text-indigo-600">Nighttime - no UV protection needed</span>
              ) : uvIndex < 3 ? (
                <span className="text-blue-600">Low UV - minimal protection needed</span>
              ) : uvIndex < 6 ? (
                <span className="text-yellow-600">Moderate UV - sunglasses recommended</span>
              ) : (
                <span className="text-orange-600">High/Extreme UV - sunglasses + hat needed</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Automated Tests */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Automated Tests</h3>
          <button
            onClick={runAllTests}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Run All Tests
          </button>
        </div>

        {totalTests > 0 && (
          <div className={`p-4 rounded-lg mb-4 ${allPassed ? 'bg-green-50' : 'bg-orange-50'}`}>
            <div className="font-semibold mb-2">
              {allPassed ? '✅ All tests passed!' : `⚠️ ${passingTests}/${totalTests} tests passed`}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${allPassed ? 'bg-green-500' : 'bg-orange-500'}`}
                style={{ width: `${(passingTests / totalTests) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          {Object.entries(testResults).map(([name, passed]) => (
            <div
              key={name}
              className={`flex items-center gap-2 p-2 rounded ${
                passed ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <span>{passed ? '✅' : '❌'}</span>
              <span className="text-sm">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Test Requirements Checklist */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Feature Requirements</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span>✅</span>
            <span>Check UV index value - Implemented via getUVIndexCategory()</span>
          </li>
          <li className="flex items-center gap-2">
            <span>✅</span>
            <span>Add sunglasses at UV ≥ 3 - Moderate+ UV triggers sunglasses</span>
          </li>
          <li className="flex items-center gap-2">
            <span>✅</span>
            <span>Add hat at UV ≥ 6 - High+ UV triggers hat</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
