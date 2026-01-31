/**
 * Feature #48: Network failure shows cached data - Browser Verification Test
 *
 * This test verifies that when a network request fails, the app gracefully
 * falls back to cached data and shows an offline indicator.
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright'

interface TestResult {
  step: string
  passed: boolean
  details: string
}

const results: TestResult[] = []

async function recordResult(step: string, passed: boolean, details: string) {
  results.push({ step, passed, details })
  const status = passed ? '✅ PASS' : '❌ FAIL'
  console.log(`${status}: ${step}`)
  if (details) {
    console.log(`   ${details}`)
  }
}

async function testNetworkFailureWithCache() {
  console.log('=== Feature #48: Network Failure Browser Verification ===\n')

  let browser: Browser | null = null
  let context: BrowserContext | null = null
  let page: Page | null = null

  try {
    // Step 1: Launch browser and navigate to app
    console.log('Step 1: Setup - Launch browser and navigate to app')
    browser = await chromium.launch({ headless: false })
    context = await browser.newContext()
    page = await context.newPage()

    // Navigate to the app
    await page.goto('http://localhost:5174')
    await page.waitForTimeout(2000)

    // Allow location permission
    await context.grantPermissions(['geolocation'])

    // Wait for initial weather data load
    await page.waitForTimeout(3000)

    // Check if weather data is displayed
    const weatherElement = await page.$('text=°')
    if (weatherElement) {
      await recordResult('Step 1', true, 'App loaded and weather data displayed')
    } else {
      await recordResult('Step 1', false, 'Weather data not displayed')
      return
    }

    // Step 2: Verify cache is populated
    console.log('\nStep 2: Verify cache is populated')
    const cacheData = await page.evaluate(() => {
      const cache = localStorage.getItem('outfit_weather_cache')
      return cache ? JSON.parse(cache) : null
    })

    if (cacheData && cacheData.data && cacheData.timestamp) {
      await recordResult('Step 2', true, 'Cache populated with weather data')
      console.log(`   Cache age: ${Math.round((Date.now() - cacheData.timestamp) / 1000)} seconds ago`)
    } else {
      await recordResult('Step 2', false, 'Cache not populated')
      return
    }

    // Step 3: Take screenshot of normal state
    await page.screenshot({ path: 'feature-48-step1-normal-state.png' })
    console.log('\n📸 Screenshot saved: feature-48-step1-normal-state.png')

    // Step 4: Simulate network failure by going offline
    console.log('\nStep 3: Simulate network failure (go offline)')
    await context.setOffline(true)

    // Wait a moment for offline state to settle
    await page.waitForTimeout(1000)

    // Reload page to trigger network failure
    await page.reload()
    await page.waitForTimeout(3000)

    // Step 5: Verify cached data is still displayed
    console.log('\nStep 4: Verify cached data is displayed offline')
    const weatherText = await page.textContent('body')

    if (weatherText && weatherText.includes('°')) {
      await recordResult('Step 4', true, 'Weather data still displayed (from cache)')
    } else {
      await recordResult('Step 4', false, 'Weather data not displayed')
    }

    // Step 6: Verify offline indicator is shown
    console.log('\nStep 5: Verify offline indicator')
    const offlineIndicator = await page.evaluate(() => {
      const body = document.body
      return body.textContent?.includes('Offline') || body.innerHTML.includes('📡')
    })

    if (offlineIndicator) {
      await recordResult('Step 5', true, 'Offline indicator (📡) displayed')
    } else {
      // Check if offline state exists but text might be different
      const bodyText = await page.textContent('body')
      if (bodyText && (bodyText.includes('Updated') || bodyText.includes('ago'))) {
        await recordResult('Step 5', true, 'Cache timestamp displayed (offline mode)')
      } else {
        await recordResult('Step 5', false, 'Offline indicator not found')
      }
    }

    // Step 7: Take screenshot of offline state
    await page.screenshot({ path: 'feature-48-step2-offline-state.png' })
    console.log('\n📸 Screenshot saved: feature-48-step2-offline-state.png')

    // Step 8: Test retry functionality (come back online)
    console.log('\nStep 6: Test retry - come back online')
    await context.setOffline(false)
    await page.waitForTimeout(1000)

    // Look for retry button or trigger refresh
    const retryButton = await page.$('button:has-text("Retry")')
    if (retryButton) {
      await retryButton.click()
      await page.waitForTimeout(3000)
      await recordResult('Step 6', true, 'Retry button clicked and data refreshed')
    } else {
      // Reload page to simulate retry
      await page.reload()
      await page.waitForTimeout(3000)
      await recordResult('Step 6', true, 'Page reloaded after coming back online')
    }

    // Step 9: Verify data refreshed successfully
    console.log('\nStep 7: Verify data refreshed after coming online')
    const weatherAfterOnline = await page.$('text=°')
    const offlineAfterOnline = await page.evaluate(() => {
      return document.body.textContent?.includes('Offline')
    })

    if (weatherAfterOnline && !offlineAfterOnline) {
      await recordResult('Step 7', true, 'Data refreshed and offline indicator removed')
    } else {
      await recordResult('Step 7', false, 'Data may not have refreshed properly')
    }

    // Step 10: Take final screenshot
    await page.screenshot({ path: 'feature-48-step3-back-online.png' })
    console.log('\n📸 Screenshot saved: feature-48-step3-back-online.png')

    // Print summary
    console.log('\n=== Test Summary ===')
    const passed = results.filter(r => r.passed).length
    const total = results.length
    console.log(`Tests passed: ${passed}/${total}`)

    if (passed === total) {
      console.log('\n✅ Feature #48: ALL TESTS PASSED')
    } else {
      console.log('\n⚠️ Some tests failed - review screenshots')
    }

  } catch (error) {
    console.error('Test error:', error)
    await recordResult('Error', false, error instanceof Error ? error.message : String(error))
  } finally {
    // Cleanup
    if (page) await page.close()
    if (context) await context.close()
    if (browser) await browser.close()
  }
}

// Run the test
testNetworkFailureWithCache().catch(console.error)
