import { ArrowRight, CalendarDays, Satellite } from "lucide-react";
import { dailyCosmos } from "../data/mockData";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function DailyCosmos() {
  // NASA APOD API integration point:
  // Replace dailyCosmos with data from https://api.nasa.gov/planetary/apod
  // Expected shape: { title, date, url/hdurl, explanation, copyright }.
  return (
    <section id="daily" className="section-shell pt-20 md:pt-28">
      <Reveal>
        <SectionHeading
          eyebrow="Daily Cosmos"
          title="每日一图"
          description="把每天值得停留的一束星光归档。第一版使用 mock 数据，接口位置已为 NASA APOD 预留。"
        />
      </Reveal>

      <Reveal delay={120}>
        <GlassCard className="overflow-hidden">
          <div className="grid min-h-[30rem] lg:grid-cols-[0.9fr_1.35fr]">
            <div className="flex flex-col justify-between p-6 sm:p-7 md:p-10">
              <div>
                <div className="mb-7 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-galaxy-400/24 bg-galaxy-500/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-galaxy-400">
                    <Satellite size={14} />
                    NASA APOD Mock
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/58">
                    <CalendarDays size={14} />
                    {dailyCosmos.date}
                  </span>
                </div>
                <h3 className="font-display text-4xl font-medium text-starlight md:text-6xl">
                  {dailyCosmos.title}
                </h3>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 md:text-base">
                  {dailyCosmos.description}
                </p>
              </div>
              <button type="button" className="cosmic-text-button group mt-10">
                探索今日宇宙
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </div>
            <figure className="relative min-h-[18rem] overflow-hidden sm:min-h-[24rem]">
              <img
                src={dailyCosmos.image}
                alt={dailyCosmos.title}
                className="h-full w-full object-cover"
              />
              <figcaption className="absolute bottom-0 right-0 bg-space-950/54 px-5 py-4 text-right text-xs text-white/58 backdrop-blur-md">
                <span className="block text-starlight">{dailyCosmos.title}</span>
                <span>{dailyCosmos.credit}</span>
              </figcaption>
            </figure>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}
