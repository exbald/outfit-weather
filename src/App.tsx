import { useState, useEffect } from 'react'

function App() {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Implement weather fetching logic
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
        <div className="text-6xl animate-pulse">🌤️</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Main weather display will be implemented by coding agents */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">OutFitWeather</h1>
          <p className="text-gray-600">What should I wear today?</p>
          <div className="mt-8 text-6xl">🌤️</div>
        </div>
      </div>
    </div>
  )
}

export default App
