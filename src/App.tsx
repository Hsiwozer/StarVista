import { About } from "./components/About";
import { Articles } from "./components/Articles";
import { DailyCosmos } from "./components/DailyCosmos";
import { Gallery } from "./components/Gallery";
import { Guide } from "./components/Guide";
import { Hero } from "./components/Hero";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-space-950 text-starlight">
      <NavBar />
      <Hero />
      <DailyCosmos />
      <Gallery />
      <Articles />
      <Guide />
      <About />
    </main>
  );
}

export default App;
