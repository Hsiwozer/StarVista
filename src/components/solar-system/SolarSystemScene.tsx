import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { asteroidBeltBody, type SolarBody, type SolarBodyId } from "../../data/solarSystem";
import { createAsteroidBelt, type AsteroidBeltResult } from "./AsteroidBelt";
import { createOrbitLine } from "./OrbitLine";
import { createPlanetMesh } from "./PlanetMesh";
import {
  updatePlanetSelectionIndicator,
  type PlanetSelectionIndicator,
} from "./SelectionIndicator";

interface SolarSystemSceneProps {
  bodies: SolarBody[];
  selectedBodyId: SolarBodyId | null;
  timeScale: number;
  labelsVisible: boolean;
  onSelect: (body: SolarBody | null) => void;
  onHover: (body: SolarBody | null) => void;
  onDeepSpaceEchoTelemetry?: (telemetry: DeepSpaceEchoTelemetry) => void;
}

interface BodyRecord {
  body: SolarBody;
  group: THREE.Group;
  bodyMesh: THREE.Mesh;
  selectionIndicator: PlanetSelectionIndicator | null;
  sunGlowLayers: THREE.Sprite[];
  orbitMaterial?: THREE.LineBasicMaterial;
  disposableTextures: THREE.Texture[];
}

interface HoverLabel {
  visible: boolean;
  bodyId: SolarBodyId | null;
  text: string;
  x: number;
  y: number;
}

interface PickableObject extends THREE.Object3D {
  userData: {
    bodyId?: SolarBodyId;
    selectableBody?: SolarBody;
    hoverLabel?: string;
  };
}

export interface DeepSpaceEchoTelemetry {
  earthClockAngleDegrees: number;
  echoTargetClockAngleDegrees: number;
  echoToleranceDegrees: number;
  isEarthInEchoWindow: boolean;
  isEarthNearViewportCenter: boolean;
  isCameraTargetNearEarth: boolean;
}

const overviewCameraPosition = new THREE.Vector3(0, 29, 53);
const overviewTarget = new THREE.Vector3(0, 0, 0);
const focusedPlanetFollowLerpFactor = 0.1;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const echoTargetClockAngleDegrees = 9 * 30 + 19 * 0.5;
const echoToleranceDegrees = 4;

function normalizeDegrees(angle: number) {
  return ((angle % 360) + 360) % 360;
}

function getAngleDistanceDegrees(angle: number, target: number) {
  const distance = Math.abs(normalizeDegrees(angle) - normalizeDegrees(target));
  return Math.min(distance, 360 - distance);
}

function isEarthAtEchoCoordinate(earthClockAngleDegrees: number) {
  return (
    getAngleDistanceDegrees(earthClockAngleDegrees, echoTargetClockAngleDegrees) <=
    echoToleranceDegrees
  );
}

function getEarthClockAngleDegrees(position: THREE.Vector3) {
  /*
   * "9:19 回响坐标" 是 StarVista 内部宇宙的轨道方位，不是现实日期或时间。
   * 当前太阳系轨道位于 x/z 平面：太阳在原点，日地连线是放平钟面的指针。
   * 这里把 +z 视作 12 点方向，并沿钟面顺时针转向 +x；因此钟面角度使用
   * atan2(x, z)。若换成项目内部常见的数学角 atan2(z, x)，则等价于
   * internalAngle = 90deg - clockAngle。
   */
  return normalizeDegrees(THREE.MathUtils.radToDeg(Math.atan2(position.x, position.z)));
}


function getBodyPosition(body: SolarBody, elapsedDays: number) {
  if (body.semiMajorAxis <= 0) {
    return new THREE.Vector3(0, 0, 0);
  }

  // Visual-enhanced Kepler orbit: distance is compressed, but eccentricity
  // and period ratios stay close to the real solar system.
  const angle = body.initialAngle + elapsedDays * body.orbitSpeed;
  const a = body.semiMajorAxis;
  const b = a * Math.sqrt(1 - body.eccentricity ** 2);

  return new THREE.Vector3(a * Math.cos(angle), 0, b * Math.sin(angle));
}

function getSatellitePosition(
  body: SolarBody,
  records: Map<SolarBodyId, BodyRecord>,
  elapsedDays: number,
) {
  const parent = body.parentId ? records.get(body.parentId) : undefined;

  if (!parent) {
    return getBodyPosition(body, elapsedDays);
  }

  const angle = body.initialAngle + elapsedDays * body.orbitSpeed;
  const radius = body.satelliteOrbitRadius ?? parent.body.visualRadius * 2.35;
  const height = body.satelliteOrbitHeight ?? parent.body.visualRadius * 0.22;

  return parent.group.position.clone().add(
    new THREE.Vector3(
      Math.cos(angle) * radius,
      height + Math.sin(angle * 1.7) * 0.08,
      Math.sin(angle) * radius * 0.86,
    ),
  );
}

function createStarfield(isMobile: boolean) {
  const count = isMobile ? 420 : 880;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const blue = new THREE.Color("#7fc7ff");
  const purple = new THREE.Color("#b59cff");
  const amber = new THREE.Color("#fff0c7");
  const white = new THREE.Color("#f6f8ff");

  for (let index = 0; index < count; index += 1) {
    const radius = 72 + Math.random() * 78;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const color =
      index % 41 === 0 ? amber : index % 9 === 0 ? blue : index % 13 === 0 ? purple : white;

    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.cos(phi) * 0.72;
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: isMobile ? 0.064 : 0.052,
    vertexColors: true,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

function setObjectOpacity(mesh: THREE.Mesh, opacity: number) {
  const material = mesh.material;

  if (Array.isArray(material)) {
    material.forEach((item) => {
      item.transparent = true;
      item.opacity = opacity;
    });
    return;
  }

  material.transparent = true;
  material.opacity = opacity;
}

function updateEarthSunDirection(record: BodyRecord) {
  const material = Array.isArray(record.bodyMesh.material)
    ? record.bodyMesh.material[0]
    : record.bodyMesh.material;
  const sunDirection = material.userData.sunDirection as THREE.Vector3 | undefined;

  if (!sunDirection) {
    return;
  }

  sunDirection.copy(record.group.position).multiplyScalar(-1);

  if (sunDirection.lengthSq() < 0.0001) {
    sunDirection.set(-1, 0, 0);
    return;
  }

  sunDirection.normalize();
}

function getFocusDistance(body: SolarBody) {
  if (body.id === "sun") {
    return Math.max(body.visualRadius * 6.2, 22);
  }

  if (body.id === "moon") {
    return Math.max(body.visualRadius * 13, 8.2);
  }

  return Math.max(body.visualRadius * 6.4, 8.4);
}

export function SolarSystemScene({
  bodies,
  selectedBodyId,
  timeScale,
  labelsVisible,
  onSelect,
  onHover,
  onDeepSpaceEchoTelemetry,
}: SolarSystemSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const labelRefs = useRef<Map<SolarBodyId, HTMLSpanElement>>(new Map());
  const recordsRef = useRef<Map<SolarBodyId, BodyRecord>>(new Map());
  const clickableRef = useRef<THREE.Object3D[]>([]);
  const frameRef = useRef<number | null>(null);
  const elapsedDaysRef = useRef(0);
  const lastTimeRef = useRef(0);
  const selectedRef = useRef<SolarBodyId | null>(selectedBodyId);
  const hoveredRef = useRef<SolarBodyId | null>(null);
  const timeScaleRef = useRef(timeScale);
  const labelsVisibleRef = useRef(labelsVisible);
  const cameraMoveRef = useRef<{
    active: boolean;
    position: THREE.Vector3;
    target: THREE.Vector3;
    startedAt: number;
  }>({
    active: false,
    position: overviewCameraPosition.clone(),
    target: overviewTarget.clone(),
    startedAt: 0,
  });
  const focusTargetRef = useRef<THREE.Object3D | null>(null);
  const cameraOffsetRef = useRef(new THREE.Vector3());
  const focusTargetWorldPositionRef = useRef(new THREE.Vector3());
  const desiredCameraPositionRef = useRef(new THREE.Vector3());
  const focusDirectionRef = useRef(new THREE.Vector3());
  const isUserOrbitingRef = useRef(false);
  const [hoverLabel, setHoverLabel] = useState<HoverLabel>({
    visible: false,
    bodyId: null,
    text: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    timeScaleRef.current = timeScale;
  }, [timeScale]);

  useEffect(() => {
    labelsVisibleRef.current = labelsVisible;
  }, [labelsVisible]);

  useEffect(() => {
    selectedRef.current = selectedBodyId;

    const record = selectedBodyId
      ? recordsRef.current.get(selectedBodyId)
      : undefined;

    if (selectedBodyId && record) {
      const camera = cameraRef.current;
      const targetWorldPosition = focusTargetWorldPositionRef.current;
      const cameraOffset = cameraOffsetRef.current;
      const focusDirection = focusDirectionRef.current;
      const desiredCameraPosition = desiredCameraPositionRef.current;
      const focusDistance = getFocusDistance(record.body);

      record.group.getWorldPosition(targetWorldPosition);

      if (camera) {
        focusDirection.copy(camera.position).sub(targetWorldPosition);
      } else {
        focusDirection.set(0.58, 0.32, 0.72);
      }

      if (focusDirection.lengthSq() < 0.0001) {
        focusDirection.set(0.58, 0.32, 0.72);
      }

      focusDirection.normalize();
      cameraOffset.copy(focusDirection).multiplyScalar(focusDistance);
      desiredCameraPosition.copy(targetWorldPosition).add(cameraOffset);
      focusTargetRef.current = record.group;
      cameraMoveRef.current = {
        active: true,
        position: desiredCameraPosition.clone(),
        target: targetWorldPosition.clone(),
        startedAt: window.performance.now(),
      };
      return;
    }

    focusTargetRef.current = null;
    cameraMoveRef.current = {
      active: true,
      position: overviewCameraPosition.clone(),
      target: overviewTarget.clone(),
      startedAt: window.performance.now(),
    };
  }, [selectedBodyId]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#02030a", 0.011);

    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      260,
    );
    camera.position.copy(
      reducedMotion ? overviewCameraPosition : new THREE.Vector3(0, 36, 74),
    );
    cameraRef.current = camera;
    cameraMoveRef.current = {
      active: !reducedMotion,
      position: overviewCameraPosition.clone(),
      target: overviewTarget.clone(),
      startedAt: window.performance.now(),
    };

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 8;
    controls.maxDistance = 88;
    controls.maxPolarAngle = Math.PI * 0.82;
    controls.target.copy(overviewTarget);
    controlsRef.current = controls;

    const updateFocusedPlanetOffset = () => {
      const focusTarget = focusTargetRef.current;

      if (!focusTarget || !focusTarget.parent) {
        focusTargetRef.current = null;
        return;
      }

      focusTarget.getWorldPosition(focusTargetWorldPositionRef.current);
      cameraOffsetRef.current
        .copy(camera.position)
        .sub(focusTargetWorldPositionRef.current);
    };

    const handleControlsStart = () => {
      isUserOrbitingRef.current = true;

      if (focusTargetRef.current) {
        cameraMoveRef.current.active = false;
      }
    };

    const handleControlsChange = () => {
      if (isUserOrbitingRef.current && focusTargetRef.current) {
        updateFocusedPlanetOffset();
      }
    };

    const handleControlsEnd = () => {
      if (isUserOrbitingRef.current && focusTargetRef.current) {
        updateFocusedPlanetOffset();
      }

      isUserOrbitingRef.current = false;
    };

    controls.addEventListener("start", handleControlsStart);
    controls.addEventListener("change", handleControlsChange);
    controls.addEventListener("end", handleControlsEnd);

    scene.add(new THREE.AmbientLight("#7fc7ff", 0.045));
    scene.add(new THREE.HemisphereLight("#a8cfff", "#02030a", 0.075));

    const sunLight = new THREE.PointLight("#ffe6b0", 28.5, 190, 1.12);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const coolFill = new THREE.DirectionalLight("#9fd7ff", 0.035);
    coolFill.position.set(-18, 26, 18);
    scene.add(coolFill);

    const focusFill = new THREE.PointLight("#d7e7ff", 0, 18, 1.8);
    scene.add(focusFill);

    const starfield = createStarfield(isMobile);
    scene.add(starfield);

    const records = recordsRef.current;
    const clickables = clickableRef.current;
    records.clear();
    clickables.length = 0;

    const orbitSegments = isMobile ? 128 : 192;
    const meshQuality = {
      sphereSegments: isMobile ? 48 : 64,
      ringSegments: isMobile ? 96 : 160,
      textureAnisotropy: Math.min(renderer.capabilities.getMaxAnisotropy(), isMobile ? 4 : 8),
    };

    bodies.forEach((body) => {
      const planet = createPlanetMesh(body, meshQuality);
      const orbit = createOrbitLine(body, orbitSegments);

      if (orbit) {
        scene.add(orbit.line);
      }

      planet.group.position.copy(
        body.parentId
          ? getSatellitePosition(body, records, elapsedDaysRef.current)
          : getBodyPosition(body, elapsedDaysRef.current),
      );
      scene.add(planet.group);
      planet.group.traverse((object) => clickables.push(object));

      records.set(body.id, {
        body,
        group: planet.group,
        bodyMesh: planet.bodyMesh,
        selectionIndicator: planet.selectionIndicator,
        sunGlowLayers: planet.sunGlowLayers,
        orbitMaterial: orbit?.material,
        disposableTextures: planet.disposableTextures,
      });
    });

    const mars = bodies.find((body) => body.id === "mars");
    const jupiter = bodies.find((body) => body.id === "jupiter");
    let asteroidBelt: AsteroidBeltResult | null = null;
    let lastEchoTelemetryAt = 0;
    const echoProjectedPosition = new THREE.Vector3();
    const focusFillOffset = new THREE.Vector3(3.2, 2.35, 3.6);

    if (mars && jupiter) {
      const orbitGap = jupiter.semiMajorAxis - mars.semiMajorAxis;
      asteroidBelt = createAsteroidBelt({
        innerRadius: mars.semiMajorAxis + orbitGap * 0.25,
        outerRadius: jupiter.semiMajorAxis - orbitGap * 0.24,
        isMobile,
        orbitalSpeed: (mars.orbitSpeed + jupiter.orbitSpeed) * 0.24,
      });
      asteroidBelt.clickTargets.forEach((target) => {
        target.userData.bodyId = asteroidBeltBody.id;
        target.userData.selectableBody = asteroidBeltBody;
      });
      clickables.push(...asteroidBelt.clickTargets);
      scene.add(asteroidBelt.group);
    }

    const updateHighlight = (delta: number, time: number) => {
      records.forEach((record) => {
        const isHovered = hoveredRef.current === record.body.id;
        const isSelected = selectedRef.current === record.body.id;
        const hasFocus = hoveredRef.current !== null || selectedRef.current !== null;
        const isDimmed =
          hasFocus &&
          !isHovered &&
          !isSelected &&
          record.body.id !== "sun";

        if (record.selectionIndicator) {
          updatePlanetSelectionIndicator(
            record.selectionIndicator,
            record.group,
            camera,
            isSelected,
            isHovered,
            delta,
            time,
          );
        }

        record.group.scale.lerp(
          new THREE.Vector3(
            isSelected ? 1.1 : isHovered ? 1.07 : 1,
            isSelected ? 1.1 : isHovered ? 1.07 : 1,
            isSelected ? 1.1 : isHovered ? 1.07 : 1,
          ),
          0.12,
        );

        if (record.orbitMaterial) {
          const targetOrbitOpacity = isSelected
            ? 0.27
            : isHovered
              ? 0.2
              : hasFocus
                ? 0.055
                : 0.13;
          const baseColor = record.orbitMaterial.userData.baseColor as THREE.Color | undefined;
          const selectedColor = record.orbitMaterial.userData.selectedColor as
            | THREE.Color
            | undefined;
          const targetOrbitColor =
            isSelected && selectedColor ? selectedColor : baseColor;

          record.orbitMaterial.opacity = THREE.MathUtils.lerp(
            record.orbitMaterial.opacity,
            targetOrbitOpacity,
            0.16,
          );

          if (targetOrbitColor) {
            record.orbitMaterial.color.lerp(targetOrbitColor, 0.12);
          }
        }

        setObjectOpacity(record.bodyMesh, isDimmed ? 0.44 : 1);
      });

      asteroidBelt?.setHovered(
        hoveredRef.current === asteroidBeltBody.id ||
          selectedRef.current === asteroidBeltBody.id,
      );
    };

    const updateLabels = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const projected = new THREE.Vector3();

      records.forEach((record) => {
        const label = labelRefs.current.get(record.body.id);
        if (!label) {
          return;
        }

        if (record.body.id === "sun") {
          label.style.opacity = "0";
          return;
        }

        projected
          .copy(record.group.position)
          .add(new THREE.Vector3(0, record.body.visualRadius * 1.45, 0))
          .project(camera);

        const isVisible =
          labelsVisibleRef.current &&
          projected.z > -1 &&
          projected.z < 1 &&
          projected.x > -1.12 &&
          projected.x < 1.12 &&
          projected.y > -1.12 &&
          projected.y < 1.12;
        const isSelectedLabel = selectedRef.current === record.body.id;
        const isHoveredLabel = hoveredRef.current === record.body.id;
        const isActive = isSelectedLabel || isHoveredLabel;
        const x = THREE.MathUtils.clamp((projected.x * 0.5 + 0.5) * width, 68, width - 68);
        const y = THREE.MathUtils.clamp((-projected.y * 0.5 + 0.5) * height, 68, height - 40);
        const hasSelection = selectedRef.current !== null;
        const shouldShow = isVisible && (!hasSelection || isActive);

        label.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -112%)`;
        label.style.opacity = shouldShow ? (isActive ? "0.96" : "0.48") : "0";
        label.dataset.active = isActive ? "true" : "false";
        label.dataset.state = isSelectedLabel ? "selected" : isHoveredLabel ? "hover" : "idle";
      });
    };

    const pickBody = (event: MouseEvent | PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const hits = raycaster.intersectObjects(clickables, true);
      const hit = hits.find((item) => {
        const object = item.object as PickableObject;
        return object.userData.bodyId || object.userData.selectableBody;
      });
      const object = hit?.object as PickableObject | undefined;
      const body = object?.userData.selectableBody;
      const bodyId = object?.userData.bodyId;

      if (body) {
        return {
          body,
          hoverLabel: object?.userData.hoverLabel ?? `${body.nameZh} ${body.name}`,
        };
      }

      const recordBody = bodyId ? records.get(bodyId)?.body ?? null : null;

      return {
        body: recordBody,
        hoverLabel: recordBody ? `${recordBody.nameZh} ${recordBody.name}` : "",
      };
    };

    const handlePointerMove = (event: PointerEvent) => {
      const picked = pickBody(event);
      const body = picked.body;
      const bodyId = body?.id ?? null;

      if (hoveredRef.current !== bodyId) {
        hoveredRef.current = bodyId;
        onHover(body);
      }

      if (body) {
        setHoverLabel({
          visible: true,
          bodyId,
          text: picked.hoverLabel,
          x: event.clientX + 16,
          y: event.clientY + 16,
        });
        return;
      }

      setHoverLabel((current) =>
        current.visible ? { ...current, visible: false } : current,
      );
    };

    const handlePointerLeave = () => {
      hoveredRef.current = null;
      onHover(null);
      setHoverLabel((current) =>
        current.visible ? { ...current, visible: false } : current,
      );
    };

    const handleClick = (event: MouseEvent) => {
      const { body } = pickBody(event);
      onSelect(body);
    };

    const handleResize = () => {
      const width = container.clientWidth;
      const height = Math.max(container.clientHeight, 1);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.6));
    };

    const updateFocusedPlanetTracking = () => {
      const focusTarget = focusTargetRef.current;

      if (!focusTarget || !focusTarget.parent) {
        focusTargetRef.current = null;
        return;
      }

      // Focused planet tracking / 聚焦行星跟随：锁定天体的实时世界坐标。
      focusTarget.getWorldPosition(focusTargetWorldPositionRef.current);
      desiredCameraPositionRef.current
        .copy(focusTargetWorldPositionRef.current)
        .add(cameraOffsetRef.current);

      camera.position.lerp(desiredCameraPositionRef.current, focusedPlanetFollowLerpFactor);
      controls.target.lerp(
        focusTargetWorldPositionRef.current,
        focusedPlanetFollowLerpFactor,
      );
    };

    const updateActiveCameraMoveTarget = () => {
      const focusTarget = focusTargetRef.current;

      if (!focusTarget || !focusTarget.parent) {
        return;
      }

      focusTarget.getWorldPosition(focusTargetWorldPositionRef.current);
      cameraMoveRef.current.target.copy(focusTargetWorldPositionRef.current);
      cameraMoveRef.current.position
        .copy(focusTargetWorldPositionRef.current)
        .add(cameraOffsetRef.current);
    };

    const updateDeepSpaceEchoTelemetry = (time: number) => {
      if (!onDeepSpaceEchoTelemetry || time - lastEchoTelemetryAt < 180) {
        return;
      }

      const earth = records.get("earth");

      if (!earth) {
        return;
      }

      lastEchoTelemetryAt = time;
      const earthClockAngleDegrees = getEarthClockAngleDegrees(earth.group.position);
      echoProjectedPosition.copy(earth.group.position).project(camera);
      const isEarthVisible =
        echoProjectedPosition.z > -1 &&
        echoProjectedPosition.z < 1;
      const centerTolerance = isMobile ? 0.28 : 0.22;
      const isEarthNearViewportCenter =
        isEarthVisible &&
        Math.abs(echoProjectedPosition.x) <= centerTolerance &&
        Math.abs(echoProjectedPosition.y) <= centerTolerance;
      const isCameraTargetNearEarth =
        controls.target.distanceTo(earth.group.position) <=
        Math.max(0.85, earth.body.visualRadius * 1.55);

      onDeepSpaceEchoTelemetry({
        earthClockAngleDegrees,
        echoTargetClockAngleDegrees,
        echoToleranceDegrees,
        isEarthInEchoWindow: isEarthAtEchoCoordinate(earthClockAngleDegrees),
        isEarthNearViewportCenter,
        isCameraTargetNearEarth,
      });
    };

    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    const animate = (time: number) => {
      const delta = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 0.05)
        : 0;
      lastTimeRef.current = time;
      elapsedDaysRef.current += delta * timeScaleRef.current;

      records.forEach((record) => {
        record.group.position.copy(
          record.body.parentId
            ? getSatellitePosition(record.body, records, elapsedDaysRef.current)
            : getBodyPosition(record.body, elapsedDaysRef.current),
        );
        record.bodyMesh.rotation.y +=
          delta * record.body.rotationSpeed * record.body.rotationDirection;

        if (record.body.id === "earth") {
          updateEarthSunDirection(record);
          const cloudLayer = record.group.getObjectByName("Earth-clouds");
          cloudLayer?.rotateY(delta * 0.18);
        }

        if (record.body.id === "sun") {
          const pulse = 1 + Math.sin(time * 0.0012) * 0.025;
          record.sunGlowLayers.forEach((glow, index) => {
            const material = glow.material;
            const baseOpacity = Number(glow.userData.baseOpacity ?? 0.08);
            const baseDiameter = Number(glow.userData.baseDiameter ?? record.body.visualRadius * 3);
            const diameter = baseDiameter * (pulse + index * 0.006);
            glow.scale.set(diameter, diameter, 1);

            material.opacity = baseOpacity * (0.94 + Math.sin(time * 0.0012 + index) * 0.08);
          });
          sunLight.intensity = 28.25 + Math.sin(time * 0.0012) * 0.95;
        }
      });

      if (selectedRef.current) {
        const selected = records.get(selectedRef.current);

        if (selected && selected.body.id !== "sun") {
          focusFill.position
            .copy(selected.group.position)
            .add(focusFillOffset);
          focusFill.intensity = THREE.MathUtils.lerp(focusFill.intensity, 0.18, 0.08);
        }
      } else {
        focusFill.intensity = THREE.MathUtils.lerp(focusFill.intensity, 0, 0.08);
      }

      if (cameraMoveRef.current.active) {
        updateActiveCameraMoveTarget();

        camera.position.lerp(cameraMoveRef.current.position, 0.055);
        controls.target.lerp(cameraMoveRef.current.target, 0.055);

        if (
          (camera.position.distanceTo(cameraMoveRef.current.position) < 0.08 &&
            controls.target.distanceTo(cameraMoveRef.current.target) < 0.08) ||
          time - cameraMoveRef.current.startedAt > 1800
        ) {
          cameraMoveRef.current.active = false;
        }
      } else {
        updateFocusedPlanetTracking();
      }

      asteroidBelt?.update(delta, timeScaleRef.current);
      starfield.rotation.y += delta * 0.004;
      starfield.rotation.x += delta * 0.0015;
      updateHighlight(delta, time);
      controls.update();
      updateLabels();
      updateDeepSpaceEchoTelemetry(time);
      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener("start", handleControlsStart);
      controls.removeEventListener("change", handleControlsChange);
      controls.removeEventListener("end", handleControlsEnd);
      controls.dispose();
      renderer.dispose();

      records.forEach((record) => {
        record.disposableTextures.forEach((texture) => texture.dispose());
      });
      asteroidBelt?.disposableTextures.forEach((texture) => texture.dispose());

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else {
            material.dispose();
          }
        }

        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else {
            material.dispose();
          }
        }

        if (object instanceof THREE.Sprite) {
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else {
            material.dispose();
          }
        }
      });

      container.removeChild(renderer.domElement);
      records.clear();
      clickables.length = 0;
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      focusTargetRef.current = null;
      isUserOrbitingRef.current = false;
    };
  }, [bodies, onDeepSpaceEchoTelemetry, onHover, onSelect]);

  const shouldShowHoverLabel =
    hoverLabel.visible && (!labelsVisible || hoverLabel.bodyId === "sun");

  return (
    <div ref={containerRef} className="solar-system-canvas" aria-label="实时 3D 太阳系">
      <div
        className={`solar-hover-label ${
          shouldShowHoverLabel ? "solar-hover-label-visible" : ""
        }`}
        style={{
          transform: `translate3d(${hoverLabel.x}px, ${hoverLabel.y}px, 0)`,
        }}
      >
        {hoverLabel.text}
      </div>
      <div className="solar-orbit-label-layer" aria-hidden="true">
        {bodies
          .filter((body) => body.id !== "sun")
          .map((body) => (
            <span
              key={body.id}
              ref={(element) => {
                if (element) {
                  labelRefs.current.set(body.id, element);
                  return;
                }
                labelRefs.current.delete(body.id);
              }}
              className="solar-orbit-label"
            >
              {body.nameZh} {body.name}
            </span>
          ))}
      </div>
    </div>
  );
}
