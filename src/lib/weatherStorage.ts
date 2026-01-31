/**
 * Weather Data Storage Utility
 * Handles localStorage caching for weather data with timestamp-based expiry
 */

export interface CachedWeatherData {
  /** Cached weather data */
  data: {
    temperature: number
    apparentTemperature: number
    weatherCode: number
    condition: string
    icon: string
    windSpeed: number
    isDay: number
    location: {
      latitude: number
      longitude: number
      timezone: string
    }
    daily: {
      today: {
        time: string
        temperatureMax: number
        temperatureMin: number
        weatherCode: number
        precipitationProbabilityMax: number
        uvIndexMax: number
      }
      tomorrow: {
        time: string
        temperatureMax: number
        temperatureMin: number
        weatherCode: number
        precipitationProbabilityMax: number
        uvIndexMax: number
      }
    }
  }
  /** Timestamp when data was fetched (Unix timestamp in milliseconds) */
  timestamp: number
  /** Coordinates used for fetching (for validation) */
  coords: {
    lat: number
    lon: number
  }
}

const STORAGE_KEY = 'outfit_weather_cache'
const COORD_THRESHOLD = 0.01 // ~1km distance threshold for cache validity

/**
 * Save weather data to localStorage with timestamp
 * @param data - Weather data to cache
 * @param lat - Latitude used for fetch
 * @param lon - Longitude used for fetch
 */
export function saveWeatherData(
  data: CachedWeatherData['data'],
  lat: number,
  lon: number
): void {
  try {
    const cacheEntry: CachedWeatherData = {
      data,
      timestamp: Date.now(),
      coords: { lat, lon }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheEntry))
  } catch (error) {
    // Silent fail if localStorage is unavailable (e.g., private browsing)
    console.warn('Failed to save weather data to cache:', error)
  }
}

/**
 * Load cached weather data from localStorage
 * @param lat - Current latitude (for proximity validation)
 * @param lon - Current longitude (for proximity validation)
 * @param maxAge - Maximum age of cache in milliseconds (default: 30 minutes)
 * @returns Cached weather data if valid, null otherwise
 */
export function loadWeatherData(
  lat: number,
  lon: number,
  maxAge: number = 30 * 60 * 1000 // 30 minutes default
): CachedWeatherData['data'] | null {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)

    if (!cached) {
      return null
    }

    const parsed: CachedWeatherData = JSON.parse(cached)
    const now = Date.now()
    const age = now - parsed.timestamp

    // Check if cache is too old
    if (age > maxAge) {
      console.debug('Weather cache expired:', {
        age: Math.round(age / 1000),
        maxAge: Math.round(maxAge / 1000)
      })
      return null
    }

    // Check if cached data is for a nearby location (within threshold)
    const latDiff = Math.abs(parsed.coords.lat - lat)
    const lonDiff = Math.abs(parsed.coords.lon - lon)

    if (latDiff > COORD_THRESHOLD || lonDiff > COORD_THRESHOLD) {
      console.debug('Weather cache location mismatch:', {
        cached: parsed.coords,
        current: { lat, lon }
      })
      return null
    }

    // Cache is valid
    console.debug('Using cached weather data:', {
      age: Math.round(age / 1000),
      coords: { lat, lon }
    })

    // Handle migration from old cache format (missing apparentTemperature)
    if (typeof parsed.data.apparentTemperature !== 'number') {
      console.log('Migrating old cache format: adding apparentTemperature')
      parsed.data.apparentTemperature = parsed.data.temperature
    }

    return parsed.data
  } catch (error) {
    // If cache is corrupted, clear it and return null
    console.warn('Failed to load weather cache:', error)
    clearWeatherData()
    return null
  }
}

/**
 * Clear cached weather data from localStorage
 */
export function clearWeatherData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear weather cache:', error)
  }
}

/**
 * Get the age of cached data in seconds
 * @returns Age in seconds, or -1 if no cache exists
 */
export function getCacheAge(): number {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)

    if (!cached) {
      return -1
    }

    const parsed: CachedWeatherData = JSON.parse(cached)
    const now = Date.now()

    return Math.round((now - parsed.timestamp) / 1000) // Return age in seconds
  } catch (error) {
    return -1
  }
}

/**
 * Check if cached data exists and is valid
 * @param lat - Current latitude (for proximity validation)
 * @param lon - Current longitude (for proximity validation)
 * @param maxAge - Maximum age of cache in milliseconds
 * @returns true if valid cached data exists
 */
export function hasValidCache(
  lat: number,
  lon: number,
  maxAge?: number
): boolean {
  return loadWeatherData(lat, lon, maxAge) !== null
}
