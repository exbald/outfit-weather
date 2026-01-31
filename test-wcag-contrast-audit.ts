/**
 * WCAG AA Color Contrast Audit for OutFitWeather
 *
 * This script audits all text colors against their backgrounds to ensure
 * WCAG AA compliance:
 * - Normal text (< 18px / 14pt bold): Must have contrast ratio of 4.5:1 or higher
 * - Large text (≥ 18px / 14pt bold): Must have contrast ratio of 3:1 or higher
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
 * Check if contrast ratio meets WCAG AA requirements
 */
function checkWcagAA(
  ratio: number,
  isLargeText: boolean
): { pass: boolean; level: 'AA' | 'AAA'; required: number } {
  const required = isLargeText ? 3.0 : 4.5
  const pass = ratio >= required

  // Check AAA as well (7:1 for normal, 4.5:1 for large)
  const aaaRequired = isLargeText ? 4.5 : 7.0
  const level = ratio >= aaaRequired ? 'AAA' : 'AA'

  return { pass, level, required }
}

/**
 * Tailwind color palette (approximate hex values)
 */
const TAILWIND_COLORS: Record<string, string> = {
  'gray-50': '#f9fafb',
  'gray-100': '#f3f4f6',
  'gray-200': '#e5e7eb',
  'gray-400': '#9ca3af',
  'gray-500': '#6b7280',
  'gray-600': '#4b5563',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'gray-900': '#111827',
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'blue-700': '#1d4ed8',
  'orange-600': '#ea580c',
  'white': '#ffffff',
}

/**
 * All background colors used in OutFitWeather
 */
const BACKGROUND_COLORS: Record<string, string> = {
  'freezing-light': '#e0e7ef',
  'cold-light': '#dbeafe',
  'cool-light': '#f1f5f9',
  'mild-light': '#ecfdf5',
  'warm-light': '#fef3c7',
  'hot-light': '#ffedd5',
  'rain-light': '#e2e8f0',
  'freezing-dark': '#1e293b',
  'cold-dark': '#1e3a5f',
  'cool-dark': '#334155',
  'mild-dark': '#1c3d32',
  'warm-dark': '#423d18',
  'hot-dark': '#4a2c0a',
  'rain-dark': '#374151',
  'white': '#ffffff',
  'blue-500': '#3b82f6',
  'gray-100': '#f3f4f6',
}

interface ContrastCheck {
  element: string
  description: string
  fgColor: string
  bgColor: string
  ratio: number
  isLargeText: boolean
  result: { pass: boolean; level: string; required: number }
}

const auditResults: ContrastCheck[] = []

function auditContrast(
  element: string,
  description: string,
  fgTailwind: string,
  bgKey: string,
  isLargeText: boolean
) {
  const fg = TAILWIND_COLORS[fgTailwind] || fgTailwind
  const bg = BACKGROUND_COLORS[bgKey]

  if (!fg || !bg) {
    console.error(`Missing color definition: fg=${fgTailwind}, bg=${bgKey}`)
    return
  }

  const ratio = getContrastRatio(fg, bg)
  const result = checkWcagAA(ratio, isLargeText)

  auditResults.push({
    element,
    description,
    fgColor: fg,
    bgColor: bg,
    ratio,
    isLargeText,
    result,
  })
}

function runAudit() {
  console.log('='.repeat(80))
  console.log('WCAG AA Color Contrast Audit for OutFitWeather')
  console.log('='.repeat(80))
  console.log()

  // Test all major text elements against all background colors
  const textColors = [
    { name: 'gray-900', large: true },
    { name: 'gray-800', large: true },
    { name: 'gray-700', large: true },
    { name: 'gray-600', large: false },
    { name: 'gray-500', large: false },
    { name: 'gray-400', large: false },
    { name: 'white', large: false },
  ]

  const backgrounds = Object.keys(BACKGROUND_COLORS)

  textColors.forEach(({ name: fgName, large }) => {
    backgrounds.forEach((bgKey) => {
      auditContrast('Comprehensive', `${fgName} on ${bgKey}`, fgName, bgKey, large)
    })
  })

  // Print summary
  const totalChecks = auditResults.length
  const passingChecks = auditResults.filter((r) => r.result.pass).length
  const failingChecks = totalChecks - passingChecks

  console.log(`Total Checks: ${totalChecks}`)
  console.log(`Passing: ${passingChecks}`)
  console.log(`Failing: ${failingChecks}`)
  console.log()

  const failures = auditResults.filter((r) => !r.result.pass)
  if (failures.length > 0) {
    console.log('FAILING CHECKS:')
    failures.forEach((f) => {
      console.log(`❌ ${f.description}`)
      console.log(`   Contrast: ${f.ratio.toFixed(2)}:1 (Required: ${f.result.required}:1)`)
    })
  }

  return { total: totalChecks, passing: passingChecks, failing: failingChecks, failures }
}

const results = runAudit()

if (results.failing > 0) {
  process.exit(1)
}
