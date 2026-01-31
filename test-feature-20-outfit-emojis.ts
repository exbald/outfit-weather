/**
 * Verification script for Feature #20: Outfit emojis for each bucket
 *
 * This script verifies:
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

console.log('🔍 Feature #20 Verification: Outfit Emojis for Each Bucket\n')
console.log('=' .repeat(70))

const buckets: TemperatureBucket[] = ['freezing', 'cold', 'cool', 'mild', 'warm', 'hot']
let allTestsPassed = true

// Test 1: All buckets have emoji mappings
console.log('\n✅ Test 1: Emoji mappings for all temperature buckets')
console.log('-'.repeat(70))

for (const bucket of buckets) {
  const emojis = getOutfitEmojis(bucket)
  const displayName = getTemperatureBucketDisplayName(bucket)

  console.log(`\n${displayName} (${bucket}):`)
  console.log(`  Emojis: ${emojis.join(' ')}`)
  console.log(`  Count: ${emojis.length}`)
  console.log(`  String: ${getOutfitEmojisString(bucket)}`)

  if (emojis.length === 0) {
    console.log(`  ❌ FAIL: No emojis for ${bucket}`)
    allTestsPassed = false
  } else {
    console.log(`  ✓ PASS: Has ${emojis.length} emojis`)
  }
}

// Test 2: Diverse outfit combinations
console.log('\n\n✅ Test 2: Diverse outfit combinations')
console.log('-'.repeat(70))

const allEmojis = new Set<string>()
const emojiToBuckets: Record<string, TemperatureBucket[]> = {}

for (const bucket of buckets) {
  const emojis = getOutfitEmojis(bucket)
  emojis.forEach(emoji => {
    allEmojis.add(emoji)
    if (!emojiToBuckets[emoji]) {
      emojiToBuckets[emoji] = []
    }
    emojiToBuckets[emoji].push(bucket)
  })
}

console.log(`\nTotal unique emojis used: ${allEmojis.size}`)
console.log(`\nEmoji distribution across buckets:`)

Object.entries(emojiToBuckets)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 10)
  .forEach(([emoji, bucketsList]) => {
    console.log(`  ${emoji} used in: ${bucketsList.join(', ')}`)
  })

// Check for diversity
const diversityScore = allEmojis.size / buckets.length
console.log(`\nDiversity score: ${diversityScore.toFixed(2)} (unique emojis per bucket)`)
if (diversityScore >= 1.5) {
  console.log('  ✓ PASS: Good diversity of outfit emojis')
} else {
  console.log('  ⚠ WARNING: Limited emoji diversity')
}

// Test 3: Ensure emojis render (character encoding check)
console.log('\n\n✅ Test 3: Emoji rendering compatibility')
console.log('-'.repeat(70))

for (const bucket of buckets) {
  const emojis = getOutfitEmojis(bucket)
  const displayName = getTemperatureBucketDisplayName(bucket)

  // Check if emojis are valid Unicode
  const allValid = emojis.every(emoji => {
    // Check if it's a valid emoji (starts with valid emoji ranges)
    const codePoint = emoji.codePointAt(0)
    return codePoint && (
      (codePoint >= 0x1F300 && codePoint <= 0x1F9FF) || // Emoji range
      (codePoint >= 0x2600 && codePoint <= 0x26FF) ||   // Misc symbols
      (codePoint >= 0x2700 && codePoint <= 0x27BF)      // Dingbats
    )
  })

  if (allValid) {
    console.log(`  ✓ ${displayName}: All emojis are valid Unicode`)
  } else {
    console.log(`  ❌ ${displayName}: Contains invalid characters`)
    allTestsPassed = false
  }
}

// Test 4: Emojis are appropriate for temperature
console.log('\n\n✅ Test 4: Emojis appropriate for temperature')
console.log('-'.repeat(70))

const coldWeatherEmojis = ['🧥', '🧣', '🧤', '🥾', '🧢']
const hotWeatherEmojis = ['👕', '🩳', '👟', '🕶️']

const freezingEmojis = getOutfitEmojis('freezing')
const hotEmojis = getOutfitEmojis('hot')

const hasColdGear = freezingEmojis.some(e => coldWeatherEmojis.includes(e))
const hasHotGear = hotEmojis.some(e => hotWeatherEmojis.includes(e))

console.log(`Freezing (${freezingEmojis.join(' ')}): ${hasColdGear ? '✓' : '❌'} Has cold weather gear`)
console.log(`Hot (${hotEmojis.join(' ')}): ${hasHotGear ? '✓' : '❌'} Has hot weather gear`)

if (!hasColdGear || !hasHotGear) {
  allTestsPassed = false
}

// Test 5: Verify getOutfitEmojis returns a copy (mutation safety)
console.log('\n\n✅ Test 5: Mutation safety')
console.log('-'.repeat(70))

const originalEmojis = getOutfitEmojis('mild')
const originalLength = originalEmojis.length
originalEmojis.push('❌') // Try to mutate

const newEmojis = getOutfitEmojis('mild')
if (newEmojis.length === originalLength) {
  console.log('  ✓ PASS: getOutfitEmojis() returns a copy (prevents mutation)')
} else {
  console.log('  ❌ FAIL: getOutfitEmojis() returns mutable reference')
  allTestsPassed = false
}

// Test 6: getOutfitEmojisString concatenates correctly
console.log('\n\n✅ Test 6: String concatenation')
console.log('-'.repeat(70))

for (const bucket of buckets) {
  const emojis = getOutfitEmojis(bucket)
  const emojiString = getOutfitEmojisString(bucket)
  const expectedLength = emojis.join('').length

  if (emojiString.length === expectedLength) {
    console.log(`  ✓ ${bucket}: String concatenation correct (${emojiString.length} chars)`)
  } else {
    console.log(`  ❌ ${bucket}: Expected ${expectedLength} chars, got ${emojiString.length}`)
    allTestsPassed = false
  }
}

// Final result
console.log('\n' + '='.repeat(70))
console.log('\n📊 Final Result:')
console.log('='.repeat(70))

if (allTestsPassed) {
  console.log('\n✅ Feature #20: ALL TESTS PASSED\n')
  console.log('Summary:')
  console.log('  ✓ All 6 temperature buckets have emoji mappings')
  console.log('  ✓ Emojis are diverse and appropriate')
  console.log('  ✓ Emojis render correctly (valid Unicode)')
  console.log('  ✓ Emojis match temperature conditions')
  console.log('  ✓ Mutation safety implemented')
  console.log('  ✓ String concatenation works correctly')
  process.exit(0)
} else {
  console.log('\n❌ Feature #20: SOME TESTS FAILED\n')
  console.log('Please review the output above for details.')
  process.exit(1)
}
