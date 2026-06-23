import { useEffect, useRef, useState } from "react";
import type { SolarBody } from "../../data/solarSystem";
import { celestialBodiesInfo } from "./celestialStatusInfo";
import { MoonPhaseGlyph } from "./MoonPhaseGlyph";
import type { MoonPhaseState } from "./moonPhase";

interface PlanetInfoPanelProps {
  body: SolarBody | null;
  moonPhase: MoonPhaseState | null;
  timeScale: number;
}

const cardSwitchDelay = 210;

function formatIllumination(moonPhase: MoonPhaseState | null) {
  if (!moonPhase) {
    return "计算中";
  }

  return `${Math.round(moonPhase.illumination * 100)}%`;
}

function formatTimeScale(timeScale: number) {
  if (timeScale === 0) {
    return "暂停";
  }

  return `${timeScale}x`;
}

function getLightStatus(body: SolarBody) {
  if (body.id === "sun") {
    return "自发光";
  }

  if (body.id === "moon") {
    return "太阳侧照明";
  }

  if (body.id === "earth") {
    return "昼夜分界线可见";
  }

  if (body.id === "saturn") {
    return "环面受光";
  }

  return body.distanceAU > 10 ? "远日低照度" : "日侧照明";
}

function getDynamicStatus(
  body: SolarBody,
  moonPhase: MoonPhaseState | null,
  timeScale: number,
) {
  const speed = formatTimeScale(timeScale);

  if (body.id === "moon") {
    const phaseName = moonPhase?.phaseName ?? "月相计算中";
    const illumination = formatIllumination(moonPhase);

    return `当前为 ${phaseName}，可见光照约 ${illumination}。月球随地球前行，月面明暗由太阳、地球与月球的夹角连续改变。`;
  }

  if (body.id === "earth") {
    return `镜头正在追踪地球，昼夜分界线缓慢移动，夜侧城市灯光沿大陆边缘微微闪烁。当前模拟倍率为 ${speed}。`;
  }

  if (body.id === "saturn") {
    return `土星环随行星一同处于聚焦追踪中，近侧环面与远侧尘带会随视角呈现不同层次。当前模拟倍率为 ${speed}。`;
  }

  if (body.id === "asteroid-belt") {
    return `小行星带的碎屑层正以压缩比例缓慢漂移，颗粒高低错落，当前模拟倍率为 ${speed}。`;
  }

  if (body.id === "sun") {
    return `太阳位于系统中心，光照与引力定义了当前轨道参考。日冕仍在轻微脉动。`;
  }

  return `当前处于聚焦追踪，天体沿压缩轨道持续运行，日侧受光与夜侧暗部保持清晰分离。模拟倍率为 ${speed}。`;
}

export function PlanetInfoPanel({
  body,
  moonPhase,
  timeScale,
}: PlanetInfoPanelProps) {
  const [displayBody, setDisplayBody] = useState<SolarBody | null>(body);
  const [isVisible, setIsVisible] = useState(Boolean(body));
  const switchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (switchTimerRef.current !== null) {
      window.clearTimeout(switchTimerRef.current);
      switchTimerRef.current = null;
    }

    if (!body) {
      setIsVisible(false);

      if (displayBody) {
        switchTimerRef.current = window.setTimeout(() => {
          setDisplayBody(null);
          switchTimerRef.current = null;
        }, cardSwitchDelay);
      }

      return;
    }

    if (!displayBody) {
      setDisplayBody(body);
      window.requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    if (displayBody.id === body.id) {
      setDisplayBody(body);
      setIsVisible(true);
      return;
    }

    setIsVisible(false);
    switchTimerRef.current = window.setTimeout(() => {
      setDisplayBody(body);
      window.requestAnimationFrame(() => setIsVisible(true));
      switchTimerRef.current = null;
    }, cardSwitchDelay);
  }, [body, displayBody]);

  useEffect(() => {
    return () => {
      if (switchTimerRef.current !== null) {
        window.clearTimeout(switchTimerRef.current);
      }
    };
  }, []);

  const info = displayBody ? celestialBodiesInfo[displayBody.id] : null;
  const isMoon = displayBody?.id === "moon";
  const phaseText = moonPhase
    ? `${moonPhase.phaseName} · 可见光照约 ${formatIllumination(moonPhase)}`
    : "月相计算中";
  const phaseLabel = moonPhase?.phaseName ?? "月相计算中";

  return (
    <aside
      className={`solar-info-panel ${
        displayBody && isVisible ? "solar-info-panel-visible" : ""
      }`}
      aria-hidden={!displayBody}
    >
      {displayBody && info && (
        <div className="solar-info-content" key={displayBody.id}>
          <p className="solar-info-kicker">Celestial Archive / Orbital Telemetry</p>
          <h2 className="solar-info-title">
            {displayBody.nameZh}
            <span>{displayBody.name}</span>
          </h2>
          <p className="solar-info-subtitle">{info.subtitle}</p>

          {isMoon ? (
            <section className="solar-info-section solar-moon-phase-module">
              <p className="solar-info-section-label">月相观测</p>
              <div className="solar-moon-phase-layout">
                {moonPhase ? (
                  <MoonPhaseGlyph
                    phaseProgress={moonPhase.phaseProgress}
                    illumination={moonPhase.illumination}
                    isWaxing={moonPhase.isWaxing}
                    phaseName={moonPhase.phaseName}
                    size={66}
                  />
                ) : (
                  <span className="solar-moon-glyph solar-moon-glyph-loading" />
                )}
                <div className="solar-moon-phase-copy">
                  <strong>{phaseLabel}</strong>
                  <span>可见光照约 {formatIllumination(moonPhase)}</span>
                  <p>
                    {moonPhase
                      ? moonPhase.phaseDescription
                      : "正在根据太阳、地球与月球的位置关系同步计算月相。"}
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          <section className="solar-info-section solar-info-section-facts">
            <p className="solar-info-section-label">核心科学数据</p>
            <dl className="solar-fact-grid">
              {info.facts.map((fact) => (
                <div key={fact.label} className="solar-fact-item">
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="solar-info-section solar-status-module">
            <div className="solar-status-module-header">
              <span>当前动态状态</span>
              <span>{formatTimeScale(timeScale)}</span>
            </div>
            <p>{getDynamicStatus(displayBody, moonPhase, timeScale)}</p>
            <div className="solar-status-chips" aria-label="当前观测参数">
              <span>聚焦追踪</span>
              <span>{getLightStatus(displayBody)}</span>
              {isMoon ? <span>{phaseText}</span> : null}
            </div>
          </section>

          <section className="solar-info-section solar-feature-module">
            <p className="solar-info-section-label">{info.featureTitle}</p>
            <p>{info.featureText}</p>
            {info.observationTip ? (
              <p className="solar-observation-tip">{info.observationTip}</p>
            ) : null}
          </section>

          <blockquote className="solar-poetic-note">
            {info.poeticNote}
          </blockquote>
        </div>
      )}

      {displayBody && !info && (
        <div className="solar-info-content" key={displayBody.id}>
          <p className="solar-info-kicker">Celestial Archive</p>
          <h2 className="solar-info-title">
            {displayBody.nameZh}
            <span>{displayBody.name}</span>
          </h2>
          <p className="solar-info-subtitle">{displayBody.description}</p>
          <dl className="solar-fact-grid">
            {displayBody.facts.map((fact) => (
              <div key={fact.label} className="solar-fact-item">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </aside>
  );
}
