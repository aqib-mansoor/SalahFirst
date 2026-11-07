# SalahFirst AI Agent Coding Standards & Project Guidelines

This document establishes the mandatory architectural, stylistic, and code quality standards for all AI assistants working within this repository. These rules apply automatically to all tasks, modifications, and code generation. Treat this file as the permanent development guideline.

---

## 1. File Length Limits (200–250 Lines Strict Ceiling, Max 300)
- **Strict Hard Ceiling:** No source code file should exceed **250–300 lines**. Target 200–250 lines max.
- **Component Decomposition:** When a component approaches 200 lines, immediately break it down and extract sub-sections (cards, lists, modals, bars, widgets, rows) into dedicated, single-responsibility sub-components.
- **Progressive Refactoring:** Whenever modifying an existing file that approaches 200 lines, progressively refactor the touched section into smaller reusable sub-components.
- **Concise JSX:** Keep individual UI components focused and simple, ideally around 5–15 lines of JSX where practical. Do not sacrifice readability just to meet a line count.

---

## 2. Code Conciseness & Anti-Bloat Principle
- **Direct & Minimal:** If a feature or logic can be cleanly achieved in 5 lines, write 5 lines. Never write 50+ lines of bloated boilerplate, defensive over-engineering, or unnecessary wrapper abstractions.
- **No Over-Engineering:** Avoid redundant state variables, excessive utility indirection, or artificial helper classes when native React and standard JavaScript/TypeScript APIs suffice.
- **Single-Purpose Functions:** Keep functions lean, declarative, and easily readable at a glance.
- **No Code Duplication:** Never repeatedly write the same UI or logic in multiple files. Extract reusable components and utilities.

---

## 3. Centralized App Name & Color Theme Customization
- **Instant Global Customization:** The application name, metadata, and color themes must be fully centralized so that a developer can change them in a single place without touching individual screens:
  - **App Config:** Centralized in `src/constants/config.ts` (Application name, default location, metadata, version).
  - **Color Palette & Theme Tokens:** Centralized in `src/constants/theme.ts` (colors, semantic tokens, dark/light modes, spacing, typography scales, border radiuses, shadows).
- **Zero Hardcoded Colors:** All components must consume colors and spacing from the centralized theme tokens (`src/constants/theme.ts`). Never hardcode hex values like `#121212` directly inside screens or components.

---

## 4. Aesthetics & UI Quality (Modern Islamic Productivity for Gen Z)
- **No Frivolous Decorations:** Do **NOT** use random emojis, AI-generated-looking icons, gimmicky sparkles (✨, 🌟), or generic decorative AI-style elements.
- **Sleek Modern Finish:** Maintain a clean, premium, high-aesthetic finish suitable for Gen Z Muslim users:
  - Clean typography and balanced whitespace.
  - Authentic, crisp vector icons or consistent custom 3D icons with matching lighting, proportions, materials, and styling.
  - Subtle, purposeful micro-interactions and tactile feedback.
- **Visual References as Source of Truth:** Screenshots provided by the user are the primary design reference. Match colors, typography, spacing, layout, cards, buttons, and visual hierarchy strictly.
- **Responsive & Grid-Harmonious:** Ensure all UI controls (buttons, cards, inputs) maintain rigid alignment across different screen sizes without awkward text wrapping or layout overflow.

---

## 5. Safe Area, Responsiveness & Universal Device Compatibility (Android 7.0+)
- **Safe Area Insets (Top & Bottom):** Always wrap screens or containers with `SafeAreaView` from `react-native-safe-area-context` or apply `useSafeAreaInsets` to ensure headers, cards, floating actions, and bottom navigation bars never collide with status bars, camera notches, dynamic islands, or navigation bars/home indicators.
- **Android 7.0+ (API 24+) to Modern Devices:** The UI must render flawlessly across small screens, budget Android handsets (from Android 7.0+), large displays, and modern notch/island phones without breaking, clipping, or visual distortion.
- **Zero UI Breakage / Merging:**
  - Cards, rows, and buttons must never overlap, merge, or collapse into each other.
  - Text must never clip or break layouts unexpectedly; support dynamic system font scaling gracefully with flexible containers (`flexShrink`, `numberOfLines`, ellipsize modes).
  - Use flexible, proportional layouts (`flex`, percentages, aspect ratios) and scrollable containers (`ScrollView`, `FlatList`) to prevent overflow on smaller displays.
  - Never hardcode rigid fixed dimensions (`width: 380`) that exceed smaller device widths.

---

## 6. High-Performance State Management (Redux Toolkit - Zero Delay)
- **Centralized Redux Store:** Use Redux Toolkit (`@reduxjs/toolkit` & `react-redux`) located in `src/store/` for global state management (prayer times, settings, streaks, bookmarks).
- **Instantaneous UI Updates:** Ensure state transitions are immediate and latency-free with no perceptible delay or lag.
- **Optimized Selectors:** Keep slice reducers pure and lean. Use targeted `useSelector` hooks to avoid broad component re-renders.
- **Offline Hydration:** Sync with local AsyncStorage seamlessly on startup without blocking or delaying screen mount.

---

## 7. Offline-First & Zero-Backend Architecture
- **No Backend / Authentication:** This application has **NO** backend server, no login, no registration, and no user accounts.
- **Offline Storage:** Use local storage via `src/utils/storage.ts` (`@react-native-async-storage/async-storage`) for persistence (streaks, preferences, bookmarks, manual Salah tracking).
- **Resilient & Self-Contained:** All features must function completely offline with bundled calculations and local data.

---

## 8. Component Structure & Architecture
- **Directory Layout:**
  - `src/components/common/` - Reusable atomic components (Button, Card, Header, Text, Container, Icon).
  - `src/components/<feature>/` - Feature-specific sub-components.
  - `src/constants/` - Centralized app config and theme tokens.
  - `src/store/` - Redux store configuration, slices, and typed hooks (`src/store/slices/`, `src/store/index.ts`).
  - `src/hooks/` - Custom reusable React hooks.
  - `src/utils/` - Storage helpers, time/prayer calculation utilities, date formatters.
  - `src/data/` - Static data (Hadith collections, default cities, presets).
  - `src/types/` - Shared TypeScript interfaces.
  - `assets/` - Custom 3D icons, vector assets, fonts, wallpapers.
- **Clear Separation of Concerns:**
  - Logic & Data: Dedicated hooks (`src/hooks/`), Redux slices (`src/store/`), and utilities (`src/utils/`).
  - Presentation: Pure, focused UI components receiving clear typed props.
- **TypeScript Integrity:** Use clear, explicit interfaces for component props. Avoid `any`.

---

## 9. Security, Privacy & Git Hygiene
- **Strict Data Privacy:** Zero user tracking, zero telemetry, zero analytics scripts, zero data exfiltration.
- **Git Ignore Security:** Never commit `.env`, local keys, keystores (`*.jks`, `*.keystore`), credentials, platform build artifacts, or secret files. Keep `.gitignore` rigorously updated.
- **Data Validation:** Sanitize and validate any local inputs and stored JSON data to prevent corrupted state crashes.

---

## 10. Development Scope & Screen-by-Screen Workflow
- **Screen-by-Screen Delivery:** The user provides application screens and requirements one by one.
- **Strict Scope Discipline:** Implement only what is explicitly requested or what is strictly necessary to make the requested screen/feature function.
- **No Unrequested Additions:** Do not introduce unrequested features, animations, screens, or speculative logic.
- **File-Locking Protocol:** When implementing a new screen or modifying a file, strictly limit changes to the requested scope. Do not needlessly touch or refactor completed screens.
- **Seek Clarification:** If an important requirement or design decision is ambiguous, ask the user before assuming.

---

## 11. Expo SDK Guidelines
- Check `package.json` for Expo SDK version (currently SDK 58).
- ALWAYS install packages using `npx expo install <package>` to resolve SDK-compatible versions.
- Never edit `ios/` or `android/` directly when using Continuous Native Generation; configure via `app.json`.
- Run typecheck (`npx tsc --noEmit`) and verify clean builds before finalizing tasks.

---

## 12. Mandatory Response Status Format
At the conclusion of each response, always include a concise status block:

```text
STATUS: COMPLETED | IN_PROGRESS | BLOCKED
REASON: [brief explanation]
NEXT_STEP: [what needs to happen next]
```
