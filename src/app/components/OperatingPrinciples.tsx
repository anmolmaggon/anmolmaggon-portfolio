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
    title: "Be a Goldfish",
    detail: "Ted Lasso's line. Shortest memory in the room — drop the last mistake, take the next shot.",
  },
  {
    title: "Everything is energy",
    detail: "Rooms have a temperature. Pages have a pulse. Mind it.",
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
          A few words I keep coming back to
          <em className="italic" style={{ color: "#fe4638" }}>
            .
          </em>
        </p>
      </div>

      <ol className="space-y-0">
        {principles.map((p, i) => (
          <li
            key={p.title}
            className="group relative grid grid-cols-12 items-baseline gap-4 md:gap-8 py-10 md:py-14 border-t border-black/15 last:border-b last:border-black/15 transition-colors duration-500"
          >
            {/* hover wash */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-[-12px] inset-y-0 -z-10 rounded-2xl bg-black/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <span
              className="col-span-2 md:col-span-1 italic numeral text-[14px] md:text-[15px] transition-colors duration-500 opacity-40 group-hover:opacity-100"
              style={{ color: "inherit" }}
            >
              <span className="transition-colors duration-500 group-hover:text-[#fe4638]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </span>

            <h3
              className="col-span-10 md:col-span-6 font-[Nyght_Serif] flex items-baseline gap-4 transition-colors duration-500 text-black/35 group-hover:text-black"
              style={{
                fontSize: "clamp(30px, 4.6vw, 68px)",
                lineHeight: 1.02,
                fontWeight: 400,
                fontStyle: i % 2 === 1 ? "italic" : "normal",
                letterSpacing: "-0.025em",
              }}
            >
              <span
                aria-hidden
                className="font-[Nyght_Serif] inline-block opacity-0 -translate-x-3 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                style={{ color: "#fe4638", fontSize: "0.5em", lineHeight: 1 }}
              >
                →
              </span>
              <span>{p.title}</span>
            </h3>

            <p
              className="col-span-12 md:col-span-5 italic max-w-md transition-all duration-500 opacity-50 group-hover:opacity-80 md:translate-y-1 md:group-hover:translate-y-0"
              style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.5 }}
            >
              {p.detail}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
