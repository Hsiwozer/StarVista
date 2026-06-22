import * as THREE from "three";
import type { SolarBody } from "../../data/solarSystem";

export interface PlanetSelectionIndicator {
  group: THREE.Group;
  rimGlow: THREE.Sprite;
  innerRing: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  outerRing: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  opacity: number;
  selectedOpacity: number;
  hoverOpacity: number;
}

const cameraFacingQuaternion = new THREE.Quaternion();
const parentWorldQuaternion = new THREE.Quaternion();

function createRimGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(160, 210, 255, 0)");
  gradient.addColorStop(0.52, "rgba(160, 210, 255, 0)");
  gradient.addColorStop(0.68, "rgba(185, 220, 255, 0.16)");
  gradient.addColorStop(0.84, "rgba(150, 205, 255, 0.075)");
  gradient.addColorStop(1, "rgba(160, 210, 255, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createSegmentedRingGeometry(radius: number, segmentCount: number, arcFill: number) {
  const positions: number[] = [];

  for (let index = 0; index < segmentCount; index += 1) {
    const phase = index % 12;

    if (phase === 5 || phase === 11) {
      continue;
    }

    const start = (index / segmentCount) * Math.PI * 2;
    const end = ((index + arcFill) / segmentCount) * Math.PI * 2;
    positions.push(
      Math.cos(start) * radius,
      Math.sin(start) * radius,
      0,
      Math.cos(end) * radius,
      Math.sin(end) * radius,
      0,
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

  return geometry;
}

function createRing(
  radius: number,
  segmentCount: number,
  arcFill: number,
  opacity: number,
) {
  const material = new THREE.LineBasicMaterial({
    color: "#b9dcff",
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  });
  const ring = new THREE.LineSegments(
    createSegmentedRingGeometry(radius, segmentCount, arcFill),
    material,
  );
  ring.userData.baseOpacity = opacity;
  ring.renderOrder = 8;

  return ring;
}

export function createPlanetSelectionIndicator(
  body: SolarBody,
  disposableTextures: THREE.Texture[],
): PlanetSelectionIndicator | null {
  if (body.id === "sun") {
    return null;
  }

  const group = new THREE.Group();
  group.name = `${body.name}-selection-indicator`;
  group.visible = false;
  group.renderOrder = 8;

  const innerRing = createRing(body.visualRadius * 1.24, 84, 0.66, 0.36);
  innerRing.name = `${body.name}-selection-inner-ring`;
  const outerRing = createRing(body.visualRadius * 1.35, 72, 0.52, 0.26);
  outerRing.name = `${body.name}-selection-outer-ring`;
  outerRing.rotation.z = Math.PI / 24;
  group.add(innerRing, outerRing);

  const glowTexture = createRimGlowTexture();
  const rimGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture ?? undefined,
      color: "#a8d7ff",
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    }),
  );
  const glowDiameter = body.visualRadius * 3.3;
  rimGlow.name = `${body.name}-selection-rim-glow`;
  rimGlow.scale.set(glowDiameter, glowDiameter, 1);
  rimGlow.renderOrder = 7;
  group.add(rimGlow);

  if (glowTexture) {
    disposableTextures.push(glowTexture);
  }

  return {
    group,
    rimGlow,
    innerRing,
    outerRing,
    opacity: 0,
    selectedOpacity: 0,
    hoverOpacity: 0,
  };
}

export function updatePlanetSelectionIndicator(
  indicator: PlanetSelectionIndicator,
  parent: THREE.Object3D,
  camera: THREE.Camera,
  isSelected: boolean,
  isHovered: boolean,
  delta: number,
  time: number,
) {
  indicator.selectedOpacity = THREE.MathUtils.lerp(
    indicator.selectedOpacity,
    isSelected ? 1 : 0,
    isSelected ? 0.11 : 0.16,
  );
  indicator.hoverOpacity = THREE.MathUtils.lerp(
    indicator.hoverOpacity,
    !isSelected && isHovered ? 1 : 0,
    isHovered ? 0.14 : 0.18,
  );
  indicator.opacity = Math.max(indicator.selectedOpacity, indicator.hoverOpacity * 0.42);
  indicator.group.visible = indicator.opacity > 0.012;

  parent.getWorldQuaternion(parentWorldQuaternion);
  cameraFacingQuaternion.copy(parentWorldQuaternion).invert().multiply(camera.quaternion);
  indicator.group.quaternion.copy(cameraFacingQuaternion);

  const breath = 0.92 + Math.sin(time * 0.00125) * 0.08;
  const slowBreath = 0.94 + Math.sin(time * 0.0009 + 1.7) * 0.06;
  const innerMaterial = indicator.innerRing.material;
  const outerMaterial = indicator.outerRing.material;
  const rimMaterial = indicator.rimGlow.material;

  innerMaterial.opacity =
    (indicator.selectedOpacity * Number(indicator.innerRing.userData.baseOpacity ?? 0.34) +
      indicator.hoverOpacity * 0.082) *
    breath;
  outerMaterial.opacity =
    indicator.selectedOpacity *
    Number(indicator.outerRing.userData.baseOpacity ?? 0.24) *
    slowBreath;
  rimMaterial.opacity =
    (indicator.selectedOpacity * 0.17 + indicator.hoverOpacity * 0.052) * slowBreath;

  indicator.innerRing.rotation.z += delta * 0.16;
  indicator.outerRing.rotation.z -= delta * 0.105;
}
