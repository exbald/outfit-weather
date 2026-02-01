/**
 * OpenRouter API Client
 * Generates AI-powered outfit recommendations based on weather conditions
 */

/**
 * AI-generated outfit recommendation response
 */
export interface AIOutfitResponse {
  /** Outfit emojis (e.g., "🧥👕👖👟") */
  emojis: string
  /** Friendly one-liner about the weather/outfit */
  oneLiner: string
}

/**
 * Weather context for generating outfit recommendations
 */
export interface WeatherContext {
  /** Which view this context is for (now, today, tomorrow, or weekday name) */
  view: string
  /** Current or representative temperature */
  temperature: number
  /** High temperature for the day (for today/tomorrow views) */
  temperatureHigh?: number
  /** Low temperature for the day (for today/tomorrow views) */
  temperatureLow?: number
  temperatureUnit: 'C' | 'F'
  /** Main weather condition description */
  condition: string
  /** Worst expected weather condition (for today/tomorrow views) */
  worstCondition?: string
  /** Wind speed */
  windSpeed: number
  /** Max wind speed for the day (for today/tomorrow views) */
  windSpeedMax?: number
  /** UV index */
  uvIndex: number
  /** Precipitation probability (0-100) */
  precipitationProbability?: number
  /** Is it daytime */
  isDay: boolean
}

/**
 * OpenRouter API configuration
 */
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const REQUEST_TIMEOUT_MS = 5000

/**
 * Get OpenRouter API key from environment
 * @returns API key or null if not configured
 */
function getApiKey(): string | null {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!key || key === 'your_api_key_here') {
    return null
  }
  return key
}

/**
 * Get OpenRouter model from environment
 * @returns Model ID or default
 */
function getModel(): string {
  return import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4o-mini'
}

/**
 * Build the system prompt for outfit recommendations
 */
function buildSystemPrompt(): string {
  return `You are an outfit recommendation assistant. Based on weather conditions, suggest appropriate clothing.

Your response MUST be valid JSON with exactly two fields:
1. "emojis": A string of 4-6 UNIQUE clothing emojis (e.g., "🧥👕👖👟")
2. "oneLiner": A short, friendly message about the outfit (max 60 chars)

CRITICAL: Never repeat the same emoji twice in the emojis string. Each emoji must appear exactly once.

Base outfit by temperature (pick ONE set):
- Freezing/Cold (below 10°C): 🧥👕👖🥾 (coat, shirt, pants, boots)
- Cool (10-18°C): 🧥👕👖👟 (light jacket, shirt, pants, sneakers)
- Mild (18-22°C): 👕👖👟 (shirt, pants, sneakers)
- Warm (22-27°C): 👕👖👟 (shirt, pants, sneakers)
- Hot (above 27°C): 👕🩳👟 (t-shirt, shorts, sneakers)

Conditional modifiers (add IF needed AND not already in outfit):
- Rain/precipitation >30%: Add ☂️ (umbrella)
- Snow: Add 🧣 (scarf) if not present, 🧤 (gloves) if not present
- UV ≥3 (daytime): Add 🕶️ (sunglasses)
- UV ≥6 (daytime): Add 🧢 (hat/cap) if not already in outfit
- Wind ≥15 km/h + cool/mild temps: Ensure 🧥 (jacket) is present

IMPORTANT: Count your emojis - use 4-6 total, each unique.

One-liner guidelines:
- Keep it short and friendly (max 60 chars)
- Reference the weather condition naturally
- Be encouraging and helpful
- Vary your responses - don't be repetitive`
}

/**
 * Build the user prompt with weather context
 */
function buildUserPrompt(context: WeatherContext): string {
  const unit = context.temperatureUnit

  // Build view-specific prompt
  if (context.view === 'now') {
    const tempDisplay = `${Math.round(context.temperature)}°${unit}`
    const dayNight = context.isDay ? 'daytime' : 'evening'

    return `Right now:
- Temperature: ${tempDisplay}
- Condition: ${context.condition}
- Wind: ${Math.round(context.windSpeed)} km/h
- UV Index: ${context.uvIndex}
- Time: ${dayNight}

What should I wear right now?`
  }

  // For today/tomorrow, provide full day context
  const viewLabel = context.view === 'today' ? 'Today' : 'Tomorrow'
  const highTemp = context.temperatureHigh ?? context.temperature
  const lowTemp = context.temperatureLow ?? context.temperature

  let prompt = `${viewLabel}'s forecast:
- Temperature: High ${Math.round(highTemp)}°${unit}, Low ${Math.round(lowTemp)}°${unit}
- Main condition: ${context.condition}`

  // Add worst weather if different from main condition
  if (context.worstCondition && context.worstCondition !== context.condition) {
    prompt += `\n- Expected later: ${context.worstCondition}`
  }

  // Add precipitation probability if significant
  if (context.precipitationProbability !== undefined && context.precipitationProbability > 20) {
    prompt += `\n- Rain chance: ${context.precipitationProbability}%`
  }

  // Add wind info
  const windToShow = context.windSpeedMax ?? context.windSpeed
  prompt += `\n- Wind: up to ${Math.round(windToShow)} km/h`

  // Add UV
  prompt += `\n- UV Index: ${context.uvIndex}`

  prompt += `\n\nWhat should I wear ${context.view}? Consider the WORST conditions expected.`

  return prompt
}

/**
 * Deduplicate emojis in a string while preserving order
 * @param emojis - String of emojis that may contain duplicates
 * @returns String with unique emojis only
 */
function deduplicateEmojis(emojis: string): string {
  // Use Array.from to properly handle multi-codepoint emojis
  const emojiArray = Array.from(emojis)
  const seen = new Set<string>()
  const unique: string[] = []

  for (const emoji of emojiArray) {
    // Skip whitespace
    if (emoji.trim() === '') continue

    if (!seen.has(emoji)) {
      seen.add(emoji)
      unique.push(emoji)
    }
  }

  return unique.join('')
}

/**
 * Parse and validate AI response
 * @param content - Raw response content from AI
 * @returns Parsed AIOutfitResponse or null if invalid
 */
function parseAIResponse(content: string): AIOutfitResponse | null {
  try {
    // Try to extract JSON from the response (in case of markdown code blocks)
    let jsonStr = content.trim()

    // Handle markdown code blocks
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim()
    }

    const parsed = JSON.parse(jsonStr)

    // Validate required fields
    if (typeof parsed.emojis !== 'string' || parsed.emojis.length === 0) {
      console.warn('[OpenRouter] Invalid response: missing or empty emojis')
      return null
    }

    if (typeof parsed.oneLiner !== 'string' || parsed.oneLiner.length === 0) {
      console.warn('[OpenRouter] Invalid response: missing or empty oneLiner')
      return null
    }

    // Deduplicate emojis (safety net in case AI returns duplicates)
    const emojis = deduplicateEmojis(parsed.emojis)

    // Truncate oneLiner if too long
    const oneLiner = parsed.oneLiner.length > 80
      ? parsed.oneLiner.substring(0, 77) + '...'
      : parsed.oneLiner

    return {
      emojis,
      oneLiner
    }
  } catch (error) {
    console.warn('[OpenRouter] Failed to parse response:', error)
    return null
  }
}

/**
 * Generate outfit recommendation using OpenRouter API
 *
 * @param context - Weather context for the recommendation
 * @returns AIOutfitResponse or null if request fails
 *
 * @example
 * ```ts
 * const result = await generateOutfitRecommendation({
 *   temperature: 16,
 *   temperatureUnit: 'C',
 *   condition: 'Partly cloudy',
 *   windSpeed: 11,
 *   uvIndex: 3,
 *   isDay: true
 * })
 * // { emojis: "🧥👕👖👟", oneLiner: "Perfect for a light jacket!" }
 * ```
 */
export async function generateOutfitRecommendation(
  context: WeatherContext
): Promise<AIOutfitResponse | null> {
  const apiKey = getApiKey()

  if (!apiKey) {
    console.log('[OpenRouter] API key not configured, using static logic')
    return null
  }

  const model = getModel()
  console.log(`[OpenRouter] Generating recommendation with ${model}`)

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'OutFitWeather'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: buildUserPrompt(context) }
        ],
        max_tokens: 150,
        temperature: 0.7
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error(`[OpenRouter] API error ${response.status}:`, errorText)
      return null
    }

    const data = await response.json()

    // Extract content from OpenAI-compatible response format
    const content = data?.choices?.[0]?.message?.content
    if (!content) {
      console.warn('[OpenRouter] No content in response')
      return null
    }

    const result = parseAIResponse(content)

    if (result) {
      console.log('[OpenRouter] Generated recommendation:', result)
    }

    return result
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('[OpenRouter] Request timed out after', REQUEST_TIMEOUT_MS, 'ms')
    } else {
      console.error('[OpenRouter] Request failed:', error)
    }

    return null
  }
}

/**
 * Check if OpenRouter is configured and available
 * @returns true if API key is configured
 */
export function isOpenRouterConfigured(): boolean {
  return getApiKey() !== null
}
