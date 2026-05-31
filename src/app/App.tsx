import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { CaseStudies } from "./components/CaseStudies";
import { TechStack } from "./components/TechStack";
import { OperatingPrinciples } from "./components/OperatingPrinciples";
import { Films } from "./components/Films";
import { Photography } from "./components/Photography";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import { StickyNote } from "./components/StickyNote";
import { SmoothScroll } from "./components/SmoothScroll";

function SoulIntro() {
  return (
    <section className="relative px-6 md:px-10 pt-32 md:pt-48 pb-12 md:pb-20 overflow-hidden">
      {/* dreamy glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[60vh] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(254,70,56,0.18) 0%, rgba(120,90,200,0.12) 35%, rgba(12,11,13,0) 70%)",
        }}
      />
      <div className="relative max-w-4xl">
        <p className="eyebrow opacity-60 mb-6">Off the clock</p>
        <h2
          className="font-[Nyght_Serif]"
          style={{
            fontSize: "clamp(34px, 6vw, 96px)",
            lineHeight: 1.02,
            fontWeight: 400,
            letterSpacing: "-0.03em",
          }}
        >
          Same instinct,
          <br />
          <span className="italic" style={{ color: "#fe4638" }}>
            no brief
          </span>
          .
        </h2>
        <p
          className="italic opacity-60 mt-8 max-w-xl"
          style={{ fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: 1.55 }}
        >
          When the work is done, I'm still chasing the same feeling — just with a
          camera instead of a cursor.
        </p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <SmoothScroll>
    <div className="min-h-screen w-full bg-[#fafaf7] text-black antialiased">
      <Nav />
      <main>
        <Hero />
        <CaseStudies />
        <TechStack />
        <OperatingPrinciples />
        <About />

        {/* ── Soul world ── */}
        <div className="soul-world relative bg-[#0c0b0d] text-[#f5f3ee]">
          <SoulIntro />
          <Films />
          <Photography />
          <Footer />
        </div>
      </main>
      <StickyNote />
    </div>
    </SmoothScroll>
  );
}
