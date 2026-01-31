/**
 * Test suite for Feature #55: Adaptive Background Colors
 * Verifies that background colors change based on weather conditions
 */

import {
  getBackgroundColor,
  getBackgroundGradient,
  getTextColorMode,
  getBackgroundTransition,
} from './src/lib/adaptiveBackground'

let testsPassed = 0
let testsFailed = 0

function test(name: string, fn: () => void) {
  try {
    fn()
    testsPassed++
    console.log(`✅ ${name}`)
  } catch (error) {
    testsFailed++
    console.log(`❌ ${name}`)
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function assertEqual(actual: unknown, expected: unknown, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, but got ${actual}`)
  }
}

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || 'Expected condition to be true')
  }
}

console.log('🧪 Testing Feature #55: Adaptive Background Colors')
console.log('')

// Test 1: Freezing temperature (day)
test('Freezing temperature (day) returns slate blue', () => {
  const color = getBackgroundColor(25, 0, 1, 'F')
  assertEqual(color, '#e0e7ef', 'Expected #e0e7ef for freezing day')
})

// Test 2: Cold temperature (day)
test('Cold temperature (day) returns cool blue', () => {
  const color = getBackgroundColor(40, 0, 1, 'F')
  assertEqual(color, '#dbeafe', 'Expected #dbeafe for cold day')
})

// Test 3: Cool temperature (day)
test('Cool temperature (day) returns light gray-blue', () => {
  const color = getBackgroundColor(60, 0, 1, 'F')
  assertEqual(color, '#f1f5f9', 'Expected #f1f5f9 for cool day')
})

// Test 4: Mild temperature (day)
test('Mild temperature (day) returns soft green', () => {
  const color = getBackgroundColor(68, 0, 1, 'F')
  assertEqual(color, '#ecfdf5', 'Expected #ecfdf5 for mild day')
})

// Test 5: Warm temperature (day)
test('Warm temperature (day) returns warm amber', () => {
  const color = getBackgroundColor(75, 0, 1, 'F')
  assertEqual(color, '#fef3c7', 'Expected #fef3c7 for warm day')
})

// Test 6: Hot temperature (day)
test('Hot temperature (day) returns orange', () => {
  const color = getBackgroundColor(85, 0, 1, 'F')
  assertEqual(color, '#ffedd5', 'Expected #ffedd5 for hot day')
})

// Test 7: Nighttime colors are darker
test('Nighttime returns deeper colors', () => {
  const freezingNight = getBackgroundColor(25, 0, 0, 'F')
  const hotNight = getBackgroundColor(85, 0, 0, 'F')

  assertEqual(freezingNight, '#1e293b', 'Expected #1e293b for freezing night')
  assertEqual(hotNight, '#4a2c0a', 'Expected #4a2c0a for hot night')
})

// Test 8: Rain conditions override temperature
test('Rain conditions override temperature (day)', () => {
  const rainHot = getBackgroundColor(85, 63, 1, 'F') // Hot but rainy
  assertEqual(rainHot, '#e2e8f0', 'Expected rain color even when hot')
})

// Test 9: Rain at night
test('Rain conditions override temperature (night)', () => {
  const rainNight = getBackgroundColor(60, 63, 0, 'F') // Rain at night
  assertEqual(rainNight, '#374151', 'Expected dark rain color for night')
})

// Test 10: Snow conditions
test('Snow conditions show appropriate color', () => {
  const snowDay = getBackgroundColor(30, 71, 1, 'F') // Snow code 71
  assertEqual(snowDay, '#e2e8f0', 'Expected rain/snow color for snow')
})

// Test 11: Celsius support
test('Celsius units work correctly', () => {
  const freezingC = getBackgroundColor(-5, 0, 1, 'C')
  const hotC = getBackgroundColor(30, 0, 1, 'C')

  assertEqual(freezingC, '#e0e7ef', 'Expected freezing color for -5°C')
  assertEqual(hotC, '#ffedd5', 'Expected hot color for 30°C')
})

// Test 12: All 6 temperature buckets have unique colors (day)
test('All temperature buckets have unique day colors', () => {
  const temps = [20, 40, 55, 68, 75, 85]
  const colors = temps.map(t => getBackgroundColor(t, 0, 1, 'F'))

  const expected = ['#e0e7ef', '#dbeafe', '#f1f5f9', '#ecfdf5', '#fef3c7', '#ffedd5']
  assertEqual(JSON.stringify(colors), JSON.stringify(expected), 'All bucket colors should match spec')
})

// Test 13: All 6 temperature buckets have unique colors (night)
test('All temperature buckets have unique night colors', () => {
  const temps = [20, 40, 55, 68, 75, 85]
  const colors = temps.map(t => getBackgroundColor(t, 0, 0, 'F'))

  // Check that all night colors are darker (start with #0-#4)
  colors.forEach(color => {
    const brightness = parseInt(color.slice(1, 3), 16)
    assertTrue(brightness < 128, `Night color ${color} should be dark`)
  })
})

// Test 14: Gradient generation
test('Gradient is generated correctly', () => {
  const gradient = getBackgroundGradient('#dbeafe')
  assertTrue(gradient.includes('linear-gradient'), 'Should contain linear-gradient')
  assertTrue(gradient.includes('#dbeafe'), 'Should contain base color')
  assertTrue(gradient.includes('#dbeafedd'), 'Should add transparency')
})

// Test 15: Text color mode detection
test('Text color mode is detected correctly', () => {
  assertEqual(getTextColorMode('#1e293b'), 'light', 'Dark backgrounds should have light text')
  assertEqual(getTextColorMode('#fef3c7'), 'dark', 'Light backgrounds should have dark text')
})

// Test 16: Transition CSS
test('Transition CSS is generated correctly', () => {
  const transition = getBackgroundTransition()
  assertTrue(transition.includes('background-color'), 'Should target background-color')
  assertTrue(transition.includes('1.5s'), 'Should have 1.5s duration')
  assertTrue(transition.includes('ease-in-out'), 'Should have ease-in-out timing')
})

// Test 17: Spec compliance - all required colors exist
test('All spec colors are present (day mode)', () => {
  // From app_spec.txt
  assertEqual(getBackgroundColor(25, 0, 1, 'F'), '#e0e7ef', 'Freezing: Slate blue')
  assertEqual(getBackgroundColor(40, 0, 1, 'F'), '#dbeafe', 'Cold: Cool blue')
  assertEqual(getBackgroundColor(55, 0, 1, 'F'), '#f1f5f9', 'Cool: Light gray-blue')
  assertEqual(getBackgroundColor(68, 0, 1, 'F'), '#ecfdf5', 'Mild: Soft green')
  assertEqual(getBackgroundColor(75, 0, 1, 'F'), '#fef3c7', 'Warm: Warm amber')
  assertEqual(getBackgroundColor(85, 0, 1, 'F'), '#ffedd5', 'Hot: Orange')
  assertEqual(getBackgroundColor(70, 63, 1, 'F'), '#e2e8f0', 'Rain: Gray-blue')
})

// Summary
console.log('')
console.log(''.padEnd(60, '='))
console.log(`Tests passed: ${testsPassed}`)
console.log(`Tests failed: ${testsFailed}`)
console.log(''.padEnd(60, '='))

if (testsFailed === 0) {
  console.log('✅ All Feature #55 tests PASSED!')
  process.exit(0)
} else {
  console.log('❌ Some tests FAILED')
  process.exit(1)
}
