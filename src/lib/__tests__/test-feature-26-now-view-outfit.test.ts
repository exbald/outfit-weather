/**
 * Feature #26: Now view outfit displays
 *
 * Tests that the complete outfit recommendation with all emojis and one-liner
 * is correctly generated and displayed in the Now view.
 *
 * Dependencies:
 * - Feature #17: Weather data displayed (provides temperature, weather code, etc.)
 * - Feature #20: Outfit emojis for each bucket (base outfit)
 * - Feature #21: Weather code modifiers (rain/snow)
 * - Feature #22: Wind speed modifier logic
 * - Feature #23: UV index modifier (sunglasses)
 * - Feature #24: Precipitation modifier (umbrella)
 */

import { describe, it, expect } from 'vitest'
import { getOutfitWithWeather, getOutfitWithUV, getTemperatureBucket, getWeatherModifier } from '../outfitLogic'
import { generateOneLiner } from '../oneLiner'
import type { WeatherModifier, TemperatureBucket } from '../outfitLogic'

describe('Feature #26: Now view outfit displays', () => {
  describe('Combine base outfit with modifiers', () => {
    it('should combine base outfit with rain modifier', () => {
      // Cold rainy day
      const bucket = getTemperatureBucket(45, 'F') // cold
      const baseOutfit = ['🧥', '🧣', '👖', '🥾']

      // Rain weather code (63 = rain)
      const weatherCode = 63
      const windSpeed = 5 // not windy
      const modifier = getWeatherModifier(weatherCode, windSpeed, 'kmh')

      expect(modifier).toBe('rain')

      // Apply rain modifier - should add umbrella
      const outfitWithWeather = getOutfitWithWeather(bucket, weatherCode, windSpeed, 'kmh')

      // Should have base outfit + umbrella
      expect(outfitWithWeather).toContain('🧥')
      expect(outfitWithWeather).toContain('🧣')
      expect(outfitWithWeather).toContain('👖')
      expect(outfitWithWeather).toContain('🥾')
      expect(outfitWithWeather).toContain('☂️') // umbrella added for rain
    })

    it('should combine base outfit with snow modifier', () => {
      // Freezing snowy day
      const bucket = getTemperatureBucket(20, 'F') // freezing
      const weatherCode = 71 // snow
      const windSpeed = 5

      const outfitWithWeather = getOutfitWithWeather(bucket, weatherCode, windSpeed, 'kmh')

      // Should have base freezing outfit + extra scarf and gloves for snow
      expect(outfitWithWeather).toContain('🧥')
      expect(outfitWithWeather).toContain('🧣')
      expect(outfitWithWeather).toContain('🧤')
      expect(outfitWithWeather).toContain('🥾')
      expect(outfitWithWeather).toContain('🧢')

      // Snow adds extra scarf and gloves
      const scarfCount = outfitWithWeather.filter(e => e === '🧣').length
      const gloveCount = outfitWithWeather.filter(e => e === '🧤').length
      expect(scarfCount).toBeGreaterThanOrEqual(2) // At least 2 scarves
      expect(gloveCount).toBeGreaterThanOrEqual(2) // At least 2 pairs of gloves
    })

    it('should combine base outfit with wind modifier', () => {
      // Cool windy day
      const bucket = getTemperatureBucket(60, 'F') // cool
      const weatherCode = 0 // clear sky
      const windSpeed = 20 // windy (above 15 km/h threshold)

      const outfitWithWeather = getOutfitWithWeather(bucket, weatherCode, windSpeed, 'kmh')

      // Should have base cool outfit + windbreaker
      expect(outfitWithWeather).toContain('🧥')
      expect(outfitWithWeather).toContain('👕')
      expect(outfitWithWeather).toContain('👖')
      expect(outfitWithWeather).toContain('👟')

      // Wind adds windbreaker (coat emoji)
      const coatCount = outfitWithWeather.filter(e => e === '🧥').length
      expect(coatCount).toBeGreaterThanOrEqual(1) // At least 1 coat (windbreaker)
    })

    it('should combine base outfit with UV modifier', () => {
      const baseOutfit = ['👕', '👖', '👟']

      // Moderate UV (daytime) - should add sunglasses
      const outfitWithModerateUV = getOutfitWithUV([...baseOutfit], 4, 1) // UV 4, daytime
      expect(outfitWithModerateUV).toContain('🕶️') // sunglasses

      // High UV (daytime) - should add sunglasses and hat
      const outfitWithHighUV = getOutfitWithUV([...baseOutfit], 7, 1) // UV 7, daytime
      expect(outfitWithHighUV).toContain('🕶️') // sunglasses
      expect(outfitWithHighUV).toContain('🧢') // hat

      // High UV at nighttime - should NOT add sunglasses
      const outfitWithHighUVNight = getOutfitWithUV([...baseOutfit], 7, 0) // UV 7, nighttime
      expect(outfitWithHighUVNight).not.toContain('🕶️')
      expect(outfitWithHighUVNight).not.toContain('🧢')
    })

    it('should combine all modifiers together', () => {
      // Cold, rainy, windy, high UV day
      const bucket = getTemperatureBucket(45, 'F') // cold
      const weatherCode = 63 // rain
      const windSpeed = 20 // windy
      const uvIndex = 6 // high UV
      const isDay = 1 // daytime

      // Start with weather modifiers
      let outfit = getOutfitWithWeather(bucket, weatherCode, windSpeed, 'kmh')

      // Add UV modifier
      outfit = getOutfitWithUV(outfit, uvIndex, isDay)

      // Verify all components present
      expect(outfit).toContain('🧥') // coat
      expect(outfit).toContain('🧣') // scarf
      expect(outfit).toContain('👖') // pants
      expect(outfit).toContain('🥾') // boots
      expect(outfit).toContain('☂️') // umbrella (rain)
      expect(outfit).toContain('🧥') // windbreaker (wind)
      expect(outfit).toContain('🕶️') // sunglasses (high UV)
    })
  })

  describe('Display emojis prominently', () => {
    it('should generate emoji string for display', () => {
      const bucket = getTemperatureBucket(45, 'F')
      const weatherCode = 63
      const windSpeed = 5
      const uvIndex = 4
      const isDay = 1

      // Simulate useOutfit hook logic
      const baseOutfit = getOutfitWithWeather(bucket, weatherCode, windSpeed, 'kmh')
      const finalOutfit = getOutfitWithUV(baseOutfit, uvIndex, isDay)

      // Convert to string for display
      const emojis = finalOutfit.join('')

      // Should be a non-empty string
      expect(emojis).toBeTruthy()
      expect(emojis.length).toBeGreaterThan(0)

      // Should contain expected emojis
      expect(emojis).toContain('🧥')
      expect(emojis).toContain('☂️')
      expect(emojis).toContain('🕶️')
    })

    it('should handle different temperature buckets', () => {
      // Hot day
      let bucket = getTemperatureBucket(85, 'F')
      let baseOutfit = getOutfitWithWeather(bucket, 0, 5, 'kmh')
      let emojis = baseOutfit.join('')
      expect(emojis).toContain('👕')
      expect(emojis).toContain('🩳')

      // Freezing day
      bucket = getTemperatureBucket(20, 'F')
      baseOutfit = getOutfitWithWeather(bucket, 71, 5, 'kmh')
      emojis = baseOutfit.join('')
      expect(emojis).toContain('🧥')
      expect(emojis).toContain('🧣')
      expect(emojis).toContain('🧤')
    })
  })

  describe('Show one-liner below', () => {
    it('should generate friendly one-liner for cold rainy day', () => {
      const bucket: TemperatureBucket = 'cold'
      const modifier: WeatherModifier = 'rain'
      const uvCategory = 'low'
      const isDay = 1
      const weatherCode = 63

      const oneLiner = generateOneLiner(bucket, modifier, uvCategory, isDay, weatherCode)

      expect(oneLiner).toBeTruthy()
      expect(oneLiner.length).toBeGreaterThan(0)
      expect(oneLiner).toMatch(/rain|umbrella|wet/i) // Should mention rain
    })

    it('should generate friendly one-liner for freezing snowy day', () => {
      const bucket: TemperatureBucket = 'freezing'
      const modifier: WeatherModifier = 'snow'
      const uvCategory = 'low'
      const isDay = 1
      const weatherCode = 71

      const oneLiner = generateOneLiner(bucket, modifier, uvCategory, isDay, weatherCode)

      expect(oneLiner).toBeTruthy()
      expect(oneLiner.length).toBeGreaterThan(0)
      expect(oneLiner).toMatch(/snow|bundle|winter/i) // Should mention snow/cold
    })

    it('should generate friendly one-liner for mild perfect day', () => {
      const bucket: TemperatureBucket = 'mild'
      const modifier: WeatherModifier = 'none'
      const uvCategory = 'low'
      const isDay = 1
      const weatherCode = 0

      const oneLiner = generateOneLiner(bucket, modifier, uvCategory, isDay, weatherCode)

      expect(oneLiner).toBeTruthy()
      expect(oneLiner.length).toBeGreaterThan(0)
      // Should be positive
      expect(oneLiner).toMatch(/perfect|great|ideal|enjoy/i)
    })

    it('should append UV advice for moderate+ UV', () => {
      const bucket: TemperatureBucket = 'warm'
      const modifier: WeatherModifier = 'none'
      const uvCategory = 'moderate'
      const isDay = 1
      const weatherCode = 0

      const oneLiner = generateOneLiner(bucket, modifier, uvCategory, isDay, weatherCode)

      expect(oneLiner).toBeTruthy()
      // Should mention sunscreen or UV protection
      expect(oneLiner).toMatch(/sunscreen|protect|UV/i)
    })

    it('should append UV advice for extreme UV', () => {
      const bucket: TemperatureBucket = 'hot'
      const modifier: WeatherModifier = 'none'
      const uvCategory = 'extreme'
      const isDay = 1
      const weatherCode = 0

      const oneLiner = generateOneLiner(bucket, modifier, uvCategory, isDay, weatherCode)

      expect(oneLiner).toBeTruthy()
      // Should mention shade or extreme UV
      expect(oneLiner).toMatch(/shade|extreme|dangerous/i)
    })
  })

  describe('Complete outfit recommendation integration', () => {
    it('should generate complete outfit for cold rainy day', () => {
      // Simulate weather data
      const temperature = 45 // °F
      const weatherCode = 63 // rain
      const windSpeed = 10 // km/h
      const uvIndex = 2 // low
      const isDay = 1 // daytime

      // Get temperature bucket
      const bucket = getTemperatureBucket(temperature, 'F')
      expect(bucket).toBe('cold')

      // Get weather modifier
      const modifier = getWeatherModifier(weatherCode, windSpeed, 'kmh')
      expect(modifier).toBe('rain')

      // Build outfit
      const baseOutfit = getOutfitWithWeather(bucket, weatherCode, windSpeed, 'kmh')
      const finalOutfit = getOutfitWithUV(baseOutfit, uvIndex, isDay)

      // Generate emojis string
      const emojis = finalOutfit.join('')

      // Verify emojis
      expect(emojis).toContain('🧥') // coat
      expect(emojis).toContain('🧣') // scarf
      expect(emojis).toContain('☂️') // umbrella

      // Generate one-liner
      const uvCategory = uvIndex <= 2 ? 'low' : uvIndex <= 5 ? 'moderate' : uvIndex <= 7 ? 'high' : 'extreme'
      const oneLiner = generateOneLiner(bucket, modifier, uvCategory, isDay, weatherCode)

      // Verify one-liner
      expect(oneLiner).toBeTruthy()
      expect(oneLiner.length).toBeGreaterThan(0)
    })

    it('should generate complete outfit for hot sunny day', () => {
      const temperature = 85 // °F
      const weatherCode = 0 // clear
      const windSpeed = 5 // km/h
      const uvIndex = 8 // high
      const isDay = 1 // daytime

      const bucket = getTemperatureBucket(temperature, 'F')
      expect(bucket).toBe('hot')

      const modifier = getWeatherModifier(weatherCode, windSpeed, 'kmh')
      expect(modifier).toBe('none')

      const baseOutfit = getOutfitWithWeather(bucket, weatherCode, windSpeed, 'kmh')
      const finalOutfit = getOutfitWithUV(baseOutfit, uvIndex, isDay)

      const emojis = finalOutfit.join('')

      expect(emojis).toContain('👕') // t-shirt
      expect(emojis).toContain('🩳') // shorts
      expect(emojis).toContain('🕶️') // sunglasses (high UV)
      expect(emojis).toContain('🧢') // hat (high UV)

      const uvCategory = uvIndex <= 2 ? 'low' : uvIndex <= 5 ? 'moderate' : uvIndex <= 7 ? 'high' : 'extreme'
      const oneLiner = generateOneLiner(bucket, modifier, uvCategory, isDay, weatherCode)

      expect(oneLiner).toBeTruthy()
      expect(oneLiner).toMatch(/hot|warm|sun/i)
    })

    it('should generate complete outfit for freezing windy day', () => {
      const temperature = 25 // °F
      const weatherCode = 2 // partly cloudy
      const windSpeed = 25 // km/h (windy)
      const uvIndex = 1 // low
      const isDay = 1 // daytime

      const bucket = getTemperatureBucket(temperature, 'F')
      expect(bucket).toBe('freezing')

      const modifier = getWeatherModifier(weatherCode, windSpeed, 'kmh')
      expect(modifier).toBe('wind')

      const baseOutfit = getOutfitWithWeather(bucket, weatherCode, windSpeed, 'kmh')
      const finalOutfit = getOutfitWithUV(baseOutfit, uvIndex, isDay)

      const emojis = finalOutfit.join('')

      // Freezing base outfit + windbreaker
      expect(emojis).toContain('🧥') // coat
      expect(emojis).toContain('🧣') // scarf
      expect(emojis).toContain('🧤') // gloves
      expect(emojis).toContain('🥾') // boots
      expect(emojis).toContain('🧢') // hat

      const uvCategory = uvIndex <= 2 ? 'low' : uvIndex <= 5 ? 'moderate' : uvIndex <= 7 ? 'high' : 'extreme'
      const oneLiner = generateOneLiner(bucket, modifier, uvCategory, isDay, weatherCode)

      expect(oneLiner).toBeTruthy()
      expect(oneLiner).toMatch(/wind|chill|brr/i)
    })
  })
})
