/**
 * Open-Meteo API Client
 * Fetches weather data from Open-Meteo API (free, no authentication required)
 * Documentation: https://open-meteo.com/en/docs
 */

/**
 * Weather condition with human-readable description and emoji icon
 */
export interface WeatherCondition {
  /** Human-readable description (e.g., "Clear sky", "Partly cloudy") */
  description: string
  /** Emoji icon representing the condition */
  icon: string
  /** Category for outfit logic (clear, cloudy, precipitation, extreme) */
  category: 'clear' | 'cloudy' | 'precipitation' | 'extreme'
}

/**
 * Open-Meteo Weather Code documentation:
 * https://open-meteo.com/en/docs
 *
 * Codes are mapped to human-readable conditions and emoji icons
 */
export const WEATHER_CODE_MAP: Record<number, WeatherCondition> = {
  // 0: Clear sky
  0: { description: 'Clear sky', icon: '☀️', category: 'clear' },

  // 1, 2, 3: Mainly clear, partly cloudy, and overcast
  1: { description: 'Mainly clear', icon: '🌤️', category: 'clear' },
  2: { description: 'Partly cloudy', icon: '⛅', category: 'cloudy' },
  3: { description: 'Overcast', icon: '☁️', category: 'cloudy' },

  // 45, 48: Fog
  45: { description: 'Fog', icon: '🌫️', category: 'cloudy' },
  48: { description: 'Depositing rime fog', icon: '🌫️', category: 'cloudy' },

  // 51-55: Drizzle
  51: { description: 'Light drizzle', icon: '🌧️', category: 'precipitation' },
  53: { description: 'Moderate drizzle', icon: '🌧️', category: 'precipitation' },
  55: { description: 'Dense drizzle', icon: '🌧️', category: 'precipitation' },

  // 56, 57: Freezing drizzle
  56: { description: 'Light freezing drizzle', icon: '🌨️', category: 'precipitation' },
  57: { description: 'Dense freezing drizzle', icon: '🌨️', category: 'precipitation' },

  // 61-65: Rain
  61: { description: 'Slight rain', icon: '🌧️', category: 'precipitation' },
  63: { description: 'Moderate rain', icon: '🌧️', category: 'precipitation' },
  65: { description: 'Heavy rain', icon: '🌧️', category: 'precipitation' },

  // 66, 67: Freezing rain
  66: { description: 'Light freezing rain', icon: '🌨️', category: 'precipitation' },
  67: { description: 'Heavy freezing rain', icon: '🌨️', category: 'precipitation' },

  // 71-77: Snow
  71: { description: 'Slight snow', icon: '🌨️', category: 'precipitation' },
  73: { description: 'Moderate snow', icon: '❄️', category: 'precipitation' },
  75: { description: 'Heavy snow', icon: '❄️', category: 'precipitation' },

  // 77: Snow grains
  77: { description: 'Snow grains', icon: '❄️', category: 'precipitation' },

  // 80-82: Rain showers
  80: { description: 'Slight rain showers', icon: '🌦️', category: 'precipitation' },
  81: { description: 'Moderate rain showers', icon: '🌦️', category: 'precipitation' },
  82: { description: 'Violent rain showers', icon: '⛈️', category: 'precipitation' },

  // 85, 86: Snow showers
  85: { description: 'Slight snow showers', icon: '🌨️', category: 'precipitation' },
  86: { description: 'Heavy snow showers', icon: '❄️', category: 'precipitation' },

  // 95-99: Thunderstorm
  95: { description: 'Thunderstorm', icon: '⛈️', category: 'extreme' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️', category: 'extreme' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️', category: 'extreme' }
}

/**
 * Get weather condition description and icon from Open-Meteo weather code
 * @param weatherCode - Open-Meteo weather code (0-99)
 * @returns WeatherCondition with description, icon, and category
 */
export function getWeatherCondition(weatherCode: number): WeatherCondition {
  const condition = WEATHER_CODE_MAP[weatherCode]

  if (condition) {
    return condition
  }

  // Fallback for unknown codes - treat as cloudy with a question mark
  return {
    description: 'Unknown condition',
    icon: '❓',
    category: 'cloudy'
  }
}

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
