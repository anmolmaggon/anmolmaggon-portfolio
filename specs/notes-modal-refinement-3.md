# Notes Case Study Modal — Refinement Pass 3

## Objective

Third polish pass, two themes: (1) the case-study modal sits on a different grid than the one-pager (deeper gutters inside a 1400px container vs `px-6 md:px-10` full-width), which reads as inconsistency when opening a study from the homepage — the modal adopts the one-pager grid everywhere; (2) the "Beyond the design" closer gets its final shape: a conversational eyebrow ("You're probably wondering"), a fifth privacy pill, center-aligned pills, and a generic lead line before the email CTA that doesn't explain the pill mechanics upfront.

## Requirements

1. **Modal adopts the one-pager grid.** The modal's content container changes from `px-5 sm:px-8 md:px-16 lg:px-24` + `max-w-[1400px] mx-auto` to the homepage's `px-6 md:px-10`, full-width (no max-width container). Every element that previously escaped/matched the old container must be updated in lockstep:
   - The closing band's negative margins and inner padding.
   - The slim prev/next bar's negative margins and inner padding (it no longer needs a `max-w-[1400px]` inner wrapper).
   - The sticky footer's inner padding (no `max-w-[1400px]`).
   - The bar's bottom-margin cancellation of the container's bottom padding stays correct.
   Internal text measure remains controlled by each block's own `max-w-*` classes (unchanged).
2. **Eyebrow copy:** "Beyond the design" → **"You're probably wondering"** (same 13px uppercase label style).
3. **Fifth pill added:** label "Can your employer trace you?", full question "Can your employer trace you on a pseudonymous platform?" — same mailto-draft behavior as the others. Final order: Moderation without names? · Kickstarting day one? · Teaching a new format? · Distribution? · Can your employer trace you?
4. **Pills are center-aligned** within the band (`justify-center` on the wrap row); they keep their current style, hover inversion, and drafted-email behavior.
5. **Lead copy before the email CTA** changes from "Each pill opens a drafted email – or start from a blank page:" to the generic **"Want the full walkthrough?"** (matching the sticky footer's voice). No copy explains the pill mechanics anywhere.

### Out of scope (for now)

- Any homepage/one-pager changes (the modal conforms to it, not vice versa).
- Pill copy changes beyond the added fifth pill.
- The composer grid, watching rows, ledger, snippet — untouched.

## Edge cases

- **Five pills centered on desktop** must wrap as a balanced centered cluster (e.g. 3 + 2), not a ragged left-then-center mix; on mobile (~375px) they stack centered with no horizontal scroll.
- **Wide screens (≥1600px):** with the max-width container gone, full-bleed elements (cover, black snippet, closing band, bars) span edge-to-edge gutters exactly like homepage sections; body text blocks stay readable via their own max-widths.
- **Alignment proof:** the modal's section labels, the slim bar titles, and the sticky footer text must share the same left x-coordinate as each other AND the same gutter values as the homepage work section (`px-6 md:px-10`).
- **Other studies** (Salary, Vibe Check) render correctly on the new grid with no Notes-only sections.

## Definition of done

1. At ~1500px viewport, the modal's content left edge measures 40px (md:px-10) from the viewport edge — same as the homepage work section; the slim bar title and sticky footer text measure the same 40px.
2. The closing band's eyebrow reads "You're probably wondering"; the string "Beyond the design" appears nowhere.
3. Five pills render in the specified order; the new pill's mailto href contains the encoded full question.
4. The pill row is visually centered (the wrap container's content is horizontally centered at desktop and mobile widths).
5. The lead line above the email reads "Want the full walkthrough?"; the "drafted email" copy string is gone.
6. At 375px: no horizontal scroll; pills stack centered.
7. Salary and Quick Vibe Check modals open without errors on the new grid.
8. `pnpm run build` passes with no TypeScript errors.

## Open questions

- None — all interview decisions resolved.
