import { useState, useEffect } from 'react'
import { fetchLocationName } from '../lib/openmeteo'

export interface UseLocationNameResult {
  locationName: string | null
  loading: boolean
  error: string | null
}

/**
 * Simple in-memory cache for location names
 * Maps coordinate strings to location names
 */
const locationCache = new Map<string, string>()

/**
 * Generate cache key from coordinates
 */
function getCacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`
}

/**
 * Custom hook to fetch and cache location name from coordinates
 *
 * This hook uses reverse geocoding to convert GPS coordinates to a
 * human-readable location name (e.g., "San Francisco, CA" or "London").
 *
 * Features:
 * - In-memory caching to avoid repeated API calls
 * - Automatic retry on failure (inherited from fetchLocationName)
 * - Graceful fallback - returns empty string if geocoding fails
 *
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns Location name, loading state, and error state
 */
export function useLocationName(lat?: number, lon?: number): UseLocationNameResult {
  const [locationName, setLocationName] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Don't fetch if coordinates are not provided
    if (lat === undefined || lon === undefined) {
      return
    }

    // Check cache first
    const cacheKey = getCacheKey(lat, lon)
    const cached = locationCache.get(cacheKey)

    if (cached !== undefined) {
      console.log('[useLocationName] Using cached location name:', cached)
      setLocationName(cached)
      setLoading(false)
      setError(null)
      return
    }

    // Fetch location name from API
    setLoading(true)
    setError(null)

    fetchLocationName(lat, lon)
      .then((name) => {
        // Cache the result (even empty string counts as a valid result)
        locationCache.set(cacheKey, name)
        setLocationName(name)
        setError(null)
      })
      .catch((err) => {
        // Log error but don't block the app
        // Location name is a nice-to-have, not critical
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch location name'
        console.error('[useLocationName] Error:', errorMessage)
        setError(errorMessage)
        setLocationName('') // Empty string indicates failure but app still works
      })
      .finally(() => {
        setLoading(false)
      })
  }, [lat, lon])

  return {
    locationName,
    loading,
    error
  }
}
