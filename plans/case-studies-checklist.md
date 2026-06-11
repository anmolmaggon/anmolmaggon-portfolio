# Case Studies Checklist

Active tracker. Strategy lives in `case-studies-closure-plan.md`.

Legend: done / active / blocked / pending

## Overall

| Item | Status | Notes |
|---|---|---|
| Active closure plan | done | `case-studies-closure-plan.md` |
| Later-stage site backlog separated | done | `later-stage-site-backlog.md` |
| Antigravity extraction prompt tightened | done | Must produce evidence + public/private outputs |
| Notes research inventory | done | Imported from Antigravity output |
| Notes master doc | active | Rebuilt from extraction; needs Anmol context |
| Notes portfolio cut | active | Rebuilt from extraction; not ready for site |
| Salary master doc | active | Strong draft; personal/context/metrics gaps remain |
| Salary portfolio cut | active | Public copy exists; metrics/screens blocked |
| Quick Vibe Check master doc | active | Strong draft; personal/context/metrics gaps remain |
| Quick Vibe Check portfolio cut | active | Public copy exists; metrics/screens blocked |

## Blockers Before Website Integration

- [ ] No `[NEED FROM YOU]` in any public `*-portfolio.md` cut.
- [ ] No `[VERIFY]` in any public `*-portfolio.md` cut.
- [ ] No placeholder metric comments in `src/app/components/CaseStudies.tsx`.
- [ ] No Unsplash URLs in `src/app/components/CaseStudies.tsx`.
- [ ] Every referenced image exists in `public/case-studies/`.
- [ ] Every public metric has a source or is replaced with qualitative impact.
- [ ] Case-study modal verified on desktop and mobile.

## Per-Study Tasks

### 01 - Notes

- [x] Create `notes-master.md` scaffold.
- [x] Create `notes-portfolio.md` draft.
- [x] Run improved Antigravity prompt against the Notes repo/code.
- [x] Import Notes research inventory into this project.
- [ ] Fill collaborators, timeline, constraints, and process.
- [x] Confirm public year: 2026.
- [x] Confirm role: end-to-end product design + product management.
- [x] Confirm launch status: built / pre-launch, not publicly live yet.
- [x] Confirm identity modes: company/designation only; anonymous is not part of the product.
- [x] Cut live metric claims for now; use pre-launch qualitative impact unless launch data arrives.
- [ ] Export screenshot set to `public/case-studies/notes/`.
- [ ] Replace Unsplash image references in `CaseStudies.tsx`.

Required assets:

- [ ] `preview.webp`
- [ ] `cover.webp`
- [ ] `screen-hero.webp`
- [ ] `screen-detail-1.webp`
- [ ] `screen-detail-2.webp`

### 02 - The Number That Matters

- [ ] Fill personal ownership and collaboration split in `salary-pages-master.md`.
- [ ] Fill business context, timeline, process, and "what I would do differently".
- [ ] Decide whether public impact uses verified numbers or qualitative proof.
- [ ] Export screenshot set to `public/case-studies/salary-pages/`.
- [ ] Confirm before/after crops match exactly.
- [ ] Refresh `salary-pages-portfolio.md`.
- [ ] Refresh `CaseStudies.tsx` from the final portfolio cut.

Required assets:

- [ ] `preview.webp`
- [ ] `cover.webp`
- [ ] `before.webp`
- [ ] `after.webp`
- [ ] `screen-hero.webp`
- [ ] `screen-detail-1.webp`
- [ ] `screen-detail-2.webp`

### 03 - Quick Vibe Check

- [ ] Fill personal ownership and collaboration split in `quick-vibe-check-master.md`.
- [ ] Fill business context, timeline, process, and "what I would do differently".
- [ ] Decide whether public impact uses verified numbers or qualitative proof.
- [ ] Export screenshot set to `public/case-studies/quick-vibe-check/`.
- [ ] Confirm before/after crops match exactly.
- [ ] Refresh `quick-vibe-check-portfolio.md`.
- [ ] Refresh `CaseStudies.tsx` from the final portfolio cut.

Required assets:

- [ ] `preview.webp`
- [ ] `cover.webp`
- [ ] `before.webp`
- [ ] `after.webp`
- [ ] `screen-hero.webp`
- [ ] `screen-detail-1.webp`
- [ ] `screen-detail-2.webp`

## Final QA Commands

```bash
pnpm build
rg "PLACEHOLDER|VERIFY|NEED FROM YOU|unsplash.com" src/app/components/CaseStudies.tsx plans/*-portfolio.md
find public/case-studies -type f | sort
```

## Manual QA

- [ ] Hover each study title on desktop.
- [ ] Open each modal.
- [ ] Drag before/after sliders.
- [ ] Scroll each modal on 375px mobile width.
- [ ] Confirm no grey image fallback appears.
