/**
 * Test Feature #76: Extreme temperature background colors
 */

import {
  getBackgroundColor,
  getTextColor,
} from './src/lib/adaptiveBackground'

console.log('=== Feature #76: Extreme Temperature Background Test ===\n')

console.log('1. Light Mode Background Colors:')

const extremeFreezingLight = getBackgroundColor(-25, 0, 1, 'F', false)
console.log(`  Extreme freezing (-25°F): ${extremeFreezingLight}`)

const extremeHotLight = getBackgroundColor(115, 0, 1, 'F', false)
console.log(`  Extreme heat (115°F): ${extremeHotLight}`)

const regularFreezingLight = getBackgroundColor(25, 0, 1, 'F', false)
console.log(`  Regular freezing (25°F): ${regularFreezingLight}`)

const regularHotLight = getBackgroundColor(85, 0, 1, 'F', false)
console.log(`  Regular hot (85°F): ${regularHotLight}`)

console.log('\n2. Dark Mode Background Colors:')

const extremeFreezingDark = getBackgroundColor(-25, 0, 0, 'F', false)
console.log(`  Extreme freezing night (-25°F): ${extremeFreezingDark}`)

const extremeHotDark = getBackgroundColor(115, 0, 0, 'F', false)
console.log(`  Extreme heat night (115°F): ${extremeHotDark}`)

console.log('\n3. Text Colors for Extreme Backgrounds:')

const extremeFreezingPrimary = getTextColor(extremeFreezingLight, 'primary')
const extremeFreezingSecondary = getTextColor(extremeFreezingLight, 'secondary')
console.log(`  Extreme freezing light - Primary: ${extremeFreezingPrimary}, Secondary: ${extremeFreezingSecondary}`)

const extremeHotPrimary = getTextColor(extremeHotLight, 'primary')
const extremeHotSecondary = getTextColor(extremeHotLight, 'secondary')
console.log(`  Extreme heat light - Primary: ${extremeHotPrimary}, Secondary: ${extremeHotSecondary}`)

const extremeFreezingDarkPrimary = getTextColor(extremeFreezingDark, 'primary')
const extremeFreezingDarkSecondary = getTextColor(extremeFreezingDark, 'secondary')
console.log(`  Extreme freezing dark - Primary: ${extremeFreezingDarkPrimary}, Secondary: ${extremeFreezingDarkSecondary}`)

console.log('\n4. System Dark Mode Override:')

const extremeFreezingSystemDark = getBackgroundColor(-25, 0, 1, 'F', true) // Day but system dark mode
console.log(`  Extreme freezing, system dark mode: ${extremeFreezingSystemDark}`)

const extremeHotSystemDark = getBackgroundColor(115, 0, 1, 'F', true)
console.log(`  Extreme heat, system dark mode: ${extremeHotSystemDark}`)

console.log('\n5. Verify distinct colors for extreme vs regular:')

const areDistinctFreezing = extremeFreezingLight !== regularFreezingLight
console.log(`  Extreme freezing ≠ Regular freezing: ${areDistinctFreezing} (expected: true)`)

const areDistinctHot = extremeHotLight !== regularHotLight
console.log(`  Extreme heat ≠ Regular hot: ${areDistinctHot} (expected: true)`)

const areDistinctBoth = extremeFreezingLight !== extremeHotLight
console.log(`  Extreme freezing ≠ Extreme heat: ${areDistinctBoth} (expected: true)`)

console.log('\n=== All Extreme Background Tests Complete ===')
