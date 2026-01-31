/**
 * Temperature bucket types for outfit recommendations
 */
export type TemperatureBucket =
  | 'freezing'
  | 'cold'
  | 'cool'
  | 'mild'
  | 'warm'
  | 'hot'

/**
 * Temperature unit type
 */
export type TemperatureUnit = 'C' | 'F'

/**
 * Temperature bucket boundaries in Fahrenheit
 */
const FAHRENHEIT_BUCKETS = {
  freezing: { max: 32 }, // < 32°F
  cold: { min: 32, max: 50 }, // 32-50°F
  cool: { min: 50, max: 65 }, // 50-65°F
  mild: { min: 65, max: 70 }, // 65-70°F (transition zone)
  warm: { min: 70, max: 80 }, // 70-80°F
  hot: { min: 80 }, // > 80°F
} as const

/**
 * Temperature bucket boundaries in Celsius
 * These are used for documentation and display purposes
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CELSIUS_BUCKETS = {
  freezing: { max: 0 }, // < 0°C
  cold: { min: 0, max: 10 }, // 0-10°C
  cool: { min: 10, max: 18 }, // 10-18°C
  mild: { min: 18, max: 21 }, // 18-21°C (transition zone)
  warm: { min: 21, max: 27 }, // 21-27°C
  hot: { min: 27 }, // > 27°C
} as const

// Export for documentation purposes
export { FAHRENHEIT_BUCKETS, CELSIUS_BUCKETS }

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9
}

/**
 * Classify temperature into a bucket based on the unit
 *
 * @param temperature - The temperature value
 * @param unit - The temperature unit ('C' or 'F')
 * @returns The temperature bucket
 *
 * @example
 * ```ts
 * getTemperatureBucket(25, 'F') // 'cold'
 * getTemperatureBucket(10, 'C') // 'cool'
 * getTemperatureBucket(85, 'F') // 'hot'
 * ```
 */
export function getTemperatureBucket(
  temperature: number,
  unit: TemperatureUnit = 'F'
): TemperatureBucket {
  // Small epsilon to handle floating-point precision issues
  const epsilon = 0.01

  if (unit === 'C') {
    // Use Celsius boundaries directly
    if (temperature < CELSIUS_BUCKETS.freezing.max - epsilon) {
      return 'freezing'
    }

    if (
      temperature >= CELSIUS_BUCKETS.cold.min - epsilon &&
      temperature < CELSIUS_BUCKETS.cold.max
    ) {
      return 'cold'
    }

    if (
      temperature >= CELSIUS_BUCKETS.cool.min - epsilon &&
      temperature < CELSIUS_BUCKETS.cool.max
    ) {
      return 'cool'
    }

    if (
      temperature >= CELSIUS_BUCKETS.mild.min - epsilon &&
      temperature < CELSIUS_BUCKETS.mild.max
    ) {
      return 'mild'
    }

    if (
      temperature >= CELSIUS_BUCKETS.warm.min - epsilon &&
      temperature < CELSIUS_BUCKETS.warm.max
    ) {
      return 'warm'
    }

    return 'hot'
  }

  // Fahrenheit logic
  if (temperature < FAHRENHEIT_BUCKETS.freezing.max) {
    return 'freezing'
  }

  if (
    temperature >= FAHRENHEIT_BUCKETS.cold.min &&
    temperature < FAHRENHEIT_BUCKETS.cold.max
  ) {
    return 'cold'
  }

  if (
    temperature >= FAHRENHEIT_BUCKETS.cool.min &&
    temperature < FAHRENHEIT_BUCKETS.cool.max
  ) {
    return 'cool'
  }

  if (
    temperature >= FAHRENHEIT_BUCKETS.mild.min &&
    temperature < FAHRENHEIT_BUCKETS.mild.max
  ) {
    return 'mild'
  }

  if (
    temperature >= FAHRENHEIT_BUCKETS.warm.min &&
    temperature < FAHRENHEIT_BUCKETS.warm.max
  ) {
    return 'warm'
  }

  // temperature >= FAHRENHEIT_BUCKETS.hot.min
  return 'hot'
}

/**
 * Get temperature bucket display name
 */
export function getTemperatureBucketDisplayName(
  bucket: TemperatureBucket
): string {
  const names: Record<TemperatureBucket, string> = {
    freezing: 'Freezing',
    cold: 'Cold',
    cool: 'Cool',
    mild: 'Mild',
    warm: 'Warm',
    hot: 'Hot',
  }
  return names[bucket]
}

/**
 * Get temperature bucket description with temperature ranges
 */
export function getTemperatureBucketDescription(
  bucket: TemperatureBucket,
  unit: TemperatureUnit = 'F'
): string {
  const descriptions: Record<TemperatureBucket, { F: string; C: string }> = {
    freezing: {
      F: 'Below 32°F',
      C: 'Below 0°C',
    },
    cold: {
      F: '32-50°F',
      C: '0-10°C',
    },
    cool: {
      F: '50-65°F',
      C: '10-18°C',
    },
    mild: {
      F: '65-70°F',
      C: '18-21°C',
    },
    warm: {
      F: '70-80°F',
      C: '21-27°C',
    },
    hot: {
      F: 'Above 80°F',
      C: 'Above 27°C',
    },
  }

  return descriptions[bucket][unit]
}

/**
 * Base outfit emoji combinations for each temperature bucket
 * These are the default outfits before weather modifiers are applied
 */
const BASE_OUTFITS: Record<TemperatureBucket, string[]> = {
  freezing: ['🧥', '🧣', '🧤', '🥾', '🧢'], // Heavy coat, scarf, gloves, boots, hat
  cold: ['🧥', '🧣', '👖', '🥾'], // Coat, scarf, pants, boots
  cool: ['🧥', '👕', '👖', '👟'], // Light coat, shirt, pants, sneakers
  mild: ['🧥', '👕', '👖', '👟'], // Light jacket, shirt, pants, sneakers
  warm: ['👕', '👖', '👟', '🧢'], // Shirt, pants, sneakers, hat
  hot: ['👕', '🩳', '👟', '🧢', '🕶️'], // T-shirt, shorts, sneakers, hat, sunglasses
}

/**
 * Get outfit emoji combination for a temperature bucket
 *
 * @param bucket - The temperature bucket
 * @returns Array of outfit emojis
 *
 * @example
 * ```ts
 * getOutfitEmojis('freezing') // ['🧥', '🧣', '🧤', '🥾', '🧢']
 * getOutfitEmojis('hot') // ['👕', '🩳', '👟', '🧢', '🕶️']
 * ```
 */
export function getOutfitEmojis(bucket: TemperatureBucket): string[] {
  return [...BASE_OUTFITS[bucket]]
}

/**
 * Get outfit emojis as a single string for display
 *
 * @param bucket - The temperature bucket
 * @returns String of concatenated emojis
 *
 * @example
 * ```ts
 * getOutfitEmojisString('freezing') // '🧥🧣🧤🥾🧢'
 * ```
 */
export function getOutfitEmojisString(bucket: TemperatureBucket): string {
  return BASE_OUTFITS[bucket].join('')
}

/**
 * UV index category type
 */
export type UVIndexCategory = 'low' | 'moderate' | 'high' | 'extreme'

/**
 * Wind speed unit type
 */
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'kn'

/**
 * Weather modifier types for outfit adjustments
 */
export type WeatherModifier = 'rain' | 'snow' | 'wind' | 'none'

/**
 * Check if a weather code indicates rain conditions
 * Includes drizzle, rain, freezing rain, and rain showers
 *
 * @param weatherCode - Open-Meteo weather code
 * @returns true if the code indicates rain
 */
export function isRainWeather(weatherCode: number): boolean {
  // Drizzle: 51, 53, 55, 56, 57
  if (weatherCode >= 51 && weatherCode <= 57) {
    return true
  }

  // Rain: 61, 63, 65
  if (weatherCode >= 61 && weatherCode <= 65) {
    return true
  }

  // Freezing rain: 66, 67
  if (weatherCode >= 66 && weatherCode <= 67) {
    return true
  }

  // Rain showers: 80, 81, 82
  if (weatherCode >= 80 && weatherCode <= 82) {
    return true
  }

  // Thunderstorm (includes rain): 95, 96, 99
  if (weatherCode >= 95 && weatherCode <= 99) {
    return true
  }

  return false
}

/**
 * Check if a weather code indicates snow conditions
 * Includes snow, snow grains, and snow showers
 *
 * @param weatherCode - Open-Meteo weather code
 * @returns true if the code indicates snow
 */
export function isSnowWeather(weatherCode: number): boolean {
  // Freezing drizzle: 56, 57 (already counted in rain, but also snow-like)
  // Freezing rain: 66, 67 (already counted in rain, but also snow-like)

  // Snow: 71, 73, 75
  if (weatherCode >= 71 && weatherCode <= 75) {
    return true
  }

  // Snow grains: 77
  if (weatherCode === 77) {
    return true
  }

  // Snow showers: 85, 86
  if (weatherCode >= 85 && weatherCode <= 86) {
    return true
  }

  return false
}

/**
 * Wind speed threshold for recommending windbreaker (km/h)
 * Values above this are considered "windy"
 */
const WIND_THRESHOLD_KMH = 15

/**
 * Convert wind speed from km/h to mph
 */
export function kmhToMph(kmh: number): number {
  return kmh * 0.621371
}

/**
 * Convert wind speed from mph to km/h
 */
export function mphToKmh(mph: number): number {
  return mph / 0.621371
}

/**
 * Check if wind speed is considered "windy"
 *
 * @param windSpeed - Wind speed value
 * @param unit - Wind speed unit ('kmh', 'mph', 'ms', 'kn')
 * @returns true if wind speed exceeds threshold
 *
 * @example
 * ```ts
 * isWindy(20, 'kmh') // true (above 15 km/h)
 * isWindy(8, 'mph') // false (below 9.3 mph)
 * isWindy(5, 'ms') // true (5 m/s = 18 km/h)
 * ```
 */
export function isWindy(
  windSpeed: number,
  unit: WindSpeedUnit = 'kmh'
): boolean {
  // Convert to km/h for consistent threshold check
  let windSpeedKmh: number

  switch (unit) {
    case 'kmh':
      windSpeedKmh = windSpeed
      break
    case 'mph':
      windSpeedKmh = mphToKmh(windSpeed)
      break
    case 'ms':
      // m/s to km/h: multiply by 3.6
      windSpeedKmh = windSpeed * 3.6
      break
    case 'kn':
      // knots to km/h: multiply by 1.852
      windSpeedKmh = windSpeed * 1.852
      break
  }

  return windSpeedKmh >= WIND_THRESHOLD_KMH
}

/**
 * Get weather modifier type from weather code and wind speed
 *
 * @param weatherCode - Open-Meteo weather code
 * @param windSpeed - Wind speed value
 * @param windSpeedUnit - Wind speed unit ('kmh', 'mph', 'ms', 'kn')
 * @returns Weather modifier type
 */
export function getWeatherModifier(
  weatherCode: number,
  windSpeed = 0,
  windSpeedUnit: WindSpeedUnit = 'kmh'
): WeatherModifier {
  if (isRainWeather(weatherCode)) {
    return 'rain'
  }

  if (isSnowWeather(weatherCode)) {
    return 'snow'
  }

  if (isWindy(windSpeed, windSpeedUnit)) {
    return 'wind'
  }

  return 'none'
}

/**
 * Additional outfit emojis for weather conditions
 */
const WEATHER_MODIFIER_EMOJIS: Record<WeatherModifier, string[]> = {
  rain: ['☂️'], // Umbrella for rain
  snow: ['🧣', '🧤'], // Extra scarf and gloves for snow
  wind: ['🧥'], // Windbreaker for windy conditions
  none: [], // No additional items
}

/**
 * Apply weather modifier to base outfit emojis
 * Adds appropriate gear based on weather conditions and wind speed
 *
 * @param bucket - The temperature bucket
 * @param weatherCode - Open-Meteo weather code
 * @param windSpeed - Wind speed value (default: 0)
 * @param windSpeedUnit - Wind speed unit (default: 'kmh')
 * @returns Array of outfit emojis with weather modifiers applied
 *
 * @example
 * ```ts
 * // Rainy cold day
 * getOutfitWithWeather('cold', 63) // ['🧥', '🧣', '👖', '🥾', '☂️']
 *
 * // Snowy freezing day
 * getOutfitWithWeather('freezing', 73) // ['🧥', '🧣', '🧤', '🥾', '🧢', '🧣', '🧤']
 *
 * // Clear mild day
 * getOutfitWithWeather('mild', 0) // ['🧥', '👕', '👖', '👟']
 *
 * // Windy cool day
 * getOutfitWithWeather('cool', 2, 20, 'kmh') // ['🧥', '👕', '👖', '👟', '🧥']
 * ```
 */
export function getOutfitWithWeather(
  bucket: TemperatureBucket,
  weatherCode: number,
  windSpeed = 0,
  windSpeedUnit: WindSpeedUnit = 'kmh'
): string[] {
  const baseOutfit = getOutfitEmojis(bucket)
  const modifier = getWeatherModifier(weatherCode, windSpeed, windSpeedUnit)
  const additionalEmojis = WEATHER_MODIFIER_EMOJIS[modifier]

  // Return base outfit with additional weather-specific items
  return [...baseOutfit, ...additionalEmojis]
}

/**
 * UV Index thresholds for categorization
 * Based on WHO UV Index standards:
 * - Low: 0-2 (Minimal protection required)
 * - Moderate: 3-5 (Protection required)
 * - High: 6-7 (Protection required)
 * - Very High: 8-10 (Extra protection required)
 * - Extreme: 11+ (Extra protection required)
 *
 * We group "very high" and "extreme" together as "extreme"
 */
export function getUVIndexCategory(uvIndex: number): UVIndexCategory {
  if (uvIndex <= 2) return 'low'
  if (uvIndex <= 5) return 'moderate'
  if (uvIndex <= 7) return 'high'
  return 'extreme'
}

/**
 * Get UV index category display name
 */
export function getUVIndexCategoryDisplayName(category: UVIndexCategory): string {
  const names: Record<UVIndexCategory, string> = {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    extreme: 'Extreme'
  }
  return names[category]
}

/**
 * Get UV index category description with health guidance
 */
export function getUVIndexCategoryDescription(category: UVIndexCategory): string {
  const descriptions: Record<UVIndexCategory, string> = {
    low: 'Minimal protection required. Safe to be outside.',
    moderate: 'Protection required. Seek shade during midday hours.',
    high: 'Protection required. Reduce time in sun between 10am-4pm.',
    extreme: 'Extra protection required. Avoid sun exposure between 10am-4pm.'
  }
  return descriptions[category]
}

/**
 * Get UV modifier emojis based on UV index and time of day
 * Adds sunglasses for moderate+ UV during daytime (UV ≥ 3)
 * Adds hat for high+ UV during daytime (UV ≥ 6)
 *
 * @param uvIndex - Maximum UV index for the day
 * @param isDay - 1 for daytime, 0 for nighttime
 * @returns Array of additional UV protection emojis
 *
 * @example
 * ```ts
 * getUVModifierEmojis(5, 1)  // ['🕶️'] (moderate UV, daytime)
 * getUVModifierEmojis(6, 1)  // ['🕶️', '🧢'] (high UV, daytime)
 * getUVModifierEmojis(10, 1) // ['🕶️', '🧢'] (extreme UV, daytime)
 * getUVModifierEmojis(8, 0)  // [] (high UV, nighttime - no sunglasses needed)
 * ```
 */
export function getUVModifierEmojis(uvIndex: number, isDay: number): string[] {
  const additional: string[] = []

  // Only add UV protection during daytime
  if (isDay === 0) {
    return additional
  }

  const category = getUVIndexCategory(uvIndex)

  // Add sunglasses for moderate, high, and extreme UV (UV ≥ 3)
  if (category === 'moderate' || category === 'high' || category === 'extreme') {
    additional.push('🕶️')
  }

  // Add hat for high and extreme UV (UV ≥ 6)
  if (category === 'high' || category === 'extreme') {
    additional.push('🧢')
  }

  return additional
}

/**
 * Apply UV modifier to outfit emojis
 * Combines base outfit with UV-specific protection items
 *
 * @param baseOutfit - Array of outfit emojis
 * @param uvIndex - Maximum UV index for the day
 * @param isDay - 1 for daytime, 0 for nighttime
 * @returns Array of outfit emojis with UV modifiers applied
 *
 * @example
 * ```ts
 * getOutfitWithUV(['👕', '👖', '👟'], 3, 1)  // ['👕', '👖', '👟', '🕶️']
 * getOutfitWithUV(['👕', '🩳', '👟'], 11, 1) // ['👕', '🩳', '👟', '🕶️', '🧢']
 * getOutfitWithUV(['🧥', '🧣', '👖'], 8, 0)  // ['🧥', '🧣', '👖'] (nighttime)
 * ```
 */
export function getOutfitWithUV(
  baseOutfit: string[],
  uvIndex: number,
  isDay: number
): string[] {
  const uvEmojis = getUVModifierEmojis(uvIndex, isDay)
  return [...baseOutfit, ...uvEmojis]
}

/**
 * Precipitation probability threshold for adding umbrella (percentage)
 * Values above this trigger umbrella recommendation
 */
const PRECIPITATION_THRESHOLD = 30

/**
 * Check if precipitation probability exceeds threshold for umbrella recommendation
 *
 * @param precipitationProbability - Precipitation probability (0-100)
 * @returns true if umbrella should be recommended
 *
 * @example
 * ```ts
 * shouldAddUmbrella(10) // false (below 30% threshold)
 * shouldAddUmbrella(30) // false (at threshold, not above)
 * shouldAddUmbrella(31) // true (exceeds 30% threshold)
 * shouldAddUmbrella(80) // true (high probability of rain)
 * ```
 */
export function shouldAddUmbrella(precipitationProbability: number): boolean {
  return precipitationProbability > PRECIPITATION_THRESHOLD
}

/**
 * Get precipitation modifier emojis based on probability
 * Adds umbrella when precipitation probability exceeds 30%
 *
 * @param precipitationProbability - Precipitation probability (0-100)
 * @returns Array of additional precipitation-related emojis
 *
 * @example
 * ```ts
 * getPrecipitationModifierEmojis(10) // [] (low probability)
 * getPrecipitationModifierEmojis(30) // [] (at threshold)
 * getPrecipitationModifierEmojis(50) // ['☂️'] (rain expected)
 * getPrecipitationModifierEmojis(90) // ['☂️'] (high probability)
 * ```
 */
export function getPrecipitationModifierEmojis(precipitationProbability: number): string[] {
  const additional: string[] = []

  if (shouldAddUmbrella(precipitationProbability)) {
    additional.push('☂️')
  }

  return additional
}

/**
 * Apply precipitation modifier to outfit emojis
 * Adds umbrella when precipitation probability exceeds 30%
 *
 * @param baseOutfit - Array of outfit emojis
 * @param precipitationProbability - Precipitation probability (0-100)
 * @returns Array of outfit emojis with precipitation modifiers applied
 *
 * @example
 * ```ts
 * getOutfitWithPrecipitation(['👕', '👖', '👟'], 10) // ['👕', '👖', '👟'] (no rain expected)
 * getOutfitWithPrecipitation(['👕', '👖', '👟'], 50) // ['👕', '👖', '👟', '☂️'] (rain expected)
 * getOutfitWithPrecipitation(['🧥', '🧣', '👖', '🥾'], 80) // ['🧥', '🧣', '👖', '🥾', '☂️'] (high probability)
 * ```
 */
export function getOutfitWithPrecipitation(
  baseOutfit: string[],
  precipitationProbability: number
): string[] {
  const precipEmojis = getPrecipitationModifierEmojis(precipitationProbability)
  return [...baseOutfit, ...precipEmojis]
}

/**
 * Get precipitation context message for outfit one-liner
 * Returns a friendly message when rain is expected
 *
 * @param precipitationProbability - Precipitation probability (0-100)
 * @returns Friendly message or empty string
 *
 * @example
 * ```ts
 * getPrecipitationMessage(10) // '' (no message needed)
 * getPrecipitationMessage(50) // 'Rain expected'
 * getPrecipitationMessage(90) // 'Rain expected'
 * ```
 */
export function getPrecipitationMessage(precipitationProbability: number): string {
  if (shouldAddUmbrella(precipitationProbability)) {
    return 'Rain expected'
  }
  return ''
}
