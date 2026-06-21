import * as THREE from "three";
import type { SolarBody } from "../../data/solarSystem";
import { solarSystemTextures } from "../../data/solarSystemTextures";
import {
  createPlanetSelectionIndicator,
  type PlanetSelectionIndicator,
} from "./SelectionIndicator";

export interface PlanetMeshResult {
  group: THREE.Group;
  bodyMesh: THREE.Mesh;
  selectionIndicator: PlanetSelectionIndicator | null;
  sunGlowLayers: THREE.Sprite[];
  disposableTextures: THREE.Texture[];
}

interface MeshQuality {
  sphereSegments: number;
  ringSegments: number;
  textureAnisotropy: number;
}

const textureLoader = new THREE.TextureLoader();

type TextureMappedMaterial = THREE.Material & {
  map?: THREE.Texture | null;
  color?: THREE.Color;
};

interface EarthDayNightMaterial extends THREE.MeshStandardMaterial {
  userData: THREE.MeshStandardMaterial["userData"] & {
    nightMapUniform?: { value: THREE.Texture };
    sunDirection?: THREE.Vector3;
  };
}

function configureTexture(texture: THREE.Texture, anisotropy: number) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
}

function colorToRgb(color: string) {
  const threeColor = new THREE.Color(color);
  return {
    r: Math.round(threeColor.r * 255),
    g: Math.round(threeColor.g * 255),
    b: Math.round(threeColor.b * 255),
  };
}

function createFallbackSurfaceTexture(
  color: string,
  seed: number,
  anisotropy: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const base = colorToRgb(color);
  const image = context.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const index = (y * canvas.width + x) * 4;
      const wave =
        Math.sin(x * 0.047 + seed) * 0.18 +
        Math.sin(y * 0.059 + seed * 1.7) * 0.16 +
        Math.sin((x + y) * 0.021 + seed * 2.4) * 0.12;
      const latitude = Math.abs(y / canvas.height - 0.5) * 2;
      const shade = 0.78 + wave + (1 - latitude) * 0.08;

      image.data[index] = Math.max(0, Math.min(255, base.r * shade));
      image.data[index + 1] = Math.max(0, Math.min(255, base.g * shade));
      image.data[index + 2] = Math.max(0, Math.min(255, base.b * shade));
      image.data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  configureTexture(texture, anisotropy);

  return texture;
}

function createFallbackNightLightsTexture(anisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 4;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.fillStyle = "#00030a";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  configureTexture(texture, anisotropy);

  return texture;
}

function createCloudFallbackTexture(anisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const image = context.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const index = (y * canvas.width + x) * 4;
      const wave =
        Math.sin(x * 0.044 + y * 0.012) * 0.35 +
        Math.sin(x * 0.019 - y * 0.037) * 0.22 +
        Math.sin((x + y) * 0.017) * 0.18;
      const alpha = Math.max(0, Math.min(150, (wave - 0.02) * 180));

      image.data[index] = 245;
      image.data[index + 1] = 248;
      image.data[index + 2] = 255;
      image.data[index + 3] = alpha;
    }
  }

  context.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  configureTexture(texture, anisotropy);

  return texture;
}

function loadMapIntoMaterial(
  material: TextureMappedMaterial,
  path: string | undefined,
  label: string,
  disposableTextures: THREE.Texture[],
  anisotropy: number,
) {
  if (!path) {
    return;
  }

  const loadedTexture = textureLoader.load(
    path,
    (texture) => {
      configureTexture(texture, anisotropy);
      material.map = texture;
      material.color?.set("#ffffff");
      material.needsUpdate = true;
    },
    undefined,
    () => {
      console.warn(`[SolarSystem] Failed to load ${label} texture: ${path}`);
      material.needsUpdate = true;
    },
  );
  disposableTextures.push(loadedTexture);
}

function loadEarthNightTexture(
  material: EarthDayNightMaterial,
  path: string | undefined,
  disposableTextures: THREE.Texture[],
  anisotropy: number,
) {
  if (!path || !material.userData.nightMapUniform) {
    return;
  }

  const loadedTexture = textureLoader.load(
    path,
    (texture) => {
      configureTexture(texture, anisotropy);
      material.userData.nightMapUniform!.value = texture;
    },
    undefined,
    () => {
      console.warn(`[SolarSystem] Failed to load Earth night texture: ${path}`);
      material.needsUpdate = true;
    },
  );
  disposableTextures.push(loadedTexture);
}

function extendEarthDayNightShader(
  material: EarthDayNightMaterial,
  nightTexture: THREE.Texture,
) {
  const sunDirection = new THREE.Vector3(-1, 0, 0);
  const nightMapUniform = { value: nightTexture };

  material.userData.nightMapUniform = nightMapUniform;
  material.userData.sunDirection = sunDirection;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.earthNightMap = nightMapUniform;
    shader.uniforms.earthSunDirection = { value: sunDirection };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vEarthWorldNormal;`,
      )
      .replace(
        "#include <defaultnormal_vertex>",
        `#include <defaultnormal_vertex>
vEarthWorldNormal = normalize(inverseTransformDirection(transformedNormal, viewMatrix));`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform sampler2D earthNightMap;
uniform vec3 earthSunDirection;
varying vec3 vEarthWorldNormal;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>

vec3 earthNormal = normalize(vEarthWorldNormal);
float lightDot = dot(earthNormal, normalize(earthSunDirection));
float dayFactor = smoothstep(-0.08, 0.18, lightDot);
float nightFactor = 1.0 - dayFactor;
vec3 nightColor = texture2D(earthNightMap, vMapUv).rgb;
float cityMask = smoothstep(0.045, 0.36, max(max(nightColor.r, nightColor.g), nightColor.b));
vec3 darkSurface = diffuseColor.rgb * vec3(0.035, 0.052, 0.09) * nightFactor;
vec3 cityLights = nightColor * vec3(1.28, 1.12, 0.86) * cityMask * nightFactor * 1.24;
float atmosphereRim = pow(1.0 - saturate(abs(vNormal.z)), 2.35) * (0.028 + nightFactor * 0.052);
totalEmissiveRadiance += darkSurface + cityLights + vec3(0.16, 0.34, 0.62) * atmosphereRim;`,
      );

  };

  material.customProgramCacheKey = () => "earth-day-night-v1";
}

function createPlanetMaterial(
  body: SolarBody,
  quality: MeshQuality,
  disposableTextures: THREE.Texture[],
) {
  const textureConfig = solarSystemTextures[body.id];
  const fallbackTexture = createFallbackSurfaceTexture(
    textureConfig.fallback,
    body.initialAngle * 10 + body.visualRadius,
    quality.textureAnisotropy,
  );

  if (fallbackTexture) {
    disposableTextures.push(fallbackTexture);
  }

  if (body.id === "sun") {
    const material = new THREE.MeshBasicMaterial({
      color: fallbackTexture ? "#ffffff" : textureConfig.fallback,
      map: fallbackTexture ?? undefined,
    });
    loadMapIntoMaterial(
      material,
      textureConfig.texture,
      body.name,
      disposableTextures,
      quality.textureAnisotropy,
    );
    return material;
  }

  const materialOptions: THREE.MeshStandardMaterialParameters = {
    color: fallbackTexture ? "#ffffff" : textureConfig.fallback,
    map: fallbackTexture ?? undefined,
    roughness: body.id === "moon" ? textureConfig.roughness : Math.min(textureConfig.roughness, 0.82),
    metalness: 0,
  };

  if (textureConfig.emissive && textureConfig.emissiveIntensity) {
    materialOptions.emissive = new THREE.Color(textureConfig.emissive);
    materialOptions.emissiveIntensity = textureConfig.emissiveIntensity;
  }

  if (body.id === "moon" && fallbackTexture) {
    materialOptions.bumpMap = fallbackTexture;
    materialOptions.bumpScale = 0.035;
  }

  const material = new THREE.MeshStandardMaterial(materialOptions);

  if (body.id === "earth") {
    const earthMaterial = material as EarthDayNightMaterial;
    const fallbackNightTexture = createFallbackNightLightsTexture(quality.textureAnisotropy);

    if (fallbackNightTexture) {
      disposableTextures.push(fallbackNightTexture);
      extendEarthDayNightShader(earthMaterial, fallbackNightTexture);
      loadEarthNightTexture(
        earthMaterial,
        textureConfig.nightTexture,
        disposableTextures,
        quality.textureAnisotropy,
      );
    }
  }

  loadMapIntoMaterial(
    material,
    textureConfig.texture,
    body.name,
    disposableTextures,
    quality.textureAnisotropy,
  );

  return material;
}

function applyRadialRingUvs(
  geometry: THREE.RingGeometry,
  innerRadius: number,
  outerRadius: number,
) {
  const positions = geometry.attributes.position;
  const uvs = geometry.attributes.uv;
  const radiusSpan = outerRadius - innerRadius;

  for (let index = 0; index < positions.count; index += 1) {
    const radius = Math.hypot(positions.getX(index), positions.getY(index));
    const u = THREE.MathUtils.clamp((radius - innerRadius) / radiusSpan, 0, 1);
    uvs.setXY(index, u, 0.5);
  }

  uvs.needsUpdate = true;
}

function addSaturnRing(
  group: THREE.Group,
  body: SolarBody,
  quality: MeshQuality,
  disposableTextures: THREE.Texture[],
) {
  const innerRadius = body.visualRadius * 1.35;
  const outerRadius = body.visualRadius * 2.32;
  const geometry = new THREE.RingGeometry(
    innerRadius,
    outerRadius,
    quality.ringSegments,
  );
  applyRadialRingUvs(geometry, innerRadius, outerRadius);

  const material = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.86,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const ringTexturePath = solarSystemTextures.saturn.ringTexture;
  if (ringTexturePath) {
    const ringTexture = textureLoader.load(
      ringTexturePath,
      (texture) => {
        configureTexture(texture, quality.textureAnisotropy);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        material.map = texture;
        material.alphaMap = texture;
        material.needsUpdate = true;
      },
      undefined,
      () => {
        console.warn(`[SolarSystem] Failed to load Saturn ring texture: ${ringTexturePath}`);
        material.needsUpdate = true;
      },
    );
    disposableTextures.push(ringTexture);
  }

  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI * 0.56;
  ring.rotation.z = Math.PI * 0.08;
  ring.renderOrder = 2;
  ring.name = "Saturn-ring";
  group.add(ring);
}

function addSunGlow(
  group: THREE.Group,
  body: SolarBody,
  disposableTextures: THREE.Texture[],
) {
  const createCoronaTexture = (coreAlpha: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, `rgba(255, 246, 204, ${coreAlpha})`);
    gradient.addColorStop(0.28, "rgba(255, 190, 92, 0.34)");
    gradient.addColorStop(0.56, "rgba(255, 130, 54, 0.12)");
    gradient.addColorStop(0.78, "rgba(127, 199, 255, 0.035)");
    gradient.addColorStop(1, "rgba(127, 199, 255, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    return texture;
  };

  const glowLayers = [
    { scale: 3.24, opacity: 0.82, coreAlpha: 0.78 },
    { scale: 6.35, opacity: 0.38, coreAlpha: 0.4 },
  ];

  return glowLayers.flatMap((layer, index) => {
    const texture = createCoronaTexture(layer.coreAlpha);
    if (!texture) {
      return [];
    }
    disposableTextures.push(texture);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        color: "#fff2c4",
        transparent: true,
        opacity: layer.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      }),
    );
    const diameter = body.visualRadius * layer.scale;
    glow.name = `Sun-corona-${index}`;
    glow.scale.set(diameter, diameter, 1);
    glow.userData.baseOpacity = layer.opacity;
    glow.userData.baseDiameter = diameter;
    glow.userData.coronaTexture = texture;
    glow.renderOrder = -1;
    group.add(glow);
    return glow;
  });
}

function addEarthClouds(
  group: THREE.Group,
  body: SolarBody,
  quality: MeshQuality,
  disposableTextures: THREE.Texture[],
) {
  const fallbackTexture = createCloudFallbackTexture(quality.textureAnisotropy);
  if (fallbackTexture) {
    disposableTextures.push(fallbackTexture);
  }

  const material = new THREE.MeshPhongMaterial({
    map: fallbackTexture ?? undefined,
    color: "#ffffff",
    transparent: true,
    opacity: 0.44,
    depthWrite: false,
  });

  const cloudTexturePath = solarSystemTextures.earth.cloudTexture;
  if (cloudTexturePath) {
    const cloudTexture = textureLoader.load(
      cloudTexturePath,
      (texture) => {
        configureTexture(texture, quality.textureAnisotropy);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      () => {
        console.warn(`[SolarSystem] Failed to load Earth cloud texture: ${cloudTexturePath}`);
        material.needsUpdate = true;
      },
    );
    disposableTextures.push(cloudTexture);
  }

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(
      body.visualRadius * 1.028,
      quality.sphereSegments,
      Math.max(24, quality.sphereSegments / 2),
    ),
    material,
  );
  clouds.name = "Earth-clouds";
  clouds.renderOrder = 1;
  group.add(clouds);
}

function addMoonClickTarget(group: THREE.Group, body: SolarBody, quality: MeshQuality) {
  const clickTarget = new THREE.Mesh(
    new THREE.SphereGeometry(
      body.visualRadius * 1.92,
      Math.max(24, quality.sphereSegments / 2),
      Math.max(16, quality.sphereSegments / 3),
    ),
    new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  clickTarget.name = "Moon-click-target";
  group.add(clickTarget);
}

export function createPlanetMesh(
  body: SolarBody,
  quality: MeshQuality = {
    sphereSegments: 64,
    ringSegments: 128,
    textureAnisotropy: 8,
  },
): PlanetMeshResult {
  const group = new THREE.Group();
  group.name = `${body.name}-group`;

  const disposableTextures: THREE.Texture[] = [];
  const bodyMaterial = createPlanetMaterial(body, quality, disposableTextures);

  const bodyMesh = new THREE.Mesh(
    new THREE.SphereGeometry(
      body.visualRadius,
      quality.sphereSegments,
      quality.sphereSegments,
    ),
    bodyMaterial,
  );
  bodyMesh.name = `${body.name}-mesh`;
  group.add(bodyMesh);

  const sunGlowLayers =
    body.id === "sun" ? addSunGlow(group, body, disposableTextures) : [];

  if (body.id === "earth") {
    addEarthClouds(group, body, quality, disposableTextures);
  }

  if (body.id === "saturn") {
    addSaturnRing(group, body, quality, disposableTextures);
  }

  if (body.id === "moon") {
    addMoonClickTarget(group, body, quality);
  }

  if (body.id !== "sun") {
    group.rotation.z = THREE.MathUtils.degToRad(body.axialTilt);
  }

  group.traverse((object) => {
    if (object.name.startsWith("Sun-corona")) {
      return;
    }
    object.userData.bodyId = body.id;
  });

  const selectionIndicator = createPlanetSelectionIndicator(body, disposableTextures);
  if (selectionIndicator) {
    group.add(selectionIndicator.group);
  }

  return {
    group,
    bodyMesh,
    selectionIndicator,
    sunGlowLayers,
    disposableTextures,
  };
}
