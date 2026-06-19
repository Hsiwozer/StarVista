import { useCallback, useState } from "react";
import type { SolarBody } from "../../data/solarSystem";
import { solarSystemBodies } from "../../data/solarSystem";
import { BackToHomeButton } from "./BackToHomeButton";
import { PlanetInfoPanel } from "./PlanetInfoPanel";
import { SolarSystemScene } from "./SolarSystemScene";
import { TimeControl } from "./TimeControl";

export function SolarSystemPage() {
  const [selectedBody, setSelectedBody] = useState<SolarBody | null>(null);
  const [hoveredBody, setHoveredBody] = useState<SolarBody | null>(null);
  const [timeScale, setTimeScale] = useState(100);
  const [labelsVisible, setLabelsVisible] = useState(true);

  const handleSelect = useCallback((body: SolarBody | null) => {
    setSelectedBody(body);
  }, []);

  const handleHover = useCallback((body: SolarBody | null) => {
    setHoveredBody(body);
  }, []);

  const handleReturn = useCallback(() => {
    setSelectedBody(null);
  }, []);

  return (
    <main className="solar-system-page">
      <div className="solar-system-nebula" aria-hidden="true" />
      <SolarSystemScene
        bodies={solarSystemBodies}
        selectedBodyId={selectedBody?.id ?? null}
        timeScale={timeScale}
        labelsVisible={labelsVisible}
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

      <section className="solar-control-panel" aria-label="太阳系控制面板">
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
      </section>
      <PlanetInfoPanel body={selectedBody} onReturn={handleReturn} />

      <div className="solar-system-footer" aria-hidden="true">
        <span>REAL-TIME ORRERY</span>
        <span>VISUAL SCALE / COMPRESSED DISTANCE</span>
      </div>
    </main>
  );
}
