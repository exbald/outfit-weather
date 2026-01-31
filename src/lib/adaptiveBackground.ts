/**
 * Adaptive background color system for OutFitWeather
 * Maps weather conditions to appropriate background colors
 */

import { getTemperatureBucket, type TemperatureBucket } from './outfitLogic'
import { isRainWeather, isSnowWeather } from './outfitLogic'

/**
 * Light mode background colors for each temperature bucket
 * These are the primary colors shown during the day
 */
const LIGHT_MODE_COLORS: Record<TemperatureBucket, string> = {
  freezing: '#e0e7ef', // Slate blue
  cold: '#dbeafe', // Cool blue
  cool: '#f1f5f9', // Light gray-blue
  mild: '#ecfdf5', // Soft green
  warm: '#fef3c7', // Warm amber
  hot: '#ffedd5', // Orange
}

/**
 * Dark mode background colors for each temperature bucket
 * Deeper variants with reduced lightness for night mode
 */
const DARK_MODE_COLORS: Record<TemperatureBucket, string> = {
  freezing: '#1e293b', // Deep slate
  cold: '#1e3a5f', // Deep blue
  cool: '#334155', // Deep gray-blue
  mild: '#1c3d32', // Deep green
  warm: '#423d18', // Deep amber
  hot: '#4a2c0a', // Deep orange
}

/**
 * Special weather condition colors
 * These override temperature-based colors when precipitation is present
 */
const RAIN_COLOR_LIGHT = '#e2e8f0' // Gray-blue
const RAIN_COLOR_DARK = '#374151' // Deep gray

/**
 * Get background color based on temperature, weather code, and time of day
 *
 * @param temperature - Current temperature in Celsius or Fahrenheit
 * @param weatherCode - Open-Meteo weather code
 * @param isDay - 1 for daytime, 0 for nighttime
 * @param unit - Temperature unit ('C' or 'F')
 * @returns CSS color string for background
 *
 * @example
 * ```ts
 * // Freezing day
 * getBackgroundColor(25, 'F', 1) // '#e0e7ef'
 *
 * // Rainy day (overrides temperature color)
 * getBackgroundColor(70, 63, 1) // '#e2e8f0'
 *
 * // Hot night
 * getBackgroundColor(85, 'F', 0) // '#4a2c0a'
 * ```
 */
export function getBackgroundColor(
  temperature: number,
  weatherCode: number,
  isDay: number,
  unit: 'C' | 'F' = 'F'
): string {
  // Check for precipitation conditions first (highest priority)
  if (isRainWeather(weatherCode) || isSnowWeather(weatherCode)) {
    return isDay === 1 ? RAIN_COLOR_LIGHT : RAIN_COLOR_DARK
  }

  // Get temperature bucket
  const bucket = getTemperatureBucket(temperature, unit)

  // Return appropriate color based on day/night
  if (isDay === 1) {
    return LIGHT_MODE_COLORS[bucket]
  }

  return DARK_MODE_COLORS[bucket]
}

/**
 * Get CSS gradient for background
 * Creates a subtle gradient based on the base background color
 *
 * @param baseColor - The base background color
 * @returns CSS gradient string
 *
 * @example
 * ```ts
 * getBackgroundGradient('#dbeafe') // 'linear-gradient(180deg, #dbeafe 0%, #f1f5f9 100%)'
 * ```
 */
export function getBackgroundGradient(baseColor: string): string {
  return `linear-gradient(180deg, ${baseColor} 0%, ${baseColor}dd 100%)`
}

/**
 * Get text color that provides good contrast against the background
 *
 * @param backgroundColor - The background color
 * @returns 'light' for dark backgrounds, 'dark' for light backgrounds
 */
export function getTextColorMode(backgroundColor: string): 'light' | 'dark' {
  // Simple heuristic: if background starts with #1-#4, it's dark
  if (backgroundColor.startsWith('#0') || backgroundColor.startsWith('#1') ||
      backgroundColor.startsWith('#2') || backgroundColor.startsWith('#3') ||
      backgroundColor.startsWith('#4')) {
    return 'light'
  }
  return 'dark'
}

/**
 * Get transition styles for smooth background color changes
 *
 * @returns CSS transition string for background-color
 */
export function getBackgroundTransition(): string {
  return 'background-color 1.5s ease-in-out'
}
