import { galleryItems } from "../data/galleryData";
import { CosmicCarousel } from "./CosmicCarousel";
import { Reveal } from "./Reveal";

export function Gallery() {
  return (
    <section
      id="gallery"
      className="relative overflow-hidden px-5 py-12 md:px-8 md:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(58,167,255,0.12),transparent_24rem),radial-gradient(circle_at_78%_8%,rgba(141,109,255,0.18),transparent_30rem),linear-gradient(180deg,rgba(2,3,10,0),rgba(2,3,10,0.62)_48%,rgba(2,3,10,0))]"
        aria-hidden="true"
      />
      <div className="gallery-dust-layer pointer-events-none absolute inset-0 opacity-45" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto mb-7 max-w-2xl text-center md:mb-9">
            <h2 className="font-display text-4xl font-medium text-starlight sm:text-5xl md:text-6xl">
              星空图库
            </h2>
            <p className="mt-1 font-display text-xl text-nebula-300/76 sm:text-2xl">
              Deep Space Gallery
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/54 md:text-base">
              图像先于语言抵达。悬停时，档案会在暗处慢慢显影。
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <CosmicCarousel items={galleryItems} />
        </Reveal>

        <p className="mx-auto mt-6 max-w-lg text-center text-xs tracking-[0.18em] text-white/24">
          DEEP SPACE EXHIBITION / HOVER TO REVEAL
        </p>
      </div>
    </section>
  );
}
