import { useEffect, useRef } from 'react'
import type { TemperatureUnit, WindSpeedUnit } from '../hooks/useSettings'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  temperatureUnit: TemperatureUnit
  windSpeedUnit: WindSpeedUnit
  setTemperatureUnit: (unit: TemperatureUnit) => void
  setWindSpeedUnit: (unit: WindSpeedUnit) => void
}

/**
 * Focus trap hook for modals
 * Prevents keyboard focus from leaving the modal dialog
 */
function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Get all focusable elements within the modal
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus the first element when modal opens
    firstElement?.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      // If Shift + Tab on first element, move to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
      // If Tab on last element, move to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isActive, containerRef])
}

export function SettingsModal({
  isOpen,
  onClose,
  temperatureUnit,
  windSpeedUnit,
  setTemperatureUnit,
  setWindSpeedUnit
}: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Feature #70: Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Feature #70: Trap focus within modal when open
  useFocusTrap(isOpen, modalRef)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      aria-describedby="settings-description"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-100">
          <h2 id="settings-title" className="text-xl font-bold text-gray-800">
            Settings
          </h2>
          <p id="settings-description" className="text-sm text-gray-600 mt-1">
            Customize your weather display preferences
          </p>
        </header>

        {/* Settings Options */}
        <section className="p-6 space-y-6" aria-label="Settings options">
          {/* Temperature Unit */}
          <div>
            <label
              id="temp-unit-label"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Temperature Unit
            </label>
            <div
              className="flex gap-2"
              role="group"
              aria-labelledby="temp-unit-label"
              aria-describedby="temp-unit-description"
            >
              <button
                type="button"
                onClick={() => setTemperatureUnit('C')}
                className={`flex-1 py-3.5 px-4 rounded-xl font-medium transition-all text-lg ${
                  temperatureUnit === 'C'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={temperatureUnit === 'C'}
                aria-label="Select Celsius for temperature"
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                onClick={() => setTemperatureUnit('F')}
                className={`flex-1 py-3.5 px-4 rounded-xl font-medium transition-all text-lg ${
                  temperatureUnit === 'F'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={temperatureUnit === 'F'}
                aria-label="Select Fahrenheit for temperature"
              >
                Fahrenheit (°F)
              </button>
            </div>
            <p id="temp-unit-description" className="mt-2 text-xs text-gray-500">
              Choose your preferred temperature display unit
            </p>
          </div>

          {/* Wind Speed Unit */}
          <div>
            <label
              id="wind-unit-label"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Wind Speed Unit
            </label>
            <div
              className="flex gap-2"
              role="group"
              aria-labelledby="wind-unit-label"
              aria-describedby="wind-unit-description"
            >
              <button
                type="button"
                onClick={() => setWindSpeedUnit('kmh')}
                className={`flex-1 py-3.5 px-4 rounded-xl font-medium transition-all text-lg ${
                  windSpeedUnit === 'kmh'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={windSpeedUnit === 'kmh'}
                aria-label="Select kilometers per hour for wind speed"
              >
                km/h
              </button>
              <button
                type="button"
                onClick={() => setWindSpeedUnit('mph')}
                className={`flex-1 py-3.5 px-4 rounded-xl font-medium transition-all text-lg ${
                  windSpeedUnit === 'mph'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={windSpeedUnit === 'mph'}
                aria-label="Select miles per hour for wind speed"
              >
                mph
              </button>
            </div>
            <p id="wind-unit-description" className="mt-2 text-xs text-gray-500">
              Choose your preferred wind speed display unit
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-lg"
            aria-label="Close settings dialog"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  )
}
