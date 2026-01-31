import { useState } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C')
  const [windUnit, setWindUnit] = useState<'kmh' | 'mph'>('kmh')

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 id="settings-title" className="text-xl font-bold text-gray-800">
            Settings
          </h2>
        </div>

        {/* Settings Options */}
        <div className="p-6 space-y-6">
          {/* Temperature Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Temperature Unit
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTempUnit('C')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                  tempUnit === 'C'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                onClick={() => setTempUnit('F')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                  tempUnit === 'F'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Wind Speed Unit
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setWindUnit('kmh')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                  windUnit === 'kmh'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                km/h
              </button>
              <button
                type="button"
                onClick={() => setWindUnit('mph')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                  windUnit === 'mph'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                mph
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
