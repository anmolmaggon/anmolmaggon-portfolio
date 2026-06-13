---
name: review-spec
description: Verify the current build against a spec in specs/<name>.md, requirement by requirement, and either pass it or hand a concrete fix list back to /build. Use whenever the user runs /review-spec, asks "does the build match the spec?", "check the implementation against the spec", or wants gaps/bugs found after a /build pass. The verdict is binary — pass only when every spec item is fully met.
---

# Review

Audit the current build against its spec and deliver a binary verdict. This is the gate at the end of the spec → build → review loop: `/spec` recorded what was agreed, `/build` claims to have done it, and you check the claim. The output is either a clean pass or a fix list precise enough that `/build` can act on it without re-deriving anything.

## Picking the spec

Same resolution as `/build`: use the spec the user named; if none named and exactly one exists in `specs/`, use it and say so; if several exist, ask. Read the entire spec — Requirements, Edge cases, Definition of done, Out of scope — before looking at any code.

## Verify, don't trust

If a build report exists in the conversation, treat it as a map of where to look, never as evidence. A ✅ in the report is a claim; your job is to independently confirm or refute it. For each spec item:

- **Read the actual code** that implements it. Confirm the behavior the spec describes is what the code does — including the unhappy paths.
- **Run what can be run.** Build the project; if the change is observable in the browser, start the preview and exercise the feature directly — click it, feed it the edge-case inputs the spec lists, resize if the spec mentions responsive behavior. A requirement verified only by reading code when it could have been exercised live is a weaker verification; say which kind you did.
- **Check the spec's edge cases specifically.** These are the most common gap: the happy path works, the empty/error/weird-input case was skipped.
- **Check "Out of scope" wasn't built anyway.** Scope creep is a finding too — it's untested, unreviewed surface the user explicitly deferred.

Also flag genuine bugs you encounter in the built feature even if no spec line names them — a crash in the new code fails the spec's objective. But stay inside the feature's footprint: pre-existing issues in untouched code are a side note, not a finding.

You are reviewing, not fixing. Don't edit code during the review — even for one-line fixes. Mixing fixing into reviewing blurs who verified what; the fix list is the deliverable, and `/build` applies it.

## The verdict

**Pass only when every requirement, every edge case, and every definition-of-done item is fully met.** "Mostly works", "minor gaps", "good enough" are all FAIL. The whole value of this gate is that a pass means *done* — soften it once and every future pass is ambiguous. A definition-of-done item that genuinely requires the user (real device, subjective judgment) is reported as "needs user check" and blocks a full pass; the verdict is then NEEDS USER CHECK, not PASS.

ALWAYS use this structure:

```markdown
## Review — specs/<name>.md

**Verdict: PASS | FAIL | NEEDS USER CHECK**

### Requirement-by-requirement
1. <spec item, quoted> — ✅ Met (<how verified: exercised live / code read, file:line>) | ❌ FAILED: <what's wrong>
2. ...
(every requirement, edge case, and definition-of-done item appears — none skipped)

### Findings
(only if verdict isn't PASS — one entry per gap/bug)
- **F1 — fails Requirement 3**: <precise description of the gap, with file:line>
  **Fix**: <the specific change needed — concrete enough for /build to act without investigation>
- **F2 — fails Edge case "empty list"**: ...

### Needs user check
(only if applicable — what to check and how)
```

Every finding names the exact spec item it fails — an orphan finding that cites nothing forces the next reader to re-derive your reasoning. Every fix says *what to change and where*, not "handle this better".

## Handing back

On FAIL, end by telling the user the build needs another pass and that `/build` can take the Findings list directly — each fix is written to be actionable as-is. On PASS, state plainly that every spec item is met and the feature is done. Don't append new feature ideas to a pass; the loop is closed.
