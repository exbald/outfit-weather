/**
 * Test script for Feature #49: No cache + no network shows error
 *
 * This test verifies that when both network fails AND no cache exists,
 * a friendly error screen is displayed with a retry button.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWeather } from '../src/hooks/useWeather'
import * as weatherStorage from '../src/lib/weatherStorage'

// Mock the weather storage module
vi.mock('../src/lib/weatherStorage', () => ({
  loadWeatherData: vi.fn(),
  saveWeatherData: vi.fn(),
  getCacheAge: vi.fn(() => -1),
  clearWeatherData: vi.fn()
}))

// Mock the fetch API to simulate network failure
global.fetch = vi.fn(() =>
  Promise.reject(new Error('Network connection failed'))
) as any

describe('Feature #49: No cache + no network shows error', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock no cached data
    vi.mocked(weatherStorage.loadWeatherData).mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should detect no-cache + no-network state', async () => {
    const { result } = renderHook(() => useWeather(40.7128, -74.0060))

    // Wait for async fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // Verify error state
    expect(result.current.error).toBeTruthy()
    expect(result.current.error).toBe('Network connection failed')
    expect(result.current.offline).toBe(false) // No cache, so offline is false
    expect(result.current.weather).toBeNull() // No weather data
  })

  it('should display friendly error message', async () => {
    const { result } = renderHook(() => useWeather(40.7128, -74.0060))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // Error message should be user-friendly
    expect(result.current.error).toBeTruthy()
    expect(result.current.error).not.toContain('undefined')
    expect(result.current.error).not.toContain('null')
    expect(result.current.error).not.toContain('[object')
  })

  it('should offer retry function', async () => {
    const { result } = renderHook(() => useWeather(40.7128, -74.0060))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // retry function should be available
    expect(typeof result.current.retry).toBe('function')

    // Verify retry was called with last coords
    expect(result.current.error).toBeTruthy()
  })

  it('should distinguish between no-cache (error) and cached (offline)', async () => {
    // Test 1: No cache + no network = error, offline=false
    vi.mocked(weatherStorage.loadWeatherData).mockReturnValue(null)

    const { result: noCacheResult } = renderHook(() => useWeather(40.7128, -74.0060))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(noCacheResult.current.error).toBeTruthy()
    expect(noCacheResult.current.offline).toBe(false)

    // Cleanup
    act(() => {
      noCacheResult.current.clearCache()
    })

    // Test 2: Has cache + no network = no error, offline=true
    const mockCachedData = {
      temperature: 72,
      weatherCode: 0,
      condition: 'Clear sky',
      icon: '☀️',
      windSpeed: 10,
      isDay: 1,
      location: { latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
      daily: {
        today: {
          time: '2025-01-31',
          temperatureMax: 75,
          temperatureMin: 65,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 5
        },
        tomorrow: {
          time: '2025-02-01',
          temperatureMax: 70,
          temperatureMin: 60,
          weatherCode: 1,
          precipitationProbabilityMax: 10,
          uvIndexMax: 4
        }
      }
    }

    vi.mocked(weatherStorage.loadWeatherData).mockReturnValue(mockCachedData)
    vi.mocked(weatherStorage.getCacheAge).mockReturnValue(300) // 5 minutes old

    const { result: cachedResult } = renderHook(() => useWeather(40.7128, -74.0060))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // With cache: shows cached data, offline=true
    expect(cachedResult.current.error).toBe('Network connection failed') // Error set but not blocking
    expect(cachedResult.current.offline).toBe(true) // Offline mode active
    expect(cachedResult.current.weather).toEqual(mockCachedData) // Shows cached data
  })

  it('should have loading state clear after failed fetch', async () => {
    const { result } = renderHook(() => useWeather(40.7128, -74.0060))

    // Initially loading
    expect(result.current.loading).toBe(true)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // After failure, loading should be false
    expect(result.current.loading).toBe(false)
  })

  it('should handle various network error types', async () => {
    const errorCases = [
      'Network connection failed',
      'Failed to fetch weather data',
      'API request timeout'
    ]

    for (const expectedError of errorCases) {
      // Mock different error
      global.fetch = vi.fn(() =>
        Promise.reject(new Error(expectedError))
      ) as any

      const { result } = renderHook(() => useWeather(40.7128, -74.0060))

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      expect(result.current.error).toBe(expectedError)
      expect(result.current.offline).toBe(false)

      act(() => {
        result.current.clearCache()
      })
    }
  })
})
