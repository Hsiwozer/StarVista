import {
  Aperture,
  Binoculars,
  Camera,
  Map,
  MoonStar,
  Telescope,
} from "lucide-react";
import { guideItems } from "../data/mockData";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const icons = [Binoculars, MoonStar, Map, Telescope, Camera];

export function Guide() {
  return (
    <section id="guide" className="section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Guide"
          title="观星指南"
          description="把第一次仰望变得更从容：地点、时间、工具、识别方法和拍摄方式，都从可实践的小步骤开始。"
        />
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {guideItems.map((item, index) => {
          const Icon = icons[index] ?? Aperture;
          return (
            <Reveal key={item.title} delay={index * 80}>
              <GlassCard interactive className="h-full p-5 sm:p-6">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-galaxy-400/22 bg-galaxy-500/10 text-galaxy-400">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-medium text-starlight">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/58">
                  {item.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {item.details.map((detail) => (
                    <li
                      key={detail}
                      className="border-l border-nebula-400/32 pl-3 text-sm text-white/54"
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
