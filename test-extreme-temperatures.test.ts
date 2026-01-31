/**
 * Test Feature #76: Extreme temperatures handled
 * Verify that the outfit logic handles extreme temperatures gracefully
 */

import {
  getTemperatureBucket,
  getOutfitEmojis,
  getTemperatureBucketDisplayName,
  getTemperatureBucketDescription,
} from './src/lib/outfitLogic'

console.log('=== Feature #76: Extreme Temperatures Test ===\n')

// Test boundary conditions for extreme freezing
console.log('1. Testing Extreme Freezing Boundaries (Fahrenheit):')
const extremeFreezingTests = [
  { temp: -50, expected: 'extreme_freezing' },
  { temp: -30, expected: 'extreme_freezing' },
  { temp: -20, expected: 'freezing' }, // Boundary point
  { temp: -19, expected: 'freezing' },
]

extremeFreezingTests.forEach(({ temp, expected }) => {
  const result = getTemperatureBucket(temp, 'F')
  const status = result === expected ? '✓' : '✗'
  console.log(`  ${status} ${temp}°F → ${result} (expected: ${expected})`)
})

console.log('\n2. Testing Extreme Heat Boundaries (Fahrenheit):')
const extremeHotTests = [
  { temp: 109, expected: 'hot' },
  { temp: 110, expected: 'extreme_hot' }, // Boundary point
  { temp: 111, expected: 'extreme_hot' },
  { temp: 120, expected: 'extreme_hot' },
  { temp: 130, expected: 'extreme_hot' },
]

extremeHotTests.forEach(({ temp, expected }) => {
  const result = getTemperatureBucket(temp, 'F')
  const status = result === expected ? '✓' : '✗'
  console.log(`  ${status} ${temp}°F → ${result} (expected: ${expected})`)
})

console.log('\n3. Testing Extreme Freezing Boundaries (Celsius):')
const extremeFreezingCTests = [
  { temp: -40, expected: 'extreme_freezing' },
  { temp: -30, expected: 'extreme_freezing' },
  { temp: -29, expected: 'freezing' }, // Boundary point
  { temp: -20, expected: 'freezing' },
]

extremeFreezingCTests.forEach(({ temp, expected }) => {
  const result = getTemperatureBucket(temp, 'C')
  const status = result === expected ? '✓' : '✗'
  console.log(`  ${status} ${temp}°C → ${result} (expected: ${expected})`)
})

console.log('\n4. Testing Extreme Heat Boundaries (Celsius):')
const extremeHotCTests = [
  { temp: 42, expected: 'hot' },
  { temp: 43, expected: 'extreme_hot' }, // Boundary point
  { temp: 45, expected: 'extreme_hot' },
  { temp: 50, expected: 'extreme_hot' },
]

extremeHotCTests.forEach(({ temp, expected }) => {
  const result = getTemperatureBucket(temp, 'C')
  const status = result === expected ? '✓' : '✗'
  console.log(`  ${status} ${temp}°C → ${result} (expected: ${expected})`)
})

console.log('\n5. Testing Extreme Temperature Outfit Emojis:')
const extremeOutfitTests = [
  {
    bucket: 'extreme_freezing' as const,
    description: 'Extra layers for dangerously cold',
  },
  {
    bucket: 'extreme_hot' as const,
    description: 'Minimal clothing + hydration for dangerously hot',
  },
]

extremeOutfitTests.forEach(({ bucket, description }) => {
  const emojis = getOutfitEmojis(bucket)
  console.log(`  ${bucket}: ${emojis.join('')}`)
  console.log(`    (${description})`)
})

console.log('\n6. Testing Display Names:')
console.log(`  extreme_freezing → "${getTemperatureBucketDisplayName('extreme_freezing')}"`)
console.log(`  extreme_hot → "${getTemperatureBucketDisplayName('extreme_hot')}"`)

console.log('\n7. Testing Temperature Descriptions (Fahrenheit):')
console.log(`  extreme_freezing → "${getTemperatureBucketDescription('extreme_freezing', 'F')}"`)
console.log(`  extreme_hot → "${getTemperatureBucketDescription('extreme_hot', 'F')}"`)

console.log('\n8. Testing Temperature Descriptions (Celsius):')
console.log(`  extreme_freezing → "${getTemperatureBucketDescription('extreme_freezing', 'C')}"`)
console.log(`  extreme_hot → "${getTemperatureBucketDescription('extreme_hot', 'C')}"`)

console.log('\n=== All Extreme Temperature Tests Complete ===')
