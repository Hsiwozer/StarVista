import * as THREE from "three";

export interface AsteroidBeltResult {
  group: THREE.Group;
  update: (delta: number, timeScale: number) => void;
  disposableTextures: THREE.Texture[];
}

interface AsteroidBeltOptions {
  innerRadius: number;
  outerRadius: number;
  isMobile: boolean;
  orbitalSpeed: number;
}

function seededRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

interface AsteroidState {
  angle: number;
  radius: number;
  ellipse: number;
  height: number;
  scale: THREE.Vector3;
  rotation: THREE.Euler;
  spin: THREE.Vector3;
  orbitSpeed: number;
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
        Math.sin(x * 0.13 + seed) * 0.15 +
        Math.sin(y * 0.17 + seed * 1.7) * 0.13 +
        Math.sin((x + y) * 0.047 + seed * 0.9) * 0.18 +
        (random() - 0.5) * 0.24;
      const vein = Math.sin(x * 0.035 + y * 0.061 + seed * 2.2) > 0.72 ? 0.16 : 0;
      const shade = THREE.MathUtils.clamp(0.58 + grain + vein, 0.18, 1);

      if (bumpOnly) {
        const value = Math.round(255 * shade);
        image.data[index] = value;
        image.data[index + 1] = value;
        image.data[index + 2] = value;
      } else {
        image.data[index] = Math.round(122 * shade);
        image.data[index + 1] = Math.round(110 * shade);
        image.data[index + 2] = Math.round(94 * shade);
      }
      image.data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.8, 1.35);
  texture.anisotropy = 4;
  texture.colorSpace = bumpOnly ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createRockGeometry(seed: number) {
  const random = seededRandom(seed);
  const geometry =
    seed % 2 === 0
      ? new THREE.IcosahedronGeometry(1, 1)
      : new THREE.DodecahedronGeometry(1, 0);
  const positions = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    vertex.fromBufferAttribute(positions, index);
    const ridge =
      0.82 +
      random() * 0.34 +
      Math.sin(vertex.x * 2.7 + seed) * 0.045 +
      Math.sin(vertex.y * 3.1 + seed * 0.7) * 0.035;
    vertex.multiplyScalar(ridge);
    positions.setXYZ(index, vertex.x, vertex.y, vertex.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

function writeAsteroidMatrix(
  state: AsteroidState,
  matrix: THREE.Matrix4,
  position: THREE.Vector3,
  quaternion: THREE.Quaternion,
) {
  position.set(
    Math.cos(state.angle) * state.radius,
    state.height + Math.sin(state.angle * 2.9) * 0.035,
    Math.sin(state.angle) * state.radius * state.ellipse,
  );
  quaternion.setFromEuler(state.rotation);
  matrix.compose(position, quaternion, state.scale);
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
  const count = isMobile ? 260 : 760;
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
    color: "#9a8975",
    map: diffuseMap ?? undefined,
    bumpMap: bumpMap ?? undefined,
    bumpScale: 0.055,
    roughness: 0.96,
    metalness: 0,
    emissive: "#211b16",
    emissiveIntensity: 0.045,
    transparent: true,
    opacity: 0.9,
    flatShading: true,
    vertexColors: true,
  });
  const geometries = [createRockGeometry(101), createRockGeometry(217), createRockGeometry(439)];
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

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const color = new THREE.Color();
  const radiusSpan = outerRadius - innerRadius;

  for (let index = 0; index < count; index += 1) {
    const meshIndex = index % meshes.length;
    const instanceIndex = states[meshIndex].length;
    const mesh = meshes[meshIndex];
    const angle = random() * Math.PI * 2;
    const bandNoise = Math.pow(random(), 0.86);
    const radius = innerRadius + radiusSpan * bandNoise;
    const ellipse = 0.92 + random() * 0.16;
    const height = (random() - 0.5) * (isMobile ? 0.48 : 0.72);
    const sizeBias = Math.pow(random(), 2.35);
    const visualAnchor = index % 43 === 0 ? 1.75 + random() * 0.7 : 1;
    const baseSize =
      ((isMobile ? 0.018 : 0.016) + sizeBias * (isMobile ? 0.072 : 0.095)) *
      visualAnchor;
    const state: AsteroidState = {
      angle,
      radius: radius * (0.985 + random() * 0.03),
      ellipse,
      height,
      scale: new THREE.Vector3(
        baseSize * (0.72 + random() * 0.62),
        baseSize * (0.58 + random() * 0.78),
        baseSize * (0.76 + random() * 0.68),
      ),
      rotation: new THREE.Euler(random() * Math.PI, random() * Math.PI, random() * Math.PI),
      spin: new THREE.Vector3(
        (random() - 0.5) * 0.18,
        0.04 + random() * 0.22,
        (random() - 0.5) * 0.16,
      ),
      orbitSpeed: orbitalSpeed * (0.56 + random() * 0.92),
    };

    states[meshIndex].push(state);
    writeAsteroidMatrix(state, matrix, position, quaternion);
    mesh.setMatrixAt(instanceIndex, matrix);

    color.set(index % 11 === 0 ? "#9a8469" : index % 7 === 0 ? "#5e5b56" : "#7a6d60");
    color.multiplyScalar(0.68 + random() * 0.46);
    mesh.setColorAt(instanceIndex, color);
  }

  meshes.forEach((mesh) => {
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  return {
    group,
    update: (delta: number, timeScale: number) => {
      const scaledDelta = delta * timeScale;
      states.forEach((meshStates, meshIndex) => {
        const mesh = meshes[meshIndex];
        meshStates.forEach((state, index) => {
          state.angle += scaledDelta * state.orbitSpeed;
          state.rotation.x += scaledDelta * state.spin.x;
          state.rotation.y += scaledDelta * state.spin.y;
          state.rotation.z += scaledDelta * state.spin.z;
          writeAsteroidMatrix(state, matrix, position, quaternion);
          mesh.setMatrixAt(index, matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
      });
    },
    disposableTextures,
  };
}
