import { useState } from 'react'
import { ReactNode } from 'react'
import { Drawer } from './Drawer'
import { SettingsModal } from './SettingsModal'
import type { OutfitRecommendation } from '../hooks/useOutfit'

interface LayoutProps {
  children: ReactNode
  outfit?: OutfitRecommendation
  temperature?: number
  weatherCode?: number
  isDay?: number
}

/**
 * Main layout component for OutFitWeather app
 * Provides semantic HTML structure with header, main content area, and drawer
 */
export function Layout({ children, outfit, temperature, weatherCode, isDay }: LayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header area - contains app branding and settings button */}
      <header className="flex-shrink-0 px-4 pt-4 pb-2">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">OutFitWeather</h1>
          <button
            aria-label="Open settings"
            className="p-3 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
            type="button"
            onClick={() => setIsSettingsOpen(true)}
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

      {/* Drawer component - for outfit recommendations */}
      <Drawer
        outfit={outfit}
        temperature={temperature}
        weatherCode={weatherCode}
        isDay={isDay}
      />

      {/* Settings modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}
