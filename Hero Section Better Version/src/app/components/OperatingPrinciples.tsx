type Principle = {
  title: string;
  detail: string;
};

const principles: Principle[] = [
  {
    title: "Unreasonable Hospitality",
    detail: "Borrowed from Will Guidara. The bar is delight, not adequacy.",
  },
  {
    title: "Nothing changes if nothing changes",
    detail: "If the same approach keeps producing the same outcome, change the approach.",
  },
  {
    title: "Ownership",
    detail: "Ship the thing. Don't wait for someone else's calendar to free up.",
  },
  {
    title: "Everything is energy",
    detail: "Rooms have a temperature. Pages have a pulse. Mind it.",
  },
  {
    title: "Honest communication",
    detail: "Say the real thing kindly. Polite vagueness is a tax everyone pays later.",
  },
];

export function OperatingPrinciples() {
  return (
    <section id="principles" className="px-6 md:px-10 py-24 md:py-40">
      <div className="mb-12 md:mb-20 max-w-4xl">
        <p
          className="font-[Nyght_Serif]"
          style={{
            fontSize: "clamp(28px, 4vw, 60px)",
            lineHeight: 1.05,
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          Five lines I keep coming back to
          <em className="italic" style={{ color: "#fe4638" }}>
            .
          </em>
        </p>
      </div>

      <ol className="space-y-0">
        {principles.map((p, i) => (
          <li
            key={p.title}
            className="group grid grid-cols-12 items-baseline gap-4 md:gap-8 py-8 md:py-10 border-t border-black/15 last:border-b last:border-black/15 transition-colors hover:bg-black/[0.02]"
          >
            <span className="col-span-2 md:col-span-1 italic numeral text-[14px] md:text-[15px] opacity-50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3
              className="col-span-10 md:col-span-6 font-[Nyght_Serif]"
              style={{
                fontSize: "clamp(28px, 4vw, 60px)",
                lineHeight: 1.05,
                fontWeight: i % 2 === 1 ? 400 : 400,
                fontStyle: i % 2 === 1 ? "italic" : "normal",
                letterSpacing: "-0.02em",
              }}
            >
              {p.title}
            </h3>
            <p
              className="col-span-12 md:col-span-5 italic opacity-60 max-w-md"
              style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.5 }}
            >
              {p.detail}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
