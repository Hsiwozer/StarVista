import * as THREE from "three";
import type { SolarBody } from "../../data/solarSystem";

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

  const a = body.semiMajorAxis;
  const b = a * Math.sqrt(1 - body.eccentricity ** 2);
  const positions: number[] = [];

  for (let index = 0; index <= segmentCount; index += 1) {
    const angle = (index / segmentCount) * Math.PI * 2;
    positions.push(a * Math.cos(angle), 0, b * Math.sin(angle));
  }

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
