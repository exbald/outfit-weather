import { useMemo } from 'react'
import type { WeatherData } from './useWeather'
import {
  getTemperatureBucket,
  getOutfitWithWeather,
  getWeatherModifier,
  getOutfitWithUV,
  type WeatherModifier
} from '../lib/outfitLogic'
import { generateOneLiner, getFallbackOneLiner } from '../lib/oneLiner'

/**
 * Outfit recommendation view type
 * 'now' = current conditions, number = day index (0 = today, 1 = tomorrow, 2-6 = future days)
 */
export type OutfitView = 'now' | number

/**
 * Complete outfit recommendation with emojis and one-liner
 */
export interface OutfitRecommendation {
  emojis: string
  oneLiner: string
  view: OutfitView
  /** High temperature for the day (for day views) */
  highTemp?: number
  /** Low temperature for the day (for day views) */
  lowTemp?: number
  /** Day index in the forecast (0-6) - only for day views */
  dayIndex?: number
  /** Human-readable day label ("Today", "Tomorrow", "Wed", etc.) */
  dayLabel?: string
}

/**
 * Hook to generate outfit recommendations based on weather data
 *
 * Creates outfit recommendations for:
 * - Now: Based on current apparent temperature and conditions
 * - 7 Days: Based on daily forecast with worst weather of each day
 *
 * Each recommendation includes:
 * - Emojis: Visual outfit representation with weather modifiers
 * - One-liner: Friendly, context-aware message about the weather/outfit
 *
 * @param weather - Weather data from useWeather hook
 * @returns Object with outfit recommendations for each view
 *
 * @example
 * ```ts
 * const { outfits, getCurrentOutfit, getDayOutfit } = useOutfit(weather)
 *
 * // Get current outfit
 * const currentOutfit = getCurrentOutfit()
 * console.log(currentOutfit.emojis)     // "🧥🧣👖🥾☂️"
 *
 * // Get outfit for day 2 (2 days from now)
 * const day2Outfit = getDayOutfit(2)
 * console.log(day2Outfit.dayLabel)      // "Wed"
 * ```
 */
export function useOutfit(weather: WeatherData | null) {
  const outfits = useMemo(() => {
    // Return empty recommendations if no weather data
    if (!weather) {
      return {
        now: null,
        days: [] as (OutfitRecommendation | null)[],
        today: null,
        tomorrow: null
      }
    }

    // Helper function to create outfit recommendation
    const createRecommendation = (
      temperature: number,
      weatherCode: number,
      windSpeed: number,
      uvIndex: number,
      isDay: number,
      view: OutfitView,
      highTemp?: number,
      lowTemp?: number,
      dayIndex?: number,
      dayLabel?: string
    ): OutfitRecommendation => {
      // Determine temperature bucket
      // Note: Weather API always returns temperatures in Celsius
      const bucket = getTemperatureBucket(temperature, 'C')

      // Determine weather modifier (rain, snow, wind, none)
      const modifier: WeatherModifier = getWeatherModifier(weatherCode, windSpeed, 'kmh')

      // Get base outfit with weather modifiers
      const baseOutfit = getOutfitWithWeather(bucket, weatherCode, windSpeed, 'kmh')

      // Add UV modifiers for daytime
      const outfitWithUV = getOutfitWithUV(baseOutfit, uvIndex, isDay)

      // Generate emojis string
      const emojis = outfitWithUV.join('')

      // Determine UV category for one-liner
      let uvCategory: 'low' | 'moderate' | 'high' | 'extreme' = 'low'
      if (uvIndex <= 2) uvCategory = 'low'
      else if (uvIndex <= 5) uvCategory = 'moderate'
      else if (uvIndex <= 7) uvCategory = 'high'
      else uvCategory = 'extreme'

      // Generate friendly one-liner
      const oneLiner = generateOneLiner(bucket, modifier, uvCategory, isDay, weatherCode)

      return { emojis, oneLiner, view, highTemp, lowTemp, dayIndex, dayLabel }
    }

    // Now: Based on current conditions
    const nowOutfit = createRecommendation(
      weather.temperature,
      weather.weatherCode,
      weather.windSpeed,
      weather.daily.today.uvIndexMax,
      weather.isDay,
      'now'
    )

    // Generate outfits for all 7 days
    const daysOutfits: OutfitRecommendation[] = weather.daily.days.map((day, index) => {
      // For today (index 0), use worst weather conditions
      // Use the lower of max temp or current temp for conservative outfit
      const dayTemp = index === 0
        ? Math.min(day.temperatureMax, weather.temperature)
        : day.temperatureMax

      // Use worst weather code from hourly data (if available)
      const dayWeatherCode = day.weatherCodeWorst ?? day.weatherCode

      // Use max wind speed from hourly data (if available)
      const dayWindSpeed = day.windSpeedMax ?? weather.windSpeed

      return createRecommendation(
        dayTemp,
        dayWeatherCode,
        dayWindSpeed,
        day.uvIndexMax,
        index === 0 ? weather.isDay : 1, // Future days are always considered daytime for planning
        index, // view is the day index
        day.temperatureMax,
        day.temperatureMin,
        day.dayIndex,
        day.dayLabel
      )
    })

    return {
      now: nowOutfit,
      days: daysOutfits,
      // Backward compatibility aliases
      today: daysOutfits[0] ?? null,
      tomorrow: daysOutfits[1] ?? null
    }
  }, [weather])

  /**
   * Get outfit recommendation for current conditions
   */
  const getCurrentOutfit = (): OutfitRecommendation | null => {
    return outfits.now ?? null
  }

  /**
   * Get outfit recommendation for today's forecast
   */
  const getTodayOutfit = (): OutfitRecommendation | null => {
    return outfits.today ?? null
  }

  /**
   * Get outfit recommendation for tomorrow's forecast
   */
  const getTomorrowOutfit = (): OutfitRecommendation | null => {
    return outfits.tomorrow ?? null
  }

  /**
   * Get outfit recommendation for a specific day by index
   * @param dayIndex - Day index (0 = today, 1 = tomorrow, 2-6 = future days)
   */
  const getDayOutfit = (dayIndex: number): OutfitRecommendation | null => {
    return outfits.days[dayIndex] ?? null
  }

  return {
    outfits,
    getCurrentOutfit,
    getTodayOutfit,
    getTomorrowOutfit,
    getDayOutfit
  }
}

/**
 * Get fallback outfit recommendation when weather data is unavailable
 */
export function getFallbackOutfit(view: OutfitView = 'now'): OutfitRecommendation {
  return {
    emojis: '🤔',
    oneLiner: getFallbackOneLiner(),
    view
  }
}
