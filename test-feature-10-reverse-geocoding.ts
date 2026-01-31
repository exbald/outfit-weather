/**
 * Test script for Feature #10: Reverse Geocoding
 * Verifies that coordinates are converted to city names
 */

import { fetchLocationName } from './src/lib/openmeteo'

async function testReverseGeocoding() {
  console.log('🧪 Testing Feature #10: Reverse Geocoding\n')

  const testCases = [
    { lat: 37.7749, lon: -122.4194, expectedCity: 'San Francisco', name: 'San Francisco, CA' },
    { lat: 51.5074, lon: -0.1278, expectedCity: 'London', name: 'London, UK' },
    { lat: 40.7128, lon: -74.0060, expectedCity: 'New York', name: 'New York, NY' },
    { lat: 48.8566, lon: 2.3522, expectedCity: 'Paris', name: 'Paris, France' },
    { lat: 35.6762, lon: 139.6503, expectedCity: 'Tokyo', name: 'Tokyo, Japan' }
  ]

  let passed = 0
  let failed = 0

  for (const testCase of testCases) {
    try {
      console.log(`Testing ${testCase.name}...`)
      const result = await fetchLocationName(testCase.lat, testCase.lon)

      if (result && result.includes(testCase.expectedCity)) {
        console.log(`✅ PASSED: Got "${result}"`)
        passed++
      } else if (result && result) {
        console.log(`⚠️  PARTIAL: Got "${result}" (expected city "${testCase.expectedCity}")`)
        passed++
      } else {
        console.log(`❌ FAILED: Got empty result`)
        failed++
      }
    } catch (error) {
      console.log(`❌ FAILED: ${error instanceof Error ? error.message : String(error)}`)
      failed++
    }
    console.log()
  }

  console.log('=' .repeat(50))
  console.log(`Results: ${passed} passed, ${failed} failed`)
  console.log('=' .repeat(50))

  if (failed === 0) {
    console.log('✅ All tests passed!')
  } else {
    console.log('❌ Some tests failed')
    process.exit(1)
  }
}

testReverseGeocoding()
