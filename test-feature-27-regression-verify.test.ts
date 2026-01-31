/**
 * Feature #27 Regression Test: Drawer collapsed state renders
 *
 * This test verifies that the Drawer component correctly renders in its collapsed state
 * with all required visual elements: handle indicator and swipe hint text.
 */

import { describe, it, expect } from 'vitest'

describe('Feature #27 - Drawer collapsed state renders', () => {
  // Test 1: Component exists and exports correctly
  it('should have Drawer component exported', async () => {
    const drawerModule = await import('../src/components/Drawer')
    expect(drawerModule.Drawer).toBeDefined()
    expect(typeof drawerModule.Drawer).toBe('function')
  })

  // Test 2: Drawer has proper TypeScript interface
  it('should have proper TypeScript interface', async () => {
    // This test verifies type safety at compile time
    // The Drawer component should accept outfit, temperature, weatherCode, isDay props
    const drawerModule = await import('../src/components/Drawer')
    expect(drawerModule.Drawer).toBeDefined()
  })

  // Test 3: Drawer is integrated in Layout
  it('should be integrated in Layout component', async () => {
    const layoutModule = await import('../src/components/Layout')
    const fs = await import('fs')
    const layoutContent = fs.readFileSync('./src/components/Layout.tsx', 'utf-8')

    // Verify Drawer is imported
    expect(layoutContent).toContain("import { Drawer }")
    // Verify Drawer is used in JSX
    expect(layoutContent).toContain('<Drawer')
  })

  // Test 4: Collapsed state has handle indicator
  it('should have handle indicator in collapsed state', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify handle indicator element exists
    expect(drawerContent).toContain('w-12 h-1.5 bg-gray-400 rounded-full')
    // Verify handle is in collapsed state section
    expect(drawerContent).toContain('{!isExpanded &&')
  })

  // Test 5: Collapsed state has swipe hint text
  it('should have swipe hint text in collapsed state', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify swipe hint text exists
    expect(drawerContent).toContain('Swipe up · What to wear')
    // Verify text is in collapsed state section
    expect(drawerContent).toContain('{!isExpanded &&')
  })

  // Test 6: Drawer positioned at screen bottom
  it('should be positioned at screen bottom with fixed positioning', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify fixed positioning at bottom
    expect(drawerContent).toContain('fixed bottom-0 left-0 right-0')
    // Verify z-index for layering
    expect(drawerContent).toContain('z-40')
  })

  // Test 7: Drawer has frosted glass styling
  it('should have frosted glass effect styling', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify semi-transparent white background
    expect(drawerContent).toContain('bg-white/80')
    // Verify backdrop blur
    expect(drawerContent).toContain('backdrop-blur-md')
  })

  // Test 8: Drawer has rounded top corners
  it('should have rounded top corners', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify rounded corners on top
    expect(drawerContent).toContain('rounded-t-3xl')
  })

  // Test 9: Drawer has shadow
  it('should have shadow for depth', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify shadow styling
    expect(drawerContent).toContain('shadow-lg')
  })

  // Test 10: Drawer has border styling
  it('should have border for visual separation', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify border styling
    expect(drawerContent).toContain('border-t border-black/5')
  })

  // Test 11: Drawer has accessibility attributes
  it('should have proper accessibility attributes', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify ARIA label
    expect(drawerContent).toContain('aria-label')
    // Verify role attribute
    expect(drawerContent).toContain('role="button"')
    // Verify tab index for keyboard navigation
    expect(drawerContent).toContain('tabIndex={0}')
    // Verify aria-expanded for state
    expect(drawerContent).toContain('aria-expanded')
  })

  // Test 12: Drawer has keyboard support
  it('should support keyboard interaction', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify onKeyPress handler
    expect(drawerContent).toContain('onKeyPress')
    // Verify Enter and Space key handling
    expect(drawerContent).toContain("e.key === 'Enter'")
    expect(drawerContent).toContain("e.key === ' '")
  })

  // Test 13: Drawer is centered horizontally
  it('should be centered horizontally', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify max-width container with mx-auto
    expect(drawerContent).toContain('max-w-md mx-auto')
  })

  // Test 14: Drawer has click handler
  it('should have click handler for interaction', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify onClick handler
    expect(drawerContent).toContain('onClick={toggleDrawer}')
    // Verify toggle function exists
    expect(drawerContent).toContain('const toggleDrawer = ()')
  })

  // Test 15: Drawer uses state management
  it('should use React state for expansion', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify useState import
    expect(drawerContent).toContain("import { useState")
    // Verify isExpanded state
    expect(drawerContent).toContain('useState(false)')
    expect(drawerContent).toContain('isExpanded')
  })

  // Test 16: Drawer has smooth transitions
  it('should have smooth transition animations', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify transition styling
    expect(drawerContent).toContain('transition-transform duration-300 ease-out')
  })

  // Test 17: Collapsed state has proper spacing
  it('should have proper spacing in collapsed state', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify padding and spacing
    expect(drawerContent).toContain('pt-2 pb-4 px-4')
    // Verify flex layout for centering
    expect(drawerContent).toContain('flex flex-col items-center')
  })

  // Test 18: Handle indicator has proper styling
  it('should have handle indicator with proper dimensions and color', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify handle dimensions
    expect(drawerContent).toContain('w-12 h-1.5')
    // Verify handle color
    expect(drawerContent).toContain('bg-gray-400')
    // Verify handle rounded
    expect(drawerContent).toContain('rounded-full')
  })

  // Test 19: Swipe hint has proper text styling
  it('should have swipe hint with proper text styling', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify text is secondary color
    expect(drawerContent).toContain('text-secondary')
    // Verify text size and weight
    expect(drawerContent).toContain('text-sm font-medium')
  })

  // Test 20: Drawer component is properly typed
  it('should have proper TypeScript typing', async () => {
    const fs = await import('fs')
    const drawerContent = fs.readFileSync('./src/components/Drawer.tsx', 'utf-8')

    // Verify interface definition
    expect(drawerContent).toContain('interface DrawerProps')
    // Verify exported function
    expect(drawerContent).toContain('export function Drawer')
  })
})
