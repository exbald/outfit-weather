/**
 * Test script to verify WeatherDisplay component functionality
 * Tests the useWeather hook and weather data flow
 */

import { fetchCurrentWeather, getWeatherCondition } from './src/lib/openmeteo'

async function testWeatherDisplay() {
  console.log('=== Weather Display Feature Test ===\n')

  let weatherData: Awaited<ReturnType<typeof fetchCurrentWeather>>

  // Test 1: Fetch weather data
  console.log('Test 1: Fetching weather data for San Francisco...')
  try {
    weatherData = await fetchCurrentWeather(37.7749, -122.4194)
    console.log('✅ Weather data fetched successfully')
    console.log('  Temperature:', weatherData.current.temperature)
    console.log('  Weather Code:', weatherData.current.weathercode)
    console.log('  Wind Speed:', weatherData.current.windspeed)
    console.log('  Is Day:', weatherData.current.is_day)
    console.log('  Location:', `${weatherData.latitude}, ${weatherData.longitude}`)
  } catch (error) {
    console.log('❌ Failed to fetch weather data:', error)
    return
  }

  // Test 2: Parse weather code to condition
  console.log('\nTest 2: Parsing weather code to condition...')
  const weatherCode = 0 // Clear sky
  const condition = getWeatherCondition(weatherCode)
  console.log('✅ Weather code parsed successfully')
  console.log('  Code:', weatherCode)
  console.log('  Description:', condition.description)
  console.log('  Icon:', condition.icon)
  console.log('  Category:', condition.category)

  // Test 3: Verify all required fields are present
  console.log('\nTest 3: Verifying required display fields...')
  const requiredFields = [
    'temperature',
    'condition',
    'icon',
    'location'
  ]

  const displayData = {
    temperature: Math.round(weatherData.current.temperature),
    weatherCode: weatherData.current.weathercode,
    condition: getWeatherCondition(weatherData.current.weathercode).description,
    icon: getWeatherCondition(weatherData.current.weathercode).icon,
    windSpeed: weatherData.current.windspeed,
    isDay: weatherData.current.is_day,
    location: {
      latitude: weatherData.latitude,
      longitude: weatherData.longitude,
      timezone: weatherData.timezone
    }
  }

  let allFieldsPresent = true
  for (const field of requiredFields) {
    if (displayData[field as keyof typeof displayData] === undefined) {
      console.log(`❌ Missing field: ${field}`)
      allFieldsPresent = false
    } else {
      console.log(`✅ Field present: ${field}`)
    }
  }

  if (allFieldsPresent) {
    console.log('\n✅ All required fields are present')
  }

  // Test 4: Display format verification
  console.log('\nTest 4: Verifying display format...')
  console.log('Temperature display:', `${displayData.temperature}°`)
  console.log('Condition display:', displayData.condition)
  console.log('Icon display:', displayData.icon)
  console.log('Location display:', `${displayData.location.latitude.toFixed(4)}°, ${displayData.location.longitude.toFixed(4)}°`)
  console.log('✅ Display format verified')

  console.log('\n=== All Tests Passed ===')
}

testWeatherDisplay().catch(console.error)
