/**
 * Custom hook to manage dark mode based on user preference or system setting
 * Uses the prefers-color-scheme media query as fallback for 'system' preference
 */

import { useState, useEffect } from 'react'
import type { ThemePreference } from './useSettings'

export interface DarkModeResult {
  isDarkMode: boolean
  /** The system's native dark mode preference */
  systemPrefersDark: boolean
}

/**
 * Hook to manage dark mode with user preference support
 *
 * This hook:
 * - Listens to the prefers-color-scheme media query for system preference
 * - Applies user's theme preference (light/dark/system)
 * - Applies 'dark' class to document.documentElement for Tailwind
 *
 * @param themePreference - User's theme preference ('light' | 'dark' | 'system')
 * @returns Object with isDarkMode boolean and systemPrefersDark
 *
 * @example
 * ```tsx
 * const { themePreference } = useSettingsContext()
 * const { isDarkMode } = useDarkMode(themePreference)
 *
 * if (isDarkMode) {
 *   // Dark mode is active
 * }
 * ```
 */
export function useDarkMode(themePreference: ThemePreference = 'system'): DarkModeResult {
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    // Initialize with current system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  // Listen for system preference changes
  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    // Create media query listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // Define change handler
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches)
    }

    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange)

    // Clean up listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Compute effective dark mode based on preference
  const isDarkMode = themePreference === 'system'
    ? systemPrefersDark
    : themePreference === 'dark'

  // Apply dark class to document for Tailwind
  useEffect(() => {
    if (typeof document === 'undefined') return

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return {
    isDarkMode,
    systemPrefersDark,
  }
}
