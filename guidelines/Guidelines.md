# Guidelines

The design system for this project lives in **[`/DESIGN.md`](../DESIGN.md)** — read it before
writing or changing any UI.

Quick map of where things are defined:

- **Golden Rules + full reference** → [`/DESIGN.md`](../DESIGN.md)
- **Design tokens (motion, ink/paper, surfaces, elevation, radius, z-index, layout, story palette)**
  → [`src/styles/tokens.css`](../src/styles/tokens.css)
- **Brand colors + fluid type scale** → [`src/styles/tailwind.css`](../src/styles/tailwind.css)
- **Type faces + semantic classes** → [`src/styles/fonts.css`](../src/styles/fonts.css)
- ⚠ `src/styles/theme.css` is the **legacy shadcn/Figma scaffold** — do not build the portfolio
  on it (see `DESIGN.md` §3.4).

The non-negotiables, in one breath: **monochrome ink-on-cream chrome, color only as story,
Nyght Serif for display only, ALL-CAPS for section labels only, no decorative pills (hairline
ledger instead), bespoke cursor-attached delight, always honor `prefers-reduced-motion`, and
use tokens — never magic numbers.**
