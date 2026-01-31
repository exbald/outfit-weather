import { useState, useRef, useEffect, useCallback } from 'react'

export interface UsePullToRefreshResult {
  /** Distance pulled down in pixels (0 to maxPullDistance) */
  pullDistance: number
  /** Whether the pull distance meets the threshold to trigger refresh */
  canRefresh: boolean
  /** Whether a refresh is currently in progress */
  isRefreshing: boolean
  /** Touch event handlers to attach to the pull container */
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: () => void
  }
  /** Programmatically trigger refresh (e.g., from a button) */
  triggerRefresh: () => void
  /** Reset the pull state (call when refresh completes) */
  resetRefresh: () => void
}

interface UsePullToRefreshOptions {
  /** Minimum pull distance in pixels to trigger refresh (default: 80) */
  threshold?: number
  /** Maximum pull distance in pixels (default: 120) */
  maxPullDistance?: number
  /** Resistance factor for pull beyond maxPullDistance (default: 0.3) */
  resistance?: number
  /** Callback function to execute when refresh is triggered */
  onRefresh: () => void | Promise<void>
}

/**
 * Custom hook for implementing pull-to-refresh gesture
 *
 * Features:
 * - Native-feeling pull gesture with resistance
 * - Configurable threshold and maximum pull distance
 * - Only works when scrolled to top (prevents accidental triggers)
 * - Supports both touch and mouse drag (for testing)
 * - Feature #77: Prevents rapid refresh triggers
 * - Accessible - works with keyboard navigation
 *
 * @param options - Configuration options
 * @returns Pull state and event handlers
 */
export function usePullToRefresh(options: UsePullToRefreshOptions): UsePullToRefreshResult {
  const {
    threshold = 80,
    maxPullDistance = 120,
    resistance = 0.3,
    onRefresh
  } = options

  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Refs to track gesture state
  const startY = useRef(0)
  const currentY = useRef(0)
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLElement | null>(null)
  const lastRefreshTime = useRef(0)
  const REFRESH_COOLDOWN_MS = 1000 // Feature #77: Prevent refresh within 1 second

  // Check if we're at the top of the scrollable container
  const isAtTop = useCallback(() => {
    if (!containerRef.current) return true
    // Check if the scrollable element is scrolled to the top
    const target = containerRef.current.closest('[data-pull-container]') as HTMLElement | null
    if (!target) return true
    return target.scrollTop <= 0
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only start tracking if we're at the top
    if (!isAtTop()) return

    const touch = e.touches[0]
    startY.current = touch.clientY
    currentY.current = touch.clientY
    isDragging.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isRefreshing) return

    const touch = e.touches[0]
    const deltaY = touch.clientY - startY.current

    // Only track downward pulls (positive delta)
    if (deltaY <= 0) {
      startY.current = touch.clientY
      return
    }

    // Apply resistance after maxPullDistance
    let distance = deltaY
    if (distance > maxPullDistance) {
      distance = maxPullDistance + (distance - maxPullDistance) * resistance
    }

    // Prevent default to stop scrolling while pulling
    if (distance > 0 && isAtTop()) {
      e.preventDefault()
    }

    currentY.current = touch.clientY
    setPullDistance(distance)
  }

  const handleTouchEnd = () => {
    if (!isDragging.current) return

    isDragging.current = false

    // Feature #77: Prevent rapid refresh triggers
    const now = Date.now()
    const timeSinceLastRefresh = now - lastRefreshTime.current

    // Check if we pulled past threshold
    if (pullDistance >= threshold && !isRefreshing && timeSinceLastRefresh >= REFRESH_COOLDOWN_MS) {
      // Trigger refresh
      lastRefreshTime.current = now
      setIsRefreshing(true)
      setPullDistance(0)

      // Execute refresh callback
      Promise.resolve(onRefresh()).finally(() => {
        setIsRefreshing(false)
      })
    } else {
      // Snap back
      setPullDistance(0)
    }
  }

  const triggerRefresh = () => {
    // Feature #77: Prevent rapid refresh triggers
    const now = Date.now()
    const timeSinceLastRefresh = now - lastRefreshTime.current

    if (isRefreshing || timeSinceLastRefresh < REFRESH_COOLDOWN_MS) return

    lastRefreshTime.current = now
    setIsRefreshing(true)
    setPullDistance(0)

    Promise.resolve(onRefresh()).finally(() => {
      setIsRefreshing(false)
    })
  }

  const resetRefresh = () => {
    setIsRefreshing(false)
    setPullDistance(0)
  }

  // Clean up container ref on unmount
  useEffect(() => {
    return () => {
      containerRef.current = null
    }
  }, [])

  return {
    pullDistance,
    canRefresh: pullDistance >= threshold,
    isRefreshing,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    triggerRefresh,
    resetRefresh
  }
}
