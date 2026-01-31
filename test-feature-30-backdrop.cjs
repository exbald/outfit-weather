#!/usr/bin/env node

/**
 * Feature #30 Verification Test: Tap outside closes drawer
 *
 * This script verifies the backdrop functionality by checking:
 * 1. Backdrop element exists in the code
 * 2. Backdrop has proper styling classes
 * 3. Backdrop has click handler
 * 4. Backdrop only renders when drawer is expanded
 * 5. Escape key handler is implemented
 */

const fs = require('fs');
const path = require('path');

const DRAWER_FILE = path.join(__dirname, 'src/components/Drawer.tsx');

console.log('============================================================');
console.log('Feature #30: Tap Outside Closes Drawer - Verification');
console.log('============================================================\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`✓ ${name}`);
    testsPassed++;
  } else {
    console.log(`✗ ${name}`);
    testsFailed++;
  }
}

// Read the Drawer component
const drawerCode = fs.readFileSync(DRAWER_FILE, 'utf-8');

console.log('Checking implementation...\n');

// Test 1: Backdrop element exists
test(
  'Backdrop element exists in JSX',
  drawerCode.includes('data-testid="drawer-backdrop"')
);

// Test 2: Backdrop only renders when expanded
test(
  'Backdrop has conditional rendering (isExpanded)',
  drawerCode.includes('{isExpanded && (')
);

// Test 3: Backdrop has click handler
test(
  'Backdrop has onClick handler',
  drawerCode.includes('onClick={collapseDrawer}') ||
  drawerCode.includes('onClick={() => setIsExpanded(false)}')
);

// Test 4: Backdrop has proper styling
test(
  'Backdrop has fixed inset positioning',
  drawerCode.includes('className="fixed inset-0')
);

test(
  'Backdrop has semi-transparent background',
  drawerCode.includes('bg-black/20') || drawerCode.includes('bg-black/30')
);

test(
  'Backdrop has blur effect',
  drawerCode.includes('backdrop-blur')
);

// Test 5: Escape key handler
test(
  'Escape key handler exists',
  drawerCode.includes('handleEscapeKey') || drawerCode.includes('e.key === \'Escape\'')
);

test(
  'Escape key listener added on mount',
  drawerCode.includes('addEventListener(\'keydown\'') ||
  drawerCode.includes('addEventListener("keydown"')
);

test(
  'Escape key listener cleaned up on unmount',
  drawerCode.includes('removeEventListener(\'keydown\'') ||
  drawerCode.includes('removeEventListener("keydown"')
);

// Test 6: ARIA attributes for modal behavior
test(
  'Drawer has aria-modal attribute when expanded',
  drawerCode.includes('aria-modal={isExpanded')
);

test(
  'Backdrop has aria-hidden="true"',
  drawerCode.includes('aria-hidden="true"')
);

// Test 7: Backdrop appears before drawer in DOM (z-index stacking)
const backdropIndex = drawerCode.indexOf('data-testid="drawer-backdrop"');
const drawerIndex = drawerCode.indexOf('bg-white/80 backdrop-blur-md rounded-t-3xl');
test(
  'Backdrop appears before drawer in DOM (for proper z-index stacking)',
  backdropIndex > 0 && backdropIndex < drawerIndex
);

// Test 8: Proper cursor on backdrop
test(
  'Backdrop has cursor-pointer for better UX',
  drawerCode.includes('cursor-pointer')
);

console.log('\n============================================================');
console.log(`Total: ${testsPassed + testsFailed}`);
console.log(`✓ Passed: ${testsPassed}`);
console.log(`✗ Failed: ${testsFailed}`);
console.log(`Pass Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
console.log('============================================================');

if (testsFailed === 0) {
  console.log('\n✓ ALL TESTS PASSED!\n');
  process.exit(0);
} else {
  console.log('\n✗ SOME TESTS FAILED!\n');
  process.exit(1);
}
