# Case Study Master: Notes

> SOURCE OF TRUTH. Rebuilt from the Antigravity extraction in `notes-research-inventory.md`.
> This is private/interview-facing. Public site copy lives in `notes-portfolio.md`.

---

## TL;DR

Designed a 24-hour workplace Notes format for AmbitionBox Communities: a low-stakes, story-like way for professionals to share raw daily workplace moments without turning every thought into a permanent post.

## Meta

- Client / Product: AmbitionBox Communities · Notes
- Year: 2026
- Status: Built / pre-launch. Public launch has not happened yet.
- Platform: Web and mobile web / PWA
- Live URL or Figma link: Not public yet
- Tags: Ephemeral · Communities · Pre-launch

## What I Owned

- End-to-end product design and product management for the Notes experience, from creation flow to immersive viewer.
- The core interaction model: rail, composer, viewer, auto-advance, reactions, and author stats.
- Visual direction for the tactile "sticky note" aesthetic and the rules that made it robust across dynamic backgrounds.
- Prototyping and specification of complex interaction details such as auto-fit typography, reaction feedback, and the desktop immersive shell.
- Product-management ownership across problem framing, scope, and launch-readiness.
- `[NEED FROM YOU]` Add collaborators and the operating model: PM, engineers, content/moderation, analytics.

The single thing I am proudest of:

- Candidate: turning a lightweight emotional insight - "this thought should not have to become a permanent post" - into a launch-ready product system with clear behavioral rules.

---

## The Before State

AmbitionBox Communities was built around heavier, permanent posts. That format worked for polished discussions, but not for fleeting workplace moments: a bad meeting, a quick win, a funny office observation, or a one-line realization. Users had to make small feelings feel post-worthy, and permanence raised the reputational cost of sharing.

## The Problem

Professionals often have useful workplace texture to share, but not every thought deserves a permanent place on a professional profile. The old posting model asked users to overcommit: write something polished, attach it to an identity, and leave it around indefinitely. That made everyday expression feel riskier than it needed to be.

## Context & Constraints

- Business context: `[NEED FROM YOU - why Communities needed Notes now; contribution growth, retention, feed freshness, or creator activation?]`
- Technical constraints from extraction:
  - 24-hour TTL needed backend support and hard-delete behavior.
  - Media integrations included GIF search and Apple/iTunes music preview rules.
  - Notes had to work with pseudo-profile identity modes.
  - The UI had to stay legible across highly dynamic backgrounds.
  - Abuse checks and moderation/reporting had to exist despite the lightweight surface.
- Timeline / resources: `[NEED FROM YOU]`
- Things you could not change: `[NEED FROM YOU - existing Communities architecture, auth/pseudo-profile model, moderation policy, feed constraints]`
- Redesign-from-scratch vs. work-around:
  - Fresh Notes composer/viewer/rail built inside the existing Communities ecosystem.
  - Existing integrations and identity systems constrained what could be invented.

---

## Product Thinking

### Core Job-to-be-Done

"Let me share a small workplace moment today without carrying it forever."

Success for the user means they can express a fleeting workplace thought quickly, safely, and visually, then move on.

### User Mental Model

Users understand stories as temporary, glanceable, expressive, and low-pressure. Notes borrows that mental model but makes it workplace-native through contextual professional identity and community reactions.

The key distinction:

- A Post is something worth returning to.
- A Note is a thought for today.

### What I Chose NOT To Build

- **No archive or memory surface.** The 24-hour lifespan is the product promise. Adding archives would quietly reintroduce permanence anxiety.
- **No public comment threads.** Notes supports reactions and future messaging, but not debate-heavy comment chains. The goal is lightweight expression, not another permanent discussion surface.
- **No video uploads in Phase 1.** Images, GIFs, music, stickers, and text created enough expressiveness without the moderation and infrastructure burden of video.
- **No multi-reaction pile-on.** One reaction per viewer keeps feedback readable and prevents the interaction from becoming visual noise.

### Information Architecture

Notes is a three-part system:

1. **Rail:** a horizontal entry point that prioritizes unseen notes and makes freshness visible.
2. **Viewer:** an immersive story-like canvas with progress, navigation, identity, media, music, and reactions.
3. **Composer:** a focused creation canvas with text, identity, background color, typography, media, music, sticker, and publish controls.

Desktop preserves the mobile composition instead of stretching it. The centered 502px shell keeps author and viewer layouts consistent, so a note's line breaks, stickers, and media placement do not mutate across breakpoints.

### User Flows

- **Consumption flow:** Home feed rail -> tap unread note -> viewer opens -> notes auto-advance -> user reacts, pauses, navigates, or exits.
- **Creation flow:** Home feed -> create note -> type text -> customize style/media/music/sticker -> choose identity -> publish -> return to feed.
- **Reaction flow:** Viewer -> tap emoji -> haptic/particle feedback -> one reaction is registered. Tapping a different emoji replaces the previous one.
- **Author review flow:** Open own note -> author dock -> stats pill -> reaction detail sheet shows who reacted and with what.
- **Moderation flow:** Viewer menu -> report note -> moderation surface.

---

## Key Decisions

### Decision 1 - Radical ephemerality

- Title: Radical ephemerality
- The situation: Permanent professional posts made small daily thoughts feel too risky.
- What I did: Designed Notes around a hard 24-hour life with no archive or soft-delete pattern.
- Why it was right: The format only feels low-stakes if the product actually keeps its promise that this is temporary.
- The tradeoff I accepted: Less long-term content inventory and fewer evergreen discussion artifacts.

### Decision 2 - Contextual identity

- Title: Identity per note, not per account
- The situation: Workplace identity changes by context. Someone may want to speak from the company they work at in one moment and from their professional role in another.
- What I did: The composer lets users choose the identity mode per note: company or designation. Anonymous posting is not part of the product.
- Why it was right: Psychological safety comes from matching the identity to the moment, not forcing one global persona.
- The tradeoff I accepted: More complexity in composer state, viewer display, and moderation/attribution rules.

### Decision 3 - Glanceability over depth

- Title: Never make a note scroll
- The situation: A story-like viewer breaks if the audience has to manually scroll to understand a single note.
- What I did: Used deterministic typography fitting based on content length and media presence so dense notes still fit the canvas.
- Why it was right: The interaction stays fast, passive, and predictable.
- The tradeoff I accepted: Dense content becomes visually smaller, so the product nudges authors toward brevity.

### Decision 4 - One reaction as a forcing function

- Title: One clear signal
- The situation: Unlimited emoji reactions can become clutter and weak feedback.
- What I did: A viewer can leave one reaction per note; choosing a new reaction replaces the old one.
- Why it was right: Authors get a clearer read on audience sentiment, and the UI avoids reaction spam.
- The tradeoff I accepted: Users lose some expressive flexibility.

### Decision 5 - Freshness first

- Title: Reward return visits with unseen content
- The situation: Returning users need to know what is new without losing context of what they already saw.
- What I did: The rail/viewer prioritizes unseen notes and visually dims read notes.
- Why it was right: It gives the feature a reason to be checked daily while keeping session history visible.
- The tradeoff I accepted: Sorting is less purely chronological.

---

## Visual & Interaction Design

- **Sticky note physicality:** White media frames and tactile sticker shadows separate Notes from corporate post cards and make the surface feel expressive.
- **Adaptive glass controls:** Identity pills and music bars use glass-style tokens so controls remain legible across vibrant user-selected backgrounds.
- **Centered desktop shell:** The desktop experience keeps the mobile note canvas intact, protecting WYSIWYG trust between composer and viewer.
- **Reaction feedback:** Haptics/particles make reacting feel light and satisfying, which matters because reactions are the main audience action.

## Impact

### Quantitative

No public launch metrics exist yet because Notes has not gone live. If this case study ships before launch data is available, keep impact qualitative and avoid numeric claims.

Metrics to check after launch:

- Daily active contributors compared with legacy posts.
- Draft abandonment rate.
- Returning-user completion of unread rail.
- Average reactions per note or reaction rate per impression.
- Creation rate per viewer/session.

### Qualitative

- Built a launch-ready Phase 1 Notes experience for AmbitionBox Communities.
- Created a lower-stakes creation format alongside permanent posts.
- Introduced a sticky-note visual system for expressive workplace content.
- `[NEED FROM YOU]` Stakeholder/user feedback.
- `[NEED FROM YOU]` Whether the sticky-note system influenced other AmbitionBox surfaces.

## Process

- `[NEED FROM YOU]` What triggered the idea?
- `[NEED FROM YOU]` What research or signals showed that permanent posts were too heavy?
- `[NEED FROM YOU]` What were the biggest iterations?
- `[NEED FROM YOU]` Where did the sticky-note metaphor come from?
- `[NEED FROM YOU]` How did you prototype the viewer/composer interactions?

## Collaborators

`[NEED FROM YOU]` - PM, engineers, content/moderation, analytics, design partners.

## What I Would Do Differently

Candidates from extraction:

- Add stronger first-time onboarding or a system note to explain the 24-hour behavior.
- Debounce rapid reaction switching earlier to reduce engineering complexity.
- Improve offline/error handling for failed submits so creators do not lose drafts.

`[NEED FROM YOU]` Add your own reflection if different.

---

## Interview Prep

- "Why build a Stories-like format for a professional network?" -> Because Communities needed a lower-stakes format for daily workplace texture; permanent posts were too heavy for fleeting moments.
- "How did you make it workplace-native?" -> Contextual identity, moderation, professional pseudo-profiles, and a creation model built around company/designation context.
- "How did you protect trust?" -> 24-hour TTL, identity choice, abuse checks, report flow, no permanent archive.
- "What was the hardest tradeoff?" -> Ephemerality reduces long-term content inventory but is what makes the product psychologically safe.
- "What did you cut?" -> Archive/memories, comments, video uploads, multi-reaction pile-ons.
- "How did you measure success?" -> `[NEED FROM YOU]` tie to contribution, completion, retention, and reaction metrics.
