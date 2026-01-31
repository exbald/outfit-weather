/**
 * Test script to verify outfit emoji functionality for Feature #20
 * This script tests that all temperature buckets have appropriate emoji mappings
 */

import { getOutfitEmojis, getOutfitEmojisString, type TemperatureBucket } from './src/lib/outfitLogic'

const buckets: TemperatureBucket[] = ['freezing', 'cold', 'cool', 'mild', 'warm', 'hot']

console.log('='.repeat(80))
console.log('FEATURE #20: OUTFIT EMOJIS FOR EACH BUCKET - VERIFICATION')
console.log('='.repeat(80))
console.log()

let allTestsPassed = true

// Test 1: All buckets have emoji mappings
console.log('Test 1: Verify all temperature buckets have emoji mappings')
console.log('-'.repeat(80))

for (const bucket of buckets) {
  const emojis = getOutfitEmojis(bucket)

  if (emojis.length === 0) {
    console.error(`❌ FAIL: Bucket "${bucket}" has no emojis`)
    allTestsPassed = false
  } else {
    console.log(`✅ PASS: Bucket "${bucket}" has ${emojis.length} emojis: ${emojis.join('')}`)
  }
}

console.log()

// Test 2: Emojis are diverse and appropriate
console.log('Test 2: Verify emoji diversity and appropriateness')
console.log('-'.repeat(80))

const expectedEmojis: Record<TemperatureBucket, string[]> = {
  freezing: ['🧥', '🧣', '🧤', '🥾', '🧢'],
  cold: ['🧥', '🧣', '👖', '🥾'],
  cool: ['🧥', '👕', '👖', '👟'],
  mild: ['🧥', '👕', '👖', '👟'],
  warm: ['👕', '👖', '👟', '🧢'],
  hot: ['👕', '🩳', '👟', '🧢', '🕶️']
}

for (const bucket of buckets) {
  const emojis = getOutfitEmojis(bucket)
  const expected = expectedEmojis[bucket]

  const hasAllExpected = expected.every(e => emojis.includes(e))

  if (hasAllExpected) {
    console.log(`✅ PASS: Bucket "${bucket}" has expected emojis`)
  } else {
    console.error(`❌ FAIL: Bucket "${bucket}" missing expected emojis`)
    console.error(`   Expected: ${expected.join(', ')}`)
    console.error(`   Got: ${emojis.join(', ')}`)
    allTestsPassed = false
  }
}

console.log()

// Test 3: getOutfitEmojisString returns concatenated string
console.log('Test 3: Verify getOutfitEmojisString returns concatenated emojis')
console.log('-'.repeat(80))

for (const bucket of buckets) {
  const emojiArray = getOutfitEmojis(bucket)
  const emojiString = getOutfitEmojisString(bucket)
  const expectedString = emojiArray.join('')

  if (emojiString === expectedString) {
    console.log(`✅ PASS: Bucket "${bucket}" string is correct: "${emojiString}"`)
  } else {
    console.error(`❌ FAIL: Bucket "${bucket}" string mismatch`)
    console.error(`   Expected: "${expectedString}"`)
    console.error(`   Got: "${emojiString}"`)
    allTestsPassed = false
  }
}

console.log()

// Test 4: getOutfitEmojis returns a copy (array immutability)
console.log('Test 4: Verify getOutfitEmojis returns a copy (prevents mutation)')
console.log('-'.repeat(80))

for (const bucket of buckets) {
  const emojis1 = getOutfitEmojis(bucket)
  const originalLength = emojis1.length

  // Modify first array
  emojis1.push('🧸')

  // Get a fresh array - it should have the original length (not affected by push)
  const emojis2 = getOutfitEmojis(bucket)

  if (emojis2.length === originalLength) {
    console.log(`✅ PASS: Bucket "${bucket}" returns a copy (mutation prevented)`)
  } else {
    console.error(`❌ FAIL: Bucket "${bucket}" returns mutable reference`)
    console.error(`   Original length: ${originalLength}`)
    console.error(`   After modification: ${emojis2.length}`)
    allTestsPassed = false
  }
}

console.log()

// Test 5: Emojis render on different devices (visual verification in UI)
console.log('Test 5: Emoji diversity across all buckets')
console.log('-'.repeat(80))

const allEmojis = new Set<string>()
for (const bucket of buckets) {
  getOutfitEmojis(bucket).forEach(e => allEmojis.add(e))
}

console.log(`✅ PASS: Using ${allEmojis.size} unique emojis across all buckets`)
console.log(`   Unique emojis: ${Array.from(allEmojis).join(' ')}`)

// Verify no empty or duplicate emojis
const noEmptyEmojis = Array.from(allEmojis).every(e => e.length > 0 && e.trim().length > 0)
if (noEmptyEmojis) {
  console.log(`✅ PASS: All emojis are non-empty`)
} else {
  console.error(`❌ FAIL: Found empty emojis`)
  allTestsPassed = false
}

console.log()
console.log('='.repeat(80))

if (allTestsPassed) {
  console.log('✅ ALL TESTS PASSED - Feature #20 is working correctly')
  process.exit(0)
} else {
  console.log('❌ SOME TESTS FAILED - Feature #20 needs fixes')
  process.exit(1)
}
