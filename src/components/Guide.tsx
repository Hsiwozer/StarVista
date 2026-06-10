import {
  Aperture,
  Binoculars,
  Camera,
  Map,
  MoonStar,
  ShieldCheck,
  Telescope,
} from "lucide-react";
import { guideItems } from "../data/mockData";
import { ArchiveCard } from "./ArchiveCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const icons = [Binoculars, MoonStar, Map, Telescope, Camera, ShieldCheck];

export function Guide() {
  return (
    <section id="guide" className="section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Observer's Manual"
          title="观星指南"
          description="仰望星空之前，先学会在黑暗中等待。"
        />
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {guideItems.map((item, index) => {
          const Icon = icons[index] ?? Aperture;
          return (
            <Reveal key={item.title} delay={index * 80}>
              <ArchiveCard interactive className="group h-full min-h-[21rem] p-5 sm:p-6">
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-nebula-300/66">
                      {item.manualId}
                    </p>
                    <h3 className="mt-4 text-2xl font-medium text-starlight/88 transition duration-700 group-hover:text-starlight">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-galaxy-400/14 bg-galaxy-500/[0.04] text-galaxy-400/56 transition duration-700 group-hover:border-galaxy-400/28 group-hover:text-galaxy-400">
                    <Icon size={21} />
                  </div>
                </div>
                <p className="text-sm leading-7 text-white/52 transition duration-700 group-hover:text-white/66">
                  {item.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {item.details.map((detail) => (
                    <li
                      key={detail}
                      className="border-l border-nebula-400/20 pl-3 text-sm text-white/46 transition duration-700 group-hover:border-nebula-400/38 group-hover:text-white/62"
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              </ArchiveCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
