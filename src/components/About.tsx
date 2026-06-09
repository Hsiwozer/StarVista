import { ArrowUpRight, Sparkles } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="section-shell pb-24">
      <Reveal>
        <GlassCard className="overflow-hidden">
          <div className="grid gap-8 p-6 sm:p-7 md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-14">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.34em] text-galaxy-400">
                About Star Archive
              </p>
              <h2 className="font-display text-4xl font-medium leading-tight text-starlight md:text-6xl">
                为每一次仰望，留下一份安静的档案。
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/62">
                星空档案馆希望把天文知识、宇宙影像与观星经验整理成一个缓慢而清晰的空间。它不追逐喧闹的答案，而是邀请每个人在星光下停留片刻，重新感受尺度、时间与探索的温柔。
              </p>
            </div>
            <div className="relative min-h-72 overflow-hidden rounded-lg border border-white/10">
              <img
                src="/images/hero-nebula.png"
                alt="星空档案馆的深空背景"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-space-950/44" />
              <div className="relative flex h-full flex-col justify-between p-6">
                <Sparkles className="text-nebula-300" size={30} />
                <div>
                  <p className="text-sm uppercase tracking-[0.34em] text-white/50">
                    Archive Note
                  </p>
                  <p className="mt-4 max-w-sm text-2xl font-light leading-snug text-starlight">
                    宇宙并不遥远，它每天都在夜空中等待我们抬头。
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("home")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="cosmic-button cosmic-button-secondary mt-8 min-h-12 px-5 py-3"
                  >
                    回到星空
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}
