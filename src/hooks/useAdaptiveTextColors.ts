/**
 * Custom hook for adaptive text colors based on background
 * Ensures WCAG AA compliance across all backgrounds
 */

import { useMemo } from 'react'
import { getBackgroundColor, getTextColor, getAdaptiveTextClass } from '../lib/adaptiveBackground'

export interface AdaptiveTextColors {
  // Primary text - headings, important information
  primary: string
  // Secondary text - body content, labels
  secondary: string
  // Tertiary text - supporting information
  tertiary: string
  // Muted text - subtle hints, timestamps
  muted: string
}

export interface AdaptiveTextClasses {
  primary: string
  secondary: string
  tertiary: string
  muted: string
}

/**
 * Hook to compute adaptive text colors based on weather conditions
 *
 * @param temperature - Current temperature
 * @param weatherCode - Open-Meteo weather code
 * @param isDay - Day flag (1 = day, 0 = night)
 * @param unit - Temperature unit ('C' or 'F')
 * @returns Object with color values and Tailwind class names
 *
 * @example
 * ```tsx
 * const { colors, classes } = useAdaptiveTextColors(72, 0, 1, 'F')
 *
 * return (
 *   <h1 className={classes.primary}>{title}</h1>
 *   <p className={classes.secondary}>{body}</p>
 *   <span className={classes.muted}>{timestamp}</span>
 * )
 * ```
 */
export function useAdaptiveTextColors(
  temperature: number | null,
  weatherCode: number | null,
  isDay: number | null,
  unit: 'C' | 'F' = 'F'
): { colors: AdaptiveTextColors; classes: AdaptiveTextClasses } {
  // Get background color first
  const backgroundColor = useMemo(() => {
    if (temperature === null || weatherCode === null || isDay === null) {
      return '#f1f5f9' // Default cool light background
    }
    return getBackgroundColor(temperature, weatherCode, isDay, unit)
  }, [temperature, weatherCode, isDay, unit])

  // Compute all text colors based on background
  const colors = useMemo<AdaptiveTextColors>(() => {
    return {
      primary: getTextColor(backgroundColor, 'primary'),
      secondary: getTextColor(backgroundColor, 'secondary'),
      tertiary: getTextColor(backgroundColor, 'tertiary'),
      muted: getTextColor(backgroundColor, 'muted'),
    }
  }, [backgroundColor])

  // Get Tailwind class names for each intensity level
  const classes = useMemo<AdaptiveTextClasses>(() => {
    const primary = getAdaptiveTextClass(backgroundColor, 'primary')
    const secondary = getAdaptiveTextClass(backgroundColor, 'secondary')
    const tertiary = getAdaptiveTextClass(backgroundColor, 'tertiary')
    const muted = getAdaptiveTextClass(backgroundColor, 'muted')

    return {
      primary: primary.className,
      secondary: secondary.className,
      tertiary: tertiary.className,
      muted: muted.className,
    }
  }, [backgroundColor])

  return { colors, classes }
}
