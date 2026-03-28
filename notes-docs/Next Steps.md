I've completed the core integration of the **Audio Engine** with the **Svelte 5 UI**, implemented the **Settings** and **Help** modals, and wired up the **Global Keyboard Shortcuts**.

### Key Improvements Made:

1.  **Engine Store Orchestration:** 
    *   Fully implemented the `run()` loop in `engineStore.svelte.ts`.
    *   It now handles the "Plan" (e.g., `EN ➔ ES`) by calling the `AudioEngine` to speak and wait.
    *   Added logic for **Auto-Pause (AP)**, dynamic word-count-based pauses, and manual `[pause:ms]` overrides.
    *   Synchronized `currentIndex` and `isPlaying` state across the HUD, Reader, and Sidebar.

2.  **Settings & Help Modals:**
    *   Created `SettingsModal.svelte`: Includes **Voice Selection** (fetching system voices), **Preset Management**, and **UI Density (Font Scaling)**.
    *   Created `HelpModal.svelte`: Displays the keyboard shortcut reference.
    *   Integrated these into `App.svelte` and `Header.svelte`.

3.  **Keyboard Shortcuts:**
    *   Implemented global listeners in `App.svelte`:
        *   `Space / W`: Play/Pause.
        *   `S / Down`: Repeat current line.
        *   `A / D`: Prev/Next line.
        *   `Shift + A / D`: Prev/Next Heading.
        *   `Q`: Toggle Auto-Pause.
        *   `T`: Toggle Sidebar.

4.  **UI Polish:**
    *   **Sidebar:** Clicking a heading now jumps the reader to that section and selects it.
    *   **Reader:** Clicking any row (heading or drill) now sets the focus and begins playback from that point.
    *   **HUD:** Added the progress bar and status indicator (e.g., "ES: EN ➔ ES") that mirrors the legacy behavior.
    *   **Font Scaling:** The `main` content area now respects the `--reader-font-size` CSS variable set in the `uiStore`.

### Next Steps for you:

*   **Test the Audio:** Open the app and try clicking the "Play" button on a document. Ensure your system volume is up and voices are being detected in the Settings modal.
*   **Editor Persistence:** The "Edit Content" button in the Reader header opens the modal, but you may want to refine how it selects the "Active" document vs. creating a "New" one from the Library.
*   **Looping Logic:** I have not yet ported the "Loop Range" feature (where clicking a heading twice sets a loop bracket). This was present in `v2.12` and can be added to the `engineStore` next.

You can now run `npm run dev` to see the fully interactive reader in action.