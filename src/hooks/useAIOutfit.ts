import { useState, useEffect, useCallback } from 'react'
import {
  generateOutfitRecommendation,
  isOpenRouterConfigured,
  type AIOutfitResponse,
  type WeatherContext
} from '../lib/openrouter'
import { getTemperatureBucket } from '../lib/outfitLogic'
import { getWeatherCondition } from '../lib/openmeteo'
import type { WeatherData } from './useWeather'
import type { OutfitView } from './useOutfit'

/**
 * Cache entry for AI outfit recommendations
 */
interface CacheEntry {
  response: AIOutfitResponse
  timestamp: number
}

/**
 * Cache storage key prefix
 */
const CACHE_KEY_PREFIX = 'outfit_ai_cache_'

/**
 * Cache expiry time (1 hour in milliseconds)
 */
const CACHE_EXPIRY_MS = 60 * 60 * 1000

/**
 * Generate a weather signature for cache key
 * Groups similar weather conditions to maximize cache hits
 * Includes view and precipitation probability for accurate caching
 *
 * @example
 * // day 0 view, 16°C, rain (code 61), 20 km/h wind, UV 2, 60% rain
 * // Returns: "day0_cool_61_moderate_low_rain"
 */
function getWeatherSignature(
  view: 'now' | number, // 'now' or day index (0-6)
  temperature: number,
  weatherCode: number,
  windSpeed: number,
  uvIndex: number,
  precipitationProbability?: number
): string {
  // Get temperature bucket (cold, cool, mild, warm, hot, etc.)
  const tempBucket = getTemperatureBucket(temperature, 'C')

  // Categorize wind: calm (< 15), moderate (15-30), windy (> 30)
  let windCategory: string
  if (windSpeed < 15) {
    windCategory = 'calm'
  } else if (windSpeed <= 30) {
    windCategory = 'moderate'
  } else {
    windCategory = 'windy'
  }

  // Categorize UV: low (0-2), moderate (3-5), high (6-7), extreme (8+)
  let uvCategory: string
  if (uvIndex <= 2) {
    uvCategory = 'low'
  } else if (uvIndex <= 5) {
    uvCategory = 'moderate'
  } else if (uvIndex <= 7) {
    uvCategory = 'high'
  } else {
    uvCategory = 'extreme'
  }

  // Categorize precipitation: none (0-20), likely (21-60), rain (61+)
  let precipCategory = 'dry'
  if (precipitationProbability !== undefined) {
    if (precipitationProbability > 60) {
      precipCategory = 'rain'
    } else if (precipitationProbability > 20) {
      precipCategory = 'likely'
    }
  }

  // Generate view key: 'now' or 'day0', 'day1', etc.
  const viewKey = view === 'now' ? 'now' : `day${view}`

  return `${viewKey}_${tempBucket}_${weatherCode}_${windCategory}_${uvCategory}_${precipCategory}`
}

/**
 * Get cached response for weather signature
 * @param signature - Weather signature cache key
 * @returns Cached response or null if not found/expired
 */
function getCachedResponse(signature: string): AIOutfitResponse | null {
  try {
    const key = CACHE_KEY_PREFIX + signature
    const cached = localStorage.getItem(key)

    if (!cached) {
      return null
    }

    const entry: CacheEntry = JSON.parse(cached)
    const age = Date.now() - entry.timestamp

    if (age > CACHE_EXPIRY_MS) {
      // Cache expired, remove it
      localStorage.removeItem(key)
      console.log('[AIOutfit] Cache expired for:', signature)
      return null
    }

    console.log('[AIOutfit] Cache hit for:', signature, `(${Math.round(age / 1000)}s old)`)
    return entry.response
  } catch (error) {
    console.warn('[AIOutfit] Failed to read cache:', error)
    return null
  }
}

/**
 * Save response to cache
 * @param signature - Weather signature cache key
 * @param response - AI response to cache
 */
function setCachedResponse(signature: string, response: AIOutfitResponse): void {
  try {
    const key = CACHE_KEY_PREFIX + signature
    const entry: CacheEntry = {
      response,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(entry))
    console.log('[AIOutfit] Cached response for:', signature)
  } catch (error) {
    console.warn('[AIOutfit] Failed to cache response:', error)
  }
}

/**
 * Result from useAIOutfit hook
 */
export interface UseAIOutfitResult {
  /** AI-generated response or null if using fallback */
  aiResponse: AIOutfitResponse | null
  /** True while AI request is in progress */
  loading: boolean
  /** Error message if AI request failed */
  error: string | null
  /** True if AI recommendations are available */
  isAIEnabled: boolean
  /** Manually refresh AI recommendation */
  refresh: () => void
}

/**
 * Hook to get AI-powered outfit recommendations with caching
 *
 * Features:
 * - Automatic caching based on weather conditions (1-hour expiry)
 * - Graceful fallback when AI is unavailable
 * - Loading state for UI feedback
 * - Manual refresh capability
 *
 * @param weather - Weather data from useWeather hook
 * @param view - Current outfit view (now, today, tomorrow)
 * @returns AI outfit result with loading state and refresh function
 *
 * @example
 * ```tsx
 * const { aiResponse, loading, isAIEnabled } = useAIOutfit(weather, 'now')
 *
 * if (aiResponse) {
 *   // Use AI-generated outfit
 *   return <div>{aiResponse.emojis}</div>
 * }
 * // Fall back to static logic
 * ```
 */
export function useAIOutfit(
  weather: WeatherData | null,
  view: OutfitView = 'now'
): UseAIOutfitResult {
  const [aiResponse, setAiResponse] = useState<AIOutfitResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if AI is configured
  const isAIEnabled = isOpenRouterConfigured()

  /**
   * Get weather context based on view
   * Provides full forecast data for AI to make informed recommendations
   */
  const getWeatherContext = useCallback((): WeatherContext | null => {
    if (!weather) return null

    // Handle 'now' view
    if (view === 'now') {
      return {
        view: 'now',
        temperature: weather.temperature,
        temperatureUnit: 'C',
        condition: weather.condition,
        windSpeed: weather.windSpeed,
        uvIndex: weather.daily.today.uvIndexMax,
        isDay: weather.isDay === 1
      }
    }

    // Handle day index views (0 = today, 1 = tomorrow, 2-6 = future days)
    const dayIndex = view as number
    const day = weather.daily.days[dayIndex]

    if (!day) {
      console.warn(`[AIOutfit] No day data for index ${dayIndex}`)
      return null
    }

    // Get condition from weather code
    const mainCondition = getWeatherCondition(day.weatherCode).description
    // Get worst condition if different
    const worstCondition = day.weatherCodeWorst !== undefined
      ? getWeatherCondition(day.weatherCodeWorst).description
      : undefined

    // For today (index 0), use current temperature for conservative outfit
    const temperature = dayIndex === 0
      ? Math.min(day.temperatureMax, weather.temperature)
      : day.temperatureMax

    // Map day index to view name for AI context
    const viewName = dayIndex === 0 ? 'today' : dayIndex === 1 ? 'tomorrow' : day.dayLabel

    return {
      view: viewName,
      temperature,
      temperatureHigh: day.temperatureMax,
      temperatureLow: day.temperatureMin,
      temperatureUnit: 'C',
      condition: mainCondition,
      worstCondition: worstCondition !== mainCondition ? worstCondition : undefined,
      windSpeed: weather.windSpeed,
      windSpeedMax: day.windSpeedMax,
      uvIndex: day.uvIndexMax,
      precipitationProbability: day.precipitationProbabilityMax,
      isDay: dayIndex === 0 ? weather.isDay === 1 : true // Future days are always daytime for planning
    }
  }, [weather, view])

  /**
   * Fetch AI recommendation
   */
  const fetchRecommendation = useCallback(async () => {
    if (!isAIEnabled || !weather) {
      return
    }

    const context = getWeatherContext()
    if (!context) return

    // Get the correct weather code for this view
    let weatherCode: number
    if (view === 'now') {
      weatherCode = weather.weatherCode
    } else {
      const dayIndex = view as number
      const day = weather.daily.days[dayIndex]
      if (!day) {
        console.warn(`[AIOutfit] No day data for index ${dayIndex}`)
        return
      }
      weatherCode = day.weatherCodeWorst ?? day.weatherCode
    }

    // Generate cache signature with full context
    const signature = getWeatherSignature(
      view,
      context.temperature,
      weatherCode,
      context.windSpeedMax ?? context.windSpeed,
      context.uvIndex,
      context.precipitationProbability
    )

    // Check cache first
    const cached = getCachedResponse(signature)
    if (cached) {
      setAiResponse(cached)
      setError(null)
      return
    }

    // Fetch from API
    setLoading(true)
    setError(null)

    try {
      const result = await generateOutfitRecommendation(context)

      if (result) {
        setAiResponse(result)
        setCachedResponse(signature, result)
      } else {
        setError('AI unavailable')
      }
    } catch (err) {
      console.error('[AIOutfit] Fetch failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [isAIEnabled, weather, getWeatherContext])

  /**
   * Manual refresh function
   */
  const refresh = useCallback(() => {
    fetchRecommendation()
  }, [fetchRecommendation])

  // Fetch on mount and when weather/view changes
  useEffect(() => {
    fetchRecommendation()
  }, [fetchRecommendation])

  return {
    aiResponse,
    loading,
    error,
    isAIEnabled,
    refresh
  }
}

/**
 * Clear all AI outfit cache entries
 * Useful for debugging or when user wants to force fresh recommendations
 */
export function clearAIOutfitCache(): void {
  const keysToRemove: string[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(CACHE_KEY_PREFIX)) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key))
  console.log('[AIOutfit] Cleared', keysToRemove.length, 'cache entries')
}
