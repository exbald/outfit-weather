import { Layout } from './components/Layout'
import { WeatherApiTest } from './components/WeatherApiTest'

function App() {
  return (
    <Layout>
      <div className="py-8">
        <WeatherApiTest />
      </div>
    </Layout>
  )
}

export default App
