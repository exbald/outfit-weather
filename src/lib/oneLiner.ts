import type { TemperatureBucket, WeatherModifier } from './outfitLogic'

/**
 * One-liner templates for different weather conditions
 * Organized by temperature bucket with variations for variety
 */
const ONE_LINER_TEMPLATES: Record<
  TemperatureBucket,
  {
    default: string[]
    rain: string[]
    snow: string[]
    wind: string[]
  }
> = {
  extreme_freezing: {
    default: [
      "DANGEROUSLY COLD - Stay inside! ⚠️",
      "Extreme cold - life-threatening temps! 🥶",
      "Arctic blast - do not go outside! ❄️",
      "Dangerously freezing - limit exposure!",
      "Extreme cold warning - stay warm!"
    ],
    rain: [
      "FREEZING RAIN - EXTREME DANGER! ⚠️🧊",
      "Life-threatening ice storm - stay inside!",
      "Dangerous freezing rain - avoid travel!",
      "Extreme cold + ice = deadly!",
      "Stay indoors - freezing rain!"
    ],
    snow: [
      "Blizzard conditions - stay inside! ❄️⚠️",
      "Extreme snow storm - dangerous!",
      "Arctic blizzard - do not travel!",
      "Heavy snow + extreme cold - deadly!",
      "Stay home - extreme winter storm!"
    ],
    wind: [
      "ARCTIC BLAST - Deadly wind chill! ⚠️",
      "Extreme wind chill - stay inside!",
      "Dangerous arctic winds - life-threatening!",
      "Deadly wind chill - avoid exposure!",
      "Extreme cold + wind = dangerous!"
    ]
  },
  freezing: {
    default: [
      "Bundle up! It's freezing out there! 🥶",
      "Heavy coat weather - stay warm! ❄️",
      "Brace yourself, it's bitter cold!",
      "Time for the warmest layers you've got! 🧥",
      "Freezing temps - don't forget your gloves! 🧤"
    ],
    rain: [
      "Freezing rain - ice alert! 🧊",
      "Dress warm and watch for ice!",
      "Heavy coat plus rain gear today! 🧥☂️",
      "Freezing rain - be extra careful!",
      "Cold and wet - full winter gear!"
    ],
    snow: [
      "Snow day! Full winter gear! ❄️",
      "Perfect for building snowmen! ⛄",
      "Bundle up for the snow! 🧣",
      "Winter wonderland day! Stay cozy!",
      "Snowy and freezing - max layers!"
    ],
    wind: [
      "Freezing with wind chill - brrr! 🌬️",
      "Windproof coat essential today!",
      "Arctic blast - cover all exposed skin!",
      "Wind cuts through everything - bundle up!",
      "Freezing wind - face mask recommended!"
    ]
  },

  cold: {
    default: [
      "Pretty chilly - coat weather! 🧥",
      "Cool day, keep that jacket on!",
      "Brisk weather - perfect for layers!",
      "Cold enough for a warm coat!",
      "Chilly vibes - dress warmly!"
    ],
    rain: [
      "Cold and rainy - umbrella time! ☔",
      "Wet and chilly - stay dry!",
      "Raincoat over your warm coat!",
      "Cold rain - waterproof boots needed!",
      "Gloves recommended, it's cold rain!"
    ],
    snow: [
      "Snow in the air - winter is here! ❄️",
      "Light snow - coat and scarf!",
      "First snow vibes - time for hot cocoa! ☕",
      "Snow flurries - perfect winter day!",
      "Cold with snow - cozy up!"
    ],
    wind: [
      "Wind makes it feel colder! 🌬️",
      "Windbreaker over your coat!",
      "Brisk and blustery - hold onto your hat!",
      "Chilly wind - layer up!",
      "Wind chill in effect - bundle up!"
    ]
  },

  cool: {
    default: [
      "Nice and cool - light jacket! 🧥",
      "Perfect weather for a walk! 🚶",
      "Crisp and comfortable - enjoy!",
      "Light layers today!",
      "Cool temps - great outdoor weather!"
    ],
    rain: [
      "Cool rain - jacket and umbrella! 🌧️",
      "Light jacket, don't forget the umbrella!",
      "Rainy but not too cold!",
      "Perfect weather for a rainy walk! ☔",
      "Cool showers - bring an umbrella!"
    ],
    snow: [
      "Surprise snow! Grab a coat! ❄️",
      "Light snow - unusual but fun!",
      "Cold snap with flurries!",
      "Snow in cool weather - interesting!",
      "Unseasonable snow - stay warm!"
    ],
    wind: [
      "Breezy and cool - nice! 🌬️",
      "Light jacket for the wind!",
      "Pleasant breeze - enjoy it!",
      "Windy but nice out!",
      "Cool breeze - perfect day!"
    ]
  },

  mild: {
    default: [
      "Mild and pleasant - great day! 😊",
      "Perfect weather - not too hot, not too cold!",
      "Ideal temps for anything! 🌤️",
      "Comfortable and mild - enjoy!",
      "Goldilocks weather - just right!"
    ],
    rain: [
      "Mild rain - light jacket works! 🌦️",
      "Comfortable rain - light layers!",
      "Mild with showers - nice!",
      "Perfect weather, just rainy! ☔",
      "Mild and wet - not bad!"
    ],
    snow: [
      "Rare snow in mild weather! ❄️",
      "Unusual snow flurries!",
      "Mild going cold - snow possible!",
      "Snow in mild temps - grab a light coat!",
      "Surprise flakes - interesting weather!"
    ],
    wind: [
      "Nice breeze in mild weather! 🌬️",
      "Pleasantly windy - great!",
      "Breezy and comfortable!",
      "Mild with a nice wind!",
      "Perfect breeze - enjoy it!"
    ]
  },

  warm: {
    default: [
      "Warm and nice - t-shirt weather! 👕",
      "Beautiful warm day! ☀️",
      "Perfect for shorts! 🩳",
      "Enjoy the warmth!",
      "Lovely warm weather!"
    ],
    rain: [
      "Warm rain - tropical vibes! 🌴",
      "Warm and wet - still nice!",
      "Tropical rain - warm showers!",
      "Rain but warm out! 🌦️",
      "Warm rain - interesting weather!"
    ],
    snow: [
      "Snow in warm weather? Rare! ❄️",
      "Very unusual snow!",
      "Warm day with snow flurries!",
      "Crazy weather - warm but snowing!",
      "Wild weather patterns!"
    ],
    wind: [
      "Warm breeze - beach vibes! 🏖️",
      "Nice wind on a warm day!",
      "Breezy and warm - perfect!",
      "Warm with a nice breeze! 🌬️",
      "Great day for a breeze!"
    ]
  },

  hot: {
    default: [
      "Hot day - stay cool! 🔥",
      "Summer vibes - dress light! 😎",
      "Scorching - minimal layers!",
      "Heat wave - drink water! 💧",
      "Blazing hot - stay in the AC! ❄️"
    ],
    rain: [
      "Hot rain - steamy out! 🌦️",
      "Warm rain on a hot day!",
      "Tropical storm vibes! 🌴",
      "Hot and wet - muggy!",
      "Steamy rain - umbrella helps!"
    ],
    snow: [
      "Snow in hot weather? Impossible! ❄️",
      "Weather going crazy!",
      "Hot with snow? Unbelievable!",
      "Extreme weather swing!",
      "What is happening?!"
    ],
    wind: [
      "Hot wind - like a hairdryer! 🌬️",
      "Warm breeze on a hot day!",
      "Hot and windy - still warm!",
      "Blowing hot air - literally!",
      "Wind just adds heat!"
    ]
  },

  extreme_hot: {
    default: [
      "EXTREME HEAT - Stay hydrated! ⚠️💧",
      "Dangerous heat - limit outdoor activity! 🔥",
      "Extreme heat warning - seek AC! ❄️",
      "Life-threatening heat - stay cool!",
      "Extreme temperatures - stay indoors!"
    ],
    rain: [
      "EXTREME HEAT + Rain - Sauna day! 🌡️⚠️",
      "Dangerous heat with rain - muggy!",
      "Extreme heat plus rain - brutal!",
      "Hot, wet, and dangerous!",
      "Stay cool - extreme heat warning!"
    ],
    snow: [
      "Extreme heat with snow? Impossible! 🤯",
      "Weather going absolutely crazy!",
      "What is happening? Extreme weather!",
      "Cannot compute - physics broken!",
      "Parallel universe weather!"
    ],
    wind: [
      "EXTREME HEAT + Wind - Oven! 🔥🌬️⚠️",
      "Dangerous heat + wind = blowtorch!",
      "Extreme heat wind - deadly!",
      "Like a furnace - stay inside!",
      "Extreme convection oven weather!"
    ]
  }
}

/**
 * Special one-liners for extreme UV index during daytime
 */
const UV_ONE_LINERS = {
  moderate: [
    "Don't forget sunscreen! ☀️",
    "Sunscreen time! 🧴",
    "UV picking up - protect your skin!"
  ],
  high: [
    "High UV - sunscreen essential! ☀️",
    "Strong sun today - cover up!",
    "UV levels high - be careful!"
  ],
  extreme: [
    "Extreme UV - stay in shade! ⚠️",
    "Dangerous UV levels - limit sun exposure!",
    "Sun is intense - seek shade! 🌳"
  ]
}

/**
 * One-liners for specific weather codes (context-aware)
 * Only for truly special conditions that override temperature-based messages
 */
const WEATHER_CODE_ONE_LINERS: Record<number, string[]> = {
  // Thunderstorms (these override temperature-based messages)
  95: ["Thunderstorm possible - stay indoors! ⛈️"],
  96: ["Thunderstorm with hail - stay safe! ⛈️🧊"],
  99: ["Severe thunderstorm - take cover! ⛈️"],

  // Fog (these override temperature-based messages)
  45: ["Foggy out - drive safe! 🌫️"],
  48: ["Dense fog - visibility low! 🌫️"]
}

/**
 * Get a random one-liner from an array
 * Uses a simple hash based on the current time to ensure variety
 */
function getRandomOneLiner(options: string[]): string {
  // Use current time to ensure variety across calls
  const timeBasedSeed = Math.floor(Date.now() / 60000) // Changes every minute
  const index = timeBasedSeed % options.length
  return options[index]
}

/**
 * Generate a friendly one-liner based on weather conditions
 *
 * @param bucket - Temperature bucket (freezing, cold, cool, mild, warm, hot)
 * @param modifier - Weather modifier (rain, snow, wind, none)
 * @param uvCategory - UV index category (low, moderate, high, extreme)
 * @param isDay - 1 for daytime, 0 for nighttime (affects UV recommendations)
 * @param weatherCode - Open-Meteo weather code for special conditions
 * @returns A friendly, context-aware one-liner
 *
 * @example
 * ```ts
 * generateOneLiner('freezing', 'snow', 'low', 1, 71)
 * // "Snow day! Full winter gear! ❄️"
 *
 * generateOneLiner('mild', 'none', 'high', 1, 0)
 * // "Perfect weather - not too hot, not too cold! Don't forget sunscreen! ☀️"
 *
 * generateOneLiner('hot', 'none', 'extreme', 1, 0)
 * // "Hot day - stay cool! 🔥 Extreme UV - stay in shade! ⚠️"
 * ```
 */
export function generateOneLiner(
  bucket: TemperatureBucket,
  modifier: WeatherModifier,
  uvCategory: 'low' | 'moderate' | 'high' | 'extreme' = 'low',
  isDay: number = 1,
  weatherCode: number = 0
): string {
  // Check for special weather code one-liners first (thunderstorms, fog, etc.)
  const specialOneLiners = WEATHER_CODE_ONE_LINERS[weatherCode]
  if (specialOneLiners && specialOneLiners.length > 0) {
    return getRandomOneLiner(specialOneLiners)
  }

  // Get base one-liner based on temperature bucket and weather modifier
  const bucketTemplates = ONE_LINER_TEMPLATES[bucket]

  let baseOneLiner: string
  if (modifier === 'rain' && bucketTemplates.rain.length > 0) {
    baseOneLiner = getRandomOneLiner(bucketTemplates.rain)
  } else if (modifier === 'snow' && bucketTemplates.snow.length > 0) {
    baseOneLiner = getRandomOneLiner(bucketTemplates.snow)
  } else if (modifier === 'wind' && bucketTemplates.wind.length > 0) {
    baseOneLiner = getRandomOneLiner(bucketTemplates.wind)
  } else {
    baseOneLiner = getRandomOneLiner(bucketTemplates.default)
  }

  // Add UV advice during daytime for moderate+ UV
  // Only append if it doesn't make the message too long (max 120 chars)
  if (isDay === 1 && uvCategory !== 'low') {
    const uvOneLiners = UV_ONE_LINERS[uvCategory]
    const uvAdvice = getRandomOneLiner(uvOneLiners)

    // Only combine if total length is reasonable
    if (baseOneLiner.length + uvAdvice.length + 2 <= 120) {
      return `${baseOneLiner} ${uvAdvice}`
    }
  }

  return baseOneLiner
}

/**
 * Get a simple one-liner for fallback/error states
 */
export function getFallbackOneLiner(): string {
  const fallbacks = [
    "Check outside! 🤷",
    "Weather's looking interesting!",
    "Step outside and see!",
    "Expect the unexpected!",
    "Weather happens!"
  ]
  return getRandomOneLiner(fallbacks)
}
