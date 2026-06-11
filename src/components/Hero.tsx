import { ArrowDown } from "lucide-react";
import { Reveal } from "./Reveal";

const explorationPath = [
  {
    id: "01",
    title: "地球夜空",
    text: "从熟悉的黑夜出发，辨认第一颗安静的亮星。",
  },
  {
    id: "02",
    title: "月球与行星",
    text: "近处的光，有山脉、环带与缓慢移动的轨道。",
  },
  {
    id: "03",
    title: "星云与恒星诞生",
    text: "尘埃发光，年轻恒星在深处点亮第一阵风。",
  },
  {
    id: "04",
    title: "星系与深空",
    text: "光年之外，旋臂把时间整理成巨大的档案。",
  },
  {
    id: "05",
    title: "黑洞与未知宇宙",
    text: "在看不见的边界，宇宙保留最后的沉默。",
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-space-950"
      aria-label="星空档案馆首页"
    >
      <div className="absolute inset-0 min-h-screen">
        <img
          src="/images/hero-nebula.png"
          alt="紫蓝色星云与深夜星空"
          className="h-full w-full object-cover opacity-72"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_20%,rgba(141,109,255,0.10),transparent_26rem),linear-gradient(90deg,rgba(2,3,10,0.92)_0%,rgba(2,3,10,0.64)_48%,rgba(2,3,10,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,10,0.18)_0%,rgba(2,3,10,0.24)_58%,rgba(2,3,10,0.76)_84%,#02030a_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 pb-24 pt-28 sm:pb-28 md:px-8 md:pt-32">
        <div className="w-full max-w-3xl animate-float-in">
          <p className="mb-5 text-[0.68rem] uppercase tracking-[0.42em] text-galaxy-400/80 sm:text-xs sm:tracking-[0.48em]">
            Deep Space Archive
          </p>
          <h1 className="font-display text-6xl font-medium leading-[0.94] text-starlight sm:text-7xl md:text-8xl lg:text-9xl">
            星空档案馆
            <span className="mt-3 block text-5xl text-white/84 sm:text-6xl md:text-7xl lg:text-8xl">
              Star Archive
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 tracking-[0.14em] text-white/66 sm:mt-8 md:text-xl">
            在寂静之外，宇宙正在低语。
          </p>
          <button
            type="button"
            onClick={() => scrollToSection("archive-path")}
            className="cosmic-button cosmic-button-primary group mt-11"
          >
            进入星空档案馆
            <ArrowDown
              size={17}
              className="transition duration-500 group-hover:translate-y-1"
            />
          </button>
        </div>
      </div>

      <div
        id="archive-path"
        className="relative z-10 mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32"
      >
        <div className="mx-auto max-w-[1240px] text-center">
          <Reveal distance="short">
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-galaxy-400/70">
              Archive Route
            </p>
            <h2 className="archive-route-heading mt-4 text-balance font-display text-[clamp(2.5rem,8vw,4.1rem)] font-medium leading-[1.04] text-starlight md:whitespace-nowrap md:text-[clamp(3.5rem,5vw,6rem)] md:leading-[0.98]">
              从地球出发，逐渐进入深空。
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-5">
          {explorationPath.map((item, index) => (
            <Reveal key={item.id} delay={index * 90} distance="short">
              <article className="archive-route-item group relative min-h-52 overflow-hidden border-l border-white/[0.055] bg-transparent p-5 md:min-h-72">
                <span className="archive-route-scan" aria-hidden="true" />
                <span className="relative z-10 block font-display text-4xl text-white/16 transition duration-[520ms] ease-out group-hover:translate-x-0.5 group-hover:text-galaxy-400/45">
                  {item.id}
                </span>
                <h3 className="relative z-10 mt-10 text-lg font-medium text-starlight/84 transition duration-[520ms] ease-out group-hover:translate-x-1 group-hover:text-starlight/92">
                  {item.title}
                </h3>
                <p className="relative z-10 mt-4 text-sm leading-7 text-white/46 transition-colors duration-[520ms] ease-out group-hover:text-white/64">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
