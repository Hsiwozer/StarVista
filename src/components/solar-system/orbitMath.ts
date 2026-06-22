import * as THREE from "three";
import type { SolarBody } from "../../data/solarSystem";

const TWO_PI = Math.PI * 2;

export function degToRad(degrees: number) {
  return THREE.MathUtils.degToRad(degrees);
}

export function getEllipticalOrbitPosition(
  semiMajorAxis: number,
  eccentricity: number,
  theta: number,
) {
  if (semiMajorAxis <= 0) {
    return new THREE.Vector3(0, 0, 0);
  }

  const safeEccentricity = THREE.MathUtils.clamp(eccentricity, 0, 0.94);
  const radius =
    (semiMajorAxis * (1 - safeEccentricity ** 2)) /
    (1 + safeEccentricity * Math.cos(theta));

  return new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta));
}

export function applyOrbitInclination(position: THREE.Vector3, inclinationDegrees: number) {
  if (inclinationDegrees === 0) {
    return position;
  }

  return position.applyAxisAngle(new THREE.Vector3(1, 0, 0), degToRad(inclinationDegrees));
}

export function getInclinedOrbitPosition(body: SolarBody, theta: number) {
  return applyOrbitInclination(
    getEllipticalOrbitPosition(body.semiMajorAxis, body.eccentricity, theta),
    body.inclination,
  );
}

export function getRelativeSatelliteOrbitPosition(body: SolarBody, theta: number) {
  const orbitRadius = body.satelliteOrbitRadius ?? 0;

  return applyOrbitInclination(
    getEllipticalOrbitPosition(orbitRadius, body.eccentricity, theta),
    body.inclination,
  ).add(new THREE.Vector3(0, body.satelliteOrbitHeight ?? 0, 0));
}

export function getOrbitAngle(body: SolarBody, elapsedDays: number) {
  return body.initialAngle + elapsedDays * body.orbitSpeed;
}

export function sampleOrbitAngles(segmentCount: number) {
  return Array.from({ length: segmentCount + 1 }, (_, index) => (
    (index / segmentCount) * TWO_PI
  ));
}
