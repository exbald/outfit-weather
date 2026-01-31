import { useState, useEffect } from 'react'
import { fetchCurrentWeather, getWeatherCondition } from '../lib/openmeteo'
import {
  saveWeatherData,
  loadWeatherData,
  getCacheAge,
  clearWeatherData
} from '../lib/weatherStorage'

export interface WeatherData {
  temperature: number
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
}

export interface UseWeatherResult {
  weather: WeatherData | null
  loading: boolean // true only when we have no data at all
  refreshing: boolean // true when we have cached data but are fetching fresh data
  error: string | null
  cacheAge: number // Age of cached data in seconds (-1 if no cache)
  offline: boolean // true when showing cached data due to network failure
  fetchWeather: (lat: number, lon: number) => Promise<void>
  retry: () => void
  clearCache: () => void
}

/**
 * Custom hook to fetch and manage weather data with localStorage caching
 *
 * Caching behavior:
 * - On mount, loads cached data immediately for instant display
 * - Fetches fresh data in background
 * - Cache expires after 30 minutes
 * - Cache is invalid if location changes significantly (>1km)
 *
 * @param lat - Optional latitude for initial fetch
 * @param lon - Optional longitude for initial fetch
 * @returns Weather data, loading state, error state, cache age, and control functions
 */
export function useWeather(lat?: number, lon?: number): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [cacheAge, setCacheAge] = useState<number>(-1)
  const [offline, setOffline] = useState<boolean>(false)
  const [lastCoords, setLastCoords] = useState<{ lat: number; lon: number } | null>(
    lat && lon ? { lat, lon } : null
  )

  const fetchWeather = async (latitude: number, longitude: number) => {
    // If we already have weather data, this is a background refresh
    const isRefresh = weather !== null

    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)
    setOffline(false) // Reset offline state on new fetch

    try {
      const data = await fetchCurrentWeather(latitude, longitude)
      const condition = getWeatherCondition(data.current.weathercode)

      const weatherData: WeatherData = {
        temperature: data.current.temperature,
        weatherCode: data.current.weathercode,
        condition: condition.description,
        icon: condition.icon,
        windSpeed: data.current.windspeed,
        isDay: data.current.is_day,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone
        }
      }

      // Save to cache for offline access and faster loads
      saveWeatherData(weatherData, latitude, longitude)

      setWeather(weatherData)
      setLastCoords({ lat: latitude, lon: longitude })
      setCacheAge(0) // Fresh data
      setOffline(false) // Successfully fetched fresh data, not offline
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch weather data'

      // Check if we have cached data to fall back to
      const cached = loadWeatherData(latitude, longitude)
      if (cached) {
        // Display cached data with offline indicator
        setWeather(cached)
        setCacheAge(getCacheAge())
        setOffline(true)
        setError(errorMessage) // Keep error for reference, but don't block display
      } else {
        // No cached data available, show error
        setError(errorMessage)
        setOffline(false)
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Retry with the last coordinates
  const retry = () => {
    if (lastCoords) {
      fetchWeather(lastCoords.lat, lastCoords.lon)
    }
  }

  // Clear the cache manually (e.g., for force refresh)
  const clearCache = () => {
    clearWeatherData()
    setCacheAge(-1)
    setWeather(null)
    // Optionally re-fetch if we have coords
    if (lastCoords) {
      fetchWeather(lastCoords.lat, lastCoords.lon)
    }
  }

  // Initialize: load from cache first, then fetch fresh data
  useEffect(() => {
    if (lat && lon) {
      // Step 1: Load cached data immediately for instant display
      const cached = loadWeatherData(lat, lon)
      if (cached) {
        setWeather(cached)
        setCacheAge(getCacheAge())
      }

      // Step 2: Fetch fresh data in background
      fetchWeather(lat, lon)
    }
  }, [])

  return {
    weather,
    loading,
    refreshing,
    error,
    cacheAge,
    offline,
    fetchWeather,
    retry,
    clearCache
  }
}
