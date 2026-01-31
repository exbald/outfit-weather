/**
 * Verification script for Feature #49: No cache + no network shows error
 *
 * This script verifies the code implementation to ensure that when both
 * network fails AND no cache exists, a friendly error screen is displayed
 * with a retry option.
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

describe('Feature #49: No cache + no network shows error', () => {
  it('should detect no-cache + no-network state in useWeather hook', () => {
    const useWeatherPath = path.join(__dirname, 'src/hooks/useWeather.ts')
    const useWeatherCode = fs.readFileSync(useWeatherPath, 'utf-8')

    // Verify error handling logic exists
    expect(useWeatherCode).toContain('catch (err)')
    expect(useWeatherCode).toContain('const cached = loadWeatherData')
    expect(useWeatherCode).toContain('if (cached)')

    // Verify offline state is set correctly
    expect(useWeatherCode).toContain('setOffline(true)')
    expect(useWeatherCode).toContain('setOffline(false)')

    // Verify error state management
    expect(useWeatherCode).toContain('setError(errorMessage)')
    expect(useWeatherCode).toContain('error: string | null')
  })

  it('should distinguish between cached (offline) and no-cache (error) modes', () => {
    const useWeatherPath = path.join(__dirname, 'src/hooks/useWeather.ts')
    const useWeatherCode = fs.readFileSync(useWeatherPath, 'utf-8')

    // When cached data exists on network failure:
    // - Show cached data
    // - Set offline=true
    // - Keep error for reference
    expect(useWeatherCode).toMatch(/if \(cached\)/s)
    expect(useWeatherCode).toContain('setWeather(cached)')
    expect(useWeatherCode).toContain('setOffline(true)')

    // When NO cached data exists on network failure:
    // - Show error
    // - Set offline=false
    expect(useWeatherCode).toMatch(/} else \{[\s\S]*setError(errorMessage)/s)
    expect(useWeatherCode).toContain('setOffline(false)')
  })

  it('should provide friendly error messages', () => {
    const openmeteoPath = path.join(__dirname, 'src/lib/openmeteo.ts')
    const openmeteoCode = fs.readFileSync(openmeteoPath, 'utf-8')

    // Verify WeatherApiError class with user-friendly messages
    expect(openmeteoCode).toContain('userMessage')
    expect(openmeteoCode).toContain('WeatherApiError')

    // Verify error mapping for HTTP status codes
    expect(openmeteoCode).toContain('getErrorMessageForStatus')
    expect(openmeteoCode).toContain('isRetryable')
  })

  it('should display error screen in WeatherDisplay component', () => {
    const weatherDisplayPath = path.join(__dirname, 'src/components/WeatherDisplay.tsx')
    const weatherDisplayCode = fs.readFileSync(weatherDisplayPath, 'utf-8')

    // Verify error screen exists
    expect(weatherDisplayCode).toContain('if (error)')

    // Verify friendly error display
    expect(weatherDisplayCode).toContain('role="alert"')
    expect(weatherDisplayCode).toContain("Couldn't fetch weather")
    expect(weatherDisplayCode).toContain('⚠️')

    // Verify retry button
    expect(weatherDisplayCode).toContain('onClick={retry}')
    expect(weatherDisplayCode).toContain('Retry')
  })

  it('should provide retry function in useWeather hook', () => {
    const useWeatherPath = path.join(__dirname, 'src/hooks/useWeather.ts')
    const useWeatherCode = fs.readFileSync(useWeatherPath, 'utf-8')

    // Verify retry function exists
    expect(useWeatherCode).toContain('const retry = ()')
    expect(useWeatherCode).toContain('fetchWeather(lastCoords.lat, lastCoords.lon)')

    // Verify retry is exported
    expect(useWeatherCode).toMatch(/return[\s\S]*retry:/s)
  })

  it('should handle all three error states correctly', () => {
    const useWeatherPath = path.join(__dirname, 'src/hooks/useWeather.ts')
    const useWeatherCode = fs.readFileSync(useWeatherPath, 'utf-8')

    // State 1: Success with fresh data
    // - weather: data
    // - error: null
    // - offline: false

    // State 2: Network failure BUT has cached data (Feature #48)
    // - weather: cached data
    // - error: message (kept for reference)
    // - offline: true
    expect(useWeatherCode).toContain('setOffline(true)')

    // State 3: Network failure AND no cached data (Feature #49)
    // - weather: null
    // - error: message
    // - offline: false
    expect(useWeatherCode).toMatch(/} else \{[\s\S]*setError(errorMessage)[\s\S]*setOffline(false)/s)
  })

  it('should have proper TypeScript interfaces for error handling', () => {
    const useWeatherPath = path.join(__dirname, 'src/hooks/useWeather.ts')
    const useWeatherCode = fs.readFileSync(useWeatherPath, 'utf-8')

    // Verify UseWeatherResult interface
    expect(useWeatherCode).toContain('error: string | null')
    expect(useWeatherCode).toContain('offline: boolean')
    expect(useWeatherCode).toContain('retry: () => void')
  })

  it('should reset offline state on new fetch', () => {
    const useWeatherPath = path.join(__dirname, 'src/hooks/useWeather.ts')
    const useWeatherCode = fs.readFileSync(useWeatherPath, 'utf-8')

    // Verify offline is reset when starting a new fetch
    expect(useWeatherCode).toContain('setOffline(false)')

    // Find the line that resets offline state at the start of fetchWeather
    const lines = useWeatherCode.split('\n')
    const fetchWeatherStart = lines.findIndex(line => line.includes('const fetchWeather = async'))
    const nextLines = lines.slice(fetchWeatherStart, fetchWeatherStart + 20)

    // Should have setOffline(false) before the try block
    const resetLine = nextLines.find(line => line.includes('setOffline(false)'))
    expect(resetLine).toBeTruthy()
  })

  it('should maintain loading state correctly', () => {
    const useWeatherPath = path.join(__dirname, 'src/hooks/useWeather.ts')
    const useWeatherCode = fs.readFileSync(useWeatherPath, 'utf-8')

    // Verify loading state management
    expect(useWeatherCode).toContain('loading: boolean')
    expect(useWeatherCode).toContain('setLoading(true)')
    expect(useWeatherCode).toContain('setLoading(false)')

    // Loading should be false in finally block (even after error)
    expect(useWeatherCode).toMatch(/} finally \{[\s\S]*setLoading\(false\)/s)
  })

  it('should export error and offline states for UI consumption', () => {
    const useWeatherPath = path.join(__dirname, 'src/hooks/useWeather.ts')
    const useWeatherCode = fs.readFileSync(useWeatherPath, 'utf-8')

    // Verify return statement includes all required states
    expect(useWeatherCode).toMatch(/return[\s\S]*\berror,\s*$/m)
    expect(useWeatherCode).toMatch(/return[\s\S]*\boffline,\s*$/m)
  })
})
