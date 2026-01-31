# Semantic HTML Audit for OutFitWeather

## Feature #65: Semantic HTML structure

### Audit Date: 2025-01-31

---

## Summary

This audit identifies all non-semantic HTML elements in the OutFitWeather app and provides recommendations for implementing proper semantic HTML structure for screen reader navigation.

---

## Current State Analysis

### ✅ Already Good

1. **Layout.tsx**:
   - ✅ Uses `<header>` for app header
   - ✅ Uses `<main>` for main content area
   - ✅ Uses `<aside>` for drawer (correct landmark)
   - ✅ ARIA labels on interactive elements

2. **Drawer.tsx**:
   - ✅ Uses `<aside>` with proper ARIA labels
   - ✅ Uses `role="button"` attributes
   - ✅ `aria-expanded`, `aria-label` for accessibility

3. **SettingsModal.tsx**:
   - ✅ Uses `role="dialog"` with `aria-modal="true"`
   - ✅ Proper `aria-labelledby` for modal title

### ❌ Issues Found

#### 1. App.tsx - Multiple Wrapper divs
**Location**: Lines 124, 146, 168, 190
**Issue**: Using generic `<div>` wrappers without semantic meaning

```tsx
// Current (NON-SEMANTIC):
<div style={backgroundStyle}>
  <Layout>
    ...
  </Layout>
</div>
```

**Recommendation**: The outer wrapper could be a landmark region or section:
- Use `<div>` with `role="application"` if this is a web app
- Or keep as `<div>` if it's just a style wrapper (acceptable)

**Verdict**: ✅ ACCEPTABLE - The wrapper is for styling purposes only, Layout component provides semantic structure

---

#### 2. App.tsx - LocationPermissionPrompt (Lines 20-40)
**Location**: All content wrapped in generic `<div>` elements
**Issue**: Missing semantic structure for the permission screen

```tsx
// Current (NON-SEMANTIC):
<div className="flex flex-col items-center justify-center py-16 space-y-6 px-4">
  <div className="text-6xl">📍</div>
  <div className="text-center max-w-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-3">
      Enable Location Access
    </h2>
    ...
  </div>
</div>
```

**Recommendation**: Should use `<section>` landmark:
```tsx
<section aria-labelledby="permission-title">
  <h2 id="permission-title">Enable Location Access</h2>
  ...
</section>
```

**Priority**: 🔴 HIGH - Permission screens should be navigable landmarks

---

#### 3. App.tsx - LocationPermissionDenied (Lines 50-76)
**Location**: Same issue as permission prompt
**Issue**: Missing semantic structure

**Recommendation**: Use `<section aria-labelledby="error-title">`

**Priority**: 🔴 HIGH - Error screens should be navigable landmarks

---

#### 4. App.tsx - LocationLoading (Lines 84-88)
**Location**: Loading state wrapped in generic `<div>`
**Issue**: Could use `<section>` for consistency

```tsx
// Current (NON-SEMANTIC):
<div className="flex flex-col items-center justify-center py-16 space-y-4">
  <div className="text-6xl animate-pulse">📍</div>
  <p className="text-gray-600 text-lg">Finding your location...</p>
</div>
```

**Recommendation**: Use `<section aria-label="Loading location">` or `<section aria-busy="true">`

**Priority**: 🟡 MEDIUM - Loading states benefit from semantic markup

---

#### 5. App.tsx - Development Tests Section (Lines 127-137, 149-158, 171-181, 200-209)
**Location**: All test sections wrapped in generic `<div>` elements
**Issue**: Should use `<section>` for proper landmark navigation

```tsx
// Current (NON-SEMANTIC):
<div className="border-t border-gray-200 pt-8">
  <h2 className="text-lg font-semibold text-gray-700 mb-4">Development Tests</h2>
  <div className="space-y-8">
    ...
  </div>
</div>
```

**Recommendation**: Use `<section aria-labelledby="dev-tests-title">`

**Priority**: 🟡 MEDIUM - Low priority (dev-only content), but good practice

---

#### 6. WeatherDisplay.tsx - Loading State (Lines 40-44)
**Location**: Loading state wrapped in generic `<div>`
**Issue**: Missing semantic landmark

```tsx
// Current (NON-SEMANTIC):
<div className="flex flex-col items-center justify-center py-16 space-y-4">
  <div className="text-6xl animate-pulse">🌤️</div>
  <p className="text-gray-600 text-lg">Fetching weather data...</p>
</div>
```

**Recommendation**: Use `<section aria-live="polite" aria-busy="true" aria-label="Loading weather">`

**Priority**: 🔴 HIGH - Loading states should announce to screen readers

---

#### 7. WeatherDisplay.tsx - Error State (Lines 50-63)
**Location**: Error state wrapped in generic `<div>`
**Issue**: Should use `<section>` with `role="alert"`

```tsx
// Current (NON-SEMANTIC):
<div className="flex flex-col items-center justify-center py-16 space-y-4 px-4">
  <div className="text-6xl">⚠️</div>
  <div className="text-center max-w-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-2">Couldn't fetch weather</h2>
    ...
  </div>
</div>
```

**Recommendation**: Use `<section role="alert" aria-labelledby="error-title">`

**Priority**: 🔴 HIGH - Error states must be announced to screen readers

---

#### 8. WeatherDisplay.tsx - Main Content (Lines 72-130)
**Location**: Weather info wrapped in generic `<div>`
**Issue**: Should use `<section>` landmarks for each info group

```tsx
// Current (NON-SEMANTIC):
<div className="flex flex-col items-center space-y-6 py-8">
  <div className="text-center">
    <p className="text-sm text-gray-600 font-medium">{locationName}</p>
  </div>
  <div className="text-8xl" role="img" aria-label={weather.condition}>
    {weather.icon}
  </div>
  <div className="text-center">
    <p className="text-7xl font-bold text-gray-900 tracking-tight">
      {Math.round(weather.temperature)}°
    </p>
  </div>
  ...
</div>
```

**Recommendation**: Use `<section>` for each weather info group:
- Location section
- Current conditions section
- Temperature section
- Additional info section

**Priority**: 🟡 MEDIUM - Improves screen reader navigation

---

#### 9. Drawer.tsx - Inner Content Divs (Lines 107, 131, 146, 185)
**Location**: Drawer content wrapped in generic `<div>` elements
**Issue**: Should use `<section>` for content regions

```tsx
// Current (NON-SEMANTIC):
<div className="bg-white/80 backdrop-blur-md rounded-t-3xl ...">
  <div className="flex flex-col items-center pt-2 pb-4 px-4">
    ...
  </div>
  <div className="p-6">
    ...
  </div>
</div>
```

**Recommendation**: Use `<section>` for each content area:
- Handle/collapsed section
- Expanded outfit section

**Priority**: 🟡 MEDIUM - Improves screen reader navigation within drawer

---

#### 10. SettingsModal.tsx - Inner Divs (Lines 22, 26, 38)
**Location**: Modal content wrapped in generic `<div>` elements
**Issue**: Could use `<section>` or `<header>`/`<footer>` for structure

```tsx
// Current (NON-SEMANTIC):
<div className="relative w-full max-w-sm bg-white rounded-2xl ...">
  <div className="px-6 py-4 border-b border-gray-100">
    <h2 id="settings-title">Settings</h2>
  </div>
  <div className="p-6 space-y-6">
    ...
  </div>
  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
    ...
  </div>
</div>
```

**Recommendation**: Use `<header>`, `<section>`, and `<footer>` for structure

**Priority**: 🟡 MEDIUM - Better semantic structure for modal content

---

## Priority Summary

### 🔴 HIGH Priority (Must Fix)
1. ✅ App.tsx - LocationPermissionPrompt → Use `<section>`
2. ✅ App.tsx - LocationPermissionDenied → Use `<section role="alert">`
3. ✅ WeatherDisplay.tsx - Loading state → Use `<section aria-live="polite" aria-busy="true">`
4. ✅ WeatherDisplay.tsx - Error state → Use `<section role="alert">`

### 🟡 MEDIUM Priority (Should Fix)
5. ✅ WeatherDisplay.tsx - Main content → Use `<section>` for each info group
6. ✅ Drawer.tsx - Content areas → Use `<section>` for structure
7. ✅ SettingsModal.tsx - Modal structure → Use `<header>`, `<section>`, `<footer>`

### 🟢 LOW Priority (Nice to Have)
8. ✅ App.tsx - LocationLoading → Use `<section aria-label="Loading location">`
9. ✅ App.tsx - Development tests → Use `<section>` for dev content

---

## Expected Benefits

After implementing semantic HTML:

1. **Screen Reader Navigation**: Users can jump between landmarks (header, main, section, aside)
2. **SEO Benefits**: Search engines better understand content structure
3. **Accessibility**: Better ARIA support and screen reader announcements
4. **Code Quality**: More maintainable and self-documenting code

---

## Testing Checklist

After implementation, verify:

- [ ] Screen reader can navigate by landmarks (L key in NVDA, R key in JAWS)
- [ ] Loading states announce "Loading" to screen readers
- [ ] Error states announce as alerts (should interrupt and read immediately)
- [ ] All landmark regions have proper labels (aria-labelledby or aria-label)
- [ ] Heading hierarchy is correct (single h1, h2-h6 in order)
- [ ] No nested landmarks of the same type without labels
