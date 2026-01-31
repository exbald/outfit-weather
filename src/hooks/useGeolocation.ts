import { useState, useEffect } from 'react'

export interface LocationPosition {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp?: number
}

export interface GeolocationError {
  code: number
  message: string
}

export interface UseGeolocationResult {
  position: LocationPosition | null
  error: GeolocationError | null
  loading: boolean
  requestLocation: () => void
  clearError: () => void
}

/**
 * Geolocation options for getCurrentPosition
 * Exported for testing purposes
 */
export const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true, // Request GPS-level accuracy for weather
  timeout: 10000, // 10 second timeout (as specified in app spec)
  maximumAge: 300000 // Accept cached position up to 5 minutes old
}

/**
 * Convert GeolocationPositionError to our GeolocationError interface
 */
function parseGeolocationError(error: GeolocationPositionError): GeolocationError {
  const messages: Record<number, string> = {
    1: 'Location access denied. Please enable location permissions in your browser settings.',
    2: 'Unable to determine your location. Please try again.',
    3: 'Location request timed out. Please try again.'
  }

  return {
    code: error.code,
    message: messages[error.code] || 'An unknown location error occurred.'
  }
}

/**
 * Custom hook to request and manage user's geolocation
 *
 * This hook wraps the browser's Geolocation API with React state management.
 * It handles loading states, errors, and provides a manual retry function.
 *
 * Usage:
 * ```tsx
 * const { position, error, loading, requestLocation } = useGeolocation()
 *
 * if (loading) return <div>Getting your location...</div>
 * if (error) return <div>{error.message}</div>
 * if (position) return <div>Lat: {position.latitude}, Lon: {position.longitude}</div>
 * ```
 *
 * @returns Geolocation state and control functions
 */
export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<LocationPosition | null>(null)
  const [error, setError] = useState<GeolocationError | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Request the user's current location
   * This can be called manually (e.g., retry button) or automatically on mount
   */
  const requestLocation = () => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser.'
      })
      return
    }

    setLoading(true)
    setError(null)

    // Log geolocation API call (Feature #6 requirement)
    console.log('[Geolocation] Requesting location with options:', GEOLOCATION_OPTIONS)

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (pos: GeolocationPosition) => {
        const locationData = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp
        }

        // Log coordinates received (Feature #6 requirement)
        console.log('[Geolocation] Coordinates received:', {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy,
          timestamp: new Date(locationData.timestamp || Date.now()).toISOString()
        })

        setPosition(locationData)
        setLoading(false)
        setError(null)
      },
      // Error callback
      (err: GeolocationPositionError) => {
        const errorData = parseGeolocationError(err)

        // Log geolocation error (Feature #6 requirement)
        console.error('[Geolocation] Error:', {
          code: errorData.code,
          message: errorData.message,
          originalMessage: err.message
        })

        setError(errorData)
        setLoading(false)
      },
      // Options
      GEOLOCATION_OPTIONS
    )
  }

  /**
   * Clear the current error state
   * Useful for retry scenarios
   */
  const clearError = () => {
    setError(null)
  }

  // Auto-request location on mount
  useEffect(() => {
    requestLocation()
  }, [])

  return {
    position,
    error,
    loading,
    requestLocation,
    clearError
  }
}
