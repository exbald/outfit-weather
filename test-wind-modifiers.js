/**
 * Test script for wind speed modifier logic (Feature #22)
 * Run with: node test-wind-modifiers.js
 */

// Replicate the logic inline for testing
const WIND_THRESHOLD_KMH = 15;

function kmhToMph(kmh) {
  return kmh * 0.621371;
}

function mphToKmh(mph) {
  return mph / 0.621371;
}

function isWindy(windSpeed, unit = 'kmh') {
  let windSpeedKmh;

  switch (unit) {
    case 'kmh':
      windSpeedKmh = windSpeed;
      break;
    case 'mph':
      windSpeedKmh = mphToKmh(windSpeed);
      break;
    case 'ms':
      windSpeedKmh = windSpeed * 3.6;
      break;
    case 'kn':
      windSpeedKmh = windSpeed * 1.852;
      break;
    default:
      windSpeedKmh = windSpeed;
  }

  return windSpeedKmh >= WIND_THRESHOLD_KMH;
}

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
  'At threshold (9.32 mph) is windy (15 km/h)',
  isWindy(9.32, 'mph'),
  'true',
  String(isWindy(9.32, 'mph'))
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
  '4 m/s is not windy (14.4 km/h)',
  !isWindy(4, 'ms'),
  'false',
  String(isWindy(4, 'ms'))
);

test(
  '5 m/s is windy (18 km/h)',
  isWindy(5, 'ms'),
  'true',
  String(isWindy(5, 'ms'))
);

// ============================================================================
// TEST 4: Wind Speed Detection in knots
// ============================================================================
console.log('\nTest 4: Wind speed threshold detection (knots)');

test(
  '7 knots is not windy (12.97 km/h)',
  !isWindy(7, 'kn'),
  'false',
  String(isWindy(7, 'kn'))
);

test(
  '9 knots is windy (16.67 km/h)',
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
// TEST 6: Edge Cases - Boundary Values
// ============================================================================
console.log('\nTest 6: Edge cases - boundary values');

test(
  'Exactly at threshold (15 km/h) is windy',
  isWindy(15, 'kmh'),
  'true',
  String(isWindy(15, 'kmh'))
);

test(
  'Just below threshold (14.99 km/h) is not windy',
  !isWindy(14.99, 'kmh'),
  'false',
  String(isWindy(14.99, 'kmh'))
);

// ============================================================================
// TEST 7: Different Unit Boundary Tests
// ============================================================================
console.log('\nTest 7: Boundary values for all units');

test(
  'Boundary in mph: 9.320565 mph (15 km/h) is windy',
  isWindy(9.320565, 'mph'),
  'true',
  String(isWindy(9.320565, 'mph'))
);

test(
  'Boundary in m/s: 4.167 m/s (15 km/h) is windy',
  isWindy(4.167, 'ms'),
  'true',
  String(isWindy(4.167, 'ms'))
);

test(
  'Boundary in knots: 8.1 knots (15 km/h) is windy',
  isWindy(8.1, 'kn'),
  'true',
  String(isWindy(8.1, 'kn'))
);

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
