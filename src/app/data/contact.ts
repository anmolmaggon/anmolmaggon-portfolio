// Single source of truth for contact details + the "Let's Talk" email draft.
// Used by every entry point: hero Email icon, the nav "Let's Talk" CTA (desktop + mobile
// drawer), both case-study-modal "Let's Talk" buttons, and the closing-scene footer.
// Tweak the subject/body here once and it changes everywhere.

export const CONTACT_EMAIL = "anmolmaggon40@gmail.com";

const LETS_TALK_SUBJECT = "Let's chat about your portfolio & work";
const LETS_TALK_BODY = `Hi Anmol,

I was just looking through your portfolio and really loved your work. I'd love to connect and chat more about what you're up to!

Best,
[Your Name]`;

export const LETS_TALK_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  LETS_TALK_SUBJECT,
)}&body=${encodeURIComponent(LETS_TALK_BODY)}`;
