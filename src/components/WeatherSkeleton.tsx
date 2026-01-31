interface WeatherSkeletonProps {
  /** Temperature for adaptive background calculation */
  temperature?: number | null
  /** Weather code for adaptive background calculation */
  weatherCode?: number | null
  /** Is day flag for adaptive background calculation */
  isDay?: number | null
}

/**
 * WeatherSkeleton component
 * Shows a placeholder UI while weather data is loading
 *
 * This skeleton matches the layout of WeatherDisplay to provide
 * visual continuity during loading states. It appears after 1 second
 * of loading to avoid flashing for fast loads.
 *
 * Accessibility:
 * - Uses aria-busy to indicate loading state
 * - Skeleton elements have proper aria-labels
 */
export function WeatherSkeleton(_props: WeatherSkeletonProps) {
  return (
    <section aria-live="polite" aria-busy="true" aria-label="Loading weather data" className="flex flex-col items-center space-y-6 py-8 animate-pulse">
      {/* Location name skeleton */}
      <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded rounded-full opacity-60"></div>

      {/* Weather icon skeleton */}
      <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>

      {/* Temperature skeleton - prominent display */}
      <div className="w-48 h-20 bg-gray-300 dark:bg-gray-600 rounded-lg opacity-60"></div>

      {/* Condition text skeleton */}
      <div className="w-40 h-6 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>

      {/* Weather details skeleton (wind, day/night) */}
      <div className="flex items-center justify-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>
          <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>
          <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Location coordinates skeleton */}
      <div className="space-y-2">
        <div className="w-40 h-3 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>
        <div className="w-32 h-3 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>
      </div>

      {/* Cache age skeleton */}
      <div className="w-36 h-3 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>
    </section>
  )
}
