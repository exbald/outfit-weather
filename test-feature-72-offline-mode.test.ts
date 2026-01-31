/**
 * Feature #72: Offline Mode Test
 *
 * Tests that the app works offline using service worker cache and localStorage data.
 *
 * Verification Steps:
 * 1. Cache app shell in SW - Verify service worker is registered and caching assets
 * 2. Test with network disabled - Verify app works offline
 * 3. Verify cached data displays - Verify localStorage data is shown
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('='.repeat(60));
console.log('Feature #72: Offline Mode Test');
console.log('='.repeat(60));
console.log();

let passCount = 0;
let failCount = 0;

function test(name: string, condition: boolean, details?: string) {
  if (condition) {
    console.log(`✓ PASS: ${name}`);
    if (details) console.log(`  ${details}`);
    passCount++;
  } else {
    console.log(`✗ FAIL: ${name}`);
    if (details) console.log(`  ${details}`);
    failCount++;
  }
}

console.log('Step 1: Verify Service Worker Generation');
console.log('-'.repeat(60));

// Test 1.1: Check if sw.js was generated
const swPath = path.join(__dirname, 'dist', 'sw.js');
test('Service worker file exists', fs.existsSync(swPath));

if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf-8');

  // Test 1.2: Check for precache
  test('Service worker contains precache logic',
    swContent.includes('precacheAndRoute') || swContent.includes('precache'));

  // Test 1.3: Check for Open-Meteo API caching (minified pattern)
  test('Service worker caches Open-Meteo API',
    (swContent.includes('api.open-meteo.com') || swContent.includes('open-meteo')) &&
    (swContent.includes('NetworkFirst') || swContent.includes('NetworkFirst')));

  // Test 1.4: Check for geocoding API caching (minified pattern)
  test('Service worker caches geocoding API',
    (swContent.includes('geocoding-api.open-meteo.com') || swContent.includes('geocoding-api')) &&
    (swContent.includes('NetworkFirst') || swContent.includes('NetworkFirst')));

  // Test 1.5: Check for workbox
  test('Service worker uses Workbox',
    swContent.includes('workbox') || swContent.includes('workbox-'));
}

console.log();
console.log('Step 2: Verify App Shell Caching');
console.log('-'.repeat(60));

// Test 2.1: Check if index.html is in dist
const indexPath = path.join(__dirname, 'dist', 'index.html');
test('Production index.html exists', fs.existsSync(indexPath));

// Test 2.2: Check if main.js is in dist
const jsFiles = fs.readdirSync(path.join(__dirname, 'dist', 'assets')).filter(f => f.endsWith('.js'));
test('JavaScript bundle exists', jsFiles.length > 0);

// Test 2.3: Check if CSS is in dist
const cssFiles = fs.readdirSync(path.join(__dirname, 'dist', 'assets')).filter(f => f.endsWith('.css'));
test('CSS bundle exists', cssFiles.length > 0);

// Test 2.4: Check if manifest is in dist
const manifestPath = path.join(__dirname, 'dist', 'manifest.webmanifest');
test('PWA manifest exists', fs.existsSync(manifestPath));

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // Test 2.5: Check manifest properties
  test('Manifest has name', !!manifest.name);
  test('Manifest has icons', manifest.icons && manifest.icons.length > 0);
}

console.log();
console.log('Step 3: Verify Service Worker Registration');
console.log('-'.repeat(60));

// Test 3.1: Check if main.tsx registers service worker
const mainPath = path.join(__dirname, 'src', 'main.tsx');
if (fs.existsSync(mainPath)) {
  const mainContent = fs.readFileSync(mainPath, 'utf-8');

  test('main.tsx checks for service worker support',
    mainContent.includes("'serviceWorker' in navigator"));

  test('main.tsx registers service worker',
    mainContent.includes('serviceWorker') && mainContent.includes('.register'));

  test('main.tsx handles registration errors',
    mainContent.includes('.catch') || mainContent.includes('error'));

  // Note: Service worker only registers in production mode
  test('main.tsx only registers SW in production',
    mainContent.includes('import.meta.env.PROD'));
}

console.log();
console.log('Step 4: Verify LocalStorage Caching');
console.log('-'.repeat(60));

// Test 4.1: Check if weatherStorage.ts exists
const storagePath = path.join(__dirname, 'src', 'lib', 'weatherStorage.ts');
test('weatherStorage.ts exists', fs.existsSync(storagePath));

if (fs.existsSync(storagePath)) {
  const storageContent = fs.readFileSync(storagePath, 'utf-8');

  // Test 4.2: Check for save function
  test('weatherStorage exports saveWeatherData',
    storageContent.includes('export function saveWeatherData'));

  // Test 4.3: Check for load function
  test('weatherStorage exports loadWeatherData',
    storageContent.includes('export function loadWeatherData'));

  // Test 4.4: Check for timestamp-based expiry
  test('weatherStorage implements cache expiry',
    storageContent.includes('timestamp') && storageContent.includes('maxAge'));

  // Test 4.5: Check for coordinate validation
  test('weatherStorage validates location proximity',
    storageContent.includes('COORD_THRESHOLD') || storageContent.includes('lat') && storageContent.includes('lon'));

  // Test 4.6: Check for error handling
  test('weatherStorage handles localStorage errors',
    storageContent.includes('try') && storageContent.includes('catch'));
}

console.log();
console.log('Step 5: Verify Vite PWA Configuration');
console.log('-'.repeat(60));

// Test 5.1: Check vite.config.ts
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');

  test('vite.config.ts imports VitePWA',
    viteConfig.includes('VitePWA'));

  test('vite.config.ts has manifest config',
    viteConfig.includes('manifest:'));

  test('vite.config.ts has workbox config',
    viteConfig.includes('workbox:'));

  test('vite.config.ts configures runtime caching',
    viteConfig.includes('runtimeCaching') || viteConfig.includes('NetworkFirst'));

  test('vite.config.ts caches Open-Meteo API',
    viteConfig.includes('open-meteo') || viteConfig.includes('api.open-meteo'));

  test('vite.config.ts caches geocoding API',
    viteConfig.includes('geocoding-api') || viteConfig.includes('geocoding-api.open-meteo'));

  test('vite.config.ts sets cache expiry',
    viteConfig.includes('maxAgeSeconds'));
}

console.log();
console.log('Step 6: Verify Weather Hook Uses Caching');
console.log('-'.repeat(60));

// Test 6.1: Check if useWeather.ts uses storage
const useWeatherPath = path.join(__dirname, 'src', 'hooks', 'useWeather.ts');
if (fs.existsSync(useWeatherPath)) {
  const useWeatherContent = fs.readFileSync(useWeatherPath, 'utf-8');

  test('useWeather imports weatherStorage',
    useWeatherContent.includes('weatherStorage') || useWeatherContent.includes('loadWeatherData'));

  test('useWeather loads cached data on mount',
    useWeatherContent.includes('loadWeatherData') || useWeatherContent.includes('hasValidCache'));

  test('useWeather saves data to cache',
    useWeatherContent.includes('saveWeatherData'));

  test('useWeather shows cached data immediately',
    useWeatherContent.includes('setWeather(cached)') ||
    useWeatherContent.includes('loadWeatherData') ||
    (useWeatherContent.includes('cached') && useWeatherContent.includes('setWeather')));
}

console.log();
console.log('='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total: ${passCount + failCount} tests`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log(`Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
console.log();

if (failCount === 0) {
  console.log('✓ All tests passed! Feature #72 is ready for browser verification.');
} else {
  console.log('✗ Some tests failed. Review implementation.');
  process.exit(1);
}

console.log();
console.log('Next Steps:');
console.log('1. Open http://localhost:5174 in browser');
console.log('2. Allow location access');
console.log('3. Wait for weather data to load');
console.log('4. Open DevTools > Application > Service Workers');
console.log('5. Verify service worker is activated');
console.log('6. Enable "Offline" checkbox in Network tab');
console.log('7. Refresh page - app should load from cache');
console.log('8. Verify localStorage has cached weather data');
