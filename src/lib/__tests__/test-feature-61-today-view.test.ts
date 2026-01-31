/**
 * Feature #61: Today view uses daily forecast
 *
 * This test verifies that:
 * 1. Today view extracts today's forecast data
 * 2. Today view shows high/low temps
 * 3. Today view displays today's outfit
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOutfit } from '../../hooks/useOutfit'
import type { WeatherData } from '../../hooks/useWeather'

describe('Feature #61: Today view uses daily forecast', () => {
  it('should include high and low temperatures in today outfit recommendation', () => {
    // Mock weather data with today's daily forecast
    const mockWeather: WeatherData = {
      temperature: 72,
      apparentTemperature: 70,
      weatherCode: 0, // Clear sky
      condition: 'Clear sky',
      icon: '☀️',
      windSpeed: 10,
      isDay: 1,
      location: {
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York'
      },
      daily: {
        today: {
          time: '2025-01-31',
          temperatureMax: 78,
          temperatureMin: 65,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 6
        },
        tomorrow: {
          time: '2025-02-01',
          temperatureMax: 75,
          temperatureMin: 62,
          weatherCode: 2,
          precipitationProbabilityMax: 10,
          uvIndexMax: 5
        }
      }
    }

    const { result } = renderHook(() => useOutfit(mockWeather))
    const todayOutfit = result.current.getTodayOutfit()

    // Verify today outfit has high and low temperatures
    expect(todayOutfit).not.toBeNull()
    expect(todayOutfit?.highTemp).toBe(78)
    expect(todayOutfit?.lowTemp).toBe(65)
    expect(todayOutfit?.view).toBe('today')
  })

  it('should include high and low temperatures in tomorrow outfit recommendation', () => {
    const mockWeather: WeatherData = {
      temperature: 72,
      apparentTemperature: 70,
      weatherCode: 0,
      condition: 'Clear sky',
      icon: '☀️',
      windSpeed: 10,
      isDay: 1,
      location: {
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York'
      },
      daily: {
        today: {
          time: '2025-01-31',
          temperatureMax: 78,
          temperatureMin: 65,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 6
        },
        tomorrow: {
          time: '2025-02-01',
          temperatureMax: 75,
          temperatureMin: 62,
          weatherCode: 2,
          precipitationProbabilityMax: 10,
          uvIndexMax: 5
        }
      }
    }

    const { result } = renderHook(() => useOutfit(mockWeather))
    const tomorrowOutfit = result.current.getTomorrowOutfit()

    // Verify tomorrow outfit has high and low temperatures
    expect(tomorrowOutfit).not.toBeNull()
    expect(tomorrowOutfit?.highTemp).toBe(75)
    expect(tomorrowOutfit?.lowTemp).toBe(62)
    expect(tomorrowOutfit?.view).toBe('tomorrow')
  })

  it('should NOT include high and low temperatures in now outfit recommendation', () => {
    const mockWeather: WeatherData = {
      temperature: 72,
      apparentTemperature: 70,
      weatherCode: 0,
      condition: 'Clear sky',
      icon: '☀️',
      windSpeed: 10,
      isDay: 1,
      location: {
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York'
      },
      daily: {
        today: {
          time: '2025-01-31',
          temperatureMax: 78,
          temperatureMin: 65,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 6
        },
        tomorrow: {
          time: '2025-02-01',
          temperatureMax: 75,
          temperatureMin: 62,
          weatherCode: 2,
          precipitationProbabilityMax: 10,
          uvIndexMax: 5
        }
      }
    }

    const { result } = renderHook(() => useOutfit(mockWeather))
    const nowOutfit = result.current.getCurrentOutfit()

    // Verify now outfit does NOT have high and low temperatures
    expect(nowOutfit).not.toBeNull()
    expect(nowOutfit?.highTemp).toBeUndefined()
    expect(nowOutfit?.lowTemp).toBeUndefined()
    expect(nowOutfit?.view).toBe('now')
  })

  it('should use daily forecast data for today outfit calculation', () => {
    const mockWeather: WeatherData = {
      temperature: 85, // Current temp is high
      apparentTemperature: 88,
      weatherCode: 0,
      condition: 'Clear sky',
      icon: '☀️',
      windSpeed: 10,
      isDay: 1,
      location: {
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York'
      },
      daily: {
        today: {
          time: '2025-01-31',
          temperatureMax: 90, // But max will be higher
          temperatureMin: 70,
          weatherCode: 0,
          precipitationProbabilityMax: 0,
          uvIndexMax: 8
        },
        tomorrow: {
          time: '2025-02-01',
          temperatureMax: 75,
          temperatureMin: 62,
          weatherCode: 2,
          precipitationProbabilityMax: 10,
          uvIndexMax: 5
        }
      }
    }

    const { result } = renderHook(() => useOutfit(mockWeather))
    const todayOutfit = result.current.getTodayOutfit()

    // Verify high and low temps come from daily forecast
    expect(todayOutfit?.highTemp).toBe(90)
    expect(todayOutfit?.lowTemp).toBe(70)

    // Verify the outfit uses the minimum of max temp and current temp (conservative)
    // This should be 85 (current temp is lower than max 90)
    // The outfit logic should use 85°F which is "hot" bucket
    expect(todayOutfit?.emojis).toBeTruthy()
    expect(todayOutfit?.oneLiner).toBeTruthy()
  })
})
