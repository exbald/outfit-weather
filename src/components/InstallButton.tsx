interface InstallButtonProps {
  isInstallable: boolean
  onInstall: () => void
}

/**
 * PWA Install Button
 * Shown when the app can be installed as a PWA
 * Follows the spec: "Add to Home Screen" prompt after 2nd visit (not aggressive)
 */
export function InstallButton({ isInstallable, onInstall }: InstallButtonProps) {
  if (!isInstallable) {
    return null
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 animate-slide-in"
      role="dialog"
      aria-labelledby="install-title"
    >
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="text-4xl" role="img" aria-label="App icon">
            🌤️
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="install-title" className="text-base font-semibold text-gray-800 mb-1">
              Install App
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Add OutFitWeather to your home screen for quick access
            </p>
            <div className="flex gap-2">
              <button
                onClick={onInstall}
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium"
                type="button"
              >
                Install
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                type="button"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
