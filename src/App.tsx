import { Layout } from './components/Layout'
import { OutfitEmojiTest } from './components/OutfitEmojiTest'
import { WeatherCodeTest } from './components/WeatherCodeTest'

function App() {
  return (
    <Layout>
      <div className="py-8 space-y-8">
        <OutfitEmojiTest />
        <WeatherCodeTest />
      </div>
    </Layout>
  )
}

export default App
