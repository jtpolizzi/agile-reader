# Technical Specification: Part 2 - Ghosting & Recall System

## 1. Overview

The Ghosting & Recall system is a pedagogical modifier designed for active recall. It obfuscates the **Secondary Language** (the language that is NOT the current Lead Language), forcing the user to mentally translate before revealing the answer.

## 2. Core State Management (`src/stores/uiStore.svelte.ts`)

Add the following reactive properties to manage the ghosting state:

- **`ghostMode`**: Toggle state for the active drill.
  - `NONE`: No obfuscation.
  - `ACTIVE`: Ghosting is enabled.
- **`ghostType`**: User preference for the style of obfuscation.
  - `BLUR`: Applies a CSS blur filter.
  - `HIDE`: Makes text invisible but preserves layout space.
- **`autoReveal`**: Boolean to enable/disable the automatic verification loop.
- **`revealDelay`**: Integer (ms) representing the pause between audio completion and auto-reveal.
- **`revealedSegments`**: A `Set<string>` (reactive via `$state`) to track which individual segments have been manually or automatically revealed.

## 3. The Obfuscation Logic (`src/components/reader/ReaderView.svelte`)

Apply conditional styling to the secondary language block based on the `uiStore` state.

### 3.1 Styling Rules

- **Condition for Ghosting:** A segment block should be ghosted if:
  1. `uiStore.ghostMode === 'ACTIVE'`
  2. The block is the **Secondary Language** (opposite of `uiStore.leadLanguage`).
  3. The `segment.id` is NOT in `uiStore.revealedSegments`.
- **Visual Styles:**
  - `blur-sm` or `blur-md` (Tailwind) for `BLUR`.
  - `opacity-0` for `HIDE`.
  - Add a transition (e.g., `transition-all duration-300`) to ensure reveals are smooth.

## 4. Reveal Mechanics

### 4.1 Manual Reveal

- **Interaction:** Add a click or tap listener to the ghosted block.
- **Action:** Add the current `segment.id` to `uiStore.revealedSegments`.

### 4.2 Auto-Reveal (The Verification Loop)

- **Trigger:** Listen for the `onEnd` event from the `AudioEngine` for the **Lead Language** segment.
- **Sequence:**
  1. Lead Audio finishes.
  2. Wait for `uiStore.revealDelay`.
  3. Automatically add `segment.id` to `uiStore.revealedSegments`.

### 4.3 The "Drill Reset"

- **Logic:** Whenever the `activeIndex` (reading position) changes, clear the `uiStore.revealedSegments` set.
- **Purpose:** Ensures that each new segment starts ghosted, maintaining the integrity of the drill.

## 5. UI & Controls

### 5.1 Header Additions (`Header.svelte`)

- **Ghost Toggle:** Add a button with the `G` hotkey.
- **Tooltip:** `Ghost Mode (G)`.
- **Visual Indicator:** The button should highlight (e.g., amber or indigo) when `ghostMode` is `ACTIVE`.

### 5.2 Settings Updates (`SettingsModal.svelte`)

- **Ghosting Type:** Radio or toggle group to select between **Blur** and **Hide**.
- **Auto-Reveal Delay:** A slider (Range: 0ms to 2000ms, Step: 100ms) with a live label showing the current value in seconds (e.g., "0.5s").
- **Auto-Reveal Toggle:** Checkbox/switch to enable the automatic verification loop.

## 6. Keyboard Shortcuts (`src/App.svelte`)

- **Ghost Toggle:** Map the `G` key to toggle `uiStore.ghostMode` between `NONE` and `ACTIVE`.

## 7. Implementation Checklist

1. [ ] Expand `uiStore.svelte.ts` with ghosting state properties and the `revealedSegments` set.
2. [ ] Update `ReaderView.svelte` to apply conditional CSS classes for obfuscation.
3. [ ] Implement the `onPointerUp` (or click) handler in `ReaderView.svelte` for manual reveals.
4. [ ] Integrate the `onEnd` audio event with a `setTimeout` logic for Auto-Reveal.
5. [ ] Add the `G` hotkey listener in `App.svelte`.
6. [ ] Build the configuration UI in `SettingsModal.svelte`.