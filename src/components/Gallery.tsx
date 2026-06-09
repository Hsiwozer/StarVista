import { useMemo, useState } from "react";
import { galleryItems } from "../data/mockData";
import type { GalleryCategory } from "../types/content";
import { GlassCard } from "./GlassCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const categories: Array<"全部" | GalleryCategory> = [
  "全部",
  "星云",
  "星系",
  "月球",
  "行星",
];

export function Gallery() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("全部");

  const filteredItems = useMemo(() => {
    if (activeCategory === "全部") {
      return galleryItems;
    }
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="gallery" className="section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Gallery"
          title="星空图库"
          description="从星云到行星，把宇宙中的形状、颜色与尺度收藏成可浏览的星光索引。"
        />
      </Reveal>

      <Reveal delay={80}>
        <div className="mb-9 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`cosmic-filter-button ${
                activeCategory === category
                  ? "cosmic-filter-button-active"
                  : "border-white/10 bg-white/[0.035] text-white/58"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <Reveal key={item.title} delay={index * 70}>
            <GlassCard interactive className="group h-full overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-medium text-starlight">
                    {item.title}
                  </h3>
                  <span className="rounded-full border border-nebula-400/24 px-3 py-1 text-xs text-nebula-300">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm leading-6 text-white/58">
                  {item.description}
                </p>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
