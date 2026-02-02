#!/usr/bin/env node
/**
 * Capture OG Image Screenshot
 * Takes a 1200x630 screenshot of the /og-image page
 */

import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

async function captureOgImage() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Set viewport to exact OG image dimensions
  await page.setViewportSize({ width: 1200, height: 630 })

  // Navigate to the OG image page
  const url = process.env.OG_URL || 'http://localhost:5173/og-image.html'
  console.log(`Navigating to ${url}...`)

  try {
    await page.goto(url, { waitUntil: 'networkidle' })
  } catch (error) {
    console.error('Failed to load page:', error.message)
    console.log('Make sure the dev server is running: npm run dev')
    await browser.close()
    process.exit(1)
  }

  // Wait for fonts and content to load
  await page.waitForTimeout(1000)

  // Take screenshot
  const outputPath = join(projectRoot, 'public', 'og-image.png')
  await page.screenshot({
    path: outputPath,
    type: 'png',
  })

  console.log(`Screenshot saved to: ${outputPath}`)

  await browser.close()
}

captureOgImage().catch(console.error)
