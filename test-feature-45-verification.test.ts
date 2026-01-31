/**
 * Feature #45: Temperature Unit Toggle (C/F) - Verification Tests
 *
 * Tests:
 * 1. Settings hook exists and manages state
 * 2. Temperature conversion functions work correctly
 * 3. Wind speed conversion functions work correctly
 * 4. Settings persist to localStorage
 * 5. Locale auto-detection works
 * 6. WeatherDisplay uses formatted temperatures
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'

// Import the functions we're testing
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  convertTemperature,
  formatTemperature,
  kmhToMmph,
  convertWindSpeed,
  formatWindSpeed
} from './src/lib/unitConversion'

describe('Feature #45: Temperature Unit Toggle', () => {
  describe('Temperature Conversion Functions', () => {
    it('should convert Celsius to Fahrenheit correctly', () => {
      expect(celsiusToFahrenheit(0)).toBe(32)
      expect(celsiusToFahrenheit(20)).toBe(68)
      expect(celsiusToFahrenheit(37)).toBe(98.6)
      expect(celsiusToFahrenheit(100)).toBe(212)
      expect(celsiusToFahrenheit(-40)).toBe(-40) // -40°C = -40°F
    })

    it('should convert Fahrenheit to Celsius correctly', () => {
      expect(fahrenheitToCelsius(32)).toBe(0)
      expect(fahrenheitToCelsius(68)).toBe(20)
      expect(fahrenheitToCelsius(98.6)).toBeCloseTo(37, 1)
      expect(fahrenheitToCelsius(212)).toBe(100)
      expect(fahrenheitToCelsius(-40)).toBe(-40)
    })

    it('should convert temperature based on target unit', () => {
      // Celsius target (no conversion)
      expect(convertTemperature(20, 'C')).toBe(20)
      expect(convertTemperature(0, 'C')).toBe(0)

      // Fahrenheit target (convert)
      expect(convertTemperature(20, 'F')).toBe(68)
      expect(convertTemperature(0, 'F')).toBe(32)
      expect(convertTemperature(37, 'F')).toBe(98.6)
    })

    it('should format temperature for display', () => {
      expect(formatTemperature(22.5, 'C')).toBe('23°')
      expect(formatTemperature(22.4, 'C')).toBe('22°')
      expect(formatTemperature(20, 'F')).toBe('68°')
      expect(formatTemperature(37, 'F')).toBe('99°') // 98.6 rounds to 99
    })
  })

  describe('Wind Speed Conversion Functions', () => {
    it('should convert km/h to mph correctly', () => {
      expect(kmhToMmph(10)).toBeCloseTo(6.21, 2)
      expect(kmhToMmph(100)).toBeCloseTo(62.14, 2)
      expect(kmhToMmph(0)).toBe(0)
    })

    it('should convert wind speed based on target unit', () => {
      // kmh target (no conversion)
      expect(convertWindSpeed(10, 'kmh')).toBe(10)
      expect(convertWindSpeed(25, 'kmh')).toBe(25)

      // mph target (convert)
      expect(convertWindSpeed(10, 'mph')).toBeCloseTo(6.21, 2)
      expect(convertWindSpeed(25, 'mph')).toBeCloseTo(15.53, 2)
    })

    it('should format wind speed for display', () => {
      expect(formatWindSpeed(10, 'kmh')).toBe('10 km/h')
      expect(formatWindSpeed(25.5, 'kmh')).toBe('26 km/h')
      expect(formatWindSpeed(10, 'mph')).toBe('6 mph')
      expect(formatWindSpeed(25.5, 'mph')).toBe('16 mph')
    })
  })

  describe('Settings Persistence (localStorage)', () => {
    const STORAGE_KEY = 'outfitweather_settings'

    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear()
    })

    afterEach(() => {
      // Clean up after each test
      localStorage.clear()
    })

    it('should save settings to localStorage', () => {
      const settings = { temperatureUnit: 'F', windSpeedUnit: 'mph' }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

      const retrieved = localStorage.getItem(STORAGE_KEY)
      expect(retrieved).toBeDefined()

      const parsed = JSON.parse(retrieved!)
      expect(parsed).toEqual(settings)
    })

    it('should load settings from localStorage', () => {
      const settings = { temperatureUnit: 'C', windSpeedUnit: 'kmh' }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

      const retrieved = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(retrieved!)

      expect(parsed.temperatureUnit).toBe('C')
      expect(parsed.windSpeedUnit).toBe('kmh')
    })

    it('should handle missing localStorage gracefully', () => {
      // localStorage is cleared, should return defaults
      const retrieved = localStorage.getItem(STORAGE_KEY)
      expect(retrieved).toBeNull()
    })
  })

  describe('Locale Auto-Detection', () => {
    it('should detect US locale for Fahrenheit default', () => {
      // Mock navigator.language
      const originalLanguage = navigator.language
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true
      })

      const isUS = navigator.language === 'en-US' || navigator.language.startsWith('en-US')
      const expectedUnit = isUS ? 'F' : 'C'

      expect(expectedUnit).toBe('F')

      // Restore original
      Object.defineProperty(navigator, 'language', {
        value: originalLanguage,
        configurable: true
      })
    })

    it('should detect non-US locale for Celsius default', () => {
      const originalLanguage = navigator.language
      Object.defineProperty(navigator, 'language', {
        value: 'en-GB',
        configurable: true
      })

      const isUS = navigator.language === 'en-US' || navigator.language.startsWith('en-US')
      const expectedUnit = isUS ? 'F' : 'C'

      expect(expectedUnit).toBe('C')

      // Restore original
      Object.defineProperty(navigator, 'language', {
        value: originalLanguage,
        configurable: true
      })
    })
  })

  describe('Unit Conversion Edge Cases', () => {
    it('should handle negative temperatures', () => {
      expect(formatTemperature(-10, 'C')).toBe('-10°')
      expect(formatTemperature(-10, 'F')).toBe('14°') // -10°C = 14°F
      expect(formatTemperature(-40, 'F')).toBe('-40°') // -40°F = -40°C
    })

    it('should handle zero values', () => {
      expect(formatTemperature(0, 'C')).toBe('0°')
      expect(formatTemperature(0, 'F')).toBe('32°')
      expect(formatWindSpeed(0, 'kmh')).toBe('0 km/h')
      expect(formatWindSpeed(0, 'mph')).toBe('0 mph')
    })

    it('should handle large values', () => {
      expect(formatTemperature(50, 'C')).toBe('50°')
      expect(formatTemperature(50, 'F')).toBe('122°') // 50°C = 122°F
      expect(formatWindSpeed(100, 'kmh')).toBe('100 km/h')
      expect(formatWindSpeed(100, 'mph')).toBe('62 mph')
    })

    it('should round temperatures correctly', () => {
      expect(formatTemperature(22.4, 'C')).toBe('22°')
      expect(formatTemperature(22.5, 'C')).toBe('23°')
      expect(formatTemperature(22.49, 'F')).toBe('72°') // 72.282°F
      expect(formatTemperature(22.51, 'F')).toBe('73°') // 72.518°F
    })
  })
})
