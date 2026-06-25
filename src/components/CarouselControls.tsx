import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "../types/content";

interface CarouselControlsProps {
  items: GalleryItem[];
  activeIndex: number;
  progressKey: number;
  isPaused: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function CarouselControls({
  items,
  activeIndex,
  progressKey,
  isPaused,
  onPrevious,
  onNext,
}: CarouselControlsProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-4 top-1/2 z-30 hidden -translate-y-1/2 justify-between opacity-20 transition duration-700 group-hover:opacity-100 group-focus-within:opacity-100 sm:flex lg:inset-x-7">
        <button
          type="button"
          aria-label="切换到上一张深空影像"
          onClick={onPrevious}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.07] bg-space-950/[0.08] text-white/46 backdrop-blur-md transition duration-500 hover:border-galaxy-400/42 hover:bg-galaxy-500/[0.08] hover:text-white hover:shadow-[0_0_18px_rgba(58,167,255,0.16)] focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-galaxy-400/50 md:h-11 md:w-11"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="切换到下一张深空影像"
          onClick={onNext}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.07] bg-space-950/[0.08] text-white/46 backdrop-blur-md transition duration-500 hover:border-nebula-400/42 hover:bg-nebula-500/[0.08] hover:text-white hover:shadow-[0_0_18px_rgba(141,109,255,0.16)] focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-nebula-400/50 md:h-11 md:w-11"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30">
        <div className="h-px overflow-hidden bg-white/[0.055]">
          <span
            key={progressKey}
            className="gallery-progress-fill block h-full w-full origin-left bg-gradient-to-r from-transparent via-galaxy-400/36 to-nebula-400/44"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          />
        </div>
      </div>

      <div className="absolute bottom-5 right-5 z-30 flex items-center rounded-full border border-white/[0.08] bg-space-950/24 px-3 py-1.5 text-xs tracking-[0.16em] text-white/58 shadow-[0_0_22px_rgba(2,3,10,0.28)] backdrop-blur-md sm:bottom-8 sm:right-8 sm:px-3.5 md:bottom-11 md:right-12">
        <div className="flex items-center gap-1.5">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="text-white/24">/</span>
          <span>{String(items.length).padStart(2, "0")}</span>
        </div>
      </div>
    </>
  );
}
