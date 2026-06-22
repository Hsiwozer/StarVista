import { useEffect, useRef, useState } from "react";
import type { SolarBody, SolarBodyId } from "../../data/solarSystem";

interface PlanetQuickNavProps {
  planets: SolarBody[];
  selectedPlanetId: SolarBodyId | null;
  onSelectPlanet: (planet: SolarBody) => void;
  onPreviewPlanet?: (planet: SolarBody | null) => void;
  immersiveMode?: boolean;
  className?: string;
}

const majorPlanetOrder: SolarBodyId[] = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
];

function PlanetQuickIcon({ planetId }: { planetId: SolarBodyId }) {
  const commonProps = {
    className: "solar-planet-quick-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.45,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (planetId) {
    case "mercury":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="4.7" />
          <path d="M10 10.7c1-.72 2.45-.78 3.55-.16" />
        </svg>
      );
    case "venus":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="9.8" r="4.85" />
          <path d="M12 14.65v4.15" />
        </svg>
      );
    case "earth":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="5.25" />
          <path d="M12 6.85c-1.65 1.62-1.65 8.68 0 10.3" />
          <path d="M7.15 12h9.7" />
        </svg>
      );
    case "mars":
      return (
        <svg {...commonProps}>
          <circle cx="10.2" cy="13.8" r="4.65" />
          <path d="M13.55 10.45 18 6" />
          <path d="M15.65 6h2.35v2.35" />
        </svg>
      );
    case "jupiter":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="5.45" />
          <path d="M7.35 10.35c2.25.78 6.1.82 9.3.05" />
          <path d="M7.55 13.75c2.65-.64 5.7-.62 8.9.04" />
        </svg>
      );
    case "saturn":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="4.35" />
          <ellipse cx="12" cy="12" rx="8.15" ry="2.45" transform="rotate(-18 12 12)" />
        </svg>
      );
    case "uranus":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="4.8" />
          <path d="M4.8 12h2.45" />
          <path d="M16.75 12h2.45" />
          <ellipse cx="12" cy="12" rx="6.45" ry="5.15" />
        </svg>
      );
    case "neptune":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="9.7" r="4.55" />
          <path d="M12 14.3v4.55" />
          <path d="M8.8 17.55 12 20.1l3.2-2.55" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="5" />
        </svg>
      );
  }
}

export function PlanetQuickNav({
  planets,
  selectedPlanetId,
  onSelectPlanet,
  onPreviewPlanet,
  immersiveMode = false,
  className = "",
}: PlanetQuickNavProps) {
  const orderedPlanets = majorPlanetOrder
    .map((planetId) => planets.find((planet) => planet.id === planetId))
    .filter((planet): planet is SolarBody => Boolean(planet));
  const [transientLabelPlanetId, setTransientLabelPlanetId] =
    useState<SolarBodyId | null>(null);
  const transientLabelTimerRef = useRef<number | null>(null);

  const clearTransientLabelTimer = () => {
    if (transientLabelTimerRef.current !== null) {
      window.clearTimeout(transientLabelTimerRef.current);
      transientLabelTimerRef.current = null;
    }
  };

  const handlePlanetSelect = (planet: SolarBody) => {
    clearTransientLabelTimer();
    setTransientLabelPlanetId(planet.id);
    onSelectPlanet(planet);

    transientLabelTimerRef.current = window.setTimeout(() => {
      transientLabelTimerRef.current = null;
      setTransientLabelPlanetId((currentPlanetId) =>
        currentPlanetId === planet.id ? null : currentPlanetId,
      );
    }, 1500);
  };

  useEffect(() => clearTransientLabelTimer, []);

  return (
    <nav
      className={`solar-planet-quick-nav ${
        immersiveMode ? "solar-planet-quick-nav-immersive" : ""
      } ${selectedPlanetId ? "solar-planet-quick-nav-focused" : ""
      } ${className}`}
      aria-label="八大行星快捷聚焦栏"
    >
      {orderedPlanets.map((planet) => {
        const isActive = selectedPlanetId === planet.id;
        const isLabelVisible = transientLabelPlanetId === planet.id;

        return (
          <button
            key={planet.id}
            type="button"
            className={`solar-planet-quick-button ${
              isActive ? "solar-planet-quick-button-active" : ""
            } ${isLabelVisible ? "solar-planet-quick-button-label-visible" : ""
            }`}
            data-planet={planet.id}
            aria-label={`聚焦${planet.nameZh}`}
            aria-pressed={isActive}
            onClick={() => handlePlanetSelect(planet)}
            onPointerEnter={() => onPreviewPlanet?.(planet)}
            onPointerLeave={() => onPreviewPlanet?.(null)}
            onFocus={() => onPreviewPlanet?.(planet)}
            onBlur={() => onPreviewPlanet?.(null)}
          >
            <PlanetQuickIcon planetId={planet.id} />
            <span className="solar-planet-quick-label">
              <span className="solar-planet-quick-label-text">{planet.nameZh}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
