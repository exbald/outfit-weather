import { useState, useEffect } from 'react'
import { Layout } from './components/Layout'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Implement weather fetching logic
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-6xl animate-pulse" role="status" aria-label="Loading weather">
            🌤️
          </div>
        </div>
      </Layout>
    )
  }

  // Error state will be implemented by coding agents

  return (
    <Layout>
      {/* Main weather display will be implemented by coding agents */}
      <div className="text-center py-12">
        <div className="text-6xl mb-6" role="img" aria-label="Partly cloudy weather">
          🌤️
        </div>
        <h2 className="text-5xl font-bold text-gray-800 mb-2">--°</h2>
        <p className="text-xl text-gray-600">What should I wear today?</p>
      </div>
    </Layout>
  )
}

export default App
