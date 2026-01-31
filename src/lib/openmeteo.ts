/**
 * Open-Meteo API Client
 * Fetches weather data from Open-Meteo API (free, no authentication required)
 * Documentation: https://open-meteo.com/en/docs
 */

/**
 * Configuration for retry behavior
 */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Initial delay in milliseconds (default: 1000ms) */
  initialDelayMs?: number
  /** Backoff multiplier (default: 2 = exponential backoff) */
  backoffMultiplier?: number
  /** Maximum delay between retries in milliseconds (default: 10000ms) */
  maxDelayMs?: number
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 10000
}

/**
 * Sleep/delay utility for retry backoff
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Wrapper function to retry async operations with exponential backoff
 *
 * Retry strategy:
 * - Attempt 1: Immediate (no delay)
 * - Attempt 2: Wait 1 second (1000ms)
 * - Attempt 3: Wait 2 seconds (2000ms)
 * - Attempt 4: Wait 4 seconds (4000ms)
 * - And so on...
 *
 * @param fn - Async function to retry
 * @param config - Retry configuration options
 * @returns Result of the async function
 * @throws Error if all retries fail
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const { maxRetries, initialDelayMs, backoffMultiplier, maxDelayMs } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config
  }

  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Attempt the operation
      const result = await fn()

      // If successful and not the first attempt, log the recovery
      if (attempt > 0) {
        console.log(
          `[Retry] Operation succeeded on attempt ${attempt + 1}/${maxRetries + 1}`
        )
      }

      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry after the last attempt
      if (attempt >= maxRetries) {
        console.error(
          `[Retry] All ${maxRetries + 1} attempts failed. Final error:`,
          lastError.message
        )
        throw lastError
      }

      // Calculate delay with exponential backoff
      const delayMs = Math.min(
        initialDelayMs * Math.pow(backoffMultiplier, attempt),
        maxDelayMs
      )

      console.warn(
        `[Retry] Attempt ${attempt + 1}/${maxRetries + 1} failed: ${lastError.message}. Retrying in ${delayMs}ms...`
      )

      // Wait before retrying
      await delay(delayMs)
    }
  }

  // TypeScript exhaustiveness check - this should never be reached
  throw lastError || new Error('Retry failed with unknown error')
}

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

export interface DailyWeatherData {
  time: string // ISO date string
  temperatureMax: number
  temperatureMin: number
  weatherCode: number
  precipitationProbabilityMax: number
  uvIndexMax: number
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
  daily_units: {
    time: string
    temperature_2m_max: string
    temperature_2m_min: string
    weathercode: string
    precipitation_probability_max: string
    uv_index_max: string
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weathercode: number[]
    precipitation_probability_max: number[]
    uv_index_max: number[]
  }
}

/**
 * Build Open-Meteo API URL for fetching current weather and daily forecast
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
    daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,uv_index_max',
    timezone: 'auto',
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit
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

  // Validate daily data exists
  if (!data.daily || !Array.isArray(data.daily.time)) {
    throw new Error('Invalid API response: missing daily forecast data')
  }

  return data
}

/**
 * Parse daily forecast data and extract today and tomorrow
 * @param dailyData - Daily data array from Open-Meteo API
 * @returns Object with today and tomorrow weather data
 * @throws Error if daily data is invalid
 */
export function parseDailyForecast(dailyData: CurrentWeatherResponse['daily']): {
  today: DailyWeatherData
  tomorrow: DailyWeatherData
} {
  if (!dailyData.time || dailyData.time.length < 2) {
    throw new Error('Invalid daily data: insufficient days')
  }

  // Extract today (index 0) and tomorrow (index 1)
  const today: DailyWeatherData = {
    time: dailyData.time[0],
    temperatureMax: dailyData.temperature_2m_max[0],
    temperatureMin: dailyData.temperature_2m_min[0],
    weatherCode: dailyData.weathercode[0],
    precipitationProbabilityMax: dailyData.precipitation_probability_max[0],
    uvIndexMax: dailyData.uv_index_max[0]
  }

  const tomorrow: DailyWeatherData = {
    time: dailyData.time[1],
    temperatureMax: dailyData.temperature_2m_max[1],
    temperatureMin: dailyData.temperature_2m_min[1],
    weatherCode: dailyData.weathercode[1],
    precipitationProbabilityMax: dailyData.precipitation_probability_max[1],
    uvIndexMax: dailyData.uv_index_max[1]
  }

  return { today, tomorrow }
}
