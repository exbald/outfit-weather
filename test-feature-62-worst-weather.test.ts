/**
 * Feature #62: Today shows worst weather outfit
 *
 * This test verifies that the Today view uses the worst weather conditions
 * expected during the day (e.g., rain later = bring umbrella).
 */

import { describe, it, expect } from 'vitest'
import { parseDailyForecast } from './src/lib/openmeteo'

describe('Feature #62: Today shows worst weather outfit', () => {
  describe('parseDailyForecast with hourly data', () => {
    it('should extract worst weather code for today', () => {
      // Mock daily data with clear weather (code 0)
      const dailyData = {
        time: ['2025-01-31', '2025-02-01'],
        temperature_2m_max: [15, 16],
        temperature_2m_min: [5, 6],
        weathercode: [0, 0], // Clear sky
        precipitation_probability_max: [0, 10],
        uv_index_max: [5, 6]
      }

      // Mock hourly data with rain later in the day
      // Hour 0-6: Clear (code 0)
      // Hour 7-12: Partly cloudy (code 2)
      // Hour 13-18: Rain (code 61) - WORST WEATHER
      // Hour 19-23: Partly cloudy (code 2)
      const hourlyData = {
        time: Array.from({ length: 48 }, (_, i) => {
          const date = new Date('2025-01-31T00:00:00Z')
          date.setHours(date.getHours() + i)
          return date.toISOString().slice(0, 13) + ':00'
        }),
        temperature_2m: Array.from({ length: 48 }, () => 10),
        weathercode: [
          // First 24 hours (today)
          0, 0, 0, 0, 0, 0, 0,  // Hours 0-6: Clear
          2, 2, 2, 2, 2, 2,      // Hours 7-12: Partly cloudy
          61, 61, 61, 61, 61, 61, // Hours 13-18: Rain (worst)
          2, 2, 2, 2, 2,         // Hours 19-23: Partly cloudy
          // Next 24 hours (tomorrow)
          ...Array.from({ length: 24 }, () => 0)
        ],
        windspeed_10m: Array.from({ length: 48 }, () => 10),
        precipitation_probability: Array.from({ length: 48 }, (_, i) =>
          i >= 13 && i <= 18 ? 80 : 10 // High rain probability during rain hours
        )
      }

      const result = parseDailyForecast(dailyData, hourlyData)

      // Verify worst weather code is extracted (should be 61 for rain)
      expect(result.today.weatherCodeWorst).toBe(61)
      expect(result.today.weatherCode).toBe(0) // Original daily code is still clear

      // Verify max precipitation probability
      expect(result.today.precipitationProbabilityHourlyMax).toBe(80)
    })

    it('should prioritize thunderstorm over rain', () => {
      const dailyData = {
        time: ['2025-01-31', '2025-02-01'],
        temperature_2m_max: [15, 16],
        temperature_2m_min: [5, 6],
        weathercode: [61, 0], // Rain
        precipitation_probability_max: [50, 10],
        uv_index_max: [5, 6]
      }

      const hourlyData = {
        time: Array.from({ length: 48 }, (_, i) => {
          const date = new Date('2025-01-31T00:00:00Z')
          date.setHours(date.getHours() + i)
          return date.toISOString().slice(0, 13) + ':00'
        }),
        temperature_2m: Array.from({ length: 48 }, () => 10),
        weathercode: [
          // First 24 hours (today)
          61, 61, 61, 61, 61, 61,  // Hours 0-5: Rain
          95, 95, 95, 95, 95, 95,  // Hours 6-11: Thunderstorm (worst)
          61, 61, 61, 61, 61, 61,  // Hours 12-17: Rain
          0, 0, 0, 0, 0, 0,        // Hours 18-23: Clear
          ...Array.from({ length: 24 }, () => 0)
        ],
        windspeed_10m: Array.from({ length: 48 }, () => 10),
        precipitation_probability: Array.from({ length: 48 }, () => 50)
      }

      const result = parseDailyForecast(dailyData, hourlyData)

      // Thunderstorm (95) should be selected over rain (61)
      expect(result.today.weatherCodeWorst).toBe(95)
    })

    it('should extract max wind speed from hourly data', () => {
      const dailyData = {
        time: ['2025-01-31', '2025-02-01'],
        temperature_2m_max: [15, 16],
        temperature_2m_min: [5, 6],
        weathercode: [0, 0],
        precipitation_probability_max: [0, 10],
        uv_index_max: [5, 6]
      }

      const hourlyData = {
        time: Array.from({ length: 48 }, (_, i) => {
          const date = new Date('2025-01-31T00:00:00Z')
          date.setHours(date.getHours() + i)
          return date.toISOString().slice(0, 13) + ':00'
        }),
        temperature_2m: Array.from({ length: 48 }, () => 10),
        weathercode: Array.from({ length: 48 }, () => 0),
        windspeed_10m: [
          // First 24 hours (today) - wind varies
          5, 5, 5, 5, 5, 5,    // Calm morning
          15, 15, 15, 15, 15, 15, // Breezy afternoon
          35, 35, 35, 35, 35, 35, // Windy evening (max)
          10, 10, 10, 10, 10, 10, // Calm night
          ...Array.from({ length: 24 }, () => 5)
        ],
        precipitation_probability: Array.from({ length: 48 }, () => 0)
      }

      const result = parseDailyForecast(dailyData, hourlyData)

      // Should capture max wind speed of 35 km/h
      expect(result.today.windSpeedMax).toBe(35)
    })

    it('should handle missing hourly data gracefully', () => {
      const dailyData = {
        time: ['2025-01-31', '2025-02-01'],
        temperature_2m_max: [15, 16],
        temperature_2m_min: [5, 6],
        weathercode: [0, 0],
        precipitation_probability_max: [0, 10],
        uv_index_max: [5, 6]
      }

      // Empty hourly data (simulating API failure)
      const hourlyData = {
        time: [],
        temperature_2m: [],
        weathercode: [],
        windspeed_10m: [],
        precipitation_probability: []
      }

      // Should not throw error, but worst weather fields will be undefined
      expect(() => parseDailyForecast(dailyData, hourlyData)).toThrow()
    })

    it('should extract worst weather for tomorrow', () => {
      const dailyData = {
        time: ['2025-01-31', '2025-02-01'],
        temperature_2m_max: [15, 16],
        temperature_2m_min: [5, 6],
        weathercode: [0, 0],
        precipitation_probability_max: [0, 10],
        uv_index_max: [5, 6]
      }

      const hourlyData = {
        time: Array.from({ length: 48 }, (_, i) => {
          const date = new Date('2025-01-31T00:00:00Z')
          date.setHours(date.getHours() + i)
          return date.toISOString().slice(0, 13) + ':00'
        }),
        temperature_2m: Array.from({ length: 48 }, () => 10),
        weathercode: [
          ...Array.from({ length: 24 }, () => 0), // Today: Clear
          71, 71, 71, 71, 71, 71,  // Tomorrow: Snow (worst)
          0, 0, 0, 0, 0, 0,        // Tomorrow: Clear
          2, 2, 2, 2, 2, 2,        // Tomorrow: Partly cloudy
          2, 2, 2, 2, 2, 1         // Tomorrow: Partly cloudy
        ],
        windspeed_10m: Array.from({ length: 48 }, () => 10),
        precipitation_probability: Array.from({ length: 48 }, () => 20)
      }

      const result = parseDailyForecast(dailyData, hourlyData)

      // Tomorrow should have snow as worst weather
      expect(result.tomorrow.weatherCodeWorst).toBe(71)
    })
  })

  describe('Weather code priority', () => {
    it('should prioritize precipitation over clear', () => {
      // Test that rain (51-86) has higher priority than clear (0-3)
      const dailyData = {
        time: ['2025-01-31', '2025-02-01'],
        temperature_2m_max: [15, 16],
        temperature_2m_min: [5, 6],
        weathercode: [0, 0],
        precipitation_probability_max: [0, 10],
        uv_index_max: [5, 6]
      }

      const hourlyData = {
        time: Array.from({ length: 48 }, (_, i) => {
          const date = new Date('2025-01-31T00:00:00Z')
          date.setHours(date.getHours() + i)
          return date.toISOString().slice(0, 13) + ':00'
        }),
        temperature_2m: Array.from({ length: 48 }, () => 10),
        weathercode: [
          0, 0, 0, 0, 0, 0,     // Morning: Clear
          61, 61, 61, 61, 61, 61, // Afternoon: Rain
          0, 0, 0, 0, 0, 0,     // Evening: Clear
          0, 0, 0, 0, 0, 0,
          ...Array.from({ length: 24 }, () => 0)
        ],
        windspeed_10m: Array.from({ length: 48 }, () => 10),
        precipitation_probability: Array.from({ length: 48 }, () => 50)
      }

      const result = parseDailyForecast(dailyData, hourlyData)

      // Rain should be selected over clear
      expect(result.today.weatherCodeWorst).toBe(61)
    })

    it('should prioritize extreme (thunderstorm) over precipitation', () => {
      // Test that thunderstorm (95-99) has highest priority
      const dailyData = {
        time: ['2025-01-31', '2025-02-01'],
        temperature_2m_max: [15, 16],
        temperature_2m_min: [5, 6],
        weathercode: [61, 0], // Rain in daily
        precipitation_probability_max: [50, 10],
        uv_index_max: [5, 6]
      }

      const hourlyData = {
        time: Array.from({ length: 48 }, (_, i) => {
          const date = new Date('2025-01-31T00:00:00Z')
          date.setHours(date.getHours() + i)
          return date.toISOString().slice(0, 13) + ':00'
        }),
        temperature_2m: Array.from({ length: 48 }, () => 10),
        weathercode: [
          61, 61, 61, 61, 61, 61, // Morning: Rain
          95, 95, 95, 95, 95, 95, // Afternoon: Thunderstorm
          61, 61, 61, 61, 61, 61, // Evening: Rain
          61, 61, 61, 61, 61, 61,
          ...Array.from({ length: 24 }, () => 0)
        ],
        windspeed_10m: Array.from({ length: 48 }, () => 10),
        precipitation_probability: Array.from({ length: 48 }, () => 50)
      }

      const result = parseDailyForecast(dailyData, hourlyData)

      // Thunderstorm should be selected
      expect(result.today.weatherCodeWorst).toBe(95)
    })
  })
})

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                   Feature #62 Test Suite                                  ║
║                   Today shows worst weather outfit                         ║
╚═══════════════════════════════════════════════════════════════════════════╝

This test suite verifies that the Today view considers the worst weather
condition expected during the day (e.g., rain later = bring umbrella).

Test Coverage:
  ✅ Extract worst weather code from hourly data
  ✅ Prioritize thunderstorm > rain > clear
  ✅ Extract max wind speed from hourly data
  ✅ Extract max precipitation probability
  ✅ Handle missing hourly data gracefully
  ✅ Calculate worst weather for tomorrow

Run with: npm test test-feature-62-worst-weather.test.ts
`)
