/**
 * WCAG AA Color Contrast Audit - ACTUAL Usage Test
 *
 * This script audits only the ACTUAL color combinations used in the app,
 * not all theoretical combinations. This is the real test for WCAG compliance.
 */

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Calculate relative luminance of a color
 * Formula from WCAG 2.0 specification
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 * Returns value from 1:1 to 21:1
 */
function getContrastRatio(fg: string, bg: string): number {
  const fgRgb = hexToRgb(fg)
  const bgRgb = hexToRgb(bg)

  if (!fgRgb || !bgRgb) {
    throw new Error(`Invalid hex color: fg=${fg}, bg=${bg}`)
  }

  const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)

  const lighter = Math.max(fgLum, bgLum)
  const darker = Math.min(fgLum, bgLum)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * All background colors used in OutFitWeather
 */
const BACKGROUNDS = {
  // Light mode backgrounds
  freezing_light: '#e0e7ef',
  cold_light: '#dbeafe',
  cool_light: '#f1f5f9',
  mild_light: '#ecfdf5',
  warm_light: '#fef3c7',
  hot_light: '#ffedd5',
  rain_light: '#e2e8f0',

  // Dark mode backgrounds
  freezing_dark: '#1e293b',
  cold_dark: '#1e3a5f',
  cool_dark: '#334155',
  mild_dark: '#1c3d32',
  warm_dark: '#423d18',
  hot_dark: '#4a2c0a',
  rain_dark: '#374151',

  // Special backgrounds
  drawer: '#ffffff', // bg-white/80
  modal: '#ffffff',
  button_blue: '#3b82f6', // bg-blue-500
  button_gray: '#f3f4f6', // bg-gray-100
}

/**
 * Text colors from adaptiveBackground.ts
 */
const TEXT_COLORS = {
  // Light mode text colors (used on light backgrounds)
  primary_light: '#111827',   // gray-900
  secondary_light: '#374151', // gray-700
  tertiary_light: '#4b5563',  // gray-600 (changed from gray-500 for better contrast)
  muted_light: '#4b5563',     // gray-600 (changed from gray-500 for better contrast)

  // Dark mode text colors (used on dark backgrounds)
  primary_dark: '#ffffff',   // white
  secondary_dark: '#e5e7eb', // gray-100
  tertiary_dark: '#d1d5db',  // gray-300
  muted_dark: '#d1d5db',     // gray-300 (changed from gray-400 for better contrast)

  // Other colors
  gray_700: '#374151',
  gray_800: '#1f2937',
  white: '#ffffff',
  orange_600: '#ea580c',
}

interface TestCase {
  name: string
  fg: string
  bg: string
  isLargeText: boolean
  location: string
}

/**
 * ACTUAL color combinations used in the app
 * Based on useAdaptiveTextColors hook behavior
 */
const actualCombinations: TestCase[] = [
  // ============================================
  // LIGHT MODE - Light backgrounds + Dark text
  // ============================================

  // Primary headings (gray-900, large text = 3:1 required)
  { name: 'Cool bg - Primary heading', fg: TEXT_COLORS.primary_light, bg: BACKGROUNDS.cool_light, isLargeText: true, location: 'Temperature display' },
  { name: 'Mild bg - Primary heading', fg: TEXT_COLORS.primary_light, bg: BACKGROUNDS.mild_light, isLargeText: true, location: 'Temperature display' },
  { name: 'Warm bg - Primary heading', fg: TEXT_COLORS.primary_light, bg: BACKGROUNDS.warm_light, isLargeText: true, location: 'Temperature display' },

  // Secondary text (gray-700, normal text = 4.5:1 required)
  { name: 'Cool bg - Secondary text', fg: TEXT_COLORS.secondary_light, bg: BACKGROUNDS.cool_light, isLargeText: false, location: 'Condition description' },
  { name: 'Mild bg - Secondary text', fg: TEXT_COLORS.secondary_light, bg: BACKGROUNDS.mild_light, isLargeText: false, location: 'Condition description' },
  { name: 'Warm bg - Secondary text', fg: TEXT_COLORS.secondary_light, bg: BACKGROUNDS.warm_light, isLargeText: false, location: 'Condition description' },

  // Tertiary text (gray-500, normal text = 4.5:1 required)
  { name: 'Cool bg - Tertiary text', fg: TEXT_COLORS.tertiary_light, bg: BACKGROUNDS.cool_light, isLargeText: false, location: 'Wind speed' },
  { name: 'Mild bg - Tertiary text', fg: TEXT_COLORS.tertiary_light, bg: BACKGROUNDS.mild_light, isLargeText: false, location: 'Wind speed' },
  { name: 'Warm bg - Tertiary text', fg: TEXT_COLORS.tertiary_light, bg: BACKGROUNDS.warm_light, isLargeText: false, location: 'Wind speed' },

  // Muted text (gray-500, normal text = 4.5:1 required)
  { name: 'Cool bg - Muted text', fg: TEXT_COLORS.muted_light, bg: BACKGROUNDS.cool_light, isLargeText: false, location: 'Timestamp' },
  { name: 'Mild bg - Muted text', fg: TEXT_COLORS.muted_light, bg: BACKGROUNDS.mild_light, isLargeText: false, location: 'Timestamp' },
  { name: 'Warm bg - Muted text', fg: TEXT_COLORS.muted_light, bg: BACKGROUNDS.warm_light, isLargeText: false, location: 'Timestamp' },

  // Drawer (white background)
  { name: 'Drawer - Primary', fg: TEXT_COLORS.primary_light, bg: BACKGROUNDS.drawer, isLargeText: true, location: 'Drawer one-liner' },
  { name: 'Drawer - Secondary', fg: TEXT_COLORS.secondary_light, bg: BACKGROUNDS.drawer, isLargeText: false, location: 'Drawer hint' },

  // Modal (white background)
  { name: 'Modal - Primary', fg: TEXT_COLORS.gray_800, bg: BACKGROUNDS.modal, isLargeText: true, location: 'Settings title' },
  { name: 'Modal - Secondary', fg: TEXT_COLORS.gray_700, bg: BACKGROUNDS.modal, isLargeText: false, location: 'Settings labels' },

  // Buttons
  { name: 'Button - Blue with white', fg: TEXT_COLORS.white, bg: BACKGROUNDS.button_blue, isLargeText: false, location: 'Primary buttons' },
  { name: 'Button - Gray with gray-700', fg: TEXT_COLORS.gray_700, bg: BACKGROUNDS.button_gray, isLargeText: false, location: 'Unselected toggle' },

  // ============================================
  // DARK MODE - Dark backgrounds + Light text
  // ============================================

  // Primary headings (white, large text = 3:1 required)
  { name: 'Freezing dark - Primary heading', fg: TEXT_COLORS.primary_dark, bg: BACKGROUNDS.freezing_dark, isLargeText: true, location: 'Temperature (night)' },
  { name: 'Cold dark - Primary heading', fg: TEXT_COLORS.primary_dark, bg: BACKGROUNDS.cold_dark, isLargeText: true, location: 'Temperature (night)' },
  { name: 'Cool dark - Primary heading', fg: TEXT_COLORS.primary_dark, bg: BACKGROUNDS.cool_dark, isLargeText: true, location: 'Temperature (night)' },

  // Secondary text (gray-100, normal text = 4.5:1 required)
  { name: 'Freezing dark - Secondary text', fg: TEXT_COLORS.secondary_dark, bg: BACKGROUNDS.freezing_dark, isLargeText: false, location: 'Condition (night)' },
  { name: 'Cold dark - Secondary text', fg: TEXT_COLORS.secondary_dark, bg: BACKGROUNDS.cold_dark, isLargeText: false, location: 'Condition (night)' },
  { name: 'Cool dark - Secondary text', fg: TEXT_COLORS.secondary_dark, bg: BACKGROUNDS.cool_dark, isLargeText: false, location: 'Condition (night)' },

  // Tertiary text (gray-300, normal text = 4.5:1 required)
  { name: 'Freezing dark - Tertiary text', fg: TEXT_COLORS.tertiary_dark, bg: BACKGROUNDS.freezing_dark, isLargeText: false, location: 'Wind speed (night)' },
  { name: 'Cold dark - Tertiary text', fg: TEXT_COLORS.tertiary_dark, bg: BACKGROUNDS.cold_dark, isLargeText: false, location: 'Wind speed (night)' },
  { name: 'Cool dark - Tertiary text', fg: TEXT_COLORS.tertiary_dark, bg: BACKGROUNDS.cool_dark, isLargeText: false, location: 'Wind speed (night)' },

  // Muted text (gray-400, normal text = 4.5:1 required)
  { name: 'Freezing dark - Muted text', fg: TEXT_COLORS.muted_dark, bg: BACKGROUNDS.freezing_dark, isLargeText: false, location: 'Timestamp (night)' },
  { name: 'Cold dark - Muted text', fg: TEXT_COLORS.muted_dark, bg: BACKGROUNDS.cold_dark, isLargeText: false, location: 'Timestamp (night)' },
  { name: 'Cool dark - Muted text', fg: TEXT_COLORS.muted_dark, bg: BACKGROUNDS.cool_dark, isLargeText: false, location: 'Timestamp (night)' },
]

function runAudit(): { total: number; passing: number; failing: number; failures: any[] } {
  console.log('='.repeat(80))
  console.log('WCAG AA Color Contrast Audit - ACTUAL Usage')
  console.log('='.repeat(80))
  console.log()
  console.log('Testing only the ACTUAL color combinations used in the app')
  console.log('(based on useAdaptiveTextColors hook behavior)')
  console.log()

  const failures: any[] = []
  let passing = 0

  for (const test of actualCombinations) {
    const ratio = getContrastRatio(test.fg, test.bg)
    const required = test.isLargeText ? 3.0 : 4.5
    const passes = ratio >= required

    if (passes) {
      passing++
    } else {
      failures.push({
        name: test.name,
        fg: test.fg,
        bg: test.bg,
        ratio,
        required,
        location: test.location,
      })
    }
  }

  return {
    total: actualCombinations.length,
    passing,
    failing: failures.length,
    failures,
  }
}

const results = runAudit()

console.log(`Total Checks: ${results.total}`)
console.log(`Passing: ${results.passing}`)
console.log(`Failing: ${results.failing}`)
console.log()

if (results.failing > 0) {
  console.log('❌ FAILING CHECKS:')
  console.log('━'.repeat(80))
  results.failures.forEach((f) => {
    console.log(`❌ ${f.name}`)
    console.log(`   Location: ${f.location}`)
    console.log(`   Foreground: ${f.fg}`)
    console.log(`   Background: ${f.bg}`)
    console.log(`   Contrast: ${f.ratio.toFixed(2)}:1 (Required: ${f.required}:1)`)
    console.log()
  })
} else {
  console.log('✅ ALL TESTS PASSED!')
  console.log()
  console.log('All actual color combinations meet WCAG AA requirements.')
  console.log()
  console.log('Light mode: Dark text on light backgrounds ✓')
  console.log('Dark mode: Light text on dark backgrounds ✓')
  console.log('Components: Fixed backgrounds with appropriate text colors ✓')
}

if (results.failing > 0) {
  process.exit(1)
}
