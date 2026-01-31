/**
 * Development Tests Component
 * This component only imports and renders test components in development mode.
 * In production, this component returns null to reduce bundle size.
 */

import { lazy, Suspense } from 'react'

// Early return for production - no imports at all
// This ensures test components are tree-shaken out of the production bundle
export function DevTests() {
  if (!import.meta.env.DEV) {
    return null
  }

  // In development only, use React.lazy for code splitting
  const ServiceWorkerTest = lazy(() =>
    import('./ServiceWorkerTest').then(m => ({ default: () => m.ServiceWorkerTest() }))
  )
  const WeatherCacheTest = lazy(() =>
    import('./WeatherCacheTest').then(m => ({ default: () => m.WeatherCacheTest() }))
  )
  const OutfitEmojiTest = lazy(() =>
    import('./OutfitEmojiTest').then(m => ({ default: () => m.OutfitEmojiTest() }))
  )
  const WeatherCodeTest = lazy(() =>
    import('./WeatherCodeTest').then(m => ({ default: () => m.WeatherCodeTest() }))
  )
  const WeatherModifierTest = lazy(() =>
    import('./WeatherModifierTest').then(m => ({ default: () => m.WeatherModifierTest() }))
  )
  const WindModifierTest = lazy(() =>
    import('./WindModifierTest').then(m => ({ default: () => m.WindModifierTest() }))
  )
  const UVModifierTest = lazy(() =>
    import('./UVModifierTest').then(m => ({ default: () => m.UVModifierTest() }))
  )

  return (
    <section aria-labelledby="dev-tests-title" className="border-t border-black/5 pt-8">
      <h2 id="dev-tests-title" className="text-lg font-semibold mb-4">Development Tests</h2>
      <div className="space-y-8">
        <Suspense fallback={<div className="text-sm text-gray-500">Loading tests...</div>}>
          <ServiceWorkerTest />
          <WeatherCacheTest />
          <OutfitEmojiTest />
          <WeatherCodeTest />
          <WeatherModifierTest />
          <WindModifierTest />
          <UVModifierTest />
        </Suspense>
      </div>
    </section>
  )
}
