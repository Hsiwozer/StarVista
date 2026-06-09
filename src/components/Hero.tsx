import { ArrowRight } from "lucide-react";
import { CosmicBackground } from "./CosmicBackground";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen overflow-hidden bg-space-950"
      aria-label="星空档案馆首页"
    >
      <img
        src="/images/hero-nebula.png"
        alt="紫蓝色星云与深夜星空"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,3,10,0.88)_0%,rgba(2,3,10,0.52)_45%,rgba(2,3,10,0.24)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,10,0.08)_0%,rgba(2,3,10,0.12)_58%,#02030a_100%)]" />
      <CosmicBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 pb-20 pt-28 sm:pb-24 md:px-8 md:pt-32">
        <div className="w-full max-w-3xl animate-float-in">
          <p className="mb-4 text-[0.68rem] uppercase tracking-[0.42em] text-galaxy-400 sm:mb-5 sm:text-xs sm:tracking-[0.48em]">
            Quiet Nebula Story
          </p>
          <h1 className="font-display text-[clamp(4.1rem,17vw,8.75rem)] font-medium leading-[0.94] text-starlight">
            星空档案馆
            <span className="mt-2 block text-[0.82em]">Star Archive</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 tracking-[0.12em] text-white/76 sm:mt-8 sm:tracking-[0.16em] md:text-2xl">
            记录星光、宇宙与人类的仰望
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollToSection("daily")}
              className="cosmic-button cosmic-button-primary group"
            >
              今日宇宙
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("gallery")}
              className="cosmic-button cosmic-button-secondary group"
            >
              星空图库
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
