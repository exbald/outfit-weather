/**
 * Custom hook to manage adaptive background colors
 * Returns background style based on current weather conditions
 */

import { useMemo } from 'react'
import {
  getBackgroundColor,
  getBackgroundGradient,
  getBackgroundTransition,
} from '../lib/adaptiveBackground'

export interface AdaptiveBackgroundResult {
  backgroundColor: string
  backgroundGradient: string
  backgroundStyle: React.CSSProperties
}

/**
 * Hook to compute adaptive background based on weather
 *
 * @param temperature - Current temperature
 * @param weatherCode - Open-Meteo weather code
 * @param isDay - Day flag (1 = day, 0 = night)
 * @param unit - Temperature unit ('C' or 'F')
 * @returns Background color, gradient, and CSS style object
 *
 * @example
 * ```tsx
 * const { backgroundStyle } = useAdaptiveBackground(72, 0, 1, 'F')
 *
 * return <div style={backgroundStyle}>...</div>
 * ```
 */
export function useAdaptiveBackground(
  temperature: number | null,
  weatherCode: number | null,
  isDay: number | null,
  unit: 'C' | 'F' = 'F'
): AdaptiveBackgroundResult {
  // Default fallback color (cool gray)
  const defaultColor = '#f1f5f9'

  const backgroundColor = useMemo(() => {
    if (temperature === null || weatherCode === null || isDay === null) {
      return defaultColor
    }

    return getBackgroundColor(temperature, weatherCode, isDay, unit)
  }, [temperature, weatherCode, isDay, unit])

  const backgroundGradient = useMemo(() => {
    return getBackgroundGradient(backgroundColor)
  }, [backgroundColor])

  const backgroundStyle = useMemo(() => {
    return {
      background: backgroundGradient,
      transition: getBackgroundTransition(),
      minHeight: '100vh',
    }
  }, [backgroundGradient])

  return {
    backgroundColor,
    backgroundGradient,
    backgroundStyle,
  }
}
