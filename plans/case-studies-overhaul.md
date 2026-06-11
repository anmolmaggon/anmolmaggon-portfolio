# Plan: Case Studies Section Overhaul
**Portfolio:** Gussa Portfolio Finish  
**Date:** 2026-06-03  
**Owner:** Anmol Maggon  
**Status:** Ready to execute

---

## Context

The case studies section has fully built, polished interaction design but uses Unsplash placeholder images throughout. This plan covers replacing placeholder content with real work, improving copy, and optionally enhancing the layout.

### Current Section Structure

```
CaseStudies.tsx          — list view with 3 studies, hover interaction
CaseStudyModal.tsx       — full-screen modal per study
```

### Data Shape (CaseStudies.tsx → CaseStudyDetail type)

```ts
type CaseStudyDetail = {
  number: string;           // "01", "02", "03"
  title: string;            // Large display text on list
  client: string;           // Label in modal header
  year: string;             // Label in modal header
  role: string;             // Label in modal header
  meta: string[];           // Tags shown on hover (e.g. ["Anonymous", "End-to-end", "Shipped"])
  problem: string;          // Paragraph — "The problem" section
  approach: string;         // Paragraph — "Approach" section
  impact: { value: string; label: string }[];  // 4 black metric cards
  decisions: { title: string; detail: string }[];  // Design decisions list
  cover: string;            // 16:9 hero image in modal (full-bleed)
  shots: { src: string; caption: string; wide?: boolean }[];  // Screen gallery
}

// + list-specific fields (in Study type, not exported):
type Study = CaseStudyDetail & {
  image: string;    // Hover preview card (380×304px, 5:4 ratio)
  tilt: number;     // Rotation degrees for hover card (-6, 5, -4)
}
```

### Image Slots Per Study (what needs to be filled)

| Slot | Used in | Ideal size | Aspect |
|---|---|---|---|
| `image` | Hover preview card (list view) | 760×608 @2x | 5:4 |
| `cover` | Modal hero (full-bleed) | 2400×1350 @2x | 16:9 |
| `shots[0]` (wide: true) | Modal screen gallery, full width | 1800×900 @2x | 16:8 |
| `shots[1]` | Modal screen gallery, half width | 1400×1050 @2x | 4:3 |
| `shots[2]` | Modal screen gallery, half width | 1400×1050 @2x | 4:3 |

**Total per study:** 5 image slots  
**Total for 3 studies:** 15 images

---

## Current Placeholder Content

### Study 01 — Notes (AmbitionBox Communities)
- **image:** Unsplash phone mockup (dark/social)
- **cover:** Same Unsplash
- **shots:** 3× generic Unsplash (laptop, laptop, laptop)
- **copy:** ✅ Already well-written — problem/approach/decisions read authentically
- **metrics:** 4.2×, 62%, 11k, +38% — need verification against real data

### Study 02 — Salary Pages (AmbitionBox Redesign)
- **image:** Unsplash office/charts
- **cover:** Finance Unsplash
- **shots:** 3× generic finance Unsplash
- **copy:** ✅ Strong narrative — answer-first, info architecture language
- **metrics:** 1.9×, −41%, +27%, 8s — need verification

### Study 03 — Quick Vibe Check (Reviews AI Summary)
- **image:** Unsplash neon/UI
- **cover:** Office Unsplash
- **shots:** 3× generic Unsplash
- **copy:** ✅ Solid — the "four axes not five stars" framing is memorable
- **metrics:** 12s, 94%, 30k+, 3.6× — need verification

---

## Phase 0: Asset Audit (Do This Before Any Code)

Before touching the code, audit what real assets exist.

### Checklist
- [ ] Export real screenshots from Figma for each study
- [ ] Check `src/imports/` for any existing work screenshots (currently: floral-glass.png, hero-music.mp3, image-1.png through image-12.png, Frame2018777277 folder)
- [ ] Verify the `Frame2018777277` and `Frame2018777277-1` folders in imports — these may already be exported Figma frames
- [ ] Confirm real impact metrics with stakeholders/analytics
- [ ] Decide if a 4th case study should be added (CaseStudies.tsx supports unlimited)

### Asset Preparation Instructions

**Export from Figma:**
- Preferred format: `.webp` (smaller, modern) or `.jpg` at 80% quality
- Cover images: 2400px wide minimum
- Hover preview (`image`): 760px wide minimum  
- Screen shots: 1400–1800px wide
- Use `@2x` suffix convention if needed: `notes-cover@2x.webp`

**Where to place assets:**
```
public/
  case-studies/
    notes/
      cover.webp
      preview.webp
      screen-compose.webp      (shots[0], wide)
      screen-feed.webp         (shots[1])
      screen-empty-state.webp  (shots[2])
    salary-pages/
      cover.webp
      preview.webp
      screen-hero.webp         (shots[0], wide)
      screen-distribution.webp (shots[1])
      screen-comparables.webp  (shots[2])
    quick-vibe-check/
      cover.webp
      preview.webp
      screen-summary.webp      (shots[0], wide)
      screen-drill.webp        (shots[1])
      screen-confidence.webp   (shots[2])
```

**Why `/public/` not `/src/imports/`:**  
Images in `public/` are served as static files and referenced as `/case-studies/notes/cover.webp` (root-relative). Images in `src/imports/` must be imported via JS and processed by the bundler — fine for small assets but adds complexity for many images.

---

## Phase 1: Replace Image References

**File:** `src/app/components/CaseStudies.tsx`  
**Lines to change:** the `studies` array (lines 10–140)

### Task

For each study, replace the `image` and `cover` Unsplash URLs with paths to the real assets placed in `public/case-studies/`.

```ts
// BEFORE (example)
image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?...",
cover: "https://images.unsplash.com/photo-1551650975-87deedd944c3?...",

// AFTER
image: "/case-studies/notes/preview.webp",
cover: "/case-studies/notes/cover.webp",
```

Similarly replace all `shots[].src` values.

### Verification
- [ ] Open portfolio in browser, hover each study title → preview card shows real image
- [ ] Click each study → modal opens with real cover
- [ ] Scroll through modal → all 3 screen shots are real work
- [ ] No broken image icons (ImageWithFallback shows a grey SVG on failure)

---

## Phase 2: Refine Copy & Metrics

**File:** `src/app/components/CaseStudies.tsx`  
**Sections:** `problem`, `approach`, `impact`, `decisions` per study

### Task

Review each study's written content:

1. **Verify impact metrics** — cross-check `1.9×`, `−41%`, `62%`, etc. against actual analytics. If you can't verify, rephrase as directional (e.g. "~2×" or remove specific numbers).
2. **Update `role`** field if needed — currently "End-to-end design", "IA & visual system", "AI product design"
3. **Add/edit `decisions`** — these are the most portfolio-differentiating content. 3 decisions per study is the current count; 4 is fine if there's more to say.
4. **Update `meta` tags** — these show on hover. Should be scannable at a glance (e.g. "Shipped", "Mobile", "AI", "0→1").

### Copy Review Notes
- Notes: copy reads well. The "notebook, not a performance review" line is strong.
- Salary Pages: "answer-first hero" framing is the best part. Keep it.
- Quick Vibe Check: "four axes, not five stars" is the headline insight. Front-load it more.

---

## Phase 3: Optional Layout Improvements

These are additive improvements — do Phase 1 & 2 first.

### 3a. Add a Section Eyebrow/Intro
Currently the page goes straight from Hero to a massive "Notes" title with zero transition.

Add above the `<ul>` in `CaseStudies.tsx`:
```tsx
<div className="flex items-baseline justify-between mb-6 md:mb-8">
  <p className="eyebrow">Selected Work</p>
  <span className="eyebrow opacity-40">3 case studies</span>
</div>
```

### 3b. Hover Card — Real Image Aspect Ratio
The hover card is hardcoded to `aspect-[5/4]`. If preview images are 16:9, change to `aspect-[16/9]` for proper cropping. The `overflow-hidden` and `object-cover` handle cropping either way.

### 3c. Modal — Cover Image Background Color
The cover image area uses `bg-black` implicitly via `shadow-xl`. If screenshots have white/light backgrounds, consider:
```tsx
// In CaseStudyModal.tsx line 81
<div className="rounded-[16px] overflow-hidden mb-20 aspect-[16/9] shadow-xl bg-[#f0efeb]">
```
This prevents the jarring white-flash during image load.

### 3d. Add a 4th Case Study (Optional)
The `studies` array in `CaseStudies.tsx` accepts any number of entries. The interaction design scales automatically. If there's a 4th strong project (perhaps something from Draup or Roamhome from the About client list), follow the same `Study` type shape.

---

## Phase 4: Verification Checklist

Run through this after all phases are complete:

**Visual**
- [ ] Hover each of the 3 study titles — preview card appears with correct real image, correct tilt
- [ ] Click each study — modal opens with correct cover, title, labels
- [ ] Scroll entire modal for each study — no Unsplash images remain
- [ ] Check on mobile viewport (375px) — modal is scrollable, no overflow

**Content**
- [ ] All impact metrics are either verified or rephrased
- [ ] No placeholder text (e.g. no leftover "Lorem ipsum" or generic descriptions)
- [ ] Email in modal footer (`anmolmaggon40@gmail.com`) is correct ✅ (already correct)

**Performance**
- [ ] All images load under 3s on a typical connection (check Network tab)
- [ ] WebP format used where possible
- [ ] No images above 500KB for preview/shots; cover can be up to 800KB

**Accessibility**
- [ ] All `alt` text on images is descriptive (currently uses `caption` string — good)
- [ ] Modal closes on Escape key ✅ (already implemented)
- [ ] Modal closes on backdrop click ✅ (already implemented)

---

## Anti-Patterns to Avoid

- Do NOT put images in `src/imports/` unless they are used via JS `import` statements — for case study assets, `public/` is cleaner
- Do NOT change the `CaseStudyDetail` type shape — the modal and list both depend on it
- Do NOT remove the `tilt` values from studies — they're part of the hover card visual identity
- Do NOT use absolute Unsplash URLs in production — they can change, go 404, or be rate-limited
- Do NOT compress cover images below 60% quality — they display full-bleed at high DPI

---

## File Reference Map

| File | Purpose | Key lines |
|---|---|---|
| `src/app/components/CaseStudies.tsx` | List view + all study data | `studies[]` array lines 10–140 |
| `src/app/components/CaseStudyModal.tsx` | Modal layout | `shots` grid lines 111–124, cover lines 81–83 |
| `src/app/components/figma/ImageWithFallback.tsx` | Image component with error fallback | Full file (28 lines) |
| `public/case-studies/` | Where real assets should live | Create this directory |
