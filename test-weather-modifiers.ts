/**
 * Test script for weather code modifiers (Feature #21)
 * Tests rain and snow detection and outfit modification
 */

import {
  isRainWeather,
  isSnowWeather,
  getWeatherModifier,
  getOutfitWithWeather,
  type TemperatureBucket,
} from './src/lib/outfitLogic.ts'

interface TestResult {
  name: string
  passed: boolean
  message: string
}

const results: TestResult[] = {}

function test(name: string, condition: boolean, message: string): void {
  results[name] = {
    name,
    passed: condition,
    message: condition ? '✅ PASS' : `❌ FAIL: ${message}`,
  }
}

console.log('🧪 Testing Weather Code Modifiers (Feature #21)\n')

// Test 1: Rain weather detection
console.log('📋 Test 1: Rain Weather Detection')

const rainCodes = [
  51, 53, 55, // Drizzle
  56, 57, // Freezing drizzle
  61, 63, 65, // Rain
  66, 67, // Freezing rain
  80, 81, 82, // Rain showers
  95, 96, 99, // Thunderstorm
]

rainCodes.forEach((code) => {
  test(
    `isRainWeather(${code})`,
    isRainWeather(code),
    `Code ${code} should be detected as rain`
  )
})

// Test non-rain codes
const nonRainCodes = [0, 1, 2, 3, 45, 48, 71, 73, 75, 77, 85, 86]
nonRainCodes.forEach((code) => {
  test(
    `isRainWeather(${code}) returns false`,
    !isRainWeather(code),
    `Code ${code} should NOT be detected as rain`
  )
})

// Test 2: Snow weather detection
console.log('\n📋 Test 2: Snow Weather Detection')

const snowCodes = [
  71, 73, 75, // Snow
  77, // Snow grains
  85, 86, // Snow showers
]

snowCodes.forEach((code) => {
  test(
    `isSnowWeather(${code})`,
    isSnowWeather(code),
    `Code ${code} should be detected as snow`
  )
})

// Test non-snow codes
const nonSnowCodes = [0, 1, 2, 3, 45, 48, 51, 53, 55, 61, 63, 65, 80, 81, 82]
nonSnowCodes.forEach((code) => {
  test(
    `isSnowWeather(${code}) returns false`,
    !isSnowWeather(code),
    `Code ${code} should NOT be detected as snow`
  )
})

// Test 3: Weather modifier detection
console.log('\n📋 Test 3: Weather Modifier Detection')

test(
  'getWeatherModifier(0) returns "none"',
  getWeatherModifier(0) === 'none',
  'Clear weather should have no modifier'
)

test(
  'getWeatherModifier(63) returns "rain"',
  getWeatherModifier(63) === 'rain',
  'Rain code should return rain modifier'
)

test(
  'getWeatherModifier(73) returns "snow"',
  getWeatherModifier(73) === 'snow',
  'Snow code should return snow modifier'
)

// Test 4: Outfit modification for rain
console.log('\n📋 Test 4: Outfit Modification for Rain')

const mildRainOutfit = getOutfitWithWeather('mild', 63)
test(
  'Rain adds umbrella to mild outfit',
  mildRainOutfit.includes('☂️'),
  `Expected umbrella in rain outfit, got: ${mildRainOutfit.join(' ')}`
)

const coldRainOutfit = getOutfitWithWeather('cold', 61)
test(
  'Rain adds umbrella to cold outfit',
  coldRainOutfit.includes('☂️'),
  `Expected umbrella in cold rain outfit, got: ${coldRainOutfit.join(' ')}`
)

// Test 5: Outfit modification for snow
console.log('\n📋 Test 5: Outfit Modification for Snow')

const coldSnowOutfit = getOutfitWithWeather('cold', 73)
test(
  'Snow adds extra scarf to cold outfit',
  coldSnowOutfit.filter((e) => e === '🧣').length >= 2,
  `Expected at least 2 scarves in snow outfit, got: ${coldSnowOutfit.join(' ')}`
)

test(
  'Snow adds extra gloves to cold outfit',
  coldSnowOutfit.filter((e) => e === '🧤').length >= 1,
  `Expected at least 1 pair of gloves in snow outfit, got: ${coldSnowOutfit.join(' ')}`
)

const mildSnowOutfit = getOutfitWithWeather('mild', 85)
test(
  'Snow adds scarf to mild outfit',
  mildSnowOutfit.includes('🧣'),
  `Expected scarf in mild snow outfit, got: ${mildSnowOutfit.join(' ')}`
)

test(
  'Snow adds gloves to mild outfit',
  mildSnowOutfit.includes('🧤'),
  `Expected gloves in mild snow outfit, got: ${mildSnowOutfit.join(' ')}`
)

// Test 6: No modification for clear weather
console.log('\n📋 Test 6: No Modification for Clear Weather')

const mildClearOutfit = getOutfitWithWeather('mild', 0)
const mildBaseOutfitLength = 4 // Base mild outfit has 4 items
test(
  'Clear weather does not add items',
  mildClearOutfit.length === mildBaseOutfitLength,
  `Expected ${mildBaseOutfitLength} items, got ${mildClearOutfit.length}: ${mildClearOutfit.join(' ')}`
)

// Test 7: All temperature buckets work with modifiers
console.log('\n📋 Test 7: All Temperature Buckets Work with Modifiers')

const buckets: TemperatureBucket[] = [
  'freezing',
  'cold',
  'cool',
  'mild',
  'warm',
  'hot',
]

buckets.forEach((bucket) => {
  const rainOutfit = getOutfitWithWeather(bucket, 63)
  test(
    `${bucket} with rain has umbrella`,
    rainOutfit.includes('☂️'),
    `${bucket} rain outfit should have umbrella`
  )

  const snowOutfit = getOutfitWithWeather(bucket, 73)
  test(
    `${bucket} with snow has extra gear`,
    snowOutfit.includes('🧣') || snowOutfit.includes('🧤'),
    `${bucket} snow outfit should have extra gear`
  )
})

// Test 8: Edge cases
console.log('\n📋 Test 8: Edge Cases')

// Thunderstorm (should be rain)
test(
  'Thunderstorm (95) is detected as rain',
  isRainWeather(95),
  'Thunderstorm should be detected as rain'
)

const thunderstormOutfit = getOutfitWithWeather('mild', 95)
test(
  'Thunderstorm adds umbrella',
  thunderstormOutfit.includes('☂️'),
  'Thunderstorm outfit should have umbrella'
)

// Violent rain showers (should be rain)
test(
  'Violent rain showers (82) is detected as rain',
  isRainWeather(82),
  'Violent rain showers should be detected as rain'
)

// Heavy snow showers (should be snow)
test(
  'Heavy snow showers (86) is detected as snow',
  isSnowWeather(86),
  'Heavy snow showers should be detected as snow'
)

// Print results
console.log('\n' + '='.repeat(60))
console.log('📊 TEST RESULTS')
console.log('='.repeat(60))

const entries = Object.entries(results)
const passed = entries.filter(([, r]) => r.passed).length
const failed = entries.filter(([, r]) => !r.passed).length

entries.forEach(([, result]) => {
  console.log(result.message)
})

console.log('\n' + '='.repeat(60))
console.log(`Total: ${entries.length} tests`)
console.log(`✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log(`Success Rate: ${((passed / entries.length) * 100).toFixed(1)}%`)
console.log('='.repeat(60))

// Exit with appropriate code
Deno.exit(failed > 0 ? 1 : 0)
