#!/usr/bin/env tsx
/**
 * Feature #65: Semantic HTML Structure Verification
 *
 * This script verifies that semantic HTML elements are used throughout
 * the codebase for proper screen reader navigation.
 */

import { readFileSync } from 'fs'
import { join } from 'path'

interface VerificationResult {
  file: string
  checks: {
    name: string
    passed: boolean
    details: string
  }[]
  summary: {
    total: number
    passed: number
    failed: number
  }
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function verifyFile(filePath: string, content: string): VerificationResult {
  const checks: VerificationResult['checks'] = []

  // Check for semantic elements
  const hasHeader = /<header/g.test(content)
  const hasMain = /<main/g.test(content)
  const hasAside = /<aside/g.test(content)
  const hasSection = /<section/g.test(content)

  checks.push({
    name: 'Uses <header> element',
    passed: hasHeader,
    details: hasHeader ? 'Found <header> element' : 'Missing <header> element',
  })

  checks.push({
    name: 'Uses <main> element',
    passed: hasMain,
    details: hasMain ? 'Found <main> element' : 'Missing <main> element',
  })

  checks.push({
    name: 'Uses <aside> element',
    passed: hasAside,
    details: hasAside ? 'Found <aside> element' : 'Missing <aside> element',
  })

  checks.push({
    name: 'Uses <section> landmarks',
    passed: hasSection,
    details: hasSection ? 'Found <section> elements' : 'Missing <section> elements',
  })

  // Check for ARIA attributes
  const hasAriaLabel = /aria-label=/g.test(content)
  const hasAriaLabelledby = /aria-labelledby=/g.test(content)
  const hasAriaLive = /aria-live=/g.test(content)
  const hasAriaBusy = /aria-busy=/g.test(content)
  const hasRoleAlert = /role="alert"/g.test(content)
  const hasRoleDialog = /role="dialog"/g.test(content)

  checks.push({
    name: 'Uses aria-label attributes',
    passed: hasAriaLabel,
    details: hasAriaLabel ? 'Found aria-label attributes' : 'Missing aria-label attributes',
  })

  checks.push({
    name: 'Uses aria-labelledby for landmark labels',
    passed: hasAriaLabelledby,
    details: hasAriaLabelledby ? 'Found aria-labelledby attributes' : 'Missing aria-labelledby attributes',
  })

  checks.push({
    name: 'Uses aria-live for dynamic content',
    passed: hasAriaLive,
    details: hasAriaLive ? 'Found aria-live attributes' : 'Missing aria-live attributes',
  })

  checks.push({
    name: 'Uses aria-busy for loading states',
    passed: hasAriaBusy,
    details: hasAriaBusy ? 'Found aria-busy attributes' : 'Missing aria-busy attributes',
  })

  checks.push({
    name: 'Uses role="alert" for errors',
    passed: hasRoleAlert,
    details: hasRoleAlert ? 'Found role="alert" attributes' : 'Missing role="alert" attributes',
  })

  checks.push({
    name: 'Uses role="dialog" for modals',
    passed: hasRoleDialog,
    details: hasRoleDialog ? 'Found role="dialog" attributes' : 'Missing role="dialog" attributes',
  })

  // Check for emoji accessibility
  const hasEmojiRoleImg = /role="img"/g.test(content)
  const hasEmojiAriaLabel = content.match(/role="img"/g)?.length === content.match(/aria-label=/g)?.length

  checks.push({
    name: 'Emoji have role="img"',
    passed: hasEmojiRoleImg,
    details: hasEmojiRoleImg ? 'Found role="img" for emoji' : 'Missing role="img" for emoji',
  })

  checks.push({
    name: 'Emoji have aria-label',
    passed: hasEmojiAriaLabel || !hasEmojiRoleImg,
    details: hasEmojiAriaLabel ? 'All emoji have aria-label' : 'Some emoji missing aria-label',
  })

  const passed = checks.filter(c => c.passed).length
  const failed = checks.length - passed

  return {
    file: filePath,
    checks,
    summary: {
      total: checks.length,
      passed,
      failed,
    },
  }
}

function main() {
  log('\n=== Feature #65: Semantic HTML Structure Verification ===\n', 'blue')

  const files = [
    'src/App.tsx',
    'src/components/Layout.tsx',
    'src/components/WeatherDisplay.tsx',
    'src/components/Drawer.tsx',
    'src/components/SettingsModal.tsx',
  ]

  const results: VerificationResult[] = []

  for (const file of files) {
    try {
      const filePath = join(process.cwd(), file)
      const content = readFileSync(filePath, 'utf-8')
      const result = verifyFile(file, content)
      results.push(result)
    } catch (error) {
      log(`Failed to read ${file}: ${error}`, 'red')
    }
  }

  // Print results
  let totalPassed = 0
  let totalFailed = 0

  for (const result of results) {
    log(`\n${result.file}:`, 'blue')
    log('─'.repeat(60), 'blue')

    for (const check of result.checks) {
      const icon = check.passed ? '✅' : '❌'
      const color = check.passed ? 'green' : 'red'
      log(`  ${icon} ${check.name}`, color)
      log(`     ${check.details}`, 'reset')
    }

    log(`\n  Summary: ${result.summary.passed}/${result.summary.total} checks passed`, 'blue')

    totalPassed += result.summary.passed
    totalFailed += result.summary.failed
  }

  // Final summary
  log('\n' + '='.repeat(60), 'blue')
  log(`OVERALL SUMMARY:`, 'blue')
  log(`  Total Checks: ${totalPassed + totalFailed}`, 'reset')
  log(`  Passed: ${totalPassed}`, 'green')
  log(`  Failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'green')
  log(`  Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`, 'blue')
  log('='.repeat(60) + '\n', 'blue')

  if (totalFailed === 0) {
    log('🎉 All semantic HTML checks passed!', 'green')
    process.exit(0)
  } else {
    log(`⚠️  ${totalFailed} check(s) failed. Please review the results above.`, 'yellow')
    process.exit(1)
  }
}

main()
