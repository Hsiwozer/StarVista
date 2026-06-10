import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: "short" | "normal";
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  distance = "normal",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const current = ref.current;
    if (!current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.16 },
    );

    observer.observe(current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-[1400ms] ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : `${distance === "short" ? "translate-y-4" : "translate-y-8"} opacity-0`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
