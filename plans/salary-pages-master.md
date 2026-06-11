# Case Study Master: Salary Revamp  *(headline TBD — see portfolio cut)*

> SOURCE OF TRUTH. Filled from Antigravity codebase extraction + [NEED FROM YOU] gaps.
> Slug stays `salary-pages` (internal — decoupled from the display headline).

---

## TL;DR  *(one sentence)*
Turned a flat company-average salary database into a negotiation engine — decoupling gross CTC into the levers people actually negotiate with (take-home, fixed/variable split, experience scaling, competitor benchmarks), while aggressively hiding any data too statistically noisy to trust.

## Meta
- Client / Product: AmbitionBox · Salaries
- Year: `[NEED FROM YOU — existing site says 2024]`
- Status: Shipped
- Live URL or Figma link: `[NEED FROM YOU]`
- Tags: Information Architecture · Data Viz · Shipped

## What I Owned  *(critical — interviewers always ask)*
- What I personally drove end-to-end: `[NEED FROM YOU — IA of the deep-dive route? the negotiation widget system? the gating logic?]`
- What I led but shared: `[NEED FROM YOU — data integrity rules with data/analytics; build with eng]`
- What others owned: `[NEED FROM YOU — eng, data science, PM]`
- The single thing I'm proudest of: `[NEED FROM YOU — candidate: "data integrity over feature density" — hiding data to protect trust]`

---

## The Before State  *(factual — what existed)*
A salary page that showed flat, company-wide averages — a single gross CTC number for a broad role like "Engineer." Statistically noisy, not segmented by designation, experience, or pay structure. No take-home estimate, no fixed/variable breakdown, no competitor benchmarking, no career-path data.

## The Problem  *(emotional — what it felt like)*
People arrived at salary pages at the highest-stakes moments of their working life — a live offer, an appraisal, a career pivot. They needed ammunition for a negotiation and got a vanity number instead. A gross CTC for a generic "Engineer" couldn't tell them what they'd actually take home each month, how much of their pay was hostage to variable bonuses, or whether they were being lowballed for their specific 3-year tenure. They left no better armed than they arrived.

## Context & Constraints
- Business context: `[NEED FROM YOU — registration/acquisition goal? engagement? SEO traffic to salary pages?]`
- Technical constraints: Two distinct routes (broad company `/salaries/company/` and deep-dive `/salaries/companyDesig/`); 10+ specialized negotiation widgets; route-driven filter state; crowd-sourced data of variable quality.
- Timeline / resources: `[NEED FROM YOU]`
- Things you couldn't change: SEO-critical routes (huge organic traffic); reliance on user-contributed salary data (variable sample sizes); login/acquisition mandate.
- Redesign-from-scratch vs. work-around: New designation deep-dive + negotiation widget ecosystem built fresh; had to live inside existing salary routing, ad slots, and the contribution data model.

---

## Product Thinking

### Core Job-to-be-Done
"Help me walk into a salary negotiation knowing exactly what I'm worth — my real take-home, my pay structure, and how I benchmark against the market for my specific role and tenure."
Success = the user enters an HR conversation armed with specific, defensible numbers.

### User Mental Model
Users arrive anxious and intent-heavy. They think in "what will I actually get paid?" (monthly cash), not "what's the gross CTC?" (an abstract annual figure). They distrust averages that feel too round or too broad. The design had to speak in liquidity and specificity, and prove its numbers are trustworthy.

### What I Chose NOT to Build  *(strongest signal)*
- **No deep insights on generic profiles.** A naive version renders career paths and experience charts for broad terms like "Manager." This product *suppresses* them until a department is applied — because averaging an IT Manager and an HR Manager produces a statistically useless number. Better to show nothing than to mislead a negotiation.
- **No gross-CTC-only view.** Deliberately declined to make the top-line annual number the hero. Built `MonthlyInHandCard` and `SalaryStructureCard` instead — gross CTC is vanity; monthly liquidity pays rent.
- **No hard paywall.** Chose progressive blur over a wall — render the full layout, blur only the numbers.

### Information Architecture
Two-route system:
- **Broad company route** — a searchable grid of generic profiles + department chips, designed as a *funnel* into specificity.
- **Deep-dive designation route** — data-dense single-role page. Desktop: 66% main column (insights, experience scaling, career paths, responsibilities) + 32% sticky sidebar (tools, benefits, interviews, cross-sell). Mobile: sidebar dissolves inline into the main feed.
The deep-dive opens with a `TopInsights` carousel — the executive summary (take-home, structure, benchmark, rating) compressed into one swipeable horizontal plane so mobile users get the critical levers without endless scroll.

### User Flows
- **Flow 1 — Negotiation prep (high intent):** Designation page → `MonthlyInHandCard` (real liquidity) → `FilterComparisonCard` (15% below industry) → `ExperienceInsights` (benchmark for exact tenure) → `TopPayingCard` (who pays more) → enters HR armed.
- **Flow 2 — Broad discovery (funnel):** Company page, generic "Engineer" → code detects `genericJobProfile=true`, suppresses deep insights, shows department chips → user picks "Software Engineering" → route specializes → full insight suite unlocks.
- **Flow 3 — Gated data (anonymous):** Anonymous user clicks an experience bucket → `useLoginModalSession` intercepts → caches intent in `SessionStorage` → login → exploration auto-resumes via `WidgetRestoreStateManager`.

---

## Key Decisions  *(long form)*

### Decision 1 — Data integrity over feature density
- Title: Data integrity over feature density
- The situation: Crowd-sourced data is noisy; small samples can show juniors out-earning seniors.
- What I did: `ExperienceInsights` only renders if average pay *monotonically increases* with tenure. If the curve breaks, the widget unmounts itself. Generic profiles suppress deep insights entirely.
- Why it was right: A user negotiating off bad data, then getting caught, destroys platform trust forever. Showing nothing beats showing a number you can't defend.
- The tradeoff I accepted: Less feature density / fewer populated widgets on thin-data roles.

### Decision 2 — Liquidity over vanity metrics
- Title: Liquidity over vanity metrics
- The situation: The industry default is to lead with gross annual CTC.
- What I did: Anchored the page with `MonthlyInHandCard` (post-tax monthly range) and `SalaryStructureCard` (fixed vs. variable split, with bespoke structural imagery).
- Why it was right: People negotiate and budget in monthly cash, not abstract annual gross. Speaking their real mental model makes the data actionable.
- The tradeoff I accepted: More computation/assumptions (tax estimates) and explanation surface.

### Decision 3 — Progressive gating via blur
- Title: Progressive friction, not paywall
- The situation: Acquisition mandate vs. bounce risk from hard walls.
- What I did: `lockEnabled` renders the full UI but swaps exact numbers for `SalaryUnlockBlur` SVGs — the user sees *exactly* which insight sits behind the blur.
- Why it was right: Showing the shape of the value you're missing creates far stronger login intent than a blank wall.
- The tradeoff I accepted: Some users feel teased; requires careful framing to avoid frustration.

### Decision 4 — Intent-preserving interruption
- Title: Friction that doesn't punish
- The situation: Login walls usually wipe the user's context and filters.
- What I did: Clicking a locked element caches the exact action in `SessionStorage`, summons login, then force-executes the cached action post-login via `WidgetRestoreStateManager`.
- Why it was right: Acquisition friction shouldn't make users rebuild their search — it resumes them exactly where they were.
- The tradeoff I accepted: Real engineering complexity in state restoration.

---

## Visual & Interaction Design  *(design as product statement)*
- **Color-coded semantic benchmarking** — `FilterComparisonCard` computes the delta and applies stark green/red ("higher"/"lower"). Anxious negotiators shouldn't do mental math; the color tells them instantly if they're being lowballed.
- **Dynamic structural imagery** — `SalaryStructureCard` loads bespoke graphics (`fixed-90.png`, `fixed-80.png`) by data instead of a dry pie chart, making the fixed/variable split instantly digestible.
- **Executive carousel** — compressing the top negotiation levers into one horizontal swipe respects mobile vertical fatigue.

---

## Impact

### Quantitative  *(ALL UNVERIFIED — confirm or cut)*
- `[VERIFY]%` increase in registration via progressive blur gating — *how measured?*
- `[VERIFY]%` shift in engagement to specific designation routes vs generic company pages — *how measured?*
- `[VERIFY]%` increase in Top Insights carousel interaction — *how measured?*
- `[VERIFY]%` drop in reported data inaccuracies (from integrity suppression) — *how measured?*

### Qualitative  *(use if numbers can't be backed)*
- `[NEED FROM YOU]` Adoption/reach: shipped across all company + designation salary routes.
- `[NEED FROM YOU]` Recognition / second-order: did the data-integrity pattern or blur-gating become reusable across the platform?

---

## Process  *(the invisible work)*
- `[NEED FROM YOU]` Research: what revealed that users wanted liquidity over gross CTC? (interviews, support tickets, search behavior?)
- `[NEED FROM YOU]` Iterations: how did the two-route (broad → specific) funnel emerge?
- `[NEED FROM YOU]` The pivot: when did "database → negotiation engine" click?

## Collaborators
`[NEED FROM YOU]` — PM, eng, data science, research.

## What I'd Do Differently
`[NEED FROM YOU]` — 1–2 honest sentences.

---

## Interview Prep
- "What was *your* specific contribution?" → `[NEED FROM YOU]`
- "What was the hardest tradeoff?" → Candidate: suppressing data (feature density) to protect trust — saying no to showing more.
- "What would you change?" → `[NEED FROM YOU]`
- "How did you measure success?" → `[NEED FROM YOU — tie to the 4 metrics once verified]`
- "What did you cut, and why?" → Deep insights on generic profiles, gross-CTC-as-hero, hard paywall — all for trust + actionability.

---

## → Distilling to the Portfolio Cut
- **Problem** → The Problem paragraph above.
- **Approach** → "Shifted from salary database to negotiation engine: decoupled flat averages into take-home, fixed/variable, experience-scaled benchmarks; aggressively hid noisy data."
- **3 Decisions** → Data integrity over feature density · Liquidity over vanity metrics · Progressive gating via blur. (Intent-preserving friction overlaps with Quick Vibe Check's "contextual intent gating" — vary the wording or swap for it here.)
- **Before/After** → old flat-average page vs new deep-dive — SAME crop.
- **Screens** → TopInsights carousel · generic-suppressed vs specific-unlocked · the blur-gating state.
