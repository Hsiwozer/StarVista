import { Clock3 } from "lucide-react";
import { articleItems } from "../data/mockData";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Articles() {
  return (
    <section id="articles" className="section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Articles"
          title="宇宙科普"
          description="用可读、克制的方式解释天文概念：从太阳系的邻近事物，到黑洞与宇宙起源的遥远问题。"
        />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {articleItems.map((article, index) => (
          <Reveal key={article.title} delay={index * 60}>
            <GlassCard interactive className="group h-full overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover opacity-88 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4 text-xs">
                  <span className="rounded-full bg-nebula-500/12 px-3 py-1 text-nebula-300">
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-2 text-white/45">
                    <Clock3 size={14} />
                    {article.readingTime}
                  </span>
                </div>
                <h3 className="text-xl font-medium leading-snug text-starlight">
                  {article.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/58">
                  {article.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/48"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
