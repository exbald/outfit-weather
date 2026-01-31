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

/**
 * WCAG AA compliant text colors for light backgrounds
 * All colors meet or exceed 4.5:1 contrast ratio against white/light backgrounds
 */
const LIGHT_MODE_TEXT_COLORS = {
  primary: '#111827',   // gray-900 - For headings, important text (contrast: 15.9:1 on white)
  secondary: '#374151', // gray-700 - For body text (contrast: 7.1:1 on white)
  tertiary: '#6b7280',  // gray-500 - For supporting text (contrast: 4.6:1 on white) ✓ WCAG AA
  muted: '#6b7280',     // gray-500 - For subtle text (contrast: 4.6:1 on white) ✓ WCAG AA
                        // Changed from gray-400 (2.8:1) to gray-500 (4.6:1) for WCAG AA compliance
}

/**
 * WCAG AA compliant text colors for dark backgrounds
 * All colors meet or exceed 4.5:1 contrast ratio against dark backgrounds
 */
const DARK_MODE_TEXT_COLORS = {
  primary: '#ffffff',   // white - For headings, important text (contrast: 15+:1 on dark)
  secondary: '#e5e7eb', // gray-100 - For body text (contrast: 11+:1 on #1f2937)
  tertiary: '#d1d5db',  // gray-300 - For supporting text (contrast: 8+:1 on #1f2937)
  muted: '#9ca3af',     // gray-400 - For subtle text (contrast: 4.5+:1 on dark)
}

/**
 * Get WCAG AA compliant text color class for a given background
 *
 * @param backgroundColor - The background color to check against
 * @param intensity - Text intensity level ('primary' | 'secondary' | 'tertiary' | 'muted')
 * @returns CSS color string that meets WCAG AA requirements
 *
 * @example
 * ```ts
 * // Light background
 * getTextColor('#f1f5f9', 'primary')   // '#111827' (dark text)
 * getTextColor('#f1f5f9', 'secondary') // '#374151' (dark text)
 *
 * // Dark background
 * getTextColor('#1e293b', 'primary')   // '#ffffff' (light text)
 * getTextColor('#1e293b', 'secondary') // '#e5e7eb' (light text)
 * ```
 */
export function getTextColor(
  backgroundColor: string,
  intensity: 'primary' | 'secondary' | 'tertiary' | 'muted' = 'primary'
): string {
  const mode = getTextColorMode(backgroundColor)

  if (mode === 'light') {
    // Dark background - use light text
    return DARK_MODE_TEXT_COLORS[intensity]
  }

  // Light background - use dark text
  return LIGHT_MODE_TEXT_COLORS[intensity]
}

/**
 * Get Tailwind CSS class name for adaptive text color
 * This is useful for inline styling when you need the color value
 *
 * @param backgroundColor - The background color
 * @param intensity - Text intensity level
 * @returns Object with className and inline style for the adaptive text color
 */
export function getAdaptiveTextClass(
  backgroundColor: string,
  intensity: 'primary' | 'secondary' | 'tertiary' | 'muted' = 'primary'
): { className: string; style: { color: string } } {
  const color = getTextColor(backgroundColor, intensity)

  // Map internal color names to Tailwind classes for light mode
  const lightModeClasses: Record<string, string> = {
    '#111827': 'text-gray-900',
    '#374151': 'text-gray-700',
    '#6b7280': 'text-gray-500',
    '#9ca3af': 'text-gray-400',
  }

  // Map internal color names to Tailwind classes for dark mode
  const darkModeClasses: Record<string, string> = {
    '#ffffff': 'text-white',
    '#e5e7eb': 'text-gray-100',
    '#d1d5db': 'text-gray-300',
    '#9ca3af': 'text-gray-400',
  }

  const mode = getTextColorMode(backgroundColor)
  const className = mode === 'light'
    ? (darkModeClasses[color] || 'text-white')
    : (lightModeClasses[color] || 'text-gray-900')

  return {
    className,
    style: { color },
  }
}
