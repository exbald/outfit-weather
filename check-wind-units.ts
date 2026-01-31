import { fetchCurrentWeather } from './src/lib/openmeteo.js'

const data = await fetchCurrentWeather(37.7749, -122.4194, 'celsius', 'mph')
console.log(JSON.stringify(data.current_units, null, 2))
console.log('Wind speed:', data.current.windspeed)
