import type { SolarBodyId } from "./solarSystem";

export interface SolarTextureConfig {
  texture?: string;
  cloudTexture?: string;
  ringTexture?: string;
  fallback: string;
  roughness: number;
  emissive?: string;
  emissiveIntensity?: number;
}

const textureBase = "/textures/solar-system";

export const solarSystemTextures: Record<SolarBodyId, SolarTextureConfig> = {
  sun: {
    texture: `${textureBase}/sun.jpg`,
    fallback: "#ff9b42",
    roughness: 0.62,
    emissive: "#ff8f3f",
    emissiveIntensity: 0.95,
  },
  mercury: {
    texture: `${textureBase}/mercury.jpg`,
    fallback: "#8a8178",
    roughness: 0.94,
  },
  venus: {
    texture: `${textureBase}/venus.jpg`,
    fallback: "#c8a365",
    roughness: 0.78,
  },
  earth: {
    texture: `${textureBase}/earth_day.jpg`,
    cloudTexture: `${textureBase}/earth_clouds.png`,
    fallback: "#426f9e",
    roughness: 0.68,
  },
  moon: {
    texture: `${textureBase}/moon.jpg`,
    fallback: "#a9a49a",
    roughness: 0.94,
    emissive: "#141820",
    emissiveIntensity: 0.035,
  },
  mars: {
    texture: `${textureBase}/mars.jpg`,
    fallback: "#a85a3c",
    roughness: 0.9,
  },
  jupiter: {
    texture: `${textureBase}/jupiter.jpg`,
    fallback: "#b89268",
    roughness: 0.82,
  },
  saturn: {
    texture: `${textureBase}/saturn.jpg`,
    ringTexture: `${textureBase}/saturn_ring.png`,
    fallback: "#c4ad78",
    roughness: 0.82,
  },
  uranus: {
    texture: `${textureBase}/uranus.jpg`,
    fallback: "#78b6bf",
    roughness: 0.78,
  },
  neptune: {
    texture: `${textureBase}/neptune.jpg`,
    fallback: "#315da7",
    roughness: 0.78,
  },
};
