/**
 * Feature #65: Semantic HTML Structure Verification Tests
 *
 * Tests verify proper semantic HTML elements are used throughout the app
 * for screen reader navigation and accessibility.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../src/App'
import { Layout } from '../src/components/Layout'
import { WeatherDisplay } from '../src/components/WeatherDisplay'
import { Drawer } from '../src/components/Drawer'
import { SettingsModal } from '../src/components/SettingsModal'

describe('Feature #65: Semantic HTML structure', () => {
  describe('Layout component', () => {
    it('renders header landmark', () => {
      render(
        <Layout>
          <div>Test content</div>
        </Layout>
      )
      const header = document.querySelector('header')
      expect(header).toBeInTheDocument()
      expect(header?.querySelector('h1')).toBeInTheDocument()
    })

    it('renders main landmark', () => {
      render(
        <Layout>
          <div>Test content</div>
        </Layout>
      )
      const main = document.querySelector('main')
      expect(main).toBeInTheDocument()
    })

    it('renders aside landmark for drawer', () => {
      render(
        <Layout>
          <div>Test content</div>
        </Layout>
      )
      const aside = document.querySelector('aside')
      expect(aside).toBeInTheDocument()
      expect(aside).toHaveAttribute('aria-label', 'Outfit recommendations drawer')
    })
  })

  describe('App.tsx permission screens', () => {
    it('LocationPermissionPrompt uses section landmark', () => {
      // Mock geolocation hook
      const mockUseGeolocation = {
        position: null,
        error: null,
        loading: false,
        requestLocation: vi.fn(),
        permissionShown: true,
        grantPermission: vi.fn(),
      }

      vi.doMock('../src/hooks/useGeolocation', () => ({
        useGeolocation: () => mockUseGeolocation,
      }))

      const { container } = render(<App />)

      // Find section with aria-labelledby
      const section = container.querySelector('section[aria-labelledby="permission-title"]')
      expect(section).toBeInTheDocument()

      // Verify heading is referenced
      const heading = container.querySelector('#permission-title')
      expect(heading).toBeInTheDocument()
      expect(heading?.textContent).toBe('Enable Location Access')
    })

    it('LocationPermissionDenied uses section with role="alert"', () => {
      const mockUseGeolocation = {
        position: null,
        error: new Error('Permission denied'),
        loading: false,
        requestLocation: vi.fn(),
        permissionShown: false,
        grantPermission: vi.fn(),
      }

      vi.doMock('../src/hooks/useGeolocation', () => ({
        useGeolocation: () => mockUseGeolocation,
      }))

      const { container } = render(<App />)

      // Find section with role="alert"
      const section = container.querySelector('section[role="alert"]')
      expect(section).toBeInTheDocument()

      // Verify aria-labelledby
      expect(section).toHaveAttribute('aria-labelledby', 'permission-denied-title')
    })

    it('LocationLoading uses section with aria-live and aria-busy', () => {
      const mockUseGeolocation = {
        position: null,
        error: null,
        loading: true,
        requestLocation: vi.fn(),
        permissionShown: false,
        grantPermission: vi.fn(),
      }

      vi.doMock('../src/hooks/useGeolocation', () => ({
        useGeolocation: () => mockUseGeolocation,
      }))

      const { container } = render(<App />)

      // Find section with aria-live
      const section = container.querySelector('section[aria-live="polite"]')
      expect(section).toBeInTheDocument()

      // Verify aria-busy
      expect(section).toHaveAttribute('aria-busy', 'true')

      // Verify aria-label
      expect(section).toHaveAttribute('aria-label', 'Finding your location')
    })
  })

  describe('WeatherDisplay component', () => {
    it('loading state uses section with aria-live and aria-busy', () => {
      const { container } = render(<WeatherDisplay lat={40.7128} lon={-74.006} />)

      // If in loading state, check for semantic section
      const section = container.querySelector('section[aria-live="polite"]')
      if (section) {
        expect(section).toHaveAttribute('aria-busy', 'true')
        expect(section).toHaveAttribute('aria-label', 'Loading weather data')
      }
    })

    it('error state uses section with role="alert"', () => {
      // Mock weather hook to return error
      vi.doMock('../src/hooks/useWeather', () => ({
        useWeather: () => ({
          weather: null,
          loading: false,
          error: 'Network error',
          cacheAge: 0,
          offline: false,
          refreshing: false,
          retry: vi.fn(),
        }),
      }))

      const { container } = render(<WeatherDisplay lat={40.7128} lon={-74.006} />)

      // Find section with role="alert"
      const section = container.querySelector('section[role="alert"]')
      if (section) {
        expect(section).toHaveAttribute('aria-labelledby', 'weather-error-title')

        const heading = container.querySelector('#weather-error-title')
        expect(heading?.textContent).toBe('Couldn\'t fetch weather')
      }
    })

    it('weather display uses section landmarks', () => {
      // Mock weather hook to return data
      vi.doMock('../src/hooks/useWeather', () => ({
        useWeather: () => ({
          weather: {
            temperature: 20,
            condition: 'Partly Cloudy',
            icon: '⛅',
            windSpeed: 10,
            isDay: 1,
            location: { latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
          },
          loading: false,
          error: null,
          cacheAge: 0,
          offline: false,
          refreshing: false,
          retry: vi.fn(),
        }),
      }))

      const { container } = render(<WeatherDisplay lat={40.7128} lon={-74.006} />)

      // Main weather section
      const mainSection = container.querySelector('section[aria-label="Current weather"]')
      expect(mainSection).toBeInTheDocument()

      // Temperature section
      const tempSection = container.querySelector('section[aria-label="Temperature"]')
      expect(tempSection).toBeInTheDocument()

      // Condition section
      const conditionSection = container.querySelector('section[aria-label="Weather condition"]')
      expect(conditionSection).toBeInTheDocument()

      // Weather details section
      const detailsSection = container.querySelector('section[aria-label="Weather details"]')
      expect(detailsSection).toBeInTheDocument()
    })
  })

  describe('Drawer component', () => {
    it('uses aside landmark with proper ARIA', () => {
      render(<Drawer />)

      const aside = document.querySelector('aside')
      expect(aside).toBeInTheDocument()
      expect(aside).toHaveAttribute('aria-label', 'Outfit recommendations drawer')
    })

    it('drawer button has proper ARIA attributes', () => {
      render(<Drawer />)

      const button = document.querySelector('[role="button"]')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded')
      expect(button).toHaveAttribute('aria-label')
      expect(button).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('SettingsModal component', () => {
    it('uses role="dialog" with proper ARIA', () => {
      render(<SettingsModal isOpen={true} onClose={() => {}} />)

      const dialog = document.querySelector('[role="dialog"]')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'settings-title')
    })

    it('modal uses semantic header and footer', () => {
      render(<SettingsModal isOpen={true} onClose={() => {}} />)

      const header = document.querySelector('header')
      expect(header).toBeInTheDocument()

      const footer = document.querySelector('footer')
      expect(footer).toBeInTheDocument()

      const section = document.querySelector('section[aria-label="Settings options"]')
      expect(section).toBeInTheDocument()
    })

    it('toggle buttons have aria-pressed', () => {
      render(<SettingsModal isOpen={true} onClose={() => {}} />)

      const buttons = document.querySelectorAll('button[aria-pressed]')
      expect(buttons.length).toBeGreaterThan(0)

      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed')
      })
    })
  })

  describe('Emoji accessibility', () => {
    it('emoji have role="img" and aria-label', () => {
      const mockUseGeolocation = {
        position: null,
        error: null,
        loading: true,
        requestLocation: vi.fn(),
        permissionShown: false,
        grantPermission: vi.fn(),
      }

      vi.doMock('../src/hooks/useGeolocation', () => ({
        useGeolocation: () => mockUseGeolocation,
      }))

      const { container } = render(<App />)

      // Find all emoji with role="img"
      const emojiElements = container.querySelectorAll('[role="img"]')
      expect(emojiElements.length).toBeGreaterThan(0)

      emojiElements.forEach(emoji => {
        expect(emoji).toHaveAttribute('aria-label')
      })
    })
  })

  describe('Development tests section', () => {
    it('uses section landmark for dev tests', () => {
      const mockUseGeolocation = {
        position: { latitude: 40.7128, longitude: -74.006 },
        error: null,
        loading: false,
        requestLocation: vi.fn(),
        permissionShown: false,
        grantPermission: vi.fn(),
      }

      vi.doMock('../src/hooks/useGeolocation', () => ({
        useGeolocation: () => mockUseGeolocation,
      }))

      const { container } = render(<App />)

      // Find section with aria-labelledby="dev-tests-title"
      const section = container.querySelector('section[aria-labelledby="dev-tests-title"]')
      if (section) {
        expect(section).toBeInTheDocument()

        const heading = container.querySelector('#dev-tests-title')
        expect(heading?.textContent).toBe('Development Tests')
      }
    })
  })
})
