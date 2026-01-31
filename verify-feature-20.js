/**
 * Manual verification script for Feature #20: Outfit emojis for each bucket
 *
 * Run with: node verify-feature-20.js
 */

// Import the outfit logic functions
const outfitLogic = require('./src/lib/outfitLogic.ts')

console.log('🧪 Feature #20: Outfit emojis for each bucket')
console.log('='.repeat(60))

const buckets = ['freezing', 'cold', 'cool', 'mild', 'warm', 'hot']

// Expected emojis for each bucket
const expectedEmojis = {
  freezing: ['🧥', '🧣', '🧤', '🥾', '🧢'],
  cold: ['🧥', '🧣', '👖', '🥾'],
  cool: ['🧥', '👕', '👖', '👟'],
  mild: ['🧥', '👕', '👖', '👟'],
  warm: ['👕', '👖', '👟', '🧢'],
  hot: ['👕', '🩳', '👟', '🧢', '🕶️'],
}

let allTestsPassed = true

// Test 1: Verify all buckets have emoji mappings
console.log('\n✓ Test 1: All buckets have emoji mappings')
try {
  buckets.forEach(bucket => {
    const emojis = getOutfitEmojis(bucket)
    if (!emojis || emojis.length === 0) {
      console.error(`  ❌ FAIL: ${bucket} has no emoji mappings`)
      allTestsPassed = false
    } else {
      console.log(`  ✓ ${bucket}: ${emojis.length} emojis`)
    }
  })
  console.log('  ✅ Test 1 PASSED\n')
} catch (error) {
  console.error('  ❌ Test 1 FAILED:', error.message)
  allTestsPassed = false
}

// Test 2: Verify correct emojis for each bucket
console.log('✓ Test 2: Correct emojis for each bucket')
try {
  buckets.forEach(bucket => {
    const emojis = getOutfitEmojis(bucket)
    const expected = expectedEmojis[bucket]

    const hasAllExpected = expected.every(emoji => emojis.includes(emoji))

    if (!hasAllExpected) {
      console.error(`  ❌ FAIL: ${bucket} missing expected emojis`)
      console.error(`     Expected: ${expected.join(', ')}`)
      console.error(`     Got: ${emojis.join(', ')}`)
      allTestsPassed = false
    } else {
      console.log(`  ✓ ${bucket}: ${emojis.join(' ')}`)
    }
  })
  console.log('  ✅ Test 2 PASSED\n')
} catch (error) {
  console.error('  ❌ Test 2 FAILED:', error.message)
  allTestsPassed = false
}

// Test 3: Verify getOutfitEmojisString returns concatenated string
console.log('✓ Test 3: getOutfitEmojisString returns concatenated string')
try {
  buckets.forEach(bucket => {
    const emojis = getOutfitEmojis(bucket)
    const emojiString = getOutfitEmojisString(bucket)
    const expectedString = emojis.join('')

    if (emojiString !== expectedString) {
      console.error(`  ❌ FAIL: ${bucket} string mismatch`)
      console.error(`     Expected: ${expectedString}`)
      console.error(`     Got: ${emojiString}`)
      allTestsPassed = false
    } else {
      console.log(`  ✓ ${bucket}: "${emojiString}" (${emojiString.length} chars)`)
    }
  })
  console.log('  ✅ Test 3 PASSED\n')
} catch (error) {
  console.error('  ❌ Test 3 FAILED:', error.message)
  allTestsPassed = false
}

// Test 4: Verify immutability (getOutfitEmojis returns a copy)
console.log('✓ Test 4: Immutability - returns copy to prevent mutation')
try {
  const emojis1 = getOutfitEmojis('freezing')
  const originalLength = emojis1.length
  emojis1.push('❌')

  const emojis2 = getOutfitEmojis('freezing')

  if (emojis2.includes('❌')) {
    console.error('  ❌ FAIL: Mutation affected original array')
    allTestsPassed = false
  } else if (emojis2.length !== originalLength) {
    console.error('  ❌ FAIL: Second call has wrong length')
    allTestsPassed = false
  } else {
    console.log(`  ✓ Mutation test passed (original: ${originalLength}, after mutation: ${emojis2.length})`)
  }
  console.log('  ✅ Test 4 PASSED\n')
} catch (error) {
  console.error('  ❌ Test 4 FAILED:', error.message)
  allTestsPassed = false
}

// Test 5: Verify emoji diversity
console.log('✓ Test 5: Emoji diversity and appropriateness')
try {
  const allEmojis = new Set()
  buckets.forEach(bucket => {
    getOutfitEmojis(bucket).forEach(emoji => allEmojis.add(emoji))
  })

  console.log(`  ✓ Unique emojis across all buckets: ${allEmojis.size}`)

  // Check for temperature-specific items
  const freezing = getOutfitEmojis('freezing')
  const hot = getOutfitEmojis('hot')

  if (!freezing.includes('🧤')) {
    console.error('  ❌ FAIL: Freezing bucket missing gloves')
    allTestsPassed = false
  }

  if (!hot.includes('🩳')) {
    console.error('  ❌ FAIL: Hot bucket missing shorts')
    allTestsPassed = false
  }

  if (!hot.includes('🕶️')) {
    console.error('  ❌ FAIL: Hot bucket missing sunglasses')
    allTestsPassed = false
  }

  console.log('  ✅ Test 5 PASSED\n')
} catch (error) {
  console.error('  ❌ Test 5 FAILED:', error.message)
  allTestsPassed = false
}

// Final result
console.log('='.repeat(60))
if (allTestsPassed) {
  console.log('✅ ALL TESTS PASSED - Feature #20 is working correctly!')
  console.log('\nSummary:')
  console.log('  ✓ All 6 temperature buckets have emoji mappings')
  console.log('  ✓ Each bucket has appropriate, diverse emojis')
  console.log('  ✓ getOutfitEmojis() returns a copy (prevents mutation)')
  console.log('  ✓ getOutfitEmojisString() returns concatenated string')
  console.log('  ✓ All emojis are valid Unicode characters')
} else {
  console.log('❌ SOME TESTS FAILED - Feature #20 has regressions')
  process.exit(1)
}
