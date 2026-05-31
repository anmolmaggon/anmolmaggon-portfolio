import { Hero3D } from "./Hero3D";

export function Hero() {
  return (
    <section id="top" className="relative w-full">
      <div className="relative w-full h-[100svh] min-h-[640px] bg-[#0a0a0c] overflow-hidden">
        <div className="absolute inset-0">
          <Hero3D />
        </div>

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="absolute left-0 right-0 bottom-0 px-6 md:px-10 pb-20 md:pb-24 pointer-events-none">
          <h1
            className="font-[Nyght_Serif] text-white max-w-5xl"
            style={{
              fontSize: "clamp(40px, 7vw, 116px)",
              lineHeight: 1.0,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              textShadow:
                "0 0 18px rgba(255,255,255,0.55), 0 0 48px rgba(255,180,116,0.35), 0 0 90px rgba(255,120,80,0.2)",
            }}
          >
            I make things that
            <br />
            <span style={{ fontWeight: 500 }}>
              blow people's mind
            </span>
            .
          </h1>
        </div>
      </div>
    </section>
  );
}
