# Technical Specification: Lead Language Anchoring & UI Refinement

## 1. Overview

The goal is to implement "Lead Language" anchoring to ensure visual and auditory synchronization. The "Lead" language (the one read first or only) should always occupy the primary visual slot (Left in Side-by-Side, Top in Stacked). Additionally, the UI requires a robust tooltip system and updated keyboard shortcuts for better accessibility.

## 2. Core Logic: "Lead Language" (uiStore.svelte.ts)

Implement a derived property to determine the anchor language based on the current reading mode.

- **Definition:** - If `readingMode` is `ES_EN` or `ES_ONLY`, the **Lead Language** is `es`.
  - Otherwise, the **Lead Language** is `en`.
- **Implementation:** Use `$derived` in `uiStore.svelte.ts` to expose `leadLanguage`.

## 3. UI/UX: Tooltips & Labels (Header.svelte)

Implement standardized tooltips that include keyboard shortcuts. Labels should describe the state/layout clearly.

- **Naming Convention (Layout Modes):**
  - Mode 1: **Side by Side**
  - Mode 2: **Stacked**
  - Mode 3: **Single**
- **Tooltip Format:** `[Action Name] ([Key])`
  - *Settings ( , )*
  - *Help ( ? )*
  - *TOC Toggle ( T )*
  - *Auto Pause ( Q )*
  - *Back to Library ( L )*
- **Visuals:** Add `title` attributes to all action buttons in `Header.svelte` using a helper function to format the string.

## 4. Layout: Spatial Anchoring (ReaderView.svelte)

The layout must reactively reorder based on the `uiStore.leadLanguage`. The user choice of mode (Side-by-Side vs Stacked) is respected on all devices, but the internal ordering follows the Lead.

### Side-by-Side Mode

- **Rule:** The Lead Language column must always be on the left.
- **Logic:** Use Tailwind's `flex-row` (for EN lead) vs `flex-row-reverse` (for ES lead) on the segment container.

### Stacked Mode

- **Rule:** The Lead Language block must always be on top.
- **Logic:** Use `flex-col` vs `flex-col-reverse` based on `leadLanguage`.

### Single Mode

- **Rule:** Only show the text corresponding to the current Lead Language.

## 5. Keyboard Shortcuts (App.svelte)

Update and expand the global keyboard listener.

- **Settings:** Map the `,` (Comma) key to `uiStore.toggleSettings()`.
- **Auto Pause:** Map `Q` to `uiStore.toggleAutoPause()`.
- **Library:** Map `L` to `onBack` logic (returning to library).
- **TOC Toggle:** Ensure `T` remains mapped to `uiStore.toggleSidebar()`.
- **Logic:** In the `keydown` handler, ensure shortcuts do not trigger if the user is typing in an input/textarea.

## 6. Shortcuts Screen Polish

- **Label Update:** Change the text for the sidebar toggle from "Sidebar Toggle" to **"TOC Toggle"**.

## 7. Settings Screen Polish (SettingsModal.svelte)

- **Consistency:** Ensure all font size and speed controls match the scale used in the `uiStore`.

## 8. Implementation Checklist for AI Assistant

1. [ ] Update `uiStore.svelte.ts` with `leadLanguage` derived state.
2. [ ] Modify `Header.svelte` to use explicit labels (Side by Side, etc.) and add hotkey-inclusive tooltips.
3. [ ] Refactor `ReaderView.svelte` styling to swap column/row order based on `leadLanguage` using flex-reversal.
4. [ ] Update `App.svelte` `onKeyDown` logic for `,` (Settings), `Q` (Auto Pause), and `L` (Library).
5. [ ] Rename "Sidebar" references to "TOC" in `SettingsModal.svelte`.