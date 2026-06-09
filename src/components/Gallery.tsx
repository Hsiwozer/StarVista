import { galleryItems } from "../data/galleryData";
import { CosmicCarousel } from "./CosmicCarousel";
import { GalleryCard } from "./GalleryCard";
import { Reveal } from "./Reveal";

export function Gallery() {
  return (
    <section
      id="gallery"
      className="relative overflow-hidden px-5 py-14 md:px-8 md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(58,167,255,0.12),transparent_24rem),radial-gradient(circle_at_78%_8%,rgba(141,109,255,0.18),transparent_30rem),linear-gradient(180deg,rgba(2,3,10,0),rgba(2,3,10,0.62)_48%,rgba(2,3,10,0))]"
        aria-hidden="true"
      />
      <div className="gallery-dust-layer pointer-events-none absolute inset-0 opacity-45" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
            <p className="mb-3 text-xs uppercase text-galaxy-400">
              Deep Space Gallery
            </p>
            <h2 className="font-display text-[clamp(2.5rem,8vw,4.25rem)] font-medium text-starlight">
              星空图库
            </h2>
            <p className="mt-2 font-display text-2xl text-nebula-300/82 sm:text-3xl">
              Deep Space Gallery
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/58 md:text-base">
              在星云、星系与深空天体之间，收藏来自宇宙深处的光。
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <CosmicCarousel items={galleryItems} />
        </Reveal>

        <div className="mt-16 md:mt-24">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end md:mb-10">
              <div>
                <p className="mb-3 text-xs uppercase text-galaxy-400">
                  Curated Archive
                </p>
                <h3 className="font-display text-4xl font-medium text-starlight md:text-5xl">
                  精选深空影像
                </h3>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/56">
                从轮播展厅中快速浏览星云、星系、月球、行星、黑洞与深空天体。
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item, index) => (
              <Reveal key={item.id} delay={index * 60}>
                <GalleryCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
