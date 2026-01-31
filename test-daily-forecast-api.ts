/**
 * Test daily forecast API with real Open-Meteo API call
 */

import { buildCurrentWeatherUrl, parseDailyForecast } from './src/lib/openmeteo'

async function testDailyForecast() {
  console.log('=== Feature #12: Daily Forecast API Test ===\n')

  // Test coordinates: San Francisco
  const lat = 37.7749
  const lon = -122.4194

  console.log(`Step 1: Build API URL for ${lat}, ${lon}`)
  const url = buildCurrentWeatherUrl(lat, lon, 'celsius', 'kmh')
  console.log('URL:', url)
  console.log('')

  // Check URL includes daily parameters
  console.log('Step 2: Verify daily parameters in URL')
  const requiredParams = [
    'daily=',
    'temperature_2m_max',
    'temperature_2m_min',
    'weathercode',
    'precipitation_probability_max',
    'uv_index_max'
  ]

  let allParamsPresent = true
  for (const param of requiredParams) {
    const present = url.includes(param)
    console.log(`  ${present ? '✅' : '❌'} ${param}`)
    if (!present) allParamsPresent = false
  }
  console.log('')

  if (!allParamsPresent) {
    console.error('❌ FAILED: Not all required daily parameters are in the URL')
    process.exit(1)
  }

  console.log('Step 3: Fetch real data from Open-Meteo API')
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ API response received')
    console.log('')

    console.log('Step 4: Validate daily data structure')
    if (!data.daily) {
      console.error('❌ FAILED: Missing daily data in response')
      process.exit(1)
    }

    console.log('✅ daily data exists')
    console.log(`  - daily.time: ${data.daily.time?.length || 0} days`)
    console.log(`  - daily.temperature_2m_max: ${data.daily.temperature_2m_max?.length || 0} values`)
    console.log(`  - daily.temperature_2m_min: ${data.daily.temperature_2m_min?.length || 0} values`)
    console.log(`  - daily.weathercode: ${data.daily.weathercode?.length || 0} values`)
    console.log(`  - daily.precipitation_probability_max: ${data.daily.precipitation_probability_max?.length || 0} values`)
    console.log(`  - daily.uv_index_max: ${data.daily.uv_index_max?.length || 0} values`)
    console.log('')

    console.log('Step 5: Parse today and tomorrow data')
    const forecast = parseDailyForecast(data.daily)

    console.log('✅ Data parsed successfully')
    console.log('')
    console.log('TODAY:')
    console.log(`  Date: ${forecast.today.time}`)
    console.log(`  High: ${forecast.today.temperatureMax}°C`)
    console.log(`  Low: ${forecast.today.temperatureMin}°C`)
    console.log(`  Weather code: ${forecast.today.weatherCode}`)
    console.log(`  Precipitation: ${forecast.today.precipitationProbabilityMax}%`)
    console.log(`  UV Index: ${forecast.today.uvIndexMax}`)
    console.log('')
    console.log('TOMORROW:')
    console.log(`  Date: ${forecast.tomorrow.time}`)
    console.log(`  High: ${forecast.tomorrow.temperatureMax}°C`)
    console.log(`  Low: ${forecast.tomorrow.temperatureMin}°C`)
    console.log(`  Weather code: ${forecast.tomorrow.weatherCode}`)
    console.log(`  Precipitation: ${forecast.tomorrow.precipitationProbabilityMax}%`)
    console.log(`  UV Index: ${forecast.tomorrow.uvIndexMax}`)
    console.log('')

    console.log('=== ✅ ALL TESTS PASSED ===')
    console.log('Feature #12 verified: API fetches daily forecast')

  } catch (error) {
    console.error('❌ FAILED:', error)
    process.exit(1)
  }
}

// Run the test
testDailyForecast()
