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
 */
export type OutfitView = 'now' | 'today' | 'tomorrow'

/**
 * Complete outfit recommendation with emojis and one-liner
 */
export interface OutfitRecommendation {
  emojis: string
  oneLiner: string
  view: OutfitView
}

/**
 * Hook to generate outfit recommendations based on weather data
 *
 * Creates outfit recommendations for three timeframes:
 * - Now: Based on current apparent temperature and conditions
 * - Today: Based on daily high/low range and worst weather of the day
 * - Tomorrow: Based on tomorrow's forecast
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
 * const { outfits, getCurrentOutfit, getTodayOutfit, getTomorrowOutfit } = useOutfit(weather)
 *
 * // Get current outfit
 * const currentOutfit = getCurrentOutfit()
 * console.log(currentOutfit.emojis)     // "🧥🧣👖🥾☂️"
 * console.log(currentOutfit.oneLiner)   // "Cold and rainy - umbrella time! ☔"
 * console.log(currentOutfit.view)       // "now"
 * ```
 */
export function useOutfit(weather: WeatherData | null) {
  const outfits = useMemo(() => {
    // Return empty recommendations if no weather data
    if (!weather) {
      return {
        now: null,
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
      view: OutfitView
    ): OutfitRecommendation => {
      // Determine temperature bucket
      const bucket = getTemperatureBucket(temperature, 'F')

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

      return { emojis, oneLiner, view }
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

    // Today: Based on today's forecast
    // Use the lower of max temp or current temp for conservative outfit
    const todayTemp = Math.min(weather.daily.today.temperatureMax, weather.temperature)
    const todayOutfit = createRecommendation(
      todayTemp,
      weather.daily.today.weatherCode,
      weather.windSpeed,
      weather.daily.today.uvIndexMax,
      weather.isDay,
      'today'
    )

    // Tomorrow: Based on tomorrow's forecast
    const tomorrowOutfit = createRecommendation(
      weather.daily.tomorrow.temperatureMax,
      weather.daily.tomorrow.weatherCode,
      weather.windSpeed, // Use current wind as estimate
      weather.daily.tomorrow.uvIndexMax,
      weather.isDay,
      'tomorrow'
    )

    return {
      now: nowOutfit,
      today: todayOutfit,
      tomorrow: tomorrowOutfit
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

  return {
    outfits,
    getCurrentOutfit,
    getTodayOutfit,
    getTomorrowOutfit
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
