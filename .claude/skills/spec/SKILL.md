---
name: spec
description: Interview the user about a feature or app they want to build, then write a detailed spec to specs/<name>.md — without building anything. Use whenever the user runs /spec, asks to "spec out" or "write a spec for" something, or describes a new feature/app and wants requirements pinned down before implementation. Do NOT start implementing; the deliverable is the spec document only.
---

# Spec

Turn a fuzzy feature idea into a precise, checkable spec through a focused interview. The output is a document someone could hand to a builder (you, later, or anyone else) and then verify the build against. You are NOT building anything in this session — if you feel the urge to open source files or write code, that's the signal to ask another question instead.

## Why interview first

The user comes in with a mental picture that is richer than their first sentence. Building from that first sentence is how wrong things get built. The interview's job is to extract the picture: what they're trying to achieve, what's non-negotiable, what's explicitly out, and how they'll judge the result.

## The interview

Ask **one focused question at a time**. Never bundle three questions into one message — the user will answer the easiest one and the others evaporate. Wait for each answer, let it shape the next question.

Work toward covering, in roughly this order:

1. **Goal** — What is this for? Who uses it, and what problem does it solve for them? Keep probing until you could state the goal in one sentence the user would endorse.
2. **Must-have requirements** — What has to exist for v1 to count? Separate must-haves from nice-to-haves explicitly; users often state wishes in the same breath as requirements.
3. **Constraints** — Tech stack, existing systems it must fit into, performance/budget/timeline limits, things the user has already decided or already rejected. Ask about prior attempts: "have you tried something for this before?" often surfaces hidden constraints.
4. **Edge cases** — Empty states, error states, weird inputs, concurrent use, scale. Propose concrete ones ("what should happen if X is empty?") rather than asking the user to brainstorm in the abstract.
5. **Definition of done** — How will the user check the build? Push for observable, testable statements ("a visitor on a 375px phone can open the modal and read all sections without horizontal scroll"), not vibes ("works well on mobile").

Don't march through this as a rigid checklist — follow the user's energy and double back for gaps. But before writing, verify you have all five. If an answer is vague, reflect a concrete interpretation back ("so if the upload fails, we show the error inline and keep the form filled — right?") and let them correct it.

**When to stop asking:** when another question wouldn't change what you'd write. Typically 5–10 questions. Don't pad the interview to look thorough, and don't cut it short because the user seems impatient — a 2-minute interview that misses a constraint costs hours later.

## Writing the spec

Save to `specs/<name>.md`, where `<name>` is a short kebab-case slug of the feature (e.g. `specs/case-study-filter.md`). Create the `specs/` directory if it doesn't exist. If a spec with that name already exists, confirm before overwriting.

ALWAYS use this structure:

```markdown
# <Feature name>

## Objective
One paragraph: what this is, who it's for, and the problem it solves.
A reader should understand why this is worth building.

## Requirements
Numbered list of must-haves. Each one specific enough to implement
without guessing. Nice-to-haves go in a separate "Out of scope (for now)"
subsection so they're recorded but unambiguously not v1.

## Edge cases
Each edge case with its required behavior — not just "handle empty
state" but "when the list is empty, show X".

## Definition of done
Numbered checklist of observable, binary checks. Someone who didn't
attend the interview must be able to take the finished build and mark
each item pass/fail without asking anyone what was meant.
```

Add other sections (Open questions, Constraints, References) when the interview surfaced material for them — but never at the expense of the four required ones.

Quality bar for the content: every requirement traceable to something the user said (no invented features), every vague interview answer resolved into a concrete decision (and if it genuinely couldn't be resolved, listed under "Open questions" rather than silently guessed).

## After writing

Tell the user where the spec was saved and summarize it in a few sentences. Offer to revise. Do not start implementing — even if the user's original message included "then build it", finish the spec, get their sign-off on it first, and let them explicitly kick off the build.
