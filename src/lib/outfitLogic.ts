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
  // Normalize to Fahrenheit for consistent bucket logic
  const tempF = unit === 'C' ? celsiusToFahrenheit(temperature) : temperature

  if (tempF < FAHRENHEIT_BUCKETS.freezing.max) {
    return 'freezing'
  }

  if (
    tempF >= FAHRENHEIT_BUCKETS.cold.min &&
    tempF < FAHRENHEIT_BUCKETS.cold.max
  ) {
    return 'cold'
  }

  if (
    tempF >= FAHRENHEIT_BUCKETS.cool.min &&
    tempF < FAHRENHEIT_BUCKETS.cool.max
  ) {
    return 'cool'
  }

  if (
    tempF >= FAHRENHEIT_BUCKETS.mild.min &&
    tempF < FAHRENHEIT_BUCKETS.mild.max
  ) {
    return 'mild'
  }

  if (
    tempF >= FAHRENHEIT_BUCKETS.warm.min &&
    tempF < FAHRENHEIT_BUCKETS.warm.max
  ) {
    return 'warm'
  }

  // tempF >= FAHRENHEIT_BUCKETS.hot.min
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
