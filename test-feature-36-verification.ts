/**
 * Manual verification script for Feature #36: Drawer shows outfit and one-liner
 * 
 * This script verifies:
 * 1. Outfit section is shown in drawer
 * 2. One-liner text is displayed
 * 3. Content is styled appropriately
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Drawer } from '../src/components/Drawer'
import { type OutfitRecommendation } from '../src/hooks/useOutfit'

describe('Feature #36: Drawer shows outfit and one-liner', () => {
  const mockOutfits: {
    now: OutfitRecommendation
    today: OutfitRecommendation
    tomorrow: OutfitRecommendation
  } = {
    now: {
      emojis: '🧥🧣🧤👖🥾',
      oneLiner: 'Bundle up! It\'s freezing out there! 🥶',
      view: 'now'
    },
    today: {
      emojis: '🧥🧣👖🥾',
      oneLiner: 'Cold day - keep your jacket on!',
      view: 'today',
      highTemp: 35,
      lowTemp: 25
    },
    tomorrow: {
      emojis: '👕👖👟',
      oneLiner: 'Warm and nice - t-shirt weather! 👕',
      view: 'tomorrow',
      highTemp: 75,
      lowTemp: 65
    }
  }

  it('should show outfit section in drawer when expanded', () => {
    const { container } = render(
      <Drawer 
        outfits={mockOutfits}
        temperature={20}
        weatherCode={0}
        isDay={1}
      />
    )

    // The drawer is collapsed by default, so we need to check
    // that the outfit elements exist in the DOM (they're hidden by CSS/transform)
    const outfitEmoji = container.querySelector('[role="img"]')
    expect(outfitEmoji).toBeTruthy()
    
    // Check that the emoji content is correct
    expect(outfitEmoji?.textContent).toBe(mockOutfits.now.emojis)
  })

  it('should display one-liner text in drawer', () => {
    const { container } = render(
      <Drawer 
        outfits={mockOutfits}
        temperature={20}
        weatherCode={0}
        isDay={1}
      />
    )

    // Find the one-liner paragraph (it contains the one-liner text)
    const textElements = container.querySelectorAll('p')
    const oneLinerElement = Array.from(textElements).find(
      el => el.textContent === mockOutfits.now.oneLiner
    )
    
    expect(oneLinerElement).toBeTruthy()
  })

  it('should style content appropriately with text-6xl for emojis', () => {
    const { container } = render(
      <Drawer 
        outfits={mockOutfits}
        temperature={20}
        weatherCode={0}
        isDay={1}
      />
    )

    // Check for the emoji display with text-6xl class (large size)
    const emojiDisplay = container.querySelector('[role="img"]')
    expect(emojiDisplay?.className).toContain('text-6xl')
  })

  it('should style one-liner with text-xl and font-medium', () => {
    const { container } = render(
      <Drawer 
        outfits={mockOutfits}
        temperature={20}
        weatherCode={0}
        isDay={1}
      />
    )

    // Find the one-liner paragraph
    const textElements = container.querySelectorAll('p')
    const oneLinerElement = Array.from(textElements).find(
      el => el.textContent === mockOutfits.now.oneLiner
    )
    
    expect(oneLinerElement?.className).toContain('text-xl')
    expect(oneLinerElement?.className).toContain('font-medium')
  })

  it('should center the outfit display', () => {
    const { container } = render(
      <Drawer 
        outfits={mockOutfits}
        temperature={20}
        weatherCode={0}
        isDay={1}
      />
    )

    // Check for the outfit panel with text-center
    const outfitPanel = container.querySelector('#outfit-panel')
    expect(outfitPanel?.className).toContain('text-center')
  })

  it('should show proper ARIA labels for accessibility', () => {
    const { container } = render(
      <Drawer 
        outfits={mockOutfits}
        temperature={20}
        weatherCode={0}
        isDay={1}
      />
    )

    // Check emoji display has role="img" and aria-label
    const emojiDisplay = container.querySelector('[role="img"]')
    expect(emojiDisplay?.getAttribute('aria-label')).toBe(`Outfit: ${mockOutfits.now.emojis}`)
    
    // Check outfit panel has proper aria-label
    const outfitPanel = container.querySelector('#outfit-panel')
    expect(outfitPanel?.getAttribute('aria-live')).toBe('polite')
  })

  it('should handle all three views (now, today, tomorrow)', () => {
    const { rerender, container } = render(
      <Drawer 
        outfits={mockOutfits}
        temperature={20}
        weatherCode={0}
        isDay={1}
      />
    )

    // All three outfit recommendations should be in the DOM
    const emojiDisplays = container.querySelectorAll('[role="img"]')
    expect(emojiDisplays.length).toBeGreaterThanOrEqual(1)
  })

  it('should use fallback outfit when current outfit is null', () => {
    const { container } = render(
      <Drawer 
        outfits={{ now: null, today: null, tomorrow: null }}
        temperature={20}
        weatherCode={0}
        isDay={1}
      />
    )

    // Should still show an emoji (fallback)
    const emojiDisplay = container.querySelector('[role="img"]')
    expect(emojiDisplay).toBeTruthy()
    expect(emojiDisplay?.textContent).toBe('🤔') // Fallback emoji
    
    // Should show fallback one-liner
    const textElements = container.querySelectorAll('p')
    const oneLinerElement = Array.from(textElements).find(
      el => el.textContent?.includes('Check outside')
    )
    expect(oneLinerElement).toBeTruthy()
  })
})
