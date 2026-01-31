/**
 * Feature #46: Wind speed unit toggle - Simple verification test
 *
 * This test verifies that:
 * 1. Wind unit conversion functions work correctly
 * 2. Wind speed formatting includes correct unit labels
 */

import { describe, it, expect } from 'vitest'
import { convertWindSpeed, formatWindSpeed } from './src/lib/unitConversion'

describe('Feature #46: Wind speed unit toggle', () => {
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
  })
})
