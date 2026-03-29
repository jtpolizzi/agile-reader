# Developer Hand-off: Agile Reader (Refactored) - Project Blueprint

## 1. Project Overview
**Agile Reader** is a specialized, dual-language (Spanish/English) "mirroring" reading and audio-drill application. It parses custom Markdown documents into segmented audio drills, allowing users to read along while a Text-to-Speech (TTS) engine reads the content, highlighting the active segment.

### Architecture
The application is a modern **Single Page Application (SPA)** using **Svelte 5 (Runes)**, **TypeScript**, and **Tailwind CSS v3**, bundled with **Vite**.

## 2. Technical Stack
*   **Framework:** Svelte 5 (Using `$state`, `$derived`, and `$props` runes). *Note: Legacy Svelte 4 `writable` stores are explicitly avoided.*
*   **Language:** TypeScript (Strict mode).
*   **Styling:** Tailwind CSS v3 (Configured via PostCSS).
*   **Build Tool:** Vite (Running purely as a client-side SPA).
*   **Persistence:** `localStorage` (abstracted behind a Repository Pattern for future cloud migration).

## 3. Project Structure
```text
/src
  /core           <-- PURE TYPESCRIPT DOMAIN LOGIC (No Svelte/UI dependencies)
    /models       <-- Data Classes (AgileDocument, Segment)
    /parser       <-- MarkdownParser (Regex logic to build Segments)
    /engine       <-- AudioEngine (Web Speech API wrapper with bug workarounds)
    /storage      <-- IDocumentRepository & LocalStorage implementation
  /stores         <-- THE REACTIVE BRIDGE
    libraryStore.svelte.ts  <-- Svelte 5 Runes wrapping the Repository
    engineStore.svelte.ts   <-- Svelte 5 Runes wrapping the AudioEngine
    uiStore.svelte.ts       <-- Global UI state (modals, settings, persistence)
  /components     <-- SVELTE PRESENTATION LAYER
    /library      <-- The Catalogue table (LibraryView.svelte)
    /reader       <-- The Markdown rendering engine (ReaderView.svelte)
    /hud          <-- The floating playback HUD (PlaybackHUD.svelte)
    /shared       <-- Header, Sidebar, Modals (Settings, Help, Editor)
  App.svelte      <-- The Root Layout Coordinator (Handles Routing & Shortcuts)
  main.ts         <-- Vite Entry Point
  app.css         <-- Global Tailwind directives & Scoped CSS Variables
```

## 4. Current Development Status

### ✅ Completed Features
1.  **Core Engine:** Fully functional reading loop with EN/ES sequencing and Auto-Pause (AP).
2.  **Audio Robustness:** Implemented workarounds for Chrome's 15s bug, queue clearing, and safety timeouts for missed events.
3.  **UI State & Persistence:** All settings (font size, layout, speed, voices, sidebar state, active document, and reading position) are persisted to `localStorage`.
4.  **Catalogue (Library):** Full CRUD with search, tag filtering, and sortable columns (Title, Created, Updated, Last Used).
5.  **Reader UI:** Auto-centering scroll, interactive TOC (follows reading position), and dynamic font scaling (using `em` units).
6.  **Global Shortcuts:** Full keyboard control (`Space/W`, `S/Down`, `A/D/Arrows`, `Shift+Arrows`, `Q`, `T`, `?`).
7.  **Preset Management:** Save/Load named configuration presets (Mixed-case supported).
8.  **Storage Architecture Split (Performance Fix):** Separated document metadata (Index) from document text (Content) to allow instant catalogue loading.
9.  **Parser Robustness:** Fixed the "Missing Lines" bug. Plain text lines are now parsed correctly.
10. **UI Enhancements:** The active document title is now displayed in the main Header when in the Reader view.

### 🚧 Pending Tasks (Next Steps)
1.  **Looping Logic:** Re-implement the "Heading Loop" feature (click heading to set a loop range).
2.  **Mobile Polish:** Test PWA features (manifest/service worker) for "Add to Home Screen" support.
3.  **Auto-Pause (AP) Edge Cases:** Further verify behavior during manual navigation when AP is enabled.

## 5. Development Workflow & Rules

### Svelte 5 Runes Pattern
Always use the `.svelte.ts` extension for reactive logic files.
```typescript
export class MyStore {
  public value = $state(0);
  public double = $derived(this.value * 2);
}
```

### The Repository Pattern
Do not call `localStorage` directly from components. Use `libraryStore`, which proxies to the `IDocumentRepository`.

### Tailwind & CSS
*   Use Tailwind v3. Modifying the build pipeline to v4 may cause errors.
*   Reader font scaling uses `--reader-font-size` on `.reader-container`. Children must use `em` units to scale correctly.

---
*Status: Stable / Feature Parity + Modern Architecture achieved.*
