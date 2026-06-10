import { Clock3, FileText } from "lucide-react";
import { articleItems } from "../data/mockData";
import { ArchiveCard } from "./ArchiveCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Articles() {
  return (
    <section id="articles" className="section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Cosmic Archives"
          title="天文文章"
          description="我们试图用有限的语言，记录无限宇宙的轮廓。"
        />
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articleItems.map((article, index) => (
          <Reveal key={article.title} delay={index * 60}>
            <ArchiveCard interactive className="group h-full min-h-[25rem] overflow-hidden p-5 sm:p-6">
              <div className="absolute inset-0 opacity-[0.13] transition duration-700 group-hover:opacity-[0.22]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,10,0.28),#02030a_88%)]" />
              </div>

              <div className="flex h-full flex-col">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-galaxy-400/70">
                      {article.archiveId}
                    </p>
                    <p className="mt-2 text-xs text-white/38">{article.category}</p>
                  </div>
                  <FileText size={18} className="text-white/22 transition duration-700 group-hover:text-galaxy-400/60" />
                </div>

                <h3 className="text-2xl font-medium leading-snug text-starlight/88 transition duration-700 group-hover:text-starlight">
                  {article.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/52 transition duration-700 group-hover:text-white/66">
                  {article.excerpt}
                </p>

                <div className="mt-auto pt-8">
                  <div className="mb-5 h-px w-full bg-gradient-to-r from-white/[0.04] via-white/[0.12] to-transparent" />
                  <div className="flex items-center justify-between gap-4 text-xs text-white/38">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={14} />
                      {article.readingTime}
                    </span>
                    <span className="tracking-[0.18em] text-white/28">OBSERVATION NOTE</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 opacity-80 transition duration-700 group-hover:opacity-100">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-white/[0.07] px-3 py-1 text-xs text-white/38 transition group-hover:border-galaxy-400/18 group-hover:text-white/52"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ArchiveCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
