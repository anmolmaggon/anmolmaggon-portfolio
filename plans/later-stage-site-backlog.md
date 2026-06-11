# Later Stage Site Backlog

Parked until the case-study section is solid.

## Launch Metadata & SEO Strategy (Pre-Launch)

- **Domain & Hosting Setup**: Finalize domain (e.g. https://anmolmaggon.com) and deploy.
- **OG Tags & Twitter Cards**: Add Open Graph and Twitter Card meta tags to `index.html` for rich link previews.
- **Social Preview Image (OG Image)**: Create/select an image to be used for the preview card (excluding the hero image to preserve the surprise).
- **Structured Data (JSON-LD)**: Add `Person` schema markup in `index.html` mapping to your social profiles.
- **Crawler Directives**: Add `public/robots.txt` allowing all bots, and a `public/sitemap.xml` pointing to your final domain.
- **Image Accessibility**: Do a final pass over `src/app/components/CaseStudies.tsx` and `Photography.tsx` to ensure all images have highly descriptive `alt` attributes.

## Navigation And Links

- Add real `public/resume.pdf` or remove the resume link.
- Replace footer social `#` links with real URLs.
- Fix mobile nav: current "Menu" link jumps to contact instead of opening a menu.
- Remove or replace dead archive/campaign links in side-quest sections.

## Hero Direction

- Decide whether the dark WebGL hero is truly the direction.
- Current project brief says the dark cinematic direction was set aside; either update the brief or simplify the hero toward the light/work-forward direction.
- If WebGL stays, verify desktop/mobile rendering visually and reduce first-load cost.

## Audio

- Music must be opt-in if it stays.
- Remove autoplay attempts and scroll-triggered playback.
- Keep audio out of the critical path.

## Performance

- Current production build passes but has a large JS warning.
- Main JS is roughly 1.36 MB minified.
- Large bundled assets include the MP3 and multi-MB PNGs.
- Consider lazy-loading hero/WebGL, case-study modals, and non-critical media.

## Secondary Sections

- Marketing currently reads as generic filler. Replace with real work or remove for v1.
- Photography uses Unsplash despite local photo files existing. Replace with Anmol's real photography or remove for v1.
- Tech stack relies on external icon CDN URLs. Decide whether that is acceptable for launch.

## Project Hygiene

- Duplicate "Hero Section Better Version" project should be archived or removed after direction is locked.
- Raw photo folders should be moved out of the app repo or compressed into public assets.
- Add at least a minimal typecheck/lint path if this project will keep evolving.
