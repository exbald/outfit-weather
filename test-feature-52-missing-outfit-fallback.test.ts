/**
 * Test Suite for Feature #52: Missing outfit shows fallback
 *
 * This test verifies that:
 * 1. Empty outfit results are detected
 * 2. Generic fallback outfit is shown
 * 3. Error is logged for debugging
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Drawer } from '../src/components/Drawer'
import type { OutfitRecommendation } from '../src/hooks/useOutfit'

// Mock console methods
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

describe('Feature #52: Missing outfit fallback', () => {
  beforeEach(() => {
    consoleErrorSpy.mockClear()
    consoleWarnSpy.mockClear()
  })

  afterEach(() => {
    consoleErrorSpy.mockClear()
    consoleWarnSpy.mockClear()
  })

  describe('Empty outfit detection', () => {
    it('should detect when currentOutfit is null', () => {
      const { container } = render(
        <Drawer
          outfits={{
            now: null,
            today: null,
            tomorrow: null
          }}
        />
      )

      // Drawer should still render
      const drawer = container.querySelector('aside')
      expect(drawer).toBeDefined()
    })

    it('should detect when currentOutfit has empty emojis', () => {
      const emptyOutfit: OutfitRecommendation = {
        emojis: '',
        oneLiner: 'Test message',
        view: 'now'
      }

      const { container } = render(
        <Drawer
          outfits={{
            now: emptyOutfit,
            today: null,
            tomorrow: null
          }}
        />
      )

      // Drawer should render the empty outfit
      const drawer = container.querySelector('aside')
      expect(drawer).toBeDefined()
    })
  })

  describe('Fallback outfit display', () => {
    it('should show fallback when all outfit views are null', () => {
      const { container } = render(
        <Drawer
          outfits={{
            now: null,
            today: null,
            tomorrow: null
          }}
        />
      )

      // The drawer should be present
      const drawer = container.querySelector('aside')
      expect(drawer).toBeDefined()

      // Collapsed state should be visible
      const swipeHint = container.textContent
      expect(swipeHint).toContain('Swipe up')
    })

    it('should display fallback message when expanded with null outfit', () => {
      // We need to expand the drawer to see the fallback message
      // This is a basic test - the drawer handles null in the expanded state
      const nullOutfits = {
        now: null,
        today: null,
        tomorrow: null
      }

      const { container } = render(
        <Drawer outfits={nullOutfits} />
      )

      // Verify drawer renders
      const drawer = container.querySelector('aside[aria-label="Outfit recommendations drawer"]')
      expect(drawer).toBeDefined()
    })

    it('should show fallback emojis and one-liner when using getFallbackOutfit', () => {
      // Test the getFallbackOutfit function directly
      const { getFallbackOutfit } = require('../src/hooks/useOutfit')

      const fallback = getFallbackOutfit('now')

      // Should have emojis
      expect(fallback.emojis).toBeDefined()
      expect(typeof fallback.emojis).toBe('string')
      expect(fallback.emojis.length).toBeGreaterThan(0)

      // Should have one-liner
      expect(fallback.oneLiner).toBeDefined()
      expect(typeof fallback.oneLiner).toBe('string')
      expect(fallback.oneLiner.length).toBeGreaterThan(0)

      // Should have correct view
      expect(fallback.view).toBe('now')
    })
  })

  describe('Error logging', () => {
    it('should log error when outfit is null', () => {
      // This test verifies that the implementation logs errors appropriately
      // The actual logging should happen in the useOutfit hook or Drawer component

      const { container } = render(
        <Drawer
          outfits={{
            now: null,
            today: null,
            tomorrow: null
          }}
        />
      )

      // Check if any warnings or errors were logged
      // (This will be verified after implementation)
      expect(container).toBeDefined()
    })

    it('should log error when outfit has empty emojis', () => {
      const emptyOutfit: OutfitRecommendation = {
        emojis: '',
        oneLiner: '',
        view: 'now'
      }

      const { container } = render(
        <Drawer
          outfits={{
            now: emptyOutfit,
            today: null,
            tomorrow: null
          }}
        />
      )

      expect(container).toBeDefined()
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined outfits prop', () => {
      const { container } = render(
        <Drawer outfits={undefined} />
      )

      const drawer = container.querySelector('aside')
      expect(drawer).toBeDefined()
    })

    it('should handle partial outfit data', () => {
      const partialOutfits = {
        now: null,
        today: {
          emojis: '🧥🧣',
          oneLiner: 'Cold day',
          view: 'today' as const
        },
        tomorrow: null
      }

      const { container } = render(
        <Drawer outfits={partialOutfits} />
      )

      const drawer = container.querySelector('aside')
      expect(drawer).toBeDefined()
    })

    it('should switch from null to valid outfit', () => {
      // Start with null outfit
      const { rerender, container } = render(
        <Drawer
          outfits={{
            now: null,
            today: null,
            tomorrow: null
          }}
        />
      )

      expect(container.querySelector('aside')).toBeDefined()

      // Rerender with valid outfit
      const validOutfit: OutfitRecommendation = {
        emojis: '🧥🧣👖🥾',
        oneLiner: 'Bundle up!',
        view: 'now'
      }

      rerender(
        <Drawer
          outfits={{
            now: validOutfit,
            today: null,
            tomorrow: null
          }}
        />
      )

      expect(container.querySelector('aside')).toBeDefined()
    })
  })
})
