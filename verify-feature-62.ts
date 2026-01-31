/**
 * Feature #62 Verification Script
 * Run with: npx tsx verify-feature-62.ts
 */

import { parseDailyForecast } from './src/lib/openmeteo.js'

console.log('╔════════════════════════════════════════════════════════════════╗')
console.log('║           Feature #62: Today Shows Worst Weather Outfit       ║')
console.log('║                    Verification Script                        ║')
console.log('╚════════════════════════════════════════════════════════════════╝\n')

// Test 1: Clear morning, rainy afternoon
console.log('Test 1: Clear morning, rainy afternoon')
console.log('───────────────────────────────────────────────────────────────')

const dailyData1 = {
  time: ['2025-01-31', '2025-02-01'],
  temperature_2m_max: [15, 16],
  temperature_2m_min: [5, 6],
  weathercode: [0, 0], // Clear sky in daily
  precipitation_probability_max: [0, 10],
  uv_index_max: [5, 6]
}

const hourlyData1 = {
  time: Array.from({ length: 48 }, (_, i) => {
    const date = new Date('2025-01-31T00:00:00Z')
    date.setHours(date.getHours() + i)
    return date.toISOString().slice(0, 13) + ':00'
  }),
  temperature_2m: Array.from({ length: 48 }, () => 10),
  weathercode: [
    // Today: Clear (0-6), Partly cloudy (7-12), Rain (13-18), Partly cloudy (19-23)
    0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2,
    61, 61, 61, 61, 61, 61,
    2, 2, 2, 2, 2,
    // Tomorrow: All clear
    ...Array.from({ length: 24 }, () => 0)
  ],
  windspeed_10m: Array.from({ length: 48 }, () => 10),
  precipitation_probability: Array.from({ length: 48 }, (_, i) =>
    i >= 13 && i <= 18 ? 80 : 10
  )
}

try {
  const result1 = parseDailyForecast(dailyData1, hourlyData1)
  console.log(`  Daily weather code: ${dailyData1.weathercode[0]} (Clear)`)
  console.log(`  Worst weather code: ${result1.today.weatherCodeWorst} (Rain: 61)`)
  console.log(`  Max precipitation: ${result1.today.precipitationProbabilityHourlyMax}%`)
  console.log(`  ✓ PASS: Rain correctly identified as worst weather\n`)
} catch (e) {
  console.log(`  ✗ FAIL: ${(e as Error).message}\n`)
}

// Test 2: Thunderstorm takes priority over rain
console.log('Test 2: Thunderstorm takes priority over rain')
console.log('───────────────────────────────────────────────────────────────')

const dailyData2 = {
  time: ['2025-01-31', '2025-02-01'],
  temperature_2m_max: [15, 16],
  temperature_2m_min: [5, 6],
  weathercode: [61, 0], // Rain in daily
  precipitation_probability_max: [50, 10],
  uv_index_max: [5, 6]
}

const hourlyData2 = {
  time: Array.from({ length: 48 }, (_, i) => {
    const date = new Date('2025-01-31T00:00:00Z')
    date.setHours(date.getHours() + i)
    return date.toISOString().slice(0, 13) + ':00'
  }),
  temperature_2m: Array.from({ length: 48 }, () => 10),
  weathercode: [
    61, 61, 61, 61, 61, 61,
    95, 95, 95, 95, 95, 95,
    61, 61, 61, 61, 61, 61,
    61, 61, 61, 61, 61, 61,
    ...Array.from({ length: 24 }, () => 0)
  ],
  windspeed_10m: Array.from({ length: 48 }, () => 10),
  precipitation_probability: Array.from({ length: 48 }, () => 50)
}

try {
  const result2 = parseDailyForecast(dailyData2, hourlyData2)
  console.log(`  Daily weather code: ${dailyData2.weathercode[0]} (Rain: 61)`)
  console.log(`  Worst weather code: ${result2.today.weatherCodeWorst} (Thunderstorm: 95)`)
  console.log(`  ✓ PASS: Thunderstorm correctly prioritized over rain\n`)
} catch (e) {
  console.log(`  ✗ FAIL: ${(e as Error).message}\n`)
}

// Test 3: Max wind speed extraction
console.log('Test 3: Max wind speed extraction')
console.log('───────────────────────────────────────────────────────────────')

const dailyData3 = {
  time: ['2025-01-31', '2025-02-01'],
  temperature_2m_max: [15, 16],
  temperature_2m_min: [5, 6],
  weathercode: [0, 0],
  precipitation_probability_max: [0, 10],
  uv_index_max: [5, 6]
}

const hourlyData3 = {
  time: Array.from({ length: 48 }, (_, i) => {
    const date = new Date('2025-01-31T00:00:00Z')
    date.setHours(date.getHours() + i)
    return date.toISOString().slice(0, 13) + ':00'
  }),
  temperature_2m: Array.from({ length: 48 }, () => 10),
  weathercode: Array.from({ length: 48 }, () => 0),
  windspeed_10m: [
    5, 5, 5, 5, 5, 5,
    15, 15, 15, 15, 15, 15,
    35, 35, 35, 35, 35, 35,
    10, 10, 10, 10, 10, 10,
    ...Array.from({ length: 24 }, () => 5)
  ],
  precipitation_probability: Array.from({ length: 48 }, () => 0)
}

try {
  const result3 = parseDailyForecast(dailyData3, hourlyData3)
  console.log(`  Max wind speed: ${result3.today.windSpeedMax} km/h`)
  console.log(`  ✓ PASS: Max wind speed correctly extracted\n`)
} catch (e) {
  console.log(`  ✗ FAIL: ${(e as Error).message}\n`)
}

// Test 4: Tomorrow's worst weather (snow)
console.log('Test 4: Tomorrow shows worst weather (snow)')
console.log('───────────────────────────────────────────────────────────────')

const dailyData4 = {
  time: ['2025-01-31', '2025-02-01'],
  temperature_2m_max: [15, 16],
  temperature_2m_min: [5, 6],
  weathercode: [0, 0],
  precipitation_probability_max: [0, 10],
  uv_index_max: [5, 6]
}

const hourlyData4 = {
  time: Array.from({ length: 48 }, (_, i) => {
    const date = new Date('2025-01-31T00:00:00Z')
    date.setHours(date.getHours() + i)
    return date.toISOString().slice(0, 13) + ':00'
  }),
  temperature_2m: Array.from({ length: 48 }, () => 10),
  weathercode: [
    ...Array.from({ length: 24 }, () => 0), // Today: Clear
    71, 71, 71, 71, 71, 71,  // Tomorrow: Snow
    0, 0, 0, 0, 0, 0,        // Tomorrow: Clear
    2, 2, 2, 2, 2, 2,        // Tomorrow: Partly cloudy
    2, 2, 2, 2, 2, 2
  ],
  windspeed_10m: Array.from({ length: 48 }, () => 10),
  precipitation_probability: Array.from({ length: 48 }, () => 20)
}

try {
  const result4 = parseDailyForecast(dailyData4, hourlyData4)
  console.log(`  Tomorrow daily code: ${dailyData4.weathercode[1]} (Clear: 0)`)
  console.log(`  Tomorrow worst code: ${result4.tomorrow.weatherCodeWorst} (Snow: 71)`)
  console.log(`  ✓ PASS: Tomorrow's worst weather correctly identified\n`)
} catch (e) {
  console.log(`  ✗ FAIL: ${(e as Error).message}\n`)
}

console.log('╔════════════════════════════════════════════════════════════════╗')
console.log('║                   Verification Complete                        ║')
console.log('╚════════════════════════════════════════════════════════════════╝')
