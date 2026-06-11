# Notes Research Inventory

Imported from Antigravity output in `/Users/anmol.maggon/Documents/ai-exp/Phase 1 - Stories/notes-research-inventory.md`.

## A. Coverage Report

- Files/routes/components read:
  - `Notes_Content.md`
  - `packages/web/notes/components/ComposerScreen.tsx`
  - `packages/web/notes/components/ViewerScreen.tsx`
  - `packages/web/notes/data/notes.ts`
  - `packages/web/notes/context/NotesContext.tsx`
  - `packages/web/notes/DESIGN-HANDOFF.md`
  - `packages/web/notes/BACKEND-REQUIREMENTS.md`
  - `packages/web/notes/EDGE-CASES.md`
- Areas not read:
  - Deep internals of shared monorepo hooks/components such as `useGiphy`, `useITunesSearch`, and `usePseudoProfile`.
  - Tailwind configuration outside the `notes` package.
- Confidence in coverage: High for product surface, frontend state, UI rules, data model, and edge cases.
- What may be missing: exact Figma dimensions, production analytics, final animation curves, and personal collaboration/process context.

## B. Evidence Table

| Claim | Evidence | File/path | Confidence | Needs human confirmation? |
|---|---|---|---|---|
| Identity is contextual per note | `identityMode` is chosen at composer level, allowing a mix of company/designation posts in the same session. Anmol confirmed anonymous is not part of the product. | `ComposerScreen.tsx#L141-L151` | High | No |
| Product enforces 24-hour lifespan | `MOCK_TTL_MS = 24 * 60 * 60 * 1000`; backend requires hard-delete. | `NotesContext.tsx#L12-L13`, `BACKEND-REQUIREMENTS.md#L201` | High | No |
| One reaction per note | `handleReaction` removes previous reaction before adding a new one. | `ViewerScreen.tsx#L326-L329` | High | No |
| Design prioritizes glanceability | `autoFitFontSize` scales text down to fit the card based on character count and media presence. | `ViewerScreen.tsx#L259-L277`, `DESIGN-HANDOFF.md#L61-L73` | High | No |
| Product prioritizes fresh content | Viewer/rail sort notes by `seenAtEntry`, pushing unseen notes first. | `ViewerScreen.tsx#L131-L134` | High | No |
| Delete is permanent | Backend requirements forbid soft-delete or archive views. | `BACKEND-REQUIREMENTS.md#L235-L239` | High | No |
| Rail-level variety matters | Notes support colors, fonts, music, GIFs, stickers, and media. | `Notes_Content.md#L15`, `notes.ts#L9-L36` | High | No |
| Abusive content is blocked before submit | `useCheckAbusive` runs synchronously before submission. | `ComposerScreen.tsx#L490-L494` | High | Confirm final moderation stack |

## Complete Capability Inventory

- View a horizontal rail of active notes.
- Prioritize unseen notes ahead of read notes.
- Auto-advance through notes with an 8-second timer.
- Pause viewing with long press.
- Navigate previous/next by tapping screen edges.
- Mute/unmute attached music.
- React with one emoji.
- Change reaction by choosing a different emoji.
- Remove active reaction.
- Switch viewing identity from the audience dock.
- Report a note.
- Share a note in author mode.
- Delete own note in author mode.
- View reaction details on own note.
- Compose text up to 280 characters.
- Choose identity before publishing.
- Change note color from 20 backgrounds.
- Change font style from 8 options.
- Attach image.
- Attach GIF.
- Attach music preview.
- Add sticker.
- Discard draft with confirmation.
- Enter desktop focus mode while typing.

## Entities And Data

### Note

Attributes:

- `id`
- `text`
- `identity`
- `timestamp`
- `noteColor`
- `fontFamily`
- `image`
- `gif`
- `music`
- `sticker`
- `reactions`
- `views`
- `expiresAt`

Actions:

- Create
- View
- Delete
- Report
- Share
- React

### ReactorIdentity

Attributes:

- `id`
- `profileType`
- `username`
- `careerStatus`
- `avatarUrl`
- `isVerified`
- `reactionLabel`
- `reactedAt`

Actions:

- View in author reaction detail sheet.

### User / PseudoProfile

Attributes:

- login state
- username
- designation
- company
- city
- industry
- profile type

Actions:

- Choose/switch identity context.

## Screens And Surfaces

- Home feed rail / `NotesRail`
- Viewer screen / `ViewerScreen`
- Composer screen / `ComposerScreen`
- Identity picker sheet
- Color picker sheet
- Font picker sheet
- Music picker sheet
- GIF picker sheet
- Sticker picker
- Reaction detail sheet
- Discard confirmation sheet
- Delete confirmation sheet
- Report sheet

## Information Architecture

### Viewer

1. Progress bar / timer.
2. Top controls: mute, play/pause on desktop, menu, close.
3. Sticky note canvas:
   - sticker
   - identity pill
   - text
   - media
   - music bar
4. Bottom dock:
   - audience mode: identity switcher, reaction emojis, message affordance
   - author mode: views, reaction stats, share, create

### Composer

1. Header tools.
2. Sticky note canvas.
3. Text entry.
4. Media/music/sticker controls.
5. Identity picker.
6. Publish/discard actions.

## User Flows

- Consumption flow: feed rail -> note viewer -> auto-advance through unseen notes -> exit or react.
- Creation flow: create -> compose -> customize -> choose identity -> publish -> return to feed.
- Reaction flow: view -> tap emoji -> feedback animation/haptic -> replace/remove if needed.
- Author review flow: open own note -> stats pill -> reaction detail sheet.
- Moderation flow: menu -> report.

## States And Edge Cases

- Rail empty state.
- All-read rail state.
- Blank submit blocked.
- Over-280-character submit blocked.
- Desktop focus mode.
- Image/GIF conflict handling.
- Text auto-fit.
- Abusive content check.
- Network failure on submit.
- Deleted/expired deep link.

## Product Interpretation

### Scope Decisions

- No permanent archive or memory feature.
- No nested public comments.
- No video uploads in Phase 1.
- No unlimited reaction stacking.

### Key Product Decisions

- Radical ephemerality: 24-hour hard delete lowers permanence anxiety.
- Contextual identity: per-note identity gives psychological safety and nuance.
- Glanceability over depth: auto-fit keeps notes story-like and non-scrollable.
- One reaction as a forcing function: cleaner audience signal.
- Freshness first: unseen sorting rewards return visits.

## Screenshot Capture Plan

### `preview.webp`

- State: home feed rail.
- Viewport: mobile, 390x844.
- Proves: freshness first, unread prioritization, rail-level variety.

### `cover.webp`

- State: viewer audience mode on a vibrant note with music, image, and sticker.
- Viewport: mobile, 390x844.
- Proves: expressive sticky-note format.

### `screen-hero.webp`

- State: composer with identity picker open.
- Viewport: mobile, 390x844.
- Proves: contextual identity.

### `screen-detail-1.webp`

- State: viewer with dense text and media.
- Viewport: desktop, 1440x900.
- Proves: glanceability and desktop immersive shell.

### `screen-detail-2.webp`

- State: author mode with reaction detail sheet open.
- Viewport: mobile, 390x844.
- Proves: one-reaction audience signal.
