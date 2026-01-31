/**
 * Feature #15: Precipitation data fetched
 *
 * Verification that precipitation probability and amount are included in the API request
 * for umbrella/rain gear recommendations.
 *
 * Steps to verify:
 * 1. Add precipitation params to API
 * 2. Parse precipitation probability
 * 3. Parse precipitation amount (if needed)
 */

import { describe, it, expect } from 'vitest'
import {
  buildCurrentWeatherUrl,
  fetchCurrentWeather,
  parseDailyForecast,
  type CurrentWeatherResponse
} from '../openmeteo'

describe('Feature #15: Precipitation data fetched', () => {
  describe('Step 1: Add precipitation params to API', () => {
    it('should include precipitation_probability_max in daily params', () => {
      const url = buildCurrentWeatherUrl(40.7128, -74.006, 'celsius', 'kmh')
      const params = new URLSearchParams(url.split('?')[1])

      const dailyParams = params.get('daily')
      expect(dailyParams).toContain('precipitation_probability_max')
    })

    it('should build correct API URL with precipitation params', () => {
      const url = buildCurrentWeatherUrl(40.7128, -74.006, 'celsius', 'kmh')

      // Verify base URL
      expect(url).toContain('https://api.open-meteo.com/v1/forecast')

      // Verify precipitation_probability_max is in daily params
      expect(url).toContain('precipitation_probability_max')

      // Verify all daily params are present
      const params = new URLSearchParams(url.split('?')[1])
      const dailyParams = params.get('daily')?.split(',')

      expect(dailyParams).toContain('temperature_2m_max')
      expect(dailyParams).toContain('temperature_2m_min')
      expect(dailyParams).toContain('weathercode')
      expect(dailyParams).toContain('precipitation_probability_max')
      expect(dailyParams).toContain('uv_index_max')
    })

    it('should work with different unit combinations', () => {
      const urlCelsius = buildCurrentWeatherUrl(51.5074, -0.1278, 'celsius', 'kmh')
      const urlFahrenheit = buildCurrentWeatherUrl(51.5074, -0.1278, 'fahrenheit', 'mph')

      // Both should include precipitation params
      expect(urlCelsius).toContain('precipitation_probability_max')
      expect(urlFahrenheit).toContain('precipitation_probability_max')

      // Verify unit parameters
      expect(urlCelsius).toContain('temperature_unit=celsius')
      expect(urlCelsius).toContain('wind_speed_unit=kmh')

      expect(urlFahrenheit).toContain('temperature_unit=fahrenheit')
      expect(urlFahrenheit).toContain('wind_speed_unit=mph')
    })
  })

  describe('Step 2: Parse precipitation probability', () => {
    it('should parse precipitation_probability_max for today', () => {
      const mockDailyData: CurrentWeatherResponse['daily'] = {
        time: ['2024-01-15', '2024-01-16'],
        temperature_2m_max: [10, 12],
        temperature_2m_min: [5, 7],
        weathercode: [61, 0],
        precipitation_probability_max: [80, 20],
        uv_index_max: [3, 4]
      }

      const { today } = parseDailyForecast(mockDailyData)

      // Verify precipitation probability is parsed correctly
      expect(today.precipitationProbabilityMax).toBe(80)
    })

    it('should parse precipitation_probability_max for tomorrow', () => {
      const mockDailyData: CurrentWeatherResponse['daily'] = {
        time: ['2024-01-15', '2024-01-16'],
        temperature_2m_max: [10, 12],
        temperature_2m_min: [5, 7],
        weathercode: [61, 0],
        precipitation_probability_max: [80, 20],
        uv_index_max: [3, 4]
      }

      const { tomorrow } = parseDailyForecast(mockDailyData)

      // Verify precipitation probability is parsed correctly
      expect(tomorrow.precipitationProbabilityMax).toBe(20)
    })

    it('should handle edge case: 0% precipitation probability', () => {
      const mockDailyData: CurrentWeatherResponse['daily'] = {
        time: ['2024-01-15', '2024-01-16'],
        temperature_2m_max: [20, 22],
        temperature_2m_min: [15, 17],
        weathercode: [0, 0],
        precipitation_probability_max: [0, 5],
        uv_index_max: [5, 6]
      }

      const { today, tomorrow } = parseDailyForecast(mockDailyData)

      // Should handle 0% correctly
      expect(today.precipitationProbabilityMax).toBe(0)
      expect(tomorrow.precipitationProbabilityMax).toBe(5)
    })

    it('should handle edge case: 100% precipitation probability', () => {
      const mockDailyData: CurrentWeatherResponse['daily'] = {
        time: ['2024-01-15', '2024-01-16'],
        temperature_2m_max: [8, 10],
        temperature_2m_min: [4, 6],
        weathercode: [65, 63],
        precipitation_probability_max: [100, 95],
        uv_index_max: [1, 2]
      }

      const { today, tomorrow } = parseDailyForecast(mockDailyData)

      // Should handle 100% correctly
      expect(today.precipitationProbabilityMax).toBe(100)
      expect(tomorrow.precipitationProbabilityMax).toBe(95)
    })

    it('should parse all other daily fields along with precipitation', () => {
      const mockDailyData: CurrentWeatherResponse['daily'] = {
        time: ['2024-01-15', '2024-01-16'],
        temperature_2m_max: [15, 17],
        temperature_2m_min: [8, 10],
        weathercode: [2, 1],
        precipitation_probability_max: [30, 10],
        uv_index_max: [4, 5]
      }

      const { today } = parseDailyForecast(mockDailyData)

      // Verify all fields are present
      expect(today.time).toBe('2024-01-15')
      expect(today.temperatureMax).toBe(15)
      expect(today.temperatureMin).toBe(8)
      expect(today.weatherCode).toBe(2)
      expect(today.precipitationProbabilityMax).toBe(30)
      expect(today.uvIndexMax).toBe(4)
    })
  })

  describe('Integration: Full API response parsing', () => {
    it('should handle realistic API response with precipitation data', () => {
      const mockApiResponse: CurrentWeatherResponse = {
        latitude: 40.7128,
        longitude: -74.006,
        generationtime_ms: 0.5,
        utc_offset_seconds: -18000,
        timezone: 'America/New_York',
        timezone_abbreviation: 'EST',
        elevation: 10,
        current_units: {
          time: 'iso8601',
          interval: 'seconds',
          temperature: '°C',
          windspeed: 'km/h',
          is_day: 'numeric',
          weathercode: 'wmo code'
        },
        current: {
          time: '2024-01-15T12:00',
          interval: 900,
          temperature: 8.5,
          windspeed: 15,
          is_day: 1,
          weathercode: 61
        },
        daily_units: {
          time: 'iso8601',
          temperature_2m_max: '°C',
          temperature_2m_min: '°C',
          weathercode: 'wmo code',
          precipitation_probability_max: '%',
          uv_index_max: 'index'
        },
        daily: {
          time: ['2024-01-15', '2024-01-16'],
          temperature_2m_max: [10, 12],
          temperature_2m_min: [5, 7],
          weathercode: [61, 0],
          precipitation_probability_max: [80, 20],
          uv_index_max: [3, 4]
        }
      }

      const { today, tomorrow } = parseDailyForecast(mockApiResponse.daily)

      // Verify precipitation probability is correctly extracted
      expect(today.precipitationProbabilityMax).toBe(80)
      expect(tomorrow.precipitationProbabilityMax).toBe(20)

      // Verify units indicate percentage
      expect(mockApiResponse.daily_units.precipitation_probability_max).toBe('%')
    })

    it('should handle rainy day scenario (high precipitation probability)', () => {
      const mockDailyData: CurrentWeatherResponse['daily'] = {
        time: ['2024-03-20', '2024-03-21'],
        temperature_2m_max: [12, 15],
        temperature_2m_min: [8, 10],
        weathercode: [63, 2],
        precipitation_probability_max: [90, 15],
        uv_index_max: [2, 4]
      }

      const { today } = parseDailyForecast(mockDailyData)

      // High precipitation probability on rainy day
      expect(today.precipitationProbabilityMax).toBe(90)
      expect(today.weatherCode).toBe(63) // Moderate rain
    })

    it('should handle clear day scenario (low precipitation probability)', () => {
      const mockDailyData: CurrentWeatherResponse['daily'] = {
        time: ['2024-07-15', '2024-07-16'],
        temperature_2m_max: [30, 32],
        temperature_2m_min: [22, 24],
        weathercode: [0, 1],
        precipitation_probability_max: [0, 5],
        uv_index_max: [8, 9]
      }

      const { today, tomorrow } = parseDailyForecast(mockDailyData)

      // Low precipitation probability on clear days
      expect(today.precipitationProbabilityMax).toBe(0)
      expect(tomorrow.precipitationProbabilityMax).toBe(5)
      expect(today.weatherCode).toBe(0) // Clear sky
    })
  })

  describe('Data type validation', () => {
    it('should ensure precipitation_probability_max is a number', () => {
      const mockDailyData: CurrentWeatherResponse['daily'] = {
        time: ['2024-01-15', '2024-01-16'],
        temperature_2m_max: [10, 12],
        temperature_2m_min: [5, 7],
        weathercode: [61, 0],
        precipitation_probability_max: [75, 25],
        uv_index_max: [3, 4]
      }

      const { today, tomorrow } = parseDailyForecast(mockDailyData)

      expect(typeof today.precipitationProbabilityMax).toBe('number')
      expect(typeof tomorrow.precipitationProbabilityMax).toBe('number')
    })

    it('should handle valid range (0-100) for precipitation probability', () => {
      const testCases = [
        { prob: 0, valid: true },
        { prob: 50, valid: true },
        { prob: 100, valid: true }
      ]

      testCases.forEach(({ prob }) => {
        const mockDailyData: CurrentWeatherResponse['daily'] = {
          time: ['2024-01-15', '2024-01-16'],
          temperature_2m_max: [10, 12],
          temperature_2m_min: [5, 7],
          weathercode: [61, 0],
          precipitation_probability_max: [prob, 0],
          uv_index_max: [3, 4]
        }

        const { today } = parseDailyForecast(mockDailyData)
        expect(today.precipitationProbabilityMax).toBeGreaterThanOrEqual(0)
        expect(today.precipitationProbabilityMax).toBeLessThanOrEqual(100)
      })
    })
  })
})
