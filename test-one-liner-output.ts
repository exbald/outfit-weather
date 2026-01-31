import { generateOneLiner } from './src/lib/oneLiner'

const scenarios = [
  { bucket: 'freezing' as const, modifier: 'none' as const, desc: 'Freezing' },
  { bucket: 'cold' as const, modifier: 'none' as const, desc: 'Cold' },
  { bucket: 'cool' as const, modifier: 'none' as const, desc: 'Cool' },
  { bucket: 'mild' as const, modifier: 'none' as const, desc: 'Mild' },
  { bucket: 'warm' as const, modifier: 'none' as const, desc: 'Warm' },
  { bucket: 'hot' as const, modifier: 'none' as const, desc: 'Hot' },
  { bucket: 'cold' as const, modifier: 'rain' as const, desc: 'Cold rain' },
  { bucket: 'freezing' as const, modifier: 'snow' as const, desc: 'Freezing snow' },
  { bucket: 'cool' as const, modifier: 'wind' as const, desc: 'Cool wind' },
]

console.log('=== One-Liner Examples ===\n')
scenarios.forEach(({ bucket, modifier, desc }) => {
  const oneLiner = generateOneLiner(bucket, modifier, 'low', 1, 0)
  console.log(`${desc}: ${oneLiner}`)
})

const fallback = require('./src/lib/oneLiner').getFallbackOneLiner()
console.log(`\nFallback: ${fallback}`)
