import * as THREE from "three";

export interface AsteroidBeltResult {
  group: THREE.Group;
  update: (delta: number, timeScale: number) => void;
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

export function createAsteroidBelt({
  innerRadius,
  outerRadius,
  isMobile,
  orbitalSpeed,
}: AsteroidBeltOptions): AsteroidBeltResult {
  const group = new THREE.Group();
  group.name = "Asteroid-belt";

  const random = seededRandom(2849);
  const count = isMobile ? 320 : 920;
  const geometry = new THREE.DodecahedronGeometry(1, 0);
  const material = new THREE.MeshStandardMaterial({
    color: "#72685d",
    roughness: 0.96,
    metalness: 0,
    transparent: true,
    opacity: 0.64,
    flatShading: true,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.name = "Asteroid-belt-instances";
  mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const color = new THREE.Color();
  const radiusSpan = outerRadius - innerRadius;

  for (let index = 0; index < count; index += 1) {
    const angle = random() * Math.PI * 2;
    const bandNoise = Math.pow(random(), 0.72);
    const radius = innerRadius + radiusSpan * bandNoise;
    const ellipse = 0.94 + random() * 0.1;
    const height = (random() - 0.5) * (isMobile ? 0.42 : 0.58);
    const size = (isMobile ? 0.028 : 0.024) + random() * (isMobile ? 0.06 : 0.082);

    position.set(
      Math.cos(angle) * radius * (0.985 + random() * 0.03),
      height,
      Math.sin(angle) * radius * ellipse,
    );
    rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
    quaternion.setFromEuler(rotation);
    scale.setScalar(size);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);

    color.set(index % 7 === 0 ? "#8a7b6a" : index % 5 === 0 ? "#5f5b55" : "#74685c");
    color.multiplyScalar(0.72 + random() * 0.42);
    mesh.setColorAt(index, color);
  }

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }

  group.add(mesh);

  return {
    group,
    update: (delta: number, timeScale: number) => {
      group.rotation.y += delta * timeScale * orbitalSpeed;
    },
  };
}
