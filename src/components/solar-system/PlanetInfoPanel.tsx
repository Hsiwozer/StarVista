import { RotateCcw, X } from "lucide-react";
import type { SolarBody } from "../../data/solarSystem";

interface PlanetInfoPanelProps {
  body: SolarBody | null;
  onReturn: () => void;
}

export function PlanetInfoPanel({ body, onReturn }: PlanetInfoPanelProps) {
  return (
    <aside
      className={`solar-info-panel ${
        body ? "solar-info-panel-visible" : ""
      }`}
      aria-hidden={!body}
    >
      <button
        type="button"
        className="solar-info-close"
        aria-label="关闭天体介绍"
        onClick={onReturn}
      >
        <X size={16} aria-hidden="true" />
      </button>

      {body && (
        <div className="solar-info-content">
          <p className="solar-info-kicker">Selected Celestial Body</p>
          <h2 className="solar-info-title">
            {body.nameZh}
            <span>{body.name}</span>
          </h2>
          <p className="solar-info-description">{body.description}</p>

          <dl className="solar-fact-grid">
            {body.facts.map((fact) => (
              <div key={fact.label} className="solar-fact-item">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
            <div className="solar-fact-item">
              <dt>自转周期</dt>
              <dd>{body.rotationPeriod}</dd>
            </div>
          </dl>

          <button type="button" className="solar-return-button" onClick={onReturn}>
            <RotateCcw size={15} aria-hidden="true" />
            返回太阳系
          </button>
        </div>
      )}
    </aside>
  );
}
