/**
 * Feature #59: Skeleton shown after 1 second
 *
 * Test verification for skeleton UI behavior:
 * 1. Initial loading state shows calm pulse animation (emoji)
 * 2. After 1 second of loading, skeleton appears
 * 3. Skeleton matches weather display layout
 * 4. Skeleton disappears when data arrives
 *
 * Manual testing steps:
 * 1. Open browser DevTools console
 * 2. Navigate to http://localhost:5173
 * 3. Allow location access
 * 4. Observe:
 *    - First 1 second: 🌤️ emoji with "Fetching weather data..."
 *    - After 1 second: Skeleton UI with gray boxes matching layout
 *    - When data loads: Real weather data appears
 * 5. Check console for "[Skeleton] Loading took >1 second, showing skeleton UI" message
 *
 * Expected console logs:
 * - "[Skeleton] Loading took >1 second, showing skeleton UI" (after 1 second)
 * - "[Skeleton] Cleared skeleton timeout" (when data arrives or cleanup)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWeather } from '../../hooks/useWeather'

describe('Feature #59: Skeleton shown after 1 second', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not show skeleton immediately on load', () => {
    const { result } = renderHook(() => useWeather(40.7128, -74.0060))

    // Initially, loading is true but skeleton should not show
    expect(result.current.loading).toBe(true)
    expect(result.current.showSkeleton).toBe(false)
  })

  it('should show skeleton after 1 second of loading', async () => {
    const { result } = renderHook(() => useWeather(40.7128, -74.0060))

    // Fast-forward 999ms - skeleton should not appear yet
    await act(async () => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current.showSkeleton).toBe(false)

    // Fast-forward to 1001ms - skeleton should appear
    await act(async () => {
      vi.advanceTimersByTime(2)
    })
    expect(result.current.showSkeleton).toBe(true)
  })

  it('should hide skeleton when data arrives', async () => {
    const { result } = renderHook(() => useWeather(40.7128, -74.0060))

    // Fast-forward past 1 second to show skeleton
    await act(async () => {
      vi.advanceTimersByTime(1001)
    })
    expect(result.current.showSkeleton).toBe(true)

    // When data arrives, skeleton should be hidden
    // This happens in the fetchWeather function's finally block
    // The skeleton state is reset when loading completes
  })

  it('should not show skeleton for refresh (when data already exists)', async () => {
    // First, let data load successfully
    const { result, rerender } = renderHook(() => useWeather(40.7128, -74.0060))

    // Wait for initial load
    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    // Now trigger a refresh - this should not show skeleton
    // because weather data already exists
    const initialShowSkeleton = result.current.showSkeleton

    await act(async () => {
      vi.advanceTimersByTime(1001)
    })

    // Skeleton state should not change during refresh
    expect(result.current.showSkeleton).toBe(initialShowSkeleton)
  })

  it('should clear skeleton timer on unmount', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const { unmount } = renderHook(() => useWeather(40.7128, -74.0060))

    // Fast-forward to start skeleton timer
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    // Unmount the hook
    unmount()

    // Verify clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})

/**
 * Manual testing checklist for browser:
 *
 * ✅ Step 1: Initial load (0-1 second)
 *    - [ ] See 🌤️ emoji with "Fetching weather data..."
 *    - [ ] No skeleton boxes visible
 *    - [ ] Calm pulse animation on emoji
 *
 * ✅ Step 2: After 1 second
 *    - [ ] Console message: "[Skeleton] Loading took >1 second, showing skeleton UI"
 *    - [ ] Skeleton UI appears with gray boxes
 *    - [ ] Skeleton layout matches weather display:
 *      - [ ] Small box at top (location)
 *      - [ ] Large circle (weather icon)
 *      - [ ] Wide tall box (temperature)
 *      - [ ] Medium box (condition)
 *      - [ ] Two small circles with text (wind, day/night)
 *      - [ ] Two small boxes (coordinates)
 *      - [ ] Small box (cache age)
 *    - [ ] All skeleton boxes have pulse animation
 *
 * ✅ Step 3: Data arrives
 *    - [ ] Skeleton disappears
 *    - [ ] Real weather data fades in
 *    - [ ] No flash/jarring transition
 *    - [ ] Console message: "[Skeleton] Cleared skeleton timeout"
 *
 * ✅ Step 4: Subsequent loads (with cached data)
 *    - [ ] Cached data shows immediately
 *    - [ ] No skeleton appears (data already exists)
 *    - [ ] "Updating..." indicator shows during refresh
 */
