import type { ManualStepItem } from "../types/content";
import { Reveal } from "./Reveal";

interface ManualStepProps {
  step: ManualStepItem;
  index: number;
}

export function ManualStep({ step, index }: ManualStepProps) {
  return (
    <Reveal delay={index * 90} distance="short">
      <article className="group/manual relative min-h-[12rem] pb-10 pl-12 sm:min-h-[13.5rem] sm:pl-16 sm:pb-14">
        <div className="absolute left-[0.59rem] top-2 h-full w-px bg-white/[0.035] transition duration-700 group-hover/manual:bg-galaxy-400/28 group-hover/manual:shadow-[0_0_24px_rgba(127,199,255,0.18)] sm:left-[0.72rem]" />
        <div className="absolute left-1 top-2 h-4 w-4 rounded-full border border-galaxy-400/18 bg-space-950 shadow-[0_0_0_6px_rgba(2,3,10,0.84)] transition duration-700 group-hover/manual:border-galaxy-400/72 group-hover/manual:bg-galaxy-400/34 group-hover/manual:shadow-[0_0_0_6px_rgba(2,3,10,0.84),0_0_24px_rgba(127,199,255,0.32)] sm:left-1.5" />

        <div className="max-w-2xl translate-y-1 opacity-70 transition duration-700 group-hover/manual:translate-y-0 group-hover/manual:opacity-100">
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-nebula-300/42 transition duration-700 group-hover/manual:text-nebula-300/86">
            {step.manualId}
          </p>
          <h3 className="mt-3 font-display text-3xl font-medium leading-tight text-starlight/78 transition duration-700 group-hover/manual:text-starlight sm:text-4xl">
            {step.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-white/48 transition duration-700 group-hover/manual:text-white/66 sm:text-base sm:leading-8">
            {step.description}
          </p>
          <p className="mt-5 max-w-xl border-l border-galaxy-400/14 pl-4 text-sm leading-7 text-galaxy-400/45 transition duration-700 group-hover/manual:border-galaxy-400/34 group-hover/manual:text-galaxy-400/76">
            {step.prompt}
          </p>
        </div>
      </article>
    </Reveal>
  );
}
