/**
 * Feature #60: "Still fetching..." after 5 seconds
 *
 * This test verifies that when loading exceeds 5 seconds,
 * a friendly "Still fetching..." message appears to reassure users.
 *
 * Test Approach:
 * 1. Mock Open-Meteo API to delay response > 5 seconds
 * 2. Render WeatherDisplay component
 * 3. Verify initial loading state (no "Still fetching...")
 * 4. Wait 5 seconds
 * 5. Verify "Still fetching..." message appears
 *
 * Success Criteria:
 * - "Still fetching..." message appears after 5 seconds
 * - Message includes friendly text about checking connection
 * - Message has appropriate styling (blue background)
 * - Screen reader announces the message
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { WeatherDisplay } from '../src/components/WeatherDisplay'
import { SettingsProvider } from '../src/contexts/SettingsContext'

// Mock the Open-Meteo API to simulate slow network
const mockFetchCurrentWeather = vi.fn(async () => {
  // Simulate > 5 second delay
  await new Promise(resolve => setTimeout(resolve, 6000))
  return {
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
    current: {
      temperature: 15,
      apparent_temperature: 13,
      weathercode: 0,
      windspeed: 10,
      is_day: 1
    },
    daily: {
      time: ['2024-01-15', '2024-01-16'],
      apparent_temperature_max: [18, 20],
      apparent_temperature_min: [10, 12],
      weathercode: [0, 1],
      precipitation_probability_max: [0, 10]
    },
    hourly: {
      time: ['2024-01-15T00:00'],
      temperature_2m: [15]
    }
  }
})

vi.mock('../src/lib/openmeteo', () => ({
  fetchCurrentWeather: () => mockFetchCurrentWeather(),
  getWeatherCondition: () => ({
    description: 'Clear sky',
    icon: '☀️'
  }),
  parseDailyForecast: () => ({
    today: {
      maxTemp: 18,
      minTemp: 10,
      weatherCode: 0,
      condition: 'Clear sky',
      icon: '☀️',
      precipitationProbability: 0
    },
    tomorrow: {
      maxTemp: 20,
      minTemp: 12,
      weatherCode: 1,
      condition: 'Mainly clear',
      icon: '🌤️',
      precipitationProbability: 10
    }
  })
}))

// Mock geocoding
vi.mock('../src/lib/geocoding', () => ({
  reverseGeocode: async () => 'New York, NY'
}))

// Mock storage
const mockStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn()
}
global.localStorage = mockStorage as any

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <SettingsProvider>
      {ui}
    </SettingsProvider>
  )
}

describe('Feature #60: "Still fetching..." after 5 seconds', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Use fake timers for predictable timing
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows skeleton UI after 1 second', async () => {
    renderWithProviders(
      <WeatherDisplay lat={40.7128} lon={-74.006} />
    )

    // Fast-forward 1 second
    await vi.advanceTimersByTimeAsync(1000)

    // Should show skeleton (gray placeholders)
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('shows "Still fetching..." message after 5 seconds', async () => {
    renderWithProviders(
      <WeatherDisplay lat={40.7128} lon={-74.006} />
    )

    // Fast-forward to just before 5 seconds
    await vi.advanceTimersByTimeAsync(4900)

    // Should NOT show "Still fetching..." yet
    expect(screen.queryByText(/Still fetching/i)).not.toBeInTheDocument()

    // Fast-forward past 5 seconds
    await vi.advanceTimersByTimeAsync(200)

    // Now should show "Still fetching..." message
    await waitFor(() => {
      const stillFetching = screen.queryByText(/Still fetching/i)
      expect(stillFetching).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('includes friendly text about checking connection', async () => {
    renderWithProviders(
      <WeatherDisplay lat={40.7128} lon={-74.006} />
    )

    // Fast-forward past 5 seconds
    await vi.advanceTimersByTimeAsync(5100)

    await waitFor(() => {
      const connectionText = screen.queryByText(/check your internet connection/i)
      expect(connectionText).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('has appropriate styling (blue background)', async () => {
    const { container } = renderWithProviders(
      <WeatherDisplay lat={40.7128} lon={-74.006} />
    )

    // Fast-forward past 5 seconds
    await vi.advanceTimersByTimeAsync(5100)

    await waitFor(() => {
      const blueBox = container.querySelector('.bg-blue-50, .bg-blue-900\\/30')
      expect(blueBox).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('is accessible to screen readers', async () => {
    renderWithProviders(
      <WeatherDisplay lat={40.7128} lon={-74.006} />
    )

    // Fast-forward past 5 seconds
    await vi.advanceTimersByTimeAsync(5100)

    await waitFor(() => {
      const section = screen.queryByRole('section', { name: /loading weather data/i })
      expect(section).toBeInTheDocument()
      expect(section).toHaveAttribute('aria-live', 'polite')
      expect(section).toHaveAttribute('aria-busy', 'true')
    }, { timeout: 1000 })
  })

  it('clears message when data loads successfully', async () => {
    renderWithProviders(
      <WeatherDisplay lat={40.7128} lon={-74.006} />
    )

    // Fast-forward to 5 seconds (message appears)
    await vi.advanceTimersByTimeAsync(5100)

    await waitFor(() => {
      expect(screen.queryByText(/Still fetching/i)).toBeInTheDocument()
    }, { timeout: 1000 })

    // Fast-forward to 6 seconds (API response arrives)
    await vi.advanceTimersByTimeAsync(1000)

    // Message should be gone, replaced by actual weather data
    await waitFor(() => {
      expect(screen.queryByText(/Still fetching/i)).not.toBeInTheDocument()
      // Should show actual temperature instead
      expect(screen.getByText(/15/i)).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})

console.log('✅ Feature #60 tests: All 6 tests defined')
console.log('')
console.log('Test Coverage:')
console.log('  ✅ Skeleton UI after 1 second')
console.log('  ✅ "Still fetching..." appears after 5 seconds')
console.log('  ✅ Friendly text about checking connection')
console.log('  ✅ Appropriate blue background styling')
console.log('  ✅ Screen reader accessibility (aria-live, aria-busy)')
console.log('  ✅ Message clears when data loads')
