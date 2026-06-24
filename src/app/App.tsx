import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";
import { Nav } from "./components/Nav";

const CaseStudies = lazy(() => import("./components/CaseStudies").then(m => ({ default: m.CaseStudies })));
const TechStackJar = lazy(() => import("./components/TechStackJar").then(m => ({ default: m.TechStackJar })));
const OperatingPrinciples = lazy(() => import("./components/OperatingPrinciples").then(m => ({ default: m.OperatingPrinciples })));
const ClosingScene = lazy(() => import("./components/ClosingScene").then(m => ({ default: m.ClosingScene })));

import { StickyNote } from "./components/StickyNote";
import { Loader } from "./components/Loader";
import { SmoothScroll } from "./components/SmoothScroll";
import { GlobalProvider } from "./context/GlobalContext";
import { MediaViewerModal } from "./components/MediaViewerModal";
import { HeroScrubPrototype } from "./components/hero/HeroScrubPrototype";

function HomePage() {
  return (
    <>
      <main>
        <HeroScrubPrototype />
        <Suspense fallback={<div className="min-h-screen bg-[#fafaf7]" />}>
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
        </Suspense>
      </main>
      {/* <StickyNote /> Temporarily hidden per request */}
    </>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <SmoothScroll>
        <div className="min-h-screen w-full bg-[#fafaf7] text-black antialiased">
          <MediaViewerModal />
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </SmoothScroll>
      <Loader />
      <Analytics />
      <SpeedInsights />
    </GlobalProvider>
  );
}
