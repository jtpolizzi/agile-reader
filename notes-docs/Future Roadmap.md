# Agile Reader: Future Roadmap & Feature Specification

This document outlines the strategic evolution of the Agile Reader application, moving from a stable local-first architecture to an intelligent, multi-device "drill" platform.

## ~~Phase 1: Pedagogical Drill & UI Enhancements~~ (DONE)

~~**Priority: High** **Focus:** Refining the core learning experience and active recall mechanics.~~

### ~~1.1 Dynamic Reading Modes & Layout Strategy~~

- ~~**Mode Logic:** Implementation of a "Strategy Pattern" for content sequencing.~~
  - ~~`EN_ONLY`, `ES_ONLY`: Single-language immersion.~~
  - ~~`EN_ES`, `ES_EN`: Traditional mirroring.~~
  - ~~**The "Target Primary" Rule:** Logic to ensure the language currently being read by the TTS is always positioned on the left (desktop) or top (mobile) to anchor the user's focus.~~
- ~~**Technical Implementation:** Use Svelte 5 `$derived` runes in `uiStore.svelte.ts` to transform the segment list into a "RenderableUnit" list without mutating the underlying document data.~~

### ~~1.2 The Ghosting & Recall System~~

- ~~**Visual Obfuscation:** * **Blur Mode:** CSS `filter: blur(5.0em)` to hide specific words while maintaining the structural "shape" of the sentence (providing context cues).~~
  - ~~**Hide Mode:** Complete opacity-zero masking.~~
- ~~**Interaction Model:**~~
  - ~~**Manual Reveal:** A tap/click gesture on a ghosted segment triggers a localized `isRevealed` state.~~
  - ~~**Auto-Reveal Sequence:** An optional setting where the ghosted text reveals itself exactly 500ms after the TTS audio for that segment finishes, serving as an "instant verification" loop.~~

## Phase 2: Cloud Connectivity & Android Portability

**Priority: Medium-High** **Focus:** True cross-platform persistence and "Always-On" library access.

### 2.1 Google Drive "Hybrid Repository"

- **Source of Truth:** Utilizing the Google Drive API `appDataFolder` for secure, app-specific storage.
- **Cache-Aside Pattern:** * The app reads from a local `IndexedDB` for near-instant boot times.
  - A background sync loop checks the Drive `changes` resource to pull remote updates or push local saves.
- **Atomic Metadata:** Moving from a monolithic `INDEX.json` to individual `.meta.json` files per document to avoid write conflicts when syncing between a phone and a desktop simultaneously.

### 2.2 PWA & Mobile Polish

- **Service Workers:** Implementing robust offline caching for the application shell.
- **Responsive Breakpoints:** Refining the "Always on Left" logic to become an "Always on Top" logic for narrow viewports (Android tablets/phones).

## Phase 3: Intelligence & Content Pipeline

**Priority: Low-Medium** **Focus:** Reducing friction for content creation and deepening linguistic understanding.

### 3.1 Contextual "Define" UI

- **AI Context Awareness:** On-demand API calls (Gemini/OpenAI) that send the current segment + surrounding 2 segments as context.
- **System Prompt:** "Explain the grammar/idioms in segment X, considering the context of segments Y and Z."
- **UI Integration:** A non-intrusive drawer or popover that displays the AI's breakdown without breaking the reading flow.

### 3.2 Automated Content Extraction

- **URL-to-Drill Pipeline:**
  - **Scraper Proxy:** A lightweight backend function to bypass CORS and fetch article text.
  - **AI Restructuring:** Using an LLM to take raw article text and return a perfectly formatted `## EN / ## ES` Markdown structure ready for the `MarkdownParser`.
- **Translation Refinement:** Using AI to generate high-quality mirror translations for single-language imports.

## Implementation Status Tracking

- [ ] Phase 1.1: Reading Modes logic (Design Phase)
- [ ] Phase 1.2: Ghosting/Reveal UI (Design Phase)
- [ ] Phase 2.1: Google Drive Integration Research
- [ ] Phase 3.1: API Proxy exploration