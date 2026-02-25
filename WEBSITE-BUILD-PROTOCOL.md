# Website Build Protocol (Quality-First)

This is the standard protocol for building/refining content-heavy sites.

## Phase 1 — Data & Link Integrity
1. Validate every entry has title/date/outlet/link.
2. Reject placeholders (`#`) and javascript links.
3. Live-check high-visibility links (featured + top fold) for 200/redirect success.
4. Detect duplicated titles and resolve canonical copy.
5. Sanitize URL corruption artifacts (`%EF%BF%BC`).

## Phase 2 — Imagery Correctness
1. Fetch canonical image from source URL (`og:image` / YouTube thumb).
2. Enforce semantic match (image belongs to the actual entry).
3. Reject unusable assets (1x1, missing, unreadable).
4. Enforce section identity: top visible cards should not recycle unrelated section hero assets.
5. Apply section-specific formatting rules (books = `object-fit: contain`).

## Phase 3 — Visual QA
1. Capture full-page screenshots for all core pages.
2. Capture focused crops for high-risk sections (featured, books, interviews, archive previews).
3. Compare before/after and annotate changes.

## Phase 4 — Release Gate
Ship only if all are true:
- no placeholder links
- no dead featured links
- no blank images
- no accidental duplicate entries
- no obvious wrong-image mismatches
- visual consistency across top-fold sections

## Execution model (swarm)
- Agent A: link/data integrity
- Agent B: imagery correctness/formatting
- Agent C: visual regression + release gate
- Integrator: merges fixes and publishes `QA-REPORT.md`
