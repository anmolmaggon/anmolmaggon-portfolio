# DESIGN.md — Gussa Portfolio Design System

> The single source of truth for how this site looks, moves, and feels.
> Read this before writing or changing any UI. Written to be used by humans **and** by LLMs/agents.
> Tokens live in code (`src/styles/`); this file gives them meaning, rules, and rationale.

**Site:** Anmol Maggon — Product Designer portfolio.
**Stack:** Vite 6 · React 18 · React Router 7 · Tailwind v4 · Motion (`motion/react`) · GSAP + Lenis · React-Three-Fiber/Three.
**Last grounded against code:** 2026-06-28.

---

## 0. How to use this document (for LLMs and agents)

1. **Obey the [Golden Rules](#1-golden-rules-non-negotiable) first.** They override convenience. If a request conflicts with them, surface the conflict instead of silently breaking the system.
2. **Use tokens, not magic numbers.** Every value you need already has a name in [`src/styles/tokens.css`](src/styles/tokens.css), [`src/styles/tailwind.css`](src/styles/tailwind.css), or [`src/styles/fonts.css`](src/styles/fonts.css). If you're about to type a raw hex, easing, or px value, check the token tables below first.
3. **Match the surrounding code.** This codebase uses Tailwind utility classes inline with occasional `style={{}}` for computed values. Don't introduce CSS-in-JS libraries, styled-components, or a new state manager.
4. **One breakpoint:** `md` (768px). Design mobile-first; layer desktop with `md:`.
5. **When unsure, ask for a screenshot or run the app.** Anmol iterates by *seeing* changes (see [Brand](#2-brand--principles)). Prefer showing a diff/preview over describing it.
6. **Definition of done:** every new UI passes the [Review Checklist](#12-review-checklist) at the bottom.

---

## Table of contents

1. [Golden Rules](#1-golden-rules-non-negotiable)
2. [Brand & Principles](#2-brand--principles)
3. [Color](#3-color)
4. [Typography](#4-typography)
5. [Spacing, Layout & Grid](#5-spacing-layout--grid)
6. [Motion](#6-motion)
7. [Elevation, Radius & Z-index](#7-elevation-radius--z-index)
8. [Components](#8-components)
9. [Core Patterns](#9-core-patterns)
10. [Accessibility & Performance](#10-accessibility--performance)
11. [Architecture & File Map](#11-architecture--file-map)
12. [Review Checklist](#12-review-checklist)
13. [How to extend the system](#13-how-to-extend-the-system)

---

## 1. Golden Rules (non-negotiable)

These are the load-bearing constraints. Everything else is detail.

| # | Rule | Why |
|---|------|-----|
| G1 | **Chrome is monochrome: ink on cream.** Nav, structure, body, labels, buttons — all `--ink` / `--paper` / opacity steps. No brand color in UI. | The whole site reads as a calm editorial object. |
| G2 | **Color appears only as *story*** — inside hover/delight moments (principle scenes, firefly jar, sticky note, modal "beyond the design" tint). Never as decorative UI. | Color is a payoff, not a default. See [§9.4](#94-color-as-story). |
| G3 | **Nyght Serif is the display face only** (headlines, statements, numerals, the wordmark). Everything readable/UI is the system `--font-sans`. | Premium, editorial voice without the cost of body serif. |
| G4 | **ALL-CAPS is reserved for section labels** (`FOR CONTEXT`, `THE PROBLEM`, `APPROACH`…). Metadata, credits, body = sentence case. | Casing carries meaning; don't dilute it. |
| G5 | **No *decorative* pills/chips.** The editorial language is the **hairline ledger** (`border-t` rules, serif values, zero-padded numerals). Pills are allowed **only when actionable** (they open a mail draft, filter, navigate). | Decoration-for-its-own-sake reads as "nobody cared." |
| G6 | **Every delight is bespoke and often cursor-attached** (native cursor hidden, a small world follows the pointer). Don't reach for a generic tooltip/animation when a moment deserves its own scene. | This is the signature. |
| G7 | **Respect `prefers-reduced-motion` everywhere.** Looping/parallax/cursor scenes must degrade to a static, legible state. | Non-negotiable a11y. |
| G8 | **The `shadcn`/Figma scaffold tokens in [`theme.css`](src/styles/theme.css) are legacy.** Don't build the portfolio's visual language on `--background`, `--primary`, `--chart-*`, `--sidebar-*`, oklch grays. Use the brand/ink/paper tokens. | They're vestigial from the import; extending them fractures the system. See [§3.4](#34-legacy-scaffold-tokens-do-not-extend). |
| G9 | **One source of truth per value.** Brand color & fluid type → `tailwind.css`; faces & type classes → `fonts.css`; everything else (motion, ink steps, elevation, z, layout, story palette) → `tokens.css`. Don't redefine a token in a component. | Scalability. |

---

## 2. Brand & Principles

**Voice:** quiet confidence, editorial, hand-made. The bar is *delight*, not adequacy — "blow people's minds," not "looks fine."

**The three pillars** (everything below serves these):

1. **Monochrome chrome + color-as-story.** The frame is ink-on-cream; color is earned inside moments.
2. **Editorial, not appy.** Hairline rules, serif numerals, generous measure, real typography. No dashboard chrome, no gratuitous cards, no rounded-pill soup.
3. **Bespoke, cursor-attached delight.** Each interactive idea gets its own physics and its own world.

**Working style (for collaborators, human or AI):** Anmol is a product designer who iterates by *seeing* live changes, edits copy/sizes in the editor in parallel (coordinate on shared files), and asks for opinions — give a reasoned recommendation **and** apply it so he can react. Hold the premium bar; if something is "fine but not premium," say so.

---

## 3. Color

### 3.1 The palette is two neutrals + opacity

The entire chrome is built from **cream**, **ink**, and steps of opacity. That's the system — internalize it.

| Utility | Value | Role |
|---------|-------|------|
| `bg-brand-light` | `#fafaf7` | Page & light sections, nav plate, modal bg |
| `bg-brand-dark` | `#06110f` | Dark sections, hero base, the "ink" |
| `bg-surface-black` | `#000000` | Loader, hero photo bed, mobile menu overlay |
| `bg-surface-night` | `#0c0b0d` | Closing-scene collage wall |
| `text-surface-graphite` | `#171613` | Near-black ink for About client names |
| `text-surface-loader` | `#f5f3ee` | Warm off-white wordmark on black |
| `var(--p-night-2)` | `#071018` | "Soul-world" gradient mid-stop (used in an inline gradient, not a utility) |

These are first-class Tailwind utilities (cream & ink own the canonical `brand-light`/`brand-dark`; the rest are added in `@theme`). Gradient stops that aren't single-color fills use the `--p-*` primitive directly, e.g. `var(--p-ink)`, `var(--p-night)`.

**Scrim & glass** (overlays — a *separate* concern from the ink scale): `bg-scrim` (black 40%, modal backdrop / image veil) · `bg-scrim-strong` (80%) · `bg-scrim-heavy` (95%, mobile menu) · `bg-glass` (white 15%, frosted chips/buttons — pair with `backdrop-blur-glass`).

### 3.2 Ink opacity scale (text & lines on cream)

This is a **real, in-use hierarchy** — use the role, never a raw `text-black/NN` guess.

The ink scale is **pure black at alpha** (byte-identical to the legacy `text-black/NN`). It is exposed as Tailwind utilities via `@theme` — use `text-…` for type, `border-…`/`ring-…`/`divide-…` for lines, `bg-…` for fills.

| Utility (text / border / bg) | Alpha | Use |
|------|-------|-----|
| `text-ink` | 100% | Titles, full-contrast headings |
| `…-ink-strong` | 85% | Metric labels, emphatic body |
| `…-ink-body` | 70% | Running body copy, subtitles, context |
| `…-ink-muted` | 55% | One-liners, supporting text |
| `…-ink-label` | 50% | ALL-CAPS section labels, eyebrows, captions |
| `…-ink-faint` | 35% | Struck "What I cut" chips, dormant list titles |
| `…-ink-ghost` | 25% | `·` separators, baseline (pre-hover) list titles |
| `border-hairline` | 12% | **Editorial rules**, card borders (the canonical rule) |
| `border-hairline-soft` | 8% | Softer dividers |
| `…-ink-wash` | 5% | Hover plate, skeleton bg |

On **dark** surfaces, mirror with the **paper** scale (pure white at alpha): `text-paper` (solid white) · `…-paper-strong` 90% · `…-paper-body` 70% · `…-paper-muted` 55% · `…-paper-faint` 40% · `border-paper-hairline` 10%.

> **Status (Tier-1 migration done).** The ink scale is migrated across all components — **103 sites** swapped to the role utilities above. Exact matches are byte-identical; ~6 off-scale near-misses were snapped to the nearest role (≤5% alpha). **Always use a role utility** for text/lines; reach for raw `black/NN` only for a deliberate one-off.
>
> **Not part of the ink scale (left raw, by design):** image/modal **scrims** (`bg-black/40–95`), translucent **glass** fills (`bg-white/NN`), and a few on-dark `text-white/NN` steps. These are an overlay concern, not type/line ink — a future `--scrim-*` / fuller `paper-*` pass can tokenize them.

### 3.3 Color-as-story palette

Color is **never** chrome. It only lives inside delight scenes, one palette per scene. Tokens in `tokens.css` under `--story-*`. Full behavior in [§9.4](#94-color-as-story).

| Scene | Signature hue(s) | Token |
|-------|------------------|-------|
| Unreasonable Hospitality (ButlerNote) | book-yellow `#ffe30b`, aura `#ffc934` | `--story-hospitality*` |
| Sticky note FAB | `#fff59d` | `--story-sticky` |
| 一期一会 scroll (ScrollCursor) | wood `#c39a63→#6f5230`, paper `#f6eed9`, plum `#c0445a` | `--story-ichigo-*` |
| Sakura petals | pink `#fcd6e6→#ec99b8` | `--story-sakura` |
| Be a Goldfish | body `#f9c06a→#e0613a`, water `#3c8a9c` | `--story-goldfish*` |
| Tech-stack fireflies | warm glow `#ffe8a1` + per-tool accents | `--story-firefly-glow` |
| Modal "beyond the design" | lavender→blue, very low alpha | `--story-modal-lavender/blue` |

> **Modal tint rule:** in the case-study modal, prefer **cool** tints (lavender → blue, low alpha) drawn from the cover art. **Avoid warm yellow gradient washes** as section backdrops there.

### 3.4 Legacy scaffold tokens (do not extend)

[`theme.css`](src/styles/theme.css) ships a full **shadcn/Figma scaffold**: `--background`, `--foreground`, `--primary #030213`, `--secondary`, `--muted`, `--destructive`, `--chart-1..5`, `--sidebar-*`, oklch grays, `--radius 0.625rem`, light/dark mode, plus base `h1–h4/label/button/input` sizing. **The portfolio does not use these for its design language.** They exist because the project was scaffolded from a Figma/shadcn export and remain only to support any `src/components/ui/*` primitives.

- ✅ Leave them for `ui/*` (Radix/shadcn) components if used.
- ❌ Do **not** style portfolio sections with `bg-background`, `text-primary`, `bg-muted`, `--chart-*`, etc.
- ❌ Do not add new colors here. New tokens go in `tokens.css`.

---

## 4. Typography

### 4.1 Faces

| Face | Stack / var | Use |
|------|-------------|-----|
| **Display** | `Nyght Serif` → `var(--font-serif)`; in JSX: `font-[Nyght_Serif]` | Headlines, statements, the wordmark, numerals, decision titles |
| **Reading/UI** | `var(--font-sans)` (system stack: `ui-sans-serif, system-ui, -apple-system…`) — the **default** on `html, body` | All body, labels, metadata, buttons, chips |

Nyght Serif is self-hosted (`src/styles/fonts/`) at weights **300 / 400 / 500**, normal + italic. Global feature settings: `"ss01", "liga"`.

> **Italics are globally disabled** via `* { font-style: normal !important; }` in [`fonts.css`](src/styles/fonts.css). Adding `italic` will have **no visual effect** today. To re-enable, delete that one block — don't fight it per-component.

### 4.2 Font size — fluid display scale (`--text-fluid-*` tokens, in `tailwind.css`)

Font sizes are **tokens** in Tailwind's `--text-*` namespace (not hand-written `@utility` blocks) — same model as every other token. Use these; don't hand-roll `clamp()` or fixed `text-[NNpx]` for headings.

| Utility | `clamp(min, vw, max)` | Typical use |
|---------|----------------------|-------------|
| `text-fluid-massive` | `clamp(48px, 8vw, 128px)` | Modal hero title |
| `text-fluid-hero` | `clamp(40px, 8.5vw, 72px)` | Home hero headline |
| `text-fluid-h1` | `clamp(36px, 6vw, 96px)` | Section megatitles |
| `text-fluid-h2` | `clamp(34px, 3.8vw, 64px)` | Section titles |
| `text-fluid-h3` | `clamp(24px, 2.5vw, 36px)` | Sub-headers, client names |
| `text-fluid-h4` | `clamp(20px, 2.4vw, 34px)` | Approach/problem body |
| `text-fluid-h5` | `clamp(18px, 2vw, 26px)` | Watching metrics |
| `text-fluid-body` | `clamp(15px, 1.2vw, 19px)` | Body |
| `text-fluid-body-sm` | `clamp(15px, 1.1vw, 17px)` | Dense body, captions |

### 4.2b Font size — fixed UI-text scale (`--text-*` tokens)

The non-fluid chrome/label sizes. Use these instead of `text-[13px]` etc. (12/14/16/18 also exist as Tailwind defaults `text-xs/sm/base/lg`; these name the off-grid sizes the site actually uses).

| Utility | Value | Use |
|---------|-------|-----|
| `text-micro` | 11px | smallest labels / legal |
| `text-caption` | 12px | captions, fine print |
| `text-label` | 13px | **THE** section-label & meta size (most common) |
| `text-meta` | 14px | nav + footer links, metadata rows |

### 4.3 Semantic type classes (in `fonts.css`)

| Class | Spec | Use |
|-------|------|-----|
| `.display` | 300, tracking −0.02em | Light display headlines |
| `.display-italic` | 300 italic, −0.015em | (italic currently disabled) |
| `.eyebrow` | Nyght Serif, 500 italic, 0.04em, 13px | Small serif eyebrow labels |
| `.label` | 500, 0.02em | UI labels |
| `.body` | 400 | Body copy |
| `.numeral` | 500, `tnum` | Numerals/figures (ledger row numbers) |

### 4.4 Tracking & leading tokens

Letter-spacing and line-height are tokenized (exposed via `@theme` → `tracking-*` / `leading-*` utilities). Weights are Tailwind defaults: `font-light` 300 (display), `font-normal` 400 (body), `font-medium` 500 (labels).

| `tracking-*` | Value | Use | `leading-*` | Value | Use |
|-----------|-------|-----|----------|-------|-----|
| `tracking-display-tight` | −0.025em | largest titles | `leading-display` | 1.0 | big serif headlines |
| `tracking-display` | −0.02em | display headlines | `leading-tight` | 1.2 | sub-heads, decisions |
| `tracking-snug` | −0.01em | sub-heads, names | `leading-body` | 1.6 | running body |
| `tracking-label` | 0.04em | eyebrows | `leading-loose` | 1.9 | code block |
| `tracking-caps` | 0.14em | micro ALL-CAPS | | | |

### 4.5 Typesetting rules

- **Headlines:** Nyght Serif, weight 300–400, **tight tracking** (`tracking-display`), tight leading (`leading-display`). Big and quiet.
- **Section labels:** ALL-CAPS, `font-sans font-medium text-label tracking-wider` at `text-ink-label`. This is the *only* ALL-CAPS in the system.
- **Metadata / credits:** sentence case, `·`-separated (`Product Designer · 2026 · Shipped`), at `text-ink-label`/`text-ink-muted`.
- **Numerals in ledgers:** zero-padded (`String(i+1).padStart(2,"0")`), `.numeral`, `text-ink-ghost`.
- **No widows.** Wrapping is handled globally in [`globals.css`](src/styles/globals.css): the root sets `text-wrap: pretty` (both longhands inherit, so *every* text block — divs included — avoids a lone last-word) and headings/`.display` add `text-wrap: balance` for even lines. Don't hand-set `&nbsp;`/`<br>` to fix widows; reserve those for *deliberate* breaks (the hero headline, the "Nothing changes" shake).
- Don't mix more than display-serif + system-sans. No third face.

---

## 5. Spacing, Layout & Grid

### 5.1 Section frame (the default container)

Named **spacing utilities** drive the section rhythm (the numeric Tailwind scale stays the default for everything else). Use these for section gutters/rhythm, not raw `px-6`:

```tsx
<section className="px-gutter md:px-gutter-lg py-section md:py-section-lg">
  {/* content */}
</section>
```

| Utility | Token | Value | = legacy |
|---------|-------|-------|----------|
| `px-gutter` / `px-gutter-lg` | `--spacing-gutter(-lg)` | 1.5rem / 2.5rem | `px-6` / `px-10` |
| `py-section` / `py-section-lg` | `--spacing-section(-lg)` | 6rem / 10rem | `py-24` / `py-40` |
| `max-w-reading` | `--container-reading` | 48rem | `max-w-3xl` |
| `max-w-4xl` / `max-w-5xl` | (Tailwind) | 56 / 64rem | reading-measure / hero |
| `max-w-page` | `--container-page` | 105rem | page wrapper |
| `aspect-card` | `--aspect-card` | 4 / 5 | preview cards |

Named spacing generates the full set (`p-gutter`, `gap-gutter`, `m-section`, …). Case-study list uses an asymmetric variant: `px-gutter md:px-gutter-lg pt-16 md:pt-24 pb-12 md:pb-16`.

### 5.2 The 12-column editorial grid

Long-form layouts (case-study modal, About, ClosingScene collage) use a **12-column grid**. Canonical label/content split:

```tsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10">
  <div className="md:col-span-3">{/* ALL-CAPS label */}</div>
  <div className="md:col-span-9">{/* serif/body content */}</div>
</div>
```

The modal "design decisions" ledger uses `col-span-2/1` (number) · `col-span-10/5` (title) · `col-span-12/6` (detail).

### 5.3 Responsive doctrine

- **Mobile-first.** Base styles target phones; `md:` adds desktop.
- **One breakpoint** (`md` = 768px). Avoid `sm/lg/xl/2xl` unless a specific layout truly needs it — extra breakpoints fragment the system.
- **Dual rendering** is intentional for complex modules: a `hidden md:block` desktop tree + a `md:hidden` mobile tree (see [§9.1](#91-dual-desktoptablet--mobile-rendering)). Keep them in sync.
- Heights use `svh`/`dvh` (`h-[100svh]`, `h-[100dvh]`) to dodge mobile browser-chrome jumps.

### 5.4 Mobile + Desktop authoring rules

The site is **one responsive system, not two designs.** Follow these and new work matches automatically — no explanation needed:

- **Mobile-first.** Write the phone layout as the base; add desktop with `md:` only — `text-meta md:text-lg`, `px-gutter md:px-gutter-lg`, `py-section md:py-section-lg`.
- **One breakpoint: `md` (768px).** Don't reach for `sm/lg/xl/2xl` unless a layout genuinely needs it — every extra breakpoint is maintenance in two more places.
- **Same token, two steps.** Responsive = one token stepped up (`gap-4 md:gap-10`), **never** a token on desktop and a magic number on mobile.
- **Type → fluid tokens.** Prefer `text-fluid-*` (auto-scales by viewport) for headings/body over per-breakpoint fixed sizes; use fixed `text-label/meta/base/lg` for chrome.
- **Spacing → named rhythm + numeric scale.** Section frames use `px-gutter md:px-gutter-lg py-section md:py-section-lg`; inside, the numeric scale (`gap-2`, `p-4`).
- **Complex modules render twice** (`hidden md:block` + `md:hidden`) — keep both trees in content-sync ([§9.1](#91-dual-desktoptablet--mobile-rendering)). Deliberate, not duplication to delete.
- **Touch ≠ hover.** Gate hover-only delight behind `matchMedia("(hover: hover) and (pointer: fine)")`; give touch a tap-toggle + centered fallback ([§9.2](#92-bespoke-cursor-attached-delight)).
- **Heights:** `h-[100svh]`/`h-[100dvh]`, never `100vh`.
- **Tap targets ≥ 44px** on mobile; don't shrink interactive padding below the scale.
- **No raw values.** Color/size/spacing come from tokens — **enforced by `pnpm check:tokens`** ([§14](#14-enforcement--pnpm-checktokens)). If you typed a `#hex`, `text-[15px]`, or `gap-[…]`, you skipped the system.

---

## 6. Motion

Motion is the soul of this site. It is **slow, soft, and confident** — never bouncy or fast-twitch.

### 6.1 Easing

| Utility / token | Curve | Use |
|-----------------|-------|-----|
| `ease-quint` (`--ease-quint`) | `cubic-bezier(0.16, 1, 0.3, 1)` | **SIGNATURE.** Entrances, reveals, nav fades, section invert. In Motion JS: `ease: [0.16, 1, 0.3, 1]`. |
| `ease-out` (`--ease-out`) | `cubic-bezier(0, 0, 0.2, 1)` | Hover scale/opacity |
| `ease-soft` (`--ease-soft`) | `cubic-bezier(0.4, 0, 0.2, 1)` | Loops, scroll-reveal header/footer |

### 6.2 Duration

| Token | Value | Use |
|-------|-------|-----|
| `--dur-micro` | 150ms | Tiny color/opacity nudges |
| `--dur-drawer` | 250ms | Mobile drawer, note pop-in |
| `--dur-hover` | 300ms | **Workhorse** — underline, chip, hover color |
| `--dur-state` | 500ms | **Workhorse** — reveal, content shift, preview card, nav fade |
| `--dur-image` | 900ms | Slow image/poster scale on hover |
| `--dur-entrance` | 1200ms | Hero name + headline first paint |
| `--dur-invert` | 280ms | "Nothing changes" section invert |

CSS usage: `ease-quint duration-[var(--dur-state)]` (easing is a real utility; durations use the var) or `style={{ transition: "filter var(--dur-invert) var(--ease-quint)" }}`.

### 6.3 Spring physics (cursor-attached scenes)

Cursor followers use Motion's `useSpring` on `useMotionValue`s, **portaled to `document.body`**. Two canonical configs:

```ts
// deliberate follow (ButlerNote, ScrollCursor)
useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 })
// snappy follow (SunCursor)
useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 })
```

R3F fireflies interpolate hover with `THREE.MathUtils.damp(current, target, 4, delta)`.

### 6.4 Smooth scroll

Global smooth scroll is **Lenis** (`SmoothScroll.tsx`), synced to the **GSAP** ticker (`ScrollTrigger.update`), `lagSmoothing(0)`.

- Lenis config: `duration: 1.15`, easing `t => Math.min(1, 1.001 - 2**(-10*t))`, `smoothWheel: true`.
- Anchor offsets per section via `NAV_OFFSETS` (`#work: 30`, `#off-the-clock: 100`).
- **Disabled under `prefers-reduced-motion`** → native `scrollTo({behavior:"smooth"})`.
- Lenis CSS contract lives in [`globals.css`](src/styles/globals.css) (`html.lenis`, `[data-lenis-prevent]`, `.lenis-stopped`). `overflow-anchor: none` is set deliberately — don't remove it (prevents mobile scroll-jump when lazy sections settle).

### 6.5 Motion rules

- **DO** use `ease-quint` for anything that enters or reveals.
- **DO** stagger list entrances (`delay: base + i * 0.05`).
- **DON'T** use spring overshoot/bounce on UI. Springs are for *cursor-attached objects*, not buttons.
- **DON'T** animate faster than `--dur-hover` for anything the eye should register.
- **ALWAYS** gate loops/parallax/cursor scenes behind `useReducedMotion()`.

---

## 7. Elevation, Radius & Z-index

### 7.1 Elevation (shadows) — light and premium, never heavy

| Utility / token | Value | Use |
|-----------------|-------|-----|
| `shadow-card` | `0 4px 24px rgba(0,0,0,.02)` | Resting cards |
| `shadow-card-hover` | `0 8px 32px rgba(0,0,0,.04)` | Card hover lift |
| `shadow-2xl` (Tailwind) | `≈ 0 25px 50px -12px rgba(0,0,0,.25)` | Tilted hover preview card |
| `shadow-float` | `0 34px 70px -24px rgba(0,0,0,.40), 0 2px 10px rgba(0,0,0,.08)` | Cursor-attached note |
| `--glow-warm` (inline `textShadow`) | warm triple text-shadow | Hero headline + closing pitch **only** (story) |
| `--glow-divider` / `--glow-rim` (inline) | dark / light single glow | Slider handle · light rim |

**Blur** (frosted chrome): `backdrop-blur-glass` (`--blur-glass` 12px — nav plate, reveal header, chips) · `backdrop-blur-soft` (`--blur-soft` 4px).

### 7.2 Radius

| Utility / token | Value | Use |
|-----------------|-------|-----|
| `rounded-control` (`--radius-control`) | 2px | **Actionable** chips, CTA buttons, `Label` tags |
| `rounded-card` (`--radius-card`) | 1rem (16px) | Impact stat cards |
| `rounded-media` (`--radius-media`) | 24px | *Reserved* — modal media is now **square** (see below); token kept for future soft-media use |
| `rounded-full` (Tailwind) | circle | **Icon** controls only — close, mute, play, FAB |
| `rounded-[var(--radius-scaffold)]` | 0.625rem | Legacy shadcn only |

**Radius encodes role** — a deliberate scale, not decoration: **0** chrome/ledger → **2px** actions (`rounded-control`) → **16px** content cards (`rounded-card`, e.g. impact stats) → **circle** icon controls. Actions are kept *crisp* so they belong to the sharp editorial field rather than reading as web-app pills. **Modal media is square and flat** — cover, decision clips, and selected screens use `rounded-none` with **no drop shadow** (a `bg-ink-wash` frame carries it; tall/portrait clips are `object-contain`, letterboxed). Heavy Tailwind shadows (`shadow-md`/`shadow-lg`) are **off-system** — the only sanctioned shadows are the feather-light `shadow-card*`/`shadow-float`. Editorial surfaces favor **square/hairline** over rounded.

### 7.3 Z-index ladder (use these, don't invent)

| Token | Value | Layer |
|-------|-------|-------|
| `--z-base` | 0 | Page flow |
| `--z-hero` | 20 | Hero stack |
| `--z-nav` | 50 | Fixed header |
| `--z-loader` | 100 | Boot loader |
| `--z-overlay` | 9999 | Modals, media viewer, reveal header/footer |

Cursor-attached delight is **portaled to `<body>`** and sits above everything by document order — keep that approach rather than competing with a higher z number.

---

## 8. Components

Catalog of reusable building blocks. Path is under `src/app/components/`. **Before building a new primitive, check this list — reuse first.**

### 8.1 Primitives

| Component | File | API / behavior | Notes |
|-----------|------|----------------|-------|
| **HoverLink** | `HoverLink.tsx` | `<a>` + animated underline (`after:` scale-x 0→1 from left, `--dur-hover`). Props = anchor attrs. | Default link treatment everywhere. |
| **SectionLabel** | `SectionLabel.tsx` | The all-caps editorial eyebrow (`text-label uppercase tracking-wider text-ink-label`). Write children sentence-case. `className` for `mb-*`/`text-center`. | The **only** ALL-CAPS (G4). Use for every section label. |
| **Pill** | `Pill.tsx` | Actionable chip/CTA. Polymorphic (`<a>` if `href`, else `<button>`; `as="span"` inside a card). `variant: outline\|solid`, `size: sm\|md\|lg`. Arrows passed as children. | ✅ actionable only (G5). The modal question-chips + "Know more" CTA. |
| **Label** | `Label.tsx` | Static pill `<span>`. `variant: dark\|light\|outline`, `size: sm\|md`. | Non-interactive tag; for actionable use **Pill**. |
| **ButtonCTA** | `ui/ButtonCTA.tsx` | "Let's Talk" CTA, `variant: dark\|light\|transparent`. | Opens `LETS_TALK_MAILTO`. |
| **CloseButton** | `CloseButton.tsx` | Circular ✕ for overlays. `tone: onLight\|onDark`, `iconSize`, `className` for position/size/z. | Modal + media viewer. |
| **VideoWithFallback** | `VideoWithFallback.tsx` | `<video>` + `animate-pulse` skeleton; IntersectionObserver (`rootMargin:100px`) plays in-view, pauses out. | Use for all autoplay video. |
| **BeforeAfterSlider** | `BeforeAfterSlider.tsx` | Native range input overlay; `clipPath inset`; `isMobileLayout` prop. Keyboard + touch accessible. | Reactive, no easing. |

**Hooks** (`app/hooks/`): `useRevealOnScroll(resetKey, threshold=100)` → `{ scrollRef, isScrolled, atEnd, onScroll }` — drives the case-study modal's reveal header/footer (header on `isScrolled`, footer on `isScrolled && !atEnd`); resets to top when `resetKey` changes.

### 8.2 Chrome

| Component | File | Notes |
|-----------|------|-------|
| **Nav** | `Nav.tsx` | Fixed (`z-50`), `px-6 md:px-10`. Appears after hero scroll; flips light/dark by sampling section at y=72px (`data-nav-theme`). Wordmark = italic Nyght Serif. Mobile = full-screen black drawer, staggered links. |
| **Loader** | `Loader.tsx` | Full-screen black boot; cream wordmark; indeterminate bar. Gates: `MIN 600 / GRACE 400 / MAX 8000ms`, waits for `hero:ready` + Nyght Serif load, `FADE 1400ms`. |
| **SmoothScroll** | `SmoothScroll.tsx` | Lenis + GSAP provider. See [§6.4](#64-smooth-scroll). |
| **GlobalAudio** | `GlobalAudio.tsx` | Hidden YouTube IFrame loop (`Wy1ryWrX9ac`); autoplay-after-interaction; fade in 500 / out 250ms; mute persisted to `localStorage["gussa_is_muted"]` via `GlobalContext`. |
| **MediaViewerModal** | `MediaViewerModal.tsx` | Global photo/video lightbox (`z-9999`), opened via `GlobalContext.openMediaViewer`; pauses background audio while open. |

### 8.3 Sections (composed, page order)

`Hero` → `CaseStudies` → `TechStackJar` → `OperatingPrinciples` → dark "soul-world" wrapper → `ClosingScene`. (`About.tsx` exists but is **not currently rendered**; the `#about` nav target is dormant.)

| Section | File | Signature |
|---------|------|-----------|
| **Hero** | `Hero.tsx` | `h-[100svh]` photo bed, dual scrim gradients, Nyght Serif headline w/ `--glow-warm`, 1.2s entrance. |
| **CaseStudies** | `CaseStudies.tsx` | Desktop list w/ tilted hover-preview cards; mobile ruled editorial cards. Drives `CaseStudyModal`. |
| **CaseStudyModal** | `CaseStudyModal.tsx` | The editorial ledger ([§9.3](#93-the-editorial-hairline-ledger)). Full-bleed `h-[100dvh]`. Data type `CaseStudyDetail`. |
| **TechStackJar** | `TechStackJar.tsx` | R3F firefly swarm of 16 tools; warm glow + per-tool accent; `overflow-hidden` root / `overflow-visible` jar. |
| **OperatingPrinciples** | `OperatingPrinciples.tsx` | 5 principles, each a bespoke hover scene; "Nothing changes" inverts the section ([§9.2](#92-bespoke-cursor-attached-delight)). |
| **StickyNote** | `StickyNote.tsx` | Yellow FAB → thought-collection note. |
| **ClosingScene** | `ClosingScene.tsx` | Collage wall (12-col desktop / film-strip mobile) that scrolls off to reveal a footer pitch. |

### 8.4 Principle scenes (`src/app/components/principles/`)

Bespoke delight, one world each. All gate `prefers-reduced-motion`; cursor types portal to `<body>` and hide the native cursor.

| Scene | Principle | Mechanic |
|-------|-----------|----------|
| `ButlerNote` | Unreasonable Hospitality | Yellow row wash + handwritten note follows cursor |
| `SunCursor` | Everything is energy | "Trust your energy" sticker follows cursor, bobs |
| `ScrollCursor` | 一期一会 | Hanging scroll with a **live, once-only timestamp** |
| `SakuraPetals` | 一期一会 (ambient) | Cherry petals drift down the row |
| `GoldfishLayer` | Be a Goldfish | A slice of water with goldfish mid-swim |

---

## 9. Core Patterns

Reusable *compositions* — the "how we build a thing" recipes.

### 9.1 Dual desktop/tablet ↔ mobile rendering

Complex modules render **two trees**, switched at `md`:

```tsx
<>
  <div className="hidden md:block">{/* desktop: hover previews, multi-col */}</div>
  <div className="md:hidden">{/* mobile: self-contained cards, snap scroll */}</div>
</>
```

Used by `CaseStudies` (hover-preview list vs. ruled cards) and `ClosingScene` (12-col collage vs. film strip). **Keep both trees in content-sync** when editing.

### 9.2 Bespoke cursor-attached delight

The signature interaction. Recipe:

1. Track the pointer: `window.addEventListener("mousemove", e => { x.set(e.clientX); y.set(e.clientY) })`.
2. Smooth with `useSpring` ([§6.3](#63-spring-physics-cursor-attached-scenes)).
3. **Portal the object to `document.body`** so it's viewport-fixed above all content.
4. Hide the native cursor on the host (`cursor: none`) when the object *replaces* the pointer.
5. Fade/scale in on activate (`opacity 0→1`, `scale .88/.9→1`, `--dur-hover` `--ease-out`).
6. **Touch fallback:** center the object on screen (`left:50%, top:50%`) and toggle on tap; gate hover behind `matchMedia("(hover: hover) and (pointer: fine)")`.
7. **Reduced motion:** freeze to a static, legible state.

Edge-masked gradients (`maskImage: linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)`) let row washes dissolve into the page.

The **section-invert** trick (OperatingPrinciples "Nothing changes"): animate `filter: invert(1)→0` over `--dur-invert` and set `document.documentElement.dataset.invert = "1"`; `globals.css` flips the fixed `header` to match so the whole frame changes state.

### 9.3 The editorial hairline ledger

The case-study modal's language — internalize it instead of inventing card layouts:

- **Section labels:** ALL-CAPS sans, 13px, `tracking-wider`, `text-ink-label`.
- **Rows:** `border-t border-hairline`, `last:border-b`, generous `py-8 md:py-12`. No box fills.
- **Numbers:** zero-padded `.numeral`, `text-ink-ghost`.
- **Titles/values:** Nyght Serif.
- **"What I cut":** big serif words, `line-through decoration-1`, `text-ink-faint` → hover `text-ink-muted`. No chips.
- **Metadata:** sentence case, `·`-separated, inside the title block as a right-aligned credit line — not a separate band.
- **Impact stats:** restrained grid; serif value, ALL-CAPS sans label; `shadow-card` → `shadow-card-hover` on `-translate-y-1`.

### 9.4 Color-as-story

- Chrome stays monochrome ([G1](#1-golden-rules-non-negotiable)). A scene may introduce **one** palette, scoped to its moment, then dissolve (edge masks, low alpha, fade-out).
- Alphas stay low for atmosphere (modal tint runs `0.05–0.12`).
- In the modal, **cool** tints (lavender→blue) over warm; pull hues from the cover art. **No warm-yellow section washes** there (the warm yellows belong to the principle/jar/sticky worlds, not the modal).
- Reserve `--glow-warm` for the hero headline and closing pitch — it's a signature, not a utility.

### 9.5 Reveal-on-scroll header/footer

Modal (and similar long surfaces) hide a compact header/footer (`-translate-y-full opacity-0`) and reveal past a scroll threshold (~100px) with `--dur-state ease-in-out`, `backdrop-blur-md`, `bg-[#fafaf7]/90`.

### 9.6 Contact / "Let's Talk"

**Single source of truth:** [`src/app/data/contact.ts`](src/app/data/contact.ts) exports `CONTACT_EMAIL` and `LETS_TALK_MAILTO` (pre-drafted subject + body). Every entry point (hero email icon, nav CTA, modal buttons, footer) imports it. **Change the draft once, there — never inline a new `mailto:`.** Social URLs are error-prone; verify against the canonical set before editing any social link.

---

## 10. Accessibility & Performance

- **Reduced motion:** `useReducedMotion()` (Motion) / `matchMedia("(prefers-reduced-motion: reduce)")` gates every loop, parallax, drift, and cursor scene; Lenis falls back to native smooth scroll. **Mandatory** ([G7](#1-golden-rules-non-negotiable)).
- **Keyboard/SR:** modals close on `Esc`; `BeforeAfterSlider` is a real range input; controls carry `aria-label`s; decorative glyphs use `aria-hidden`.
- **Video:** autoplay videos are `muted` + `playsInline`, lazy via IntersectionObserver, with a skeleton fallback (`VideoWithFallback`). Provide poster/fallback art.
- **Fonts:** Nyght Serif self-hosted, `font-display: swap`; loader waits on the face to avoid FOUT flash of the wordmark.
- **Scroll stability:** `overflow-anchor: none` is intentional — do not remove.
- **Images:** prefer `webp`; use `<picture>` with mobile/desktop sources for the hero; `object-cover`/`object-contain` deliberately.
- **Three.js:** deduped in `vite.config.ts`; keep R3F work inside `TechStackJar` and lazy-loaded.

---

## 11. Architecture & File Map

```
index.html                      ← meta, theme-color #06110f, #root
src/
  main.tsx                      ← BrowserRouter → App
  app/
    App.tsx                     ← GlobalProvider → SmoothScroll → Nav + Routes; Loader; Analytics
    context/GlobalContext.tsx   ← audio mute (localStorage), media viewer, hero-music registration
    components/                 ← see §8
      principles/               ← bespoke principle scenes (§8.4)
    data/
      contact.ts                ← contact + Let's-Talk draft (single source) §9.6
      experiments.ts            ← /experiments content
  styles/
    index.css                   ← import chain (order matters)
    fonts.css                   ← faces + .display/.eyebrow/… + italic kill-switch   ← TYPE TOKENS
    tailwind.css                ← @theme brand colors + text-fluid-* utilities        ← COLOR/TYPE TOKENS
    theme.css                   ← shadcn/Figma scaffold (LEGACY, §3.4)
    tokens.css                  ← motion, ink/paper, surfaces, elevation, radius,      ← EVERYTHING ELSE
                                  z-index, layout, story palette                       (single source)
    globals.css                 ← Lenis contract, keyframes, header-invert
    experiments.css             ← /experiments "lab notebook" styling (scoped)
DESIGN.md                       ← you are here
```

**Style import order** (`index.css`): `fonts → tailwind → theme → tokens → globals → experiments`. Keep `tokens` after `theme` and before `globals` (globals consumes tokens).

**Stack specifics:** path alias `@ → src`; `figma:asset/*` resolver in `vite.config.ts`; React/Three deduped. Tailwind **v4** (no `tailwind.config.js` — config is the `@theme` blocks in CSS). PostCSS is empty by design.

---

## 12. Review Checklist

Run this against any UI change before calling it done:

- [ ] **Chrome stays monochrome**; any color is scoped to a delight moment ([G1](#1-golden-rules-non-negotiable)/[G2](#1-golden-rules-non-negotiable)).
- [ ] **Display text is Nyght Serif; everything readable is system sans** ([G3](#1-golden-rules-non-negotiable)).
- [ ] **ALL-CAPS only on section labels**; metadata is sentence case ([G4](#1-golden-rules-non-negotiable)).
- [ ] **No decorative pills**; any pill is actionable; long-form uses the hairline ledger ([G5](#1-golden-rules-non-negotiable)).
- [ ] **Values come from tokens** (`tokens.css` / `tailwind.css` / `fonts.css`), not new magic numbers ([G9](#1-golden-rules-non-negotiable)).
- [ ] **Motion uses `ease-quint` + a named duration**; no UI bounce.
- [ ] **`prefers-reduced-motion` handled**; keyboard + `aria` covered ([G7](#1-golden-rules-non-negotiable)).
- [ ] **Mobile-first, single `md` breakpoint**; dual trees stay in sync.
- [ ] **No new dependency / state lib / styling system** introduced casually.
- [ ] **Didn't extend the legacy scaffold tokens** ([G8](#1-golden-rules-non-negotiable)).
- [ ] **Contact/social via `contact.ts`**, links verified ([§9.6](#96-contact--lets-talk)).
- [ ] It clears the **premium bar** — would this "blow people's minds," or merely pass?

---

## 13. How to extend the system

**Add a design token** → put it in [`tokens.css`](src/styles/tokens.css) under the right group with a one-line comment on where it's used; document it in the matching table here. Never redefine a value inline.

**Add a case study** → append a `CaseStudyDetail` object (`number, title, client, year, role, meta[], problem, approach, decisions[], impact[], shots[]`, optional `subtitle/context/whatICut/beforeAfter/watching/beyondDesign/coverVideo`) and a `Study` wrapper (`slug, image, previewVideo?, tilt, oneLiner?`). Reuse the ledger ([§9.3](#93-the-editorial-hairline-ledger)); pick a small distinct `tilt` (−6/+5/−4 so far).

**Add a principle / delight scene** → new component in `principles/`, follow the cursor-attached recipe ([§9.2](#92-bespoke-cursor-attached-delight)): one self-contained palette, portal to body, reduced-motion + touch fallbacks. Give it its *own* world; don't reuse another scene's look.

**Add a section** → start from the section frame ([§5.1](#51-section-frame-the-default-container)), wire its `id` for nav + a `NAV_OFFSETS` entry if needed, set `data-nav-theme` if dark, lazy-load it in `App.tsx`.

**Reconsider a Golden Rule** → that's a brand decision, not a code decision. Raise it explicitly with rationale and a visual; don't quietly erode it.

---

## 14. Enforcement (`pnpm check:tokens`)

The system **polices itself** so it stays clean without anyone re-explaining it. [`scripts/check-tokens.mjs`](scripts/check-tokens.mjs) scans `src/app` and **fails** if a component uses a raw value that should be a token:

- arbitrary hex/rgb **colors** (`text-[#…]`, `bg-[rgb…]`),
- arbitrary **font-sizes** (`text-[15px]`, `text-[clamp(…)]`),
- arbitrary **spacing** (`p-[…]`, `gap-[…]`, `mt-[…]`).

Bespoke-scene inline gradients/transforms aren't scanned (they legitimately can't be utilities). Genuine one-offs go in the script's `ALLOW` list **with a reason** — so exceptions are intentional and visible, never silent.

- **Run:** `pnpm check:tokens` (green today: *every value flows from the design system*).
- **Wire it where it bites:** a pre-commit hook or CI step, so new raw values are caught at the door.

> Coverage today: spacing ~100% (numeric scale + named tokens), color & font-size 100% on the main site (one documented icon-glyph exception). The remaining raw values are *intentional*: scene-local "color-as-story" palettes and inline gradients/transforms.

---

## Appendix A — Complete token index

Every token in the system, by category. **Owner files:** `tokens.css` (most), `tailwind.css` (brand + fluid type), `fonts.css` (faces + type classes), `theme.css` (legacy scaffold, do not extend).

**Layer 1 · Primitives** (`tokens.css :root`)
- Hues: `--p-black` #000 · `--p-white` #fff · `--p-cream`→brand-light · `--p-ink`→brand-dark · `--p-night` #0c0b0d · `--p-night-2` #071018 · `--p-graphite` #171613 · `--p-loader` #f5f3ee
- Durations: `--ms-150 / 250 / 280 / 300 / 500 / 900 / 1200`

**Layer 2 · Semantic, non-utility** (`tokens.css :root` — consume via `var()`)
- Duration roles: `--dur-micro / drawer / invert / hover / state / image / entrance`
- Z-index: `--z-base 0 / --z-hero 20 / --z-nav 50 / --z-loader 100 / --z-overlay 9999`
- Glows: `--glow-warm` · `--glow-divider` · `--glow-rim`
- Story (delight-only, primary hues): `--story-hospitality(+aura) / sticky / ichigo-rod / ichigo-paper / ichigo-plum / sakura / goldfish / goldfish-water / firefly-glow / modal-lavender / modal-blue`

**Layer 3 · Exposure → Tailwind utilities** (`tokens.css @theme`)
| Group | Tokens → utilities |
|-------|--------------------|
| Ink (text/line, black α) | `ink` `ink-strong` `ink-body` `ink-muted` `ink-label` `ink-faint` `ink-ghost` `hairline` `hairline-soft` `ink-wash` |
| Paper (on dark, white α) | `paper` `paper-strong` `paper-body` `paper-muted` `paper-faint` `paper-hairline` |
| Surfaces | `surface-black` `surface-night` `surface-graphite` `surface-loader` `surface-mist` |
| Scrim / glass | `scrim` `scrim-strong` `scrim-heavy` `glass` |
| Scene color · "Borrowed light" (TechStackJar) | `jar-ink` `jar-gold` `jar-glow` `jar-rim` — story palette, scoped to that one section |
| Easing | `ease-quint` `ease-out` `ease-soft` |
| Spacing (named) | `gutter` `gutter-lg` `section` `section-lg` (→ `px-/py-/gap-/m-…`) |
| Radius | `radius-control` (2px, actions) `radius-card` (16px) `radius-media` (24px) — + `rounded-full` for icon circles |
| Shadow | `shadow-card` `shadow-card-hover` `shadow-float` |
| Blur | `blur-glass` `blur-soft` |
| Tracking | `tracking-display-tight` `tracking-display` `tracking-snug` `tracking-label` `tracking-caps` |
| Leading | `leading-display` `leading-tight` `leading-body` `leading-loose` |
| Aspect | `aspect-card` (4/5) |
| Container | `container-reading` (48rem) `container-page` (105rem) → `max-w-*` |
| Font size · fluid (`tailwind.css`) | `text-fluid-massive / hero / hero-sm / h1 / h2 / h3 / h4 / h5 / body / body-sm` |
| Font size · fixed (`tailwind.css`) | `text-micro` 11 · `text-caption` 12 · `text-label` 13 · `text-meta` 14 (+ Tailwind `text-base` 16 / `text-lg` 18) |

**Owned elsewhere** — brand `brand-light` / `brand-dark` (`tailwind.css`, alongside the `--text-*` font-size tokens above); faces `--font-serif` / `--font-sans` + classes `.display .display-italic .eyebrow .label .body .numeral` (`fonts.css`); weights `font-light/normal/medium` (Tailwind defaults).

**Deliberately NOT tokenized** (local one-offs / state): scene gradient secondary stops (e.g. `#6f5230`, `#efe4c8`), one-image aspect ratios, animation-state `opacity-0/100`, and a few off-scale on-dark `text-white/NN` / `border-white/NN`. A value used once in one place stays a local constant.
