---
name: build
description: Read a spec from specs/<name>.md and implement exactly what it describes — nothing more. Use whenever the user runs /build, says "build the spec", "implement specs/<name>.md", or asks to build a feature that has a written spec in specs/. The spec is the sole source of requirements; finish by reporting requirement-by-requirement coverage for the review step.
---

# Build

Implement a spec from `specs/`, treating it as a contract. The spec was produced by a deliberate interview (`/spec`) where scope was negotiated and nice-to-haves were explicitly cut — so anything you'd add beyond it isn't a bonus, it's overriding decisions the user already made. The companion review step checks the build against the spec line by line; your job is to make that check pass, not to impress beyond it.

## Picking the spec

If the user named a spec (`/build case-study-filter`), read `specs/case-study-filter.md`. If they didn't and exactly one spec exists in `specs/`, use it and say so. If several exist, ask which one — don't guess from recency.

Read the whole spec before touching code: Objective, Requirements, Edge cases, Definition of done, and any Out of scope or Open questions sections.

## Ground rules

**The spec is the requirements source.** Build every numbered requirement and every edge-case behavior. Don't add features, settings, abstractions, or "obvious improvements" the spec doesn't ask for — if you spot something genuinely valuable that's missing, mention it in your final report as a suggestion; don't build it.

**Anything under "Out of scope" is a decision, not an oversight.** Do not implement it, not even partially, not even if it's easy.

**Don't refactor unrelated code.** Touch only what the spec's requirements demand. Drive-by cleanups, renames, and restructuring of neighboring code make the review step noisy and risk breaking things the spec never covered. If surrounding code has a real problem, note it in the report instead.

**Match the codebase's existing conventions** — components, styling patterns, naming, comment density. The spec defines *what*; the surrounding code defines *how it should look*.

**If the spec is ambiguous or contradicts the codebase**, don't invent a resolution silently. For small ambiguities, choose the most conservative reading and flag the choice in your report. For anything that would change the shape of the feature, stop and ask the user before proceeding.

**Open questions in the spec are still open.** If a requirement depends on an unresolved Open Question, ask the user rather than picking an answer.

## Working through it

Plan the implementation around the requirements list — it's the natural task breakdown. Build, then verify against the Definition of done: each item there is a binary check, so actually perform the checks you can (run the build, exercise the feature in the preview, hit the edge cases) rather than assuming. A definition-of-done item you can't verify yourself (e.g. needs a real device, real data, or the user's judgment) gets reported as "needs manual check", not silently marked done.

## The coverage report

End with a report the review step can consume directly. ALWAYS use this structure:

```markdown
## Build report — specs/<name>.md

### Requirements
1. <requirement, quoted or tightly paraphrased> — ✅ Done: <where/how, with file:line> | ⚠️ Partial: <what's missing and why> | ❌ Not done: <why>
2. ...

### Edge cases
- <edge case> — ✅ Handled: <where/how> | ❌ Not handled: <why>

### Definition of done
1. <check> — ✅ Verified: <how you verified it> | 🔍 Needs manual check: <what the user should do>

### Deviations and notes
- <any ambiguity you resolved and how, anything you deliberately did not do, suggestions you didn't build>
```

Every requirement and edge case from the spec must appear — no skipping the awkward ones. Honest ⚠️ and ❌ entries are far more useful than optimistic ✅s: the review step will find the gap anyway, and a false ✅ costs trust in the whole report.
