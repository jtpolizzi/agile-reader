# Functional Specification: Agile Mirroring Reader (v1.0)

## 1. Executive Summary

The **Agile Mirroring Reader** is a lightweight, browser-based pedagogical tool designed to facilitate the "4-Pass Method" for language acquisition. It prioritizes active production (mirroring/shadowing) over passive consumption. The system transforms a structured Markdown document into an interactive, timed, audio-visual drill environment.

## 2. The "Agile-Mark" Syntax

To maintain a "systems-not-rote" approach, the app parses standard Markdown with minimal enhancements.

### 2.1 Structural Hierarchy

- `# Stage` (H1): Major thematic blocks.
- `## Section` (H2): Specific lesson or topic.
- `### Set / Dialogue` (H3): The atomic unit of a practice session.

### 2.2 Content Segments

- **Format:** `[es] Spanish Text | [en] English Text [pause:optional_seconds]`
- **Logic:** The `|` pipe acts as a delimiter for the "Prompt" and "Response" (order depends on the active Pass Mode).

## 3. Core Engine Logic

### 3.1 The Playhead & Navigation

- **Table of Contents (ToC):** Automatically generated from H1–H3 tags.
- **Active Context:** Clicking a header in the ToC focuses the "Playhead" on that section.
- **Auto-Scroll:** The UI centers the active segment in the viewport during playback.

### 3.2 The Timing Engine (Adaptive Pausing)

The pause duration is calculated dynamically to allow the user sufficient time to produce the target language.

- **Formula:** `Total Pause = Global_Preset_Base + (Character_Count * Complexity_Factor)`
- **Presets:** - **Short:** Minimal padding (for familiar content).
  - **Medium:** Standard 1.5x speech length.
  - **Long:** 2.5x speech length (for new/complex structures).

### 3.3 The Audio Engine (Web Speech API)

- **Speeds:** - **Slow:** ~0.75x (Phonetic focus).
  - **Natural:** 1.0x (Standard prosody).
  - **Fast:** ~1.25x (Challenge/Fluency focus).
- **Voices:** Uses browser-native Spanish (Spain/Mexico) and English (US/UK) voices.

## 4. Modes of Operation (The 4-Pass Integration)

### 4.1 Flow Mode (Pass 1 & 4)

- **Primary Goal:** Comprehension (P1) and Shadowing (P4).
- **Behavior:** - Plays Spanish continuously.
  - **Visuals:** Spanish is bold; English is blurred/masked (unmasks on hover/tap).
  - **P4 Shadowing:** Active word-highlighting to help the user speak along with the TTS.

### 4.2 Drill Mode (Pass 2 & 3)

- **Primary Goal:** Active Translation & Production.
- **Behavior:**
  - **Pass 2 (ES -> EN):** Plays Spanish $\rightarrow$ Pause $\rightarrow$ Plays English.
  - **Pass 3 (EN -> ES):** Plays English $\rightarrow$ Pause $\rightarrow$ Plays Spanish (The "Reveal").
- **Visuals:** The "Target" language text is hidden until the audio confirmation plays.

## 5. UI/UX Design Requirements

### 5.1 Interface Layout

- **Sidebar:** Collapsible ToC for jumping between stages.
- **Header:** Sticky control bar containing:
  - Speed Toggle (S / N / F)
  - Mode Switcher (Drill / Flow)
  - Pause Length (S / M / L)
  - Reveal/Mask Toggle
- **Center Stage:** High-contrast, large-typography display of the current segment.
- **Footer:** Play/Pause, Skip Back/Forward, and Progress Bar.

### 5.2 Responsive Interactions

- **Tap to Peek:** Clicking a blurred translation reveals it instantly.
- **Loop Toggle:** Repeatedly plays the current segment for muscle-memory "drilling."
- **Keyboard Shortcuts:** Space (Play/Pause), Arrows (Next/Prev), Numbers (1-3 for Speeds).

## 6. Technical Stack

- **Architecture:** Single-file HTML5 (Single Page Application).
- **Styling:** Tailwind CSS (Modern, clean, mobile-responsive).
- **Logic:** Vanilla JavaScript (ES6+).
- **Persistence:** `localStorage` to save:
  - Last used Markdown content.
  - User preferences (Speed, Voice, Pause duration).
  - Last active Playhead position.

---



# Sample Text

# Stage 1: The City

## Section 1.1: Directions

### Set A: Basic Phrases

[es] ¿Dónde está el centro? | [en] Where is the city center?
[es] Gire a la derecha. | [en] Turn to the right.

### Set B: Asking for a Cafe

[es] Busco un café. | [en] I am looking for a cafe.