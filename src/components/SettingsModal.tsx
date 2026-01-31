import type { TemperatureUnit, WindSpeedUnit } from '../hooks/useSettings'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  temperatureUnit: TemperatureUnit
  windSpeedUnit: WindSpeedUnit
  setTemperatureUnit: (unit: TemperatureUnit) => void
  setWindSpeedUnit: (unit: WindSpeedUnit) => void
}

export function SettingsModal({
  isOpen,
  onClose,
  temperatureUnit,
  windSpeedUnit,
  setTemperatureUnit,
  setWindSpeedUnit
}: SettingsModalProps) {

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-100">
          <h2 id="settings-title" className="text-xl font-bold text-gray-800">
            Settings
          </h2>
        </header>

        {/* Settings Options */}
        <section className="p-6 space-y-6" aria-label="Settings options">
          {/* Temperature Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Temperature Unit
            </label>
            <div className="flex gap-2" role="group" aria-label="Temperature unit selection">
              <button
                type="button"
                onClick={() => setTemperatureUnit('C')}
                className={`flex-1 py-3.5 px-4 rounded-xl font-medium transition-all text-lg ${
                  temperatureUnit === 'C'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={temperatureUnit === 'C'}
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
            <div className="flex gap-2" role="group" aria-label="Wind speed unit selection">
              <button
                type="button"
                onClick={() => setWindSpeedUnit('kmh')}
                className={`flex-1 py-3.5 px-4 rounded-xl font-medium transition-all text-lg ${
                  windSpeedUnit === 'kmh'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={windSpeedUnit === 'kmh'}
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
              >
                mph
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  )
}
