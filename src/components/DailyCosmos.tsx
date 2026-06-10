import { CalendarDays, Radio, Satellite } from "lucide-react";
import { dailyCosmos } from "../data/mockData";
import { ArchiveCard } from "./ArchiveCard";
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
          eyebrow="Daily Cosmic Signal"
          title="今日宇宙"
          description="今日抵达地球的，不只是一张图像，也是一束来自过去的光。"
        />
      </Reveal>

      <Reveal delay={120}>
        <ArchiveCard className="overflow-hidden">
          <div className="grid min-h-[34rem] lg:grid-cols-[1.25fr_0.75fr]">
            <figure className="relative min-h-[24rem] overflow-hidden lg:min-h-[38rem]">
              <img
                src={dailyCosmos.image}
                alt={dailyCosmos.title}
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(141,109,255,0.12),transparent_24rem),linear-gradient(0deg,rgba(2,3,10,0.82),rgba(2,3,10,0.18)_46%,rgba(2,3,10,0.02))]" />
              <figcaption className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
                <p className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-galaxy-400/80">
                  <Radio size={14} />
                  Incoming Signal
                </p>
                <h3 className="mt-4 max-w-2xl font-display text-4xl font-medium text-starlight sm:text-5xl md:text-6xl">
                  {dailyCosmos.title}
                </h3>
              </figcaption>
            </figure>
            <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10">
              <div className="space-y-7">
                <div className="grid gap-4 border-b border-white/[0.07] pb-7 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/34">
                      <CalendarDays size={13} />
                      Signal Date
                    </p>
                    <p className="text-sm text-starlight/76">{dailyCosmos.date}</p>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/34">
                      <Satellite size={13} />
                      Source
                    </p>
                    <p className="text-sm text-starlight/76">{dailyCosmos.credit}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/34">
                    Description
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/58 md:text-base md:leading-8">
                    {dailyCosmos.description}
                  </p>
                </div>
              </div>

              <p className="mt-10 border-l border-galaxy-400/24 pl-4 text-sm leading-7 text-white/42">
                每一束星光，都是来自过去的回声。
              </p>
            </div>
          </div>
        </ArchiveCard>
      </Reveal>
    </section>
  );
}
