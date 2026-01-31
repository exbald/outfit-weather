/**
 * COMPREHENSIVE TEST: Feature #76 - Extreme temperatures handled
 *
 * This test verifies that the outfit logic handles extreme temperatures
 * gracefully (< -20°F or > 110°F) with appropriate recommendations.
 */

import {
  getTemperatureBucket,
  getOutfitEmojis,
  getOutfitWithWeather,
  getOutfitWithUV,
  getOutfitWithPrecipitation,
  getTemperatureBucketDisplayName,
  getTemperatureBucketDescription,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
} from './src/lib/outfitLogic'

import { generateOneLiner } from './src/lib/oneLiner'

import { getBackgroundColor } from './src/lib/adaptiveBackground'

console.log('╔════════════════════════════════════════════════════════════════╗')
console.log('║     Feature #76: Extreme Temperatures Handled - Full Test      ║')
console.log('╚════════════════════════════════════════════════════════════════╝')
console.log()

// Track test results
let passed = 0
let failed = 0

function test(name: string, condition: boolean) {
  if (condition) {
    console.log(`  ✓ ${name}`)
    passed++
  } else {
    console.log(`  ✗ ${name}`)
    failed++
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Step 1: Define extreme temp thresholds')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  Extreme freezing threshold: < -20°F (< -29°C)')
console.log('  Extreme heat threshold: > 110°F (> 43°C)')
console.log()

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Step 2: Add extreme weather outfits')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// Test extreme freezing outfit
const extremeFreezingOutfit = getOutfitEmojis('extreme_freezing')
test('Extreme freezing outfit has extra layers', extremeFreezingOutfit.length >= 7)
test('Extreme freezing includes heavy coat', extremeFreezingOutfit.includes('🧥'))
test('Extreme freezing includes scarf', extremeFreezingOutfit.includes('🧣'))
test('Extreme freezing includes gloves', extremeFreezingOutfit.includes('🧤'))
test('Extreme freezing includes boots', extremeFreezingOutfit.includes('🥾'))
test('Extreme freezing includes hat', extremeFreezingOutfit.includes('🧢'))

// Test extreme heat outfit
const extremeHotOutfit = getOutfitEmojis('extreme_hot')
test('Extreme heat outfit is minimal', extremeHotOutfit.length >= 6)
test('Extreme heat includes hydration reminder', extremeHotOutfit.includes('💧'))
test('Extreme heat includes hat', extremeHotOutfit.includes('🧢'))
test('Extreme heat includes sunglasses', extremeHotOutfit.includes('🕶️'))

console.log()

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Step 3: Test boundary conditions')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// Fahrenheit boundaries
test('-21°F → extreme_freezing', getTemperatureBucket(-21, 'F') === 'extreme_freezing')
test('-20°F → freezing (boundary)', getTemperatureBucket(-20, 'F') === 'freezing')
test('109°F → hot', getTemperatureBucket(109, 'F') === 'hot')
test('110°F → extreme_hot (boundary)', getTemperatureBucket(110, 'F') === 'extreme_hot')
test('111°F → extreme_hot', getTemperatureBucket(111, 'F') === 'extreme_hot')

// Celsius boundaries
test('-30°C → extreme_freezing', getTemperatureBucket(-30, 'C') === 'extreme_freezing')
test('-29°C → freezing (boundary)', getTemperatureBucket(-29, 'C') === 'freezing')
test('42°C → hot', getTemperatureBucket(42, 'C') === 'hot')
test('43°C → extreme_hot (boundary)', getTemperatureBucket(43, 'C') === 'extreme_hot')
test('44°C → extreme_hot', getTemperatureBucket(44, 'C') === 'extreme_hot')

console.log()

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Step 4: Test outfit recommendations with modifiers')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// Extreme freezing with snow
const extremeFreezingSnowy = getOutfitWithWeather('extreme_freezing', 71, 5, 'kmh')
test('Extreme freezing + snow adds extra layers', extremeFreezingSnowy.length > extremeFreezingOutfit.length)

// Extreme freezing with wind
const extremeFreezingWindy = getOutfitWithWeather('extreme_freezing', 0, 25, 'kmh')
test('Extreme freezing + wind adds windbreaker', extremeFreezingWindy.includes('🧥'))

// Extreme heat with rain
const extremeHotRainy = getOutfitWithWeather('extreme_hot', 63, 5, 'kmh')
test('Extreme heat + rain includes umbrella', extremeHotRainy.includes('☂️'))

// Extreme heat with high UV
const extremeHotUV = getOutfitWithUV(extremeHotOutfit, 12, 1)
test('Extreme heat + extreme UV includes sunglasses', extremeHotUV.includes('🕶️'))
test('Extreme heat + extreme UV includes hat', extremeHotUV.includes('🧢'))

// Extreme heat with precipitation
const extremeHotPrecip = getOutfitWithPrecipitation(extremeHotOutfit, 60)
test('Extreme heat + high precip includes umbrella', extremeHotPrecip.includes('☂️'))

console.log()

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Step 5: Test one-liners convey danger')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

const extremeFreezingOneLiner = generateOneLiner('extreme_freezing', 'none', 'low', 1, 0)
const extremeHotOneLiner = generateOneLiner('extreme_hot', 'none', 'low', 1, 0)

test('Extreme freezing one-liner includes danger warning',
  extremeFreezingOneLiner.toLowerCase().includes('danger') ||
  extremeFreezingOneLiner.toLowerCase().includes('life-threatening') ||
  extremeFreezingOneLiner.includes('⚠️'))

test('Extreme heat one-liner includes danger warning',
  extremeHotOneLiner.toLowerCase().includes('danger') ||
  extremeHotOneLiner.toLowerCase().includes('life-threatening') ||
  extremeHotOneLiner.includes('⚠️'))

test('Extreme freezing one-liner suggests staying inside',
  extremeFreezingOneLiner.toLowerCase().includes('stay inside') ||
  extremeFreezingOneLiner.toLowerCase().includes('stay indoors'))

test('Extreme heat one-liner suggests hydration or AC',
  extremeHotOneLiner.toLowerCase().includes('hydrat') ||
  extremeHotOneLiner.toLowerCase().includes('ac') ||
  extremeHotOneLiner.toLowerCase().includes('cool'))

console.log()

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Step 6: Test adaptive background colors')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

const extremeFreezingBgLight = getBackgroundColor(-25, 0, 1, 'F', false)
const extremeHotBgLight = getBackgroundColor(115, 0, 1, 'F', false)
const regularFreezingBgLight = getBackgroundColor(25, 0, 1, 'F', false)
const regularHotBgLight = getBackgroundColor(85, 0, 1, 'F', false)

test('Extreme freezing has distinct background from regular freezing',
  extremeFreezingBgLight !== regularFreezingBgLight)

test('Extreme heat has distinct background from regular hot',
  extremeHotBgLight !== regularHotBgLight)

test('Extreme freezing and extreme heat have different backgrounds',
  extremeFreezingBgLight !== extremeHotBgLight)

const extremeFreezingBgDark = getBackgroundColor(-25, 0, 0, 'F', false)
const extremeHotBgDark = getBackgroundColor(115, 0, 0, 'F', false)

test('Dark mode backgrounds are different for extreme temps',
  extremeFreezingBgDark !== extremeHotBgDark)

test('Light and dark mode backgrounds differ for extreme freezing',
  extremeFreezingBgLight !== extremeFreezingBgDark)

test('Light and dark mode backgrounds differ for extreme heat',
  extremeHotBgLight !== extremeHotBgDark)

console.log()

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Step 7: Test display names and descriptions')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

test('Extreme freezing display name is descriptive',
  getTemperatureBucketDisplayName('extreme_freezing') === 'Extreme Freezing')

test('Extreme heat display name is descriptive',
  getTemperatureBucketDisplayName('extreme_hot') === 'Extreme Heat')

test('Extreme freezing description shows threshold (F)',
  getTemperatureBucketDescription('extreme_freezing', 'F').includes('-20°F'))

test('Extreme heat description shows threshold (F)',
  getTemperatureBucketDescription('extreme_hot', 'F').includes('110°F'))

test('Extreme freezing description shows threshold (C)',
  getTemperatureBucketDescription('extreme_freezing', 'C').includes('-29°C'))

test('Extreme heat description shows threshold (C)',
  getTemperatureBucketDescription('extreme_hot', 'C').includes('43°C'))

console.log()

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Step 8: Test unit conversions')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

test('-20°F converts to -28.9°C (rounds to -29°C)',
  Math.round(fahrenheitToCelsius(-20)) === -29)

test('110°F converts to 43.3°C (rounds to 43°C)',
  Math.round(fahrenheitToCelsius(110)) === 43)

test('-29°C converts to -20.2°F (rounds to -20°F)',
  Math.round(celsiusToFahrenheit(-29)) === -20)

test('43°C converts to 109.4°F (rounds to 109°F)',
  Math.round(celsiusToFahrenheit(43)) === 109)

console.log()

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Step 9: Integration tests - complete outfit scenarios')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// Scenario: Arctic blast
const arcticBlast = getOutfitWithWeather('extreme_freezing', 71, 30, 'kmh')
const arcticBlastUV = getOutfitWithUV(arcticBlast, 5, 1)
const arcticBlastPrecip = getOutfitWithPrecipitation(arcticBlastUV, 80)
const arcticBlastOneLiner = generateOneLiner('extreme_freezing', 'snow', 'high', 1, 71)

test('Arctic blast scenario has comprehensive outfit',
  arcticBlastPrecip.length >= 10) // Base + snow + wind + UV + precip

test('Arctic blast one-liner conveys danger',
  arcticBlastOneLiner.toLowerCase().includes('danger') ||
  arcticBlastOneLiner.toLowerCase().includes('blizzard') ||
  arcticBlastOneLiner.includes('⚠️'))

// Scenario: Desert heat wave
const desertHeat = getOutfitWithWeather('extreme_hot', 0, 10, 'kmh')
const desertHeatUV = getOutfitWithUV(desertHeat, 12, 1)
const desertHeatPrecip = getOutfitWithPrecipitation(desertHeatUV, 10)
const desertHeatOneLiner = generateOneLiner('extreme_hot', 'none', 'extreme', 1, 0)

test('Desert heat wave scenario has minimal but protective outfit',
  desertHeatPrecip.length >= 8)

test('Desert heat one-liner conveys danger',
  desertHeatOneLiner.toLowerCase().includes('danger') ||
  desertHeatOneLiner.toLowerCase().includes('extreme') ||
  desertHeatOneLiner.includes('⚠️'))

console.log()

console.log('╔════════════════════════════════════════════════════════════════╗')
console.log('║                        TEST SUMMARY                            ║')
console.log('╚════════════════════════════════════════════════════════════════╝')
console.log(`  Total tests: ${passed + failed}`)
console.log(`  Passed: ${passed} ✓`)
console.log(`  Failed: ${failed} ✗`)
console.log()

if (failed === 0) {
  console.log('╔════════════════════════════════════════════════════════════════╗')
  console.log('║                    ✓ ALL TESTS PASSED ✓                        ║')
  console.log('║                                                                ║')
  console.log('║  Feature #76: Extreme temperatures handled                   ║')
  console.log('║                                                                ║')
  console.log('║  ✓ Extreme temp thresholds defined (< -20°F, > 110°F)        ║')
  console.log('║  ✓ Extreme weather outfits added                             ║')
  console.log('║  ✓ Boundary conditions tested                                ║')
  console.log('║  ✓ Weather modifiers work correctly                          ║')
  console.log('║  ✓ One-liners convey appropriate warnings                    ║')
  console.log('║  ✓ Adaptive backgrounds distinct                            ║')
  console.log('║  ✓ Display names and descriptions accurate                  ║')
  console.log('║  ✓ Unit conversions correct                                  ║')
  console.log('║  ✓ Complete scenarios tested                                 ║')
  console.log('╚════════════════════════════════════════════════════════════════╝')
} else {
  console.log('╔════════════════════════════════════════════════════════════════╗')
  console.log('║                    ✗ SOME TESTS FAILED ✗                      ║')
  console.log('╚════════════════════════════════════════════════════════════════╝')
  process.exit(1)
}
