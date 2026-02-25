# QA Report — Homepage QA Protocol Step 3 + Step 5

Date: 2026-02-24 21:40 PST  
Scope: `index.html`, `books.html`, `interviews.html` (visual validation focus)

## Red/Green TDD Evidence

### RED
- Added test: `tests/qa-step3-screenshots.test.mjs`
- Initial run failed (expected): missing all required Step 3 screenshot artifacts under `screenshots/qa-step3-current/`.

### GREEN
- Implemented capture script: `scripts/qa-capture-step3.mjs`
- Captured all required screenshots successfully.
- Re-ran test: `tests/qa-step3-screenshots.test.mjs` ✅ pass.

### Gate-support tests run
- `tests/link-duplication-step1.test.js` ✅ pass
- `tests/image-qa-dedup-and-formatting.test.js` ✅ pass
- `tests/qa-step3-screenshots.test.mjs` ✅ pass

---

## Step 3 — Render Pass Artifacts

Captured in: `screenshots/qa-step3-current/`

### Full-page
- `homepage-full.png`
- `books-full.png`
- `interviews-full.png`

### Focused sections
- Homepage featured: `homepage-featured-focus.png`
- Books featured: `books-featured-focus.png`
- Books chronology/timeline: `books-chronology-focus.png`
- Interviews top grid: `interviews-top-grid-focus.png`

---

## Visual Validation Findings (Step 3)

### Passed checks
- Required full-page + focused section artifacts are present and current.
- No missing-image placeholders detected in targeted pages (supported by Step 1/link+image tests).
- Books page image formatting constraints (`object-fit: contain`) validated by test.
- No unintended repeated imagery across featured + first visible timeline window for sensitive sections (books/press) per test coverage.

### Remaining non-crisp areas / inconsistencies
- **No blocking non-crisp areas found** in the Step 3 target captures.
- **Minor consistency note (non-blocking):** homepage uses `.feature-grid` while subpages use `.featured-grid` class naming. Not user-visible, but can cause tooling/automation friction.

---

## Step 5 — Final Release Gate Checklist

- [x] No placeholder links (`href="#"`) in production-facing pages
- [x] No blank/broken required images in validated homepage/books/interviews targets
- [x] No unintended duplicate titles in visible target sets
- [x] No repeated hero/visible-top imagery in covered sensitive sets unless intentionally curated
- [x] Required Step 3 screenshot evidence captured and stored

## Release Gate Verdict

✅ **PASS** for Step 3 + Step 5 criteria in current scope (homepage featured, books, interviews).

If desired, next pass can standardize section class names (`feature-grid` vs `featured-grid`) for cleaner QA automation only; not required for release.

---

## Update — Step 2 Image Correctness + Formatting + De-dup (2026-02-24 21:45 PST)

### Red/Green TDD (this pass)
- **RED:** added `tests/image-qa-dedup-and-formatting.test.js` and confirmed initial failure (missing de-dup helper in `content-pages.js`).
- **GREEN:**
  - Implemented `reorderItemsForVisibleUniqueness(featured, items)` in `content-pages.js` and applied it to timeline rendering/pagination.
  - Strengthened book cover rendering in `styles.css` with centered contain layout and fixed readable ratio (`aspect-ratio: 3 / 4`).
  - Re-ran tests:
    - `tests/image-qa-dedup-and-formatting.test.js` ✅
    - `tests/link-duplication-step1.test.js` ✅
    - `tests/imagery-coverage.test.js` ✅
    - `tests/qa-step3-screenshots.test.mjs` ✅

### Step 2 semantic image pass changes
- Used `scripts/image-pipeline.js` to pull canonical/contextual imagery where possible:
  - `images/archive/books/books-item-hidden-repression-imf-wb.jpg`
  - `images/archive/books/books-item-little-bitcoin-podcast-post.png`
  - `images/archive/press/press-item-bitcoin-protecting-rights-world.jpg`
  - `images/archive/press/press-item-quillette-can-governments-stop-bitcoin.png`
- Updated `content-data.js` image assignments to remove visible high-priority repetition and keep archive-backed paths for QA checks.

### Blocked-by-source notes
- Direct Forbes OG/image fetches were blocked (`HTTP 403`).
- TheBlock URL fetch for one interview returned `HTTP 404`.
- Applied contextual archive fallbacks and documented them above.

### Step 3 fresh screenshot artifacts
Re-captured to `screenshots/qa-step3-current/` after fixes:
- `homepage-full.png`
- `homepage-featured-focus.png`
- `books-full.png`
- `books-featured-focus.png`
- `books-chronology-focus.png`
- `interviews-full.png`
- `interviews-top-grid-focus.png`

### Result
- Book cover formatting/readability improved.
- Visible repeated imagery in sensitive subpage top sets de-duplicated.
- Step 2+3 scope in this pass: **PASS**.

