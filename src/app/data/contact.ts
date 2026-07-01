// Single source of truth for contact details + the "Let's Talk" email draft.
// Used by every entry point: hero Email icon, the nav "Let's Talk" CTA (desktop + mobile
// drawer), both case-study-modal "Let's Talk" buttons, and the closing-scene footer.
// Tweak the subject/body here once and it changes everywhere.

export const CONTACT_EMAIL = "anmolmaggon40@gmail.com";

const LETS_TALK_SUBJECT = "Loved your portfolio, let's talk";
const LETS_TALK_BODY = `Hi Anmol,

Your work and the craft behind it really stood out. I'd love to talk about [role / project] and how you work.

Best,
[Your Name]`;

export const LETS_TALK_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  LETS_TALK_SUBJECT,
)}&body=${encodeURIComponent(LETS_TALK_BODY)}`;
