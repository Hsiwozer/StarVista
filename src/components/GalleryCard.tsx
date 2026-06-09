import type { GalleryItem } from "../types/content";
import { GlassCard } from "./GlassCard";

interface GalleryCardProps {
  item: GalleryItem;
}

export function GalleryCard({ item }: GalleryCardProps) {
  return (
    <GlassCard interactive className="group h-full overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={`${item.subtitle} - ${item.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] uppercase text-galaxy-400">
              {item.category}
            </p>
            <h3 className="mt-1 text-lg font-medium text-starlight">
              {item.subtitle}
            </h3>
            <p className="mt-1 text-sm text-white/46">{item.title}</p>
          </div>
          <span className="shrink-0 rounded-full border border-nebula-400/24 px-3 py-1 text-xs text-nebula-300">
            {item.distance}
          </span>
        </div>
        <p className="gallery-description-clamp text-sm leading-6 text-white/58">
          {item.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-xs text-white/58 transition group-hover:border-galaxy-400/34 group-hover:text-galaxy-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
