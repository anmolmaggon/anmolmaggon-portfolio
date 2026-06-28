#!/usr/bin/env node
/* ============================================================================
   Design-token guard — keeps the system self-enforcing.
   Fails (exit 1) if any main-site component uses a RAW value that should be a
   token: arbitrary hex/rgb colors, arbitrary font-sizes, or arbitrary spacing
   in className. Run: `pnpm check:tokens` (wire into CI / pre-commit).

   Scope: .tsx under src/app, excluding the legacy/standalone systems (ui, figma,
   experiments). Inline style objects are NOT scanned — bespoke scenes legitimately
   use gradients/transforms/three.js colors there (Golden Rule G2/G6). Genuine
   one-offs go in ALLOW below, with a comment, so they're intentional, not silent.
   ========================================================================== */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/app';
const SKIP_DIRS = new Set(['ui', 'experiments', 'figma']);

// Intentional one-offs — each must be justified. Adding here is a conscious choice.
const ALLOW = new Set([
  'gap-[clamp(56px,6vw,124px)]', // TechStackJar — fluid two-column layout gap (responsive, not snappable)
  'text-[9px]',                  // ClosingScene — ▶ play-glyph icon size (icon, not type)
]);

const RULES = [
  { name: 'arbitrary color',
    re: /\b(?:text|bg|border|ring|fill|stroke|from|via|to|decoration|outline|divide|placeholder)-\[(?:#|rgb|hsl)[^\]]*\]/g,
    hint: 'use a color token — text-ink-*/bg-surface-*/border-hairline/bg-scrim/text-jar-*' },
  { name: 'arbitrary font-size',
    re: /\btext-\[(?:\d+(?:\.\d+)?px|clamp\([^\]]*\))\]/g,
    hint: 'use a font-size token — text-fluid-*/text-label/text-meta/text-base/lg' },
  { name: 'arbitrary spacing',
    re: /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|gap|gap-x|gap-y|space-x|space-y)-\[[^\]]*\]/g,
    hint: 'use the numeric scale (p-4, gap-2) or a named token (px-gutter, py-section)' },
];

function walk(dir, files = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(e)) walk(p, files); }
    else if (e.endsWith('.tsx')) files.push(p);
  }
  return files;
}

let violations = 0;
for (const file of walk(ROOT)) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const rule of RULES) {
      for (const m of line.matchAll(rule.re)) {
        if (ALLOW.has(m[0])) continue;
        violations++;
        console.log(`  ${file}:${i + 1}\n    ${rule.name}: ${m[0]}  →  ${rule.hint}`);
      }
    }
  });
}

if (violations) {
  console.log(`\n✗ ${violations} token violation(s). Use a token, or add an intentional one-off to ALLOW in scripts/check-tokens.mjs.`);
  process.exit(1);
}
console.log('✓ no token violations — every value flows from the design system.');
