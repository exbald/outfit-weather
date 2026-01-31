import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

/**
 * Main layout component for OutFitWeather app
 * Provides semantic HTML structure with header, main content area, and drawer placeholder
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header area - contains app branding and settings button */}
      <header className="flex-shrink-0 px-4 pt-4 pb-2">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">OutFitWeather</h1>
          <button
            aria-label="Open settings"
            className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content area - weather display and other content */}
      <main className="flex-1 px-4 pb-32 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>

      {/* Drawer component placeholder - for outfit recommendations */}
      <aside
        className="fixed bottom-0 left-0 right-0 z-40"
        aria-label="Outfit recommendations drawer"
      >
        <div className="max-w-md mx-auto">
          {/* Drawer handle bar */}
          <div className="bg-white/80 backdrop-blur-md rounded-t-3xl shadow-lg border-t border-black/5">
            <div className="flex flex-col items-center pt-2 pb-4 px-4">
              {/* Handle indicator */}
              <div className="w-12 h-1.5 bg-gray-400 rounded-full mb-2" aria-hidden="true" />
              {/* Swipe hint */}
              <p className="text-sm text-gray-500 font-medium">
                Swipe up · What to wear
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
