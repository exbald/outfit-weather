import { useEffect, useState } from 'react'

interface ServiceWorkerStatus {
  supported: boolean
  registered: boolean
  active: boolean
  controlled: boolean
  error: string | null
}

/**
 * ServiceWorkerTest component
 * Displays service worker registration status for development verification
 */
export function ServiceWorkerTest() {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    supported: false,
    registered: false,
    active: false,
    controlled: false,
    error: null
  })

  useEffect(() => {
    // Check if service worker is supported
    const supported = 'serviceWorker' in navigator

    setStatus((prev) => ({ ...prev, supported }))

    if (!supported) {
      setStatus((prev) => ({ ...prev, error: 'Service Worker not supported in this browser' }))
      return
    }

    // Check if already controlled
    if (navigator.serviceWorker.controller) {
      setStatus((prev) => ({ ...prev, controlled: true }))
    }

    // Check registration status
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        setStatus({
          supported: true,
          registered: true,
          active: registration.active !== undefined,
          controlled: navigator.serviceWorker.controller !== null,
          error: null
        })
      }
    }).catch((err) => {
      setStatus((prev) => ({ ...prev, error: err.message }))
    })

    // Listen for controller changes
    const handleControllerChange = () => {
      setStatus((prev) => ({
        ...prev,
        controlled: navigator.serviceWorker.controller !== null
      }))
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Service Worker Status
      </h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 w-32">Supported:</span>
          <span className={`text-sm font-semibold ${status.supported ? 'text-green-600' : 'text-red-600'}`}>
            {status.supported ? '✓ Yes' : '✗ No'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 w-32">Registered:</span>
          <span className={`text-sm font-semibold ${status.registered ? 'text-green-600' : 'text-red-600'}`}>
            {status.registered ? '✓ Yes' : '✗ No'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 w-32">Active:</span>
          <span className={`text-sm font-semibold ${status.active ? 'text-green-600' : 'text-red-600'}`}>
            {status.active ? '✓ Yes' : '✗ No'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 w-32">Controlling Page:</span>
          <span className={`text-sm font-semibold ${status.controlled ? 'text-green-600' : 'text-red-600'}`}>
            {status.controlled ? '✓ Yes' : '✗ No'}
          </span>
        </div>

        {status.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {status.error}
            </p>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <p className="font-semibold mb-1">Verification Steps:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>✓ Check navigator.serviceWorker.register call</li>
            <li>✓ Verify SW registered in DevTools</li>
            <li>✓ Confirm SW is active</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
