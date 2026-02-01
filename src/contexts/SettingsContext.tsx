import { createContext, useContext, ReactNode } from 'react'
import { useSettings, type UseSettingsResult, type TemperatureUnit, type WindSpeedUnit, type ThemePreference } from '../hooks/useSettings'

interface SettingsContextValue extends UseSettingsResult {
  temperatureUnit: TemperatureUnit
  windSpeedUnit: WindSpeedUnit
  themePreference: ThemePreference
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export interface SettingsProviderProps {
  children: ReactNode
}

/**
 * Provider component that wraps the app and provides settings to all components
 */
export function SettingsProvider({ children }: SettingsProviderProps) {
  const settingsHook = useSettings()

  const contextValue: SettingsContextValue = {
    ...settingsHook,
    temperatureUnit: settingsHook.settings.temperatureUnit,
    windSpeedUnit: settingsHook.settings.windSpeedUnit,
    themePreference: settingsHook.settings.themePreference
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

/**
 * Hook to access settings from any component
 * Throws an error if used outside of SettingsProvider
 */
export function useSettingsContext(): SettingsContextValue {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }
  return context
}
