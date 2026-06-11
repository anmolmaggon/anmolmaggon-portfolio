# Case Study Master: Quick Vibe Check

> SOURCE OF TRUTH. Filled from Antigravity codebase extraction + [NEED FROM YOU] gaps.
> `[NEED FROM YOU]` = personal/non-code knowledge Antigravity couldn't know. Fill these in.

---

## TL;DR  *(one sentence)*
Turned a company-reviews page from an endless chronological feed into an AI-powered "insights engine" — so job seekers grasp a company's culture in seconds instead of reading 100+ reviews.

## Meta
- Client / Product: AmbitionBox · Company Reviews
- Year: `[NEED FROM YOU — existing site says 2025]`
- Status: Shipped
- Live URL or Figma link: `[NEED FROM YOU]`
- Tags: AI · Information Architecture · Shipped

## What I Owned  *(critical — interviewers always ask)*
- What I personally drove end-to-end: `[NEED FROM YOU — e.g. IA redesign, Vibe Check UX, review card system?]`
- What I led but shared: `[NEED FROM YOU — e.g. AI sentiment model behavior with data/ML team?]`
- What others owned: `[NEED FROM YOU — eng, ML, PM, research]`
- The single thing I'm proudest of: `[NEED FROM YOU — candidate: the "show the receipts" trust pattern]`

---

## The Before State  *(factual — what existed)*
The Company Reviews page was a chronological feed of long-form text reviews. Old review cards (pre-`ReviewCardV2`) allowed up to ~630 chars before truncation, carried nested comment threads, and "dislike" buttons. No aggregate sentiment surface — the only summary was a star rating.

## The Problem  *(emotional — what it felt like)*
Job seekers arrived with high-intent, specific questions — "What's the culture actually like? Is the leadership any good? Will I burn out?" — and were met with a wall of unstructured text. To answer their own question they had to read dozens of individual reviews and mentally average them. The cognitive load was exhausting, and many dropped off fatigued before reaching a confident decision.

## Context & Constraints
- Business context: `[NEED FROM YOU — what triggered the redesign? AI push? engagement/retention goal?]`
- Technical constraints: Existing review data at scale (thousands per company); AI summarization pipeline; B2B monetization rules (paid employer profiles control their brand narrative).
- Timeline / resources: `[NEED FROM YOU]`
- Things you couldn't change: B2B paid-profile narrative control (drove the `!isSubscribed` descope); existing review corpus.
- Redesign-from-scratch vs. work-around: New `ReviewCardV2` + AI Vibe Check built fresh; had to fit within the existing reviews route, filters, and sidebar widget ecosystem.

---

## Product Thinking

### Core Job-to-be-Done
"Help me instantly understand the consensus on a company's culture and work environment, without manually reading and mentally averaging 100+ individual reviews."
Success for the user = a confident read on the company in seconds, with the ability to verify.

### User Mental Model
Users arrive skeptical of two things: (1) anonymous reviews being cherry-picked or fake, and (2) AI "magic" that hallucinates. The design had to earn trust on both fronts — hence sourced quotes and an explicit "how this works" explainer.

### What I Chose NOT to Build  *(strongest signal)*
- **No AI summary on paid B2B profiles** (`!isSubscribed` check). B2B customers pay to control their employer-brand narrative; auto-generated summaries introduce monetization risk. Deliberately swapped for a curated `WorkPlaceInsightsWidget` on paid profiles.
- **Killed social features in `ReviewCardV2`** — removed nested comment threads and "dislike" buttons. The goal was scannability and reading velocity, not a social network. Cut visual clutter and moderation overhead.
- **No bespoke AI filters** for edge-case questions ("Do they allow dogs?"). Instead of building complex filtering, created a handoff to "Ask AI Anything" chat — a frictionless escape hatch for the long tail.

### Information Architecture
Strict **"Insights first, details later"** hierarchy:
1. **Aggregate context (top):** overall rating + Quick Vibe Check AI summary — answers "good or bad?" instantly.
2. **Interactive filtering (sticky):** pivot the whole page (e.g. "Software Engineer" in "Bangalore").
3. **Deep dive (feed):** individual `ReviewCardV2` items as granular proof below the summary.
Desktop: two-column — left 65% = primary intent (reviews + AI insights), right 35% = secondary discovery (`SalaryDesigCard`, `PhotosVideoCard`, `EmployeeBenefits`), keeping cross-sells out of the reading flow. Mobile: sidebar collapses to a bottom "Explore more" section to protect vertical scroll.

### User Flows
- **Passive scan:** land → read AI Vibe Check (color-coded) → confident, leave or apply.
- **Verify path:** land → click a sentiment tag → loading skeleton → `SentimentReviewModal` shows exact source reviews ("the receipts").
- **Active query:** land → "Ask AI Anything" pill → fires `toggle-chatbot` → conversational AI.
- **Deep-data intent:** click filter / salary deep-dive → `useLoginModalSession` intercepts at high intent → login → intended action auto-executes post-login.

---

## Key Decisions  *(long form)*

### Decision 1 — Trust via transparency ("show the receipts")
- Title: Trust via transparency
- The situation: AI summaries read as a black box; users distrust hallucination.
- What I did: Every AI sentiment tag is clickable → opens `SentimentReviewModal` with the exact raw reviews that informed it. Plus an info icon → bottom-sheet explaining the methodology ("created using AI by analysing recent employee reviews…").
- Why it was right: Sourcing every claim converts skepticism into trust without asking users to "just believe" the model.
- The tradeoff I accepted: Extra surface + an interaction layer that simpler "just show a summary" products skip.

### Decision 2 — Insights first, details later
- Title: Insights first, details later
- The situation: The old page led with raw chronological reviews; the answer was buried.
- What I did: Inverted the hierarchy — AI summary + aggregate rating above the fold; raw reviews and secondary widgets pushed down (mobile) or to a 35% sidebar (desktop).
- Why it was right: Matches the user's actual question order — consensus first, proof on demand.
- The tradeoff I accepted: Less immediate real estate for individual reviews and cross-sell widgets.

### Decision 3 — Contextual intent gating (deferred login)
- Title: Growth-driven friction
- The situation: Hard paywalls/login walls cause bounces; but registration matters to the business.
- What I did: `useLoginModalSession` lets users browse freely, then triggers a login prompt at the exact moment of high intent (filter, salary deep-dive) — and auto-executes their intended action after login.
- Why it was right: Captures registration at peak intent without punishing the user by losing their context.
- The tradeoff I accepted: Some friction at the high-intent moment vs. a fully open experience.

### Decision 4 (optional) — Aggressive truncation for feed velocity
- Title: Scannability over completeness
- The situation: Long ranting reviews destroyed the feed's rhythm and caused bounce.
- What I did: `ReviewCardV2` cut truncation limits hard (210 chars mobile vs ~630 before); long-form is opt-in.
- Why it was right: Optimized for scanning velocity; readers choose to expand.
- The tradeoff I accepted: Less text visible by default; risk of losing nuance for skimmers.

---

## Visual & Interaction Design  *(design as product statement)*
- **Sentiment color coding** — Green/Positives, Red/Negatives, Amber/Neutral accordions. The "vibe" is legible by color density alone, before reading a word. The visual *is* the summary.
- **Optimistic UI + haptics** — "Helpful" increments instantly and fires `navigator.vibrate` while the API resolves in the background. Low-friction community moderation; the device physically rewards the action.
- **Progressive-disclosure default** — the summary auto-expands the most prominent available category (Positives, else falls back to Neutral). Users never meet a collapsed, defensive UI.

---

## Impact

### Quantitative  *(ALL UNVERIFIED — confirm or cut)*
- `[VERIFY]%` decrease in bounce rate on the main reviews route — *how measured?*
- `[VERIFY]%` shift in time-spent from raw-feed scrolling to AI-summary interaction — *how measured?*
- `[VERIFY]%` increase in registrations via deferred interaction gates — *how measured?*
- `[VERIFY]%` increase in "Helpful" upvotes from optimistic UI + haptics — *how measured?*

### Qualitative  *(use these if numbers can't be backed)*
- `[NEED FROM YOU]` Adoption/reach: shipped to the live Company Reviews page across all free profiles.
- `[NEED FROM YOU]` Recognition: internal praise? became the template for other AI features?
- `[NEED FROM YOU]` Second-order: did "show the receipts" become a reusable AI-trust pattern elsewhere?

---

## Process  *(the invisible work)*
- `[NEED FROM YOU]` Research: what told you users were drowning in text? (analytics, user interviews, session replays?)
- `[NEED FROM YOU]` Iterations: how many cuts of the hierarchy before "insights first" landed?
- `[NEED FROM YOU]` The pivot moment: when did "feed → insights engine" click?

## Collaborators
`[NEED FROM YOU]` — PM, eng, ML/data, research.

## What I'd Do Differently
`[NEED FROM YOU]` — 1–2 honest sentences.

---

## Interview Prep
- "What was *your* specific contribution?" → `[NEED FROM YOU]`
- "What was the hardest tradeoff?" → Candidate: descoping AI from paid B2B profiles — balancing user value against monetization risk.
- "What would you change?" → `[NEED FROM YOU]`
- "How did you measure success?" → `[NEED FROM YOU — tie to the 4 metrics once verified]`
- "What did you cut, and why?" → Social features (comments/dislikes), bespoke AI filters, AI on paid profiles — all in service of scannability + monetization safety.

---

## → Distilling to the Portfolio Cut
- **Problem** → The Problem paragraph above (already tight).
- **Approach** → "Shifted from chronological feed to insights engine; insights above the fold; AI extracts + categorizes sentiment; cards redesigned for scannability."
- **3 Decisions** → Trust via transparency · Insights first, details later · Contextual intent gating.
- **Impact** → needs verified numbers OR swap to qualitative.
- **Screens** → Hero (insights-first), Proof Modal (receipts), Two-column→mobile layout.
