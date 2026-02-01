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
  /** Worst weather code during the day (from hourly data) - Feature #62 */
  weatherCodeWorst?: number
  /** Maximum wind speed during the day (from hourly data) - Feature #62 */
  windSpeedMax?: number
  /** Hourly precipitation probability max (from hourly data) - Feature #62 */
  precipitationProbabilityHourlyMax?: number
  /** Day index in the forecast (0 = today, 1 = tomorrow, 2-6 = future days) */
  dayIndex: number
  /** Human-readable day label ("Today", "Tomorrow", "Wed", etc.) */
  dayLabel: string
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
    apparent_temperature: string
    windspeed: string
    is_day: string
    weathercode: string
  }
  current: {
    time: string
    interval: number
    temperature: number
    apparent_temperature: number
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
  hourly_units: {
    time: string
    temperature_2m: string
    weathercode: string
    windspeed_10m: string
    precipitation_probability: string
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weathercode: number[]
    windspeed_10m: number[]
    precipitation_probability: number[]
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
    current: 'temperature,apparent_temperature,windspeed,is_day,weathercode',
    daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,uv_index_max',
    hourly: 'temperature_2m,weathercode,windspeed_10m,precipitation_probability',
    timezone: 'auto',
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit
  })

  return `${baseUrl}?${params.toString()}`
}

/**
 * Custom error class for weather API errors with user-friendly messages
 */
export class WeatherApiError extends Error {
  constructor(
    message: string,
    public readonly userMessage: string,
    public readonly isRetryable: boolean = true
  ) {
    super(message)
    this.name = 'WeatherApiError'
  }
}

/**
 * Map HTTP error codes to user-friendly messages
 */
function getErrorMessageForStatus(status: number, statusText: string): {
  technical: string
  user: string
  isRetryable: boolean
} {
  // 4xx errors (client errors) - typically not retryable
  if (status >= 400 && status < 500) {
    if (status === 400) {
      return {
        technical: `Bad Request: Invalid parameters (${statusText})`,
        user: 'Invalid location. Please try again.',
        isRetryable: false
      }
    }
    if (status === 404) {
      return {
        technical: `Not Found: API endpoint unavailable (${statusText})`,
        user: 'Weather service temporarily unavailable.',
        isRetryable: true
      }
    }
    if (status === 429) {
      return {
        technical: `Too Many Requests: Rate limit exceeded (${statusText})`,
        user: 'Too many requests. Please wait a moment.',
        isRetryable: true
      }
    }
    return {
      technical: `Client Error ${status}: ${statusText}`,
      user: 'Unable to fetch weather. Please try again.',
      isRetryable: false
    }
  }

  // 5xx errors (server errors) - retryable
  if (status >= 500 && status < 600) {
    return {
      technical: `Server Error ${status}: ${statusText}`,
      user: 'Weather service is having issues. Trying again...',
      isRetryable: true
    }
  }

  // Network or other errors
  return {
    technical: `HTTP ${status}: ${statusText}`,
    user: 'Unable to reach weather service.',
    isRetryable: true
  }
}

/**
 * Fetch current weather from Open-Meteo API with automatic retry on failure
 *
 * Features:
 * - Exponential backoff retry (1s, 2s, 4s, max 10s)
 * - User-friendly error messages
 * - Response validation
 * - Detailed logging for debugging
 *
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @param temperatureUnit - Temperature unit (celsius or fahrenheit)
 * @param windSpeedUnit - Wind speed unit (kmh, mph, ms, kn)
 * @param retryConfig - Optional retry configuration
 * @returns Promise with current weather data
 * @throws WeatherApiError if fetch fails or returns invalid data
 */
export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius',
  windSpeedUnit: 'kmh' | 'mph' | 'ms' | 'kn' = 'kmh',
  retryConfig?: RetryConfig
): Promise<CurrentWeatherResponse> {
  const url = buildCurrentWeatherUrl(lat, lon, temperatureUnit, windSpeedUnit)

  try {
    // Wrap the fetch in retry logic with exponential backoff
    const data = await retryWithBackoff(async () => {
      const response = await fetch(url)

      if (!response.ok) {
        const errorInfo = getErrorMessageForStatus(response.status, response.statusText)
        throw new WeatherApiError(
          errorInfo.technical,
          errorInfo.user,
          errorInfo.isRetryable
        )
      }

      return response.json()
    }, retryConfig)

    // Validate response has required fields
    if (!data.current || typeof data.current.temperature !== 'number') {
      throw new WeatherApiError(
        'Invalid API response: missing current weather data',
        'Received invalid weather data. Please try again.',
        true
      )
    }

    if (typeof data.current.weathercode !== 'number') {
      throw new WeatherApiError(
        'Invalid API response: missing weather code',
        'Received incomplete weather data. Please try again.',
        true
      )
    }

    // Validate daily data exists
    if (!data.daily || !Array.isArray(data.daily.time)) {
      throw new WeatherApiError(
        'Invalid API response: missing daily forecast data',
        'Unable to load forecast. Please try again.',
        true
      )
    }

    return data
  } catch (error) {
    // Re-throw WeatherApiError as-is
    if (error instanceof WeatherApiError) {
      throw error
    }

    // Wrap network errors (TypeError: fetch failed, etc.)
    if (error instanceof TypeError) {
      throw new WeatherApiError(
        `Network error: ${error.message}`,
        'No internet connection. Please check your network.',
        true
      )
    }

    // Wrap unknown errors
    throw new WeatherApiError(
      `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      'Something went wrong. Please try again.',
      true
    )
  }
}

/**
 * Parse daily forecast data and extract up to 7 days
 * Also calculates worst weather conditions from hourly data - Feature #62
 * @param dailyData - Daily data array from Open-Meteo API
 * @param hourlyData - Hourly data array from Open-Meteo API
 * @returns Object with days array and today/tomorrow aliases for backward compatibility
 * @throws Error if daily data is invalid
 */
export function parseDailyForecast(
  dailyData: CurrentWeatherResponse['daily'],
  hourlyData: CurrentWeatherResponse['hourly']
): {
  days: DailyWeatherData[]
  today: DailyWeatherData
  tomorrow: DailyWeatherData
} {
  if (!dailyData.time || dailyData.time.length < 2) {
    throw new Error('Invalid daily data: insufficient days')
  }

  if (!hourlyData.time || hourlyData.time.length < 24) {
    throw new Error('Invalid hourly data: insufficient hours')
  }

  // Import day labels dynamically to avoid circular dependency
  const getDayLabel = (dayIndex: number, date: string): string => {
    if (dayIndex === 0) return 'Today'
    if (dayIndex === 1) return 'Tomorrow'
    const dateObj = new Date(date)
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return weekdays[dateObj.getDay()]
  }

  // Helper function to find worst weather for a day - Feature #62
  const findWorstWeatherForDay = (dayDate: string) => {
    // Find hourly indices that belong to this day
    const dayStart = dayDate.split('T')[0]
    const hourlyIndices: number[] = []

    for (let i = 0; i < hourlyData.time.length; i++) {
      if (hourlyData.time[i].startsWith(dayStart)) {
        hourlyIndices.push(i)
      }
    }

    if (hourlyIndices.length === 0) {
      console.warn(`[parseDailyForecast] No hourly data found for day: ${dayDate}`)
      return {
        weatherCodeWorst: undefined,
        windSpeedMax: undefined,
        precipitationProbabilityHourlyMax: undefined
      }
    }

    // Find worst weather code (prioritize precipitation > extreme > cloudy > clear)
    // Weather code categories: clear (0-3), cloudy (45-48), precipitation (51-86), extreme (95-99)
    const weatherCodeCategoryPriority = (code: number): number => {
      if (code >= 95) return 4 // extreme (thunderstorm)
      if (code >= 51) return 3 // precipitation
      if (code >= 45) return 2 // fog/cloudy
      return 1 // clear/cloudy
    }

    let worstWeatherCode = hourlyData.weathercode[hourlyIndices[0]]
    let maxWindSpeed = hourlyData.windspeed_10m[hourlyIndices[0]]
    let maxPrecipitationProb = hourlyData.precipitation_probability[hourlyIndices[0]]

    for (const idx of hourlyIndices) {
      const weatherCode = hourlyData.weathercode[idx]
      const windSpeed = hourlyData.windspeed_10m[idx]
      const precipProb = hourlyData.precipitation_probability[idx]

      // Update worst weather code based on category priority
      if (weatherCodeCategoryPriority(weatherCode) > weatherCodeCategoryPriority(worstWeatherCode)) {
        worstWeatherCode = weatherCode
      }

      // Update max wind speed
      if (windSpeed > maxWindSpeed) {
        maxWindSpeed = windSpeed
      }

      // Update max precipitation probability
      if (precipProb > maxPrecipitationProb) {
        maxPrecipitationProb = precipProb
      }
    }

    return {
      weatherCodeWorst: worstWeatherCode,
      windSpeedMax: maxWindSpeed,
      precipitationProbabilityHourlyMax: maxPrecipitationProb
    }
  }

  // Extract up to 7 days (or fewer if API returns less)
  const numDays = Math.min(dailyData.time.length, 7)
  const days: DailyWeatherData[] = []

  for (let i = 0; i < numDays; i++) {
    const worstWeather = findWorstWeatherForDay(dailyData.time[i])

    days.push({
      time: dailyData.time[i],
      temperatureMax: dailyData.temperature_2m_max[i],
      temperatureMin: dailyData.temperature_2m_min[i],
      weatherCode: dailyData.weathercode[i],
      precipitationProbabilityMax: dailyData.precipitation_probability_max[i],
      uvIndexMax: dailyData.uv_index_max[i],
      dayIndex: i,
      dayLabel: getDayLabel(i, dailyData.time[i]),
      ...worstWeather
    })
  }

  // Return with backward-compatible aliases
  return {
    days,
    today: days[0],
    tomorrow: days[1]
  }
}

/**
 * Response from BigDataCloud Reverse Geocoding API
 * Documentation: https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api
 */
export interface BigDataCloudReverseGeocodeResponse {
  latitude: number
  longitude: number
  lookupSource: string
  localityLanguageRequested: string
  continent: string
  continentCode: string
  countryName: string
  countryCode: string
  principalSubdivision: string
  principalSubdivisionCode: string
  city: string
  locality: string
  postcode: string
  plusCode: string
  fips: {
    state: string
    county: string
    countySubdivision: string
    place: string
  }
  localityInfo: {
    administrative: Array<{
      name: string
      description: string
      isoName: string
      order: number
      adminLevel: number
      isoCode?: string
      wikidataId: string
      geonameId: number
    }>
    informative: Array<{
      name: string
      description?: string
      isoName?: string
      order: number
      isoCode?: string
      wikidataId?: string
    }>
  }
}

/**
 * Build BigDataCloud Reverse Geocoding API URL
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns BigDataCloud API URL
 */
export function buildReverseGeocodingUrl(lat: number, lon: number): string {
  const baseUrl = 'https://api.bigdatacloud.net/data/reverse-geocode-client'
  return `${baseUrl}?latitude=${lat}&longitude=${lon}&localityLanguage=en`
}

/**
 * Fetch location name (city) from coordinates using reverse geocoding
 *
 * Uses BigDataCloud's free reverse geocoding API which requires no authentication.
 * This API is designed for client-side use and has unlimited queries.
 *
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns Promise with location name (e.g., "San Francisco, CA" or "London")
 * @throws WeatherApiError if fetch fails or returns invalid data
 */
export async function fetchLocationName(
  lat: number,
  lon: number
): Promise<string> {
  const url = buildReverseGeocodingUrl(lat, lon)

  console.log('[ReverseGeocoding] Fetching location name for:', { lat, lon })

  try {
    const data = await retryWithBackoff(async () => {
      const response = await fetch(url)

      if (!response.ok) {
        const errorInfo = getErrorMessageForStatus(response.status, response.statusText)
        throw new WeatherApiError(
          errorInfo.technical,
          errorInfo.user,
          errorInfo.isRetryable
        )
      }

      return response.json() as Promise<BigDataCloudReverseGeocodeResponse>
    })

    // Validate response has required city field
    if (!data.city) {
      console.warn('[ReverseGeocoding] No city found in response:', { lat, lon })
      // Return empty string to indicate no location name found
      return ''
    }

    // Build location name from city and principalSubdivision (state/province)
    let locationName = data.city

    // Add state/province if available and different from city name
    if (data.principalSubdivision && data.principalSubdivision !== data.city) {
      locationName += `, ${data.principalSubdivision}`
    }

    console.log('[ReverseGeocoding] Location name found:', locationName)

    return locationName
  } catch (error) {
    // Re-throw WeatherApiError as-is
    if (error instanceof WeatherApiError) {
      throw error
    }

    // Wrap network errors
    if (error instanceof TypeError) {
      throw new WeatherApiError(
        `Network error: ${error.message}`,
        'No internet connection. Please check your network.',
        true
      )
    }

    // Wrap unknown errors
    throw new WeatherApiError(
      `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      'Something went wrong. Please try again.',
      true
    )
  }
}
