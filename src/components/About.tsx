import {
  ArrowRight,
  ArrowUpRight,
  Orbit,
  Sparkles,
  Stars,
} from "lucide-react";
import { BlackHoleEntryButton } from "./black-hole/BlackHoleEntryButton";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="section-shell pb-28">
      <Reveal>
        <div className="grid gap-12 border-t border-white/[0.07] pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pt-16">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.34em] text-galaxy-400/72">
              Prologue / Star Archive
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight text-starlight sm:text-5xl md:text-6xl">
              序章
            </h2>
          </div>

          <div className="max-w-3xl">
            <Sparkles className="mb-8 text-nebula-300/68" size={28} />
            <p className="font-display text-3xl font-medium leading-snug text-starlight/88 sm:text-4xl">
              这是一座记录宇宙信号、深空影像与观测手册的数字档案馆。
            </p>
            <div className="mt-8 space-y-6 text-base leading-8 text-white/58">
              <p>
                我们收藏深空影像、宇宙档案与观测者的经验，也收藏人类在未知面前短暂的停顿。
              </p>
              <p>
                深空不是空无一物，而是时间留下的档案。每一束星光，都曾穿过漫长的黑暗，才在此刻抵达眼前。
              </p>
            </div>
            <div className="about-actions mt-10">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("home")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="about-destination-button about-destination-button-sky"
              >
                <span className="about-destination-icon" aria-hidden="true">
                  <Stars size={18} />
                </span>
                <span className="about-destination-copy">
                  <span>回到星空</span>
                  <small>STAR FIELD</small>
                </span>
                <ArrowUpRight
                  size={15}
                  className="about-destination-arrow"
                  aria-hidden="true"
                />
              </button>
              <a
                href="/solar-system"
                className="about-destination-button about-destination-button-solar"
                aria-label="进入太阳系漫游页面"
              >
                <span className="about-destination-icon" aria-hidden="true">
                  <Orbit size={18} />
                </span>
                <span className="about-destination-copy">
                  <span>太阳系</span>
                  <small>SOLAR SYSTEM</small>
                </span>
                <ArrowRight
                  size={15}
                  className="about-destination-arrow"
                  aria-hidden="true"
                />
              </a>
              <BlackHoleEntryButton />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
