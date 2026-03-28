# Agile Reader - Project Blueprint & Continuation Guide

## 1. Project Overview
**Agile Reader** is a specialized, dual-language (Spanish/English) "mirroring" reading and audio-drill application. It parses custom Markdown documents into segmented audio drills, allowing users to read along while a Text-to-Speech (TTS) engine reads the content, highlighting the active segment.

### Architecture Shift (The Rewrite)
The application is currently undergoing a massive architectural rewrite.
*   **Legacy State:** The application was a single, monolithic, 500+ line Vanilla HTML/JS file (`v2.12.html`).
*   **Current State:** A modern, strongly-typed **Single Page Application (SPA)** using **Svelte 5 (Runes)**, **TypeScript**, and **Tailwind CSS v3**, bundled with **Vite**.

### The "Golden Reference" Archives
Any developer continuing this project **MUST** consult the `/archive` folder before building UI components.
1.  **`archive/v2.12-final-before-catalog.html`:** This is the absolute **Gold Standard** for the core application UI (The Header, Sidebar, Reader View, Playback HUD, Modals, and CSS Grid Logic). **Trust this file for everything EXCEPT the Library.**
2.  **`archive/v2.17.html`:** This file contains a failed LLM attempt at a rewrite that mangled the CSS and JavaScript. However, it contains the correct HTML structure for the **Catalogue/Library View**. **Trust this file ONLY for the `<div id="view-library">` layout and table.**

---

## 2. Technical Stack
*   **Framework:** Svelte 5 (Using `$state`, `$derived`, and `$props` runes). *Note: We are explicitly avoiding legacy Svelte 4 `writable` stores.*
*   **Language:** TypeScript (Strict mode).
*   **Styling:** Tailwind CSS v3 (Configured via standard PostCSS, not the newer v4 Vite plugin).
*   **Build Tool:** Vite (Running purely as a client-side SPA; no SSR or Node backend).
*   **Persistence:** `localStorage` (abstracted behind a Repository Pattern for future cloud migration).

---

## 3. Project Structure
```text
/archive          <-- IMMUTABLE LEGACY FILES (Consult these for UI/CSS reference)
/src
  /core           <-- PURE TYPESCRIPT DOMAIN LOGIC (No Svelte/UI dependencies here)
    /models       <-- Data Classes (AgileDocument, Segment, HeadingSegment, DrillSegment)
    /parser       <-- MarkdownParser (Regex logic to build Segments)
    /engine       <-- AudioEngine (window.speechSynthesis wrapper)
    /storage      <-- IDocumentRepository & LocalStorage implementation
  /stores         <-- THE REACTIVE BRIDGE
    libraryStore.svelte.ts  <-- Svelte 5 Runes wrapping the Repository
    engineStore.svelte.ts   <-- Svelte 5 Runes wrapping the AudioEngine
    uiStore.svelte.ts       <-- Global UI state (modals, layout, font sizes)
  /components     <-- SVELTE PRESENTATION LAYER
    /library      <-- The Catalogue table (LibraryView.svelte)
    /reader       <-- The Markdown rendering engine (ReaderView.svelte)
    /hud          <-- The floating playback pill (PlaybackHUD.svelte)
    /shared       <-- Header, Sidebar, EditorModal
  App.svelte      <-- The Root Layout Coordinator (Handles Routing)
  main.ts         <-- Vite Entry Point
  app.css         <-- Global Tailwind directives & Scoped CSS Variables
```

---

## 4. Current Development Status (Where we left off)

### ✅ Completed Milestones
1.  **Infrastructure:** The `/core` domain is fully typed and implemented (`Models`, `Storage`, `Parser`, `AudioEngine`).
2.  **Reactivity:** The `/stores` are built using Svelte 5 `.svelte.ts` files, perfectly decoupling logic from UI.
3.  **UI Foundation:** `App.svelte` correctly routes between the Library and Reader based on `uiStore.currentView`.
4.  **Library View:** The Catalogue is built, successfully reading from `localStorage`.
5.  **Editor Modal:** Users can click "New Document" or "Edit," which opens the modal, allows Markdown editing, and persists back to the `libraryStore`.
6.  **Reader View UI:** The layout modes (Side-by-Side, Over-Under, Plain) and typography are accurately mapped from `v2.12`.
7.  **Scoped Font Scaling:** Implemented `--reader-font-size` in `app.css` so scaling only affects the document, not the toolbars.

### 🚧 Pending Tasks (Next Steps for the Developer)
1.  **Settings Modal:** Build `SettingsModal.svelte` (Reference `v2.12`). Wire the font-size slider to `uiStore.fontSize` and the voice/pause inputs to `engineStore`.
2.  **Help Modal:** Build `HelpModal.svelte` (Reference `v2.12` for the HTML).
3.  **Keyboard Shortcuts:** Implement global hotkeys (Play, Next, Prev, TOC, Auto-Pause) in `App.svelte` or a dedicated listener component.
4.  **Audio Engine Integration:** The `PlaybackHUD` currently has a hardcoded `console.log` for "Next" and "Prev". The `engineStore` needs its `play()`, `next()`, and `prev()` orchestrator logic finished so it actually iterates through the `Segment[]` array and calls `AudioEngine.talk()`.
5.  **Reader Row Clicks:** In `ReaderView.svelte`, clicking a row should instruct the `engineStore` to jump to that index and begin playback.

---

## 5. Development Workflow & Rules

### Svelte 5 Runes Pattern
When building new stores or stateful classes, always use the `.svelte.ts` extension. 
```typescript
// Correct Svelte 5 Store Pattern
export class MyStore {
  public value = $state(0);
  public double = $derived(this.value * 2);
}
export const myStore = new MyStore();
```

### The Repository Pattern
Do not call `localStorage` directly from Svelte components. If you need to manipulate documents, call methods on the `libraryStore`, which proxies to the `IDocumentRepository`. This ensures we can easily swap to Supabase or Firebase in the future.

### Tailwind Constraints
Do not attempt to upgrade to Tailwind v4 (`@tailwindcss/vite`). The project is stabilized on Tailwind v3 (`tailwindcss@3.4.19` with `postcss` and `autoprefixer`). Modifying the build pipeline will cause `[postcss] Unexpected character` errors.

---

## 6. Getting Started
1. Ensure Node.js (v20+) is installed.
2. Run `npm install`
3. Run `npm run dev`
4. Access the app at `http://localhost:5173/`

## 7. Troubleshooting
*   **Error:** `rune_outside_svelte`
    *   **Fix:** Ensure any TypeScript file utilizing `$state` or `$derived` is named with the `.svelte.ts` extension.
*   **Error:** Missing Styles / CSS broken
    *   **Fix:** Ensure `app.css` only contains the three `@tailwind` imports, and that `postcss.config.js` is properly exporting the `tailwindcss` plugin. Do not use `.cjs` config files.
