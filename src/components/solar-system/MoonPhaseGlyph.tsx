import { useEffect, useId, useMemo, useRef, useState } from "react";

interface MoonPhaseGlyphProps {
  phaseProgress: number;
  illumination: number;
  isWaxing: boolean;
  phaseName?: string;
  size?: number;
  animated?: boolean;
  showHalo?: boolean;
  className?: string;
}

const TWO_PI = Math.PI * 2;
const moonCenter = 50;
const moonRadius = 38;
const phaseSampleCount = 44;

function clampUnit(value: number) {
  return Math.min(1, Math.max(0, value));
}

function normalizeProgress(value: number) {
  return ((value % 1) + 1) % 1;
}

function shortestProgressDelta(from: number, to: number) {
  return ((to - from + 0.5) % 1) - 0.5;
}

function formatPercent(value: number) {
  return `${Math.round(clampUnit(value) * 100)}%`;
}

function pointToPath(point: [number, number]) {
  return `${point[0].toFixed(3)} ${point[1].toFixed(3)}`;
}

function createMoonLightPath(progress: number) {
  const phaseProgress = normalizeProgress(progress);
  const waxing = phaseProgress <= 0.5;
  const cosine = Math.cos(phaseProgress * TWO_PI);
  const boundaryScale = waxing ? cosine : -cosine;
  const boundaryPoints: Array<[number, number]> = [];
  const edgePoints: Array<[number, number]> = [];

  for (let index = 0; index <= phaseSampleCount; index += 1) {
    const ratio = index / phaseSampleCount;
    const angle = -Math.PI / 2 + ratio * Math.PI;
    const edgeX = Math.cos(angle) * moonRadius;
    const y = moonCenter + Math.sin(angle) * moonRadius;

    boundaryPoints.push([moonCenter + edgeX * boundaryScale, y]);
    edgePoints.push([
      moonCenter + edgeX * (waxing ? 1 : -1),
      y,
    ]);
  }

  if (waxing) {
    return [
      `M ${pointToPath(boundaryPoints[0])}`,
      ...boundaryPoints.slice(1).map((point) => `L ${pointToPath(point)}`),
      ...edgePoints
        .slice()
        .reverse()
        .map((point) => `L ${pointToPath(point)}`),
      "Z",
    ].join(" ");
  }

  return [
    `M ${pointToPath(edgePoints[0])}`,
    ...edgePoints.slice(1).map((point) => `L ${pointToPath(point)}`),
    ...boundaryPoints
      .slice()
      .reverse()
      .map((point) => `L ${pointToPath(point)}`),
    "Z",
  ].join(" ");
}

export function MoonPhaseGlyph({
  phaseProgress,
  illumination,
  isWaxing,
  phaseName = "月相",
  size = 64,
  animated = true,
  showHalo = true,
  className = "",
}: MoonPhaseGlyphProps) {
  const reactId = useId();
  const [displayProgress, setDisplayProgress] = useState(() =>
    normalizeProgress(phaseProgress),
  );
  const frameRef = useRef<number | null>(null);
  const glyphId = useMemo(
    () => reactId.replace(/[^a-zA-Z0-9_-]/g, "") || "moon-phase",
    [reactId],
  );
  const clipId = `${glyphId}-clip`;
  const brightId = `${glyphId}-bright`;
  const darkId = `${glyphId}-dark`;
  const softEdgeId = `${glyphId}-soft-edge`;
  const noiseId = `${glyphId}-noise`;

  useEffect(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (!animated) {
      setDisplayProgress(normalizeProgress(phaseProgress));
      return undefined;
    }

    const targetProgress = normalizeProgress(phaseProgress);

    const animate = () => {
      setDisplayProgress((current) => {
        const delta = shortestProgressDelta(current, targetProgress);

        if (Math.abs(delta) < 0.0008) {
          frameRef.current = null;
          return targetProgress;
        }

        frameRef.current = window.requestAnimationFrame(animate);
        return normalizeProgress(current + delta * 0.14);
      });
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [animated, phaseProgress]);

  const lightPath = useMemo(
    () => createMoonLightPath(displayProgress),
    [displayProgress],
  );
  const displayIllumination = clampUnit(
    (1 - Math.cos(displayProgress * TWO_PI)) / 2,
  );
  const haloOpacity = showHalo
    ? Math.max(0, displayIllumination - 0.62) * 0.44
    : 0;
  const phaseDirection = isWaxing ? "盈" : "亏";

  return (
    <span
      className={`solar-moon-glyph ${className}`}
      style={{ width: size, height: size }}
      aria-label={`${phaseName}，${phaseDirection}月，可见光照约 ${formatPercent(
        illumination,
      )}`}
      role="img"
    >
      <svg
        className="solar-moon-glyph-svg"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx={moonCenter} cy={moonCenter} r={moonRadius} />
          </clipPath>
          <radialGradient id={brightId} cx="42%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#f8fbff" />
            <stop offset="58%" stopColor="#dfeaff" />
            <stop offset="100%" stopColor="#94a8c9" />
          </radialGradient>
          <radialGradient id={darkId} cx="44%" cy="30%" r="78%">
            <stop offset="0%" stopColor="#253149" />
            <stop offset="68%" stopColor="#10182b" />
            <stop offset="100%" stopColor="#050915" />
          </radialGradient>
          <filter id={softEdgeId} x="-18%" y="-18%" width="136%" height="136%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.85" />
          </filter>
          <filter id={noiseId} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              baseFrequency="0.95"
              numOctaves="2"
              seed="11"
              type="fractalNoise"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.09" />
            </feComponentTransfer>
          </filter>
        </defs>

        <circle
          className="solar-moon-glyph-halo"
          cx={moonCenter}
          cy={moonCenter}
          r={moonRadius + 8}
          style={{ opacity: haloOpacity }}
        />
        <circle
          className="solar-moon-glyph-orbit"
          cx={moonCenter}
          cy={moonCenter}
          r={moonRadius + 4}
        />
        <g clipPath={`url(#${clipId})`}>
          <circle
            className="solar-moon-glyph-dark"
            cx={moonCenter}
            cy={moonCenter}
            r={moonRadius}
            style={{ fill: `url(#${darkId})` }}
          />
          <path
            className="solar-moon-glyph-light solar-moon-glyph-light-soft"
            d={lightPath}
            filter={`url(#${softEdgeId})`}
            style={{ fill: `url(#${brightId})` }}
          />
          <path
            className="solar-moon-glyph-light"
            d={lightPath}
            style={{ fill: `url(#${brightId})` }}
          />
          <circle
            className="solar-moon-glyph-texture"
            cx={moonCenter}
            cy={moonCenter}
            r={moonRadius}
            filter={`url(#${noiseId})`}
          />
        </g>
        <circle
          className="solar-moon-glyph-rim"
          cx={moonCenter}
          cy={moonCenter}
          r={moonRadius}
        />
      </svg>
    </span>
  );
}
