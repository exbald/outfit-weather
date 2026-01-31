/**
 * Custom hook to detect system dark mode preference
 * Uses the prefers-color-scheme media query
 */

import { useState, useEffect } from 'react'

export interface DarkModeResult {
  isDarkMode: boolean
}

/**
 * Hook to detect if user's system is in dark mode
 *
 * This hook listens to the prefers-color-scheme media query
 * and updates when the system theme changes.
 *
 * @returns Object with isDarkMode boolean
 *
 * @example
 * ```tsx
 * const { isDarkMode } = useDarkMode()
 *
 * if (isDarkMode) {
 *   // Apply dark mode styles
 * }
 * ```
 */
export function useDarkMode(): DarkModeResult {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Initialize with current system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    // Create media query listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // Define change handler
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange)

    // Clean up listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return {
    isDarkMode,
  }
}
