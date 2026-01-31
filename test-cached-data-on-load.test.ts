/**
 * Test Script for Feature #38: Cached data shown on load
 *
 * This test verifies that:
 * 1. localStorage is checked for cached data
 * 2. Cached data is displayed immediately
 * 3. Fresh data is fetched in the background
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useWeather } from './src/hooks/useWeather'
import { saveWeatherData, loadWeatherData, clearWeatherData } from './src/lib/weatherStorage'

describe('Feature #38: Cached data shown on load', () => {
  const testCoords = { lat: 37.7749, lon: -122.4194 }

  beforeEach(() => {
    // Clear localStorage before each test
    clearWeatherData()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearWeatherData()
  })

  it('Step 1: Check localStorage for cached data', () => {
    // Save test data to cache
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

    // Verify loadWeatherData returns the cached data
    const loaded = loadWeatherData(testCoords.lat, testCoords.lon)
    expect(loaded).not.toBeNull()
    expect(loaded?.temperature).toBe(20)
    expect(loaded?.condition).toBe('Clear sky')
  })

  it('Step 2: Display cached data immediately', async () => {
    // Save test data to cache
    const cachedData = {
      temperature: 15,
      weatherCode: 1,
      condition: 'Mainly clear',
      icon: '🌤️',
      windSpeed: 5,
      isDay: 1,
      location: {
        latitude: testCoords.lat,
        longitude: testCoords.lon,
        timezone: 'America/Los_Angeles'
      }
    }
    saveWeatherData(cachedData, testCoords.lat, testCoords.lon)

    // Render the hook
    const { result } = renderHook(() => useWeather(testCoords.lat, testCoords.lon))

    // Cached data should be available immediately (synchronously)
    expect(result.current.weather).not.toBeNull()
    expect(result.current.weather?.temperature).toBe(15)
    expect(result.current.weather?.condition).toBe('Mainly clear')

    // loading should be false because we have cached data
    expect(result.current.loading).toBe(false)

    // refreshing should be true during background fetch
    expect(result.current.refreshing).toBe(true)
  })

  it('Step 3: Fetch fresh data in background', async () => {
    // Save test data to cache (old data)
    const cachedData = {
      temperature: 15,
      weatherCode: 1,
      condition: 'Mainly clear',
      icon: '🌤️',
      windSpeed: 5,
      isDay: 1,
      location: {
        latitude: testCoords.lat,
        longitude: testCoords.lon,
        timezone: 'America/Los_Angeles'
      }
    }
    saveWeatherData(cachedData, testCoords.lat, testCoords.lon)

    // Render the hook
    const { result } = renderHook(() => useWeather(testCoords.lat, testCoords.lon))

    // Initially, cached data is shown
    expect(result.current.weather?.temperature).toBe(15)
    expect(result.current.refreshing).toBe(true)

    // Wait for background fetch to complete
    await waitFor(() => {
      expect(result.current.refreshing).toBe(false)
    }, { timeout: 10000 })

    // Fresh data should now be displayed
    expect(result.current.weather).not.toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.refreshing).toBe(false)

    // Cache age should be 0 (fresh data)
    expect(result.current.cacheAge).toBe(0)
  })

  it('Initial load without cache shows loading state', async () => {
    // No cache - should show loading state
    const { result } = renderHook(() => useWeather(testCoords.lat, testCoords.lon))

    // Initially should be loading with no weather data
    expect(result.current.loading).toBe(true)
    expect(result.current.weather).toBeNull()

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 10000 })

    // Should have weather data after fetch
    expect(result.current.weather).not.toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('Cached data is shown while refreshing (no blocking)', async () => {
    // Save cached data
    const cachedData = {
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
    saveWeatherData(cachedData, testCoords.lat, testCoords.lon)

    // Render the hook
    const { result } = renderHook(() => useWeather(testCoords.lat, testCoords.lon))

    // Cached data should be available immediately
    expect(result.current.weather).not.toBeNull()
    expect(result.current.weather?.temperature).toBe(18)

    // Loading should be false (not blocking)
    expect(result.current.loading).toBe(false)

    // Refreshing should be true (background fetch in progress)
    expect(result.current.refreshing).toBe(true)

    // Wait for background fetch to complete
    await waitFor(() => {
      expect(result.current.refreshing).toBe(false)
    }, { timeout: 10000 })

    // Data should be updated
    expect(result.current.weather).not.toBeNull()
    expect(result.current.loading).toBe(false)
  })
})
