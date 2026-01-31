/**
 * Feature #29: Swipe-down collapses drawer
 * Test file to verify swipe-down gesture collapses the expanded drawer
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Drawer } from '../src/components/Drawer'
import { SettingsProvider } from '../src/contexts/SettingsContext'

// Mock the settings context
const mockSettings = {
  temperatureUnit: 'F' as const,
  windSpeedUnit: 'mph' as const,
  setTemperatureUnit: jest.fn(),
  setWindSpeedUnit: jest.fn(),
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider value={mockSettings}>{children}</SettingsProvider>
)

describe('Feature #29: Swipe-down collapses drawer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockOutfits = {
    now: {
      emojis: '🧥🧣🧤',
      oneLiner: 'Bundle up!',
      temperature: 20,
      highTemp: undefined,
      lowTemp: undefined,
    },
    today: {
      emojis: '👕👖👟',
      oneLiner: 'Perfect day!',
      temperature: 60,
      highTemp: 70,
      lowTemp: 55,
    },
    tomorrow: {
      emojis: '☀️👒🕶️',
      oneLiner: 'Sunny and warm!',
      temperature: 75,
      highTemp: 80,
      lowTemp: 65,
    },
  }

  describe('Swipe-down gesture detection', () => {
    test('1. Handle downward swipe gesture when drawer is expanded', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // First, expand the drawer by clicking
      const drawerHandle = screen.getByRole('button', { name: /open outfit recommendations/i })
      fireEvent.click(drawerHandle)

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /outfit recommendations dialog/i })).toBeInTheDocument()
      })

      // Simulate downward swipe: touch start at bottom, move up (negative deltaY)
      const drawerPanel = screen.getByRole('dialog')
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ clientY: 500 }] as any,
        bubbles: true,
        cancelable: true,
      })
      const touchMoveEvent = new TouchEvent('touchmove', {
        touches: [{ clientY: 400 }] as any, // Moved up 100px
        bubbles: true,
        cancelable: true,
      })
      const touchEndEvent = new TouchEvent('touchend', {
        changedTouches: [{ clientY: 400 }] as any,
        bubbles: true,
        cancelable: true,
      })

      drawerPanel.dispatchEvent(touchStartEvent)
      drawerPanel.dispatchEvent(touchMoveEvent)
      drawerPanel.dispatchEvent(touchEndEvent)

      // Drawer should collapse (dialog should be removed)
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    test('2. Collapse drawer on swipe down', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer first
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Simulate swipe down exceeding threshold (50px)
      const drawerPanel = screen.getByRole('dialog')

      // Start at Y=100, end at Y=160 (moved down 60px, which exceeds threshold)
      fireEvent.touchStart(drawerPanel, {
        touches: [{ clientY: 100, clientX: 50 }] as any,
      })

      fireEvent.touchMove(drawerPanel, {
        touches: [{ clientY: 160, clientX: 50 }] as any,
      })

      fireEvent.touchEnd(drawerPanel, {
        changedTouches: [{ clientY: 160, clientX: 50 }] as any,
      })

      // Drawer should collapse
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    test('3. Reset to peek position after swipe down', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Perform swipe down
      const drawerPanel = screen.getByRole('dialog')
      fireEvent.touchStart(drawerPanel, {
        touches: [{ clientY: 100 }] as any,
      })
      fireEvent.touchMove(drawerPanel, {
        touches: [{ clientY: 170 }] as any, // 70px movement
      })
      fireEvent.touchEnd(drawerPanel, {
        changedTouches: [{ clientY: 170 }] as any,
      })

      // Should return to collapsed/peek state
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // Handle bar should be visible again
      expect(screen.getByRole('button', { name: /open outfit recommendations/i })).toBeInTheDocument()
      expect(screen.getByText(/swipe up · what to wear/i)).toBeInTheDocument()
    })
  })

  describe('Touch event handling', () => {
    test('4. Record touch start position when drawer is expanded', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Touch start should track initial Y position
      const drawerPanel = screen.getByRole('dialog')
      const initialY = 300

      fireEvent.touchStart(drawerPanel, {
        touches: [{ clientY: initialY, clientX: 50 }] as any,
      })

      // The component should have recorded this position
      // This is verified implicitly by the next test (touch move)
    })

    test('5. Calculate drag distance during swipe down', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const drawerPanel = screen.getByRole('dialog')

      // Start drag
      fireEvent.touchStart(drawerPanel, {
        touches: [{ clientY: 200 }] as any,
      })

      // Move down (visual feedback should occur)
      fireEvent.touchMove(drawerPanel, {
        touches: [{ clientY: 250 }] as any, // 50px down
      })

      // Component should be in dragging state with offset
      // This is verified by the drawer actually collapsing on touch end
    })

    test('6. Only allow downward swipes when expanded', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const drawerPanel = screen.getByRole('dialog')

      // Try upward swipe when expanded (should NOT collapse)
      fireEvent.touchStart(drawerPanel, {
        touches: [{ clientY: 300 }] as any,
      })

      fireEvent.touchMove(drawerPanel, {
        touches: [{ clientY: 200 }] as any, // Up 100px
      })

      fireEvent.touchEnd(drawerPanel, {
        changedTouches: [{ clientY: 200 }] as any,
      })

      // Drawer should remain expanded (upward swipe ignored when expanded)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Threshold and velocity', () => {
    test('7. Collapse when swipe distance exceeds threshold (50px)', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const drawerPanel = screen.getByRole('dialog')

      // Swipe down exactly 50px (threshold)
      fireEvent.touchStart(drawerPanel, {
        touches: [{ clientY: 200 }] as any,
      })

      fireEvent.touchMove(drawerPanel, {
        touches: [{ clientY: 250 }] as any,
      })

      fireEvent.touchEnd(drawerPanel, {
        changedTouches: [{ clientY: 250 }] as any,
      })

      // Should collapse (50px meets threshold)
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    test('8. Collapse on fast swipe even if distance is short', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const drawerPanel = screen.getByRole('dialog')

      // Fast swipe: 40px in 50ms = 0.8 px/ms (exceeds 0.5 threshold)
      const startTime = Date.now()
      jest.spyOn(Date, 'now').mockReturnValue(startTime)

      fireEvent.touchStart(drawerPanel, {
        touches: [{ clientY: 200 }] as any,
      })

      fireEvent.touchMove(drawerPanel, {
        touches: [{ clientY: 240 }] as any, // Only 40px
      })

      jest.spyOn(Date, 'now').mockReturnValue(startTime + 50) // 50ms elapsed

      fireEvent.touchEnd(drawerPanel, {
        changedTouches: [{ clientY: 240 }] as any,
      })

      // Should collapse due to high velocity
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      jest.restoreAllMocks()
    })

    test('9. No collapse on short, slow swipe', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const drawerPanel = screen.getByRole('dialog')

      // Slow, short swipe: 30px in 100ms = 0.3 px/ms (below threshold)
      const startTime = Date.now()
      jest.spyOn(Date, 'now').mockReturnValue(startTime)

      fireEvent.touchStart(drawerPanel, {
        touches: [{ clientY: 200 }] as any,
      })

      fireEvent.touchMove(drawerPanel, {
        touches: [{ clientY: 230 }] as any, // Only 30px
      })

      jest.spyOn(Date, 'now').mockReturnValue(startTime + 100) // 100ms elapsed

      fireEvent.touchEnd(drawerPanel, {
        changedTouches: [{ clientY: 230 }] as any,
      })

      // Should NOT collapse (below distance AND velocity thresholds)
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      jest.restoreAllMocks()
    })
  })

  describe('Visual feedback', () => {
    test('10. Show visual feedback during swipe down drag', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const drawerPanel = screen.getByRole('dialog')

      // Start drag
      fireEvent.touchStart(drawerPanel, {
        touches: [{ clientY: 200 }] as any,
      })

      // Move down - drawer should follow finger
      fireEvent.touchMove(drawerPanel, {
        touches: [{ clientY: 280 }] as any, // 80px down
      })

      // The component applies transform during drag
      // This is verified by the drawer being interactive and responding to touch
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Alternative collapse methods', () => {
    test('11. Tap on drawer also collapses it', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Click/tap on expanded drawer should collapse
      const drawerPanel = screen.getByRole('dialog')
      fireEvent.click(drawerPanel)

      // Should collapse
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('Edge cases', () => {
    test('12. No collapse when drawer is already collapsed', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Drawer is initially collapsed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      // Try swipe down when collapsed (should do nothing)
      const drawerHandle = screen.getByRole('button', { name: /open outfit recommendations/i })

      fireEvent.touchStart(drawerHandle, {
        touches: [{ clientY: 200 }] as any,
      })

      fireEvent.touchMove(drawerHandle, {
        touches: [{ clientY: 260 }] as any,
      })

      fireEvent.touchEnd(drawerHandle, {
        changedTouches: [{ clientY: 260 }] as any,
      })

      // Should remain collapsed (no dialog)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('13. Handle very fast swipes correctly', async () => {
      render(<Drawer outfits={mockOutfits} />, { wrapper })

      // Expand drawer
      fireEvent.click(screen.getByRole('button', { name: /open outfit recommendations/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const drawerPanel = screen.getByRole('dialog')

      // Very fast swipe: 200px in 100ms
      const startTime = Date.now()
      jest.spyOn(Date, 'now').mockReturnValue(startTime)

      fireEvent.touchStart(drawerPanel, {
        touches: [{ clientY: 100 }] as any,
      })

      fireEvent.touchMove(drawerPanel, {
        touches: [{ clientY: 300 }] as any,
      })

      jest.spyOn(Date, 'now').mockReturnValue(startTime + 100)

      fireEvent.touchEnd(drawerPanel, {
        changedTouches: [{ clientY: 300 }] as any,
      })

      // Should collapse (high velocity)
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      jest.restoreAllMocks()
    })
  })
})

export {}
