# Functional Specification: Agile Mirroring Reader (v2.0)

## 1. Vision & Philosophy

A high-density "Systems Reader" designed for intelligent, analytical learners. It moves away from "app-like" bubbles toward a "Document/Script" interface (inspired by Language Reactor). The goal is to see structural patterns across many lines of text simultaneously to facilitate the 4-Pass Method.

## 2. Structural Content Parsing

The engine parses Markdown-style text to build a hierarchical practice environment.

- **Hierarchical Breadcrumbs**: `# Stage > ## Section > ### Set`. The current "Path" is always visible (Sticky Breadcrumb).
- **Drill Segments**: Lines containing a pipe `|` are treated as bilingual pairs.
- **Tag Stripping**: Internal system tags like `[es]` and `[en]` are purely for the parser and are automatically stripped from both the Visual UI and the Audio Engine.

## 3. The "Density" Interface

The UI prioritizes information density over large touch targets.

- **Three Layout Modes**:
  1. **Side-by-Side**: ES (Left) | EN (Right). Mirroring the classic LR desktop view.
  2. **Over-and-Under**: ES (Top) / EN (Bottom). Optimized for vertical focus/mobile.
  3. **Plain List**: ES only. EN is hidden to force total immersion.
- **Tighter Spacing**: Minimal vertical padding allows 10–15 drills to be visible at once.
- **Inline Headings**: Headings are rendered directly in the scrollable list to provide narrative context.

## 4. Audio & Timing Engine

- **Mode Toggle**:
  - **Flow**: Continuous reading (Shadowing).
  - **Drill**: Prompt -> Pause -> Confirm.
- **Zero-Gap Mode**: A "0" pause preset for non-stop shadowing (Pass 4).
- **Adaptive Pause**: Calculated as `Base_Preset + (Word_Count * 450ms)`.
- **Voice Preferences**: Per-language voice selection saved to user preferences.

## 5. Controls & Ergonomics

Designed for hands-on-keyboard "Pro" workflows.

- **WASD Navigation**:
  - `D` / `Right Arrow`: Next segment.
  - `A` / `Left Arrow`: Previous segment.
  - `W` / `Space`: Play/Pause.
- **Global Toggles**:
  - `1, 2, 3`: Speeds (Slow, Natural, Fast).
  - `?`: Show/Hide Shortcut Overlay.
- **Jump Logic**: Tapping any line instantly moves the "Playhead" to that location and highlights it with a distinct background and play indicator.

## 6. Technical Requirements

- **Storage**: `localStorage` persists Markdown content, voice choices, layout preferences, and the last active drill position.
- **Rendering**: Clean HTML5/Tailwind/Vanilla JS for zero-latency interactions.
- **Responsiveness**: Scales from mobile (Over-and-Under) to Ultra-wide (Side-by-Side).