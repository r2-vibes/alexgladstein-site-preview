# Homepage QA Protocol (v1)

Purpose: convert Alex's feedback into a repeatable, swarmable process that catches quality errors before review.

## Scope
- Homepage (`index.html`) featured cards + archive preview
- Subpages: books, podcasts, essays, talks, press, interviews

## Error classes to catch
1. Wrong image for entry (semantic mismatch)
2. Duplicate image across adjacent/high-importance cards
3. Broken/blank image (bad path, zero-size source, blocked remote)
4. Duplicate content entries (same title repeated unintentionally)
5. Placeholder or broken links (`#`, dead URLs)
6. Formatting mismatch (image zoom/crop for book covers)
7. Incomplete sections (missing image/title/date/outlet)

## Acceptance rules
- No `href="#"` in production-facing cards/lists.
- Every featured card has:
  - title, type meta, valid link, non-blank image
- Book covers use `object-fit: contain` and remain readable.
- No duplicate title entries in same section unless explicitly justified.
- Visible top fold + first viewport of each subpage must have unique, relevant imagery.

## Workflow

### Step 1 — Automated scan
- Parse `content-data.js` and assert required fields.
- Flag duplicate titles and duplicate image paths.
- Flag missing/invalid links.
- Flag image files that are 1x1, missing, or unreadable.

### Step 2 — Semantic image pass
- For each entry, check if image source corresponds to same item URL/outlet when possible.
- Prefer canonical source-specific images via `scripts/image-pipeline.js`.
- If canonical fetch fails, use best contextual fallback and mark in report.

### Step 3 — Render pass
- Capture full-page screenshots for homepage and each subpage.
- Capture focused crops for sections that usually fail:
  - homepage featured
  - books featured + chronology
  - interviews top grid

### Step 4 — Human-readable QA report
- Output `QA-REPORT.md` with:
  - fixed issues
  - remaining issues
  - “blocked by source” items (403/404/paywall)
  - before/after screenshots

### Step 5 — Final gate
Release candidate passes only if:
- no placeholder links
- no blank images
- no unintended duplicate titles
- no repeated hero images in visible top sets unless approved
- no blocked image sources in content cards (`images/alex-speaking-*`, `images/email/*`, inbound media paths, absolute local file paths)
- run `node scripts/image-fit-audit.js` and verify IMAGE-FIT-REPORT.md has no unresolved HIGH-risk entries in homepage featured slots
- `npm test` passes (`homepage.test.js` + `content-image-policy.test.js`)

## Swarm roles
1. **Link & duplication checker**
2. **Image correctness + formatting fixer**
3. **Visual regression screenshot reviewer**
4. **Final integrator**

## Notes from today
- Prevent random images by default; canonical or contextual only.
- Legacy/blocked sources require explicit fallback + report annotation.
- Books page is highly sensitive to crop style; keep cover legible.

## Failure patterns + default remediations (institutionalized)
1. **Wrong article mapped to unrelated legacy slug**
   - Symptom: title/link mismatch (e.g., BI title pointing to unrelated Malaysia slug)
   - Fix: replace with canonical source URL; if unavailable, use legacy category index and mark as fallback.

2. **Dead featured links (404)**
   - Symptom: high-visibility featured card points to dead URL
   - Fix: swap to nearest canonical/legacy permalink that resolves; do not leave dead links in featured slots.

3. **Unicode slug corruption (`%EF%BF%BC`)**
   - Symptom: links include encoded object-replacement artifact from scraping
   - Fix: sanitize links by stripping `%EF%BF%BC` and re-verify URL.

4. **Duplicate titles from legacy + canonical copies**
   - Symptom: same title appears twice due to mirrored source entries
   - Fix: keep one canonical entry (prefer publisher/original source) and remove duplicate unless explicitly needed.

5. **Cross-section image reuse making pages feel duplicated**
   - Symptom: interviews top fold reuses press hero images
   - Fix: enforce section-identity rule: top 6 visible cards per section should use section-specific unique imagery.

6. **Book-cover readability failure (zoomed crops)**
   - Symptom: only partial text visible on covers
   - Fix: `object-fit: contain` + neutral background padding for books cards.

7. **Blank image due to bad asset/path or 1x1 file**
   - Symptom: card renders blank or tracking pixel image
   - Fix: re-fetch via image pipeline; reject 1x1 assets; add controlled fallback image.

## Swarm activation prompt template
Use this to run QA swarms consistently:
- Agent A: link integrity + duplication scan + sanitize corrupted URLs.
- Agent B: image semantic correctness + per-section uniqueness + book formatting checks.
- Agent C: visual regression screenshots + final release gate checklist.
Output: `QA-REPORT.md` with before/after proofs and unresolved blockers.
