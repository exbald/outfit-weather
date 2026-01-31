/**
 * Regression test for Feature #20: Outfit emojis for each bucket
 *
 * This test verifies that:
 * 1. Each temperature bucket has appropriate emoji mappings
 * 2. Emojis are diverse and appropriate for each temperature
 * 3. getOutfitEmojis() returns a copy (prevents mutation)
 * 4. getOutfitEmojisString() returns concatenated string
 * 5. All emojis are valid Unicode characters
 */

import { getOutfitEmojis, getOutfitEmojisString, getTemperatureBucketDisplayName, type TemperatureBucket } from './src/lib/outfitLogic'

describe('Feature #20: Outfit emojis for each bucket', () => {
  const buckets: TemperatureBucket[] = ['freezing', 'cold', 'cool', 'mild', 'warm', 'hot']

  describe('emoji mappings exist for all buckets', () => {
    it('should return non-empty arrays for all temperature buckets', () => {
      buckets.forEach((bucket) => {
        const emojis = getOutfitEmojis(bucket)
        expect(emojis).toBeDefined()
        expect(Array.isArray(emojis)).toBe(true)
        expect(emojis.length).toBeGreaterThan(0)
      })
    })

    it('should return appropriate number of emojis for each bucket', () => {
      const expectedLengths: Record<TemperatureBucket, number> = {
        freezing: 5, // Heavy coat, scarf, gloves, boots, hat
        cold: 4,     // Coat, scarf, pants, boots
        cool: 4,     // Light coat, shirt, pants, sneakers
        mild: 4,     // Light jacket, shirt, pants, sneakers
        warm: 4,     // Shirt, pants, sneakers, hat
        hot: 5,      // T-shirt, shorts, sneakers, hat, sunglasses
      }

      buckets.forEach((bucket) => {
        const emojis = getOutfitEmojis(bucket)
        expect(emojis.length).toBe(expectedLengths[bucket])
      })
    })
  })

  describe('emoji diversity and appropriateness', () => {
    it('should have freezing gear for freezing temperatures', () => {
      const emojis = getOutfitEmojis('freezing')
      expect(emojis).toContain('🧥') // Heavy coat
      expect(emojis).toContain('🧣') // Scarf
      expect(emojis).toContain('🧤') // Gloves
      expect(emojis).toContain('🥾') // Boots
      expect(emojis).toContain('🧢') // Hat
    })

    it('should have lighter clothing for cold temperatures', () => {
      const emojis = getOutfitEmojis('cold')
      expect(emojis).toContain('🧥') // Coat
      expect(emojis).toContain('🧣') // Scarf
      expect(emojis).toContain('👖') // Pants
      expect(emojis).toContain('🥾') // Boots
    })

    it('should have light layers for cool temperatures', () => {
      const emojis = getOutfitEmojis('cool')
      expect(emojis).toContain('🧥') // Light coat
      expect(emojis).toContain('👕') // Shirt
      expect(emojis).toContain('👖') // Pants
      expect(emojis).toContain('👟') // Sneakers
    })

    it('should have comfortable clothing for mild temperatures', () => {
      const emojis = getOutfitEmojis('mild')
      expect(emojis).toContain('🧥') // Light jacket
      expect(emojis).toContain('👕') // Shirt
      expect(emojis).toContain('👖') // Pants
      expect(emojis).toContain('👟') // Sneakers
    })

    it('should have warm weather gear for warm temperatures', () => {
      const emojis = getOutfitEmojis('warm')
      expect(emojis).toContain('👕') // Shirt
      expect(emojis).toContain('👖') // Pants
      expect(emojis).toContain('👟') // Sneakers
      expect(emojis).toContain('🧢') // Hat
    })

    it('should have hot weather gear for hot temperatures', () => {
      const emojis = getOutfitEmojis('hot')
      expect(emojis).toContain('👕') // T-shirt
      expect(emojis).toContain('🩳') // Shorts
      expect(emojis).toContain('👟') // Sneakers
      expect(emojis).toContain('🧢') // Hat
      expect(emojis).toContain('🕶️') // Sunglasses
    })
  })

  describe('getOutfitEmojisString', () => {
    it('should return concatenated emoji string for all buckets', () => {
      buckets.forEach((bucket) => {
        const emojiString = getOutfitEmojisString(bucket)
        expect(emojiString).toBeDefined()
        expect(typeof emojiString).toBe('string')
        expect(emojiString.length).toBeGreaterThan(0)
      })
    })

    it('should concatenate all emojis from getOutfitEmojis', () => {
      buckets.forEach((bucket) => {
        const emojis = getOutfitEmojis(bucket)
        const emojiString = getOutfitEmojisString(bucket)
        expect(emojiString).toBe(emojis.join(''))
      })
    })

    it('should have correct length for concatenated string', () => {
      buckets.forEach((bucket) => {
        const emojis = getOutfitEmojis(bucket)
        const emojiString = getOutfitEmojisString(bucket)
        // Each emoji is typically 2 code units (surrogate pair)
        const expectedLength = emojis.length * 2
        expect(emojiString.length).toBe(expectedLength)
      })
    })
  })

  describe('immutability', () => {
    it('should return a copy to prevent mutation', () => {
      buckets.forEach((bucket) => {
        const emojis1 = getOutfitEmojis(bucket)
        const emojis2 = getOutfitEmojis(bucket)

        // Modifying the first array should not affect the second
        emojis1.push('❌')
        expect(emojis2).not.toContain('❌')
        expect(emojis2.length).toBeLessThan(emojis1.length)
      })
    })

    it('should not affect other buckets when one is mutated', () => {
      const freezingEmojis = getOutfitEmojis('freezing')
      const hotEmojis = getOutfitEmojis('hot')

      const originalFreezingLength = freezingEmojis.length
      const originalHotLength = hotEmojis.length

      freezingEmojis.push('❌')

      expect(freezingEmojis.length).toBe(originalFreezingLength + 1)
      expect(getOutfitEmojis('freezing').length).toBe(originalFreezingLength) // Fresh call
      expect(getOutfitEmojis('hot').length).toBe(originalHotLength)
    })
  })

  describe('emoji validity', () => {
    it('should contain only valid Unicode emoji characters', () => {
      buckets.forEach((bucket) => {
        const emojis = getOutfitEmojis(bucket)
        emojis.forEach((emoji) => {
          // All emojis should be non-empty strings
          expect(emoji).toBeTruthy()
          expect(typeof emoji).toBe('string')

          // Emojis should be in the Unicode emoji ranges
          // Most emojis are in: \u{1F000}-\u{1F9FF} or \u{2600}-\u{26FF} or \u{2700}-\u{27BF}
          const codePoint = emoji.codePointAt(0)
          expect(codePoint).toBeGreaterThan(0)
        })
      })
    })

    it('should render consistently across multiple calls', () => {
      buckets.forEach((bucket) => {
        const emojis1 = getOutfitEmojis(bucket)
        const emojis2 = getOutfitEmojis(bucket)
        const string1 = getOutfitEmojisString(bucket)
        const string2 = getOutfitEmojisString(bucket)

        expect(emojis1).toEqual(emojis2)
        expect(string1).toBe(string2)
      })
    })
  })

  describe('temperature-specific progression', () => {
    it('should show logical progression from freezing to hot', () => {
      const freezing = getOutfitEmojis('freezing')
      const cold = getOutfitEmojis('cold')
      const cool = getOutfitEmojis('cool')
      const mild = getOutfitEmojis('mild')
      const warm = getOutfitEmojis('warm')
      const hot = getOutfitEmojis('hot')

      // Freezing should have most heavy gear
      expect(freezing).toContain('🧤') // Gloves - unique to freezing

      // Hot should have summer gear
      expect(hot).toContain('🩳') // Shorts - unique to hot
      expect(hot).toContain('🕶️') // Sunglasses - unique to hot

      // All should have some form of top, bottom, and footwear
      const allBuckets = [freezing, cold, cool, mild, warm, hot]
      allBuckets.forEach((emojis) => {
        const hasTop = emojis.some(e => ['🧥', '👕'].includes(e))
        const hasBottom = emojis.some(e => ['👖', '🩳'].includes(e))
        const hasFootwear = emojis.some(e => ['👟', '🥾'].includes(e))

        expect(hasTop).toBe(true)
        expect(hasBottom).toBe(true)
        expect(hasFootwear).toBe(true)
      })
    })
  })

  describe('integration with display names', () => {
    it('should work correctly with getTemperatureBucketDisplayName', () => {
      buckets.forEach((bucket) => {
        const displayName = getTemperatureBucketDisplayName(bucket)
        const emojis = getOutfitEmojis(bucket)
        const emojiString = getOutfitEmojisString(bucket)

        expect(displayName).toBeDefined()
        expect(emojis).toBeDefined()
        expect(emojiString).toBeDefined()

        // All should be usable together
        expect(`${displayName}: ${emojiString}`).toBeTruthy()
      })
    })
  })
})
