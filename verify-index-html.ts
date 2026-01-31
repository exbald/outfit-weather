/**
 * Feature #65: index.html Semantic Structure Verification
 */

import { readFileSync } from 'fs'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function main() {
  log('\n=== Feature #65: index.html Semantic Structure ===\n', 'cyan')

  const html = readFileSync('./index.html', 'utf-8')

  const checks = [
    {
      name: 'Has <!doctype html>',
      pattern: /<!doctype html>/i,
      passed: false,
    },
    {
      name: 'Has lang attribute on <html>',
      pattern: /html\s+lang=/i,
      passed: false,
    },
    {
      name: 'Has <meta charset="UTF-8">',
      pattern: /meta\s+charset=/i,
      passed: false,
    },
    {
      name: 'Has <meta name="description">',
      pattern: /meta\s+name=["']description["']/i,
      passed: false,
    },
    {
      name: 'Has <meta name="viewport">',
      pattern: /meta\s+name=["']viewport["']/i,
      passed: false,
    },
    {
      name: 'Has <meta name="theme-color">',
      pattern: /meta\s+name=["']theme-color["']/i,
      passed: false,
    },
    {
      name: 'Has PWA manifest link',
      pattern: /link\s+rel=["']manifest["']/i,
      passed: false,
    },
    {
      name: 'Has apple-touch-icon',
      pattern: /link\s+rel=["']apple-touch-icon["']/i,
      passed: false,
    },
    {
      name: 'Has <title> element',
      pattern: /title>/i,
      passed: false,
    },
  ]

  // Run checks
  for (const check of checks) {
    check.passed = check.pattern.test(html)
  }

  // Print results
  log('Verification Results:', 'blue')
  log('─'.repeat(60), 'blue')

  let allPassed = true
  for (const check of checks) {
    const icon = check.passed ? '✅' : '❌'
    const color = check.passed ? 'green' : 'red'
    log(`  ${icon} ${check.name}`, color)
    if (!check.passed) allPassed = false
  }

  // Additional checks
  log('\n─'.repeat(60), 'blue')
  log('Additional Information:', 'blue')
  log('─'.repeat(60), 'blue')

  const langMatch = html.match(/lang="(\w{2})"/)
  if (langMatch) {
    log(`  ✅ Language: ${langMatch[1]}`, 'green')
  }

  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  if (titleMatch) {
    log(`  ✅ Title: ${titleMatch[1]}`, 'green')
  }

  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)
  if (descMatch) {
    log(`  ✅ Description: "${descMatch[1]}"`, 'green')
  }

  const faviconMatch = html.match(/<link\s+rel="[^"]*icon[^"]*"/i)
  if (faviconMatch) {
    log(`  ✅ Favicon link present`, 'green')
  }

  log('\n' + '='.repeat(60), 'cyan')

  if (allPassed) {
    log('🎉 SUCCESS! index.html has proper semantic structure!', 'green')
    process.exit(0)
  } else {
    log('⚠️  Some semantic elements are missing from index.html', 'red')
    process.exit(1)
  }
}

main()
