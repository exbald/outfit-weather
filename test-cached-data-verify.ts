/**
 * Verification Script for Feature #38: Cached data shown on load
 *
 * This script tests the caching behavior directly without React Testing Library
 */

import { saveWeatherData, loadWeatherData, clearWeatherData, getCacheAge } from './src/lib/weatherStorage'

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function assert(condition: boolean, message: string) {
  if (condition) {
    log(`✅ ${message}`, colors.green)
    return true
  } else {
    log(`❌ ${message}`, colors.red)
    return false
  }
}

const testCoords = { lat: 37.7749, lon: -122.4194 }

log('\n=== Feature #38: Cached data shown on load ===\n', colors.blue)

// Clear any existing cache
clearWeatherData()

// Test 1: Check localStorage for cached data
log('Step 1: Check localStorage for cached data', colors.yellow)

const cachedData = {
  temperature: 20,
  weatherCode: 0,
  condition: 'Clear sky',
  icon: '☀️',
  windSpeed: 10,
  isDay: 1,
  location: {
    latitude: testCoords.lat,
    longitude: testCoords.lon,
    timezone: 'America/Los_Angeles'
  }
}

saveWeatherData(cachedData, testCoords.lat, testCoords.lon)

const loaded = loadWeatherData(testCoords.lat, testCoords.lon)
const test1Results = [
  assert(loaded !== null, 'loadWeatherData returns cached data'),
  assert(loaded?.temperature === 20, 'Cached temperature is correct'),
  assert(loaded?.condition === 'Clear sky', 'Cached condition is correct'),
  assert(loaded?.icon === '☀️', 'Cached icon is correct')
]

log(`\nStep 1 Results: ${test1Results.filter(r => r).length}/${test1Results.length} tests passed\n`, colors.blue)

// Test 2: Display cached data immediately
log('Step 2: Display cached data immediately', colors.yellow)

// Simulate immediate display by checking cache availability
const immediateLoad = loadWeatherData(testCoords.lat, testCoords.lon)
const test2Results = [
  assert(immediateLoad !== null, 'Cached data is available immediately (synchronous)'),
  assert(immediateLoad?.temperature === 20, 'Immediate data has correct temperature'),
  assert(getCacheAge() >= 0, 'Cache age is retrievable')
]

log(`\nStep 2 Results: ${test2Results.filter(r => r).length}/${test2Results.length} tests passed\n`, colors.blue)

// Test 3: Background refresh behavior (simulated)
log('Step 3: Fresh data fetched in background (simulated)', colors.yellow)

// Simulate updating cache with fresh data
const freshData = {
  temperature: 22,
  weatherCode: 1,
  condition: 'Mainly clear',
  icon: '🌤️',
  windSpeed: 12,
  isDay: 1,
  location: {
    latitude: testCoords.lat,
    longitude: testCoords.lon,
    timezone: 'America/Los_Angeles'
  }
}

saveWeatherData(freshData, testCoords.lat, testCoords.lon)

const freshLoad = loadWeatherData(testCoords.lat, testCoords.lon)
const test3Results = [
  assert(freshLoad !== null, 'Fresh data is saved to cache'),
  assert(freshLoad?.temperature === 22, 'Fresh data has updated temperature'),
  assert(freshLoad?.condition === 'Mainly clear', 'Fresh data has updated condition'),
  assert(getCacheAge() === 0, 'Fresh cache age is 0')
]

log(`\nStep 3 Results: ${test3Results.filter(r => r).length}/${test3Results.length} tests passed\n`, colors.blue)

// Test 4: Cache expiry
log('Step 4: Cache respects expiry time', colors.yellow)

// Save data with old timestamp (simulate expired cache)
const oldData = {
  temperature: 18,
  weatherCode: 2,
  condition: 'Partly cloudy',
  icon: '⛅',
  windSpeed: 8,
  isDay: 1,
  location: {
    latitude: testCoords.lat,
    longitude: testCoords.lon,
    timezone: 'America/Los_Angeles'
  }
}

saveWeatherData(oldData, testCoords.lat, testCoords.lon)

// Manually set old timestamp by manipulating localStorage
const cacheEntry = localStorage.getItem('outfit_weather_cache')
if (cacheEntry) {
  const parsed = JSON.parse(cacheEntry)
  parsed.timestamp = Date.now() - (31 * 60 * 1000) // 31 minutes ago
  localStorage.setItem('outfit_weather_cache', JSON.stringify(parsed))
}

const expiredLoad = loadWeatherData(testCoords.lat, testCoords.lon, 30 * 60 * 1000) // 30 min max age
const test4Results = [
  assert(expiredLoad === null, 'Expired cache returns null'),
  assert(getCacheAge() === -1, 'Cache age is -1 for expired cache')
]

log(`\nStep 4 Results: ${test4Results.filter(r => r).length}/${test4Results.length} tests passed\n`, colors.blue)

// Test 5: Location mismatch
log('Step 5: Cache invalidates on location change', colors.yellow)

clearWeatherData()
saveWeatherData(cachedData, testCoords.lat, testCoords.lon)

const mismatchLoad = loadWeatherData(40.7128, -74.0060) // New York coordinates
const test5Results = [
  assert(mismatchLoad === null, 'Cache returns null for different location'),
  assert(loadWeatherData(testCoords.lat, testCoords.lon) !== null, 'Cache still valid for original location')
]

log(`\nStep 5 Results: ${test5Results.filter(r => r).length}/${test5Results.length} tests passed\n`, colors.blue)

// Summary
const allResults = [...test1Results, ...test2Results, ...test3Results, ...test4Results, ...test5Results]
const passed = allResults.filter(r => r).length
const total = allResults.length

log('\n=== Summary ===', colors.blue)
log(`Total: ${passed}/${total} tests passed`, passed === total ? colors.green : colors.red)

if (passed === total) {
  log('\n✅ Feature #38 verification PASSED\n', colors.green)
} else {
  log('\n❌ Feature #38 verification FAILED\n', colors.red)
  process.exit(1)
}

// Cleanup
clearWeatherData()
