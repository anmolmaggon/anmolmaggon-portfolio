# Portfolio Cut: [Title]

> THE VERSION THAT SHIPS. Minimal, visual-forward, public.
> Everything here appears on the live site. Distilled from `case-study-master.md`.
> Rule of thumb: if it doesn't earn its place visually or in one sharp sentence, it lives in the master doc, not here.

---

## Meta
- Title:
- Client / Product:
- Year:
- Role: (one line — e.g. "End-to-end product design")
- Tags: (exactly 3, scannable — e.g. "Mobile · AI · Shipped")

## Problem  *(1 paragraph)*
The user's lived experience before this existed. Not the business ask.

## Approach  *(1 paragraph)*
The one insight or framing that unlocked the solution. The headline of your thinking.

## 3 Decisions  *(one sentence each — these are cards)*
1. **Title:** — detail (the tradeoff, in one line)
2. **Title:** — detail
3. **Title:** — detail

## Impact  *(up to 4 — drop or rephrase any you can't back)*
1. `value` — label
2. `value` — label
3. `value` — label
4. `value` — label

## Screens  *(visual is the point here)*
- **Hero (wide):** `/case-studies/[slug]/screen-hero.webp` — caption
- **Detail:** `/case-studies/[slug]/screen-detail-1.webp` — caption
- **Detail:** `/case-studies/[slug]/screen-detail-2.webp` — caption
- Cover (modal hero, 16:9): `/case-studies/[slug]/cover.webp`
- Preview (hover card, 5:4): `/case-studies/[slug]/preview.webp`

---

## → Paste into CaseStudies.tsx

```ts
{
  number: "0X",
  title: "",
  client: "",
  year: "",
  role: "",
  meta: ["", "", ""],
  image: "/case-studies/[slug]/preview.webp",   // hover card (5:4)
  cover: "/case-studies/[slug]/cover.webp",     // modal hero (16:9)
  tilt: -4,                                      // -8 to 8
  problem: "",
  approach: "",
  decisions: [
    { title: "", detail: "" },
    { title: "", detail: "" },
    { title: "", detail: "" },
  ],
  impact: [
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ],
  shots: [
    { src: "/case-studies/[slug]/screen-hero.webp", caption: "", wide: true },
    { src: "/case-studies/[slug]/screen-detail-1.webp", caption: "" },
    { src: "/case-studies/[slug]/screen-detail-2.webp", caption: "" },
  ],
}
```
