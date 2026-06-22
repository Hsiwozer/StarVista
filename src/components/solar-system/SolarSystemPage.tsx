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
import { DeepSpaceEchoFlow } from "./DeepSpaceEchoFlow";
import { PlanetInfoPanel } from "./PlanetInfoPanel";
import { PlanetQuickNav } from "./PlanetQuickNav";
import { SolarSystemScene, type DeepSpaceEchoTelemetry } from "./SolarSystemScene";
import { TimeControl } from "./TimeControl";

declare global {
  interface Window {
    showDeepSpaceEchoPrompt?: () => boolean;
    openDeepSpaceEchoFlow?: () => boolean;
  }
}

interface MeteorTrace {
  id: number;
  style: CSSProperties & Record<`--${string}`, string>;
}

const meteorLifetime = 2400;
const deepSpaceEchoGazeDuration = 3000;
const speedControlCollapseDelay = 950;

function isPointerInsideElementRect(
  element: HTMLElement | null,
  event: PointerEvent,
  buffer = 0,
) {
  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();

  return (
    event.clientX >= rect.left - buffer &&
    event.clientX <= rect.right + buffer &&
    event.clientY >= rect.top - buffer &&
    event.clientY <= rect.bottom + buffer
  );
}

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

function isGazingAtEarth({
  immersiveMode,
  selectedBody,
  telemetry,
}: {
  immersiveMode: boolean;
  selectedBody: SolarBody | null;
  telemetry: DeepSpaceEchoTelemetry | null;
}) {
  return Boolean(
    immersiveMode &&
      selectedBody?.id === "earth" &&
      telemetry?.isCameraTargetNearEarth &&
      telemetry?.isEarthNearViewportCenter,
  );
}

function checkDeepSpaceEchoTrigger({
  hasTriggered,
  isEarthGazeReady,
  telemetry,
  gazeStartedAt,
  now,
}: {
  hasTriggered: boolean;
  isEarthGazeReady: boolean;
  telemetry: DeepSpaceEchoTelemetry | null;
  gazeStartedAt: number | null;
  now: number;
}) {
  return Boolean(
    !hasTriggered &&
      isEarthGazeReady &&
      telemetry?.isEarthInEchoWindow &&
      gazeStartedAt !== null &&
      now - gazeStartedAt >= deepSpaceEchoGazeDuration,
  );
}

export function SolarSystemPage() {
  const [selectedBody, setSelectedBody] = useState<SolarBody | null>(null);
  const [hoveredBody, setHoveredBody] = useState<SolarBody | null>(null);
  const [timeScale, setTimeScale] = useState(1);
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [isSpeedIconHovered, setIsSpeedIconHovered] = useState(false);
  const [isSpeedPanelHovered, setIsSpeedPanelHovered] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [immersiveEdgeActive, setImmersiveEdgeActive] = useState(false);
  const [immersiveToggleLocked, setImmersiveToggleLocked] = useState(false);
  const [meteors, setMeteors] = useState<MeteorTrace[]>([]);
  const [deepSpaceEchoTelemetry, setDeepSpaceEchoTelemetry] =
    useState<DeepSpaceEchoTelemetry | null>(null);
  const [deepSpaceEchoActive, setDeepSpaceEchoActive] = useState(false);
  const [deepSpaceEchoHandled, setDeepSpaceEchoHandled] = useState(false);
  const [deepSpaceEchoTriggered, setDeepSpaceEchoTriggered] = useState(false);
  const controlPanelRef = useRef<HTMLElement | null>(null);
  const speedControlTriggerRef = useRef<HTMLButtonElement | null>(null);
  const speedControlDrawerRef = useRef<HTMLDivElement | null>(null);
  const controlCloseTimerRef = useRef<number | null>(null);
  const speedIconHoveredRef = useRef(false);
  const speedPanelHoveredRef = useRef(false);
  const speedControlHoveredRef = useRef(false);
  const immersiveEdgeTimerRef = useRef<number | null>(null);
  const immersiveToggleLockTimerRef = useRef<number | null>(null);
  const immersiveToggleLockedRef = useRef(false);
  const deepSpaceEchoGazeStartedAtRef = useRef<number | null>(null);
  const deepSpaceEchoLastDebugAtRef = useRef(0);
  const deepSpaceEchoActiveRef = useRef(false);
  const deepSpaceEchoHandledRef = useRef(false);
  const meteorRemovalTimerRefs = useRef<number[]>([]);
  const meteorIdRef = useRef(0);
  const deepSpaceEchoDebugEnabledRef = useRef(
    typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1") &&
      new URLSearchParams(window.location.search).has("echoDebug"),
  );
  const isSpeedControlHovered = isSpeedIconHovered || isSpeedPanelHovered;

  const handleSelect = useCallback((body: SolarBody | null) => {
    setSelectedBody(body);
  }, []);

  const handleHover = useCallback((body: SolarBody | null) => {
    setHoveredBody(body);
  }, []);

  const handleDeepSpaceEchoTelemetry = useCallback((telemetry: DeepSpaceEchoTelemetry) => {
    setDeepSpaceEchoTelemetry(telemetry);
  }, []);

  const openDeepSpaceEchoFlow = useCallback(() => {
    if (deepSpaceEchoHandledRef.current || deepSpaceEchoActiveRef.current) {
      return false;
    }

    deepSpaceEchoActiveRef.current = true;
    setDeepSpaceEchoActive(true);
    return true;
  }, []);

  const handleDeepSpaceEchoHandled = useCallback(() => {
    deepSpaceEchoHandledRef.current = true;
    setDeepSpaceEchoHandled(true);
  }, []);

  const handleDeepSpaceEchoClose = useCallback(() => {
    deepSpaceEchoActiveRef.current = false;
    setDeepSpaceEchoActive(false);
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

  const syncSpeedControlHover = useCallback(
    ({
      iconHovered,
      panelHovered,
      transitionHovered = false,
    }: {
      iconHovered: boolean;
      panelHovered: boolean;
      transitionHovered?: boolean;
    }) => {
      if (speedIconHoveredRef.current !== iconHovered) {
        speedIconHoveredRef.current = iconHovered;
        setIsSpeedIconHovered(iconHovered);
      }

      if (speedPanelHoveredRef.current !== panelHovered) {
        speedPanelHoveredRef.current = panelHovered;
        setIsSpeedPanelHovered(panelHovered);
      }

      speedControlHoveredRef.current =
        iconHovered || panelHovered || transitionHovered;
    },
    [],
  );

  const closeControlsSoon = useCallback(() => {
    if (speedControlHoveredRef.current || controlCloseTimerRef.current !== null) {
      return;
    }

    controlCloseTimerRef.current = window.setTimeout(() => {
      controlCloseTimerRef.current = null;

      if (speedControlHoveredRef.current) {
        return;
      }

      setControlsOpen(false);
    }, speedControlCollapseDelay);
  }, []);

  const handleSpeedIconPointerEnter = useCallback(() => {
    syncSpeedControlHover({
      iconHovered: true,
      panelHovered: speedPanelHoveredRef.current,
    });
    openControls();
  }, [openControls, syncSpeedControlHover]);

  const handleSpeedIconPointerLeave = useCallback(() => {
    syncSpeedControlHover({
      iconHovered: false,
      panelHovered: speedPanelHoveredRef.current,
    });
    closeControlsSoon();
  }, [closeControlsSoon, syncSpeedControlHover]);

  const handleSpeedPanelPointerEnter = useCallback(() => {
    syncSpeedControlHover({
      iconHovered: speedIconHoveredRef.current,
      panelHovered: true,
    });
    openControls();
  }, [openControls, syncSpeedControlHover]);

  const handleSpeedPanelPointerLeave = useCallback(() => {
    syncSpeedControlHover({
      iconHovered: speedIconHoveredRef.current,
      panelHovered: false,
    });
    closeControlsSoon();
  }, [closeControlsSoon, syncSpeedControlHover]);

  const handleControlTriggerClick = useCallback(() => {
    clearControlCloseTimer();
    setControlsOpen((open) => !open);
  }, [clearControlCloseTimer]);

  const lockImmersiveToggle = useCallback(() => {
    immersiveToggleLockedRef.current = true;
    setImmersiveToggleLocked(true);

    if (immersiveToggleLockTimerRef.current !== null) {
      window.clearTimeout(immersiveToggleLockTimerRef.current);
    }

    immersiveToggleLockTimerRef.current = window.setTimeout(() => {
      immersiveToggleLockedRef.current = false;
      immersiveToggleLockTimerRef.current = null;
      setImmersiveToggleLocked(false);
    }, 1000);
  }, []);

  const requestImmersiveMode = useCallback(
    (nextMode: boolean) => {
      if (immersiveToggleLockedRef.current || immersiveMode === nextMode) {
        return;
      }

      lockImmersiveToggle();
      setImmersiveMode(nextMode);
    },
    [immersiveMode, lockImmersiveToggle],
  );

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

      if (immersiveToggleLockTimerRef.current !== null) {
        window.clearTimeout(immersiveToggleLockTimerRef.current);
      }

      meteorRemovalTimerRefs.current.forEach((timer) => window.clearTimeout(timer));
      meteorRemovalTimerRefs.current = [];
    };
  }, [clearControlCloseTimer]);

  useEffect(() => {
    const showDeepSpaceEchoPrompt = () => openDeepSpaceEchoFlow();
    const handleDeepSpaceEchoOpen = () => {
      openDeepSpaceEchoFlow();
    };

    window.showDeepSpaceEchoPrompt = showDeepSpaceEchoPrompt;
    window.openDeepSpaceEchoFlow = showDeepSpaceEchoPrompt;
    window.addEventListener("starvista:open-deep-space-echo", handleDeepSpaceEchoOpen);

    return () => {
      window.removeEventListener(
        "starvista:open-deep-space-echo",
        handleDeepSpaceEchoOpen,
      );

      if (window.showDeepSpaceEchoPrompt === showDeepSpaceEchoPrompt) {
        delete window.showDeepSpaceEchoPrompt;
      }

      if (window.openDeepSpaceEchoFlow === showDeepSpaceEchoPrompt) {
        delete window.openDeepSpaceEchoFlow;
      }
    };
  }, [openDeepSpaceEchoFlow]);

  useEffect(() => {
    const isLocalPreview =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (!isLocalPreview || !new URLSearchParams(window.location.search).has("echoPrompt")) {
      return;
    }

    window.setTimeout(() => openDeepSpaceEchoFlow(), 0);
  }, [openDeepSpaceEchoFlow]);

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
    setTimeScale(1);
    setLabelsVisible(false);
    setSelectedBody(null);

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
      const buffer = 18;
      const iconHovered = isPointerInsideElementRect(
        speedControlTriggerRef.current,
        event,
      );
      const panelHovered = isPointerInsideElementRect(
        speedControlDrawerRef.current,
        event,
      );
      const inside =
        iconHovered ||
        panelHovered ||
        isPointerInsideElementRect(speedControlTriggerRef.current, event, buffer) ||
        isPointerInsideElementRect(speedControlDrawerRef.current, event, buffer);

      if (inside) {
        syncSpeedControlHover({
          iconHovered,
          panelHovered,
          transitionHovered: true,
        });
        openControls();
        return;
      }

      syncSpeedControlHover({
        iconHovered: false,
        panelHovered: false,
      });
      closeControlsSoon();
    };

    window.addEventListener("pointermove", handleGlobalPointerMove);

    return () => window.removeEventListener("pointermove", handleGlobalPointerMove);
  }, [closeControlsSoon, controlsOpen, openControls, syncSpeedControlHover]);

  useEffect(() => {
    if (controlsOpen || controlCloseTimerRef.current === null) {
      return;
    }

    clearControlCloseTimer();
  }, [clearControlCloseTimer, controlsOpen]);

  useEffect(() => {
    const now = window.performance.now();
    const isEarthGazeReady = isGazingAtEarth({
      immersiveMode,
      selectedBody,
      telemetry: deepSpaceEchoTelemetry,
    });

    if (!isEarthGazeReady) {
      deepSpaceEchoGazeStartedAtRef.current = null;
      return;
    }

    if (deepSpaceEchoGazeStartedAtRef.current === null) {
      deepSpaceEchoGazeStartedAtRef.current = now;
    }

    if (
      checkDeepSpaceEchoTrigger({
        hasTriggered:
          deepSpaceEchoTriggered || deepSpaceEchoHandled || deepSpaceEchoActive,
        isEarthGazeReady,
        telemetry: deepSpaceEchoTelemetry,
        gazeStartedAt: deepSpaceEchoGazeStartedAtRef.current,
        now,
      })
    ) {
      setDeepSpaceEchoTriggered(true);
      openDeepSpaceEchoFlow();
    }
  }, [
    deepSpaceEchoActive,
    deepSpaceEchoHandled,
    deepSpaceEchoTelemetry,
    deepSpaceEchoTriggered,
    immersiveMode,
    openDeepSpaceEchoFlow,
    selectedBody,
  ]);

  useEffect(() => {
    if (!deepSpaceEchoDebugEnabledRef.current || !deepSpaceEchoTelemetry) {
      return;
    }

    const now = window.performance.now();

    if (now - deepSpaceEchoLastDebugAtRef.current < 1000) {
      return;
    }

    deepSpaceEchoLastDebugAtRef.current = now;
    console.debug("[DeepSpaceEcho]", {
      earthClockAngle: Number(deepSpaceEchoTelemetry.earthClockAngleDegrees.toFixed(2)),
      targetClockAngle: deepSpaceEchoTelemetry.echoTargetClockAngleDegrees,
      tolerance: deepSpaceEchoTelemetry.echoToleranceDegrees,
      isEchoWindow: deepSpaceEchoTelemetry.isEarthInEchoWindow,
      immersiveMode,
      isGazingAtEarth: isGazingAtEarth({
        immersiveMode,
        selectedBody,
        telemetry: deepSpaceEchoTelemetry,
      }),
      hasTriggered: deepSpaceEchoTriggered,
      handled: deepSpaceEchoHandled,
    });
  }, [
    deepSpaceEchoHandled,
    deepSpaceEchoTelemetry,
    deepSpaceEchoTriggered,
    immersiveMode,
    selectedBody,
  ]);

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
        onDeepSpaceEchoTelemetry={handleDeepSpaceEchoTelemetry}
      />
      <PlanetQuickNav
        planets={solarSystemBodies}
        selectedPlanetId={selectedBody?.id ?? null}
        onSelectPlanet={handleSelect}
        onPreviewPlanet={handleHover}
        immersiveMode={immersiveMode}
      />

      <div className="solar-system-vignette" aria-hidden="true" />
      {deepSpaceEchoActive ? (
        <DeepSpaceEchoFlow
          onHandled={handleDeepSpaceEchoHandled}
          onClose={handleDeepSpaceEchoClose}
        />
      ) : null}

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
        data-hovered={isSpeedControlHovered ? "true" : "false"}
        aria-label="太阳系控制面板"
      >
        <button
          ref={speedControlTriggerRef}
          type="button"
          className="solar-control-trigger"
          aria-label={controlsOpen ? "收起太阳系控制" : "展开太阳系控制"}
          aria-expanded={controlsOpen}
          onPointerEnter={handleSpeedIconPointerEnter}
          onPointerLeave={handleSpeedIconPointerLeave}
          onFocus={openControls}
          onBlur={closeControlsSoon}
          onClick={handleControlTriggerClick}
        >
          <Gauge size={17} aria-hidden="true" />
        </button>
        <div
          ref={speedControlDrawerRef}
          className="solar-control-drawer"
          onPointerEnter={handleSpeedPanelPointerEnter}
          onPointerLeave={handleSpeedPanelPointerLeave}
          onFocus={openControls}
          onBlur={closeControlsSoon}
        >
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
        disabled={immersiveToggleLocked}
        onClick={() => requestImmersiveMode(true)}
      >
        <Maximize2 size={15} aria-hidden="true" />
        沉浸模式
      </button>
      <button
        type="button"
        className={`solar-immersive-exit ${
          immersiveEdgeActive ? "solar-immersive-exit-visible" : ""
        }`}
        disabled={immersiveToggleLocked}
        onClick={() => requestImmersiveMode(false)}
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
