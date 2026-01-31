/**
 * Regression Test Suite for Feature #21: Weather Code Modifiers (Rain/Snow)
 *
 * This test verifies:
 * 1. isRainWeather() detects all 16 rain codes
 * 2. isSnowWeather() detects all 6 snow codes
 * 3. getWeatherModifier() returns correct modifier type
 * 4. getOutfitWithWeather() adds correct emojis for rain/snow
 * 5. All 6 temperature buckets work with weather modifiers
 */

import {
  isRainWeather,
  isSnowWeather,
  getWeatherModifier,
  getOutfitWithWeather,
  getTemperatureBucket,
} from './src/lib/outfitLogic.js'

interface TestResult {
  name: string
  passed: boolean
  expected: any
  actual: any
}

const results: TestResult[] = []

function test(name: string, expected: any, actual: any): void {
  const passed = JSON.stringify(expected) === JSON.stringify(actual)
  results.push({ name, passed, expected, actual })
  console.log(`${passed ? '✅' : '❌'} ${name}`)
  if (!passed) {
    console.log(`   Expected: ${JSON.stringify(expected)}`)
    console.log(`   Actual: ${JSON.stringify(actual)}`)
  }
}

console.log('\n=== Feature #21 Regression Test Suite ===\n')
console.log('Testing: Weather Code Modifiers (Rain/Snow)\n')

// ============================================================================
// TEST 1: Rain Detection (16 codes)
// ============================================================================
console.log('--- TEST 1: Rain Detection (16 codes) ---')

test('Rain code 51 (Light drizzle)', true, isRainWeather(51))
test('Rain code 53 (Moderate drizzle)', true, isRainWeather(53))
test('Rain code 55 (Dense drizzle)', true, isRainWeather(55))
test('Rain code 56 (Light freezing drizzle)', true, isRainWeather(56))
test('Rain code 57 (Dense freezing drizzle)', true, isRainWeather(57))
test('Rain code 61 (Slight rain)', true, isRainWeather(61))
test('Rain code 63 (Moderate rain)', true, isRainWeather(63))
test('Rain code 65 (Heavy rain)', true, isRainWeather(65))
test('Rain code 66 (Light freezing rain)', true, isRainWeather(66))
test('Rain code 67 (Heavy freezing rain)', true, isRainWeather(67))
test('Rain code 80 (Slight rain showers)', true, isRainWeather(80))
test('Rain code 81 (Moderate rain showers)', true, isRainWeather(81))
test('Rain code 82 (Violent rain showers)', true, isRainWeather(82))
test('Rain code 95 (Thunderstorm)', true, isRainWeather(95))
test('Rain code 96 (Thunderstorm with hail)', true, isRainWeather(96))
test('Rain code 99 (Thunderstorm with heavy hail)', true, isRainWeather(99))

// Verify non-rain codes are not detected as rain
test('Clear sky (0) is not rain', false, isRainWeather(0))
test('Snow code 71 is not rain', false, isRainWeather(71))

// ============================================================================
// TEST 2: Snow Detection (6 codes)
// ============================================================================
console.log('\n--- TEST 2: Snow Detection (6 codes) ---')

test('Snow code 71 (Slight snow)', true, isSnowWeather(71))
test('Snow code 73 (Moderate snow)', true, isSnowWeather(73))
test('Snow code 75 (Heavy snow)', true, isSnowWeather(75))
test('Snow code 77 (Snow grains)', true, isSnowWeather(77))
test('Snow code 85 (Slight snow showers)', true, isSnowWeather(85))
test('Snow code 86 (Heavy snow showers)', true, isSnowWeather(86))

// Verify non-snow codes are not detected as snow
test('Clear sky (0) is not snow', false, isSnowWeather(0))
test('Rain code 63 is not snow', false, isSnowWeather(63))

// ============================================================================
// TEST 3: Weather Modifier Detection
// ============================================================================
console.log('\n--- TEST 3: Weather Modifier Detection ---')

test('Clear sky returns "none"', 'none', getWeatherModifier(0))
test('Rain code 63 returns "rain"', 'rain', getWeatherModifier(63))
test('Snow code 73 returns "snow"', 'snow', getWeatherModifier(73))
test('Rain takes precedence over snow', 'rain', getWeatherModifier(95)) // Thunderstorm (rain+ snow-like)

// ============================================================================
// TEST 4: Outfit Modification - Rain
// ============================================================================
console.log('\n--- TEST 4: Outfit Modification - Rain ---')

// Mild + Rain
test(
  'Mild + Rain adds umbrella',
  ['🧥', '👕', '👖', '👟', '☂️'],
  getOutfitWithWeather('mild', 63)
)

// Cold + Rain
test(
  'Cold + Rain adds umbrella',
  ['🧥', '🧣', '👖', '🥾', '☂️'],
  getOutfitWithWeather('cold', 65)
)

// Hot + Rain (thunderstorm)
test(
  'Hot + Thunderstorm adds umbrella',
  ['👕', '🩳', '👟', '🧢', '🕶️', '☂️'],
  getOutfitWithWeather('hot', 95)
)

// ============================================================================
// TEST 5: Outfit Modification - Snow
// ============================================================================
console.log('\n--- TEST 5: Outfit Modification - Snow ---')

// Freezing + Snow
test(
  'Freezing + Snow adds extra scarf and gloves',
  ['🧥', '🧣', '🧤', '🥾', '🧢', '🧣', '🧤'],
  getOutfitWithWeather('freezing', 73)
)

// Cold + Snow
test(
  'Cold + Snow adds extra scarf and gloves',
  ['🧥', '🧣', '👖', '🥾', '🧣', '🧤'],
  getOutfitWithWeather('cold', 75)
)

// Cool + Snow
test(
  'Cool + Snow adds extra scarf and gloves',
  ['🧥', '👕', '👖', '👟', '🧣', '🧤'],
  getOutfitWithWeather('cool', 71)
)

// ============================================================================
// TEST 6: Outfit Modification - Clear Weather
// ============================================================================
console.log('\n--- TEST 6: Outfit Modification - Clear Weather ---')

// Mild + Clear
test(
  'Mild + Clear has no modifiers',
  ['🧥', '👕', '👖', '👟'],
  getOutfitWithWeather('mild', 0)
)

// Hot + Clear
test(
  'Hot + Clear has no modifiers',
  ['👕', '🩳', '👟', '🧢', '🕶️'],
  getOutfitWithWeather('hot', 1)
)

// ============================================================================
// TEST 7: All Temperature Buckets with Rain
// ============================================================================
console.log('\n--- TEST 7: All Temperature Buckets with Rain ---')

test('Freezing + Rain has umbrella', true, getOutfitWithWeather('freezing', 63).includes('☂️'))
test('Cold + Rain has umbrella', true, getOutfitWithWeather('cold', 63).includes('☂️'))
test('Cool + Rain has umbrella', true, getOutfitWithWeather('cool', 63).includes('☂️'))
test('Mild + Rain has umbrella', true, getOutfitWithWeather('mild', 63).includes('☂️'))
test('Warm + Rain has umbrella', true, getOutfitWithWeather('warm', 63).includes('☂️'))
test('Hot + Rain has umbrella', true, getOutfitWithWeather('hot', 95).includes('☂️'))

// ============================================================================
// TEST 8: All Temperature Buckets with Snow
// ============================================================================
console.log('\n--- TEST 8: All Temperature Buckets with Snow ---')

test('Freezing + Snow has extra scarf and gloves', true,
  getOutfitWithWeather('freezing', 73).includes('🧣') && getOutfitWithWeather('freezing', 73).includes('🧤'))
test('Cold + Snow has extra scarf and gloves', true,
  getOutfitWithWeather('cold', 75).includes('🧣') && getOutfitWithWeather('cold', 75).includes('🧤'))
test('Cool + Snow has extra scarf and gloves', true,
  getOutfitWithWeather('cool', 71).includes('🧣') && getOutfitWithWeather('cool', 71).includes('🧤'))
test('Mild + Snow has extra scarf and gloves', true,
  getOutfitWithWeather('mild', 86).includes('🧣') && getOutfitWithWeather('mild', 86).includes('🧤'))
test('Warm + Snow has extra scarf and gloves', true,
  getOutfitWithWeather('warm', 77).includes('🧣') && getOutfitWithWeather('warm', 77).includes('🧤'))
test('Hot + Snow has extra scarf and gloves', true,
  getOutfitWithWeather('hot', 85).includes('🧣') && getOutfitWithWeather('hot', 85).includes('🧤'))

// ============================================================================
// TEST 9: Edge Cases and Boundary Values
// ============================================================================
console.log('\n--- TEST 9: Edge Cases and Boundary Values ---')

// Freezing drizzle (56, 57) - detected as rain only (not snow in original spec)
test('Freezing drizzle 56 is rain', true, isRainWeather(56))
test('Freezing drizzle 56 is NOT snow', false, isSnowWeather(56))
test('Freezing drizzle 57 is rain', true, isRainWeather(57))
test('Freezing drizzle 57 is NOT snow', false, isSnowWeather(57))

// Freezing rain (66, 67) - detected as rain only (not snow in original spec)
test('Freezing rain 66 is rain', true, isRainWeather(66))
test('Freezing rain 66 is NOT snow', false, isSnowWeather(66))
test('Freezing rain 67 is rain', true, isRainWeather(67))
test('Freezing rain 67 is NOT snow', false, isSnowWeather(67))

// Rain takes precedence over snow
test('Freezing drizzle 56 modifier is rain', 'rain', getWeatherModifier(56))
test('Freezing rain 66 modifier is rain', 'rain', getWeatherModifier(66))

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n=== Test Summary ===')

const passed = results.filter((r) => r.passed).length
const failed = results.filter((r) => !r.passed).length
const total = results.length

console.log(`\nTotal Tests: ${total}`)
console.log(`Passed: ${passed}`)
console.log(`Failed: ${failed}`)
console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`)

if (failed > 0) {
  console.log('\n❌ FAILED TESTS:')
  results
    .filter((r) => !r.passed)
    .forEach((r) => {
      console.log(`  - ${r.name}`)
      console.log(`    Expected: ${JSON.stringify(r.expected)}`)
      console.log(`    Actual: ${JSON.stringify(r.actual)}`)
    })
  process.exit(1)
} else {
  console.log('\n✅ ALL TESTS PASSED!')
  console.log('\nFeature #21: Weather Code Modifiers (Rain/Snow) is WORKING CORRECTLY')
  process.exit(0)
}
