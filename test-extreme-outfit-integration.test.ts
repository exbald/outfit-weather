/**
 * Test Feature #76: Extreme temperature outfit integration with modifiers
 */

import {
  getTemperatureBucket,
  getOutfitWithWeather,
  getOutfitWithUV,
  getOutfitWithPrecipitation,
  getOutfitEmojis,
} from './src/lib/outfitLogic'

console.log('=== Feature #76: Extreme Temperature Outfit Integration Test ===\n')

// Test extreme freezing with various weather modifiers
console.log('1. Extreme Freezing (-25°F) with weather modifiers:')

const extremeFreezingBase = getOutfitEmojis('extreme_freezing')
console.log(`  Base outfit: ${extremeFreezingBase.join('')}`)

// Clear weather
const clearExtremeFreezing = getOutfitWithWeather('extreme_freezing', 0, 5, 'kmh')
console.log(`  Clear skies: ${clearExtremeFreezing.join('')}`)

// Snowy
const snowyExtremeFreezing = getOutfitWithWeather('extreme_freezing', 71, 5, 'kmh')
console.log(`  Snowy: ${snowyExtremeFreezing.join('')}`)

// Windy extreme cold
const windyExtremeFreezing = getOutfitWithWeather('extreme_freezing', 0, 25, 'kmh')
console.log(`  Windy: ${windyExtremeFreezing.join('')}`)

// Rainy (freezing rain)
const rainyExtremeFreezing = getOutfitWithWeather('extreme_freezing', 66, 5, 'kmh')
console.log(`  Freezing rain: ${rainyExtremeFreezing.join('')}`)

console.log('\n2. Extreme Heat (115°F) with weather modifiers:')

const extremeHotBase = getOutfitEmojis('extreme_hot')
console.log(`  Base outfit: ${extremeHotBase.join('')}`)

// Clear weather
const clearExtremeHot = getOutfitWithWeather('extreme_hot', 0, 5, 'kmh')
console.log(`  Clear skies: ${clearExtremeHot.join('')}`)

// Rainy extreme heat (monsoon)
const rainyExtremeHot = getOutfitWithWeather('extreme_hot', 63, 5, 'kmh')
console.log(`  Rainy: ${rainyExtremeHot.join('')}`)

console.log('\n3. Extreme temperatures with UV modifiers (daytime):')

// Extreme cold with UV
const extremeColdUV = getOutfitWithUV(extremeFreezingBase, 2, 1)
console.log(`  Extreme freezing, UV 2 (low): ${extremeColdUV.join('')}`)

const extremeColdUVHigh = getOutfitWithUV(extremeFreezingBase, 8, 1)
console.log(`  Extreme freezing, UV 8 (high): ${extremeColdUV.join('')}`)

// Extreme heat with UV
const extremeHotUV = getOutfitWithUV(extremeHotBase, 11, 1)
console.log(`  Extreme heat, UV 11 (extreme): ${extremeHotUV.join('')}`)

console.log('\n4. Extreme temperatures with precipitation probability:')

// Extreme cold with high precip chance
const extremeColdPrecip = getOutfitWithPrecipitation(extremeFreezingBase, 80)
console.log(`  Extreme freezing, 80% precip: ${extremeColdPrecip.join('')}`)

// Extreme heat with high precip chance
const extremeHotPrecip = getOutfitWithPrecipitation(extremeHotBase, 60)
console.log(`  Extreme heat, 60% precip: ${extremeHotPrecip.join('')}`)

console.log('\n5. Extreme freezing with all modifiers combined:')

const extremeFreezingAll = getOutfitWithWeather('extreme_freezing', 71, 20, 'kmh')
const extremeFreezingWithUV = getOutfitWithUV(extremeFreezingAll, 7, 1)
const extremeFreezingWithPrecip = getOutfitWithPrecipitation(extremeFreezingWithUV, 70)
console.log(`  Snowy, windy, high UV, 70% precip: ${extremeFreezingWithPrecip.join('')}`)

console.log('\n6. Extreme heat with all modifiers combined:')

const extremeHotAll = getOutfitWithWeather('extreme_hot', 0, 10, 'kmh')
const extremeHotWithUV = getOutfitWithUV(extremeHotAll, 12, 1)
const extremeHotWithPrecip = getOutfitWithPrecipitation(extremeHotWithUV, 40)
console.log(`  Clear, light wind, extreme UV, 40% precip: ${extremeHotWithPrecip.join('')}`)

console.log('\n7. Verify boundary conditions don\'t break:')

const justBelowExtremeFreezing = getTemperatureBucket(-19.9, 'F')
console.log(`  -19.9°F → ${justBelowExtremeFreezing} (should be 'freezing')`)

const exactlyExtremeFreezing = getTemperatureBucket(-20, 'F')
console.log(`  -20°F → ${exactlyExtremeFreezing} (should be 'freezing')`)

const justAboveExtremeFreezing = getTemperatureBucket(-20.1, 'F')
console.log(`  -20.1°F → ${justAboveExtremeFreezing} (should be 'extreme_freezing')`)

const justBelowExtremeHot = getTemperatureBucket(109.9, 'F')
console.log(`  109.9°F → ${justBelowExtremeHot} (should be 'hot')`)

const exactlyExtremeHot = getTemperatureBucket(110, 'F')
console.log(`  110°F → ${exactlyExtremeHot} (should be 'extreme_hot')`)

const justAboveExtremeHot = getTemperatureBucket(110.1, 'F')
console.log(`  110.1°F → ${justAboveExtremeHot} (should be 'extreme_hot')`)

console.log('\n=== All Extreme Temperature Integration Tests Complete ===')
