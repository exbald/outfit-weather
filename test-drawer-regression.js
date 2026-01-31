/**
 * Regression test for Feature #27: Drawer collapsed state renders
 *
 * This test verifies that the Drawer component:
 * 1. Exists and exports correctly
 * 2. Has the correct collapsed state structure
 * 3. Is positioned at the bottom of the screen
 * 4. Has proper styling classes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running regression test for Feature #27: Drawer collapsed state\n');

let passCount = 0;
let failCount = 0;

function test(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
    passCount++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    failCount++;
  }
}

// Test 1: Drawer component file exists
const drawerPath = path.join(__dirname, 'src/components/Drawer.tsx');
test(
  'Drawer component file exists',
  fs.existsSync(drawerPath),
  `Path: ${drawerPath}`
);

// Test 2: Drawer component exports correctly
const drawerContent = fs.readFileSync(drawerPath, 'utf-8');
test(
  'Drawer exports a named export',
  drawerContent.includes('export function Drawer'),
  'Found: export function Drawer'
);

// Test 3: Collapsed state has handle indicator
test(
  'Collapsed state has handle indicator',
  drawerContent.includes('w-12 h-1.5 bg-gray-400 rounded-full'),
  'Handle bar styling present'
);

// Test 4: Collapsed state has swipe hint text
test(
  'Collapsed state has swipe hint text',
  drawerContent.includes('Swipe up') || drawerContent.includes('What to wear'),
  'Swipe hint present'
);

// Test 5: Fixed positioning at bottom
test(
  'Drawer fixed at screen bottom',
  drawerContent.includes('fixed bottom-0'),
  'Positioning: fixed bottom-0 left-0 right-0'
);

// Test 6: Frosted glass effect
test(
  'Frosted glass effect applied',
  drawerContent.includes('bg-white/80') && drawerContent.includes('backdrop-blur-md'),
  'Styling: bg-white/80 backdrop-blur-md'
);

// Test 7: Rounded top corners
test(
  'Rounded top corners for drawer',
  drawerContent.includes('rounded-t-3xl'),
  'Border radius: rounded-t-3xl'
);

// Test 8: High z-index
test(
  'Drawer has high z-index',
  drawerContent.includes('z-40'),
  'z-index: 40'
);

// Test 9: Accessibility - aria-label
test(
  'Drawer has aria-label',
  drawerContent.includes('aria-label=') || drawerContent.includes('aria-label="'),
  'Accessibility attribute present'
);

// Test 10: Toggle functionality
test(
  'Drawer has toggle state',
  drawerContent.includes('useState') && drawerContent.includes('isExpanded'),
  'State management: useState hook for isExpanded'
);

// Test 11: Drawer is used in Layout
const layoutPath = path.join(__dirname, 'src/components/Layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
test(
  'Layout imports and uses Drawer',
  layoutContent.includes("import { Drawer }") && layoutContent.includes('<Drawer'),
  'Integration: Drawer component used in Layout'
);

// Test 12: Proper responsive container
test(
  'Drawer has max-width container',
  drawerContent.includes('max-w-md mx-auto'),
  'Responsive: max-w-md mx-auto'
);

// Test 13: Click handler for expanding
test(
  'Drawer has click handler',
  drawerContent.includes('onClick=') || drawerContent.includes('onClick={toggleDrawer}'),
  'Interaction: onClick handler present'
);

// Test 14: Shadow for depth
test(
  'Drawer has shadow',
  drawerContent.includes('shadow-lg'),
  'Visual: shadow-lg for elevation'
);

// Test 15: Transition for smooth animation
test(
  'Drawer has transition',
  drawerContent.includes('transition-'),
  'Animation: transition class present'
);

console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${passCount} passed, ${failCount} failed`);
console.log('='.repeat(50));

if (failCount > 0) {
  console.log('\n⚠️  REGRESSION DETECTED: Some tests failed!');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed - No regression detected!');
  process.exit(0);
}
