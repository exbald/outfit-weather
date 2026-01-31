import { useState, useEffect } from 'react'
import { fetchCurrentWeather, getWeatherCondition } from '../lib/openmeteo'

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
  loading: boolean
  error: string | null
  fetchWeather: (lat: number, lon: number) => Promise<void>
  retry: () => void
}

/**
 * Custom hook to fetch and manage weather data
 * @returns Weather data, loading state, error state, and control functions
 */
export function useWeather(lat?: number, lon?: number): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastCoords, setLastCoords] = useState<{ lat: number; lon: number } | null>(
    lat && lon ? { lat, lon } : null
  )

  const fetchWeather = async (latitude: number, longitude: number) => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchCurrentWeather(latitude, longitude)
      const condition = getWeatherCondition(data.current.weathercode)

      setWeather({
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
      })
      setLastCoords({ lat: latitude, lon: longitude })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch weather data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Retry with the last coordinates
  const retry = () => {
    if (lastCoords) {
      fetchWeather(lastCoords.lat, lastCoords.lon)
    }
  }

  // Auto-fetch on mount if coordinates provided
  useEffect(() => {
    if (lat && lon) {
      fetchWeather(lat, lon)
    }
  }, [])

  return {
    weather,
    loading,
    error,
    fetchWeather,
    retry
  }
}
