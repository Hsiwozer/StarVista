import type { CSSProperties } from "react";
import type { PageTransitionState } from "../hooks/usePageTransition";

interface PageTransitionOverlayProps {
  transition: PageTransitionState;
}

type DustStyle = CSSProperties & Record<`--${string}`, string>;

const dustPoints: DustStyle[] = [
  { "--dust-x": "16%", "--dust-y": "28%", "--dust-delay": "-1.6s" },
  { "--dust-x": "28%", "--dust-y": "72%", "--dust-delay": "-0.4s" },
  { "--dust-x": "38%", "--dust-y": "18%", "--dust-delay": "-2.3s" },
  { "--dust-x": "52%", "--dust-y": "82%", "--dust-delay": "-1.1s" },
  { "--dust-x": "63%", "--dust-y": "24%", "--dust-delay": "-2.8s" },
  { "--dust-x": "72%", "--dust-y": "68%", "--dust-delay": "-0.8s" },
  { "--dust-x": "84%", "--dust-y": "36%", "--dust-delay": "-2s" },
  { "--dust-x": "91%", "--dust-y": "76%", "--dust-delay": "-1.3s" },
];

export function PageTransitionOverlay({
  transition,
}: PageTransitionOverlayProps) {
  const isVisible = transition.phase !== "idle";

  return (
    <div
      className={`page-transition-overlay page-transition-${transition.variant} page-transition-${transition.phase}`}
      aria-hidden={!isVisible}
    >
      <div className="page-transition-dust" aria-hidden="true">
        {dustPoints.map((style, index) => (
          <i key={index} style={style} />
        ))}
      </div>

      <div className="page-transition-ceremony" aria-hidden="true">
        <div className="page-transition-map">
          <span className="page-transition-ring page-transition-ring-outer" />
          <span className="page-transition-ring page-transition-ring-middle" />
          <span className="page-transition-ring page-transition-ring-inner" />
          <span className="page-transition-axis page-transition-axis-x" />
          <span className="page-transition-axis page-transition-axis-y" />
          <span className="page-transition-scan" />
          <span className="page-transition-core" />
        </div>
      </div>

      <p className="page-transition-label" role="status" aria-live="polite">
        {isVisible ? transition.label : ""}
      </p>
    </div>
  );
}
