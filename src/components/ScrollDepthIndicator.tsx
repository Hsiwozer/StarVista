import { useEffect, useRef, useState } from "react";

const archiveLayers = [
  { id: "home", status: "ARCHIVE THRESHOLD" },
  { id: "daily", status: "SIGNAL LAYER" },
  { id: "gallery", status: "DEEP FIELD ACCESS" },
  { id: "articles", status: "COSMIC RECORD" },
  { id: "guide", status: "OBSERVATION LEVEL" },
  { id: "about", status: "RETURN VECTOR" },
] as const;

const SCROLL_END_DELAY_MS = 700;

function formatLayer(value: number) {
  return String(value).padStart(2, "0");
}

export function ScrollDepthIndicator() {
  const indicatorRef = useRef<HTMLElement | null>(null);
  const sectionOffsetsRef = useRef<number[]>([]);
  const frameRef = useRef<number | null>(null);
  const scrollEndTimerRef = useRef<number | null>(null);
  const [activeLayer, setActiveLayer] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const indicator = indicatorRef.current;

    if (!indicator) {
      return;
    }

    const measureSections = () => {
      sectionOffsetsRef.current = archiveLayers.map(({ id }) => {
        const section = document.getElementById(id);
        return section
          ? section.getBoundingClientRect().top + window.scrollY
          : Number.POSITIVE_INFINITY;
      });
    };

    const syncDepth = () => {
      frameRef.current = null;

      const scrollRange = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
      const observationLine = window.scrollY + window.innerHeight * 0.46;
      let nextLayer = 0;

      sectionOffsetsRef.current.forEach((offset, index) => {
        if (observationLine >= offset) {
          nextLayer = index;
        }
      });

      indicator.style.setProperty(
        "--archive-scroll-progress",
        progress.toFixed(4),
      );
      setActiveLayer((current) =>
        current === nextLayer ? current : nextLayer,
      );
    };

    const requestSync = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(syncDepth);
      }
    };

    const markScrolling = () => {
      setIsScrolling(true);
      if (scrollEndTimerRef.current !== null) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = window.setTimeout(() => {
        setIsScrolling(false);
        scrollEndTimerRef.current = null;
      }, SCROLL_END_DELAY_MS);
      requestSync();
    };

    const handleResize = () => {
      measureSections();
      requestSync();
    };

    measureSections();
    syncDepth();

    const resizeObserver = new ResizeObserver(() => {
      measureSections();
      requestSync();
    });
    resizeObserver.observe(document.documentElement);

    window.addEventListener("scroll", markScrolling, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", markScrolling);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (scrollEndTimerRef.current !== null) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, []);

  const currentLayer = archiveLayers[activeLayer];
  const currentNumber = formatLayer(activeLayer + 1);
  const totalLayers = formatLayer(archiveLayers.length);

  return (
    <aside
      ref={indicatorRef}
      className={`archive-depth-indicator ${
        isScrolling ? "is-scrolling" : ""
      }`}
      aria-hidden="true"
    >
      <div className="archive-depth-terminal">
        <div className="archive-depth-rail">
          <span className="archive-depth-fill" />
          <span className="archive-depth-node" />
        </div>

        <div className="archive-depth-readout">
          <span className="archive-depth-label type-label">ARCHIVE DEPTH</span>
          <span className="archive-depth-value type-label">
            <strong key={currentNumber}>{currentNumber}</strong>
            <i>/</i>
            <span>{totalLayers}</span>
          </span>
          <span key={currentLayer.id} className="archive-depth-status type-label">
            {currentLayer.status}
          </span>
          <span className="archive-depth-detail type-label">
            CURRENT ARCHIVE LAYER · SCROLL TO DESCEND
          </span>
        </div>
      </div>
    </aside>
  );
}
