/**
 * Feature #14: UV Index Data Fetched - Verification Tests
 *
 * This test suite verifies that:
 * 1. UV index is included in API parameters
 * 2. UV value is parsed from response
 * 3. UV level is categorized (low/moderate/high/extreme)
 */

import { describe, it, expect } from 'vitest'
import { buildCurrentWeatherUrl, parseDailyForecast } from './src/lib/openmeteo'

describe('Feature #14: UV Index Data Fetched', () => {
  describe('Step 1: Add uv_index to API parameters', () => {
    it('should include uv_index_max in daily parameters', () => {
      const url = buildCurrentWeatherUrl(40.7128, -74.0060, 'celsius', 'kmh')
      expect(url).toContain('uv_index_max')
    })

    it('should build correct API URL with UV index', () => {
      const url = buildCurrentWeatherUrl(40.7128, -74.0060, 'celsius', 'kmh')
      const dailyParams = url.match(/daily=([^&]+)/)?.[1]
      expect(dailyParams).toContain('uv_index_max')
      expect(dailyParams).toContain('temperature_2m_max')
      expect(dailyParams).toContain('temperature_2m_min')
    })
  })

  describe('Step 2: Parse UV value from response', () => {
    it('should extract uvIndexMax from daily data', () => {
      const mockDailyData = {
        time: ['2025-01-31', '2025-02-01'],
        temperature_2m_max: [10, 12],
        temperature_2m_min: [5, 7],
        weathercode: [0, 2],
        precipitation_probability_max: [0, 10],
        uv_index_max: [3, 5]
      }

      const result = parseDailyForecast(mockDailyData)

      expect(result.today.uvIndexMax).toBe(3)
      expect(result.tomorrow.uvIndexMax).toBe(5)
    })

    it('should handle high UV index values', () => {
      const mockDailyData = {
        time: ['2025-07-15', '2025-07-16'],
        temperature_2m_max: [35, 37],
        temperature_2m_min: [25, 27],
        weathercode: [0, 0],
        precipitation_probability_max: [0, 0],
        uv_index_max: [11, 10]
      }

      const result = parseDailyForecast(mockDailyData)

      expect(result.today.uvIndexMax).toBe(11)
      expect(result.tomorrow.uvIndexMax).toBe(10)
    })

    it('should handle low UV index values', () => {
      const mockDailyData = {
        time: ['2025-01-31', '2025-02-01'],
        temperature_2m_max: [-2, 0],
        temperature_2m_min: [-8, -5],
        weathercode: [71, 71],
        precipitation_probability_max: [80, 90],
        uv_index_max: [1, 1]
      }

      const result = parseDailyForecast(mockDailyData)

      expect(result.today.uvIndexMax).toBe(1)
      expect(result.tomorrow.uvIndexMax).toBe(1)
    })
  })

  describe('Step 3: Categorize UV level', () => {
    it('should have UV categorization function', async () => {
      // This test will fail initially, then pass after we implement the function
      const { getUVIndexCategory } = await import('./src/lib/outfitLogic')
      expect(typeof getUVIndexCategory).toBe('function')
    })

    it('should categorize UV 0-2 as low', async () => {
      const { getUVIndexCategory } = await import('./src/lib/outfitLogic')
      expect(getUVIndexCategory(0)).toBe('low')
      expect(getUVIndexCategory(1)).toBe('low')
      expect(getUVIndexCategory(2)).toBe('low')
    })

    it('should categorize UV 3-5 as moderate', async () => {
      const { getUVIndexCategory } = await import('./src/lib/outfitLogic')
      expect(getUVIndexCategory(3)).toBe('moderate')
      expect(getUVIndexCategory(4)).toBe('moderate')
      expect(getUVIndexCategory(5)).toBe('moderate')
    })

    it('should categorize UV 6-7 as high', async () => {
      const { getUVIndexCategory } = await import('./src/lib/outfitLogic')
      expect(getUVIndexCategory(6)).toBe('high')
      expect(getUVIndexCategory(7)).toBe('high')
    })

    it('should categorize UV 8+ as extreme', async () => {
      const { getUVIndexCategory } = await import('./src/lib/outfitLogic')
      expect(getUVIndexCategory(8)).toBe('extreme')
      expect(getUVIndexCategory(10)).toBe('extreme')
      expect(getUVIndexCategory(11)).toBe('extreme')
    })

    it('should handle edge case UV 12 as extreme', async () => {
      const { getUVIndexCategory } = await import('./src/lib/outfitLogic')
      expect(getUVIndexCategory(12)).toBe('extreme')
    })
  })

  describe('UV modifier for outfit recommendations', () => {
    it('should have UV modifier function for outfit logic', async () => {
      // This test verifies the UV modifier integration exists
      const { getOutfitWithUV } = await import('./src/lib/outfitLogic')
      expect(typeof getOutfitWithUV).toBe('function')
    })

    it('should add sunglasses for moderate+ UV during daytime', async () => {
      const { getOutfitWithUV } = await import('./src/lib/outfitLogic')
      const outfit = getOutfitWithUV(['👕', '👖', '👟'], 5, 1) // moderate UV, daytime
      expect(outfit).toContain('🕶️')
    })

    it('should not add sunglasses at night', async () => {
      const { getOutfitWithUV } = await import('./src/lib/outfitLogic')
      const outfit = getOutfitWithUV(['👕', '👖', '👟'], 8, 0) // high UV, nighttime
      expect(outfit).not.toContain('🕶️')
    })

    it('should add hat for extreme UV', async () => {
      const { getOutfitWithUV } = await import('./src/lib/outfitLogic')
      const outfit = getOutfitWithUV(['👕', '🩳', '👟'], 10, 1) // extreme UV, daytime
      expect(outfit).toContain('🧢')
      expect(outfit).toContain('🕶️')
    })
  })

  describe('Integration tests', () => {
    it('should work end-to-end: API fetch -> parse -> categorize', async () => {
      const url = buildCurrentWeatherUrl(40.7128, -74.0060)
      expect(url).toContain('uv_index_max')

      const mockDailyData = {
        time: ['2025-06-21', '2025-06-22'],
        temperature_2m_max: [30, 32],
        temperature_2m_min: [22, 24],
        weathercode: [0, 0],
        precipitation_probability_max: [0, 0],
        uv_index_max: [9, 10]
      }

      const result = parseDailyForecast(mockDailyData)
      const { getUVIndexCategory } = await import('./src/lib/outfitLogic')

      expect(result.today.uvIndexMax).toBe(9)
      expect(getUVIndexCategory(result.today.uvIndexMax)).toBe('extreme')
    })
  })
})
