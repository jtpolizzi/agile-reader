This is the definitive **Architectural Blueprint** for the Agile Reader rewrite. This document serves as our "source of truth" to ensure that any future session (or continuation) adheres strictly to the quality standards and design decisions we established.

---

# Architecture Blueprint: Agile Reader (Svelte 5 + TypeScript)

## 1. Core Philosophy
*   **Domain-Driven Design:** Logic is separated from the UI. Core domain code must be framework-agnostic.
*   **Strong Typing:** TypeScript is non-negotiable. We will use strict types, interfaces, and classes to eliminate "undefined" runtime errors.
*   **Architecture Pattern:** Repository Pattern for data access (ready for future Cloud migration) and Svelte 5 "Runes" for reactive state management.
*   **Scope Isolation:** User-configurable settings (like font size) will be scoped specifically to the Reader component, preventing UI "warping."

## 2. Technical Stack
*   **Framework:** Svelte 5 (utilizing `$state` runes for reactivity).
*   **Language:** TypeScript (Strict mode enabled).
*   **Build Tool:** Vite (SPA mode - No SSR).
*   **Styling:** Tailwind CSS (configured for modularity).
*   **Data Models:** Encapsulated classes (`AgileDocument`, `DrillSegment`, `HeadingSegment`).

## 3. Directory Structure
```text
/archive          <-- Immutable legacy HTML files
/src
  /core           <-- PURE LOGIC (No Svelte dependencies)
    /models       <-- Data Classes (Document, Segment, Settings, Preset)
    /parser       <-- Domain-specific logic to transform MD into Typed Objects
    /engine       <-- The Web Speech API Audio State Machine
    /storage      <-- Repository implementations (currently LocalStorage)
  /stores         <-- Reactive bridges (Svelte 5 Runes wrapping the Core)
  /components     <-- UI (Library, Reader, HUD, Shared)
    /shared       <-- Modals, Buttons, Inputs
  App.svelte      <-- Root layout coordinator
  main.ts         <-- App entry point
  app.css         <-- Global CSS / Tailwind directives
```

## 4. Key Domain Entities (To be implemented)
*   **AgileDocument:** Tracks `id`, `title`, `tags`, `rawContent`, `lastUsed`, `createdAt`, `updatedAt`, `lastIndex`.
*   **SegmentHierarchy:** 
    *   `HeadingSegment` (level 1-3, es/en text, line index)
    *   `DrillSegment` (es/en text, optional pause, parent heading pointer)
*   **AudioEngine:** Encapsulates `speechSynthesis` instance, state (`playing`, `halted`, `index`), rate/pause values, and execution locking logic.

## 5. Storage Strategy (The Repository Pattern)
We will define `IDocumentRepository` to ensure the app is "Storage Agnostic." 
*   **Current:** `LocalStorageDocumentRepository` (persisting to browser cache).
*   **Future:** A new implementation of the interface will allow us to swap in Firebase/Supabase/REST without changing a single line of UI or Engine code.

## 6. CSS Architecture
*   **Global:** Base resets via Tailwind.
*   **Scoped:** Custom Properties (e.g., `--reader-font-size`) will be defined in a scoped CSS class applied only to the `<main>` reader container. This allows the user to scale text within the reader without shifting the layout of the toolbars, sidebar, or HUD.

## 7. Immediate Next Steps (Recovery)
1.  **Reconcile Dependencies:** Purge conflicting Tailwind v3/v4 configurations. We will align `package.json` to a stable, compatible set of dependencies.
2.  **Define Domain Models:** Explicitly write the TypeScript classes and interfaces for `AgileDocument` and `Segment`.
3.  **Implement Parser:** Port the existing regex-based parsing logic into the new `Parser` class.
4.  **Audio Engine Porting:** Extract the `run()`, `talk()`, and `wait()` methods into the `AudioEngine` class, turning them into a clean, observable service.

---
*This document acts as the contract for our development. Any future AI agent or human developer can pick up from here, confident in the structural integrity and design intent.*