const clients = ["AmbitionBox", "InfoEdge", "Draup", "Avathi", "Roamhome", "10K Designers"];

export function About() {
  return (
    <section id="about" className="px-6 md:px-10 py-24 md:py-40">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-3">
          <p className="eyebrow">Worked with</p>
        </div>
        <div className="md:col-span-9 flex flex-wrap items-baseline gap-x-8 gap-y-4">
          {clients.map((c, i) => (
            <span
              key={c}
              className={`font-[Nyght_Serif] text-[#171613] text-fluid-h3 leading-[1.3] font-normal tracking-[-0.01em] ${i % 3 === 1 ? "italic" : "normal-case"}`}
            >
              {c}
              <span className="opacity-30 ml-8 italic">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
