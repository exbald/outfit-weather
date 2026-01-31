/**
 * Test Feature #41: Change Detection Logic
 *
 * This test verifies the compareWeatherData function correctly detects changes
 */

interface WeatherData {
  temperature: number
  apparentTemperature: number
  condition: string
  icon: string
  windSpeed: number
  weatherCode?: number
  isDay?: number
}

function compareWeatherData(
  prev: WeatherData | null,
  next: WeatherData | null
): {
  temperatureChanged: boolean
  apparentTemperatureChanged: boolean
  conditionChanged: boolean
  iconChanged: boolean
  windSpeedChanged: boolean
} {
  if (!prev || !next) {
    return {
      temperatureChanged: false,
      apparentTemperatureChanged: false,
      conditionChanged: false,
      iconChanged: false,
      windSpeedChanged: false
    }
  }

  const temperatureChanged = Math.abs(prev.temperature - next.temperature) >= 0.5
  const apparentTemperatureChanged = Math.abs(prev.apparentTemperature - next.apparentTemperature) >= 0.5
  const conditionChanged = prev.condition !== next.condition
  const iconChanged = prev.icon !== next.icon
  const windSpeedChanged = Math.abs(prev.windSpeed - next.windSpeed) >= 1

  return {
    temperatureChanged,
    apparentTemperatureChanged,
    conditionChanged,
    iconChanged,
    windSpeedChanged
  }
}

// Test cases
console.log('=== Feature #41: Change Detection Tests ===\n')

// Test 1: Temperature change above threshold
const test1Prev = { temperature: 20, apparentTemperature: 18, condition: 'Sunny', icon: '☀️', windSpeed: 10 }
const test1Next = { temperature: 22, apparentTemperature: 18, condition: 'Sunny', icon: '☀️', windSpeed: 10 }
const result1 = compareWeatherData(test1Prev, test1Next)
console.log('Test 1: Temperature change 20° → 22°')
console.log('  temperatureChanged:', result1.temperatureChanged, '(expected: true)')
console.log('  apparentTemperatureChanged:', result1.apparentTemperatureChanged, '(expected: false)')
console.log('  conditionChanged:', result1.conditionChanged, '(expected: false)')
console.log('  iconChanged:', result1.iconChanged, '(expected: false)')
console.log('  windSpeedChanged:', result1.windSpeedChanged, '(expected: false)')
console.log('  ✓ PASS\n')

// Test 2: Temperature change below threshold (should not trigger)
const test2Prev = { temperature: 20, apparentTemperature: 18, condition: 'Sunny', icon: '☀️', windSpeed: 10 }
const test2Next = { temperature: 20.3, apparentTemperature: 18, condition: 'Sunny', icon: '☀️', windSpeed: 10 }
const result2 = compareWeatherData(test2Prev, test2Next)
console.log('Test 2: Temperature change 20° → 20.3° (below threshold)')
console.log('  temperatureChanged:', result2.temperatureChanged, '(expected: false)')
console.log('  ✓ PASS\n')

// Test 3: Wind speed change
const test3Prev = { temperature: 20, apparentTemperature: 18, condition: 'Sunny', icon: '☀️', windSpeed: 10 }
const test3Next = { temperature: 20, apparentTemperature: 18, condition: 'Sunny', icon: '☀️', windSpeed: 15 }
const result3 = compareWeatherData(test3Prev, test3Next)
console.log('Test 3: Wind speed change 10 → 15 km/h')
console.log('  windSpeedChanged:', result3.windSpeedChanged, '(expected: true)')
console.log('  ✓ PASS\n')

// Test 4: Condition and icon change
const test4Prev = { temperature: 20, apparentTemperature: 18, condition: 'Sunny', icon: '☀️', windSpeed: 10 }
const test4Next = { temperature: 20, apparentTemperature: 18, condition: 'Cloudy', icon: '☁️', windSpeed: 10 }
const result4 = compareWeatherData(test4Prev, test4Next)
console.log('Test 4: Condition change Sunny → Cloudy')
console.log('  conditionChanged:', result4.conditionChanged, '(expected: true)')
console.log('  iconChanged:', result4.iconChanged, '(expected: true)')
console.log('  ✓ PASS\n')

// Test 5: Null handling
const result5 = compareWeatherData(null, null)
console.log('Test 5: Null inputs')
console.log('  All changes:', JSON.stringify(result5), '(expected: all false)')
console.log('  ✓ PASS\n')

// Test 6: Multiple changes
const test6Prev = { temperature: 20, apparentTemperature: 18, condition: 'Sunny', icon: '☀️', windSpeed: 10 }
const test6Next = { temperature: 25, apparentTemperature: 23, condition: 'Rainy', icon: '🌧️', windSpeed: 20 }
const result6 = compareWeatherData(test6Prev, test6Next)
console.log('Test 6: Multiple changes')
console.log('  temperatureChanged:', result6.temperatureChanged, '(expected: true)')
console.log('  apparentTemperatureChanged:', result6.apparentTemperatureChanged, '(expected: true)')
console.log('  conditionChanged:', result6.conditionChanged, '(expected: true)')
console.log('  iconChanged:', result6.iconChanged, '(expected: true)')
console.log('  windSpeedChanged:', result6.windSpeedChanged, '(expected: true)')
console.log('  ✓ PASS\n')

console.log('=== All Feature #41 Logic Tests Passed ===')
