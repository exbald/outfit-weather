import { useState, useEffect } from 'react'

export type TemperatureUnit = 'C' | 'F'
export type WindSpeedUnit = 'kmh' | 'mph'

export interface Settings {
  temperatureUnit: TemperatureUnit
  windSpeedUnit: WindSpeedUnit
}

const SETTINGS_STORAGE_KEY = 'outfitweather_settings'

const DEFAULT_SETTINGS: Settings = {
  temperatureUnit: 'C',
  windSpeedUnit: 'kmh'
}

/**
 * Detect locale-based default units
 * US uses °F and mph, rest of world uses °C and km/h
 */
function detectDefaultUnits(): Settings {
  // Check if locale is US (uses Fahrenheit and mph)
  const isUSLocale = navigator.language === 'en-US' ||
                     navigator.language.startsWith('en-US')

  return {
    temperatureUnit: isUSLocale ? 'F' : 'C',
    windSpeedUnit: isUSLocale ? 'mph' : 'kmh'
  }
}

/**
 * Load settings from localStorage
 */
function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.warn('[Settings] Failed to load from localStorage:', error)
  }
  // No saved settings - detect from locale
  return detectDefaultUnits()
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn('[Settings] Failed to save to localStorage:', error)
  }
}

export interface UseSettingsResult {
  settings: Settings
  setTemperatureUnit: (unit: TemperatureUnit) => void
  setWindSpeedUnit: (unit: WindSpeedUnit) => void
  resetToDefaults: () => void
}

/**
 * Custom hook to manage app settings with localStorage persistence
 *
 * Features:
 * - Settings persist across sessions (localStorage)
 * - Auto-detects defaults from user's locale (US → °F/mph, others → °C/kmh)
 * - Provides individual setters for each setting
 */
export function useSettings(): UseSettingsResult {
  const [settings, setSettingsState] = useState<Settings>(() => loadSettings())

  // Save to localStorage whenever settings change
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const setTemperatureUnit = (unit: TemperatureUnit) => {
    setSettingsState(prev => ({ ...prev, temperatureUnit: unit }))
  }

  const setWindSpeedUnit = (unit: WindSpeedUnit) => {
    setSettingsState(prev => ({ ...prev, windSpeedUnit: unit }))
  }

  const resetToDefaults = () => {
    setSettingsState(detectDefaultUnits())
  }

  return {
    settings,
    setTemperatureUnit,
    setWindSpeedUnit,
    resetToDefaults
  }
}
