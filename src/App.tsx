import { lazy, Suspense, useEffect, useState } from "react";
import { About } from "./components/About";
import { Articles } from "./components/Articles";
import { DailyCosmos } from "./components/DailyCosmos";
import { Gallery } from "./components/Gallery";
import { Guide } from "./components/Guide";
import { Hero } from "./components/Hero";
import { NavBar } from "./components/NavBar";
import { CosmicBackground } from "./components/CosmicBackground";

const SolarSystemPage = lazy(() =>
  import("./components/solar-system/SolarSystemPage").then((module) => ({
    default: module.SolarSystemPage,
  })),
);

const BlackHolePage = lazy(() =>
  import("./components/black-hole/BlackHolePage").then((module) => ({
    default: module.BlackHolePage,
  })),
);

function App() {
  const pathname = window.location.pathname;
  const [homeReady, setHomeReady] = useState(false);

  useEffect(() => {
    if (pathname === "/solar-system" || pathname === "/black-hole") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHomeReady(true);
      return;
    }

    const readyTimer = window.setTimeout(() => setHomeReady(true), 80);
    return () => window.clearTimeout(readyTimer);
  }, [pathname]);

  if (pathname === "/solar-system") {
    return (
      <Suspense
        fallback={
          <main className="min-h-screen bg-space-950 text-starlight" />
        }
      >
        <SolarSystemPage />
      </Suspense>
    );
  }

  if (pathname === "/black-hole") {
    return (
      <Suspense
        fallback={
          <main className="min-h-screen bg-space-950 text-starlight" />
        }
      >
        <BlackHolePage />
      </Suspense>
    );
  }

  return (
    <main
      className={`app-shell ${homeReady ? "app-ready" : "app-enter"} relative isolate min-h-screen overflow-hidden bg-space-950 text-starlight`}
    >
      <CosmicBackground fixed quiet />
      <NavBar />
      <div className="relative z-10">
        <Hero ready={homeReady} />
        <DailyCosmos />
        <Gallery />
        <Articles />
        <Guide />
        <About />
      </div>
    </main>
  );
}

export default App;
