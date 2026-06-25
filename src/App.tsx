import { lazy, Suspense } from "react";
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
  if (window.location.pathname === "/solar-system") {
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

  if (window.location.pathname === "/black-hole") {
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
    <main className="app-shell relative isolate min-h-screen overflow-hidden bg-space-950 text-starlight">
      <CosmicBackground fixed quiet />
      <NavBar />
      <div className="relative z-10">
        <Hero />
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
