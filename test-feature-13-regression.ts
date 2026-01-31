/**
 * Feature #13 Regression Test: Weather Codes Parsed to Conditions
 *
 * This test verifies that the weather code mapping system correctly
 * converts Open-Meteo weather codes (0-99) into human-readable conditions
 * with emoji icons and categorization.
 */

import { getWeatherCondition, WEATHER_CODE_MAP } from './src/lib/openmeteo'

// Test results tracking
let passed = 0
let failed = 0

function test(name: string, fn: () => boolean) {
  try {
    if (fn()) {
      console.log(`✅ ${name}`)
      passed++
    } else {
      console.log(`❌ ${name}`)
      failed++
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error}`)
    failed++
  }
}

console.log('='.repeat(60))
console.log('Feature #13 Regression Test')
console.log('Testing: Weather code mapping system')
console.log('='.repeat(60))
console.log()

// Test 1: WeatherCondition interface exists
test('WeatherCondition interface is exported', () => {
  const condition = getWeatherCondition(0)
  return (
    typeof condition.description === 'string' &&
    typeof condition.icon === 'string' &&
    typeof condition.category === 'string'
  )
})

// Test 2: WEATHER_CODE_MAP contains all expected codes
test('WEATHER_CODE_MAP contains all 28 expected codes', () => {
  const expectedCodes = [
    0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73,
    75, 77, 80, 81, 82, 85, 86, 95, 96, 99
  ]
  return expectedCodes.every(code => code in WEATHER_CODE_MAP)
})

// Test 3: Clear sky code (0)
test('Code 0 maps to "Clear sky" with ☀️ icon', () => {
  const condition = getWeatherCondition(0)
  return (
    condition.description === 'Clear sky' &&
    condition.icon === '☀️' &&
    condition.category === 'clear'
  )
})

// Test 4: Partly cloudy code (2)
test('Code 2 maps to "Partly cloudy" with ⛅ icon', () => {
  const condition = getWeatherCondition(2)
  return (
    condition.description === 'Partly cloudy' &&
    condition.icon === '⛅' &&
    condition.category === 'cloudy'
  )
})

// Test 5: Overcast code (3)
test('Code 3 maps to "Overcast" with ☁️ icon', () => {
  const condition = getWeatherCondition(3)
  return (
    condition.description === 'Overcast' &&
    condition.icon === '☁️' &&
    condition.category === 'cloudy'
  )
})

// Test 6: Fog code (45)
test('Code 45 maps to "Fog" with 🌫️ icon', () => {
  const condition = getWeatherCondition(45)
  return (
    condition.description === 'Fog' &&
    condition.icon === '🌫️' &&
    condition.category === 'cloudy'
  )
})

// Test 7: Drizzle codes (51-57)
test('Drizzle codes (51, 53, 55, 56, 57) map correctly', () => {
  const drizzleCodes = [51, 53, 55, 56, 57]
  return drizzleCodes.every(code => {
    const condition = getWeatherCondition(code)
    return condition.category === 'precipitation' &&
           (condition.icon === '🌧️' || condition.icon === '🌨️')
  })
})

// Test 8: Rain codes (61-67)
test('Rain codes (61, 63, 65, 66, 67) map correctly', () => {
  const rainCodes = [61, 63, 65, 66, 67]
  return rainCodes.every(code => {
    const condition = getWeatherCondition(code)
    return condition.category === 'precipitation' &&
           (condition.icon === '🌧️' || condition.icon === '🌨️')
  })
})

// Test 9: Snow codes (71-77)
test('Snow codes (71, 73, 75, 77) map correctly', () => {
  const snowCodes = [71, 73, 75, 77]
  return snowCodes.every(code => {
    const condition = getWeatherCondition(code)
    return condition.category === 'precipitation' &&
           (condition.icon === '🌨️' || condition.icon === '❄️')
  })
})

// Test 10: Rain showers (80-82)
test('Rain shower codes (80, 81, 82) map correctly', () => {
  const showerCodes = [80, 81, 82]
  return showerCodes.every(code => {
    const condition = getWeatherCondition(code)
    return condition.category === 'precipitation' &&
           (condition.icon === '🌦️' || condition.icon === '⛈️')
  })
})

// Test 11: Snow showers (85-86)
test('Snow shower codes (85, 86) map correctly', () => {
  const snowShowerCodes = [85, 86]
  return snowShowerCodes.every(code => {
    const condition = getWeatherCondition(code)
    return condition.category === 'precipitation' &&
           (condition.icon === '🌨️' || condition.icon === '❄️')
  })
})

// Test 12: Thunderstorm codes (95-99)
test('Thunderstorm codes (95, 96, 99) map to extreme category', () => {
  const stormCodes = [95, 96, 99]
  return stormCodes.every(code => {
    const condition = getWeatherCondition(code)
    return condition.category === 'extreme' &&
           condition.icon === '⛈️'
  })
})

// Test 13: Unknown code fallback
test('Unknown code (100) returns fallback condition', () => {
  const condition = getWeatherCondition(100)
  return (
    condition.description === 'Unknown condition' &&
    condition.icon === '❓' &&
    condition.category === 'cloudy'
  )
})

// Test 14: Negative code fallback
test('Negative code (-1) returns fallback condition', () => {
  const condition = getWeatherCondition(-1)
  return (
    condition.description === 'Unknown condition' &&
    condition.icon === '❓' &&
    condition.category === 'cloudy'
  )
})

// Test 15: Category distribution
test('All four categories are represented', () => {
  const categories = new Set<string>()
  Object.values(WEATHER_CODE_MAP).forEach(condition => {
    categories.add(condition.category)
  })
  return categories.has('clear') &&
         categories.has('cloudy') &&
         categories.has('precipitation') &&
         categories.has('extreme')
})

// Test 16: Code coverage for all ranges
test('All major code ranges are covered', () => {
  const ranges = [
    [0, 1],      // Clear
    [2, 3],      // Cloudy
    [45, 48],    // Fog
    [51, 57],    // Drizzle
    [61, 67],    // Rain
    [71, 77],    // Snow
    [80, 82],    // Rain showers
    [85, 86],    // Snow showers
    [95, 99]     // Thunderstorm
  ]

  let coveredRanges = 0
  for (const [start, end] of ranges) {
    for (let code = start; code <= end; code++) {
      if (code in WEATHER_CODE_MAP) {
        coveredRanges++
        break
      }
    }
  }

  return coveredRanges === ranges.length
})

// Test 17: All conditions have valid emoji icons
test('All mapped codes have valid emoji icons', () => {
  const emojiRegex = /\p{Emoji}/u
  return Object.values(WEATHER_CODE_MAP).every(condition =>
    emojiRegex.test(condition.icon)
  )
})

// Test 18: All conditions have non-empty descriptions
test('All mapped codes have non-empty descriptions', () => {
  return Object.values(WEATHER_CODE_MAP).every(condition =>
    condition.description.length > 0
  )
})

// Test 19: getWeatherCondition returns WeatherCondition type
test('getWeatherCondition returns proper WeatherCondition object', () => {
  const condition = getWeatherCondition(61)
  const hasValidCategory = ['clear', 'cloudy', 'precipitation', 'extreme']
    .includes(condition.category)

  return (
    typeof condition.description === 'string' &&
    typeof condition.icon === 'string' &&
    hasValidCategory
  )
})

// Test 20: Specific weather code descriptions
test('Specific weather codes have correct descriptions', () => {
  const tests = [
    { code: 0, expected: 'Clear sky' },
    { code: 2, expected: 'Partly cloudy' },
    { code: 45, expected: 'Fog' },
    { code: 61, expected: 'Slight rain' },
    { code: 71, expected: 'Slight snow' },
    { code: 95, expected: 'Thunderstorm' },
    { code: 99, expected: 'Thunderstorm with heavy hail' }
  ]

  return tests.every(({ code, expected }) =>
    getWeatherCondition(code).description === expected
  )
})

// Summary
console.log()
console.log('='.repeat(60))
console.log('Test Results:')
console.log(`  ✅ Passed: ${passed}`)
console.log(`  ❌ Failed: ${failed}`)
console.log(`  📊 Total: ${passed + failed}`)
console.log(`  📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)
console.log('='.repeat(60))

if (failed === 0) {
  console.log()
  console.log('🎉 All tests passed! Feature #13 is working correctly.')
  console.log()
  console.log('REGRESSION STATUS: ✅ NO REGRESSION FOUND')
  console.log('Feature #13 continues to work correctly.')
} else {
  console.log()
  console.log('⚠️  Some tests failed. Regression detected!')
  process.exit(1)
}
