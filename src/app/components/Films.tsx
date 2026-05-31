type Film = {
  title: string;
  subtitle: string;
  year: string;
  videoId: string;
};

const films: Film[] = [
  {
    title: "Andar Ka Bacha",
    subtitle: "Inner Child · Kashmir Great Lakes",
    year: "2023",
    videoId: "DewKKNubwWE",
  },
  {
    title: "Looking for Love",
    subtitle: "Modern dating, the mirage of escape",
    year: "2024",
    videoId: "aB5HRpTt9Qw",
  },
  {
    title: "D.I.F.Y.",
    subtitle: "Do It For Yourself · Nagaland & Meghalaya",
    year: "2025",
    videoId: "XlFoZaffzJA",
  },
];

export function Films() {
  return (
    <section id="films" className="px-6 md:px-10 pt-8 md:pt-12 pb-24 md:pb-40">
      <div className="flex items-baseline justify-between mb-12 md:mb-20">
        <p className="eyebrow">Films</p>
        <p className="eyebrow opacity-50 max-w-xs text-right">Side practice. Same instinct.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {films.map((f) => (
          <div key={f.videoId} className="group">
            <div className="relative w-full overflow-hidden rounded-[16px] bg-black aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${f.videoId}?modestbranding=1&rel=0`}
                title={f.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
            <div className="pt-6 flex items-baseline justify-between gap-4">
              <h3
                className="font-[Nyght_Serif]"
                style={{
                  fontSize: "clamp(24px, 2.4vw, 36px)",
                  lineHeight: 1.05,
                  fontWeight: 400,
                  letterSpacing: "-0.015em",
                }}
              >
                {f.title}
              </h3>
              <span className="italic numeral text-[14px] opacity-60">{f.year}</span>
            </div>
            <p className="italic text-[15px] opacity-60 mt-2" style={{ fontWeight: 400 }}>
              {f.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
