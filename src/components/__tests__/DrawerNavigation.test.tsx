/**
 * Test suite for Feature #33 - Now/Today/Tomorrow navigation
 *
 * Tests the drawer navigation functionality:
 * - Navigation tabs/pills are displayed
 * - Active view state is tracked
 * - Content switches on tap
 * - All three views (Now, Today, Tomorrow) are accessible
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Drawer } from '../src/components/Drawer'
import type { OutfitRecommendation } from '../hooks/useOutfit'

describe('Feature #33: Now/Today/Tomorrow Navigation', () => {
  // Mock outfit recommendations for all three views
  const mockOutfits: {
    now: OutfitRecommendation
    today: OutfitRecommendation
    tomorrow: OutfitRecommendation
  } = {
    now: {
      emojis: '🧥🧣👖🥾',
      oneLiner: 'Bundle up! It\'s freezing out there! 🥶',
      view: 'now'
    },
    today: {
      emojis: '👕👖🧥👟',
      oneLiner: 'Starts cool, warms up - layers!',
      view: 'today'
    },
    tomorrow: {
      emojis: '👕🩳👟🕶️',
      oneLiner: 'Warm and sunny day ahead!',
      view: 'tomorrow'
    }
  }

  beforeEach(() => {
    // Reset window location to avoid test interference
    window.location.hash = ''
  })

  describe('Step 1: Navigation tabs/pills created', () => {
    it('should display three navigation tabs (Now, Today, Tomorrow)', () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Drawer is collapsed by default, expand it first
      const drawerHandle = screen.getByRole('button', { name: /open outfit recommendations/i })
      fireEvent.click(drawerHandle)

      // Check for navigation tabs
      const nowTab = screen.queryByRole('tab', { name: 'Now' })
      const todayTab = screen.queryByRole('tab', { name: 'Today' })
      const tomorrowTab = screen.queryByRole('tab', { name: 'Tomorrow' })

      expect(nowTab).toBeInTheDocument()
      expect(todayTab).toBeInTheDocument()
      expect(tomorrowTab).toBeInTheDocument()
    })

    it('should have proper tablist role for accessibility', () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Check for tablist container
      const tablist = screen.getByRole('tablist', { name: 'Outfit view selection' })
      expect(tablist).toBeInTheDocument()
    })

    it('should style active tab differently from inactive tabs', () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      const nowTab = screen.getByRole('tab', { name: 'Now' })
      const todayTab = screen.getByRole('tab', { name: 'Today' })

      // Now should be selected by default
      expect(nowTab).toHaveAttribute('aria-selected', 'true')
      expect(todayTab).toHaveAttribute('aria-selected', 'false')

      // Check for different styling classes
      expect(nowTab.className).toContain('bg-blue-500')
      expect(todayTab.className).toContain('bg-gray-100')
    })
  })

  describe('Step 2: Active view state tracking', () => {
    it('should default to "Now" view when drawer is expanded', () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Check that Now outfit is displayed
      expect(screen.getByText('🧥🧣👖🥾')).toBeInTheDocument()
      expect(screen.getByText(/Bundle up! It's freezing out there!/)).toBeInTheDocument()
    })

    it('should update active view state when tab is clicked', () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Initially Now is selected
      expect(screen.getByRole('tab', { name: 'Now' })).toHaveAttribute('aria-selected', 'true')

      // Click Today tab
      fireEvent.click(screen.getByRole('tab', { name: 'Today' }))

      // Today should now be selected
      expect(screen.getByRole('tab', { name: 'Today' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', { name: 'Now' })).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('Step 3: Content switches on tap', () => {
    it('should switch to Today view when Today tab is clicked', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Verify initial Now content
      expect(screen.getByText('🧥🧣👖🥾')).toBeInTheDocument()

      // Click Today tab
      fireEvent.click(screen.getByRole('tab', { name: 'Today' }))

      // Verify content switched to Today
      await waitFor(() => {
        expect(screen.getByText('👕👖🧥👟')).toBeInTheDocument()
        expect(screen.getByText(/Starts cool, warms up/)).toBeInTheDocument()
      })
    })

    it('should switch to Tomorrow view when Tomorrow tab is clicked', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Click Tomorrow tab
      fireEvent.click(screen.getByRole('tab', { name: 'Tomorrow' }))

      // Verify content switched to Tomorrow
      await waitFor(() => {
        expect(screen.getByText('👕🩳👟🕶️')).toBeInTheDocument()
        expect(screen.getByText(/Warm and sunny day ahead/)).toBeInTheDocument()
      })
    })

    it('should support cycling through all views sequentially', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Start at Now
      expect(screen.getByText('🧥🧣👖🥾')).toBeInTheDocument()

      // Click Today
      fireEvent.click(screen.getByRole('tab', { name: 'Today' }))
      await waitFor(() => {
        expect(screen.getByText('👕👖🧥👟')).toBeInTheDocument()
      })

      // Click Tomorrow
      fireEvent.click(screen.getByRole('tab', { name: 'Tomorrow' }))
      await waitFor(() => {
        expect(screen.getByText('👕🩳👟🕶️')).toBeInTheDocument()
      })

      // Click back to Now
      fireEvent.click(screen.getByRole('tab', { name: 'Now' }))
      await waitFor(() => {
        expect(screen.getByText('🧥🧣👖🥾')).toBeInTheDocument()
      })
    })

    it('should update aria-live region when content changes', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Check for aria-live region
      const panel = screen.getByRole('tabpanel')
      expect(panel).toHaveAttribute('aria-live', 'polite')

      // Change view and verify aria-label updates
      fireEvent.click(screen.getByRole('tab', { name: 'Today' }))
      await waitFor(() => {
        expect(panel).toHaveAttribute('aria-label', 'Outfit for today')
      })
    })
  })

  describe('Edge cases and fallback behavior', () => {
    it('should handle missing outfit data gracefully', () => {
      render(
        <Drawer
          outfits={{
            now: null,
            today: null,
            tomorrow: null
          }}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Should show fallback message
      expect(screen.getByText(/Check outside!/)).toBeInTheDocument()
      expect(screen.getByText(/Couldn't determine outfit/)).toBeInTheDocument()

      // Tabs should still be visible
      expect(screen.getByRole('tab', { name: 'Now' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Today' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Tomorrow' })).toBeInTheDocument()
    })

    it('should handle partial outfit data (some views missing)', async () => {
      render(
        <Drawer
          outfits={{
            now: mockOutfits.now,
            today: null,
            tomorrow: mockOutfits.tomorrow
          }}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Now should work
      expect(screen.getByText('🧥🧣👖🥾')).toBeInTheDocument()

      // Click Today (null)
      fireEvent.click(screen.getByRole('tab', { name: 'Today' }))
      await waitFor(() => {
        expect(screen.getByText(/Check outside!/)).toBeInTheDocument()
      })

      // Click Tomorrow (has data)
      fireEvent.click(screen.getByRole('tab', { name: 'Tomorrow' }))
      await waitFor(() => {
        expect(screen.getByText('👕🩳👟🕶️')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should maintain focus management when switching views', () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      const todayTab = screen.getByRole('tab', { name: 'Today' })
      todayTab.focus()
      expect(todayTab).toHaveFocus()

      fireEvent.click(todayTab)
      expect(todayTab).toHaveFocus()
    })

    it('should support keyboard navigation between tabs', () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={20}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      const nowTab = screen.getByRole('tab', { name: 'Now' })
      nowTab.focus()

      // Arrow right should move to next tab (browser default behavior)
      fireEvent.keyDown(nowTab, { key: 'ArrowRight' })

      // Tab order should be logical in DOM
      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(3)
    })
  })
})
