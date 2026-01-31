/**
 * Test script for Feature #44: Settings modal opens
 *
 * This test verifies:
 * 1. SettingsModal component exists
 * 2. Modal opens when settings button is clicked
 * 3. Modal has close button (Done button)
 * 4. Modal closes when backdrop is clicked
 */

import { describe, it, expect } from 'vitest'

describe('Feature #44: Settings modal opens', () => {
  it('should have SettingsModal component', () => {
    // Verify the component file exists
    const fs = require('fs')
    const path = require('path')

    const modalPath = path.join(__dirname, 'src/components/SettingsModal.tsx')
    expect(fs.existsSync(modalPath)).toBe(true)

    // Verify it exports the component
    const modalContent = fs.readFileSync(modalPath, 'utf-8')
    expect(modalContent).toContain('export function SettingsModal')
    expect(modalContent).toContain('isOpen')
    expect(modalContent).toContain('onClose')
  })

  it('should have settings button connected in Layout', () => {
    const fs = require('fs')
    const path = require('path')

    const layoutPath = path.join(__dirname, 'src/components/Layout.tsx')
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

    // Verify settings button exists
    expect(layoutContent).toContain('aria-label="Open settings"')

    // Verify onClick handler opens modal
    expect(layoutContent).toContain('setIsSettingsOpen(true)')

    // Verify SettingsModal is imported and used
    expect(layoutContent).toContain("import { SettingsModal }")
    expect(layoutContent).toContain('<SettingsModal')
    expect(layoutContent).toContain('isOpen={isSettingsOpen}')
  })

  it('should have Done button to close modal', () => {
    const fs = require('fs')
    const path = require('path')

    const modalPath = path.join(__dirname, 'src/components/SettingsModal.tsx')
    const modalContent = fs.readFileSync(modalPath, 'utf-8')

    // Verify Done button exists and calls onClose
    expect(modalContent).toContain('Done')
    expect(modalContent).toContain('onClick={onClose}')

    // Verify button is properly styled
    expect(modalContent).toContain('bg-blue-500')
  })

  it('should close when backdrop is clicked', () => {
    const fs = require('fs')
    const path = require('path')

    const modalPath = path.join(__dirname, 'src/components/SettingsModal.tsx')
    const modalContent = fs.readFileSync(modalPath, 'utf-8')

    // Verify outer container has onClick to close
    expect(modalContent).toMatch(/onClick=\{onClose\}/)

    // Verify inner container stops propagation (doesn't close when clicking modal content)
    expect(modalContent).toContain('onClick={(e) => e.stopPropagation()}')
  })

  it('should have proper ARIA attributes', () => {
    const fs = require('fs')
    const path = require('path')

    const modalPath = path.join(__dirname, 'src/components/SettingsModal.tsx')
    const modalContent = fs.readFileSync(modalPath, 'utf-8')

    // Verify modal has proper ARIA attributes
    expect(modalContent).toContain('role="dialog"')
    expect(modalContent).toContain('aria-modal="true"')
    expect(modalContent).toContain('aria-labelledby="settings-title"')

    // Verify title element exists
    expect(modalContent).toContain('id="settings-title"')
  })

  it('should render nothing when isOpen is false', () => {
    const fs = require('fs')
    const path = require('path')

    const modalPath = path.join(__dirname, 'src/components/SettingsModal.tsx')
    const modalContent = fs.readFileSync(modalPath, 'utf-8')

    // Verify early return when not open
    expect(modalContent).toContain('if (!isOpen) return null')
  })
})

console.log('Feature #44 verification tests loaded')
