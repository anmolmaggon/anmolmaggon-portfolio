# Case Studies Closure Plan

Active workstream. Everything else is parked in `later-stage-site-backlog.md` until this is done.

## Goal

Make the case-study section strong enough to ship and useful enough for interviews.

The system should have two clean layers:

- `*-master.md` - private source of truth for interview prep, with ownership, constraints, process, tradeoffs, collaborators, and answers to likely questions.
- `*-portfolio.md` - the public website cut, short and visual. No private uncertainty, no invented metrics, no filler.

## Current Diagnosis

The structure exists, but it is not closed.

- Salary Pages and Quick Vibe Check have good product-thinking foundations, but their master docs still contain many `[NEED FROM YOU]` gaps.
- The public cuts were promoted into `CaseStudies.tsx` before metrics and screenshots were verified.
- Notes now has an imported Antigravity research inventory plus rebuilt master and portfolio drafts. Year, role, launch status, and impact posture are locked; it still needs screenshots and remaining Anmol context.
- The live section points to missing case-study assets under `public/case-studies/...`.
- Notes still uses Unsplash images in source.
- The modal leads with impact metrics before the story. That only works if metrics are verified. Until then, it makes the weakest part the first thing a visitor sees.

## Definition Of Done

A case study is ready only when all of these are true:

- Master doc has no unresolved `[NEED FROM YOU]` in the sections needed for interview prep.
- Portfolio cut has no `[NEED FROM YOU]`, `[VERIFY]`, placeholder comments, or invented numbers.
- Public metrics are backed by a source, or replaced by honest qualitative impact.
- `public/case-studies/[slug]/` contains every referenced image.
- Website source has no Unsplash URLs for case-study imagery.
- Modal opens cleanly on desktop and mobile.
- Before/after images use the exact same crop, viewport, and zoom.
- `rg "PLACEHOLDER|VERIFY|NEED FROM YOU|unsplash.com" src/app/components/CaseStudies.tsx plans/*-portfolio.md` returns nothing.

## Case Study Status

| Study | Master doc | Portfolio cut | Website copy | Metrics | Screenshots | Main risk |
|---|---|---|---|---|---|---|
| Notes | Draft from extraction | Draft from extraction | Old draft in code | Pre-launch qualitative | Missing | Needs screenshots, collaborator/process details, and identity-mode confirmation |
| The Number That Matters | Strong draft with gaps | Strong draft | Integrated | Unverified | Missing | Could sound overclaimed without proof and visuals |
| Quick Vibe Check | Strong draft with gaps | Strong draft | Integrated | Unverified | Missing | Needs clearer personal ownership and evidence for AI trust decisions |

## Immediate Work Order

### 1. Rebuild The Source-Of-Truth Layer

For each study, complete the master doc first.

Required fields before public rewrite:

- What Anmol personally owned end-to-end
- What was led/shared with PM, engineering, data, ML, or research
- Business context: why this shipped or is being built, why then
- Timeline and constraints
- What was deliberately cut
- What changed after launch, or what will be measured after launch for pre-launch work
- One honest "what I would do differently"
- Metrics source or explicit decision to use qualitative impact

Notes has the fresh Antigravity extraction. Next step is filling the human/contextual gaps Antigravity cannot know.

### 2. Rewrite The Public Cuts

Portfolio cuts should be sharp, not exhaustive.

Public structure:

- Title
- One-line role
- 3 tags
- Problem paragraph
- Approach paragraph
- 3 design decisions
- Impact, only if backed
- Screenshot slate

Rules:

- No metric goes public unless it can survive an interview follow-up.
- If a number is unavailable, use qualitative proof such as "shipped across all free company review pages" or "became the default pattern for AI insight sourcing."
- Do not repeat the same decision across studies. Salary can own "data integrity"; Quick Vibe Check can own "AI trust through receipts"; Notes can own "24-hour ephemerality / contextual identity / glanceability."

### 3. Capture Visual Proof

Each study needs a minimum asset set.

```text
public/case-studies/
  notes/
    preview.webp
    cover.webp
    screen-hero.webp
    screen-detail-1.webp
    screen-detail-2.webp
  salary-pages/
    preview.webp
    cover.webp
    before.webp
    after.webp
    screen-hero.webp
    screen-detail-1.webp
    screen-detail-2.webp
  quick-vibe-check/
    preview.webp
    cover.webp
    before.webp
    after.webp
    screen-hero.webp
    screen-detail-1.webp
    screen-detail-2.webp
```

Screenshot standards:

- `preview.webp`: 5:4, readable even as a hover card.
- `cover.webp`: 16:9, best single product proof.
- `screen-hero.webp`: wide view showing the core IA.
- `screen-detail-1.webp`: interaction or decision detail.
- `screen-detail-2.webp`: edge state, mobile collapse, gating, or proof layer.
- `before.webp` and `after.webp`: identical crop/viewport/zoom.

### 4. Integrate Into The Website

Only after the docs and assets are stable:

- Replace all case-study data in `src/app/components/CaseStudies.tsx` from the portfolio cuts.
- Replace Notes image URLs with local assets.
- Remove placeholder metric comments.
- Add a small section intro before the case-study list.
- Reconsider modal order if metrics remain qualitative: story and visual proof should lead, impact can move after decisions.
- Verify desktop hover cards, modal scroll, mobile modal spacing, and image loading.

### 5. Final QA

Run:

```bash
pnpm build
rg "PLACEHOLDER|VERIFY|NEED FROM YOU|unsplash.com|href=\"#\"" src/app/components/CaseStudies.tsx plans/*-portfolio.md
find public/case-studies -type f | sort
```

Manual QA:

- Hover each study.
- Open every modal.
- Drag both before/after sliders.
- Test modal on 375px mobile width.
- Confirm no grey image fallback appears.

## Per-Study Content Direction

### Notes

Working angle: a low-stakes workplace story format for thoughts that should not have to become permanent posts.

Strong story from extraction:

- Problem: Communities had permanent posts, but fleeting workplace moments felt too small and too risky for that format.
- Approach: 24-hour, story-like Notes with contextual identity, sticky-note visual language, and fast passive consumption.
- Decisions: radical ephemerality; identity per note; glanceability over depth; one clear reaction signal; freshness-first rail sorting.
- Locked facts: 2026; end-to-end product design + product management; built/pre-launch; no live impact metrics yet.
- Needs: screenshots, collaborator/process details, business context, and identity-mode confirmation.

### The Number That Matters

Working angle: from salary database to negotiation engine.

Keep:

- Data integrity over feature density.
- Monthly liquidity over gross CTC.
- Specific-role funnel instead of broad averages.

Need to sharpen:

- Avoid over-indexing on registration/gating if it overlaps with Quick Vibe Check.
- Decide whether the public impact is quantitative or qualitative.
- Capture one strong before/after that makes the old "flat average" weakness instantly visible.

### Quick Vibe Check

Working angle: AI summary that earns trust instead of asking for it.

Keep:

- "Show the receipts" as the main decision.
- Insights first, raw reviews as proof.
- Scannability over social-feed behavior.

Need to sharpen:

- Personal ownership and collaboration split with ML/data/engineering.
- Business context for AI summary work.
- Whether paid-profile descope belongs in the public cut or stays private for interviews.

## What I Need From Anmol

Minimum inputs to finish the public site:

- Real screenshots or access to export them.
- For each metric: source, date/range, and whether it is safe to publish.
- For each study: one sentence on what you personally owned.
- Live URL or Figma URL if you want it in the private interview docs.

If metrics are not available, that is fine. We will make the public case studies qualitative and defensible instead of numeric and fragile.
