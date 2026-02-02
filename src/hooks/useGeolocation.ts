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
  permissionShown: boolean
  grantPermission: () => void
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

// localStorage keys for persisting location state
const LOCATION_STORAGE_KEY = 'outfit_weather_location'
const PERMISSION_STORAGE_KEY = 'outfit_weather_location_granted'

/**
 * Stored location data including optional city name
 * Exported for use by other components (e.g., CitySearch, useLocationName)
 */
export interface StoredLocationData {
  latitude: number
  longitude: number
  timestamp: number
  /** City name from search (e.g., "San Francisco, California") */
  cityName?: string
}

/**
 * Save location to localStorage
 * @param position - Location position with coordinates
 * @param cityName - Optional city name from city search
 */
export function saveLocation(position: LocationPosition, cityName?: string): void {
  try {
    const stored: StoredLocationData = {
      latitude: position.latitude,
      longitude: position.longitude,
      timestamp: Date.now(),
      ...(cityName && { cityName })
    }
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(stored))
    localStorage.setItem(PERMISSION_STORAGE_KEY, 'true')
  } catch (error) {
    console.warn('[Geolocation] Failed to save location:', error)
  }
}

/**
 * Load stored location from localStorage
 * Returns null if no stored location or if it's too old (> 24 hours)
 */
export function loadStoredLocation(): StoredLocationData | null {
  try {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY)
    if (!stored) return null

    const parsed: StoredLocationData = JSON.parse(stored)
    const age = Date.now() - parsed.timestamp
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    if (age > maxAge) {
      console.log('[Geolocation] Stored location expired')
      return null
    }

    console.log('[Geolocation] Loaded stored location:', {
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      ageMinutes: Math.round(age / 60000)
    })

    return {
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      timestamp: parsed.timestamp,
      cityName: parsed.cityName
    }
  } catch (error) {
    console.warn('[Geolocation] Failed to load stored location:', error)
    return null
  }
}

/**
 * Check if user previously granted location permission
 */
function hasGrantedPermission(): boolean {
  try {
    return localStorage.getItem(PERMISSION_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
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
  // Initialize state from localStorage if available
  const [position, setPosition] = useState<LocationPosition | null>(() => loadStoredLocation())
  const [error, setError] = useState<GeolocationError | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  // Skip permission prompt if user previously granted permission AND we have stored location
  const [permissionShown, setPermissionShown] = useState<boolean>(() => {
    const hasPermission = hasGrantedPermission()
    const hasLocation = loadStoredLocation() !== null
    // Show prompt only if user hasn't granted permission before OR we have no stored location
    return !hasPermission || !hasLocation
  })

  /**
   * Grant permission to request location
   * Called when user clicks "Allow" on the permission prompt
   */
  const grantPermission = () => {
    setPermissionShown(false)
    requestLocation()
  }

  // On mount, if we have stored location, refresh in background
  useEffect(() => {
    const storedLocation = loadStoredLocation()
    if (storedLocation && hasGrantedPermission()) {
      // We have stored location, refresh in background without blocking UI
      console.log('[Geolocation] Using stored location, refreshing in background')
      requestLocation()
    }
  }, [])

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

        // Save to localStorage for persistence across refreshes
        saveLocation(locationData)

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

  // Don't auto-request location on mount - wait for user to grant permission
  // The permission screen will be shown first

  return {
    position,
    error,
    loading,
    requestLocation,
    clearError,
    permissionShown,
    grantPermission
  }
}
