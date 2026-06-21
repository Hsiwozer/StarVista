import * as THREE from "three";
import type { SolarBody } from "../../data/solarSystem";
import { getInclinedOrbitPosition, sampleOrbitAngles } from "./orbitMath";

interface OrbitLineResult {
  line: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  material: THREE.LineBasicMaterial;
}

export function createOrbitLine(
  body: SolarBody,
  segmentCount: number,
): OrbitLineResult | null {
  if (body.semiMajorAxis <= 0) {
    return null;
  }

  const positions: number[] = [];

  sampleOrbitAngles(segmentCount).forEach((angle) => {
    const point = getInclinedOrbitPosition(body, angle);
    positions.push(point.x, point.y, point.z);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );

  const baseColor = new THREE.Color(body.color).lerp(new THREE.Color("#7fc7ff"), 0.34);
  const selectedColor = new THREE.Color("#b9dcff");
  const material = new THREE.LineBasicMaterial({
    color: baseColor,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  material.userData.baseColor = baseColor.clone();
  material.userData.selectedColor = selectedColor;

  const line = new THREE.Line(geometry, material);
  line.name = `${body.name}-orbit`;

  return { line, material };
}
