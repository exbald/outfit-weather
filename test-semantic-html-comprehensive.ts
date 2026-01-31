/**
 * Feature #65: Comprehensive Semantic HTML Verification
 *
 * This script verifies that the app has proper semantic HTML structure
 * when components are composed together (not isolated file checks).
 */

import { readFileSync } from 'fs'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

interface ComponentCheck {
  component: string
  hasSemanticElements: boolean
  elements: { type: string; element: string; count: number }[]
}

function countElements(content: string, pattern: RegExp): number {
  const matches = content.match(pattern)
  return matches ? matches.length : 0
}

function checkComponent(filePath: string, fileName: string): ComponentCheck {
  const content = readFileSync(filePath, 'utf-8')
  const elements: { type: string; element: string; count: number }[] = []

  // Semantic HTML5 elements
  const headerCount = countElements(content, /<header/g)
  if (headerCount > 0) elements.push({ type: 'semantic', element: '<header>', count: headerCount })

  const mainCount = countElements(content, /<main/g)
  if (mainCount > 0) elements.push({ type: 'semantic', element: '<main>', count: mainCount })

  const asideCount = countElements(content, /<aside/g)
  if (asideCount > 0) elements.push({ type: 'semantic', element: '<aside>', count: asideCount })

  const sectionCount = countElements(content, /<section/g)
  if (sectionCount > 0) elements.push({ type: 'semantic', element: '<section>', count: sectionCount })

  const footerCount = countElements(content, /<footer/g)
  if (footerCount > 0) elements.push({ type: 'semantic', element: '<footer>', count: footerCount })

  // ARIA attributes
  const ariaLabelCount = countElements(content, /aria-label=/g)
  if (ariaLabelCount > 0) elements.push({ type: 'aria', element: 'aria-label', count: ariaLabelCount })

  const ariaLabelledbyCount = countElements(content, /aria-labelledby=/g)
  if (ariaLabelledbyCount > 0) elements.push({ type: 'aria', element: 'aria-labelledby', count: ariaLabelledbyCount })

  const ariaLiveCount = countElements(content, /aria-live=/g)
  if (ariaLiveCount > 0) elements.push({ type: 'aria', element: 'aria-live', count: ariaLiveCount })

  const ariaBusyCount = countElements(content, /aria-busy=/g)
  if (ariaBusyCount > 0) elements.push({ type: 'aria', element: 'aria-busy', count: ariaBusyCount })

  const ariaModalCount = countElements(content, /aria-modal=/g)
  if (ariaModalCount > 0) elements.push({ type: 'aria', element: 'aria-modal', count: ariaModalCount })

  const ariaExpandedCount = countElements(content, /aria-expanded=/g)
  if (ariaExpandedCount > 0) elements.push({ type: 'aria', element: 'aria-expanded', count: ariaExpandedCount })

  const ariaPressedCount = countElements(content, /aria-pressed=/g)
  if (ariaPressedCount > 0) elements.push({ type: 'aria', element: 'aria-pressed', count: ariaPressedCount })

  // Role attributes
  const roleDialogCount = countElements(content, /role="dialog"/g)
  if (roleDialogCount > 0) elements.push({ type: 'role', element: 'role="dialog"', count: roleDialogCount })

  const roleAlertCount = countElements(content, /role="alert"/g)
  if (roleAlertCount > 0) elements.push({ type: 'role', element: 'role="alert"', count: roleAlertCount })

  const roleImgCount = countElements(content, /role="img"/g)
  if (roleImgCount > 0) elements.push({ type: 'role', element: 'role="img"', count: roleImgCount })

  const roleButtonCount = countElements(content, /role="button"/g)
  if (roleButtonCount > 0) elements.push({ type: 'role', element: 'role="button"', count: roleButtonCount })

  return {
    component: fileName,
    hasSemanticElements: elements.length > 0,
    elements,
  }
}

function main() {
  log('\n=== Feature #65: Semantic HTML Structure Verification ===\n', 'cyan')
  log('Checking for proper semantic HTML elements across all components...\n', 'blue')

  const components = [
    { path: './src/App.tsx', name: 'App.tsx' },
    { path: './src/components/Layout.tsx', name: 'Layout.tsx' },
    { path: './src/components/WeatherDisplay.tsx', name: 'WeatherDisplay.tsx' },
    { path: './src/components/Drawer.tsx', name: 'Drawer.tsx' },
    { path: './src/components/SettingsModal.tsx', name: 'SettingsModal.tsx' },
    { path: './src/components/InstallButton.tsx', name: 'InstallButton.tsx' },
  ]

  const results: ComponentCheck[] = []

  for (const comp of components) {
    try {
      const result = checkComponent(comp.path, comp.name)
      results.push(result)
    } catch (error) {
      log(`❌ Failed to read ${comp.name}: ${error}`, 'red')
    }
  }

  // Aggregate results
  const totalSemantic = {
    header: 0,
    main: 0,
    aside: 0,
    section: 0,
    footer: 0,
  }

  const totalAria = {
    'aria-label': 0,
    'aria-labelledby': 0,
    'aria-live': 0,
    'aria-busy': 0,
    'aria-modal': 0,
    'aria-expanded': 0,
    'aria-pressed': 0,
  }

  const totalRoles = {
    'role="dialog"': 0,
    'role="alert"': 0,
    'role="img"': 0,
    'role="button"': 0,
  }

  // Print results and aggregate totals
  for (const result of results) {
    log(`\n📄 ${result.component}`, 'blue')
    log('─'.repeat(60), 'blue')

    if (result.elements.length === 0) {
      log('  ⚠️  No semantic elements found', 'yellow')
    } else {
      for (const el of result.elements) {
        const icon = '✅'
        const color = 'green'

        log(`  ${icon} ${el.element} x${el.count}`, color)

        // Aggregate totals
        if (el.type === 'semantic') {
          const key = el.element.replace('<', '').replace('>', '') as keyof typeof totalSemantic
          if (key in totalSemantic) totalSemantic[key] += el.count
        } else if (el.type === 'aria') {
          const key = el.element as keyof typeof totalAria
          if (key in totalAria) totalAria[key] += el.count
        } else if (el.type === 'role') {
          const key = el.element as keyof typeof totalRoles
          if (key in totalRoles) totalRoles[key] += el.count
        }
      }
    }
  }

  // Print aggregate summary
  log('\n' + '='.repeat(60), 'cyan')
  log('📊 AGGREGATE SEMANTIC HTML SUMMARY', 'cyan')
  log('='.repeat(60), 'cyan')

  log('\n🏗️  Semantic HTML5 Elements:', 'blue')
  Object.entries(totalSemantic).forEach(([key, value]) => {
    if (value > 0) {
      log(`  ✅ <${key}>: ${value}`, 'green')
    } else {
      log(`  ⚠️  <${key}>: 0 (may be in another component)`, 'yellow')
    }
  })

  log('\n🎯 ARIA Attributes:', 'blue')
  Object.entries(totalAria).forEach(([key, value]) => {
    if (value > 0) {
      log(`  ✅ ${key}: ${value}`, 'green')
    }
  })

  log('\n🎭 Role Attributes:', 'blue')
  Object.entries(totalRoles).forEach(([key, value]) => {
    if (value > 0) {
      log(`  ✅ ${key}: ${value}`, 'green')
    }
  })

  // Check for required landmarks
  log('\n' + '='.repeat(60), 'cyan')
  log('✅ LANDMARK REGIONS CHECK', 'cyan')
  log('='.repeat(60), 'cyan')

  const hasHeader = totalSemantic.header > 0
  const hasMain = totalSemantic.main > 0
  const hasAside = totalSemantic.aside > 0
  const hasSection = totalSemantic.section > 0

  log(`\n  Header landmark: ${hasHeader ? '✅' : '❌'}`, hasHeader ? 'green' : 'red')
  log(`  Main landmark: ${hasMain ? '✅' : '❌'}`, hasMain ? 'green' : 'red')
  log(`  Aside landmark: ${hasAside ? '✅' : '❌'}`, hasAside ? 'green' : 'red')
  log(`  Section landmarks: ${hasSection ? '✅' : '❌'}`, hasSection ? 'green' : 'red')

  // Final verdict
  const allLandmarksPresent = hasHeader && hasMain && hasAside && hasSection
  const hasAriaLabels = totalAria['aria-label'] > 0 || totalAria['aria-labelledby'] > 0
  const hasDynamicContent = totalAria['aria-live'] > 0 || totalAria['aria-busy'] > 0
  const hasRoles = Object.values(totalRoles).some(v => v > 0)

  log('\n' + '='.repeat(60), 'cyan')
  log('🎯 FINAL VERDICT', 'cyan')
  log('='.repeat(60), 'cyan')

  const checks = [
    { name: 'Landmark regions (header, main, aside, section)', passed: allLandmarksPresent },
    { name: 'ARIA labels for accessibility', passed: hasAriaLabels },
    { name: 'Dynamic content announcements (aria-live/busy)', passed: hasDynamicContent },
    { name: 'Semantic roles for screen readers', passed: hasRoles },
  ]

  let allPassed = true
  for (const check of checks) {
    log(`\n  ${check.passed ? '✅' : '❌'} ${check.name}`, check.passed ? 'green' : 'red')
    if (!check.passed) allPassed = false
  }

  log('\n' + '='.repeat(60) + '\n', 'cyan')

  if (allPassed) {
    log('🎉 SUCCESS! All semantic HTML requirements are met!', 'green')
    log('\nThe app uses proper semantic HTML elements for screen reader navigation.', 'blue')
    process.exit(0)
  } else {
    log('⚠️  Some semantic HTML requirements are missing.', 'yellow')
    process.exit(1)
  }
}

main()
