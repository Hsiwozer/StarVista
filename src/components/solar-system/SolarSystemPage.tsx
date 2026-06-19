import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Gauge, Maximize2, Minimize2 } from "lucide-react";
import type { SolarBody } from "../../data/solarSystem";
import { solarSystemBodies } from "../../data/solarSystem";
import { BackToHomeButton } from "./BackToHomeButton";
import { PlanetInfoPanel } from "./PlanetInfoPanel";
import { SolarSystemScene } from "./SolarSystemScene";
import { TimeControl } from "./TimeControl";

interface MeteorTrace {
  id: number;
  style: CSSProperties & Record<`--${string}`, string>;
}

const meteorLifetime = 2400;

function createMeteorTrace(id: number): MeteorTrace {
  const fromLeft = Math.random() > 0.5;
  const y = 8 + Math.random() * 54;
  const fall = 16 + Math.random() * 18;
  const duration = 1550 + Math.random() * 620;

  return {
    id,
    style: {
      "--meteor-x-start": fromLeft ? "-22vw" : "122vw",
      "--meteor-x-end": fromLeft ? "112vw" : "-18vw",
      "--meteor-y-start": `${y}vh`,
      "--meteor-y-end": `${y + fall}vh`,
      "--meteor-rotation": fromLeft ? "18deg" : "162deg",
      "--meteor-duration": `${duration}ms`,
      "--meteor-length": `${94 + Math.random() * 54}px`,
    },
  };
}

export function SolarSystemPage() {
  const [selectedBody, setSelectedBody] = useState<SolarBody | null>(null);
  const [hoveredBody, setHoveredBody] = useState<SolarBody | null>(null);
  const [timeScale, setTimeScale] = useState(1);
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [immersiveEdgeActive, setImmersiveEdgeActive] = useState(false);
  const [meteors, setMeteors] = useState<MeteorTrace[]>([]);
  const controlPanelRef = useRef<HTMLElement | null>(null);
  const controlCloseTimerRef = useRef<number | null>(null);
  const immersiveEdgeTimerRef = useRef<number | null>(null);
  const meteorRemovalTimerRefs = useRef<number[]>([]);
  const meteorIdRef = useRef(0);

  const handleSelect = useCallback((body: SolarBody | null) => {
    setSelectedBody(body);
  }, []);

  const handleHover = useCallback((body: SolarBody | null) => {
    setHoveredBody(body);
  }, []);

  const handleReturn = useCallback(() => {
    setSelectedBody(null);
  }, []);

  const clearControlCloseTimer = useCallback(() => {
    if (controlCloseTimerRef.current !== null) {
      window.clearTimeout(controlCloseTimerRef.current);
      controlCloseTimerRef.current = null;
    }
  }, []);

  const openControls = useCallback(() => {
    clearControlCloseTimer();
    setControlsOpen(true);
  }, [clearControlCloseTimer]);

  const closeControlsSoon = useCallback(() => {
    clearControlCloseTimer();
    controlCloseTimerRef.current = window.setTimeout(() => {
      setControlsOpen(false);
    }, 950);
  }, [clearControlCloseTimer]);

  const revealImmersiveExit = useCallback(() => {
    setImmersiveEdgeActive(true);

    if (immersiveEdgeTimerRef.current !== null) {
      window.clearTimeout(immersiveEdgeTimerRef.current);
    }

    immersiveEdgeTimerRef.current = window.setTimeout(() => {
      setImmersiveEdgeActive(false);
    }, 1900);
  }, []);

  const handlePagePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!immersiveMode) {
        return;
      }

      const edgeSize = 88;
      const nearEdge =
        event.clientY < edgeSize ||
        event.clientX < edgeSize ||
        event.clientX > window.innerWidth - edgeSize ||
        event.clientY > window.innerHeight - edgeSize;

      if (nearEdge) {
        revealImmersiveExit();
      }
    },
    [immersiveMode, revealImmersiveExit],
  );

  useEffect(() => {
    return () => {
      clearControlCloseTimer();

      if (immersiveEdgeTimerRef.current !== null) {
        window.clearTimeout(immersiveEdgeTimerRef.current);
      }

      meteorRemovalTimerRefs.current.forEach((timer) => window.clearTimeout(timer));
      meteorRemovalTimerRefs.current = [];
    };
  }, [clearControlCloseTimer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setImmersiveMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!immersiveMode) {
      return;
    }

    setControlsOpen(false);
    revealImmersiveExit();
  }, [immersiveMode, revealImmersiveExit]);

  useEffect(() => {
    if (!controlsOpen) {
      return undefined;
    }

    const handleGlobalPointerMove = (event: PointerEvent) => {
      const panel = controlPanelRef.current;

      if (!panel) {
        return;
      }

      const rect = panel.getBoundingClientRect();
      const buffer = 10;
      const inside =
        event.clientX >= rect.left - buffer &&
        event.clientX <= rect.right + buffer &&
        event.clientY >= rect.top - buffer &&
        event.clientY <= rect.bottom + buffer;

      if (inside) {
        openControls();
        return;
      }

      closeControlsSoon();
    };

    window.addEventListener("pointermove", handleGlobalPointerMove);

    return () => window.removeEventListener("pointermove", handleGlobalPointerMove);
  }, [closeControlsSoon, controlsOpen, openControls]);

  useEffect(() => {
    if (controlsOpen || controlCloseTimerRef.current === null) {
      return;
    }

    clearControlCloseTimer();
  }, [clearControlCloseTimer, controlsOpen]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      return undefined;
    }

    let cancelled = false;
    let spawnTimer: number | null = null;

    const scheduleMeteor = () => {
      const delay = 8000 + Math.random() * 7000;
      spawnTimer = window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        const id = meteorIdRef.current + 1;
        meteorIdRef.current = id;
        setMeteors((current) => [...current.slice(-1), createMeteorTrace(id)]);
        const removalTimer = window.setTimeout(() => {
          setMeteors((current) => current.filter((meteor) => meteor.id !== id));
          meteorRemovalTimerRefs.current = meteorRemovalTimerRefs.current.filter(
            (timer) => timer !== removalTimer,
          );
        }, meteorLifetime);
        meteorRemovalTimerRefs.current.push(removalTimer);
        scheduleMeteor();
      }, delay);
    };

    scheduleMeteor();

    return () => {
      cancelled = true;

      if (spawnTimer !== null) {
        window.clearTimeout(spawnTimer);
      }
    };
  }, []);

  return (
    <main
      className={`solar-system-page ${
        immersiveMode ? "solar-immersive-active" : ""
      }`}
      onPointerMove={handlePagePointerMove}
    >
      <div className="solar-system-nebula" aria-hidden="true" />
      <div className="solar-meteor-layer" aria-hidden="true">
        {meteors.map((meteor) => (
          <span key={meteor.id} className="solar-meteor" style={meteor.style} />
        ))}
      </div>
      <SolarSystemScene
        bodies={solarSystemBodies}
        selectedBodyId={selectedBody?.id ?? null}
        timeScale={timeScale}
        labelsVisible={labelsVisible && !immersiveMode}
        onSelect={handleSelect}
        onHover={handleHover}
      />

      <div className="solar-system-vignette" aria-hidden="true" />

      <header
        className={`solar-page-header ${
          selectedBody ? "solar-page-header-muted" : ""
        }`}
      >
        <BackToHomeButton />
        <div className="solar-page-title">
          <p>Solar System Explorer</p>
          <h1>太阳系漫游</h1>
          <span>
            {hoveredBody
              ? `正在扫描：${hoveredBody.nameZh} ${hoveredBody.name}`
              : "拖拽旋转视角，滚轮缩放，点击天体读取档案。"}
          </span>
        </div>
      </header>

      <section
        ref={controlPanelRef}
        className={`solar-control-panel ${
          controlsOpen ? "solar-control-panel-open" : ""
        }`}
        aria-label="太阳系控制面板"
        onMouseEnter={openControls}
        onMouseLeave={closeControlsSoon}
      >
        <button
          type="button"
          className="solar-control-trigger"
          aria-label={controlsOpen ? "收起太阳系控制" : "展开太阳系控制"}
          aria-expanded={controlsOpen}
          onClick={() => setControlsOpen((open) => !open)}
        >
          <Gauge size={17} aria-hidden="true" />
        </button>
        <div className="solar-control-drawer">
          <TimeControl value={timeScale} onChange={setTimeScale} />
          <div className="solar-label-control" aria-label="行星标签显示控制">
            <span className="solar-control-label">Planet Labels</span>
            <button
              type="button"
              aria-pressed={labelsVisible}
              onClick={() => setLabelsVisible((visible) => !visible)}
              className={`solar-label-toggle ${
                labelsVisible ? "solar-label-toggle-active" : ""
              }`}
            >
              {labelsVisible ? "隐藏标签" : "显示标签"}
            </button>
          </div>
        </div>
      </section>
      <button
        type="button"
        className="solar-immersive-toggle"
        aria-pressed={immersiveMode}
        onClick={() => setImmersiveMode(true)}
      >
        <Maximize2 size={15} aria-hidden="true" />
        沉浸模式
      </button>
      <button
        type="button"
        className={`solar-immersive-exit ${
          immersiveEdgeActive ? "solar-immersive-exit-visible" : ""
        }`}
        onClick={() => setImmersiveMode(false)}
        aria-label="退出沉浸模式"
      >
        <Minimize2 size={15} aria-hidden="true" />
        退出
      </button>
      <PlanetInfoPanel body={immersiveMode ? null : selectedBody} onReturn={handleReturn} />

      <div className="solar-system-footer" aria-hidden="true">
        <span>REAL-TIME ORRERY</span>
        <span>VISUAL SCALE / COMPRESSED DISTANCE</span>
      </div>
    </main>
  );
}
