/**
 * Test script for weather code mapping
 * Verifies getWeatherCondition function returns correct data
 */

// Import the compiled module
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { getWeatherCondition, WEATHER_CODE_MAP } from './dist/assets/index-C7rJ2fDy.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('=== Weather Code Mapping Test ===\n')

// Test cases
const testCases = [
  { code: 0, expectedDesc: 'Clear sky', expectedIcon: '☀️' },
  { code: 2, expectedDesc: 'Partly cloudy', expectedIcon: '⛅' },
  { code: 3, expectedDesc: 'Overcast', expectedIcon: '☁️' },
  { code: 45, expectedDesc: 'Fog', expectedIcon: '🌫️' },
  { code: 61, expectedDesc: 'Slight rain', expectedIcon: '🌧️' },
  { code: 71, expectedDesc: 'Slight snow', expectedIcon: '🌨️' },
  { code: 95, expectedDesc: 'Thunderstorm', expectedIcon: '⛈️' },
  { code: 99, expectedDesc: 'Thunderstorm with heavy hail', expectedIcon: '⛈️' },
  { code: 100, expectedDesc: 'Unknown condition', expectedIcon: '❓' } // Unknown code
]

let passed = 0
let failed = 0

testCases.forEach(({ code, expectedDesc, expectedIcon }) => {
  const result = getWeatherCondition(code)
  const descMatch = result.description === expectedDesc
  const iconMatch = result.icon === expectedIcon
  const hasCategory = result.category !== undefined

  if (descMatch && iconMatch && hasCategory) {
    console.log(`✓ Code ${code}: "${result.description}" ${result.icon} (${result.category})`)
    passed++
  } else {
    console.log(`✗ Code ${code}: FAILED`)
    console.log(`  Expected: "${expectedDesc}" ${expectedIcon}`)
    console.log(`  Got: "${result.description}" ${result.icon} (${result.category})`)
    failed++
  }
})

console.log(`\n=== Summary ===`)
console.log(`Total codes mapped: ${Object.keys(WEATHER_CODE_MAP).length}`)
console.log(`Tests passed: ${passed}/${testCases.length}`)
console.log(`Tests failed: ${failed}/${testCases.length}`)

if (failed === 0 && Object.keys(WEATHER_CODE_MAP).length >= 30) {
  console.log('\n✓ All tests passed! Weather code mapping is working correctly.')
  process.exit(0)
} else {
  console.log('\n✗ Some tests failed.')
  process.exit(1)
}
