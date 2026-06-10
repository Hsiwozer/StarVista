import type { CSSProperties } from "react";
import { useMemo } from "react";

interface StarParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  drift: number;
}

interface MeteorParticle {
  id: number;
  x: number;
  y: number;
  length: number;
  delay: number;
  duration: number;
  angle: number;
  travelX: number;
  travelY: number;
}

type ParticleStyle = CSSProperties & Record<`--${string}`, string>;

interface CosmicBackgroundProps {
  fixed?: boolean;
  quiet?: boolean;
}

function createStars(count: number) {
  return Array.from({ length: count }, (_, index): StarParticle => {
    const wave = Math.sin(index * 12.9898) * 43758.5453;
    const seed = wave - Math.floor(wave);
    const offset = Math.cos(index * 78.233) * 24634.6345;
    const seedTwo = offset - Math.floor(offset);

    return {
      id: index,
      x: (seed * 100 + index * 7.3) % 100,
      y: (seedTwo * 100 + index * 3.9) % 100,
      size: index % 17 === 0 ? 1.8 : 0.65 + (seedTwo % 1.1),
      opacity: 0.16 + (seed % 0.36),
      delay: (seedTwo * 14) % 14,
      duration: 9 + (seed * 9) % 9,
      drift: 4 + (seedTwo * 10) % 10,
    };
  });
}

function createMeteors(count: number) {
  return Array.from({ length: count }, (_, index): MeteorParticle => {
    const seed = (Math.sin(index * 91.17 + 4) * 10000) % 1;
    const normalized = Math.abs(seed);
    const seedTwo = Math.abs((Math.cos(index * 41.73 + 2) * 10000) % 1);

    return {
      id: index,
      x: -18 + seedTwo * 48,
      y: 8 + normalized * 45,
      length: 6 + normalized * 7,
      delay: index * 16 + seedTwo * 12,
      duration: 14 + normalized * 8,
      angle: 20 + seedTwo * 10,
      travelX: 92 + normalized * 36,
      travelY: 34 + seedTwo * 26,
    };
  });
}

export function CosmicBackground({
  fixed = false,
  quiet = false,
}: CosmicBackgroundProps) {
  const stars = useMemo(() => createStars(quiet ? 70 : 90), [quiet]);
  const meteors = useMemo(() => createMeteors(quiet ? 2 : 3), [quiet]);

  return (
    <div
      className={`cosmic-background ${fixed ? "cosmic-background-fixed" : ""} ${
        quiet ? "cosmic-background-quiet" : ""
      }`}
      aria-hidden="true"
    >
      <div className="cosmic-nebula-drift" />
      <div className="cosmic-dust cosmic-dust-a" />
      <div className="cosmic-dust cosmic-dust-b" />
      <div className="cosmic-starfield">
        {stars.map((star) => {
          const style: ParticleStyle = {
            "--star-x": `${star.x}%`,
            "--star-y": `${star.y}%`,
            "--star-size": `${star.size}px`,
            "--star-opacity": `${star.opacity}`,
            "--star-delay": `${star.delay}s`,
            "--star-duration": `${star.duration}s`,
            "--star-drift-duration": `${star.duration * 3.2}s`,
            "--star-drift": `${star.drift}px`,
          };

          return <span className="star-particle" key={star.id} style={style} />;
        })}
      </div>
      <div className="meteor-field">
        {meteors.map((meteor) => {
          const style: ParticleStyle = {
            "--meteor-x": `${meteor.x}%`,
            "--meteor-y": `${meteor.y}%`,
            "--meteor-length": `${meteor.length}rem`,
            "--meteor-delay": `${meteor.delay}s`,
            "--meteor-duration": `${meteor.duration}s`,
            "--meteor-angle": `${meteor.angle}deg`,
            "--meteor-travel-x": `${meteor.travelX}vw`,
            "--meteor-travel-y": `${meteor.travelY}vh`,
          };

          return (
            <span className="meteor-random" key={meteor.id} style={style} />
          );
        })}
      </div>
    </div>
  );
}
