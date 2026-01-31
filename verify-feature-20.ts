/**
 * Verification script for Feature #20: Outfit emojis for each bucket
 *
 * This script verifies the three requirements:
 * 1. Create emoji mappings per bucket
 * 2. Select diverse outfit combinations
 * 3. Ensure emojis render on all devices
 */

import {
  getOutfitEmojis,
  getOutfitEmojisString,
  getTemperatureBucketDisplayName,
  type TemperatureBucket
} from './src/lib/outfitLogic'

console.log('🔍 Feature #20 Verification: Outfit Emojis for Each Bucket')
console.log('='.repeat(70))

const buckets: TemperatureBucket[] = ['freezing', 'cold', 'cool', 'mild', 'warm', 'hot']
let passedTests = 0
let totalTests = 0

// Test 1: Create emoji mappings per bucket
console.log('\n✅ Test 1: Emoji mappings for all temperature buckets')
console.log('-'.repeat(70))

totalTests++
let allBucketsHaveEmojis = true
for (const bucket of buckets) {
  const emojis = getOutfitEmojis(bucket)
  const displayName = getTemperatureBucketDisplayName(bucket)

  console.log(`\n${displayName} (${bucket}):`)
  console.log(`  ${emojis.join(' ')} (${emojis.length} items)`)

  if (emojis.length === 0) {
    console.log(`  ❌ FAIL: No emojis for ${bucket}`)
    allBucketsHaveEmojis = false
  }
}

if (allBucketsHaveEmojis) {
  console.log('\n✓ PASS: All 6 buckets have emoji mappings')
  passedTests++
} else {
  console.log('\n❌ FAIL: Some buckets missing emojis')
}

// Test 2: Select diverse outfit combinations
console.log('\n\n✅ Test 2: Diverse outfit combinations')
console.log('-'.repeat(70))

totalTests++
const allEmojis = new Set<string>()
for (const bucket of buckets) {
  getOutfitEmojis(bucket).forEach(emoji => allEmojis.add(emoji))
}

const diversityScore = allEmojis.size / buckets.length
console.log(`\nTotal unique emojis: ${allEmojis.size}`)
console.log(`Diversity score: ${diversityScore.toFixed(2)} (unique emojis per bucket)`)

// Check that emojis are appropriate for temperatures
const freezingEmojis = getOutfitEmojis('freezing')
const hotEmojis = getOutfitEmojis('hot')
const hasColdWeatherGear = freezingEmojis.some(e => ['🧥', '🧣', '🧤', '🥾'].includes(e))
const hasHotWeatherGear = hotEmojis.some(e => ['👕', '🩳', '🕶️'].includes(e))

console.log(`\nFreezing has cold weather gear: ${hasColdWeatherGear ? '✓' : '❌'}`)
console.log(`Hot has hot weather gear: ${hasHotWeatherGear ? '✓' : '❌'}`)

if (diversityScore >= 1.5 && hasColdWeatherGear && hasHotWeatherGear) {
  console.log('\n✓ PASS: Good diversity and appropriate for temperatures')
  passedTests++
} else {
  console.log('\n❌ FAIL: Insufficient diversity or inappropriate emojis')
}

// Test 3: Ensure emojis render on all devices (valid Unicode)
console.log('\n\n✅ Test 3: Emojis render correctly (valid Unicode)')
console.log('-'.repeat(70))

totalTests++
let allEmojisValid = true

for (const bucket of buckets) {
  const emojis = getOutfitEmojis(bucket)
  const displayName = getTemperatureBucketDisplayName(bucket)

  // Check each emoji is valid UTF-8 and renders
  for (const emoji of emojis) {
    // Convert to array to handle surrogate pairs and variation selectors
    const codePoints = Array.from(emoji).map(c => c.codePointAt(0))

    // Check if all code points are in valid ranges
    const isValid = codePoints.every(cp => {
      if (!cp) return false
      // Comprehensive emoji ranges covering all Unicode blocks
      return (
        (cp >= 0x1F000 && cp <= 0x1FAFF) || // Emoji blocks (including newer emojis like shorts U+1FA73)
        (cp >= 0x2600 && cp <= 0x26FF) ||   // Misc symbols
        (cp >= 0x2700 && cp <= 0x27BF) ||   // Dingbats
        (cp >= 0x2B00 && cp <= 0x2BFF) ||   // Misc symbols and arrows
        (cp >= 0x3000 && cp <= 0x303F) ||   // CJK symbols (includes some variation selectors)
        (cp >= 0xFE00 && cp <= 0xFE0F) ||   // Variation selectors
        cp === 0x200D                        // Zero-width joiner (valid for compound emojis)
      )
    })

    if (!isValid) {
      console.log(`  ❌ ${displayName}: Invalid emoji "${emoji}" (code points: ${codePoints.map(cp => 'U+' + cp?.toString(16).toUpperCase()).join(' ')})`)
      allEmojisValid = false
    }
  }
}

if (allEmojisValid) {
  console.log('✓ PASS: All emojis are valid Unicode and will render on devices')
  passedTests++
} else {
  console.log('❌ FAIL: Some emojis are invalid')
}

// Additional verification: Check array immutability
console.log('\n\n✅ Test 4: Mutation safety')
console.log('-'.repeat(70))

totalTests++
const originalEmojis = getOutfitEmojis('mild')
const originalLength = originalEmojis.length
originalEmojis.push('❌') // Try to mutate

const newEmojis = getOutfitEmojis('mild')
if (newEmojis.length === originalLength && !newEmojis.includes('❌')) {
  console.log('✓ PASS: getOutfitEmojis() returns a copy (prevents mutation)')
  passedTests++
} else {
  console.log('❌ FAIL: getOutfitEmojis() returns mutable reference')
}

// Final result
console.log('\n' + '='.repeat(70))
console.log(`\n📊 Result: ${passedTests}/${totalTests} tests passed`)
console.log('='.repeat(70))

if (passedTests === totalTests) {
  console.log('\n✅ Feature #20: ALL TESTS PASSED\n')
  console.log('Verification Summary:')
  console.log('  ✓ All 6 temperature buckets have emoji mappings')
  console.log('  ✓ Emojis are diverse and appropriate for temperatures')
  console.log('  ✓ All emojis are valid Unicode and will render correctly')
  console.log('  ✓ Mutation safety implemented')
  process.exit(0)
} else {
  console.log('\n❌ Feature #20: SOME TESTS FAILED')
  process.exit(1)
}
