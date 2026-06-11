# Portfolio Brief — Codebase Extraction Prompt

> Copy everything below this line and paste into Antigravity with your project codebase open.
> Fill in [FEATURE NAME] and the codebase context at the bottom.

---

I'm a product designer. I designed and shipped [FEATURE NAME]. Read the codebase and help me write a portfolio case study. This has two phases: first you EXHAUSTIVELY catalog what the feature actually is and does (the "what"), then you interpret the product thinking behind it (the "why"). Do not skip to interpretation — a case study built on a half-understood feature is useless to me.

## Critical instruction: be exhaustive, do not summarize
This is the most common failure mode, so read carefully. When you inventory the feature, list EVERYTHING — every screen, every user action, every data type, every state, every sub-feature. Do not collapse five capabilities into "user management." Do not stop at the obvious 4–5 features and assume that's the whole product. If you are unsure whether something counts, include it. I would rather cut your list down than discover you missed half the feature. If the codebase is large, tell me which areas you read and which you didn't, so I know the coverage of your inventory.

## Critical instruction: evidence before storytelling
Do not write confident portfolio copy unless you can point to the product evidence that supports it. For every meaningful claim, keep a trail:

- Claim
- Evidence from code, route, component, prop, analytics hook, experiment, or UI state
- File/path reference
- Confidence level: High / Medium / Low
- What still needs human confirmation

Do not invent metrics. If the code does not contain measurement data, write `[VERIFY]` and explain what should be checked. A good qualitative outcome is better than a fake number.

## Critical instruction: separate public and private outputs
Create two outputs:

1. **Master case-study doc** - private, deep, interview-facing. It can include uncertainty, collaborators, constraints, process, and `[NEED FROM YOU]` gaps.
2. **Portfolio cut** - public, website-facing. It must be short, visual, and defensible. No `[NEED FROM YOU]`, no `[VERIFY]`, no unsupported metrics.

If the portfolio cut cannot be made defensible yet, say exactly what is blocking it instead of filling gaps with generic copy.

## What to read
- Every page/route component and its children — map the full product surface, not just the entry point
- All data being fetched, created, updated, deleted — what entities does this feature deal with?
- Component names and prop shapes — they reveal the product's mental model
- Conditional rendering and branching logic — this is scope and flow decisions made concrete
- What's missing or hidden — what did the product deliberately leave out?
- Empty states, loading states, error states — how the product handles reality vs. the happy path
- Any feature flags, A/B test hooks, or analytics events — clues to what was being validated
- Breakpoint differences — what is prioritized for mobile users vs. desktop users, and why?

---

# PHASE 1 — OBSERVE (the complete "what")

Do this thoroughly before any interpretation. This is an inventory, not a story.

### 1. Feature Overview
In plain language: what is this feature, who uses it, and why do they come here?
What did it replace or improve on?

### 2. Complete Capability Inventory
List EVERY distinct thing a user can do in this feature. One line each. Be exhaustive — aim for completeness over brevity.
For each capability: what the user does, what data it touches, what the outcome is.
(e.g. "Filter salaries by experience level — updates the distribution chart and the headline median in place.")

### 3. Entities & Data
What objects/entities does this feature deal with? (e.g. a salary record, a review, a company, a draft.)
For each: what attributes does the user see, and what can they do to it (view / create / edit / delete / share)?

### 4. Every Screen & Surface
List every distinct screen, view, modal, drawer, panel, or significant state the feature renders.
For each: what it shows and how the user reaches it.

### 5. Information Architecture
On the main surface(s), what information is shown and in what order, top to bottom?
What's above the fold, what needs a scroll, what's hidden behind a tap or click?

### 6. User Flows
Map the paths through the feature. There is usually more than one.
For each flow: entry point → key steps/decision points → outcome.
What determines which path a user takes?

### 7. States & Edge Cases
Every UI state: empty, loading, error, partial data, full data, first-time user, returning user, permission-gated, etc.
For each: what triggers it and what the user sees.

---

# PHASE 2 — INTERPRET (the "why")

Only after the inventory above is complete.

### 8. Scope Decisions (what's here vs. what isn't)
Given the full capability inventory above, what seems intentionally absent — things a naive version of this product might have included but doesn't?
Any signs of deliberate simplification or de-scoping?

### 9. Key Product & Design Decisions (inferred from code)
Find 4–6 decisions where the code reveals an opinionated product or design choice.
Avoid pure visual observations — focus on decisions that affected the user's experience or the product's usefulness.
Format each as:
  - Decision title (short, opinionated — e.g. "Answer before context", "One task per screen")
  - What the code does
  - What user problem this solves

### 10. Visual & Interaction Choices That Serve the Product
Only the visual/interaction decisions that directly serve a product goal.
(e.g. "The salary number is displayed at 64px because users arrive with one question — making them scan for it would cost trust.")
Skip observations about colors or fonts unless they explain a product decision.

### 11. Screens to Capture
From the full screen list in Phase 1, pick the 5–8 most portfolio-worthy:
  - URL/state to reach it
  - What it shows
  - What product or design thinking it demonstrates

**If this is a redesign:** also flag a before/after pair for an interactive comparison slider.
  - Identify the single screen where the redesign's improvement is most visible.
  - CAPTURE RULE: the "before" and "after" must be the EXACT same crop, viewport width, and zoom, or the slider divider will misalign. Same scroll position, same device frame.
  - Files: `before.webp` and `after.webp` (16:9).

### 12. Draft Portfolio Copy

**The problem (1 paragraph):**
Frame as the human/user problem before this feature existed. Not the business ask. Not the design brief.

**The approach (1 paragraph):**
The product design methodology — the core insight or framing that unlocked the solution.

**3–4 design decisions for portfolio cards:**
Each: { title: "Short opinionated label", detail: "One sentence on the product tradeoff made." }

**Impact metrics (4 numbers):**
{ value: "XX%", label: "what changed" } — mark unknowns as [VERIFY]

---

# REQUIRED OUTPUT FORMAT

## A. Coverage Report
- Files/routes/components read:
- Areas not read:
- Confidence in coverage:
- What may be missing:

## B. Evidence Table
Use this exact shape:

| Claim | Evidence | File/path | Confidence | Needs human confirmation? |
|---|---|---|---|---|

## C. Complete Feature Inventory
Follow Phase 1 sections 1-7. Be exhaustive.

## D. Product Interpretation
Follow Phase 2 sections 8-11. Every decision must connect to evidence.

## E. Master Case Study Draft
Use the exact structure from `case-study-master.md`:

- TL;DR
- Meta
- What I Owned
- Before State
- Problem
- Context & Constraints
- Product Thinking
- Key Decisions
- Visual & Interaction Design
- Impact
- Process
- Collaborators
- What I'd Do Differently
- Interview Prep

Mark all personal-context gaps as `[NEED FROM YOU]`.

## F. Public Portfolio Cut
Use the exact structure from `case-study-portfolio.md`:

- Meta
- Problem
- Approach
- 3 Decisions
- Impact
- Screens
- Paste-ready `CaseStudies.tsx` object

Do not include the paste-ready object if it still contains unverified metrics or missing screenshots. Instead, provide a blocked checklist.

## G. Screenshot Capture Plan
List the exact screens to export:

- `preview.webp`
- `cover.webp`
- `screen-hero.webp`
- `screen-detail-1.webp`
- `screen-detail-2.webp`
- `before.webp` and `after.webp` if this is a redesign

For each: what state to open, what viewport to use, and what product decision it proves.

---

Codebase context:
[paste key file paths or file tree here]
