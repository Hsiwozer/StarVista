import * as THREE from "three";

export interface AsteroidBeltResult {
  group: THREE.Group;
  clickTargets: THREE.Object3D[];
  update: (delta: number, timeScale: number) => void;
  setHovered: (hovered: boolean) => void;
  disposableTextures: THREE.Texture[];
}

interface AsteroidBeltOptions {
  innerRadius: number;
  outerRadius: number;
  isMobile: boolean;
  orbitalSpeed: number;
}

interface AsteroidState {
  angle: number;
  radius: number;
  ellipse: number;
  height: number;
  inclination: number;
  node: number;
  verticalPhase: number;
  scale: THREE.Vector3;
  orientation: THREE.Quaternion;
  spinAxis: THREE.Vector3;
  rollRate: number;
  tumbleAxis: THREE.Vector3;
  wobbleRate: number;
  orbitSpeed: number;
}

interface RepresentativeAsteroidState extends AsteroidState {
  mesh: THREE.Mesh;
}

const rockPalette = [
  "#8b887f",
  "#817769",
  "#756554",
  "#6f7779",
  "#696b65",
  "#725b4c",
  "#927f67",
  "#7b6258",
];

const dustPalette = ["#c2c0b8", "#adb5b8", "#c2b296", "#d0cab8", "#9da3a1"];

function seededRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function randomSigned(random: () => number) {
  return random() * 2 - 1;
}

function randomBetween(random: () => number, min: number, max: number) {
  return min + (max - min) * random();
}

function createAsteroidTexture(seed: number, bumpOnly = false) {
  const random = seededRandom(seed);
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const image = context.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const index = (y * canvas.width + x) * 4;
      const grain =
        Math.sin(x * 0.12 + seed) * 0.11 +
        Math.sin(y * 0.16 + seed * 1.7) * 0.1 +
        Math.sin((x + y) * 0.045 + seed * 0.9) * 0.13 +
        (random() - 0.5) * 0.18;
      const vein = Math.sin(x * 0.036 + y * 0.058 + seed * 2.2) > 0.72 ? 0.1 : 0;
      const shade = THREE.MathUtils.clamp(0.72 + grain + vein, 0.42, 1);

      if (bumpOnly) {
        const value = Math.round(255 * shade);
        image.data[index] = value;
        image.data[index + 1] = value;
        image.data[index + 2] = value;
      } else {
        image.data[index] = Math.round(170 * shade);
        image.data[index + 1] = Math.round(162 * shade);
        image.data[index + 2] = Math.round(148 * shade);
      }
      image.data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.1, 1.7);
  texture.anisotropy = 4;
  texture.colorSpace = bumpOnly ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createBaseGeometry(seed: number) {
  if (seed % 5 === 0) {
    return new THREE.IcosahedronGeometry(1, 2);
  }
  if (seed % 5 === 1) {
    return new THREE.DodecahedronGeometry(1, 0);
  }
  if (seed % 5 === 2) {
    return new THREE.SphereGeometry(1, 8, 6);
  }
  if (seed % 5 === 3) {
    return new THREE.IcosahedronGeometry(1, 0);
  }

  return new THREE.IcosahedronGeometry(1, 1);
}

function createRockGeometry(seed: number) {
  const random = seededRandom(seed);
  const geometry = createBaseGeometry(seed);
  const positions = geometry.attributes.position;
  const vertex = new THREE.Vector3();
  const direction = new THREE.Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    vertex.fromBufferAttribute(positions, index);
    direction.copy(vertex).normalize();

    const ridge =
      0.84 +
      random() * 0.28 +
      Math.sin(direction.x * 3.1 + seed) * 0.055 +
      Math.sin(direction.y * 4.3 + seed * 0.7) * 0.042 +
      Math.sin(direction.z * 5.1 + seed * 1.3) * 0.04;
    vertex.set(
      vertex.x * ridge * randomBetween(random, 0.9, 1.12),
      vertex.y * ridge * randomBetween(random, 0.86, 1.12),
      vertex.z * ridge * randomBetween(random, 0.9, 1.14),
    );
    positions.setXYZ(index, vertex.x, vertex.y, vertex.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return geometry;
}

function sampleSparseAngle(random: () => number) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const angle = random() * Math.PI * 2;
    const softGapA = angle > Math.PI * 0.18 && angle < Math.PI * 0.38;
    const softGapB = angle > Math.PI * 1.36 && angle < Math.PI * 1.56;
    const densityWave = 0.64 + Math.sin(angle * 3.2 + 0.8) * 0.2 + Math.sin(angle * 7.1) * 0.09;
    const gapPenalty = softGapA || softGapB ? 0.34 : 1;

    if (random() < densityWave * gapPenalty) {
      return angle;
    }
  }

  return random() * Math.PI * 2;
}

function sampleHeight(random: () => number, isMobile: boolean) {
  const nearPlane = (random() + random() + random() - 1.5) * (isMobile ? 0.17 : 0.22);

  if (random() < 0.12) {
    return nearPlane + randomSigned(random) * randomBetween(random, 0.22, isMobile ? 0.42 : 0.62);
  }

  return nearPlane;
}

function sampleBaseSize(random: () => number, isMobile: boolean) {
  const roll = random();
  const mobileScale = isMobile ? 0.78 : 1;

  if (roll < 0.74) {
    return randomBetween(random, 0.0055, 0.016) * mobileScale;
  }
  if (roll < 0.97) {
    return randomBetween(random, 0.019, 0.047) * mobileScale;
  }

  return randomBetween(random, 0.055, 0.092) * mobileScale;
}

function createAsteroidState(
  random: () => number,
  innerRadius: number,
  outerRadius: number,
  isMobile: boolean,
  orbitalSpeed: number,
  overrides: Partial<AsteroidState> = {},
): AsteroidState {
  const radiusSpan = outerRadius - innerRadius;
  const angle = overrides.angle ?? sampleSparseAngle(random);
  const radius =
    overrides.radius ??
    innerRadius +
      radiusSpan *
        THREE.MathUtils.clamp(Math.pow(random(), 0.92) + Math.sin(angle * 2.4) * 0.045, 0, 1);
  const innerRatio = THREE.MathUtils.clamp((radius - innerRadius) / Math.max(radiusSpan, 0.001), 0, 1);
  const baseSize = sampleBaseSize(random, isMobile);
  const orientation = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(random() * Math.PI, random() * Math.PI, random() * Math.PI),
  );
  const spinAxis = new THREE.Vector3(
    randomSigned(random),
    randomSigned(random),
    randomSigned(random),
  ).normalize();
  const tumbleAxis = new THREE.Vector3(
    randomSigned(random),
    randomSigned(random),
    randomSigned(random),
  ).normalize();
  const inclination =
    random() < 0.84
      ? randomSigned(random) * randomBetween(random, 0.004, 0.018)
      : randomSigned(random) * randomBetween(random, 0.024, 0.052);

  return {
    angle,
    radius,
    ellipse: overrides.ellipse ?? randomBetween(random, 0.94, 1.08),
    height: overrides.height ?? sampleHeight(random, isMobile),
    inclination: overrides.inclination ?? inclination,
    node: overrides.node ?? random() * Math.PI * 2,
    verticalPhase: overrides.verticalPhase ?? random() * Math.PI * 2,
    scale:
      overrides.scale ??
      new THREE.Vector3(
        baseSize * randomBetween(random, 0.66, 1.3),
        baseSize * randomBetween(random, 0.5, 1.02),
        baseSize * randomBetween(random, 0.66, 1.24),
      ),
    orientation: overrides.orientation ?? orientation,
    spinAxis: overrides.spinAxis ?? spinAxis,
    rollRate: overrides.rollRate ?? randomBetween(random, 0.035, 0.22),
    tumbleAxis: overrides.tumbleAxis ?? tumbleAxis,
    wobbleRate:
      overrides.wobbleRate ??
      (random() < 0.16 ? randomBetween(random, 0.016, 0.052) : 0),
    orbitSpeed:
      overrides.orbitSpeed ??
      orbitalSpeed * THREE.MathUtils.lerp(1.28, 0.72, innerRatio) * randomBetween(random, 0.82, 1.16),
  };
}

function writeAsteroidMatrix(
  state: AsteroidState,
  matrix: THREE.Matrix4,
  position: THREE.Vector3,
) {
  const orbitHeight =
    state.height +
    Math.sin(state.angle + state.node) * state.radius * state.inclination +
    Math.sin(state.angle * 2.7 + state.verticalPhase) * 0.035;

  position.set(
    Math.cos(state.angle) * state.radius,
    orbitHeight,
    Math.sin(state.angle) * state.radius * state.ellipse,
  );
  matrix.compose(position, state.orientation, state.scale);
}

function createDustLayer(
  random: () => number,
  innerRadius: number,
  outerRadius: number,
  isMobile: boolean,
  layer: "near" | "far",
) {
  const count = isMobile ? (layer === "near" ? 520 : 360) : layer === "near" ? 1280 : 900;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const angle = sampleSparseAngle(random);
    const radius = randomBetween(random, innerRadius, outerRadius);
    const height = sampleHeight(random, isMobile) * (layer === "near" ? 0.84 : 1.28);
    const ellipse = randomBetween(random, 0.95, 1.08);

    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = height + Math.sin(angle * 2.2) * 0.04;
    positions[index * 3 + 2] = Math.sin(angle) * radius * ellipse;

    color.set(dustPalette[index % dustPalette.length]);
    color.multiplyScalar(randomBetween(random, layer === "near" ? 0.34 : 0.24, layer === "near" ? 0.66 : 0.5));
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: isMobile ? (layer === "near" ? 0.013 : 0.008) : layer === "near" ? 0.011 : 0.007,
    vertexColors: true,
    transparent: true,
    opacity: layer === "near" ? 0.13 : 0.075,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.name = `Asteroid-belt-dust-${layer}`;

  return points;
}

function createRepresentativeAsteroid(
  name: string,
  seed: number,
  state: AsteroidState,
  texture: THREE.Texture | null,
) {
  const material = new THREE.MeshStandardMaterial({
    color: seed % 2 === 0 ? "#928570" : "#7f8179",
    map: texture ?? undefined,
    roughness: 0.99,
    metalness: 0,
    emissive: "#171513",
    emissiveIntensity: 0.018,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(createRockGeometry(seed), material);
  mesh.name = `Asteroid-belt-${name}`;
  mesh.userData.hoverLabel = name;

  return {
    ...state,
    mesh,
  };
}

export function createAsteroidBelt({
  innerRadius,
  outerRadius,
  isMobile,
  orbitalSpeed,
}: AsteroidBeltOptions): AsteroidBeltResult {
  const group = new THREE.Group();
  group.name = "Asteroid-belt";

  const random = seededRandom(2849);
  const count = isMobile ? 340 : 860;
  const disposableTextures: THREE.Texture[] = [];
  const diffuseMap = createAsteroidTexture(7721);
  const bumpMap = createAsteroidTexture(8363, true);

  if (diffuseMap) {
    disposableTextures.push(diffuseMap);
  }
  if (bumpMap) {
    disposableTextures.push(bumpMap);
  }

  const material = new THREE.MeshStandardMaterial({
    color: "#d0c7b8",
    map: diffuseMap ?? undefined,
    bumpMap: bumpMap ?? undefined,
    bumpScale: 0.026,
    roughness: 0.99,
    metalness: 0,
    emissive: "#1a1714",
    emissiveIntensity: 0.018,
    transparent: true,
    opacity: 0.88,
    flatShading: true,
    vertexColors: true,
  });
  const geometries = [
    createRockGeometry(101),
    createRockGeometry(217),
    createRockGeometry(439),
    createRockGeometry(563),
    createRockGeometry(701),
  ];
  const meshCounts = geometries.map((_, index) =>
    Math.floor((count + geometries.length - 1 - index) / geometries.length),
  );
  const meshes = geometries.map((geometry, index) => {
    const mesh = new THREE.InstancedMesh(geometry, material, meshCounts[index]);
    mesh.name = `Asteroid-belt-rocks-${index + 1}`;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(mesh);
    return mesh;
  });
  const states = meshes.map(() => [] as AsteroidState[]);
  const dustLayers = [
    createDustLayer(random, innerRadius, outerRadius, isMobile, "near"),
    createDustLayer(random, innerRadius, outerRadius, isMobile, "far"),
  ];

  dustLayers.forEach((layer) => group.add(layer));

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const spinDelta = new THREE.Quaternion();
  const tumbleDelta = new THREE.Quaternion();
  const color = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const meshIndex = index % meshes.length;
    const instanceIndex = states[meshIndex].length;
    const mesh = meshes[meshIndex];
    const state = createAsteroidState(random, innerRadius, outerRadius, isMobile, orbitalSpeed);

    states[meshIndex].push(state);
    writeAsteroidMatrix(state, matrix, position);
    mesh.setMatrixAt(instanceIndex, matrix);

    color.set(rockPalette[Math.floor(random() * rockPalette.length)]);
    color.multiplyScalar(randomBetween(random, 0.92, 1.24));
    mesh.setColorAt(instanceIndex, color);
  }

  const representativeConfigs = [
    { name: "Ceres / 谷神星", seed: 907, angle: 0.72, radiusRatio: 0.42, size: 0.14 },
    { name: "Vesta / 灶神星", seed: 911, angle: 2.28, radiusRatio: 0.28, size: 0.095 },
    { name: "Pallas / 智神星", seed: 919, angle: 3.92, radiusRatio: 0.66, size: 0.088 },
    { name: "Hygiea / 健神星", seed: 929, angle: 5.48, radiusRatio: 0.78, size: 0.082 },
  ];
  const representatives: RepresentativeAsteroidState[] = representativeConfigs
    .slice(0, isMobile ? 2 : 4)
    .map((config) => {
      const state = createAsteroidState(random, innerRadius, outerRadius, isMobile, orbitalSpeed, {
        angle: config.angle,
        radius: THREE.MathUtils.lerp(innerRadius, outerRadius, config.radiusRatio),
        height: randomSigned(random) * 0.16,
        inclination: randomSigned(random) * 0.018,
        scale: new THREE.Vector3(config.size * 1.16, config.size * 0.78, config.size),
        rollRate: randomBetween(random, 0.028, 0.08),
        orbitSpeed: orbitalSpeed * randomBetween(random, 0.78, 0.98),
      });
      return createRepresentativeAsteroid(config.name, config.seed, state, diffuseMap);
    });

  representatives.forEach((state) => {
    writeAsteroidMatrix(state, matrix, position);
    state.mesh.matrix.copy(matrix);
    state.mesh.matrixAutoUpdate = false;
    state.mesh.matrixWorldNeedsUpdate = true;
    group.add(state.mesh);
  });

  meshes.forEach((mesh) => {
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  let hoverTarget = 0;
  let hoverAmount = 0;
  const baseDustOpacities = dustLayers.map((layer) => {
    const layerMaterial = layer.material as THREE.PointsMaterial;
    return layerMaterial.opacity;
  });

  return {
    group,
    clickTargets: [...meshes, ...representatives.map((state) => state.mesh)],
    setHovered: (hovered: boolean) => {
      hoverTarget = hovered ? 1 : 0;
    },
    update: (delta: number, timeScale: number) => {
      const scaledDelta = delta * timeScale;
      hoverAmount = THREE.MathUtils.lerp(hoverAmount, hoverTarget, 0.08);
      material.emissiveIntensity = THREE.MathUtils.lerp(0.018, 0.034, hoverAmount);
      material.opacity = THREE.MathUtils.lerp(0.88, 0.94, hoverAmount);
      dustLayers.forEach((layer, index) => {
        const layerMaterial = layer.material as THREE.PointsMaterial;
        layerMaterial.opacity = THREE.MathUtils.lerp(
          baseDustOpacities[index],
          baseDustOpacities[index] * 1.55,
          hoverAmount,
        );
        layer.rotation.y += scaledDelta * orbitalSpeed * (index === 0 ? 0.09 : 0.052);
      });

      states.forEach((meshStates, meshIndex) => {
        const mesh = meshes[meshIndex];
        meshStates.forEach((state, index) => {
          state.angle += scaledDelta * state.orbitSpeed;
          spinDelta.setFromAxisAngle(state.spinAxis, scaledDelta * state.rollRate);
          state.orientation.multiply(spinDelta).normalize();

          if (state.wobbleRate > 0) {
            tumbleDelta.setFromAxisAngle(state.tumbleAxis, scaledDelta * state.wobbleRate);
            state.orientation.multiply(tumbleDelta).normalize();
          }

          writeAsteroidMatrix(state, matrix, position);
          mesh.setMatrixAt(index, matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
      });

      representatives.forEach((state) => {
        state.angle += scaledDelta * state.orbitSpeed;
        spinDelta.setFromAxisAngle(state.spinAxis, scaledDelta * state.rollRate);
        state.orientation.multiply(spinDelta).normalize();
        writeAsteroidMatrix(state, matrix, position);
        state.mesh.matrix.copy(matrix);
        state.mesh.matrixWorldNeedsUpdate = true;
      });
    },
    disposableTextures,
  };
}
