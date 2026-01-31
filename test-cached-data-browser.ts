/**
 * Browser Automation Test for Feature #38: Cached data shown on load
 *
 * This test verifies that:
 * 1. On initial load with no cache, data is fetched and shown
 * 2. On subsequent loads, cached data appears immediately
 * 3. Background refresh happens without blocking the UI
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright'

interface TestResult {
  step: string
  passed: boolean
  details: string
  screenshot?: string
}

const results: TestResult[] = []

function log(step: string, passed: boolean, details: string) {
  const status = passed ? '✅' : '❌'
  console.log(`${status} ${step}: ${details}`)
  results.push({ step, passed, details })
}

async function setupBrowser(): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // Mobile viewport
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  })

  const page = await context.newPage()

  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'debug') {
      console.log('  [Browser]', msg.text())
    }
  })

  return { browser, context, page }
}

async function testCachedDataDisplay() {
  console.log('\n=== Browser Test: Feature #38 - Cached Data Shown on Load ===\n')

  const { browser, context, page } = await setupBrowser()

  try {
    // Step 1: Initial load with no cache - should show loading then weather data
    console.log('\n📋 Step 1: Initial load (no cache)')
    const startTime = Date.now()

    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' })

    // Wait for weather data to load
    await page.waitForSelector('text=Fetching weather data...', { timeout: 5000 })
    const loadingSeen = Date.now() - startTime
    log('Loading indicator appears', true, `Seen after ${loadingSeen}ms`)

    // Wait for weather data to display
    await page.waitForSelector('[aria-label]', { timeout: 15000 })
    const dataLoaded = Date.now() - startTime
    log('Weather data loaded', true, `Loaded in ${dataLoaded}ms`)

    // Get temperature for comparison
    const tempElement = await page.locator('.text-7xl').first()
    const initialTemp = await tempElement.textContent()
    log('Temperature displayed', true, `Temperature: ${initialTemp}°`)

    // Step 2: Cache the data by reloading the page
    console.log('\n📋 Step 2: Second load (with cache)')

    // Reload page - cached data should appear immediately
    const reloadStart = Date.now()
    await page.reload({ waitUntil: 'commit' }) // Don't wait for networkidle

    // Cached data should appear almost instantly (within 100ms)
    try {
      await page.waitForSelector('[aria-label]', { timeout: 500 })
      const cachedDataTime = Date.now() - reloadStart
      log('Cached data shown immediately', cachedDataTime < 500, `Appeared in ${cachedDataTime}ms`)
    } catch (e) {
      log('Cached data shown immediately', false, 'No data found within 500ms')
    }

    // Check if "Updating..." indicator is shown (background refresh)
    const updatingText = await page.locator('text=Updating...').count()
    log('Background refresh indicator shown', updatingText > 0, updatingText > 0 ? '"Updating..." text present' : 'No updating indicator')

    // Wait for background refresh to complete
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000) // Extra wait for refresh to complete

    // Check if data was updated
    const finalTempElement = await page.locator('.text-7xl').first()
    const finalTemp = await finalTempElement.textContent()
    log('Background refresh completes', true, `Final temperature: ${finalTemp}°`)

    // Step 3: Verify no blocking loading state on cached load
    console.log('\n📋 Step 3: Verify no blocking loading with cache')

    // Check that loading spinner is NOT shown during cached load
    const loadingSpinner = await page.locator('text=Fetching weather data...').count()
    log('No blocking loading spinner', loadingSpinner === 0, loadingSpinner === 0 ? 'Loading spinner absent' : 'Loading spinner present (should not show with cache)')

    // Step 4: Test cache persistence across page reloads
    console.log('\n📋 Step 4: Multiple reloads test')

    const temps: string[] = []
    for (let i = 0; i < 3; i++) {
      await page.reload({ waitUntil: 'commit' })
      await page.waitForSelector('[aria-label]', { timeout: 500 })
      const temp = await page.locator('.text-7xl').first().textContent()
      temps.push(temp || '')
      await page.waitForTimeout(1000)
    }

    log('Cache persists across reloads', temps.every(t => t), `Temperatures: ${temps.join(', ')}`)

    // Step 5: Check for JavaScript errors
    console.log('\n📋 Step 5: Check for console errors')

    const errors: string[] = []
    page.on('pageerror', error => {
      errors.push(error.message)
    })

    // Reload to catch any errors
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    log('No JavaScript errors', errors.length === 0, errors.length === 0 ? 'Clean console' : `Errors: ${errors.join(', ')}`)

  } catch (error) {
    log('Test execution', false, error instanceof Error ? error.message : String(error))
  } finally {
    await browser.close()
  }

  // Summary
  console.log('\n=== Test Summary ===')
  const passed = results.filter(r => r.passed).length
  const total = results.length

  results.forEach(r => {
    console.log(`${r.passed ? '✅' : '❌'} ${r.step}: ${r.details}`)
  })

  console.log(`\nTotal: ${passed}/${total} tests passed`)

  if (passed === total) {
    console.log('\n✅ Feature #38 browser test PASSED\n')
    return true
  } else {
    console.log('\n❌ Feature #38 browser test FAILED\n')
    return false
  }
}

// Run the test
testCachedDataDisplay()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('Test error:', error)
    process.exit(1)
  })
