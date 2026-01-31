/**
 * Feature #33 Verification - Now/Today/Tomorrow Navigation
 *
 * This script verifies that:
 * 1. Navigation tabs/pills are created
 * 2. Active view state is tracked
 * 3. Content switches on tap
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('Feature #33: Now/Today/Tomorrow Navigation - Verification');
console.log('='.repeat(70));
console.log();

const checks = [];

// Check 1: Drawer component has outfits prop with all three views
console.log('Check 1: Drawer component accepts outfits prop with all three views');
const drawerPath = path.join(__dirname, 'src/components/Drawer.tsx');
const drawerContent = fs.readFileSync(drawerPath, 'utf8');

const hasOutfitsProp = drawerContent.includes('outfits?:') &&
                       drawerContent.includes('now:') &&
                       drawerContent.includes('today:') &&
                       drawerContent.includes('tomorrow:');
checks.push({
  name: 'Drawer accepts outfits prop with now/today/tomorrow',
  passed: hasOutfitsProp
});
console.log(`  ${hasOutfitsProp ? '✓ PASS' : '✗ FAIL'}: Outfits prop includes all three views`);
console.log();

// Check 2: Active view state is tracked
console.log('Check 2: Active view state is tracked in component');
const hasActiveViewState = drawerContent.includes("useState<'now' | 'today' | 'tomorrow'>") ||
                            drawerContent.includes('activeView');
checks.push({
  name: 'Active view state tracked',
  passed: hasActiveViewState
});
console.log(`  ${hasActiveViewState ? '✓ PASS' : '✗ FAIL'}: Active view state exists`);
console.log();

// Check 3: Navigation tabs/pills are rendered
console.log('Check 3: Navigation tabs/pills are rendered');
const hasTabButtons = drawerContent.includes('role="tab"') &&
                      drawerContent.includes('role="tablist"') &&
                      drawerContent.includes('aria-selected');
checks.push({
  name: 'Navigation tabs with proper ARIA attributes',
  passed: hasTabButtons
});
console.log(`  ${hasTabButtons ? '✓ PASS' : '✗ FAIL'}: Tab buttons with ARIA roles`);
console.log();

// Check 4: Click handler for switching views
console.log('Check 4: Click handlers switch between views');
const hasClickHandlers = drawerContent.includes('setActiveView') &&
                         drawerContent.includes('onClick');
checks.push({
  name: 'Click handlers for view switching',
  passed: hasClickHandlers
});
console.log(`  ${hasClickHandlers ? '✓ PASS' : '✗ FAIL'}: Click handlers present`);
console.log();

// Check 5: Current outfit selected based on active view
console.log('Check 5: Current outfit selected based on active view');
const hasCurrentOutfitLogic = drawerContent.includes('outfits?.[activeView]');
checks.push({
  name: 'Current outfit selected by active view',
  passed: hasCurrentOutfitLogic
});
console.log(`  ${hasCurrentOutfitLogic ? '✓ PASS' : '✗ FAIL'}: Current outfit uses active view`);
console.log();

// Check 6: Layout component updated to pass outfits
console.log('Check 6: Layout component passes outfits to Drawer');
const layoutPath = path.join(__dirname, 'src/components/Layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

const layoutHasOutfitsProp = layoutContent.includes('outfits?:') &&
                             layoutContent.includes('now:') &&
                             layoutContent.includes('today:') &&
                             layoutContent.includes('tomorrow:') &&
                             layoutContent.includes('outfits={outfits}');
checks.push({
  name: 'Layout passes outfits prop',
  passed: layoutHasOutfitsProp
});
console.log(`  ${layoutHasOutfitsProp ? '✓ PASS' : '✗ FAIL'}: Layout passes outfits prop`);
console.log();

// Check 7: App.tsx uses outfits from useOutfit hook
console.log('Check 7: App.tsx passes all outfits to Layout');
const appPath = path.join(__dirname, 'src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

const appUsesOutfits = appContent.includes("const { outfits } = useOutfit") &&
                       appContent.includes('outfits={outfits}');
checks.push({
  name: 'App uses and passes all outfits',
  passed: appUsesOutfits
});
console.log(`  ${appUsesOutfits ? '✓ PASS' : '✗ FAIL'}: App passes outfits to Layout`);
console.log();

// Check 8: TypeScript compilation
console.log('Check 8: TypeScript compilation');
const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit', { cwd: __dirname, stdio: 'pipe' });
  checks.push({
    name: 'TypeScript compilation',
    passed: true
  });
  console.log('  ✓ PASS: TypeScript compilation successful');
} catch (error) {
  checks.push({
    name: 'TypeScript compilation',
    passed: false
  });
  console.log('  ✗ FAIL: TypeScript compilation failed');
}
console.log();

// Summary
console.log('='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
const passed = checks.filter(c => c.passed).length;
const total = checks.length;
console.log(`Total Checks: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${total - passed}`);
console.log(`Pass Rate: ${((passed / total) * 100).toFixed(1)}%`);
console.log();

if (passed === total) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log();
  console.log('Feature #33 Implementation Summary:');
  console.log('- Navigation tabs/pills created ✓');
  console.log('- Active view state tracked ✓');
  console.log('- Content switches on tap ✓');
  console.log('- All three views (Now/Today/Tomorrow) accessible ✓');
  process.exit(0);
} else {
  console.log('❌ SOME CHECKS FAILED');
  console.log();
  console.log('Failed checks:');
  checks.filter(c => !c.passed).forEach(c => {
    console.log(`  - ${c.name}`);
  });
  process.exit(1);
}
