interface ArchiveCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export function ArchiveCard({
  children,
  className = "",
  interactive = false,
}: ArchiveCardProps) {
  return (
    <article
      className={`glass-card ${interactive ? "glass-card-interactive" : ""} ${className}`}
    >
      {children}
    </article>
  );
}
