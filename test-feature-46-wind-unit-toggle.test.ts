/**
 * Feature #46: Wind speed unit toggle
 *
 * This test suite verifies that:
 * 1. Wind unit toggle exists in settings modal
 * 2. Wind unit preference is tracked and persisted
 * 3. Wind speeds are converted based on the selected unit (km/h ↔ mph)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSettings, type WindSpeedUnit } from '../src/hooks/useSettings'
import { convertWindSpeed, formatWindSpeed } from '../src/lib/unitConversion'

describe('Feature #46: Wind speed unit toggle', () => {
  const STORAGE_KEY = 'outfitweather_settings'

  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Step 1: Create wind unit toggle', () => {
    it('should have windSpeedUnit in settings type', () => {
      const { result } = renderHook(() => useSettings())

      expect(result.current.settings).toHaveProperty('windSpeedUnit')
      expect(typeof result.current.settings.windSpeedUnit).toBe('string')
    })

    it('should have setWindSpeedUnit function', () => {
      const { result } = renderHook(() => useSettings())

      expect(typeof result.current.setWindSpeedUnit).toBe('function')
    })

    it('should accept valid wind speed units', () => {
      const { result } = renderHook(() => useSettings())

      act(() => {
        result.current.setWindSpeedUnit('kmh')
      })
      expect(result.current.settings.windSpeedUnit).toBe('kmh')

      act(() => {
        result.current.setWindSpeedUnit('mph')
      })
      expect(result.current.settings.windSpeedUnit).toBe('mph')
    })
  })

  describe('Step 2: Track wind unit preference', () => {
    it('should save wind unit preference to localStorage', () => {
      const { result } = renderHook(() => useSettings())

      act(() => {
        result.current.setWindSpeedUnit('mph')
      })

      const stored = localStorage.getItem(STORAGE_KEY)
      expect(stored).toBeTruthy()

      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.windSpeedUnit).toBe('mph')
      }
    })

    it('should load wind unit preference from localStorage on initialization', () => {
      // Save to localStorage first
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        temperatureUnit: 'C',
        windSpeedUnit: 'mph'
      }))

      const { result } = renderHook(() => useSettings())

      expect(result.current.settings.windSpeedUnit).toBe('mph')
    })

    it('should persist wind unit preference across hook re-renders', () => {
      const { result, rerender } = renderHook(() => useSettings())

      act(() => {
        result.current.setWindSpeedUnit('mph')
      })

      expect(result.current.settings.windSpeedUnit).toBe('mph')

      // Re-render the hook
      rerender()

      expect(result.current.settings.windSpeedUnit).toBe('mph')
    })
  })

  describe('Step 3: Convert wind speeds based on setting', () => {
    describe('Conversion logic', () => {
      it('should convert km/h to mph correctly', () => {
        // 10 km/h = 6.21371 mph
        expect(convertWindSpeed(10, 'mph')).toBeCloseTo(6.21371, 5)
        // 25 km/h = 15.534275 mph
        expect(convertWindSpeed(25, 'mph')).toBeCloseTo(15.534275, 5)
        // 50 km/h = 31.06855 mph
        expect(convertWindSpeed(50, 'mph')).toBeCloseTo(31.06855, 5)
      })

      it('should keep km/h value when unit is kmh', () => {
        expect(convertWindSpeed(10, 'kmh')).toBe(10)
        expect(convertWindSpeed(25, 'kmh')).toBe(25)
        expect(convertWindSpeed(50, 'kmh')).toBe(50)
      })

      it('should format wind speed with correct unit label', () => {
        // km/h formatting
        expect(formatWindSpeed(10, 'kmh')).toBe('10 km/h')
        expect(formatWindSpeed(25.7, 'kmh')).toBe('26 km/h') // rounded

        // mph formatting
        expect(formatWindSpeed(10, 'mph')).toBe('6 mph') // 6.21371 rounded
        expect(formatWindSpeed(25, 'mph')).toBe('16 mph') // 15.534 rounded
      })
    })

    describe('Real-world examples', () => {
      it('should display calm breeze correctly', () => {
        // Light breeze: 10 km/h
        const kmh = formatWindSpeed(10, 'kmh')
        const mph = formatWindSpeed(10, 'mph')

        expect(kmh).toBe('10 km/h')
        expect(mph).toBe('6 mph')
      })

      it('should display moderate wind correctly', () => {
        // Moderate wind: 25 km/h
        const kmh = formatWindSpeed(25, 'kmh')
        const mph = formatWindSpeed(25, 'mph')

        expect(kmh).toBe('25 km/h')
        expect(mph).toBe('16 mph')
      })

      it('should display strong wind correctly', () => {
        // Strong wind: 50 km/h
        const kmh = formatWindSpeed(50, 'kmh')
        const mph = formatWindSpeed(50, 'mph')

        expect(kmh).toBe('50 km/h')
        expect(mph).toBe('31 mph')
      })

      it('should display gale force wind correctly', () => {
        // Gale: 65 km/h
        const kmh = formatWindSpeed(65, 'kmh')
        const mph = formatWindSpeed(65, 'mph')

        expect(kmh).toBe('65 km/h')
        expect(mph).toBe('40 mph')
      })
    })

    describe('Settings integration', () => {
      it('should respect user-selected unit when formatting', () => {
        const { result } = renderHook(() => useSettings())

        // Test with km/h
        act(() => {
          result.current.setWindSpeedUnit('kmh')
        })
        expect(formatWindSpeed(25, result.current.settings.windSpeedUnit)).toBe('25 km/h')

        // Test with mph
        act(() => {
          result.current.setWindSpeedUnit('mph')
        })
        expect(formatWindSpeed(25, result.current.settings.windSpeedUnit)).toBe('16 mph')
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle zero wind speed', () => {
      expect(formatWindSpeed(0, 'kmh')).toBe('0 km/h')
      expect(formatWindSpeed(0, 'mph')).toBe('0 mph')
    })

    it('should handle very high wind speeds', () => {
      // Hurricane force: 150 km/h
      expect(formatWindSpeed(150, 'kmh')).toBe('150 km/h')
      expect(formatWindSpeed(150, 'mph')).toBe('93 mph') // 93.20565 rounded
    })

    it('should handle decimal wind speeds with rounding', () => {
      expect(formatWindSpeed(12.3, 'kmh')).toBe('12 km/h')
      expect(formatWindSpeed(12.6, 'kmh')).toBe('13 km/h')
      expect(formatWindSpeed(12.3, 'mph')).toBe('8 mph') // 7.646... rounded
      expect(formatWindSpeed(12.6, 'mph')).toBe('8 mph') // 7.837... rounded
    })
  })

  describe('Locale auto-detection', () => {
    it('should default to km/h for non-US locales', () => {
      // Mock non-US locale
      const originalLang = Object.getOwnPropertyDescriptor(Navigator.prototype, 'language')

      Object.defineProperty(Navigator.prototype, 'language', {
        writable: true,
        value: 'en-GB'
      })

      // Clear storage to trigger auto-detection
      localStorage.clear()

      const { result } = renderHook(() => useSettings())

      // Should default to km/h for UK
      expect(result.current.settings.windSpeedUnit).toBe('kmh')

      // Restore original
      if (originalLang) {
        Object.defineProperty(Navigator.prototype, 'language', originalLang)
      }
    })

    it('should default to mph for US locale', () => {
      // Mock US locale
      const originalLang = Object.getOwnPropertyDescriptor(Navigator.prototype, 'language')

      Object.defineProperty(Navigator.prototype, 'language', {
        writable: true,
        value: 'en-US'
      })

      // Clear storage to trigger auto-detection
      localStorage.clear()

      const { result } = renderHook(() => useSettings())

      // Should default to mph for US
      expect(result.current.settings.windSpeedUnit).toBe('mph')

      // Restore original
      if (originalLang) {
        Object.defineProperty(Navigator.prototype, 'language', originalLang)
      }
    })
  })
})
