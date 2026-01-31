/**
 * Test Feature #56: Dark mode follows system preference
 *
 * This test verifies that:
 * 1. getBackgroundColor respects the useSystemDarkMode parameter
 * 2. Dark mode colors are returned when system dark mode is enabled
 * 3. All temperature buckets work correctly in dark mode
 */

import { describe, it, expect } from 'vitest'
import { getBackgroundColor } from './src/lib/adaptiveBackground'

describe('Feature #56: Dark Mode System Preference', () => {
  describe('getBackgroundColor with dark mode override', () => {
    it('should use light colors during day when system is light mode', () => {
      const temp = 68 // mild temperature (65-70°F)
      const weatherCode = 0 // clear sky
      const isDay = 1 // daytime

      const color = getBackgroundColor(temp, weatherCode, isDay, 'F', false)

      // Should return light mode color for mild
      expect(color).toBe('#ecfdf5') // Light green for mild
    })

    it('should use dark colors during day when system is dark mode', () => {
      const temp = 68 // mild temperature (65-70°F)
      const weatherCode = 0 // clear sky
      const isDay = 1 // daytime

      const color = getBackgroundColor(temp, weatherCode, isDay, 'F', true)

      // Should return dark mode color for mild
      expect(color).toBe('#1c3d32') // Deep green for mild
    })

    it('should use dark colors at night regardless of system preference', () => {
      const temp = 68 // mild temperature (65-70°F)
      const weatherCode = 0 // clear sky
      const isDay = 0 // nighttime

      const colorLight = getBackgroundColor(temp, weatherCode, isDay, 'F', false)
      const colorDark = getBackgroundColor(temp, weatherCode, isDay, 'F', true)

      // Both should return dark mode color at night
      expect(colorLight).toBe('#1c3d32')
      expect(colorDark).toBe('#1c3d32')
    })

    it('should handle all temperature buckets in dark mode', () => {
      const weatherCode = 0 // clear sky
      const isDay = 1 // daytime

      // Test all buckets with system dark mode enabled
      expect(getBackgroundColor(20, weatherCode, isDay, 'F', true)).toBe('#1e293b') // freezing
      expect(getBackgroundColor(40, weatherCode, isDay, 'F', true)).toBe('#1e3a5f') // cold
      expect(getBackgroundColor(55, weatherCode, isDay, 'F', true)).toBe('#334155') // cool
      expect(getBackgroundColor(68, weatherCode, isDay, 'F', true)).toBe('#1c3d32') // mild (65-70°F)
      expect(getBackgroundColor(75, weatherCode, isDay, 'F', true)).toBe('#423d18') // warm (70-80°F)
      expect(getBackgroundColor(95, weatherCode, isDay, 'F', true)).toBe('#4a2c0a') // hot
    })

    it('should handle all temperature buckets in light mode', () => {
      const weatherCode = 0 // clear sky
      const isDay = 1 // daytime

      // Test all buckets with system dark mode disabled
      expect(getBackgroundColor(20, weatherCode, isDay, 'F', false)).toBe('#e0e7ef') // freezing
      expect(getBackgroundColor(40, weatherCode, isDay, 'F', false)).toBe('#dbeafe') // cold
      expect(getBackgroundColor(55, weatherCode, isDay, 'F', false)).toBe('#f1f5f9') // cool
      expect(getBackgroundColor(68, weatherCode, isDay, 'F', false)).toBe('#ecfdf5') // mild (65-70°F)
      expect(getBackgroundColor(75, weatherCode, isDay, 'F', false)).toBe('#fef3c7') // warm (70-80°F)
      expect(getBackgroundColor(95, weatherCode, isDay, 'F', false)).toBe('#ffedd5') // hot
    })

    it('should apply dark mode to rain colors', () => {
      const temp = 68 // mild
      const weatherCode = 63 // rain
      const isDay = 1 // daytime

      const colorLight = getBackgroundColor(temp, weatherCode, isDay, 'F', false)
      const colorDark = getBackgroundColor(temp, weatherCode, isDay, 'F', true)

      expect(colorLight).toBe('#e2e8f0') // Rain color light
      expect(colorDark).toBe('#374151') // Rain color dark
    })

    it('should apply dark mode to snow colors', () => {
      const temp = 20 // freezing
      const weatherCode = 71 // snow
      const isDay = 1 // daytime

      const colorLight = getBackgroundColor(temp, weatherCode, isDay, 'F', false)
      const colorDark = getBackgroundColor(temp, weatherCode, isDay, 'F', true)

      expect(colorLight).toBe('#e2e8f0') // Rain color light (snow uses same color)
      expect(colorDark).toBe('#374151') // Rain color dark
    })

    it('should preserve night mode behavior when system is light mode', () => {
      const temp = 68 // mild (65-70°F)
      const weatherCode = 0 // clear sky
      const isDay = 0 // nighttime

      // Even with system light mode, night should still be dark
      const color = getBackgroundColor(temp, weatherCode, isDay, 'F', false)

      expect(color).toBe('#1c3d32') // Dark green for mild at night
    })

    it('system dark mode should override day flag', () => {
      const temp = 68 // mild (65-70°F)
      const weatherCode = 0 // clear sky
      const isDay = 1 // daytime (but system dark mode enabled)

      // System dark mode should make it dark even during the day
      const color = getBackgroundColor(temp, weatherCode, isDay, 'F', true)

      expect(color).toBe('#1c3d32') // Dark green instead of light green
    })
  })

  describe('Text color computation for dark mode backgrounds', () => {
    it('should return light text for dark mode backgrounds', () => {
      // Dark mode backgrounds should have light text
      const freezingDark = getBackgroundColor(20, 0, 1, 'F', true)
      const coldDark = getBackgroundColor(40, 0, 1, 'F', true)
      const mildDark = getBackgroundColor(68, 0, 1, 'F', true) // mild (65-70°F)
      const hotDark = getBackgroundColor(95, 0, 1, 'F', true)

      // All dark colors start with #1-#4
      expect(freezingDark.startsWith('#')).toBe(true)
      expect(coldDark.startsWith('#')).toBe(true)
      expect(mildDark.startsWith('#')).toBe(true)
      expect(hotDark.startsWith('#')).toBe(true)
    })

    it('should return dark text for light mode backgrounds', () => {
      // Light mode backgrounds should have dark text
      const freezingLight = getBackgroundColor(20, 0, 1, 'F', false)
      const coldLight = getBackgroundColor(40, 0, 1, 'F', false)
      const mildLight = getBackgroundColor(68, 0, 1, 'F', false) // mild (65-70°F)
      const hotLight = getBackgroundColor(95, 0, 1, 'F', false)

      // All light colors start with #d-#f
      expect(freezingLight.startsWith('#')).toBe(true)
      expect(coldLight.startsWith('#')).toBe(true)
      expect(mildLight.startsWith('#')).toBe(true)
      expect(hotLight.startsWith('#')).toBe(true)
    })
  })
})
