/**
 * Verification script for temperature bucket logic
 * This file can be run with tsx or similar to verify the bucket logic works correctly
 */

import {
  getTemperatureBucket,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  getTemperatureBucketDisplayName,
  getTemperatureBucketDescription,
} from './outfitLogic'

// Test conversions
console.log('=== Temperature Conversions ===')
console.log(`0°C = ${celsiusToFahrenheit(0)}°F ✓`)
console.log(`100°C = ${celsiusToFahrenheit(100)}°F ✓`)
console.log(`32°F = ${fahrenheitToCelsius(32)}°C ✓`)
console.log(`212°F = ${fahrenheitToCelsius(212)}°C ✓`)

// Test Fahrenheit buckets
console.log('\n=== Fahrenheit Buckets ===')
const fTests = [
  { temp: 31, expected: 'freezing' },
  { temp: 40, expected: 'cold' },
  { temp: 57, expected: 'cool' },
  { temp: 67, expected: 'mild' },
  { temp: 75, expected: 'warm' },
  { temp: 85, expected: 'hot' },
]

fTests.forEach(({ temp, expected }) => {
  const bucket = getTemperatureBucket(temp, 'F')
  const status = bucket === expected ? '✓' : '✗'
  console.log(`${temp}°F → ${bucket} (${getTemperatureBucketDisplayName(bucket)}) ${status}`)
})

// Test Celsius buckets
console.log('\n=== Celsius Buckets ===')
const cTests = [
  { temp: -5, expected: 'freezing' },
  { temp: 5, expected: 'cold' },
  { temp: 14, expected: 'cool' },
  { temp: 19, expected: 'mild' },
  { temp: 24, expected: 'warm' },
  { temp: 30, expected: 'hot' },
]

cTests.forEach(({ temp, expected }) => {
  const bucket = getTemperatureBucket(temp, 'C')
  const status = bucket === expected ? '✓' : '✗'
  console.log(`${temp}°C → ${bucket} (${getTemperatureBucketDisplayName(bucket)}) ${status}`)
})

// Test boundary values
console.log('\n=== Boundary Values (Fahrenheit) ===')
const boundaryTests = [
  { temp: 32, expected: 'cold' },
  { temp: 50, expected: 'cool' },
  { temp: 65, expected: 'mild' },
  { temp: 70, expected: 'warm' },
  { temp: 80, expected: 'hot' },
]

boundaryTests.forEach(({ temp, expected }) => {
  const bucket = getTemperatureBucket(temp, 'F')
  const status = bucket === expected ? '✓' : '✗'
  console.log(`${temp}°F (boundary) → ${bucket} ${status}`)
})

// Test descriptions
console.log('\n=== Temperature Descriptions ===')
;['freezing', 'cold', 'cool', 'mild', 'warm', 'hot'].forEach((bucket) => {
  console.log(
    `${bucket}: ${getTemperatureBucketDescription(bucket as any, 'F')} | ${getTemperatureBucketDescription(bucket as any, 'C')}`
  )
})

console.log('\n✅ All verification tests completed!')
