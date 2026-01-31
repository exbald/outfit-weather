/**
 * Test script for wind speed modifier logic (Feature #22)
 */

// Import directly from the built files
import {
  isWindy,
  kmhToMph,
  mphToKmh,
  getOutfitWithWeather,
  getTemperatureBucket,
} from './src/lib/outfitLogic.ts';

const results = [];

function test(name, condition, expected, actual) {
  results.push({
    name,
    passed: condition,
    expected,
    actual,
  });
}

console.log('🧪 Testing Wind Speed Modifier Logic (Feature #22)\n');

// ============================================================================
// TEST 1: Wind Speed Threshold Detection (km/h)
// ============================================================================
console.log('Test 1: Wind speed threshold detection (km/h)');

test(
  'Below threshold (10 km/h) is not windy',
  !isWindy(10, 'kmh'),
  'false',
  String(isWindy(10, 'kmh'))
);

test(
  'At threshold (15 km/h) is windy',
  isWindy(15, 'kmh'),
  'true',
  String(isWindy(15, 'kmh'))
);

test(
  'Above threshold (20 km/h) is windy',
  isWindy(20, 'kmh'),
  'true',
  String(isWindy(20, 'kmh'))
);

test(
  'Calm wind (5 km/h) is not windy',
  !isWindy(5, 'kmh'),
  'false',
  String(isWindy(5, 'kmh'))
);

// ============================================================================
// TEST 2: Wind Speed Detection in mph
// ============================================================================
console.log('\nTest 2: Wind speed threshold detection (mph)');

test(
  'Below threshold (5 mph) is not windy',
  !isWindy(5, 'mph'),
  'false',
  String(isWindy(5, 'mph'))
);

test(
  'At threshold (9.3 mph) is windy',
  isWindy(9.3, 'mph'),
  'true',
  String(isWindy(9.3, 'mph'))
);

test(
  'Above threshold (12 mph) is windy',
  isWindy(12, 'mph'),
  'true',
  String(isWindy(12, 'mph'))
);

// ============================================================================
// TEST 3: Wind Speed Detection in m/s
// ============================================================================
console.log('\nTest 3: Wind speed threshold detection (m/s)');

test(
  '4 m/s is not windy',
  !isWindy(4, 'ms'),
  'false',
  String(isWindy(4, 'ms'))
);

test(
  '5 m/s is windy',
  isWindy(5, 'ms'),
  'true',
  String(isWindy(5, 'ms'))
);

// ============================================================================
// TEST 4: Wind Speed Detection in knots
// ============================================================================
console.log('\nTest 4: Wind speed threshold detection (knots)');

test(
  '7 knots is not windy',
  !isWindy(7, 'kn'),
  'false',
  String(isWindy(7, 'kn'))
);

test(
  '9 knots is windy',
  isWindy(9, 'kn'),
  'true',
  String(isWindy(9, 'kn'))
);

// ============================================================================
// TEST 5: Unit Conversion Accuracy
// ============================================================================
console.log('\nTest 5: Unit conversion accuracy');

test(
  'km/h to mph: 15 km/h = 9.32 mph',
  Math.abs(kmhToMph(15) - 9.320565) < 0.001,
  '~9.32',
  String(kmhToMph(15))
);

test(
  'mph to km/h: 10 mph = 16.09 km/h',
  Math.abs(mphToKmh(10) - 16.09344) < 0.001,
  '~16.09',
  String(mphToKmh(10))
);

// ============================================================================
// TEST 6: Windbreaker Emoji Addition
// ============================================================================
console.log('\nTest 6: Windbreaker emoji added to outfits');

const coolBucket = getTemperatureBucket(60, 'F');
const baseCoolOutfit = ['🧥', '👕', '👖', '👟'];
const windyCoolOutfit = getOutfitWithWeather(coolBucket, 2, 20, 'kmh');

test(
  'Windbreaker (🧥) added to cool outfit when windy',
  windyCoolOutfit.length === baseCoolOutfit.length + 1 &&
    windyCoolOutfit.includes('🧥') &&
    windyCoolOutfit.filter((e) => e === '🧥').length === 2,
  `${baseCoolOutfit.join('')} → ${windyCoolOutfit.join('')} (extra 🧥 added)`,
  `${windyCoolOutfit.join('')}`
);

const mildBucket = getTemperatureBucket(68, 'F');
const windyMildOutfit = getOutfitWithWeather(mildBucket, 2, 25, 'kmh');

test(
  'Windbreaker added to mild outfit when windy',
  windyMildOutfit.length === 5 && windyMildOutfit.includes('🧥'),
  `5 items with windbreaker: ${windyMildOutfit.join('')}`,
  `${windyMildOutfit.join('')} (${windyMildOutfit.length} items)`
);

// ============================================================================
// TEST 7: No Windbreaker for Calm Conditions
// ============================================================================
console.log('\nTest 7: No windbreaker for calm conditions');

const calmCoolOutfit = getOutfitWithWeather(coolBucket, 2, 5, 'kmh');

test(
  'No windbreaker added when calm (5 km/h)',
  calmCoolOutfit.length === baseCoolOutfit.length,
  `${baseCoolOutfit.length} items (no additions)`,
  `${calmCoolOutfit.length} items: ${calmCoolOutfit.join('')}`
);

// ============================================================================
// TEST 8: Edge Cases - Boundary Values
// ============================================================================
console.log('\nTest 8: Edge cases - boundary values');

test(
  'Exactly at threshold (15 km/h) triggers windbreaker',
  getOutfitWithWeather(coolBucket, 2, 15, 'kmh').length === baseCoolOutfit.length + 1,
  `${baseCoolOutfit.length + 1} items`,
  `${getOutfitWithWeather(coolBucket, 2, 15, 'kmh').length} items`
);

test(
  'Just below threshold (14.99 km/h) no windbreaker',
  getOutfitWithWeather(coolBucket, 2, 14.99, 'kmh').length === baseCoolOutfit.length,
  `${baseCoolOutfit.length} items`,
  `${getOutfitWithWeather(coolBucket, 2, 14.99, 'kmh').length} items`
);

// ============================================================================
// TEST 9: All Temperature Buckets Support Wind Modifier
// ============================================================================
console.log('\nTest 9: Wind modifier works for all temperature buckets');

const buckets = ['freezing', 'cold', 'cool', 'mild', 'warm', 'hot'];

buckets.forEach((bucket) => {
  const outfit = getOutfitWithWeather(bucket, 2, 20, 'kmh');
  test(
    `Windbreaker added to ${bucket} bucket`,
    outfit.includes('🧥'),
    `Includes windbreaker`,
    outfit.join('')
  );
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));

const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;
const total = results.length;

console.log(`Total: ${total}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Pass Rate: ${((passed / total) * 100).toFixed(1)}%`);

if (failed > 0) {
  console.log('\nFailed Tests:');
  results
    .filter((r) => !r.passed)
    .forEach((r) => {
      console.log(`  ❌ ${r.name}`);
      console.log(`     Expected: ${r.expected}`);
      console.log(`     Actual: ${r.actual}`);
    });
}

console.log('\n' + '='.repeat(60));

if (failed === 0) {
  console.log('✅ ALL TESTS PASSED!');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED');
  process.exit(1);
}
