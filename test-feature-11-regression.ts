/**
 * Feature #11 Regression Test: API client fetches current weather
 *
 * Verification Steps:
 * 1. Build Open-Meteo API URL
 * 2. Fetch current weather endpoint
 * 3. Parse temperature and weather code
 */

import { buildCurrentWeatherUrl, fetchCurrentWeather } from './src/lib/openmeteo.js'

interface TestResult {
  step: string
  passed: boolean
  details: string
  error?: string
}

const results: TestResult[] = async function() {
  const results: TestResult[] = []

  console.log('🧪 Feature #11 Regression Test: API client fetches current weather')
  console.log('=' .repeat(70))

  // Step 1: Build Open-Meteo API URL
  console.log('\n📍 Step 1: Build Open-Meteo API URL')
  try {
    const url = buildCurrentWeatherUrl(37.7749, -122.4194) // San Francisco
    console.log('Generated URL:', url)

    const requiredParams = [
      'latitude=37.7749',
      'longitude=-122.4194',
      'current=temperature',
      'windspeed',
      'weathercode',
      'temperature_unit=celsius',
      'wind_speed_unit=kmh',
      'timezone=auto'
    ]

    const hasAllParams = requiredParams.every(param => url.includes(param))
    const hasCorrectBase = url.startsWith('https://api.open-meteo.com/v1/forecast')

    if (hasCorrectBase && hasAllParams) {
      console.log('✅ PASS: URL built correctly with all required parameters')
      results.push({
        step: 'Build Open-Meteo API URL',
        passed: true,
        details: `URL: ${url.substring(0, 100)}...`
      })
    } else {
      console.log('❌ FAIL: URL missing required parameters or wrong base')
      results.push({
        step: 'Build Open-Meteo API URL',
        passed: false,
        details: 'URL structure incorrect',
        error: 'Missing parameters or wrong base URL'
      })
    }
  } catch (error) {
    console.log('❌ FAIL: Error building URL:', error)
    results.push({
      step: 'Build Open-Meteo API URL',
      passed: false,
      details: 'Exception thrown',
      error: String(error)
    })
  }

  // Step 2: Test with Fahrenheit units
  console.log('\n📍 Step 1b: Test Fahrenheit units')
  try {
    const url = buildCurrentWeatherUrl(37.7749, -122.4194, 'fahrenheit')
    const hasFahrenheit = url.includes('temperature_unit=fahrenheit')

    if (hasFahrenheit) {
      console.log('✅ PASS: Fahrenheit unit parameter added correctly')
      results.push({
        step: 'Build URL with Fahrenheit',
        passed: true,
        details: 'temperature_unit=fahrenheit present'
      })
    } else {
      console.log('❌ FAIL: Fahrenheit parameter missing')
      results.push({
        step: 'Build URL with Fahrenheit',
        passed: false,
        details: 'temperature_unit=fahrenheit not found',
        error: 'Fahrenheit parameter not added'
      })
    }
  } catch (error) {
    console.log('❌ FAIL: Error with Fahrenheit units:', error)
    results.push({
      step: 'Build URL with Fahrenheit',
      passed: false,
      details: 'Exception thrown',
      error: String(error)
    })
  }

  // Step 3: Test with mph wind speed units
  console.log('\n📍 Step 1c: Test mph wind speed units')
  try {
    const url = buildCurrentWeatherUrl(37.7749, -122.4194, 'celsius', 'mph')
    const hasMph = url.includes('wind_speed_unit=mph')

    if (hasMph) {
      console.log('✅ PASS: MPH wind speed unit parameter added correctly')
      results.push({
        step: 'Build URL with MPH',
        passed: true,
        details: 'wind_speed_unit=mph present'
      })
    } else {
      console.log('❌ FAIL: MPH parameter missing')
      results.push({
        step: 'Build URL with MPH',
        passed: false,
        details: 'wind_speed_unit=mph not found',
        error: 'MPH parameter not added'
      })
    }
  } catch (error) {
    console.log('❌ FAIL: Error with MPH units:', error)
    results.push({
      step: 'Build URL with MPH',
      passed: false,
      details: 'Exception thrown',
      error: String(error)
    })
  }

  // Step 4: Fetch current weather endpoint
  console.log('\n📍 Step 2: Fetch current weather endpoint')
  try {
    console.log('Fetching weather for San Francisco (37.7749, -122.4194)...')
    const data = await fetchCurrentWeather(37.7749, -122.4194)

    console.log('Response received:')
    console.log('  - Latitude:', data.latitude)
    console.log('  - Longitude:', data.longitude)
    console.log('  - Timezone:', data.timezone)
    console.log('  - Temperature:', data.current.temperature, '°C')
    console.log('  - Wind Speed:', data.current.windspeed, 'km/h')
    console.log('  - Weather Code:', data.current.weathercode)
    console.log('  - Is Day:', data.current.is_day)

    const hasRequiredFields = data.current &&
      typeof data.current.temperature === 'number' &&
      typeof data.current.weathercode === 'number' &&
      typeof data.current.windspeed === 'number' &&
      typeof data.current.is_day === 'number'

    if (hasRequiredFields) {
      console.log('✅ PASS: Successfully fetched current weather with all required fields')
      results.push({
        step: 'Fetch current weather endpoint',
        passed: true,
        details: `Temperature: ${data.current.temperature}°C, Code: ${data.current.weathercode}`
      })
    } else {
      console.log('❌ FAIL: Response missing required fields')
      results.push({
        step: 'Fetch current weather endpoint',
        passed: false,
        details: 'Missing temperature, weathercode, windspeed, or is_day',
        error: 'Incomplete API response'
      })
    }
  } catch (error) {
    console.log('❌ FAIL: Error fetching weather:', error)
    results.push({
      step: 'Fetch current weather endpoint',
      passed: false,
      details: 'Fetch failed',
      error: String(error)
    })
  }

  // Step 5: Test with Fahrenheit units
  console.log('\n📍 Step 2b: Test fetching with Fahrenheit units')
  try {
    const data = await fetchCurrentWeather(37.7749, -122.4194, 'fahrenheit')

    const hasFahrenheitUnits = data.current_units.temperature === '°F'

    if (hasFahrenheitUnits) {
      console.log('✅ PASS: Successfully fetched weather in Fahrenheit')
      console.log(`  - Temperature: ${data.current.temperature}°F`)
      results.push({
        step: 'Fetch with Fahrenheit',
        passed: true,
        details: `Temperature: ${data.current.temperature}°F`
      })
    } else {
      console.log('❌ FAIL: Temperature units not in Fahrenheit')
      results.push({
        step: 'Fetch with Fahrenheit',
        passed: false,
        details: 'Units not converted',
        error: `Got ${data.current_units.temperature} instead of °F`
      })
    }
  } catch (error) {
    console.log('❌ FAIL: Error fetching with Fahrenheit:', error)
    results.push({
      step: 'Fetch with Fahrenheit',
      passed: false,
      details: 'Fetch failed',
      error: String(error)
    })
  }

  // Step 6: Test with mph wind speed units
  console.log('\n📍 Step 2c: Test fetching with MPH units')
  try {
    const data = await fetchCurrentWeather(37.7749, -122.4194, 'celsius', 'mph')

    // Open-Meteo API returns "mp/h" as the unit label (not "mph"), but the data is in MPH
    const hasMphUnits = data.current_units.windspeed === 'mp/h' || data.current_units.windspeed === 'mph'

    if (hasMphUnits) {
      console.log('✅ PASS: Successfully fetched weather with MPH wind speed')
      console.log(`  - Wind Speed: ${data.current.windspeed} ${data.current_units.windspeed}`)
      results.push({
        step: 'Fetch with MPH',
        passed: true,
        details: `Wind Speed: ${data.current.windspeed} ${data.current_units.windspeed}`
      })
    } else {
      console.log('❌ FAIL: Wind speed units not in MPH')
      results.push({
        step: 'Fetch with MPH',
        passed: false,
        details: 'Units not converted',
        error: `Got ${data.current_units.windspeed} instead of mp/h or mph`
      })
    }
  } catch (error) {
    console.log('❌ FAIL: Error fetching with MPH:', error)
    results.push({
      step: 'Fetch with MPH',
      passed: false,
      details: 'Fetch failed',
      error: String(error)
    })
  }

  // Step 7: Parse temperature and weather code
  console.log('\n📍 Step 3: Parse temperature and weather code')
  try {
    const data = await fetchCurrentWeather(40.7128, -74.006) // New York

    const temperature = data.current.temperature
    const weatherCode = data.current.weathercode

    console.log('Parsed values:')
    console.log('  - Temperature:', temperature, '°C')
    console.log('  - Weather Code:', weatherCode)

    // Import getWeatherCondition function
    const { getWeatherCondition } = await import('./src/lib/openmeteo.js')
    const condition = getWeatherCondition(weatherCode)

    console.log('  - Condition:', condition.description)
    console.log('  - Icon:', condition.icon)
    console.log('  - Category:', condition.category)

    const isTempValidNumber = typeof temperature === 'number' && !isNaN(temperature)
    const isWeatherCodeValid = typeof weatherCode === 'number' && weatherCode >= 0 && weatherCode <= 99
    const hasConditionDescription = condition.description && condition.description.length > 0
    const hasConditionIcon = condition.icon && condition.icon.length > 0

    if (isTempValidNumber && isWeatherCodeValid && hasConditionDescription && hasConditionIcon) {
      console.log('✅ PASS: Temperature and weather code parsed correctly')
      results.push({
        step: 'Parse temperature and weather code',
        passed: true,
        details: `${temperature}°C, ${condition.icon} ${condition.description} (${condition.category})`
      })
    } else {
      console.log('❌ FAIL: Failed to parse or validate data')
      results.push({
        step: 'Parse temperature and weather code',
        passed: false,
        details: 'Validation failed',
        error: `Temp valid: ${isTempValidNumber}, Code valid: ${isWeatherCodeValid}, Has desc: ${hasConditionDescription}, Has icon: ${hasConditionIcon}`
      })
    }
  } catch (error) {
    console.log('❌ FAIL: Error parsing data:', error)
    results.push({
      step: 'Parse temperature and weather code',
      passed: false,
      details: 'Exception thrown',
      error: String(error)
    })
  }

  // Step 8: Test error handling for invalid coordinates
  console.log('\n📍 Step 4: Test error handling for invalid coordinates')
  try {
    await fetchCurrentWeather(999, 999)
    console.log('❌ FAIL: Should have thrown error for invalid coordinates')
    results.push({
      step: 'Error handling',
      passed: false,
      details: 'No error thrown for invalid coordinates',
      error: 'Expected error was not thrown'
    })
  } catch (error) {
    console.log('✅ PASS: Correctly throws error for invalid coordinates')
    console.log('  - Error message:', String(error))
    results.push({
      step: 'Error handling',
      passed: true,
      details: 'Properly rejects invalid coordinates'
    })
  }

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(70))

  const passed = results.filter(r => r.passed).length
  const total = results.length
  const percentage = ((passed / total) * 100).toFixed(1)

  console.log(`\nPassed: ${passed}/${total} (${percentage}%)`)

  results.forEach((result, index) => {
    const emoji = result.passed ? '✅' : '❌'
    console.log(`${emoji} ${index + 1}. ${result.step}`)
    if (!result.passed && result.error) {
      console.log(`   Error: ${result.error}`)
    }
  })

  if (passed === total) {
    console.log('\n🎉 All tests passed! Feature #11 is working correctly.')
    process.exit(0)
  } else {
    console.log('\n⚠️  Some tests failed. Review the errors above.')
    process.exit(1)
  }
}()
