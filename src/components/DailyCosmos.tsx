import { useMemo, useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  Radio,
  Satellite,
  Tags,
} from "lucide-react";
import { getDailyCosmicItem } from "../data/cosmicDailyPool";
import { ArchiveCard } from "./ArchiveCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const FALLBACK_IMAGE = "/images/daily-cosmos.png";

export function DailyCosmos() {
  const [imageReady, setImageReady] = useState(false);
  const today = useMemo(() => new Date(), []);
  const dailyCosmos = useMemo(() => getDailyCosmicItem(today), [today]);

  return (
    <section
      id="daily"
      data-section="daily-star-news"
      className="section-shell pt-20 md:pt-28"
    >
      <span
        id="daily-star-news"
        className="pointer-events-none block h-px w-full"
        aria-hidden="true"
      />
      <Reveal>
        <SectionHeading
          eyebrow="Daily Signal"
          title="每日星讯"
          description="每日唤醒一幅来自宇宙深处的壮丽影像。"
        />
      </Reveal>

      <Reveal delay={120}>
        <ArchiveCard className="daily-signal-card overflow-hidden" interactive>
          <span className="daily-signal-scan" aria-hidden="true" />
          <span className="daily-signal-dust" aria-hidden="true" />
          <div className="grid min-h-[34rem] lg:grid-cols-[1.25fr_0.75fr]">
            <figure className="relative min-h-[24rem] overflow-hidden lg:min-h-[38rem]">
              <img
                src={dailyCosmos.image}
                alt={`${dailyCosmos.title}，${dailyCosmos.subtitle}`}
                className={`daily-media h-full w-full object-cover opacity-90 ${
                  imageReady ? "daily-media-ready" : ""
                }`}
                onLoad={() => setImageReady(true)}
                onError={(event) => {
                  if (event.currentTarget.src.endsWith(FALLBACK_IMAGE)) {
                    return;
                  }

                  setImageReady(false);
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(141,109,255,0.12),transparent_24rem),linear-gradient(0deg,rgba(2,3,10,0.82),rgba(2,3,10,0.18)_46%,rgba(2,3,10,0.02))]" />
              <figcaption className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
                <p className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-galaxy-400/80">
                  <Radio size={14} />
                  Signal Received
                </p>
                <h3 className="mt-4 max-w-2xl font-display text-4xl font-medium text-starlight sm:text-5xl md:text-6xl">
                  {dailyCosmos.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm tracking-[0.08em] text-starlight/68 sm:text-base">
                  {dailyCosmos.subtitle}
                </p>
              </figcaption>
            </figure>
            <div className="daily-signal-info flex flex-col justify-between p-6 sm:p-8 md:p-10">
              <div className="space-y-7">
                <div className="grid gap-4 border-b border-white/[0.07] pb-7 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/34">
                      <CalendarDays size={13} />
                      Received Date
                    </p>
                    <p className="text-sm text-starlight/76">
                      {formatDailyDate(today)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/34">
                      <Satellite size={13} />
                      Archive Source
                    </p>
                    <p className="text-sm text-starlight/76">{dailyCosmos.source}</p>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/34">
                      <Tags size={13} />
                      Category
                    </p>
                    <p className="text-sm text-starlight/76">{dailyCosmos.category}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/34">
                    Signal Notes
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/58 md:text-base md:leading-8">
                    {dailyCosmos.description}
                  </p>
                </div>
              </div>

              <div className="daily-signal-actions mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  className="cosmic-button cosmic-button-primary min-h-12 px-5 text-xs"
                  href={dailyCosmos.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  探索今日图源
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </div>
        </ArchiveCard>
      </Reveal>
    </section>
  );
}

function formatDailyDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year} / ${month} / ${day}`;
}
