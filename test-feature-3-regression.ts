/**
 * Regression Test for Feature #3: Service Worker Registration
 *
 * This test verifies that the service worker is properly configured and
 * will register correctly in the production build.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function test(name: string, condition: boolean, details: string) {
  results.push({ name, passed: condition, details });
  console.log(`${condition ? '✅' : '❌'} ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }
}

console.log('=== Feature #3: Service Worker Registration ===\n');

// Test 1: Check if service worker file exists
const swPath = join(process.cwd(), 'dist', 'sw.js');
test(
  'Service worker file exists (dist/sw.js)',
  existsSync(swPath),
  existsSync(swPath) ? 'File found in dist/' : 'File not found'
);

// Test 2: Check if registration script exists
const regSWPath = join(process.cwd(), 'dist', 'registerSW.js');
test(
  'Registration script exists (dist/registerSW.js)',
  existsSync(regSWPath),
  existsSync(regSWPath) ? 'File found in dist/' : 'File not found'
);

// Test 3: Verify registration script content
if (existsSync(regSWPath)) {
  const regSWContent = readFileSync(regSWPath, 'utf-8');
  const hasRegisterCall = regSWContent.includes('navigator.serviceWorker.register');
  const hasCheckForSW = regSWContent.includes("'serviceWorker' in navigator");
  const hasLoadListener = regSWContent.includes('addEventListener') && regSWContent.includes('load');

  test(
    'Registration script contains navigator.serviceWorker.register()',
    hasRegisterCall,
    hasRegisterCall ? 'Registration call found' : 'Registration call missing'
  );

  test(
    'Registration script checks for service worker support',
    hasCheckForSW,
    hasCheckForSW ? 'Feature detection present' : 'Feature detection missing'
  );

  test(
    'Registration script waits for window load event',
    hasLoadListener,
    hasLoadListener ? 'Load listener present' : 'Load listener missing'
  );
}

// Test 4: Verify service worker file is not empty
if (existsSync(swPath)) {
  const swContent = readFileSync(swPath, 'utf-8');
  const swNotEmpty = swContent.length > 0;
  const hasWorkbox = swContent.includes('workbox') || swContent.includes('precacheAndRoute');

  test(
    'Service worker file contains valid code',
    swNotEmpty && hasWorkbox,
    swNotEmpty && hasWorkbox ? 'Workbox service worker detected' : 'Service worker may be incomplete'
  );

  // Test 5: Check for caching strategies
  const hasNetworkFirst = swContent.includes('NetworkFirst') || swContent.includes('networkFirst');
  const hasPrecache = swContent.includes('precacheAndRoute') || swContent.includes('precache');

  test(
    'Service worker includes caching strategies',
    hasNetworkFirst && hasPrecache,
    hasNetworkFirst && hasPrecache
      ? 'Both NetworkFirst and precache found'
      : 'Caching strategies may be incomplete'
  );
}

// Test 6: Check main.tsx for registration code
const mainPath = join(process.cwd(), 'src', 'main.tsx');
if (existsSync(mainPath)) {
  const mainContent = readFileSync(mainPath, 'utf-8');
  // Remove newlines and spaces to check if the registration call exists (handles multi-line calls)
  const normalizedContent = mainContent.replace(/\s+/g, '');
  const hasSWRegister = normalizedContent.includes('navigator.serviceWorker.register');
  const hasProdCheck = mainContent.includes('import.meta.env.PROD');

  test(
    'Source code (main.tsx) contains service worker registration',
    hasSWRegister,
    hasSWRegister ? 'Registration code present' : 'Registration code missing'
  );

  test(
    'Source code checks for production mode',
    hasProdCheck,
    hasProdCheck ? 'Production mode check present' : 'Production mode check missing'
  );
}

// Test 7: Check vite.config.ts for PWA plugin
const viteConfigPath = join(process.cwd(), 'vite.config.ts');
if (existsSync(viteConfigPath)) {
  const viteConfig = readFileSync(viteConfigPath, 'utf-8');
  const hasPWAPlugin = viteConfig.includes('VitePWA') || viteConfig.includes('vite-plugin-pwa');
  const hasManifest = viteConfig.includes('manifest:');
  const hasWorkbox = viteConfig.includes('workbox:');

  test(
    'Vite config includes PWA plugin',
    hasPWAPlugin,
    hasPWAPlugin ? 'VitePWA plugin configured' : 'PWA plugin missing'
  );

  test(
    'Vite config includes web app manifest',
    hasManifest,
    hasManifest ? 'Manifest configured' : 'Manifest missing'
  );

  test(
    'Vite config includes Workbox caching strategies',
    hasWorkbox,
    hasWorkbox ? 'Workbox runtime caching configured' : 'Workbox config missing'
  );
}

// Test 8: Check production HTML for registration script injection
const indexPath = join(process.cwd(), 'dist', 'index.html');
if (existsSync(indexPath)) {
  const indexHTML = readFileSync(indexPath, 'utf-8');
  const hasRegScript = indexHTML.includes('registerSW.js');
  const hasPWAComment = indexHTML.includes('vite-plugin-pwa:register-sw');

  test(
    'Production HTML includes service worker registration script',
    hasRegScript,
    hasRegScript ? 'registerSW.js injected' : 'Registration script not injected'
  );

  test(
    'Registration script has proper PWA identifier',
    hasPWAComment,
    hasPWAComment ? 'PWA plugin comment present' : 'PWA plugin comment missing'
  );
}

// Test 9: Verify package.json includes vite-plugin-pwa dependency
const packagePath = join(process.cwd(), 'package.json');
if (existsSync(packagePath)) {
  const packageJSON = JSON.parse(readFileSync(packagePath, 'utf-8'));
  const hasPWADep = packageJSON.devDependencies?.['vite-plugin-pwa'] ||
                    packageJSON.dependencies?.['vite-plugin-pwa'];

  test(
    'package.json includes vite-plugin-pwa',
    !!hasPWADep,
    hasPWADep ? `Dependency found: ${hasPWADep}` : 'Dependency missing'
  );
}

// Summary
console.log('\n=== Test Summary ===');
const passed = results.filter(r => r.passed).length;
const total = results.length;
const percentage = ((passed / total) * 100).toFixed(1);

console.log(`Passed: ${passed}/${total} (${percentage}%)`);

if (passed === total) {
  console.log('\n✅ All tests passed! Service worker is properly configured.');
} else {
  console.log('\n❌ Some tests failed. Review the output above.');
  results
    .filter(r => !r.passed)
    .forEach(r => console.log(`   - ${r.name}: ${r.details}`));
}

// Exit with appropriate code
process.exit(passed === total ? 0 : 1);
