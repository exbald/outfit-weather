## YOUR ROLE - INITIALIZER AGENT (Session 1 of Many)

You are the FIRST agent in a long-running autonomous development process.
Your job is to set up the foundation for all future coding agents.

### FIRST: Read the Project Specification

Start by reading `app_spec.txt` in your working directory. This file contains
the complete specification for what you need to build. Read it carefully
before proceeding.

---

## REQUIRED FEATURE COUNT

**CRITICAL:** You must create exactly **78** features using the `feature_create_bulk` tool.

This number was determined during spec creation and must be followed precisely. Do not create more or fewer features than specified.

---

### CRITICAL FIRST TASK: Create Features

Based on `app_spec.txt`, create features using the feature_create_bulk tool. The features are stored in a SQLite database,
which is the single source of truth for what needs to be built.

**Creating Features:**

Use the feature_create_bulk tool to add all features at once. You can create features in batches if there are many (e.g., 50 at a time).

**Notes:**
- IDs and priorities are assigned automatically based on order
- All features start with `passes: false` by default

**Requirements for features:**

- Feature count must match the `feature_count` specified in app_spec.txt (78 features)
- Reference tiers for this project size: ~78 features (stateless app, no infrastructure)
- Both "functional" and "style" categories
- Mix of narrow tests (2-5 steps) and comprehensive tests (10+ steps)
- At least 20 tests MUST have 10+ steps each
- Order features by priority: fundamental features first (the API assigns priority based on order)
- Cover every feature in the spec exhaustively
- **MUST include tests from ALL relevant categories below**

---

## FEATURE DEPENDENCIES (MANDATORY)

Dependencies enable **parallel execution** of independent features. When specified correctly, multiple agents can work on unrelated features simultaneously, dramatically speeding up development.

**Why this matters:** Without dependencies, features execute in random order, causing logical issues (e.g., "Edit user" before "Create user") and preventing efficient parallelization.

### Dependency Rules

1. **Use `depends_on_indices`** (0-based array indices) to reference dependencies
2. **Can only depend on EARLIER features** (index must be less than current position)
3. **No circular dependencies** allowed
4. **Maximum 20 dependencies** per feature
5. **This is a STATELESS app** - no infrastructure features required
6. **Foundation features** (indices 0-4) have NO dependencies - they run FIRST
7. **60% of features after index 10** should have additional dependencies

### Dependency Types

| Type | Example |
|------|---------|
| Data | "Edit item" depends on "Create item" |
| Auth | "View dashboard" depends on "User can log in" |
| Navigation | "Modal close works" depends on "Modal opens" |
| UI | "Filter results" depends on "Display results list" |

### Wide Graph Pattern (REQUIRED)

Create WIDE dependency graphs, not linear chains:
- **BAD:** A -> B -> C -> D -> E (linear chain, only 1 feature runs at a time)
- **GOOD:** A -> B, A -> C, A -> D, B -> E, C -> E (wide graph, parallel execution)

### Complete Example for Stateless App

```json
[
  // FOUNDATION TIER (indices 0-4, no dependencies) - MUST run first
  { "name": "App loads without errors", "category": "functional" },
  { "name": "PWA manifest is valid", "category": "functional" },
  { "name": "Service worker registers", "category": "functional" },
  { "name": "Base layout renders", "category": "style" },
  { "name": "Tailwind CSS styles load", "category": "style" },

  // API & LOCATION TIER (indices 5-7, depend on foundation)
  { "name": "Open-Meteo API client configured", "category": "functional", "depends_on_indices": [0, 1, 2] },
  { "name": "Geolocation API integrated", "category": "functional", "depends_on_indices": [0, 3] },
  { "name": "Reverse geocoding works", "category": "functional", "depends_on_indices": [6] },

  // WEATHER DISPLAY TIER (indices 8-12) - WIDE GRAPH
  { "name": "Current temperature displays", "category": "style", "depends_on_indices": [0, 3, 5] },
  { "name": "Feels like temperature displays", "category": "style", "depends_on_indices": [0, 3, 5] },
  { "name": "Weather conditions display", "category": "style", "depends_on_indices": [0, 3, 5] },
  { "name": "Quick stats display (UV, wind, precip)", "category": "style", "depends_on_indices": [0, 3, 5] },
  { "name": "Sunrise/sunset times display", "category": "style", "depends_on_indices": [0, 3, 5] },

  // OUTFIT LOGIC TIER (indices 13-15) - WIDE GRAPH
  { "name": "Outfit engine generates recommendations", "category": "functional", "depends_on_indices": [5, 8] },
  { "name": "Temperature bucket mapping works", "category": "functional", "depends_on_indices": [5] },
  { "name": "Weather code modifiers apply", "category": "functional", "depends_on_indices": [5, 14] },

  // DRAWER TIER (indices 16-19)
  { "name": "Drawer swipe gesture works", "category": "functional", "depends_on_indices": [0, 3, 13] },
  { "name": "Drawer collapsed state displays", "category": "style", "depends_on_indices": [0, 3, 16] },
  { "name": "Drawer expanded state displays", "category": "style", "depends_on_indices": [0, 3, 16] },
  { "name": "Now/Today/Tomorrow navigation works", "category": "functional", "depends_on_indices": [16, 13] }
]
```

**Result:** With proper dependencies, independent features can be developed in parallel.

---

## FOUNDATION FEATURES (Indices 0-4)

**CRITICAL:** Create these FIRST, before any functional features. These features ensure the basic app structure is in place.

| Index | Name | Test Steps |
|-------|------|------------|
| 0 | App loads without errors | Open app → verify no console errors → page renders |
| 1 | PWA manifest is valid | Check manifest.json → verify required fields present |
| 2 | Service worker registers | Check navigator.serviceWorker → verify registration |
| 3 | Base layout renders | Verify main app container exists → styles applied |
| 4 | Tailwind CSS styles load | Check computed styles → verify Tailwind classes work |

**Most features after index 4 should depend on some or all of these foundation features.**

---

## MANDATORY TEST CATEGORIES

The feature list **MUST** include tests from ALL relevant categories below. Since this is a stateless PWA, some database-specific categories don't apply.

### Category Distribution for This Project

| Category                         | Count   |
| -------------------------------- | ------- |
| **Foundation**                   | 5       |
| A. Security & Access Control     | 3       |
| B. Navigation Integrity          | 10      |
| C. Real Data Verification        | 8       |
| D. Workflow Completeness         | 10      |
| E. Error Handling                | 8       |
| F. UI-Backend Integration        | 8       |
| G. State & Persistence           | 6       |
| H. URL & Direct Access           | 3       |
| I. Double-Action & Idempotency   | 3       |
| J. Data Cleanup & Cascade        | 2       |
| K. Default & Reset               | 4       |
| L. Search & Filter Edge Cases    | 2       |
| M. Form Validation               | 2       |
| N. Feedback & Notification       | 5       |
| O. Responsive & Layout           | 5       |
| P. Accessibility                 | 6       |
| Q. Temporal & Timezone           | 4       |
| R. Concurrency & Race Conditions | 3       |
| S. Export/Import                 | 0       |
| T. Performance                   | 3       |
| **TOTAL**                        | **78**  |

---

### Category Descriptions

**Foundation** - Project setup, PWA manifest, service worker, base layout, styling framework. These features MUST pass first.

**A. Security & Access Control** - Test location permission handling, API error handling, XSS prevention.

**B. Navigation Integrity** - Test all buttons, links, drawer gestures, back button behavior, and navigation states.

**C. Real Data Verification** - Test Open-Meteo API integration, real weather data display, caching verification, and data freshness.

**D. Workflow Completeness** - Test end-to-end weather-to-outfit flow, drawer interaction, Now/Today/Tomorrow switching, and settings changes.

**E. Error Handling** - Test network failures, location permission denied, GPS timeout, API errors, and missing data fallbacks.

**F. UI-Backend Integration** - Test API request/response format, weather data mapping, outfit logic integration, and error display.

**G. State & Persistence** - Test cache read/write, 30-min expiry, background refresh, pull-to-refresh, and offline behavior.

**H. URL & Direct Access** - Test PWA install flow, deep links, and URL parameters if applicable.

**I. Double-Action & Idempotency** - Test double-tap refresh, rapid drawer swipes, and concurrent requests.

**J. Data Cleanup & Cascade** - Test cache cleanup, expired data removal, and memory management.

**K. Default & Reset** - Test temperature unit defaults, locale auto-detection, and settings reset.

**L. Search & Filter Edge Cases** - Test edge cases in outfit logic (extreme temps, missing data, edge weather codes).

**M. Form Validation** - Test settings form validation (unit toggles).

**N. Feedback & Notification** - Test loading states, error messages, success feedback, and "last updated" timestamps.

**O. Responsive & Layout** - Test mobile, tablet, desktop layouts, touch targets, and drawer fit.

**P. Accessibility** - Test ARIA labels, screen reader support, keyboard navigation, color contrast, and focus management.

**Q. Temporal & Timezone** - Test timezone-aware display, accurate timestamps, sunrise/sunset calculations.

**R. Concurrency & Race Conditions** - Test rapid navigation, cache updates during fetch, and late API responses.

**S. Export/Import** - Not applicable for this app.

**T. Performance** - Test load times, animation smoothness, memory usage, and console errors.

---

## ABSOLUTE PROHIBITION: NO MOCK DATA

The feature list must include tests that **actively verify real API data** and **detect mock data patterns**.

**Include these specific tests:**

1. Verify real Open-Meteo API calls are made
2. Verify weather data changes based on actual location/conditions
3. Verify cache expiration (30-min) works correctly
4. Verify outfit recommendations change with actual weather data
5. If data appears that wasn't fetched from API - FLAG AS MOCK DATA

**The agent implementing features MUST NOT use:**

- Hardcoded weather data arrays
- `mockWeather`, `fakeData`, `sampleData` variables
- `// TODO: replace with real API`
- `setTimeout` simulating API delays with static data
- Static returns instead of API calls

**Why this matters:** Mock weather data defeats the purpose of the app. Users need real, current weather to get accurate outfit recommendations.

---

**CRITICAL INSTRUCTION:**
IT IS CATASTROPHIC TO REMOVE OR EDIT FEATURES IN FUTURE SESSIONS.
Features can ONLY be marked as passing (via the `feature_mark_passing` tool with the feature_id).
Never remove features, never edit descriptions, never modify testing steps.
This ensures no functionality is missed.

### SECOND TASK: Create init.sh

Create a script called `init.sh` that future agents can use to quickly
set up and run the development environment. The script should:

1. Install Node.js dependencies (npm install)
2. Build the React app if needed (npm run build)
3. Start the development server (npm run dev)
4. Print helpful information about how to access the running application

Since this is a React + Vite PWA, the script should follow those conventions.

### THIRD TASK: Initialize Git

Create a git repository and make your first commit with:

- init.sh (environment setup script)
- README.md (project overview and setup instructions)
- Any initial project structure files

Note: Features are stored in the SQLite database (features.db), not in a JSON file.

Commit message: "Initial setup: init.sh, project structure, and features created via API"

### FOURTH TASK: Create Project Structure

Set up the basic React + Vite project structure based on what's specified in `app_spec.txt`.
This typically includes:

- src/ directory with React components
- public/ directory with PWA manifest and icons
- Tailwind CSS configuration
- Vite configuration files

### ENDING THIS SESSION

Once you have completed the four tasks above:

1. Commit all work with a descriptive message
2. Verify features were created using the feature_get_stats tool
3. Leave the environment in a clean, working state
4. Exit cleanly

**IMPORTANT:** Do NOT attempt to implement any features. Your job is setup only.
Feature implementation will be handled by parallel coding agents that spawn after
you complete initialization. Starting implementation here would create a bottleneck
and defeat the purpose of the parallel architecture.
