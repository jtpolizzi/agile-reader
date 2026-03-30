# Extension Specification: Document Library & Catalogue System

## 1. Architectural Mandate

This system must act as a **wrapper** around the existing playback engine.

- **Non-Interference:** The library logic must not modify the internal workings of the `run()`, `talk()`, `wait()`, or `executionId` systems.
- **Integration Point:** The library is responsible only for feeding a string of text to the existing `parse()` function and an integer to the existing `select()` function.

## 2. Storage Architecture (The Registry Pattern)

To maintain performance with long lists, storage is decoupled into two tiers:

### 2.1 The Metadata Registry (`agile_reader_v1_library`)

A single JSON array containing objects for each document. This key is loaded once at boot to populate the Catalogue view.

- `id`: Unique string (e.g., `doc_1711488000000`).
- `title`: User-defined string.
- `tags`: Array of strings (Taxonomy).
- `created`: Timestamp.
- `updated`: Timestamp.
- `lastUsed`: Timestamp (Used for default sorting).
- `lastIndex`: Integer (Saves the "playhead" position per document).

### 2.2 The Content Vault (`agile_doc_{uuid}`)

The actual Markdown text for each document is stored in its own unique `localStorage` key.

- *Logic:* Content is only pulled from storage when a document is explicitly "loaded" into the reader.

## 3. The Catalogue View (UI Layer)

A high-density table interface that replaces the Reader View when toggled (Shortcut: `L`).

### 3.1 Interface Requirements

- **Table Columns:** Title (Italicized/Bold), Tags (Pills), Last Used (Date), Actions (Edit/Delete).
- **Sorting Logic:** - Clickable headers for Title, Last Used, and Updated.
  - Toggles between Ascending/Descending.
  - Default: `lastUsed` Descending.
- **Search Bar:** Real-time filtering that checks both the `title` and the `tags` array.

## 4. Operational Flow (Integration Logic)

### 4.1 Application Boot

1. Load the **Metadata Registry**.
2. Identify the document with the most recent `lastUsed` timestamp.
3. Fetch its content from the **Content Vault**.
4. Call existing `parse(content)`.
5. Call existing `select(metadata.lastIndex)`.

### 4.2 Document Loading

When a user selects a document from the Catalogue:

1. Call existing `stop()` to clear the engine and increment `executionId`.
2. Save current `State.index` to the *previous* document's `lastIndex` in the Registry.
3. Update `lastUsed` for the *new* document.
4. Fetch new content, call `parse()`, and call `select(new_doc.lastIndex)`.

### 4.3 The Composer (Editor Enhancement)

The existing "Engine Markup" modal is expanded to include:

- **Title Field:** Persistent input.
- **Tags Field:** Comma-separated string converted to an array on save.
- **Save Logic:** Updates the Registry entry and the specific Content Vault key simultaneously.

## 5. Maintenance: Registry Rescue

A utility function in the Settings modal that:

1. Iterates through all keys in `localStorage`.
2. Identifies keys with the `agile_doc_` prefix.
3. Cross-references them with the Registry.
4. Rebuilds any missing Registry entries by extracting the first line of the document content as a temporary title.