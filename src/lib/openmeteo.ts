/**
 * Open-Meteo API Client
 * Fetches weather data from Open-Meteo API (free, no authentication required)
 * Documentation: https://open-meteo.com/en/docs
 */

export interface CurrentWeatherResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: {
    time: string
    interval: string
    temperature: string
    windspeed: string
    is_day: string
    weathercode: string
  }
  current: {
    time: string
    interval: number
    temperature: number
    windspeed: number
    is_day: number
    weathercode: number
  }
}

/**
 * Build Open-Meteo API URL for fetching current weather
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @param temperatureUnit - Temperature unit (celsius or fahrenheit)
 * @param windSpeedUnit - Wind speed unit (kmh, mph, ms, kn)
 * @returns Open-Meteo API URL
 */
export function buildCurrentWeatherUrl(
  lat: number,
  lon: number,
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius',
  windSpeedUnit: 'kmh' | 'mph' | 'ms' | 'kn' = 'kmh'
): string {
  const baseUrl = 'https://api.open-meteo.com/v1/forecast'

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature,windspeed,is_day,weathercode',
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit,
    timezone: 'auto'
  })

  return `${baseUrl}?${params.toString()}`
}

/**
 * Fetch current weather from Open-Meteo API
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @param temperatureUnit - Temperature unit (celsius or fahrenheit)
 * @param windSpeedUnit - Wind speed unit (kmh, mph, ms, kn)
 * @returns Promise with current weather data
 * @throws Error if fetch fails or returns invalid data
 */
export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius',
  windSpeedUnit: 'kmh' | 'mph' | 'ms' | 'kn' = 'kmh'
): Promise<CurrentWeatherResponse> {
  const url = buildCurrentWeatherUrl(lat, lon, temperatureUnit, windSpeedUnit)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Open-Meteo API returned ${response.status}: ${response.statusText}`
    )
  }

  const data: CurrentWeatherResponse = await response.json()

  // Validate response has required fields
  if (!data.current || typeof data.current.temperature !== 'number') {
    throw new Error('Invalid API response: missing current weather data')
  }

  if (typeof data.current.weathercode !== 'number') {
    throw new Error('Invalid API response: missing weather code')
  }

  return data
}
