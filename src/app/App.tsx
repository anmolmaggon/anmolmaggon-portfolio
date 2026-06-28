import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";
import { Nav } from "./components/Nav";
// CaseStudies peeks right below the hero (above the fold) — import it directly so it's
// present on first paint instead of streaming in as a lazy chunk (no blank gap).
import { CaseStudies } from "./components/CaseStudies";
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
        <Suspense fallback={<div className="min-h-screen bg-brand-light" />}>
          <CaseStudies />
          <TechStackJar />
          <OperatingPrinciples />

          <div
            data-nav-theme="dark"
            className="soul-world relative overflow-clip bg-brand-dark text-surface-loader"
            style={{
              background:
                "linear-gradient(180deg, var(--p-ink) 0%, var(--p-night-2) 42%, var(--p-night) 78%, var(--p-night) 100%)",
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
        <div className="min-h-screen w-full bg-brand-light text-ink antialiased">
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
