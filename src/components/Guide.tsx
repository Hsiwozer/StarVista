import { ManualTimeline } from "./ManualTimeline";
import { ObservationStatus } from "./ObservationStatus";
import { Reveal } from "./Reveal";

export function Guide() {
  return (
    <section id="guide" className="section-shell">
      <div className="pointer-events-none absolute inset-x-0 top-4 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(141,109,255,0.16),transparent_34rem)]" />
      <div className="pointer-events-none absolute right-8 top-24 h-40 w-40 rounded-full bg-galaxy-500/[0.045] blur-3xl" />

      <Reveal>
        <div className="relative mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <p className="mb-3 text-[0.68rem] uppercase tracking-[0.32em] text-galaxy-400/70 sm:text-xs">
            Observer&apos;s Manual
          </p>
          <h2 className="font-display text-4xl font-medium text-starlight sm:text-5xl md:text-6xl">
            观测手册
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/58 md:text-base">
            仰望星空之前，先学会在黑暗中等待。
          </p>
        </div>
      </Reveal>

      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 xl:gap-24">
        <ManualTimeline />
        <ObservationStatus />
      </div>

      <Reveal delay={160}>
        <p className="mx-auto mt-8 max-w-3xl whitespace-pre-line text-center font-display text-3xl leading-snug text-starlight/68 md:mt-12 md:text-4xl md:leading-snug">
          {"当你远离灯光，等待眼睛适应黑暗，\n你会发现星空并没有变亮，\n只是你终于学会了看见它。"}
        </p>
      </Reveal>
    </section>
  );
}
