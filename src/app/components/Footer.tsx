import { HoverLink } from "./HoverLink";

export function Footer() {
  return (
    <footer id="contact" className="px-6 md:px-10 pt-20 md:pt-28 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
        <div className="md:col-span-7">
          <p
            className="font-[Nyght_Serif]"
            style={{
              fontSize: "clamp(30px, 4vw, 60px)",
              lineHeight: 1.08,
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Got an <em className="italic" style={{ color: "#fe4638" }}>idea worth building</em>? Let's talk.
          </p>
          <HoverLink
            href="mailto:anmolmaggon40@gmail.com"
            className="mt-10 inline-block italic font-[Nyght_Serif]"
            style={{ fontSize: "clamp(22px, 2.2vw, 30px)", fontWeight: 400 }}
          >
            anmolmaggon40@gmail.com →
          </HoverLink>
        </div>

        <div className="md:col-span-3 md:col-start-9">
          <p className="eyebrow opacity-60 mb-4">Elsewhere</p>
          <ul className="space-y-2">
            {[
              ["LinkedIn", "#"],
              ["Read.cv", "#"],
              ["Instagram", "#"],
              ["Medium", "#"],
              ["Vimeo", "#"],
            ].map(([label, href]) => (
              <li key={label}>
                <HoverLink href={href}>{label} ↗</HoverLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="leading-none select-none font-[Nyght_Serif] flex items-baseline gap-4 flex-wrap"
        style={{
          fontSize: "clamp(48px, 13vw, 220px)",
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
          fontWeight: 400,
        }}
      >
        <span className="italic">Everything is energy</span>
        <span aria-hidden style={{ fontStyle: "normal" }}>☀️</span>
      </div>

      <div className="mt-10 flex flex-col md:flex-row justify-between gap-2 italic text-[13px] opacity-60">
        <span>© 2026 Anmol Maggon</span>
        <span>Designed and built end-to-end. No handoff.</span>
      </div>
    </footer>
  );
}
