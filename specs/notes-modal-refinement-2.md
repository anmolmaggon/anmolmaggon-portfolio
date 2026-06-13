# Notes Case Study Modal — Refinement Pass 2

## Objective

Second polish pass on the Notes case-study modal, fixing four reviewed problems: the Context block reads oddly before the hero image; the composer screenshot undersells the six expressive things a user can do in the composer; decision 02 misses that pseudonymity is AmbitionBox's core platform primitive; and the page ending (Early signal → footer) is visually chaotic — five stacked systems with no hierarchy. The ending is rebuilt around one idea: "Beyond the design" becomes the hero closer with a centered contact pitch, and the sticky footer hands off to a slim Previous/Next bar at the very bottom.

## Requirements

1. **Context becomes a boxed aside after the hero.** Move the Context block to directly *after* the cover image (it currently sits before it). Render it as a hairline-bordered box (`border border-black/15`, no fill, sharp corners) with the label **"For context"** inside (existing 13px uppercase eyebrow style) and the context copy at slightly smaller reading size than body sections. It should read as a program-note aside, distinct from the Problem → Approach story flow.

2. **Composer capabilities grid, built in code, replaces the composer image.** The `approachShot` figure (screen-hero.svg) after Approach is replaced by a section with eyebrow **"The composer"** containing a **2-column × 3-row grid** (1 column below `md`) of six coded vignette tiles — no image assets:
   - Tiles: **Add a thought · GIF / Image · Music · Sticker · Fonts · Colors** (thought tile first).
   - Each tile = a mini sticky-note canvas rendered in code demonstrating that one capability (e.g. a note with a music chip, a note mid-color-swap), plus a small 13px uppercase label.
   - Chrome stays monochrome; color is allowed *inside* the note canvases (color-as-story).
   - Each tile gets a subtle hover delight (e.g. the vignette animates or lifts) consistent with the site's interaction language.

3. **Decision 02 names the platform primitive.** Extend "Identity fits the moment" detail with one line establishing that pseudonymous identity is AmbitionBox Communities' core primitive — Notes inherits an identity system users already trust rather than inventing a new one. (Draft: "Pseudonymity is already the platform's core primitive – Notes doesn't ask users to trust something new, it lets them wear it more flexibly.")

4. **Early signal is removed entirely.** The section, its data field usage for Notes, and the quote do not render anywhere.

5. **"What we're watching" stays in place but gets a quieter form.** It remains above the Beyond-the-design closer. Delete the caption ("The needles launch must move – reviewed at 90 days."). Replace the four display-size stat blocks (giant ↑ glyphs) with a compact ledger list: each metric as its own hairline-ruled row — small ↑ inline before serif text at modest size (~clamp(18px, 2vw, 26px)) — with stickiness written as "Stickiness (DAU/MAU)". No display-scale value slots. *(Form is the builder's draft per interview; Anmol may wordsmith.)*

6. **"Beyond the design" becomes the hero ending with a centered pitch.** It is the final content section of the page. Keep the warm gradient band and the serif questions, then end with a **center-aligned** pitch block: the email CTA (`mailto:anmolmaggon40@gmail.com`) with the "Each of these has an answer" framing, plus the LinkedIn and Instagram icons — all centered. The current left-aligned CTA line is replaced by this centered pitch.

7. **Sticky footer hands off to a slim Prev/Next bar at page end.**
   - The Previous/Next navigation is rebuilt as a **slim bar** at the very bottom of the scroll content, similar in height to the sticky footer bar (~60-80px): "← Quick Vibe Check" left, "The Number That Matters →" right, single-line serif at bar scale, with eyebrow-less compact labels or none.
   - When the user reaches the bottom (the bar enters the viewport), the **sticky footer hides** (fade/slide out); scrolling back up brings it back. The two never show stacked at the bottom.
   - The current large two-panel prev/next grid is removed.
   - The sticky footer itself (email + socials) is otherwise unchanged during mid-page scrolling.

### Out of scope (for now)

- Replacing the remaining placeholder SVGs (cover, viewer, reaction shots).
- Any redesign of the sticky footer's mid-scroll appearance.
- Changes to the other two case studies' content (they must merely keep working).

## Edge cases

- **Studies without `beyondDesign`** (Salary, Vibe Check): no hero closer renders, but the sticky-footer → prev/next-bar handoff still works (it is tied to reaching the page end, not to the Beyond section).
- **Mobile (~375px):** composer grid collapses to 1 column; the centered pitch wraps and stays centered; the slim prev/next bar may grow to two stacked rows but remains non-sticky at the page end with no horizontal scroll.
- **Long prev/next titles** ("The Number That Matters"): in the slim bar, the title may truncate with ellipsis or wrap to a second line — it must never overlap the opposite side or break the bar layout.
- **Scroll bounce / re-entry:** repeatedly scrolling to the bottom and back must toggle the footer/bar handoff cleanly with no flicker or stuck states.
- **Watching rows on mobile:** four hairline rows stack full-width without overflow.

## Definition of done

1. In the Notes modal, Context appears *after* the cover image inside a hairline-bordered box labeled "For context"; nothing labeled Context renders above the cover.
2. After Approach there is a "The composer" section with six coded tiles in 2 columns on desktop / 1 on mobile, labeled Add a thought, GIF / Image, Music, Sticker, Fonts, Colors; `screen-hero.svg` is no longer rendered there (no `<img>` in the section).
3. Decision 02's detail mentions pseudonymity being the platform's existing core primitive.
4. The string "Early signal" (any casing) appears nowhere in the rendered Notes modal.
5. "What we're watching" shows four single-line ruled rows (↑ inline, modest serif, "Stickiness (DAU/MAU)"); the "needles launch must move" caption is gone; no display-size stat blocks remain in the section.
6. The last content section is Beyond the design, ending with a center-aligned pitch containing a working `mailto:` link and LinkedIn + Instagram icon links.
7. Scrolled to the very bottom: the sticky footer is hidden and a slim prev/next bar of comparable height sits at the page end; scrolling up ≥1 viewport brings the sticky footer back; repeating this 3× produces no flicker or stuck state.
8. The large two-panel prev/next grid no longer exists in the DOM.
9. Salary and Quick Vibe Check modals open without errors and exhibit the same footer→bar handoff.
10. At 375px: no horizontal scroll anywhere in the Notes modal; composer grid is single-column; pitch is centered.
11. `pnpm run build` passes with no TypeScript errors.

## Open questions

- Exact vignette art direction per composer tile (which colors/chips inside each mini note) — builder drafts in the site's existing visual language; Anmol reviews live.
- Whether the slim prev/next bar shows tiny "Previous/Next" eyebrows or just arrows + titles — builder may pick the cleaner option at bar height.
