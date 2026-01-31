import { useMemo } from 'react'

export interface PullToRefreshIndicatorProps {
  /** Distance pulled down in pixels */
  pullDistance: number
  /** Whether the pull distance meets the threshold to trigger refresh */
  canRefresh: boolean
  /** Whether a refresh is currently in progress */
  isRefreshing: boolean
  /** Maximum pull distance for calculating progress */
  maxPullDistance?: number
  /** Threshold distance for triggering refresh */
  threshold?: number
}

/**
 * Pull-to-refresh indicator component
 *
 * Shows a visual indicator during pull gesture:
 * - Arrow rotates as user pulls down
 * - Loading spinner appears when refreshing
 * - Scale and opacity animate with pull distance
 *
 * @param props - Indicator properties
 * @returns JSX.Element
 */
export function PullToRefreshIndicator({
  pullDistance,
  canRefresh,
  isRefreshing,
  maxPullDistance = 120,
  threshold = 80
}: PullToRefreshIndicatorProps) {
  // Calculate opacity based on pull distance (0 to 1)
  const opacity = useMemo(() => {
    return Math.min(pullDistance / (threshold * 0.8), 1)
  }, [pullDistance, threshold])

  // Calculate rotation angle (0 to 180 degrees)
  const rotation = useMemo(() => {
    const progress = Math.min(pullDistance / threshold, 1)
    return progress * 180
  }, [pullDistance, threshold])

  // Calculate scale (1 to 1.2)
  const scale = useMemo(() => {
    const progress = Math.min(pullDistance / maxPullDistance, 1)
    return 1 + progress * 0.2
  }, [pullDistance, maxPullDistance])

  // Don't render if not pulling and not refreshing
  if (pullDistance <= 0 && !isRefreshing) {
    return null
  }

  return (
    <div
      className="flex items-center justify-center pointer-events-none"
      style={{
        opacity: isRefreshing ? 1 : opacity,
        transform: `translateY(${isRefreshing ? 20 : pullDistance / 2}px) scale(${scale})`,
        transition: isRefreshing ? 'transform 0.2s ease-out, opacity 0.2s ease-out' : 'none'
      }}
      aria-hidden="true"
    >
      <div className="relative">
        {isRefreshing ? (
          // Loading spinner
          <div
            className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"
            role="status"
            aria-label="Refreshing weather data"
          />
        ) : (
          // Pull arrow with rotation
          <div
            className="text-gray-500 transition-transform duration-150 ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              color: canRefresh ? 'rgb(59 130 246)' : undefined // Blue when can refresh
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}

        {/* Refresh hint text */}
        {pullDistance > threshold * 0.5 && !isRefreshing && (
          <div
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-600"
            style={{ opacity: Math.min((pullDistance - threshold * 0.5) / (threshold * 0.5), 1) }}
          >
            {canRefresh ? 'Release to refresh' : 'Pull to refresh'}
          </div>
        )}
      </div>
    </div>
  )
}
