import { useState, useRef, TouchEvent, useEffect, useCallback } from 'react'
import { getFallbackOutfit, type OutfitRecommendation } from '../hooks/useOutfit'
import { useSettings } from '../hooks/useSettings'
import { useDrawerSpring } from '../hooks/useSpringAnimation'

/**
 * Drawer component for outfit recommendations
 * Shows a collapsed peek/handle at bottom of screen, expands on interaction
 * Supports swipe-up gesture to expand, swipe-down/click to collapse
 *
 * Features:
 * - 7-day forecast tabs (Today through 6 days out)
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

/** Active day view: 0 = today, 1 = tomorrow, 2-6 = future days */
type ActiveDayView = number

interface DrawerProps {
  /** All outfit recommendations for 7 days (index 0-6) */
  dayOutfits?: (OutfitRecommendation | null)[]
  /** Currently selected day index (controlled from parent) */
  activeDayIndex?: ActiveDayView
  /** Callback when day changes */
  onDayChange?: (dayIndex: ActiveDayView) => void
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
export function Drawer({ dayOutfits, activeDayIndex: controlledActiveDayIndex, onDayChange }: DrawerProps) {
  // Spring animation for drawer open/close (Feature #31)
  const { currentValue: springValue, expand, collapse } = useDrawerSpring()

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  // Support both controlled and uncontrolled mode
  const [internalActiveDayIndex, setInternalActiveDayIndex] = useState<ActiveDayView>(0)

  // Use controlled value if provided, otherwise use internal state
  const activeDayIndex = controlledActiveDayIndex ?? internalActiveDayIndex
  const setActiveDayIndex = (dayIndex: ActiveDayView) => {
    if (onDayChange) {
      onDayChange(dayIndex)
    } else {
      setInternalActiveDayIndex(dayIndex)
    }
  }

  // Feature #77: Prevent rapid interactions from causing glitches
  const isAnimatingRef = useRef(false)
  const lastActionTimeRef = useRef(0)
  const ACTION_DEBOUNCE_MS = 150 // Prevent actions within 150ms of each other

  // Determine if drawer is expanded based on spring value
  const isExpanded = springValue > 0.5

  // Get temperature unit setting
  const { settings } = useSettings()

  // Get the current outfit based on active day
  const currentOutfit = dayOutfits?.[activeDayIndex] ?? null

  // Get the number of available days
  const numDays = dayOutfits?.length ?? 0

  // Log error when outfit is missing (Feature #52)
  useEffect(() => {
    if (isExpanded && !currentOutfit) {
      console.error(
        `[OutFitWeather] Missing outfit data for day index ${activeDayIndex}. ` +
        `This may indicate incomplete weather data or outfit logic failure. ` +
        `Using fallback outfit.`
      )
    }
  }, [isExpanded, currentOutfit, activeDayIndex])

  // Get fallback outfit when current outfit is null (Feature #52)
  const displayOutfit = currentOutfit ?? getFallbackOutfit(activeDayIndex)

  const touchStartY = useRef<number>(0)
  const touchStartTime = useRef<number>(0)
  const drawerRef = useRef<HTMLDivElement>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in pixels) to trigger expand/collapse
  const SWIPE_THRESHOLD = 50
  // Minimum swipe velocity (in pixels/ms) to trigger expand/collapse
  const VELOCITY_THRESHOLD = 0.5
  // Maximum drag distance (prevents dragging drawer off-screen)
  const MAX_DRAG_OFFSET = 300

  // Drawer always has white/semi-transparent background
  // Use fixed dark text colors that work well on white background
  const textColors = {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    tertiary: 'text-gray-500',
    muted: 'text-gray-400'
  }

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (isExpanded && tabsContainerRef.current) {
      const activeTab = tabsContainerRef.current.querySelector('[data-active="true"]')
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [activeDayIndex, isExpanded])

  // Feature #77: Debounced drawer actions to prevent rapid interaction glitches
  const canPerformAction = useCallback(() => {
    const now = Date.now()
    const timeSinceLastAction = now - lastActionTimeRef.current

    // Block action if too soon after previous action
    if (timeSinceLastAction < ACTION_DEBOUNCE_MS) {
      return false
    }

    // Block action if animation is in progress
    if (isAnimatingRef.current) {
      return false
    }

    return true
  }, [])

  const toggleDrawer = useCallback(() => {
    if (!canPerformAction()) return

    lastActionTimeRef.current = Date.now()
    isAnimatingRef.current = true

    // Reset animation flag after animation completes (estimated 400ms)
    setTimeout(() => {
      isAnimatingRef.current = false
    }, 400)

    if (isExpanded) {
      collapse()
    } else {
      expand()
    }
  }, [isExpanded, canPerformAction, expand, collapse])

  const collapseDrawer = useCallback(() => {
    if (!canPerformAction()) return

    lastActionTimeRef.current = Date.now()
    isAnimatingRef.current = true

    setTimeout(() => {
      isAnimatingRef.current = false
    }, 400)

    collapse()
  }, [canPerformAction, collapse])

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
  }, [isExpanded, collapseDrawer])

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
        // Feature #77: Check if we can perform the action
        if (canPerformAction()) {
          lastActionTimeRef.current = Date.now()
          isAnimatingRef.current = true
          setTimeout(() => { isAnimatingRef.current = false }, 400)
          expand()
        }
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
            // Animation logic:
            // - Collapsed (springValue near 0): Handle visible at bottom, no transform
            // - Expanding/collapsing: Animate the expanded content
            // - Expanded (springValue near 1): Full drawer visible
            transform: isDragging
              ? `translateY(${isExpanded ? dragOffset : -dragOffset}px)`
              : isExpanded
                ? `translateY(${(1 - springValue) * 100}%)`
                : 'translateY(0)',
            // Smooth scale effect during spring animation
            scale: isDragging ? 1 : 0.98 + (springValue * 0.02),
            // Keep drawer visible
            opacity: 1,
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
              {/* Swipe hint text with eye emoji */}
              <p className={`text-sm font-medium ${textColors.secondary}`}>
                Swipe up · 👀 What to wear
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

              {/* Navigation with Previous/Next arrow buttons and 7-day tabs */}
              <div
                className="flex items-center justify-center gap-2 mb-3"
                role="tablist"
                aria-label="7-day forecast selection"
              >
                {/* Previous button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent drawer from closing
                    if (activeDayIndex > 0) {
                      setActiveDayIndex(activeDayIndex - 1)
                    }
                  }}
                  disabled={activeDayIndex === 0}
                  aria-label="Previous day"
                  className={`
                    p-2 rounded-full transition-all duration-200 flex-shrink-0
                    ${activeDayIndex === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                    }
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>

                {/* Scrollable tab container for 7 days */}
                <div
                  ref={tabsContainerRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-1 max-w-[calc(100%-80px)]"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {dayOutfits?.map((outfit, index) => {
                    const dayLabel = outfit?.dayLabel ?? (index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `Day ${index + 1}`)
                    return (
                      <button
                        key={index}
                        type="button"
                        role="tab"
                        data-active={activeDayIndex === index}
                        aria-selected={activeDayIndex === index}
                        aria-controls="outfit-panel"
                        onClick={(e) => {
                          e.stopPropagation() // Prevent drawer from closing
                          setActiveDayIndex(index)
                        }}
                        className={`
                          px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 whitespace-nowrap
                          ${activeDayIndex === index
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        {dayLabel}
                      </button>
                    )
                  })}
                </div>

                {/* Next button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent drawer from closing
                    if (activeDayIndex < numDays - 1) {
                      setActiveDayIndex(activeDayIndex + 1)
                    }
                  }}
                  disabled={activeDayIndex >= numDays - 1}
                  aria-label="Next day"
                  className={`
                    p-2 rounded-full transition-all duration-200 flex-shrink-0
                    ${activeDayIndex >= numDays - 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                    }
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>

              {/* View indicator dots for 7 days */}
              <div
                className="flex items-center justify-center gap-1.5 mb-4"
                role="presentation"
                aria-hidden="true"
              >
                {dayOutfits?.map((_, index) => (
                  <div
                    key={index}
                    className={`
                      h-1.5 rounded-full transition-all duration-300 ease-out
                      ${activeDayIndex === index
                        ? 'w-6 bg-blue-500'
                        : 'w-1.5 bg-gray-300'
                      }
                    `}
                  />
                ))}
              </div>

              {/* Large emoji outfit display and one-liner - both in aria-live region */}
              <div
                id="outfit-panel"
                role="tabpanel"
                aria-live="polite"
                aria-label={`Outfit recommendation for ${displayOutfit.dayLabel ?? 'selected day'}: ${displayOutfit.emojis}, ${displayOutfit.oneLiner}`}
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

              {/* High/Low temperature display for all day views */}
              {displayOutfit.highTemp !== undefined && displayOutfit.lowTemp !== undefined && (
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
