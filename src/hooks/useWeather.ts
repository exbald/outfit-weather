import { useState, useEffect } from 'react'
import { fetchCurrentWeather, getWeatherCondition, parseDailyForecast, type DailyWeatherData } from '../lib/openmeteo'
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
  daily: {
    today: DailyWeatherData
    tomorrow: DailyWeatherData
  }
}

export interface UseWeatherResult {
  weather: WeatherData | null
  loading: boolean // true only when we have no data at all
  refreshing: boolean // true when we have cached data but are fetching fresh data
  showSkeleton: boolean // true when loading has taken more than 1 second
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
// Background refresh interval in milliseconds (30 minutes)
const BACKGROUND_REFRESH_INTERVAL = 30 * 60 * 1000

export function useWeather(lat?: number, lon?: number): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [cacheAge, setCacheAge] = useState<number>(-1)
  const [offline, setOffline] = useState<boolean>(false)
  const [lastCoords, setLastCoords] = useState<{ lat: number; lon: number } | null>(
    lat && lon ? { lat, lon } : null
  )
  // Track refresh timer for cleanup
  const [refreshTimer, setRefreshTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  // Track skeleton timer for cleanup
  const [skeletonTimer, setSkeletonTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  // Log timer state for debugging (prevents unused variable warning)
  if (refreshTimer !== null) {
    // Timer is active
    void refreshTimer
  }

  const fetchWeather = async (latitude: number, longitude: number) => {
    // If we already have weather data, this is a background refresh
    const isRefresh = weather !== null

    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
      setShowSkeleton(false) // Reset skeleton state
    }
    setError(null)
    setOffline(false) // Reset offline state on new fetch

    // Set skeleton timeout after 1 second if no data exists
    if (!isRefresh) {
      const timer = setTimeout(() => {
        console.log('[Skeleton] Loading took >1 second, showing skeleton UI')
        setShowSkeleton(true)
      }, 1000)
      setSkeletonTimer(timer)
    }

    try {
      const data = await fetchCurrentWeather(latitude, longitude)
      const condition = getWeatherCondition(data.current.weathercode)
      const dailyForecast = parseDailyForecast(data.daily)

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
        },
        daily: dailyForecast
      }

      // Save to cache for offline access and faster loads
      saveWeatherData(weatherData, latitude, longitude)

      setWeather(weatherData)
      setLastCoords({ lat: latitude, lon: longitude })
      setCacheAge(0) // Fresh data
      setOffline(false) // Successfully fetched fresh data, not offline
    } catch (err) {
      // Extract user-friendly message from Error if available
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data'

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
      setShowSkeleton(false)
      // Clear skeleton timer
      if (skeletonTimer) {
        clearTimeout(skeletonTimer)
        setSkeletonTimer(null)
      }
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
  // Also set up periodic background refresh while app is open
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

      // Step 3: Set up periodic background refresh every 30 minutes
      const timer = setInterval(() => {
        console.log('[Background Refresh] Refreshing weather data...')
        fetchWeather(lat, lon)
      }, BACKGROUND_REFRESH_INTERVAL)

      setRefreshTimer(timer)

      // Cleanup: clear interval and skeleton timer when component unmounts or coords change
      return () => {
        if (timer) {
          clearInterval(timer)
          console.log('[Background Refresh] Cleared refresh interval')
        }
        if (skeletonTimer) {
          clearTimeout(skeletonTimer)
          console.log('[Skeleton] Cleared skeleton timeout')
        }
      }
    }
  }, [lat, lon])

  return {
    weather,
    loading,
    refreshing,
    showSkeleton,
    error,
    cacheAge,
    offline,
    fetchWeather,
    retry,
    clearCache
  }
}
