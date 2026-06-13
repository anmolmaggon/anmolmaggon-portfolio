# Notes Case Study Modal — Refinement Pass

## Objective

Polish the Notes case-study modal (`CaseStudyModal.tsx` + Notes data in `CaseStudies.tsx`) based on a design review of the current build. The modal's structure is right; this pass fixes hierarchy (meta placement), tightens the Design Decisions ledger into true *design* decisions told in story order, replaces invented metric targets with honest directional community-health metrics, redesigns the misaligned Previous/Next footer, and adds a footer-feeling closing section that presents unanswered *product* questions (moderation, cold-start, education, distribution) as a hook to contact Anmol — proving PM-side thinking without bloating the page.

## Requirements

1. **Meta moves to an eyebrow above the title.** The meta line (`PM + Designer · 2026 · Pre-launch`) renders above the `Notes.` H1 as an eyebrow — small (13px), uppercase, tracking-wider, ~black/50, dot-separated. It is removed from its current position on the subtitle baseline. The subtitle stays below the title, alone, max-w-2xl. (Casing note: uppercase is correct here — the eyebrow functions as a label, and the finalized system reserves caps for labels.)

2. **Decision 01 copy simplified.** "Temporary by contract" detail becomes plainer and shorter. Use: *"A note disappears after 24 hours. No archive, no history – when it's gone, it's gone."* (Or equivalent: ≤ 2 short sentences, no abstract phrasing like "the promise of low stakes only holds if permanence is truly gone.")

3. **Ledger restructured to six rows, in this exact order:**
   - **01 Temporary by contract** — simplified copy per req 2.
   - **02 Identity fits the moment** — unchanged.
   - **03 Fun is the on-ramp** — unchanged.
   - **04 A sticky note, not a post** *(new — absorbs "Glanceable, not scrollable", which is deleted as a separate row)*. Detail: the note is a single sticky-note canvas; type quietly resizes to fit so a note never scrolls; the format teaches brevity on its own.
   - **05 One reaction, one signal** — unchanged copy (confirmed: it stays in the ledger).
   - **06 The cut row** (struck-through *Templates, Daily prompts, Comments, Video, Archive*) — detail reframed around **delightful-MVP scoping** (the Duolingo-founder framing: a small thing done delightfully beats a big thing done adequately). Use: *"Scoped down until everything that remained could be delightful. A small product done with care beats a big one done adequately – and one question gets a clean answer: will people share at all?"* (or equivalent keeping both the delight-scoping idea and the "one question" payoff).

4. **"What we're watching" metrics replaced with four directional community-health metrics — no invented numbers.**
   - ↑ Unique users posting
   - ↑ Contributions per user
   - ↑ Time spent on Communities
   - DAU/MAU — Stickiness
   Rendered in the existing hairline-ledger style (border-t columns, serif value slot, sans label below). The serif value slot shows a directional ↑ (and "DAU/MAU" for stickiness); labels carry the metric name. Grid becomes 4 columns on desktop (2×2 on small screens is acceptable). Caption updated to something like: *"The needles launch must move – reviewed at 90 days."* The previous placeholder targets (1 in 10 / 60%+ / 25%+) are deleted.

5. **New closing section: "Beyond the design" (open product questions + CTA), styled to feel like a footer.**
   - Content: 4–5 short serif questions, e.g. *How does moderation work when no one has a name? · How do we kickstart content on day one? · How do users learn a brand-new format? · Where does Notes get distribution?*
   - Presentation: a full-width closing band with generous vertical padding that reads as the page's end-of-story moment — including a **subtle warm gradient treatment matching the Operating Principles ("Unreasonable Hospitality") scene** so it feels distinct from the editorial body.
   - Ends with a single CTA line wired to `mailto:anmolmaggon40@gmail.com`, copy on the lines of *"Each of these has an answer – ask me about them. →"*
   - This section is data-driven and optional (only Notes defines it), so other case studies are unaffected.

6. **Previous/Next project navigation redesigned.**
   - Arrows are set **inline within the serif title text** (e.g. `← Quick Vibe Check` / `The Number That Matters →`) so they share the baseline and wrap naturally with multi-line titles — no separately-positioned arrow elements.
   - Eyebrows ("Previous project" / "Next project") stay above each title; left panel left-aligned, right panel right-aligned.
   - On hover, the panel receives the same subtle warm gradient treatment as the Operating Principles scene, and the arrow nudges in its direction (small translate, ~500ms ease, consistent with existing hover language).
   - Page order at the end of the modal: Early signal → What we're watching → Beyond the design (closing band) → Previous/Next nav. The sticky footer bar (email + socials) remains as chrome.

### Out of scope (for now)

- Replacing the placeholder SVG artwork (cover, composer, viewer, reaction shots) with real screens/recordings.
- Any changes to the other two case studies' content beyond not breaking their rendering.
- The salary study's placeholder impact numbers (separately flagged; needs verified figures).

## Edge cases

- **Studies without the new fields** (salary, vibe check): no "Beyond the design" band and no empty gaps render; their existing meta eyebrow renders from their `meta` arrays the same way.
- **Multi-line prev/next titles** ("The Number That Matters"): the inline arrow wraps with the text and never detaches or misaligns; right panel stays right-aligned across wraps.
- **First/last project**: Notes is first in the list — the prev/next mapping must wrap (prev = last project) or omit the panel gracefully; never render an empty dead panel.
- **Mobile (~375px)**: meta eyebrow wraps to two lines without overlapping the close button; watching grid collapses to 2×2 or 1-col; prev/next panels stack vertically, both left-aligned.
- **Stickiness column**: "DAU/MAU" must not overflow its column at the serif display size on mobile.

## Definition of done

1. Opening the Notes modal shows, top to bottom: eyebrow meta (uppercase, dot-separated) → `Notes.` title → subtitle → Context → cover. No meta text remains beside the subtitle.
2. The Design Decisions ledger shows exactly 6 rows numbered 01–06 in the order of req 3; "Glanceable, not scrollable" does not appear as a row title; row 04 is the sticky-note decision; row 06's detail mentions scoping down to something delightful.
3. Decision 01's detail is ≤ 2 sentences and contains no "promise of low stakes" phrasing.
4. "What we're watching" shows exactly 4 columns: three ↑ metrics + DAU/MAU stickiness; no numeric targets (no "1 in 10", "60%+", "25%+") appear anywhere in the section.
5. A "Beyond the design"-style closing band renders after What we're watching with ≥4 serif questions and a working `mailto:` CTA; it visually reads as a distinct footer-like band (gradient present, full-width, larger padding than body sections).
6. Previous/Next nav: arrows are part of the serif text line (select the title text — the arrow is included); hovering either panel shows a gradient and the arrow translates in its direction; with the browser at ~768px and ~375px the arrows remain on-baseline with their titles.
7. Salary and Quick Vibe Check modals open without errors, show their meta eyebrow, and contain no "Beyond the design" band or watching section.
8. `pnpm run build` passes with no TypeScript errors.

## Open questions

- Exact gradient tokens: pull from the Operating Principles "Unreasonable Hospitality" scene at build time (reference `OperatingPrinciples.tsx`) rather than inventing new colors.
- Final CTA copy for the closing band (draft provided in req 5; Anmol may want to wordsmith).
- Whether prev/next wraps around (Notes ← Quick Vibe Check) or hides the previous panel for the first project — builder should propose at build time; spec default is wrap-around.
