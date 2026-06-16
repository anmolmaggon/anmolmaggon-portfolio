import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { CaseStudies } from "./components/CaseStudies";
import { TechStackJar } from "./components/TechStackJar";
import { OperatingPrinciples } from "./components/OperatingPrinciples";
import { ClosingScene } from "./components/ClosingScene";
import { StickyNote } from "./components/StickyNote";
import { SmoothScroll } from "./components/SmoothScroll";
import { GlobalProvider } from "./context/GlobalContext";
import { GlobalAudio } from "./components/GlobalAudio";
import { MediaViewerModal } from "./components/MediaViewerModal";

export default function App() {
  return (
    <GlobalProvider>
      <SmoothScroll>
        <div className="min-h-screen w-full bg-[#fafaf7] text-black antialiased">
          <GlobalAudio />
          <MediaViewerModal />
          <Nav />
      <main>
        <Hero />
        <CaseStudies />
        <TechStackJar />
        <OperatingPrinciples />

        <div
          data-nav-theme="dark"
          className="soul-world relative overflow-clip bg-[#06110f] text-[#f5f3ee]"
          style={{
            background:
              "linear-gradient(180deg, #06110f 0%, #071018 42%, #0c0b0d 78%, #0c0b0d 100%)",
          }}
        >
          <ClosingScene />
        </div>
      </main>
      {/* <StickyNote /> Temporarily hidden per request */}
        </div>
      </SmoothScroll>
      <Analytics />
      <SpeedInsights />
    </GlobalProvider>
  );
}
