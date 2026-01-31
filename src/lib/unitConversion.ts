import type { TemperatureUnit, WindSpeedUnit } from '../hooks/useSettings'

/**
 * Convert temperature from Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9 / 5) + 32
}

/**
 * Convert temperature from Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5 / 9
}

/**
 * Convert temperature based on target unit
 * @param temp - Temperature value (assumed to be in Celsius if no unit specified)
 * @param unit - Target unit ('C' or 'F')
 * @returns Temperature in the target unit
 */
export function convertTemperature(temp: number, unit: TemperatureUnit): number {
  if (unit === 'F') {
    return celsiusToFahrenheit(temp)
  }
  return temp
}

/**
 * Format temperature for display with unit
 * @param temp - Temperature value in Celsius
 * @param unit - Target unit ('C' or 'F')
 * @returns Formatted string (e.g., "72°F", "22°C")
 */
export function formatTemperature(temp: number, unit: TemperatureUnit): string {
  const converted = convertTemperature(temp, unit)
  return `${Math.round(converted)}°`
}

/**
 * Convert wind speed from km/h to mph
 */
export function kmhToMmph(kmh: number): number {
  return kmh * 0.621371
}

/**
 * Convert wind speed based on target unit
 * @param speed - Wind speed value (assumed to be in km/h if no unit specified)
 * @param unit - Target unit ('kmh' or 'mph')
 * @returns Wind speed in the target unit
 */
export function convertWindSpeed(speed: number, unit: WindSpeedUnit): number {
  if (unit === 'mph') {
    return kmhToMmph(speed)
  }
  return speed
}

/**
 * Format wind speed for display with unit
 * @param speed - Wind speed value in km/h
 * @param unit - Target unit ('kmh' or 'mph')
 * @returns Formatted string (e.g., "15 mph", "25 km/h")
 */
export function formatWindSpeed(speed: number, unit: WindSpeedUnit): string {
  const converted = convertWindSpeed(speed, unit)
  const unitLabel = unit === 'mph' ? 'mph' : 'km/h'
  return `${Math.round(converted)} ${unitLabel}`
}
