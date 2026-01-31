import { useState, useRef, TouchEvent } from 'react'

interface DrawerProps {
  /** Outfit recommendation to display when drawer is expanded */
  outfit?: {
    emojis: string
    oneLiner: string
    view: 'now' | 'today' | 'tomorrow'
  }
}

/**
 * Drawer component for outfit recommendations
 * Shows a collapsed peek/handle at bottom of screen, expands on interaction
 * Supports swipe-up gesture to expand, swipe-down/click to collapse
 */
export function Drawer({ outfit }: DrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const touchStartY = useRef<number>(0)
  const touchStartTime = useRef<number>(0)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in pixels) to trigger expand/collapse
  const SWIPE_THRESHOLD = 50
  // Minimum swipe velocity (in pixels/ms) to trigger expand/collapse
  const VELOCITY_THRESHOLD = 0.5
  // Maximum drag distance (prevents dragging drawer off-screen)
  const MAX_DRAG_OFFSET = 300

  const toggleDrawer = () => {
    setIsExpanded(!isExpanded)
  }

  const expandDrawer = () => {
    setIsExpanded(true)
  }

  const collapseDrawer = () => {
    setIsExpanded(false)
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
      <div className="max-w-md mx-auto">
        {/* Collapsed state - drawer handle bar */}
        <div
          ref={drawerRef}
          className="bg-white/80 backdrop-blur-md rounded-t-3xl shadow-lg border-t border-black/5 cursor-pointer transition-transform duration-300 ease-out"
          style={{
            transform: isDragging
              ? `translateY(${isExpanded ? dragOffset : -dragOffset}px)`
              : 'translateY(0)'
          }}
          onClick={toggleDrawer}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Close outfit recommendations" : "Open outfit recommendations"}
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
              {/* Swipe hint text */}
              <p className="text-sm text-gray-500 font-medium">
                Swipe up · What to wear
              </p>
            </div>
          )}

          {/* Expanded state content */}
          {isExpanded && outfit && (
            <div className="p-6">
              {/* Handle indicator for closing */}
              <div
                className="w-12 h-1.5 bg-gray-400 rounded-full mx-auto mb-4"
                aria-hidden="true"
              />

              {/* View indicator */}
              <div className="text-center mb-2">
                <span className="inline-block px-3 py-1 bg-black/5 rounded-full text-sm font-medium text-gray-700 uppercase tracking-wide">
                  {outfit.view}
                </span>
              </div>

              {/* Large emoji outfit display */}
              <div className="text-center mb-3">
                <div
                  className="text-6xl leading-none"
                  role="img"
                  aria-label={`Outfit: ${outfit.emojis}`}
                >
                  {outfit.emojis}
                </div>
              </div>

              {/* Friendly one-liner text */}
              <p className="text-center text-xl font-medium text-gray-800">
                {outfit.oneLiner}
              </p>

              {/* Navigation hint */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Tap or swipe down to close
              </p>
            </div>
          )}

          {/* Expanded state without outfit data (fallback) */}
          {isExpanded && !outfit && (
            <div className="p-6 text-center">
              <div
                className="w-12 h-1.5 bg-gray-400 rounded-full mx-auto mb-4"
                aria-hidden="true"
              />
              <p className="text-gray-600">
                Check outside! 🤷
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Couldn't determine outfit
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
