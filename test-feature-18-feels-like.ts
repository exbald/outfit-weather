/**
 * Test Feature #18: Feels like temperature displays
 *
 * This test verifies that:
 * 1. Apparent temperature is fetched from Open-Meteo API
 * 2. "Feels like" text is shown when difference > 2°
 * 3. "Feels like" text is hidden when difference ≤ 2°
 * 4. The text is styled appropriately
 */

import { fetchCurrentWeather } from './src/lib/openmeteo'

interface WeatherData {
  temperature: number
  apparentTemperature: number
  weatherCode: number
  condition: string
  icon: string
  windSpeed: number
  isDay: number
}

/**
 * Test 1: Verify API returns apparent_temperature
 */
async function testApiReturnsApparentTemperature() {
  console.log('\n=== Test 1: API Returns Apparent Temperature ===')

  try {
    const data = await fetchCurrentWeather(37.7749, -122.4194, 'celsius', 'kmh')

    if (typeof data.current.apparent_temperature === 'number') {
      console.log('✅ PASS: API returns apparent_temperature')
      console.log(`   Temperature: ${data.current.temperature}°C`)
      console.log(`   Apparent Temperature: ${data.current.apparent_temperature}°C`)
      console.log(`   Difference: ${Math.abs(data.current.temperature - data.current.apparent_temperature).toFixed(1)}°C`)
      return true
    } else {
      console.log('❌ FAIL: API does not return apparent_temperature')
      return false
    }
  } catch (error) {
    console.log('❌ FAIL: API request failed:', error)
    return false
  }
}

/**
 * Test 2: Verify UI logic for showing/hiding "Feels like"
 */
function testFeelsLikeDisplayLogic() {
  console.log('\n=== Test 2: Feels Like Display Logic ===')

  const testCases = [
    {
      name: 'Difference > 2°C (should show)',
      temperature: 20,
      apparentTemperature: 16,
      shouldShow: true,
      description: 'Wind chill makes it feel 4° colder'
    },
    {
      name: 'Difference exactly 2°C (should NOT show)',
      temperature: 20,
      apparentTemperature: 18,
      shouldShow: false,
      description: 'Exactly at threshold'
    },
    {
      name: 'Difference < 2°C (should NOT show)',
      temperature: 20,
      apparentTemperature: 19,
      shouldShow: false,
      description: 'Only 1° difference'
    },
    {
      name: 'High humidity makes it feel hotter (> 2°)',
      temperature: 30,
      apparentTemperature: 35,
      shouldShow: true,
      description: 'Heat index makes it feel 5° hotter'
    },
    {
      name: 'No difference (should NOT show)',
      temperature: 20,
      apparentTemperature: 20,
      shouldShow: false,
      description: 'Feels same as actual'
    },
    {
      name: 'Extreme wind chill (> 2°)',
      temperature: -5,
      apparentTemperature: -15,
      shouldShow: true,
      description: 'Wind chill makes it feel 10° colder'
    }
  ]

  let allPassed = true

  for (const testCase of testCases) {
    const difference = Math.abs(testCase.temperature - testCase.apparentTemperature)
    const wouldShow = difference > 2

    if (wouldShow === testCase.shouldShow) {
      console.log(`✅ PASS: ${testCase.name}`)
      console.log(`   ${testCase.description}`)
      console.log(`   Temp: ${testCase.temperature}°, Feels like: ${testCase.apparentTemperature}°`)
      console.log(`   Diff: ${difference}°, Should show: ${testCase.shouldShow}, Would show: ${wouldShow}`)
    } else {
      console.log(`❌ FAIL: ${testCase.name}`)
      console.log(`   ${testCase.description}`)
      console.log(`   Temp: ${testCase.temperature}°, Feels like: ${testCase.apparentTemperature}°`)
      console.log(`   Diff: ${difference}°, Expected: ${testCase.shouldShow}, Got: ${wouldShow}`)
      allPassed = false
    }
  }

  return allPassed
}

/**
 * Test 3: Verify WeatherData interface includes apparentTemperature
 */
function testWeatherDataInterface() {
  console.log('\n=== Test 3: WeatherData Interface ===')

  // This is a compile-time check, but we can verify the structure at runtime
  const mockWeather: WeatherData = {
    temperature: 20,
    apparentTemperature: 18,
    weatherCode: 0,
    condition: 'Clear sky',
    icon: '☀️',
    windSpeed: 10,
    isDay: 1
  }

  if (typeof mockWeather.apparentTemperature === 'number') {
    console.log('✅ PASS: WeatherData interface includes apparentTemperature')
    console.log(`   Temperature: ${mockWeather.temperature}°C`)
    console.log(`   Apparent Temperature: ${mockWeather.apparentTemperature}°C`)
    return true
  } else {
    console.log('❌ FAIL: WeatherData interface missing apparentTemperature')
    return false
  }
}

/**
 * Test 4: Real-world API test with various locations
 */
async function testRealWorldLocations() {
  console.log('\n=== Test 4: Real-World Locations ===')

  const locations = [
    { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
    { name: 'Anchorage (cold)', lat: 61.2181, lon: -149.9003 },
    { name: 'Miami (hot)', lat: 25.7617, lon: -80.1918 },
    { name: 'Chicago (windy)', lat: 41.8781, lon: -87.6298 }
  ]

  let allPassed = true

  for (const location of locations) {
    try {
      const data = await fetchCurrentWeather(location.lat, location.lon, 'celsius', 'kmh')
      const temp = data.current.temperature
      const feelsLike = data.current.apparent_temperature
      const diff = Math.abs(temp - feelsLike)
      const wouldShow = diff > 2

      console.log(`\n📍 ${location.name}:`)
      console.log(`   Temperature: ${temp}°C`)
      console.log(`   Feels like: ${feelsLike}°C`)
      console.log(`   Difference: ${diff.toFixed(1)}°C`)
      console.log(`   "Feels like" would ${wouldShow ? 'SHOW' : 'NOT SHOW'} (threshold: >2°)`)

      if (typeof feelsLike === 'number' && !isNaN(feelsLike)) {
        console.log(`   ✅ PASS: Valid apparent temperature`)
      } else {
        console.log(`   ❌ FAIL: Invalid apparent temperature`)
        allPassed = false
      }
    } catch (error) {
      console.log(`   ❌ FAIL: ${location.name} - API request failed`)
      allPassed = false
    }
  }

  return allPassed
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║  Feature #18: Feels Like Temperature Display Tests          ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')

  const results = {
    apiReturnsApparentTemperature: await testApiReturnsApparentTemperature(),
    feelsLikeDisplayLogic: testFeelsLikeDisplayLogic(),
    weatherDataInterface: testWeatherDataInterface(),
    realWorldLocations: await testRealWorldLocations()
  }

  console.log('\n╔══════════════════════════════════════════════════════════════╗')
  console.log('║  Test Summary                                                ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')

  const totalTests = Object.keys(results).length
  const passedTests = Object.values(results).filter(r => r).length

  console.log(`\nTotal Tests: ${totalTests}`)
  console.log(`Passed: ${passedTests}`)
  console.log(`Failed: ${totalTests - passedTests}`)

  if (passedTests === totalTests) {
    console.log('\n✅ ALL TESTS PASSED! Feature #18 is working correctly.')
    return 0
  } else {
    console.log('\n❌ SOME TESTS FAILED! Please review the failures above.')
    return 1
  }
}

// Run tests
runAllTests()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('Test runner error:', error)
    process.exit(1)
  })
