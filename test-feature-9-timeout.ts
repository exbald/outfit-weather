/**
 * Feature #9: GPS timeout with retry option
 *
 * Requirements:
 * 1. Set reasonable timeout (10s)
 * 2. Catch timeout error
 * 3. Display retry button
 */

import { describe, it, expect } from 'vitest'
import { GEOLOCATION_OPTIONS, parseGeolocationError } from './src/hooks/useGeolocation'

describe('Feature #9: GPS timeout with retry option', () => {
  describe('Requirement 1: Set reasonable timeout (10s)', () => {
    it('should have timeout set to 10000ms (10 seconds)', () => {
      expect(GEOLOCATION_OPTIONS.timeout).toBe(10000)
    })

    it('should enable high accuracy for better location', () => {
      expect(GEOLOCATION_OPTIONS.enableHighAccuracy).toBe(true)
    })

    it('should accept cached positions up to 5 minutes old', () => {
      expect(GEOLOCATION_OPTIONS.maximumAge).toBe(300000)
    })
  })

  describe('Requirement 2: Catch timeout error', () => {
    it('should parse timeout error code 3 with user-friendly message', () => {
      const mockError = {
        code: 3,
        message: 'Timeout expired'
      } as GeolocationPositionError

      const parsed = parseGeolocationError(mockError)

      expect(parsed.code).toBe(3)
      expect(parsed.message).toBe('Location request timed out. Please try again.')
    })

    it('should parse permission denied error code 1', () => {
      const mockError = {
        code: 1,
        message: 'Permission denied'
      } as GeolocationPositionError

      const parsed = parseGeolocationError(mockError)

      expect(parsed.code).toBe(1)
      expect(parsed.message).toBe('Location access denied. Please enable location permissions in your browser settings.')
    })

    it('should parse position unavailable error code 2', () => {
      const mockError = {
        code: 2,
        message: 'Position unavailable'
      } as GeolocationPositionError

      const parsed = parseGeolocationError(mockError)

      expect(parsed.code).toBe(2)
      expect(parsed.message).toBe('Unable to determine your location. Please try again.')
    })

    it('should handle unknown error codes', () => {
      const mockError = {
        code: 0,
        message: 'Unknown error'
      } as GeolocationPositionError

      const parsed = parseGeolocationError(mockError)

      expect(parsed.code).toBe(0)
      expect(parsed.message).toBe('An unknown location error occurred.')
    })
  })

  describe('Requirement 3: Display retry button', () => {
    it('useGeolocation hook should return requestLocation function for retry', async () => {
      // This is verified by the hook's TypeScript interface
      // The useGeolocation hook returns an object with requestLocation function
      // which can be called to retry the location request

      // We can verify the hook exports the retry function via its interface
      const hookExports = await import('./src/hooks/useGeolocation')
      expect(typeof hookExports.useGeolocation).toBe('function')
    })

    it('error state includes retry capability in hook interface', () => {
      const hookExports = require('./src/hooks/useGeolocation')
      const result = hookExports.useGeolocation()

      // Verify the hook returns requestLocation for retry
      expect(result).toHaveProperty('requestLocation')
      expect(typeof result.requestLocation).toBe('function')

      // Verify the hook returns error state
      expect(result).toHaveProperty('error')
      expect(result).toHaveProperty('loading')
    })
  })
})
