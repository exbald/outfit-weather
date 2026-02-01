/**
 * Weather-based gradient color palettes
 * Maps temperature buckets and weather conditions to gradient colors
 */

import { useMemo } from 'react'
import { getTemperatureBucket, type TemperatureBucket, isRainWeather, isSnowWeather } from '../lib/outfitLogic'
import type { GradientColors } from '../components/ui/background-gradient'

/**
 * Color palettes for each temperature bucket
 * Colors are in RGB format for radial gradients: "R, G, B"
 */
interface GradientPalette extends GradientColors {
  name: string
}

const LIGHT_MODE_PALETTES: Record<TemperatureBucket, GradientPalette> = {
  extreme_freezing: {
    name: 'Arctic Frost',
    gradientBackgroundStart: 'rgb(199, 210, 220)',
    gradientBackgroundEnd: 'rgb(148, 163, 184)',
    firstColor: '199, 210, 220',
    secondColor: '186, 230, 253',
    thirdColor: '224, 242, 254',
    fourthColor: '148, 163, 184',
    fifthColor: '203, 213, 225',
    pointerColor: '186, 230, 253',
  },
  freezing: {
    name: 'Winter Chill',
    gradientBackgroundStart: 'rgb(224, 231, 239)',
    gradientBackgroundEnd: 'rgb(186, 230, 253)',
    firstColor: '224, 231, 239',
    secondColor: '186, 230, 253',
    thirdColor: '199, 210, 220',
    fourthColor: '165, 180, 252',
    fifthColor: '224, 242, 254',
    pointerColor: '199, 210, 220',
  },
  cold: {
    name: 'Cool Breeze',
    gradientBackgroundStart: 'rgb(219, 234, 254)',
    gradientBackgroundEnd: 'rgb(191, 219, 254)',
    firstColor: '219, 234, 254',
    secondColor: '147, 197, 253',
    thirdColor: '186, 230, 253',
    fourthColor: '165, 180, 252',
    fifthColor: '199, 210, 220',
    pointerColor: '147, 197, 253',
  },
  cool: {
    name: 'Morning Mist',
    gradientBackgroundStart: 'rgb(241, 245, 249)',
    gradientBackgroundEnd: 'rgb(226, 232, 240)',
    firstColor: '241, 245, 249',
    secondColor: '219, 234, 254',
    thirdColor: '209, 250, 229',
    fourthColor: '186, 230, 253',
    fifthColor: '226, 232, 240',
    pointerColor: '186, 230, 253',
  },
  mild: {
    name: 'Spring Garden',
    gradientBackgroundStart: 'rgb(236, 253, 245)',
    gradientBackgroundEnd: 'rgb(209, 250, 229)',
    firstColor: '236, 253, 245',
    secondColor: '167, 243, 208',
    thirdColor: '187, 247, 208',
    fourthColor: '254, 249, 195',
    fifthColor: '209, 250, 229',
    pointerColor: '167, 243, 208',
  },
  warm: {
    name: 'Golden Hour',
    gradientBackgroundStart: 'rgb(254, 243, 199)',
    gradientBackgroundEnd: 'rgb(253, 230, 138)',
    firstColor: '254, 243, 199',
    secondColor: '253, 224, 71',
    thirdColor: '254, 215, 170',
    fourthColor: '251, 191, 36',
    fifthColor: '254, 249, 195',
    pointerColor: '251, 191, 36',
  },
  hot: {
    name: 'Summer Heat',
    gradientBackgroundStart: 'rgb(255, 237, 213)',
    gradientBackgroundEnd: 'rgb(254, 215, 170)',
    firstColor: '255, 237, 213',
    secondColor: '253, 186, 116',
    thirdColor: '254, 215, 170',
    fourthColor: '251, 146, 60',
    fifthColor: '254, 243, 199',
    pointerColor: '251, 146, 60',
  },
  extreme_hot: {
    name: 'Desert Sun',
    gradientBackgroundStart: 'rgb(254, 215, 170)',
    gradientBackgroundEnd: 'rgb(253, 186, 116)',
    firstColor: '254, 215, 170',
    secondColor: '248, 113, 113',
    thirdColor: '253, 186, 116',
    fourthColor: '239, 68, 68',
    fifthColor: '251, 146, 60',
    pointerColor: '248, 113, 113',
  },
}

const DARK_MODE_PALETTES: Record<TemperatureBucket, GradientPalette> = {
  extreme_freezing: {
    name: 'Polar Night',
    gradientBackgroundStart: 'rgb(15, 23, 42)',
    gradientBackgroundEnd: 'rgb(30, 41, 59)',
    firstColor: '30, 58, 95',
    secondColor: '51, 65, 85',
    thirdColor: '30, 41, 59',
    fourthColor: '71, 85, 105',
    fifthColor: '15, 23, 42',
    pointerColor: '100, 116, 139',
  },
  freezing: {
    name: 'Midnight Ice',
    gradientBackgroundStart: 'rgb(30, 41, 59)',
    gradientBackgroundEnd: 'rgb(30, 58, 95)',
    firstColor: '30, 58, 95',
    secondColor: '59, 130, 246',
    thirdColor: '30, 41, 59',
    fourthColor: '51, 65, 85',
    fifthColor: '71, 85, 105',
    pointerColor: '96, 165, 250',
  },
  cold: {
    name: 'Deep Ocean',
    gradientBackgroundStart: 'rgb(30, 58, 95)',
    gradientBackgroundEnd: 'rgb(29, 78, 137)',
    firstColor: '29, 78, 137',
    secondColor: '59, 130, 246',
    thirdColor: '30, 58, 95',
    fourthColor: '96, 165, 250',
    fifthColor: '51, 65, 85',
    pointerColor: '147, 197, 253',
  },
  cool: {
    name: 'Twilight',
    gradientBackgroundStart: 'rgb(51, 65, 85)',
    gradientBackgroundEnd: 'rgb(30, 58, 95)',
    firstColor: '51, 65, 85',
    secondColor: '71, 85, 105',
    thirdColor: '30, 58, 95',
    fourthColor: '28, 61, 50',
    fifthColor: '30, 41, 59',
    pointerColor: '100, 116, 139',
  },
  mild: {
    name: 'Forest Night',
    gradientBackgroundStart: 'rgb(28, 61, 50)',
    gradientBackgroundEnd: 'rgb(20, 83, 45)',
    firstColor: '28, 61, 50',
    secondColor: '34, 197, 94',
    thirdColor: '20, 83, 45',
    fourthColor: '22, 101, 52',
    fifthColor: '51, 65, 85',
    pointerColor: '74, 222, 128',
  },
  warm: {
    name: 'Ember Glow',
    gradientBackgroundStart: 'rgb(66, 61, 24)',
    gradientBackgroundEnd: 'rgb(113, 63, 18)',
    firstColor: '66, 61, 24',
    secondColor: '202, 138, 4',
    thirdColor: '113, 63, 18',
    fourthColor: '245, 158, 11',
    fifthColor: '74, 44, 10',
    pointerColor: '251, 191, 36',
  },
  hot: {
    name: 'Sunset Blaze',
    gradientBackgroundStart: 'rgb(74, 44, 10)',
    gradientBackgroundEnd: 'rgb(124, 45, 18)',
    firstColor: '74, 44, 10',
    secondColor: '234, 88, 12',
    thirdColor: '124, 45, 18',
    fourthColor: '249, 115, 22',
    fifthColor: '113, 63, 18',
    pointerColor: '251, 146, 60',
  },
  extreme_hot: {
    name: 'Inferno',
    gradientBackgroundStart: 'rgb(61, 26, 5)',
    gradientBackgroundEnd: 'rgb(127, 29, 29)',
    firstColor: '127, 29, 29',
    secondColor: '239, 68, 68',
    thirdColor: '61, 26, 5',
    fourthColor: '220, 38, 38',
    fifthColor: '124, 45, 18',
    pointerColor: '248, 113, 113',
  },
}

/**
 * Special weather condition palettes (rain/snow)
 */
const RAIN_LIGHT: GradientPalette = {
  name: 'Rain Clouds',
  gradientBackgroundStart: 'rgb(226, 232, 240)',
  gradientBackgroundEnd: 'rgb(203, 213, 225)',
  firstColor: '226, 232, 240',
  secondColor: '148, 163, 184',
  thirdColor: '203, 213, 225',
  fourthColor: '100, 116, 139',
  fifthColor: '241, 245, 249',
  pointerColor: '148, 163, 184',
}

const RAIN_DARK: GradientPalette = {
  name: 'Storm Night',
  gradientBackgroundStart: 'rgb(55, 65, 81)',
  gradientBackgroundEnd: 'rgb(31, 41, 55)',
  firstColor: '55, 65, 81',
  secondColor: '75, 85, 99',
  thirdColor: '31, 41, 55',
  fourthColor: '107, 114, 128',
  fifthColor: '17, 24, 39',
  pointerColor: '156, 163, 175',
}

const SNOW_LIGHT: GradientPalette = {
  name: 'Snowfall',
  gradientBackgroundStart: 'rgb(241, 245, 249)',
  gradientBackgroundEnd: 'rgb(226, 232, 240)',
  firstColor: '241, 245, 249',
  secondColor: '224, 242, 254',
  thirdColor: '226, 232, 240',
  fourthColor: '186, 230, 253',
  fifthColor: '248, 250, 252',
  pointerColor: '199, 210, 220',
}

const SNOW_DARK: GradientPalette = {
  name: 'Winter Night',
  gradientBackgroundStart: 'rgb(30, 41, 59)',
  gradientBackgroundEnd: 'rgb(51, 65, 85)',
  firstColor: '30, 41, 59',
  secondColor: '71, 85, 105',
  thirdColor: '51, 65, 85',
  fourthColor: '100, 116, 139',
  fifthColor: '15, 23, 42',
  pointerColor: '148, 163, 184',
}

/**
 * Neutral loading palette - shown before weather data loads
 * Uses neutral gray tones that don't suggest any particular weather
 */
const LOADING_PALETTE_LIGHT: GradientPalette = {
  name: 'Loading',
  gradientBackgroundStart: 'rgb(241, 245, 249)',
  gradientBackgroundEnd: 'rgb(226, 232, 240)',
  firstColor: '241, 245, 249',
  secondColor: '226, 232, 240',
  thirdColor: '203, 213, 225',
  fourthColor: '148, 163, 184',
  fifthColor: '248, 250, 252',
  pointerColor: '203, 213, 225',
}

const LOADING_PALETTE_DARK: GradientPalette = {
  name: 'Loading Dark',
  gradientBackgroundStart: 'rgb(30, 41, 59)',
  gradientBackgroundEnd: 'rgb(51, 65, 85)',
  firstColor: '30, 41, 59',
  secondColor: '51, 65, 85',
  thirdColor: '71, 85, 105',
  fourthColor: '100, 116, 139',
  fifthColor: '15, 23, 42',
  pointerColor: '100, 116, 139',
}

/**
 * Hook to get gradient colors based on weather conditions
 *
 * @param temperature - Current temperature
 * @param weatherCode - Open-Meteo weather code
 * @param isDay - 1 for daytime, 0 for nighttime
 * @param unit - Temperature unit ('C' or 'F')
 * @param isDarkMode - Whether dark mode is enabled
 * @returns Gradient colors for the BackgroundGradient component
 */
export function useWeatherGradient(
  temperature: number | null,
  weatherCode: number | null,
  isDay: number | null,
  unit: 'C' | 'F' = 'F',
  isDarkMode: boolean = false
): GradientColors {
  return useMemo(() => {
    // Neutral loading palette when no weather data (gray, not green)
    if (temperature === null || weatherCode === null) {
      return isDarkMode ? LOADING_PALETTE_DARK : LOADING_PALETTE_LIGHT
    }

    // Determine if we should use dark colors
    const useDarkColors = isDarkMode || isDay === 0

    // Check for precipitation conditions first (highest priority)
    if (isSnowWeather(weatherCode)) {
      return useDarkColors ? SNOW_DARK : SNOW_LIGHT
    }

    if (isRainWeather(weatherCode)) {
      return useDarkColors ? RAIN_DARK : RAIN_LIGHT
    }

    // Get temperature bucket and return appropriate palette
    const bucket = getTemperatureBucket(temperature, unit)

    if (useDarkColors) {
      return DARK_MODE_PALETTES[bucket]
    }

    return LIGHT_MODE_PALETTES[bucket]
  }, [temperature, weatherCode, isDay, unit, isDarkMode])
}
