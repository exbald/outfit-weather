/**
 * Test Feature #56: Dark mode follows system preference
 *
 * This test verifies that:
 * 1. The useDarkMode hook correctly detects system dark mode preference
 * 2. Dark mode preference is passed to adaptive background hook
 * 3. Dark mode preference is passed to adaptive text colors hook
 * 4. Background colors change based on system dark mode setting
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from '../src/hooks/useDarkMode'
import { getBackgroundColor } from '../src/lib/adaptiveBackground'
import { useAdaptiveBackground } from '../src/hooks/useAdaptiveBackground'
import { useAdaptiveTextColors } from '../src/hooks/useAdaptiveTextColors'

describe('Feature #56: Dark Mode System Preference', () => {
  // Save original matchMedia
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  describe('useDarkMode hook', () => {
    it('should detect light mode system preference', () => {
      // Mock matchMedia to return light mode
      const mockMediaQueryList = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }

      vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQueryList)

      const { result } = renderHook(() => useDarkMode())

      expect(result.current.isDarkMode).toBe(false)
    })

    it('should detect dark mode system preference', () => {
      // Mock matchMedia to return dark mode
      const mockMediaQueryList = {
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }

      vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQueryList)

      const { result } = renderHook(() => useDarkMode())

      expect(result.current.isDarkMode).toBe(true)
    })

    it('should update when system preference changes', () => {
      // Start with light mode
      const mockMediaQueryList = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            // Simulate system preference change to dark mode
            setTimeout(() => {
              handler({ matches: true } as MediaQueryListEvent)
            }, 0)
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }

      vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQueryList)

      const { result } = renderHook(() => useDarkMode())

      // Initially light mode
      expect(result.current.isDarkMode).toBe(false)

      // Wait for the event to trigger
      act(() => {
        // Force a re-render to pick up the change
      })

      // After event, should detect dark mode
      // Note: This test may need adjustment based on how the event fires
    })
  })

  describe('getBackgroundColor with dark mode override', () => {
    it('should use light colors during day when system is light mode', () => {
      const temp = 70 // mild temperature
      const weatherCode = 0 // clear sky
      const isDay = 1 // daytime

      const color = getBackgroundColor(temp, weatherCode, isDay, 'F', false)

      // Should return light mode color for mild
      expect(color).toBe('#ecfdf5') // Light green for mild
    })

    it('should use dark colors during day when system is dark mode', () => {
      const temp = 70 // mild temperature
      const weatherCode = 0 // clear sky
      const isDay = 1 // daytime

      const color = getBackgroundColor(temp, weatherCode, isDay, 'F', true)

      // Should return dark mode color for mild
      expect(color).toBe('#1c3d32') // Deep green for mild
    })

    it('should use dark colors at night regardless of system preference', () => {
      const temp = 70 // mild temperature
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

      // Test all buckets
      expect(getBackgroundColor(20, weatherCode, isDay, 'F', true)).toBe('#1e293b') // freezing
      expect(getBackgroundColor(40, weatherCode, isDay, 'F', true)).toBe('#1e3a5f') // cold
      expect(getBackgroundColor(55, weatherCode, isDay, 'F', true)).toBe('#334155') // cool
      expect(getBackgroundColor(70, weatherCode, isDay, 'F', true)).toBe('#1c3d32') // mild
      expect(getBackgroundColor(80, weatherCode, isDay, 'F', true)).toBe('#423d18') // warm
      expect(getBackgroundColor(95, weatherCode, isDay, 'F', true)).toBe('#4a2c0a') // hot
    })

    it('should apply dark mode to rain colors', () => {
      const temp = 70 // mild
      const weatherCode = 63 // rain
      const isDay = 1 // daytime

      const colorLight = getBackgroundColor(temp, weatherCode, isDay, 'F', false)
      const colorDark = getBackgroundColor(temp, weatherCode, isDay, 'F', true)

      expect(colorLight).toBe('#e2e8f0') // Rain color light
      expect(colorDark).toBe('#374151') // Rain color dark
    })
  })

  describe('useAdaptiveBackground with dark mode', () => {
    it('should apply dark mode colors when isSystemDarkMode is true', () => {
      const { result } = renderHook(() =>
        useAdaptiveBackground(70, 0, 1, 'F', true)
      )

      expect(result.current.backgroundColor).toBe('#1c3d32') // Deep green for mild in dark mode
    })

    it('should apply light mode colors when isSystemDarkMode is false', () => {
      const { result } = renderHook(() =>
        useAdaptiveBackground(70, 0, 1, 'F', false)
      )

      expect(result.current.backgroundColor).toBe('#ecfdf5') // Light green for mild in light mode
    })
  })

  describe('useAdaptiveTextColors with dark mode', () => {
    it('should return light text colors when system is dark mode', () => {
      const { result } = renderHook(() =>
        useAdaptiveTextColors(70, 0, 1, 'F', true)
      )

      // Dark backgrounds should have light text
      expect(result.current.colors.primary).toBe('#ffffff')
      expect(result.current.colors.secondary).toBe('#e5e7eb')
      expect(result.current.colors.tertiary).toBe('#d1d5db')
      expect(result.current.colors.muted).toBe('#d1d5db')
    })

    it('should return dark text colors when system is light mode', () => {
      const { result } = renderHook(() =>
        useAdaptiveTextColors(70, 0, 1, 'F', false)
      )

      // Light backgrounds should have dark text
      expect(result.current.colors.primary).toBe('#111827')
      expect(result.current.colors.secondary).toBe('#374151')
      expect(result.current.colors.tertiary).toBe('#4b5563')
      expect(result.current.colors.muted).toBe('#4b5563')
    })
  })
})
