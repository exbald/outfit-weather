/**
 * Unit tests for Open-Meteo API client
 * Run with: npm test
 */

import { describe, it, expect } from 'vitest'
import { buildCurrentWeatherUrl, fetchCurrentWeather } from '../openmeteo'

describe('Open-Meteo API Client', () => {
  describe('buildCurrentWeatherUrl', () => {
    it('should build correct API URL with default parameters', () => {
      const url = buildCurrentWeatherUrl(37.7749, -122.4194)
      expect(url).toContain('https://api.open-meteo.com/v1/forecast')
      expect(url).toContain('latitude=37.7749')
      expect(url).toContain('longitude=-122.4194')
      expect(url).toContain('current=temperature%2Cwindspeed%2Cis_day%2Cweathercode')
      expect(url).toContain('temperature_unit=celsius')
      expect(url).toContain('wind_speed_unit=kmh')
      expect(url).toContain('timezone=auto')
    })

    it('should support Fahrenheit temperature unit', () => {
      const url = buildCurrentWeatherUrl(37.7749, -122.4194, 'fahrenheit')
      expect(url).toContain('temperature_unit=fahrenheit')
    })

    it('should support mph wind speed unit', () => {
      const url = buildCurrentWeatherUrl(37.7749, -122.4194, 'celsius', 'mph')
      expect(url).toContain('wind_speed_unit=mph')
    })
  })

  describe('fetchCurrentWeather', () => {
    it('should fetch current weather data from Open-Meteo API', async () => {
      const data = await fetchCurrentWeather(37.7749, -122.4194)

      expect(data).toBeDefined()
      expect(data.current).toBeDefined()
      expect(typeof data.current.temperature).toBe('number')
      expect(typeof data.current.weathercode).toBe('number')
      expect(typeof data.current.windspeed).toBe('number')
      expect(typeof data.current.is_day).toBe('number')
      expect(data.latitude).toBeDefined()
      expect(data.longitude).toBeDefined()
      expect(data.timezone).toBeDefined()
    })

    it('should support Fahrenheit units', async () => {
      const data = await fetchCurrentWeather(37.7749, -122.4194, 'fahrenheit')

      expect(data.current_units.temperature).toBe('°F')
      expect(typeof data.current.temperature).toBe('number')
    })

    it('should support mph wind speed units', async () => {
      const data = await fetchCurrentWeather(37.7749, -122.4194, 'celsius', 'mph')

      expect(data.current_units.windspeed).toBe('mph')
      expect(typeof data.current.windspeed).toBe('number')
    })

    it('should throw error for invalid coordinates', async () => {
      await expect(fetchCurrentWeather(999, 999)).rejects.toThrow()
    })
  })
})
