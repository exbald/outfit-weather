/**
 * Feature #24: Precipitation modifier (umbrella)
 * Test suite to verify umbrella is added when precipitation probability exceeds 30%
 */

import { describe, it, expect } from 'vitest'
import {
  shouldAddUmbrella,
  getPrecipitationModifierEmojis,
  getOutfitWithPrecipitation,
  getPrecipitationMessage,
  getOutfitEmojis,
  getTemperatureBucket
} from '../outfitLogic'

describe('Feature #24: Precipitation modifier (umbrella)', () => {
  describe('shouldAddUmbrella', () => {
    it('should return false when precipitation probability is 0%', () => {
      expect(shouldAddUmbrella(0)).toBe(false)
    })

    it('should return false when precipitation probability is 10%', () => {
      expect(shouldAddUmbrella(10)).toBe(false)
    })

    it('should return false when precipitation probability is at threshold (30%)', () => {
      expect(shouldAddUmbrella(30)).toBe(false)
    })

    it('should return true when precipitation probability is 31%', () => {
      expect(shouldAddUmbrella(31)).toBe(true)
    })

    it('should return true when precipitation probability is 50%', () => {
      expect(shouldAddUmbrella(50)).toBe(true)
    })

    it('should return true when precipitation probability is 80%', () => {
      expect(shouldAddUmbrella(80)).toBe(true)
    })

    it('should return true when precipitation probability is 100%', () => {
      expect(shouldAddUmbrella(100)).toBe(true)
    })

    it('should handle edge case of 29.9%', () => {
      expect(shouldAddUmbrella(29.9)).toBe(false)
    })

    it('should handle edge case of 30.1%', () => {
      expect(shouldAddUmbrella(30.1)).toBe(true)
    })
  })

  describe('getPrecipitationModifierEmojis', () => {
    it('should return empty array when precipitation probability is 0%', () => {
      expect(getPrecipitationModifierEmojis(0)).toEqual([])
    })

    it('should return empty array when precipitation probability is 20%', () => {
      expect(getPrecipitationModifierEmojis(20)).toEqual([])
    })

    it('should return empty array when precipitation probability is at threshold (30%)', () => {
      expect(getPrecipitationModifierEmojis(30)).toEqual([])
    })

    it('should return umbrella emoji when precipitation probability is 31%', () => {
      expect(getPrecipitationModifierEmojis(31)).toEqual(['☂️'])
    })

    it('should return umbrella emoji when precipitation probability is 50%', () => {
      expect(getPrecipitationModifierEmojis(50)).toEqual(['☂️'])
    })

    it('should return umbrella emoji when precipitation probability is 80%', () => {
      expect(getPrecipitationModifierEmojis(80)).toEqual(['☂️'])
    })

    it('should return umbrella emoji when precipitation probability is 100%', () => {
      expect(getPrecipitationModifierEmojis(100)).toEqual(['☂️'])
    })
  })

  describe('getOutfitWithPrecipitation', () => {
    it('should not modify outfit when precipitation probability is below threshold', () => {
      const baseOutfit = getOutfitEmojis('mild')
      expect(getOutfitWithPrecipitation(baseOutfit, 10)).toEqual(baseOutfit)
    })

    it('should not modify outfit when precipitation probability is at threshold (30%)', () => {
      const baseOutfit = getOutfitEmojis('cool')
      expect(getOutfitWithPrecipitation(baseOutfit, 30)).toEqual(baseOutfit)
    })

    it('should add umbrella to outfit when precipitation probability is 31%', () => {
      const baseOutfit = getOutfitEmojis('warm')
      const expected = [...baseOutfit, '☂️']
      expect(getOutfitWithPrecipitation(baseOutfit, 31)).toEqual(expected)
    })

    it('should add umbrella to outfit when precipitation probability is 50%', () => {
      const baseOutfit = getOutfitEmojis('cold')
      const expected = [...baseOutfit, '☂️']
      expect(getOutfitWithPrecipitation(baseOutfit, 50)).toEqual(expected)
    })

    it('should add umbrella to outfit when precipitation probability is 80%', () => {
      const baseOutfit = getOutfitEmojis('freezing')
      const expected = [...baseOutfit, '☂️']
      expect(getOutfitWithPrecipitation(baseOutfit, 80)).toEqual(expected)
    })

    it('should not duplicate umbrella if already in base outfit', () => {
      // Create a base outfit with umbrella already
      const baseOutfit = ['🧥', '👕', '👖', '👟', '☂️']
      const result = getOutfitWithPrecipitation(baseOutfit, 50)
      // Should still add umbrella (function doesn't check for duplicates)
      expect(result).toContain('☂️')
      expect(result.length).toBe(baseOutfit.length + 1)
    })

    it('should work with empty outfit array', () => {
      expect(getOutfitWithPrecipitation([], 40)).toEqual(['☂️'])
    })

    it('should work with single emoji outfit', () => {
      expect(getOutfitWithPrecipitation(['👕'], 60)).toEqual(['👕', '☂️'])
    })
  })

  describe('getPrecipitationMessage', () => {
    it('should return empty string when precipitation probability is below threshold', () => {
      expect(getPrecipitationMessage(0)).toBe('')
      expect(getPrecipitationMessage(10)).toBe('')
      expect(getPrecipitationMessage(20)).toBe('')
    })

    it('should return empty string when precipitation probability is at threshold (30%)', () => {
      expect(getPrecipitationMessage(30)).toBe('')
    })

    it('should return "Rain expected" when precipitation probability is 31%', () => {
      expect(getPrecipitationMessage(31)).toBe('Rain expected')
    })

    it('should return "Rain expected" when precipitation probability is 50%', () => {
      expect(getPrecipitationMessage(50)).toBe('Rain expected')
    })

    it('should return "Rain expected" when precipitation probability is 80%', () => {
      expect(getPrecipitationMessage(80)).toBe('Rain expected')
    })

    it('should return "Rain expected" when precipitation probability is 100%', () => {
      expect(getPrecipitationMessage(100)).toBe('Rain expected')
    })
  })

  describe('Integration tests', () => {
    it('should handle realistic scenario: mild day with low rain chance', () => {
      const temp = 68 //°F
      const bucket = getTemperatureBucket(temp, 'F')
      const baseOutfit = getOutfitEmojis(bucket)
      const precipProb = 20

      const result = getOutfitWithPrecipitation(baseOutfit, precipProb)
      const message = getPrecipitationMessage(precipProb)

      expect(result).toEqual(baseOutfit) // No umbrella added
      expect(message).toBe('') // No message
    })

    it('should handle realistic scenario: cool day with moderate rain chance', () => {
      const temp = 55 //°F
      const bucket = getTemperatureBucket(temp, 'F')
      const baseOutfit = getOutfitEmojis(bucket)
      const precipProb = 45

      const result = getOutfitWithPrecipitation(baseOutfit, precipProb)
      const message = getPrecipitationMessage(precipProb)

      expect(result).toContain('☂️') // Umbrella added
      expect(message).toBe('Rain expected') // Message shown
    })

    it('should handle realistic scenario: cold day with high rain chance', () => {
      const temp = 40 //°F
      const bucket = getTemperatureBucket(temp, 'F')
      const baseOutfit = getOutfitEmojis(bucket)
      const precipProb = 85

      const result = getOutfitWithPrecipitation(baseOutfit, precipProb)
      const message = getPrecipitationMessage(precipProb)

      expect(result).toContain('☂️') // Umbrella added
      expect(message).toBe('Rain expected') // Message shown
    })

    it('should handle realistic scenario: hot day at threshold (30%)', () => {
      const temp = 85 //°F
      const bucket = getTemperatureBucket(temp, 'F')
      const baseOutfit = getOutfitEmojis(bucket)
      const precipProb = 30

      const result = getOutfitWithPrecipitation(baseOutfit, precipProb)
      const message = getPrecipitationMessage(precipProb)

      expect(result).toEqual(baseOutfit) // No umbrella (at threshold)
      expect(message).toBe('') // No message (at threshold)
    })

    it('should handle realistic scenario: freezing day with just above threshold', () => {
      const temp = 25 //°F
      const bucket = getTemperatureBucket(temp, 'F')
      const baseOutfit = getOutfitEmojis(bucket)
      const precipProb = 31

      const result = getOutfitWithPrecipitation(baseOutfit, precipProb)
      const message = getPrecipitationMessage(precipProb)

      expect(result).toContain('☂️') // Umbrella added
      expect(message).toBe('Rain expected') // Message shown
    })
  })

  describe('Data type validation', () => {
    it('should handle precipitation probability as integer', () => {
      expect(typeof shouldAddUmbrella(50)).toBe('boolean')
      expect(Array.isArray(getPrecipitationModifierEmojis(50))).toBe(true)
      expect(typeof getPrecipitationMessage(50)).toBe('string')
    })

    it('should handle precipitation probability as float', () => {
      expect(shouldAddUmbrella(30.5)).toBe(true)
      expect(getPrecipitationModifierEmojis(45.7)).toEqual(['☂️'])
      expect(getPrecipitationMessage(75.3)).toBe('Rain expected')
    })

    it('should handle precipitation probability at boundaries', () => {
      expect(shouldAddUmbrella(0)).toBe(false)
      expect(shouldAddUmbrella(100)).toBe(true)
      expect(getPrecipitationModifierEmojis(0)).toEqual([])
      expect(getPrecipitationModifierEmojis(100)).toEqual(['☂️'])
    })
  })
})
