/**
 * Feature #51 Test: API failure uses cached data
 *
 * This test verifies that when the weather API returns an error,
 * the app falls back to cached data and displays a "using cached data" message.
 *
 * Test Steps:
 * 1. Catch API error responses
 * 2. Fall back to cache
 * 3. Show 'using cached data' message
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useWeather } from '../../hooks/useWeather'
import * as openmeteo from '../../lib/openmeteo'
import * as weatherStorage from '../../lib/weatherStorage'

// Mock the openmeteo module
vi.mock('../../lib/openmeteo', () => ({
  fetchCurrentWeather: vi.fn(),
  getWeatherCondition: vi.fn(() => ({ description: 'Clear sky', icon: '☀️', category: 'clear' as const })),
  parseDailyForecast: vi.fn(() => ({
    today: {
      time: '2024-01-15',
      temperatureMax: 10,
      temperatureMin: 5,
      weatherCode: 0,
      precipitationProbabilityMax: 0,
      uvIndexMax: 2
    },
    tomorrow: {
      time: '2024-01-16',
      temperatureMax: 12,
      temperatureMin: 6,
      weatherCode: 0,
      precipitationProbabilityMax: 0,
      uvIndexMax: 3
    }
  }))
}))

// Mock the weatherStorage module
vi.mock('../../lib/weatherStorage', () => ({
  saveWeatherData: vi.fn(),
  loadWeatherData: vi.fn(),
  getCacheAge: vi.fn(() => 120), // 2 minutes old
  clearWeatherData: vi.fn()
}))

describe('Feature #51: API failure uses cached data', () => {
  const mockLat = 40.7128
  const mockLon = -74.0060

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Step 1: Catch API error responses', async () => {
    // Mock API to throw an error
    vi.mocked(openmeteo.fetchCurrentWeather).mockRejectedValue(
      new Error('No internet connection')
    )

    const { result } = renderHook(() => useWeather(mockLat, mockLon))

    // Wait for the hook to process the error
    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })

    expect(result.current.error).toBe('No internet connection')
  })

  it('Step 2: Fall back to cache when API fails', async () => {
    const mockCachedWeather = {
      temperature: 15,
      weatherCode: 0,
      condition: 'Clear sky',
      icon: '☀️',
      windSpeed: 10,
      isDay: 1,
      location: {
        latitude: mockLat,
        longitude: mockLon,
        timezone: 'America/New_York'
      },
      daily: {
        today: {
          time: '2024-01-15',
          temperatureMax: 10,
          temperatureMin: 5,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 2
        },
        tomorrow: {
          time: '2024-01-16',
          temperatureMax: 12,
          temperatureMin: 6,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 3
        }
      }
    }

    // Mock API to throw an error
    vi.mocked(openmeteo.fetchCurrentWeather).mockRejectedValue(
      new Error('No internet connection')
    )

    // Mock cache to return data
    vi.mocked(weatherStorage.loadWeatherData).mockReturnValue(mockCachedWeather)

    const { result } = renderHook(() => useWeather(mockLat, mockLon))

    // Wait for the hook to load cached data
    await waitFor(() => {
      expect(result.current.weather).toBeTruthy()
    })

    // Verify cached data is displayed
    expect(result.current.weather).toEqual(mockCachedWeather)
    expect(result.current.offline).toBe(true)
    expect(result.current.error).toBe('No internet connection')
  })

  it('Step 3: Show "using cached data" message via offline flag', async () => {
    const mockCachedWeather = {
      temperature: 15,
      weatherCode: 0,
      condition: 'Clear sky',
      icon: '☀️',
      windSpeed: 10,
      isDay: 1,
      location: {
        latitude: mockLat,
        longitude: mockLon,
        timezone: 'America/New_York'
      },
      daily: {
        today: {
          time: '2024-01-15',
          temperatureMax: 10,
          temperatureMin: 5,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 2
        },
        tomorrow: {
          time: '2024-01-16',
          temperatureMax: 12,
          temperatureMin: 6,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 3
        }
      }
    }

    // Mock API to throw an error
    vi.mocked(openmeteo.fetchCurrentWeather).mockRejectedValue(
      new Error('Network request failed')
    )

    // Mock cache to return data
    vi.mocked(weatherStorage.loadWeatherData).mockReturnValue(mockCachedWeather)

    const { result } = renderHook(() => useWeather(mockLat, mockLon))

    // Wait for the hook to process
    await waitFor(() => {
      expect(result.current.offline).toBe(true)
    })

    // Verify the offline flag is set (UI component uses this to show the message)
    expect(result.current.offline).toBe(true)
    expect(result.current.error).toBe('Network request failed')
    expect(result.current.weather).toEqual(mockCachedWeather)
    expect(result.current.cacheAge).toBe(120) // 2 minutes
  })

  it('shows error screen when no cached data is available', async () => {
    // Mock API to throw an error
    vi.mocked(openmeteo.fetchCurrentWeather).mockRejectedValue(
      new Error('No internet connection')
    )

    // Mock cache to return null (no cached data)
    vi.mocked(weatherStorage.loadWeatherData).mockReturnValue(null)

    const { result } = renderHook(() => useWeather(mockLat, mockLon))

    // Wait for the hook to process
    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })

    // Verify error state without cached data
    expect(result.current.error).toBe('No internet connection')
    expect(result.current.weather).toBeNull()
    expect(result.current.offline).toBe(false)
  })

  it('recovers from offline mode when API succeeds on retry', async () => {
    const mockFreshWeather = {
      temperature: 18,
      weatherCode: 1,
      condition: 'Mainly clear',
      icon: '🌤️',
      windSpeed: 12,
      isDay: 1,
      location: {
        latitude: mockLat,
        longitude: mockLon,
        timezone: 'America/New_York'
      },
      daily: {
        today: {
          time: '2024-01-15',
          temperatureMax: 12,
          temperatureMin: 6,
          weatherCode: 1,
          precipitationProbabilityMax: 0,
          uvIndexMax: 3
        },
        tomorrow: {
          time: '2024-01-16',
          temperatureMax: 14,
          temperatureMin: 7,
          weatherCode: 1,
          precipitationProbabilityMax: 0,
          uvIndexMax: 4
        }
      }
    }

    // Initial state: API fails, cache exists
    vi.mocked(openmeteo.fetchCurrentWeather).mockRejectedValueOnce(
      new Error('Network error')
    )
    vi.mocked(weatherStorage.loadWeatherData).mockReturnValueOnce({
      temperature: 15,
      weatherCode: 0,
      condition: 'Clear sky',
      icon: '☀️',
      windSpeed: 10,
      isDay: 1,
      location: {
        latitude: mockLat,
        longitude: mockLon,
        timezone: 'America/New_York'
      },
      daily: {
        today: {
          time: '2024-01-15',
          temperatureMax: 10,
          temperatureMin: 5,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 2
        },
        tomorrow: {
          time: '2024-01-16',
          temperatureMax: 12,
          temperatureMin: 6,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 3
        }
      }
    })

    const { result } = renderHook(() => useWeather(mockLat, mockLon))

    // Wait for offline state
    await waitFor(() => {
      expect(result.current.offline).toBe(true)
    })

    // Now retry with successful API response
    vi.mocked(openmeteo.fetchCurrentWeather).mockResolvedValueOnce({
      latitude: mockLat,
      longitude: mockLon,
      generationtime_ms: 123,
      utc_offset_seconds: -18000,
      timezone: 'America/New_York',
      timezone_abbreviation: 'EST',
      elevation: 10,
      current: {
        time: '2024-01-15T12:00',
        interval: 900,
        temperature: 18,
        windspeed: 12,
        is_day: 1,
        weathercode: 1
      },
      daily: {
        time: ['2024-01-15', '2024-01-16'],
        temperature_2m_max: [12, 14],
        temperature_2m_min: [6, 7],
        weathercode: [1, 1],
        precipitation_probability_max: [0, 0],
        uv_index_max: [3, 4]
      },
      current_units: {
        time: 'iso8601',
        interval: 'seconds',
        temperature: '°C',
        windspeed: 'km/h',
        is_day: 'numeric',
        weathercode: 'wmo code'
      },
      daily_units: {
        time: 'iso8601',
        temperature_2m_max: '°C',
        temperature_2m_min: '°C',
        weathercode: 'wmo code',
        precipitation_probability_max: '%',
        uv_index_max: 'index'
      }
    })

    // Call retry
    await act(async () => {
      await result.current.retry()
    })

    // Verify offline mode is cleared
    expect(result.current.offline).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.weather?.temperature).toBe(18)
  })
})
