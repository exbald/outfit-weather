/**
 * Feature #68: Screen reader announces outfit
 * Tests that screen readers properly announce outfit recommendations
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Drawer } from '../Drawer'

describe('Feature #68: Screen reader announces outfit', () => {
  const mockOutfits = {
    now: {
      emojis: '🧥🧣👖🥾',
      oneLiner: 'Bundle up! Freezing cold outside',
      view: 'now' as const
    },
    today: {
      emojis: '👕👖🧥',
      oneLiner: 'Layers today - starts cool, warms up',
      view: 'today' as const,
      highTemp: 15,
      lowTemp: 5
    },
    tomorrow: {
      emojis: '👕👖🧢',
      oneLiner: 'Mild and pleasant day ahead',
      view: 'tomorrow' as const,
      highTemp: 20,
      lowTemp: 12
    }
  }

  describe('aria-live region setup', () => {
    it('should have aria-live="polite" on outfit panel', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={-5}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer to show outfit panel
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Check for aria-live region
      const panel = screen.getByRole('tabpanel')
      expect(panel).toHaveAttribute('aria-live', 'polite')
    })

    it('should include both emojis and one-liner in aria-label', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={-5}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Check aria-label includes both emojis and one-liner
      const panel = screen.getByRole('tabpanel')
      expect(panel).toHaveAttribute('aria-label')
      const ariaLabel = panel.getAttribute('aria-label') || ''

      // Should contain emojis
      expect(ariaLabel).toContain('🧥🧣👖🥾')

      // Should contain one-liner
      expect(ariaLabel).toContain('Bundle up! Freezing cold outside')

      // Should indicate it's an outfit recommendation
      expect(ariaLabel).toContain('Outfit recommendation for now')
    })
  })

  describe('Screen reader announcement on view change', () => {
    it('should update aria-label when switching to Today view', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={10}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Switch to Today view
      fireEvent.click(screen.getByRole('tab', { name: 'Today' }))

      await waitFor(() => {
        const panel = screen.getByRole('tabpanel')
        const ariaLabel = panel.getAttribute('aria-label') || ''

        // Should update to today's outfit
        expect(ariaLabel).toContain('👕👖🧥')
        expect(ariaLabel).toContain('Layers today - starts cool, warms up')
        expect(ariaLabel).toContain('Outfit recommendation for today')
      })
    })

    it('should update aria-label when switching to Tomorrow view', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={15}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Switch to Tomorrow view
      fireEvent.click(screen.getByRole('tab', { name: 'Tomorrow' }))

      await waitFor(() => {
        const panel = screen.getByRole('tabpanel')
        const ariaLabel = panel.getAttribute('aria-label') || ''

        // Should update to tomorrow's outfit
        expect(ariaLabel).toContain('👕👖🧢')
        expect(ariaLabel).toContain('Mild and pleasant day ahead')
        expect(ariaLabel).toContain('Outfit recommendation for tomorrow')
      })
    })

    it('should trigger aria-live announcement on content change', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={10}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      const panel = screen.getByRole('tabpanel')

      // Initial aria-label
      const initialLabel = panel.getAttribute('aria-label')

      // Switch views
      fireEvent.click(screen.getByRole('tab', { name: 'Today' }))

      await waitFor(() => {
        const newLabel = panel.getAttribute('aria-label')
        expect(newLabel).not.toBe(initialLabel)
        expect(newLabel).toContain('Layers today')
      })
    })
  })

  describe('Emoji accessibility', () => {
    it('should have role="img" on emoji container', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={-5}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Check emoji container has img role
      const emojiContainer = screen.getByRole('img', { name: /Outfit items:/i })
      expect(emojiContainer).toBeInTheDocument()
      expect(emojiContainer).toHaveAttribute('aria-label', 'Outfit items: 🧥🧣👖🥾')
    })

    it('should describe outfit items in aria-label', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={-5}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      const emojiContainer = screen.getByRole('img', { name: /Outfit items:/i })
      expect(emojiContainer).toHaveAttribute('aria-label')
      expect(emojiContainer.getAttribute('aria-label')).toBe('Outfit items: 🧥🧣👖🥾')
    })
  })

  describe('Fallback outfit accessibility', () => {
    it('should announce fallback outfit when weather data missing', async () => {
      render(
        <Drawer
          outfits={{
            now: null,
            today: null,
            tomorrow: null
          }}
          temperature={undefined}
          weatherCode={undefined}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      const panel = screen.getByRole('tabpanel')
      const ariaLabel = panel.getAttribute('aria-label') || ''

      // Should still announce something (fallback)
      expect(ariaLabel).toContain('Outfit recommendation for now')
      expect(ariaLabel).toContain('🤔')
    })
  })

  describe('Visual content matches screen reader', () => {
    it('should display one-liner text visibly', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={-5}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // One-liner should be visible
      const oneLiner = screen.getByText('Bundle up! Freezing cold outside')
      expect(oneLiner).toBeInTheDocument()
      expect(oneLiner).toHaveClass('text-xl', 'font-medium')
    })

    it('should display emojis visibly', async () => {
      render(
        <Drawer
          outfits={mockOutfits}
          temperature={-5}
          weatherCode={0}
          isDay={1}
        />
      )

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      // Emojis should be visible
      const emojis = screen.getByText('🧥🧣👖🥾')
      expect(emojis).toBeInTheDocument()
      expect(emojis).toHaveClass('text-6xl')
    })
  })
})
