import { useState } from 'react'

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
 */
export function Drawer({ outfit }: DrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleDrawer = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-40"
      aria-label="Outfit recommendations drawer"
    >
      <div className="max-w-md mx-auto">
        {/* Collapsed state - drawer handle bar */}
        <div
          className="bg-white/80 backdrop-blur-md rounded-t-3xl shadow-lg border-t border-black/5 cursor-pointer transition-transform duration-300 ease-out"
          onClick={toggleDrawer}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-label="Open outfit recommendations"
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
