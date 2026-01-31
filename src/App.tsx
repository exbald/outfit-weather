import { Layout } from './components/Layout'
import { WeatherDisplay } from './components/WeatherDisplay'
import { OutfitEmojiTest } from './components/OutfitEmojiTest'
import { WeatherCodeTest } from './components/WeatherCodeTest'
import { WeatherModifierTest } from './components/WeatherModifierTest'

function App() {
  // Using San Francisco coordinates for demonstration
  // In production, this would come from browser Geolocation API
  const sanFrancisco = { lat: 37.7749, lon: -122.4194 }

  return (
    <Layout>
      <div className="py-8 space-y-8">
        {/* Main weather display */}
        <WeatherDisplay
          lat={sanFrancisco.lat}
          lon={sanFrancisco.lon}
          locationName="San Francisco"
        />

        {/* Test components for development */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Development Tests</h2>
          <div className="space-y-8">
            <OutfitEmojiTest />
            <WeatherCodeTest />
            <WeatherModifierTest />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App
