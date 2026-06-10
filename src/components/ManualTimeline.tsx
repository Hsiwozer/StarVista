import { manualSteps } from "../data/manualData";
import { ManualStep } from "./ManualStep";

export function ManualTimeline() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-[0.59rem] top-2 bottom-14 w-px bg-gradient-to-b from-transparent via-white/[0.09] to-transparent sm:left-[0.72rem]" />
      <div className="space-y-1">
        {manualSteps.map((step, index) => (
          <ManualStep key={step.manualId} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}
