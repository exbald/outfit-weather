import { useState, useRef, TouchEvent, useEffect } from 'react'
import { useAdaptiveTextColors } from '../hooks/useAdaptiveTextColors'
import { getFallbackOutfit, type OutfitRecommendation } from '../hooks/useOutfit'
import { useSettings } from '../hooks/useSettings'
import { useDrawerSpring } from '../hooks/useSpringAnimation'

/**
 * Drawer component for outfit recommendations
 * Shows a collapsed peek/handle at bottom of screen, expands on interaction
 * Supports swipe-up gesture to expand, swipe-down/click to collapse
 *
 * Features:
 * - Swipe-up gesture to expand drawer (Feature #28)
 * - Tap outside drawer (backdrop) to close (Feature #30)
 * - Swipe-down gesture or tap handle to collapse
 * - Spring physics animation (Feature #31)
 * - Keyboard accessible (Escape key to close, Enter/Space to toggle)
 *
 * Accessibility:
 * - Drawer uses fixed white background (frosted glass effect)
 * - Text colors optimized for white background
 * - WCAG AA compliant contrast ratios
 * - Modal behavior when expanded (backdrop + aria-modal)
 */

interface DrawerProps {
  /** All outfit recommendations for switching between views */
  outfits?: {
    now: OutfitRecommendation | null
    today: OutfitRecommendation | null
    tomorrow: OutfitRecommendation | null
  }
  /** Weather data for adaptive text colors on drawer (white background always) */
  temperature?: number
  weatherCode?: number
  isDay?: number
}

/**
 * Drawer component for outfit recommendations
 * Shows a collapsed peek/handle at bottom of screen, expands on interaction
 * Supports swipe-up gesture to expand, swipe-down/click to collapse
 *
 * Accessibility:
 * - Drawer uses fixed white background (frosted glass effect)
 * - Text colors optimized for white background
 * - WCAG AA compliant contrast ratios
 */
export function Drawer({ outfits, temperature, weatherCode, isDay }: DrawerProps) {
  // Spring animation for drawer open/close (Feature #31)
  const { currentValue: springValue, expand, collapse } = useDrawerSpring()

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [activeView, setActiveView] = useState<'now' | 'today' | 'tomorrow'>('now')

  // Determine if drawer is expanded based on spring value
  const isExpanded = springValue > 0.5

  // Get temperature unit setting
  const { settings } = useSettings()

  // Get the current outfit based on active view
  const currentOutfit = outfits?.[activeView] ?? null

  // Log error when outfit is missing (Feature #52)
  useEffect(() => {
    if (isExpanded && !currentOutfit) {
      console.error(
        `[OutFitWeather] Missing outfit data for view "${activeView}". ` +
        `This may indicate incomplete weather data or outfit logic failure. ` +
        `Using fallback outfit.`
      )
    }
  }, [isExpanded, currentOutfit, activeView])

  // Get fallback outfit when current outfit is null (Feature #52)
  const displayOutfit = currentOutfit ?? getFallbackOutfit(activeView)

  // Handle Escape key to close drawer (accessibility enhancement)
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (isExpanded && e.key === 'Escape') {
        collapseDrawer()
      }
    }

    if (isExpanded) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isExpanded])

  const touchStartY = useRef<number>(0)
  const touchStartTime = useRef<number>(0)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in pixels) to trigger expand/collapse
  const SWIPE_THRESHOLD = 50
  // Minimum swipe velocity (in pixels/ms) to trigger expand/collapse
  const VELOCITY_THRESHOLD = 0.5
  // Maximum drag distance (prevents dragging drawer off-screen)
  const MAX_DRAG_OFFSET = 300

  // Drawer always has white/semi-transparent background
  // Use adaptive colors for white background (fallback to cool light color)
  const { classes: textColors } = useAdaptiveTextColors(
    temperature ?? 15, // Default mild temperature for white background
    weatherCode ?? 0,
    isDay ?? 1
  )

  const toggleDrawer = () => {
    if (isExpanded) {
      collapse()
    } else {
      expand()
    }
  }

  const expandDrawer = () => {
    expand()
  }

  const collapseDrawer = () => {
    collapse()
  }

  // Touch start - record initial position and time
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY
    touchStartTime.current = Date.now()
    setIsDragging(true)
    setDragOffset(0)
  }

  // Touch move - track drag distance for visual feedback
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const currentY = e.touches[0].clientY
    const deltaY = touchStartY.current - currentY

    // Only allow upward swipes when collapsed, downward swipes when expanded
    if (!isExpanded && deltaY > 0) {
      // Upward swipe on collapsed drawer
      setDragOffset(Math.min(deltaY, MAX_DRAG_OFFSET))
    } else if (isExpanded && deltaY < 0) {
      // Downward swipe on expanded drawer
      setDragOffset(Math.max(deltaY, -MAX_DRAG_OFFSET))
    }
  }

  // Touch end - determine if swipe should trigger expand/collapse
  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const touchEndY = e.changedTouches[0].clientY
    const deltaY = touchStartY.current - touchEndY
    const deltaTime = Date.now() - touchStartTime.current
    const velocity = Math.abs(deltaY) / deltaTime

    // Reset dragging state
    setIsDragging(false)
    setDragOffset(0)

    // Check if swipe meets distance OR velocity threshold
    const meetsDistanceThreshold = Math.abs(deltaY) >= SWIPE_THRESHOLD
    const meetsVelocityThreshold = velocity >= VELOCITY_THRESHOLD

    if (!isExpanded) {
      // Collapsed: expand on upward swipe
      if (deltaY > 0 && (meetsDistanceThreshold || meetsVelocityThreshold)) {
        expandDrawer()
      }
    } else {
      // Expanded: collapse on downward swipe
      if (deltaY < 0 && (meetsDistanceThreshold || meetsVelocityThreshold)) {
        collapseDrawer()
      }
    }
  }

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-40"
      aria-label="Outfit recommendations drawer"
    >
      {/* Backdrop overlay - closes drawer when tapped (Feature #30) */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm cursor-pointer"
          onClick={collapseDrawer}
          aria-hidden="true"
          data-testid="drawer-backdrop"
        />
      )}

      <div className="max-w-md mx-auto relative">
        {/* Collapsed state - drawer handle bar */}
        <div
          ref={drawerRef}
          className="bg-white/80 backdrop-blur-md rounded-t-3xl shadow-lg border-t border-black/5 cursor-pointer will-change-transform"
          style={{
            // Combine spring animation value with drag offset
            // springValue: 0 = collapsed (translated down), 1 = expanded (no translation)
            // We animate from translateY(100%) to translateY(0)
            transform: isDragging
              ? `translateY(${isExpanded ? dragOffset : -dragOffset}px)`
              : `translateY(${(1 - springValue) * 100}%)`,
            // Smooth scale effect during spring animation
            scale: isDragging ? 1 : 0.97 + (springValue * 0.03),
            // Subtle opacity change during animation
            opacity: 0.5 + (springValue * 0.5),
          }}
          onClick={toggleDrawer}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role={isExpanded ? "dialog" : "button"}
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-modal={isExpanded ? "true" : undefined}
          aria-label={isExpanded ? "Outfit recommendations dialog with navigation" : "Open outfit recommendations"}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleDrawer()
            }
          }}
        >
          {/* Collapsed state content */}
          {!isExpanded && (
            <div className="flex flex-col items-center pt-2 pb-4 px-4">
              {/* Handle indicator - visual cue that this is interactive */}
              <div
                className="w-12 h-1.5 bg-gray-400 rounded-full mb-2"
                aria-hidden="true"
              />
              {/* Swipe hint text - use tertiary color for better contrast on white */}
              <p className={`text-sm font-medium ${textColors.secondary}`}>
                Swipe up · What to wear
              </p>
            </div>
          )}

          {/* Expanded state content */}
          {isExpanded && (
            <div className="p-6">
              {/* Handle indicator for closing */}
              <div
                className="w-12 h-1.5 bg-gray-400 rounded-full mx-auto mb-4"
                aria-hidden="true"
              />

              {/* Navigation tabs/pills */}
              <div
                className="flex items-center justify-center gap-2 mb-4"
                role="tablist"
                aria-label="Outfit view selection"
              >
                {(['now', 'today', 'tomorrow'] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    role="tab"
                    aria-selected={activeView === view}
                    aria-controls="outfit-panel"
                    onClick={() => setActiveView(view)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${activeView === view
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>

              {/* Large emoji outfit display and one-liner - both in aria-live region */}
              <div
                id="outfit-panel"
                role="tabpanel"
                aria-live="polite"
                aria-label={`Outfit recommendation for ${activeView}: ${displayOutfit.emojis}, ${displayOutfit.oneLiner}`}
                className="text-center mb-3"
              >
                <div
                  className="text-6xl leading-none transition-all duration-300"
                  role="img"
                  aria-label={`Outfit items: ${displayOutfit.emojis}`}
                >
                  {displayOutfit.emojis}
                </div>

                {/* Friendly one-liner text - announced by screen reader */}
                <p className={`text-center text-xl font-medium ${textColors.primary} transition-all duration-300 mt-3`}>
                  {displayOutfit.oneLiner}
                </p>
              </div>

              {/* High/Low temperature display for Today and Tomorrow views (Feature #61) */}
              {(activeView === 'today' || activeView === 'tomorrow') && displayOutfit.highTemp !== undefined && displayOutfit.lowTemp !== undefined && (
                <div className="text-center mt-3">
                  <span className={`text-sm font-medium ${textColors.secondary}`}>
                    High: {Math.round(displayOutfit.highTemp)}°{settings.temperatureUnit} · Low: {Math.round(displayOutfit.lowTemp)}°{settings.temperatureUnit}
                  </span>
                </div>
              )}

              {/* Fallback indicator (only shown when using fallback) */}
              {!currentOutfit && (
                <p className={`text-center text-xs mt-2 ${textColors.tertiary} italic`}>
                  Couldn't determine outfit recommendation
                </p>
              )}

              {/* Navigation hint */}
              <p className={`text-center text-sm mt-4 ${textColors.secondary}`}>
                Tap or swipe down to close
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
