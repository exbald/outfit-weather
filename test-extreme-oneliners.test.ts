/**
 * Test Feature #76: Extreme temperature one-liners
 */

import { generateOneLiner } from './src/lib/oneLiner'

console.log('=== Feature #76: Extreme Temperature One-Liner Test ===\n')

console.log('1. Extreme Freezing One-Liners:')

const extremeFreezingDefault = generateOneLiner('extreme_freezing', 'none', 'low', 1, 0)
console.log(`  Default: "${extremeFreezingDefault}"`)

const extremeFreezingRain = generateOneLiner('extreme_freezing', 'rain', 'low', 1, 66)
console.log(`  Rain: "${extremeFreezingRain}"`)

const extremeFreezingSnow = generateOneLiner('extreme_freezing', 'snow', 'low', 1, 71)
console.log(`  Snow: "${extremeFreezingSnow}"`)

const extremeFreezingWind = generateOneLiner('extreme_freezing', 'wind', 'low', 1, 0)
console.log(`  Wind: "${extremeFreezingWind}"`)

console.log('\n2. Extreme Heat One-Liners:')

const extremeHotDefault = generateOneLiner('extreme_hot', 'none', 'low', 1, 0)
console.log(`  Default: "${extremeHotDefault}"`)

const extremeHotRain = generateOneLiner('extreme_hot', 'rain', 'low', 1, 63)
console.log(`  Rain: "${extremeHotRain}"`)

const extremeHotWind = generateOneLiner('extreme_hot', 'wind', 'low', 1, 0)
console.log(`  Wind: "${extremeHotWind}"`)

console.log('\n3. Extreme Temperatures with High UV:')

const extremeFreezingUV = generateOneLiner('extreme_freezing', 'none', 'high', 1, 0)
console.log(`  Extreme freezing + high UV: "${extremeFreezingUV}"`)

const extremeHotUV = generateOneLiner('extreme_hot', 'none', 'extreme', 1, 0)
console.log(`  Extreme heat + extreme UV: "${extremeHotUV}"`)

console.log('\n4. Compare Extreme vs Regular Temperature One-Liners:')

const regularFreezing = generateOneLiner('freezing', 'none', 'low', 1, 0)
console.log(`  Regular freezing: "${regularFreezing}"`)
console.log(`  Extreme freezing: "${extremeFreezingDefault}"`)

const regularHot = generateOneLiner('hot', 'none', 'low', 1, 0)
console.log(`  Regular hot: "${regularHot}"`)
console.log(`  Extreme hot: "${extremeHotDefault}"`)

console.log('\n5. Verify Warnings Are Present:')

const hasDangerWarning = extremeFreezingDefault.toLowerCase().includes('danger') ||
                          extremeFreezingDefault.toLowerCase().includes('life-threatening') ||
                          extremeFreezingDefault.toLowerCase().includes('⚠️')
console.log(`  Extreme freezing has danger warning: ${hasDangerWarning} (expected: true)`)

const hasHeatWarning = extremeHotDefault.toLowerCase().includes('danger') ||
                       extremeHotDefault.toLowerCase().includes('life-threatening') ||
                       extremeHotDefault.toLowerCase().includes('⚠️')
console.log(`  Extreme heat has danger warning: ${hasHeatWarning} (expected: true)`)

console.log('\n=== All Extreme Temperature One-Liner Tests Complete ===')
