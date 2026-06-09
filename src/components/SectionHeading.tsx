interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-9 max-w-3xl text-center md:mb-14">
      <p className="mb-3 text-[0.68rem] uppercase tracking-[0.3em] text-galaxy-400 sm:text-xs sm:tracking-[0.34em]">
        {eyebrow}
      </p>
      <h2 className="font-display text-[clamp(2.6rem,10vw,3.75rem)] font-medium text-starlight">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
        {description}
      </p>
    </div>
  );
}
