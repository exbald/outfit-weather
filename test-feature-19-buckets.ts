/**
 * Regression Test for Feature #19: Temperature buckets defined
 *
 * This test verifies that temperature buckets are properly defined with:
 * 1. Bucket boundaries defined correctly
 * 2. Support for both °C and °F
 * 3. Bucket classification function works
 */

import {
  getTemperatureBucket,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  FAHRENHEIT_BUCKETS,
  CELSIUS_BUCKETS,
  type TemperatureBucket,
  type TemperatureUnit,
} from './src/lib/outfitLogic'

console.log('=== Feature #19 Regression Test: Temperature Buckets ===\n')

let testsPassed = 0
let testsFailed = 0

function test(description: string, fn: () => boolean) {
  const result = fn()
  if (result) {
    console.log(`✓ ${description}`)
    testsPassed++
  } else {
    console.log(`✗ ${description}`)
    testsFailed++
  }
}

// Step 1: Define bucket boundaries
console.log('--- Step 1: Bucket Boundaries Defined ---')

test('Freezing bucket: max is 32°F', () => FAHRENHEIT_BUCKETS.freezing.max === 32)
test('Cold bucket: min 32°F, max 50°F', () =>
  FAHRENHEIT_BUCKETS.cold.min === 32 && FAHRENHEIT_BUCKETS.cold.max === 50
)
test('Cool bucket: min 50°F, max 65°F', () =>
  FAHRENHEIT_BUCKETS.cool.min === 50 && FAHRENHEIT_BUCKETS.cool.max === 65
)
test('Mild bucket: min 65°F, max 70°F', () =>
  FAHRENHEIT_BUCKETS.mild.min === 65 && FAHRENHEIT_BUCKETS.mild.max === 70
)
test('Warm bucket: min 70°F, max 80°F', () =>
  FAHRENHEIT_BUCKETS.warm.min === 70 && FAHRENHEIT_BUCKETS.warm.max === 80
)
test('Hot bucket: min is 80°F', () => FAHRENHEIT_BUCKETS.hot.min === 80)

test('Freezing bucket: max is 0°C', () => CELSIUS_BUCKETS.freezing.max === 0)
test('Cold bucket: min 0°C, max 10°C', () =>
  CELSIUS_BUCKETS.cold.min === 0 && CELSIUS_BUCKETS.cold.max === 10
)
test('Cool bucket: min 10°C, max 18°C', () =>
  CELSIUS_BUCKETS.cool.min === 10 && CELSIUS_BUCKETS.cool.max === 18
)
test('Mild bucket: min 18°C, max 21°C', () =>
  CELSIUS_BUCKETS.mild.min === 18 && CELSIUS_BUCKETS.mild.max === 21
)
test('Warm bucket: min 21°C, max 27°C', () =>
  CELSIUS_BUCKETS.warm.min === 21 && CELSIUS_BUCKETS.warm.max === 27
)
test('Hot bucket: min is 27°C', () => CELSIUS_BUCKETS.hot.min === 27)

// Step 2: Support both °C and °F
console.log('\n--- Step 2: Support for Both Units ---')

test('Celsius to Fahrenheit conversion: 0°C = 32°F', () =>
  celsiusToFahrenheit(0) === 32
)
test('Celsius to Fahrenheit conversion: 100°C = 212°F', () =>
  celsiusToFahrenheit(100) === 212
)
test('Celsius to Fahrenheit conversion: -40°C = -40°F', () =>
  celsiusToFahrenheit(-40) === -40
)

test('Fahrenheit to Celsius conversion: 32°F = 0°C', () =>
  fahrenheitToCelsius(32) === 0
)
test('Fahrenheit to Celsius conversion: 212°F = 100°C', () =>
  fahrenheitToCelsius(212) === 100
)
test('Fahrenheit to Celsius conversion: -40°F = -40°C', () =>
  fahrenheitToCelsius(-40) === -40
)

// Step 3: Bucket classification function
console.log('\n--- Step 3: Bucket Classification Function ---')

// Test Fahrenheit classification
test('Classify 20°F as freezing (F)', () => getTemperatureBucket(20, 'F') === 'freezing')
test('Classify 40°F as cold (F)', () => getTemperatureBucket(40, 'F') === 'cold')
test('Classify 60°F as cool (F)', () => getTemperatureBucket(60, 'F') === 'cool')
test('Classify 67°F as mild (F)', () => getTemperatureBucket(67, 'F') === 'mild')
test('Classify 75°F as warm (F)', () => getTemperatureBucket(75, 'F') === 'warm')
test('Classify 85°F as hot (F)', () => getTemperatureBucket(85, 'F') === 'hot')

// Test Celsius classification
test('Classify -10°C as freezing (C)', () => getTemperatureBucket(-10, 'C') === 'freezing')
test('Classify 5°C as cold (C)', () => getTemperatureBucket(5, 'C') === 'cold')
test('Classify 15°C as cool (C)', () => getTemperatureBucket(15, 'C') === 'cool')
test('Classify 19°C as mild (C)', () => getTemperatureBucket(19, 'C') === 'mild')
test('Classify 25°C as warm (C)', () => getTemperatureBucket(25, 'C') === 'warm')
test('Classify 30°C as hot (C)', () => getTemperatureBucket(30, 'C') === 'hot')

// Test boundary values (critical for correctness)
test('Boundary: 32°F is cold (not freezing)', () => getTemperatureBucket(32, 'F') === 'cold')
test('Boundary: 50°F is cool (not cold)', () => getTemperatureBucket(50, 'F') === 'cool')
test('Boundary: 65°F is mild (not cool)', () => getTemperatureBucket(65, 'F') === 'mild')
test('Boundary: 70°F is warm (not mild)', () => getTemperatureBucket(70, 'F') === 'warm')
test('Boundary: 80°F is hot (not warm)', () => getTemperatureBucket(80, 'F') === 'hot')

test('Boundary: 0°C is cold (not freezing)', () => getTemperatureBucket(0, 'C') === 'cold')
test('Boundary: 10°C is cool (not cold)', () => getTemperatureBucket(10, 'C') === 'cool')
test('Boundary: 18°C is mild (not cool)', () => getTemperatureBucket(18, 'C') === 'mild')
test('Boundary: 21°C is warm (not mild)', () => getTemperatureBucket(21, 'C') === 'warm')
test('Boundary: 27°C is hot (not warm)', () => getTemperatureBucket(27, 'C') === 'hot')

// Test default parameter (defaults to Fahrenheit)
test('Default unit: 75°F with no unit specified', () => getTemperatureBucket(75) === 'warm')
test('Default unit: 30°F with no unit specified (is freezing)', () => getTemperatureBucket(30) === 'freezing')
test('Default unit: 35°F with no unit specified (is cold)', () => getTemperatureBucket(35) === 'cold')

// Summary
console.log('\n=== Test Summary ===')
console.log(`Total tests: ${testsPassed + testsFailed}`)
console.log(`Passed: ${testsPassed}`)
console.log(`Failed: ${testsFailed}`)

if (testsFailed === 0) {
  console.log('\n✅ Feature #19: ALL TESTS PASSED')
  console.log('Temperature buckets are properly defined with:')
  console.log('  ✓ Correct bucket boundaries in both °F and °C')
  console.log('  ✓ Unit conversion functions work correctly')
  console.log('  ✓ Classification function handles all buckets')
  console.log('  ✓ Boundary values are handled correctly')
  process.exit(0)
} else {
  console.log('\n❌ Feature #19: SOME TESTS FAILED')
  process.exit(1)
}
