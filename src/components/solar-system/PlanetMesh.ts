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
const MIN_INTERACTION_RADIUS = 0.45;
const SATURN_RING_RATIO = {
  innerRadius: 1.35,
  outerRadius: 2.35,
} as const;
const SOLAR_LIGHT_FACTOR_RANGE = {
  min: 0.34,
  max: 1.42,
} as const;

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

interface MoonPhaseMaterial extends THREE.MeshStandardMaterial {
  userData: THREE.MeshStandardMaterial["userData"] & {
    moonSunDirection?: THREE.Vector3;
  };
}

function getDistanceLightWeight(solarLightFactor: number) {
  return THREE.MathUtils.clamp(
    (solarLightFactor - SOLAR_LIGHT_FACTOR_RANGE.min) /
      (SOLAR_LIGHT_FACTOR_RANGE.max - SOLAR_LIGHT_FACTOR_RANGE.min),
    0,
    1,
  );
}

function getOverallBrightnessLift(solarLightFactor: number) {
  return THREE.MathUtils.lerp(0.032, 0.078, getDistanceLightWeight(solarLightFactor));
}

function getSunlitBrightnessLift(solarLightFactor: number) {
  return THREE.MathUtils.lerp(0.035, 0.112, getDistanceLightWeight(solarLightFactor));
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
  mapTint: THREE.ColorRepresentation = "#ffffff",
) {
  if (!path) {
    return;
  }

  const loadedTexture = textureLoader.load(
    path,
    (texture) => {
      configureTexture(texture, anisotropy);
      material.map = texture;
      material.color?.set(mapTint);
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
  solarLightFactor: number,
) {
  const sunDirection = new THREE.Vector3(-1, 0, 0);
  const nightMapUniform = { value: nightTexture };
  const sunlitBrightnessLift = getSunlitBrightnessLift(solarLightFactor);

  material.userData.nightMapUniform = nightMapUniform;
  material.userData.sunDirection = sunDirection;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.earthNightMap = nightMapUniform;
    shader.uniforms.earthSunDirection = { value: sunDirection };
    shader.uniforms.earthSolarLightFactor = { value: solarLightFactor };
    shader.uniforms.earthSunlitBrightnessLift = { value: sunlitBrightnessLift };

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
uniform float earthSolarLightFactor;
uniform float earthSunlitBrightnessLift;
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
diffuseColor.rgb *= 1.0 + dayFactor * earthSunlitBrightnessLift;
vec3 darkSurface = diffuseColor.rgb * vec3(0.035, 0.052, 0.09) * nightFactor * mix(0.82, 1.0, earthSolarLightFactor);
vec3 cityLights = nightColor * vec3(1.28, 1.12, 0.86) * cityMask * nightFactor * 1.24;
float atmosphereRim = pow(1.0 - saturate(abs(vNormal.z)), 2.35) * (0.028 + nightFactor * 0.052);
totalEmissiveRadiance += darkSurface + cityLights + vec3(0.16, 0.34, 0.62) * atmosphereRim;`,
      );
  };

  material.customProgramCacheKey = () => "earth-day-night-v2";
}

function extendMoonPhaseShader(
  material: MoonPhaseMaterial,
  solarLightFactor: number,
) {
  const moonSunDirection = new THREE.Vector3(-1, 0, 0);
  const sunlitBrightnessLift = getSunlitBrightnessLift(solarLightFactor);

  material.userData.moonSunDirection = moonSunDirection;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.moonSunDirection = { value: moonSunDirection };
    shader.uniforms.moonSolarLightFactor = { value: solarLightFactor };
    shader.uniforms.moonSunlitBrightnessLift = { value: sunlitBrightnessLift };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vMoonWorldNormal;`,
      )
      .replace(
        "#include <defaultnormal_vertex>",
        `#include <defaultnormal_vertex>
vMoonWorldNormal = normalize(inverseTransformDirection(transformedNormal, viewMatrix));`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform vec3 moonSunDirection;
uniform float moonSolarLightFactor;
uniform float moonSunlitBrightnessLift;
varying vec3 vMoonWorldNormal;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>

vec3 moonNormal = normalize(vMoonWorldNormal);
float moonLightDot = dot(moonNormal, normalize(moonSunDirection));
float moonDayFactor = smoothstep(-0.08, 0.16, moonLightDot);
float moonNightFactor = 1.0 - moonDayFactor;
vec3 moonNightSurface = diffuseColor.rgb * vec3(0.12, 0.15, 0.22) * (0.48 + moonSolarLightFactor * 0.16);
float moonColdRim = pow(1.0 - saturate(abs(vNormal.z)), 2.2) * (0.028 + moonNightFactor * 0.058);
diffuseColor.rgb *= mix(vec3(0.34, 0.38, 0.48), vec3(1.0), moonDayFactor);
diffuseColor.rgb *= 1.0 + moonDayFactor * moonSunlitBrightnessLift;
totalEmissiveRadiance += moonNightSurface * moonNightFactor + vec3(0.16, 0.32, 0.56) * moonColdRim;`,
      );
  };

  material.customProgramCacheKey = () => "moon-phase-shadow-v2";
}

function extendPlanetSunlitShader(
  material: THREE.MeshStandardMaterial,
  solarLightFactor: number,
) {
  const sunlitBrightnessLift = getSunlitBrightnessLift(solarLightFactor);

  material.onBeforeCompile = (shader) => {
    shader.uniforms.planetSunlitBrightnessLift = { value: sunlitBrightnessLift };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vPlanetWorldNormal;
varying vec3 vPlanetWorldPosition;`,
      )
      .replace(
        "#include <defaultnormal_vertex>",
        `#include <defaultnormal_vertex>
vPlanetWorldNormal = normalize(inverseTransformDirection(transformedNormal, viewMatrix));`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vec4 planetWorldPosition = modelMatrix * vec4(transformed, 1.0);
vPlanetWorldPosition = planetWorldPosition.xyz;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float planetSunlitBrightnessLift;
varying vec3 vPlanetWorldNormal;
varying vec3 vPlanetWorldPosition;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>

vec3 planetNormal = normalize(vPlanetWorldNormal);
vec3 planetSunDirection = normalize(-vPlanetWorldPosition);
float planetDayFactor = smoothstep(-0.1, 0.22, dot(planetNormal, planetSunDirection));
totalEmissiveRadiance += diffuseColor.rgb * planetSunlitBrightnessLift * planetDayFactor;`,
      );
  };

  material.customProgramCacheKey = () => `planet-sunlit-lift-${solarLightFactor.toFixed(3)}`;
}

function getVisibleLightTint(body: SolarBody) {
  if (body.id === "sun") {
    return new THREE.Color("#ffffff");
  }

  const tint =
    body.solarLightFactor >= 1
      ? body.solarLightFactor
      : 0.45 + body.solarLightFactor * 0.55;

  const liftedTint = tint * (1 + getOverallBrightnessLift(body.solarLightFactor));

  return new THREE.Color(liftedTint, liftedTint, liftedTint);
}

function getTintedFallbackColor(body: SolarBody, color: string) {
  if (body.id === "sun") {
    return new THREE.Color(color);
  }

  return new THREE.Color(color).multiply(getVisibleLightTint(body));
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

  const lightTint = getVisibleLightTint(body);

  const materialOptions: THREE.MeshStandardMaterialParameters = {
    color: fallbackTexture
      ? lightTint
      : getTintedFallbackColor(body, textureConfig.fallback),
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
      extendEarthDayNightShader(earthMaterial, fallbackNightTexture, body.solarLightFactor);
      loadEarthNightTexture(
        earthMaterial,
        textureConfig.nightTexture,
        disposableTextures,
        quality.textureAnisotropy,
      );
    }
  }

  if (body.id === "moon") {
    extendMoonPhaseShader(material as MoonPhaseMaterial, body.solarLightFactor);
  } else if (body.id !== "earth") {
    extendPlanetSunlitShader(material, body.solarLightFactor);
  }

  loadMapIntoMaterial(
    material,
    textureConfig.texture,
    body.name,
    disposableTextures,
    quality.textureAnisotropy,
    lightTint,
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
    const x = positions.getX(index);
    const y = positions.getY(index);
    const radius = Math.hypot(x, y);
    const angle = Math.atan2(y, x);
    const u = THREE.MathUtils.clamp((radius - innerRadius) / radiusSpan, 0, 1);
    const v = THREE.MathUtils.euclideanModulo(angle / (Math.PI * 2), 1);
    uvs.setXY(index, u, v);
  }

  uvs.needsUpdate = true;
}

function extendSaturnRingShader(
  material: THREE.MeshBasicMaterial,
  solarLightFactor: number,
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.saturnRingBaseOpacity = { value: 0.9 };
    shader.uniforms.saturnRingDistanceLight = { value: solarLightFactor };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec2 vSaturnRingUv;
varying vec3 vSaturnRingWorldPosition;
varying vec3 vSaturnRingCenter;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vSaturnRingUv = uv;
vSaturnRingWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
vSaturnRingCenter = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float saturnRingBaseOpacity;
uniform float saturnRingDistanceLight;
varying vec2 vSaturnRingUv;
varying vec3 vSaturnRingWorldPosition;
varying vec3 vSaturnRingCenter;

float saturnRingGrain(vec2 uv) {
  float dust =
    sin(uv.x * 1193.0 + sin(uv.y * 31.0) * 1.9) *
    sin(uv.x * 2087.0 + cos(uv.y * 47.0) * 1.4);
  return dust * 0.5 + 0.5;
}`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>

float saturnRingRadius = clamp(vSaturnRingUv.x, 0.0, 1.0);
float saturnRingEdgeFade =
  smoothstep(0.022, 0.105, saturnRingRadius) *
  (1.0 - smoothstep(0.89, 1.0, saturnRingRadius));
float saturnInnerHaze = 1.0 - smoothstep(0.08, 0.25, saturnRingRadius);
float saturnOuterHaze = smoothstep(0.8, 1.0, saturnRingRadius);
float saturnMainBRing = smoothstep(0.25, 0.42, saturnRingRadius) * (1.0 - smoothstep(0.58, 0.69, saturnRingRadius));
float saturnARing = smoothstep(0.66, 0.72, saturnRingRadius) * (1.0 - smoothstep(0.84, 0.95, saturnRingRadius));
float saturnCassiniCore = exp(-pow((saturnRingRadius - 0.635) / 0.017, 2.0));
float saturnCassiniDust = exp(-pow((saturnRingRadius - 0.635) / 0.042, 2.0));

vec3 saturnRingVector = normalize(vSaturnRingWorldPosition - vSaturnRingCenter);
vec3 saturnSunDirection = normalize(-vSaturnRingCenter);
vec3 saturnShadowAxis = -saturnSunDirection;
float saturnShadowCore = smoothstep(0.865, 0.99, dot(saturnRingVector, saturnShadowAxis));
float saturnShadowRadial =
  smoothstep(0.1, 0.25, saturnRingRadius) *
  (1.0 - smoothstep(0.82, 0.98, saturnRingRadius));
float saturnPlanetShadow = saturnShadowCore * saturnShadowRadial;

vec3 saturnCameraDirection = normalize(cameraPosition - vSaturnRingCenter);
float saturnNearSide = smoothstep(-0.18, 0.78, dot(saturnRingVector, saturnCameraDirection));
float saturnGrain = saturnRingGrain(vSaturnRingUv);
float saturnAngularDust = sin(vSaturnRingUv.y * 19.0 + sin(saturnRingRadius * 27.0) * 1.6) * 0.5 + 0.5;
float saturnOuterBreakup = smoothstep(0.84, 1.0, saturnRingRadius) * (saturnAngularDust * 0.65 + saturnGrain * 0.35);
float saturnFarMainLift = (1.0 - saturnNearSide) * saturnMainBRing;
float saturnForegroundDust = saturnNearSide * (saturnMainBRing * 0.7 + saturnARing * 0.3) * (saturnGrain - 0.5);
float saturnParticleLift = (saturnGrain - 0.5) * 0.034 + (saturnAngularDust - 0.5) * 0.018 + saturnForegroundDust * 0.036;

float saturnLuma = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
diffuseColor.rgb = mix(vec3(saturnLuma), diffuseColor.rgb, 0.54);
diffuseColor.rgb *= mix(vec3(0.62, 0.64, 0.68), vec3(1.05, 0.98, 0.84), saturnMainBRing * 0.68);
diffuseColor.rgb *= mix(vec3(1.0), vec3(0.82, 0.86, 0.92), saturnARing * 0.32);
diffuseColor.rgb *= mix(vec3(0.68, 0.66, 0.62), vec3(1.04, 1.02, 0.96), saturnNearSide * 0.34);
diffuseColor.rgb *= 1.0 + saturnFarMainLift * 0.065;
diffuseColor.rgb *= 1.0 - saturnCassiniCore * 0.41;
diffuseColor.rgb += vec3(0.016, 0.015, 0.014) * saturnCassiniDust;
diffuseColor.rgb *= 0.88 + saturnParticleLift;
diffuseColor.rgb *= 1.0 - saturnInnerHaze * 0.22;
diffuseColor.rgb *= 1.0 - saturnOuterHaze * 0.11;
diffuseColor.rgb *= 1.0 - saturnPlanetShadow * 0.7;
diffuseColor.rgb *= mix(0.58, 1.0, saturnRingDistanceLight);
diffuseColor.a *= saturnRingBaseOpacity * saturnRingEdgeFade;
diffuseColor.a *= 1.0 - saturnInnerHaze * 0.2;
diffuseColor.a *= 1.0 - saturnOuterHaze * (0.24 + (1.0 - saturnOuterBreakup) * 0.12);
diffuseColor.a *= 1.0 - saturnCassiniCore * 0.36;
diffuseColor.a += saturnCassiniDust * saturnRingEdgeFade * 0.01;
diffuseColor.a *= 1.0 + saturnFarMainLift * 0.055;
diffuseColor.a *= mix(0.8, 1.07, saturnNearSide);
diffuseColor.a *= 1.0 - saturnPlanetShadow * 0.72;
diffuseColor.a *= 0.985 + saturnParticleLift;`,
      );
  };

  material.customProgramCacheKey = () => "saturn-ring-texture-depth-v2";
}

function addSaturnRing(
  group: THREE.Group,
  body: SolarBody,
  quality: MeshQuality,
  disposableTextures: THREE.Texture[],
) {
  const innerRadius = body.visualRadius * SATURN_RING_RATIO.innerRadius;
  const outerRadius = body.visualRadius * SATURN_RING_RATIO.outerRadius;
  const thetaSegments = Math.max(256, quality.ringSegments);
  const radialSegments = Math.max(18, Math.round(thetaSegments / 12));
  const geometry = new THREE.RingGeometry(
    innerRadius,
    outerRadius,
    thetaSegments,
    radialSegments,
  );
  applyRadialRingUvs(geometry, innerRadius, outerRadius);

  const material = new THREE.MeshBasicMaterial({
    color: "#d8cfbb",
    transparent: true,
    opacity: 0.69,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: true,
    alphaTest: 0.04,
  });
  material.forceSinglePass = true;
  extendSaturnRingShader(material, body.solarLightFactor);

  const ringTexturePath = solarSystemTextures.saturn.ringTexture;
  if (ringTexturePath) {
    const ringTexture = textureLoader.load(
      ringTexturePath,
      (texture) => {
        configureTexture(texture, quality.textureAnisotropy);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        material.map = texture;
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

function addInteractionClickTarget(
  group: THREE.Group,
  body: SolarBody,
  quality: MeshQuality,
) {
  const interactionRadius = Math.max(body.visualRadius, MIN_INTERACTION_RADIUS);

  if (interactionRadius <= body.visualRadius * 1.08) {
    return;
  }

  const clickTarget = new THREE.Mesh(
    new THREE.SphereGeometry(
      interactionRadius,
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
  clickTarget.name = `${body.name}-interaction-target`;
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

  addInteractionClickTarget(group, body, quality);

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
