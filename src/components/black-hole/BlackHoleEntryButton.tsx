import { ArrowRight, Eclipse } from "lucide-react";
import { usePageTransition } from "../../hooks/usePageTransition";

export function BlackHoleEntryButton() {
  const { transitionLink } = usePageTransition();

  return (
    <a
      href="/black-hole"
      className="about-destination-button about-destination-button-black-hole"
      aria-label="进入卡冈图雅黑洞探索页面"
      onClick={(event) => transitionLink(event, "/black-hole", "blackhole")}
    >
      <span className="about-destination-icon" aria-hidden="true">
        <Eclipse size={18} />
      </span>
      <span className="about-destination-copy">
        <span>卡冈图雅</span>
        <small className="type-label">GARGANTUA</small>
      </span>
      <ArrowRight
        size={15}
        className="about-destination-arrow"
        aria-hidden="true"
      />
    </a>
  );
}
