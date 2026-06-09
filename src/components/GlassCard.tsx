interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export function GlassCard({
  children,
  className = "",
  interactive = false,
}: GlassCardProps) {
  return (
    <article
      className={`glass-card ${interactive ? "glass-card-interactive" : ""} ${className}`}
    >
      {children}
    </article>
  );
}
