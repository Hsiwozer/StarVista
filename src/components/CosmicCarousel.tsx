import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "../types/content";
import { CarouselControls } from "./CarouselControls";

const AUTOPLAY_DELAY = 8000;
const SWIPE_THRESHOLD = 48;

interface CosmicCarouselProps {
  items: GalleryItem[];
}

export function CosmicCarousel({ items }: CosmicCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const resetProgress = useCallback(() => {
    setProgressKey((key) => key + 1);
  }, []);

  const selectSlide = useCallback(
    (index: number) => {
      setActiveIndex((index + items.length) % items.length);
      resetProgress();
    },
    [items.length, resetProgress],
  );

  const showPrevious = useCallback(() => {
    setActiveIndex((index) => (index - 1 + items.length) % items.length);
    resetProgress();
  }, [items.length, resetProgress]);

  const showNext = useCallback(() => {
    setActiveIndex((index) => (index + 1) % items.length);
    resetProgress();
  }, [items.length, resetProgress]);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timeout = window.setTimeout(() => {
      showNext();
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timeout);
  }, [isPaused, progressKey, showNext]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        showPrevious();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showNext, showPrevious]);

  const activeItem = items[activeIndex];

  return (
    <div
      className="group relative min-h-[58vh] overflow-hidden rounded-lg bg-space-900 shadow-[0_34px_110px_rgba(2,3,10,0.58)] sm:min-h-[64vh] md:h-[74vh] md:min-h-[42rem] lg:h-[78vh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        setIsPaused(true);
      }}
      onTouchEnd={(event) => {
        const touchStart = touchStartRef.current;
        const touch = event.changedTouches[0];
        touchStartRef.current = null;
        setIsPaused(false);

        if (!touchStart) {
          return;
        }

        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;
        if (
          Math.abs(deltaX) > SWIPE_THRESHOLD &&
          Math.abs(deltaX) > Math.abs(deltaY) * 1.4
        ) {
          if (deltaX > 0) {
            showPrevious();
          } else {
            showNext();
          }
        }
      }}
    >
      <div className="absolute inset-0">
        {items.map((item, index) => (
          <img
            key={item.id}
            src={item.image}
            alt={`${item.subtitle} - ${item.title}`}
            loading={index === 0 ? "eager" : "lazy"}
            onError={(event) => {
              event.currentTarget.src = "/images/spiral-galaxy.png";
            }}
            className={`absolute inset-0 h-full w-full object-cover transition duration-1000 ease-out ${
              activeIndex === index
                ? "scale-100 opacity-100 gallery-ken-burns"
                : "scale-105 opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(141,109,255,0.08),transparent_30rem),linear-gradient(90deg,rgba(2,3,10,0.54),transparent_48%),linear-gradient(0deg,rgba(2,3,10,0.9),rgba(2,3,10,0.34)_34%,rgba(2,3,10,0.06)_68%)]" />
      <div
        className="gallery-dust-layer absolute inset-0 opacity-[0.34]"
        aria-hidden="true"
      />

      <div className="relative z-20 flex h-full min-h-[58vh] items-end px-5 pb-16 pt-10 sm:min-h-[64vh] sm:px-8 sm:pb-16 md:h-full md:min-h-0 md:px-14 md:pb-16 lg:px-20 lg:pb-20">
        <div
          key={activeItem.id}
          className="gallery-info-panel w-full max-w-2xl"
        >
          <h3 className="gallery-panel-copy gallery-title-shadow font-display text-4xl font-medium text-starlight sm:text-5xl md:text-6xl lg:text-7xl">
            {activeItem.title}
          </h3>
          <p className="gallery-panel-copy gallery-title-shadow mt-2 text-lg text-white/78 sm:text-2xl md:text-3xl">
            {activeItem.subtitle}
          </p>

          <div className="gallery-detail-reveal mt-4 max-w-xl sm:mt-5">
            <div className="mb-3 hidden flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/42 sm:flex">
              <span>{activeItem.category}</span>
              <span className="h-1 w-1 rounded-full bg-white/24" />
              <span>{activeItem.distance}</span>
            </div>
            <p className="gallery-description-clamp text-sm leading-6 text-white/66 sm:text-base sm:leading-7">
              {activeItem.description}
            </p>
            <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
              {activeItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1 text-xs text-white/42 transition group-hover:text-white/58"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      <CarouselControls
        items={items}
        activeIndex={activeIndex}
        progressKey={progressKey}
        isPaused={isPaused}
        onPrevious={showPrevious}
        onNext={showNext}
        onSelect={selectSlide}
      />
    </div>
  );
}
