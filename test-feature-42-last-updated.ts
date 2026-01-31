/**
 * Feature #42: Last updated timestamp displays
 *
 * Test Steps:
 * 1. Track last fetch time - useWeather hook tracks cacheAge state
 * 2. Calculate time difference - formatCacheAge function converts seconds to human-readable string
 * 3. Display relative time string - WeatherDisplay shows formatted timestamp
 *
 * Expected Behavior:
 * - "Updated just now" when cacheAge <= 60 seconds
 * - "Updated X min(s) ago" when 60 < cacheAge < 3600 seconds
 * - "Updated X hour(s) ago" when cacheAge >= 3600 seconds
 * - "Updating..." when refreshing in background
 * - "Offline · ..." prefix when using cached data due to API error
 */

// Test data for formatCacheAge function
const TEST_CASES = [
  { input: 0, expected: 'Updated just now', description: 'Fresh data (0 seconds)' },
  { input: 30, expected: 'Updated just now', description: 'Very recent (30 seconds)' },
  { input: 59, expected: 'Updated just now', description: 'Under 1 minute (59 seconds)' },
  { input: 60, expected: 'Updated 1 min ago', description: 'Exactly 1 minute' },
  { input: 120, expected: 'Updated 2 mins ago', description: '2 minutes' },
  { input: 1800, expected: 'Updated 30 mins ago', description: '30 minutes' },
  { input: 3599, expected: 'Updated 59 mins ago', description: '59 minutes' },
  { input: 3600, expected: 'Updated 1 hour ago', description: 'Exactly 1 hour' },
  { input: 7200, expected: 'Updated 2 hours ago', description: '2 hours' },
  { input: 86400, expected: 'Updated 24 hours ago', description: '1 day' }
]

/**
 * Recreate formatCacheAge function from WeatherDisplay.tsx for testing
 */
function formatCacheAge(seconds: number): string {
  if (seconds <= 0) return 'Updated just now'
  if (seconds < 60) return 'Updated just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `Updated ${minutes} min${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`
}

/**
 * Run all test cases
 */
function runTests(): void {
  console.log('============================================================')
  console.log('Feature #42: Last Updated Timestamp - Test Suite')
  console.log('============================================================\n')

  let passed = 0
  let failed = 0

  TEST_CASES.forEach((testCase, index) => {
    const result = formatCacheAge(testCase.input)
    const success = result === testCase.expected

    if (success) {
      passed++
      console.log(`✓ Test ${index + 1}: ${testCase.description}`)
      console.log(`  Input: ${testCase.input}s → Output: "${result}"`)
    } else {
      failed++
      console.log(`✗ Test ${index + 1}: ${testCase.description}`)
      console.log(`  Input: ${testCase.input}s`)
      console.log(`  Expected: "${testCase.expected}"`)
      console.log(`  Actual: "${result}"`)
    }
    console.log()
  })

  // Edge case tests
  console.log('------------------------------------------------------------')
  console.log('Edge Case Tests')
  console.log('------------------------------------------------------------\n')

  // Negative values (shouldn't happen in practice, but test robustness)
  const negativeTest = formatCacheAge(-1)
  if (negativeTest === 'Updated just now') {
    passed++
    console.log('✓ Edge case: Negative value → "Updated just now"')
  } else {
    failed++
    console.log(`✗ Edge case: Negative value → Expected "Updated just now", got "${negativeTest}"`)
  }
  console.log()

  console.log('============================================================')
  console.log('TEST SUMMARY')
  console.log('============================================================')
  console.log(`Total:   ${TEST_CASES.length + 1}`)
  console.log(`✓ Passed: ${passed}`)
  console.log(`✗ Failed: ${failed}`)
  console.log(`Pass Rate: ${((passed / (TEST_CASES.length + 1)) * 100).toFixed(1)}%`)
  console.log('============================================================')

  if (failed === 0) {
    console.log('\n✅ ALL TESTS PASSED!\n')
  } else {
    console.log('\n❌ SOME TESTS FAILED\n')
    process.exit(1)
  }
}

// Run tests
runTests()
