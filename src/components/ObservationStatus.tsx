const statusItems = [
  ["Sky", "Dark Preferred"],
  ["Light", "Low"],
  ["Weather", "Clear"],
  ["Moon", "Near New Moon"],
  ["Tools", "Naked Eye / Binoculars / Telescope"],
] as const;

export function ObservationStatus() {
  return (
    <aside className="sticky top-28 hidden self-start lg:block">
      <div className="relative w-72 overflow-hidden border-l border-galaxy-400/16 py-6 pl-6">
        <div className="pointer-events-none absolute left-0 top-0 h-20 w-px bg-galaxy-400/56 shadow-[0_0_22px_rgba(127,199,255,0.28)]" />
        <p className="text-[0.68rem] uppercase tracking-[0.34em] text-galaxy-400/62">
          Observation Status
        </p>
        <dl className="mt-7 space-y-5">
          {statusItems.map(([label, value]) => (
            <div key={label} className="border-b border-white/[0.045] pb-4">
              <dt className="text-[0.66rem] uppercase tracking-[0.24em] text-white/28">
                {label}
              </dt>
              <dd className="mt-2 text-sm leading-6 text-starlight/62">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
