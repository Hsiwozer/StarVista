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
      size: index % 11 === 0 ? 2.2 : 0.8 + (seedTwo % 1.4),
      opacity: 0.32 + (seed % 0.58),
      delay: (seedTwo * 8) % 8,
      duration: 4.5 + (seed * 5.5) % 5.5,
      drift: 8 + (seedTwo * 18) % 18,
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
      length: 8 + normalized * 9,
      delay: index * 4.2 + seedTwo * 4,
      duration: 8 + normalized * 5,
      angle: 20 + seedTwo * 10,
      travelX: 92 + normalized * 36,
      travelY: 34 + seedTwo * 26,
    };
  });
}

export function CosmicBackground() {
  const stars = useMemo(() => createStars(92), []);
  const meteors = useMemo(() => createMeteors(5), []);

  return (
    <div className="cosmic-background" aria-hidden="true">
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
