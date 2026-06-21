export type SolarBodyId =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "moon"
  | "mars"
  | "asteroid-belt"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export interface SolarFact {
  label: string;
  value: string;
}

export interface SolarBody {
  id: SolarBodyId;
  name: string;
  nameZh: string;
  radius: number;
  radiusKm: number;
  distanceAU: number;
  visualRadius: number;
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  orbitalPeriod: number;
  orbitalPeriodDays: number;
  orbitSpeed: number;
  solarLightFactor: number;
  color: string;
  type: string;
  rotationPeriod: string;
  rotationPeriodHours: number | null;
  axialTilt: number;
  description: string;
  facts: SolarFact[];
  initialAngle: number;
  parentId?: SolarBodyId;
  satelliteOrbitRadius?: number;
  satelliteOrbitHeight?: number;
}

const EARTH_RADIUS_KM = 6371;
const EARTH_ORBIT_VISUAL_RADIUS = 12.2;
const ORBIT_LOG_GROWTH = 2.25;
const ORBIT_LOG_SCALE =
  (EARTH_ORBIT_VISUAL_RADIUS - 2.4) / Math.log1p(ORBIT_LOG_GROWTH);

const orbitSpeed = (orbitalPeriod: number) =>
  orbitalPeriod > 0 ? (Math.PI * 2) / orbitalPeriod : 0;

export const getOrbitalAngularSpeed = orbitSpeed;

/*
 * Solar-system distances and planet sizes use a deliberate visual compression
 * model, not strict real scale. Distances are logarithmically compressed so the
 * outer planets remain reachable in the scene, while radii are mildly enlarged
 * and then manually tuned in this central table for readability.
 */
export function getCompressedOrbitRadius(distanceAU: number) {
  if (distanceAU <= 0) {
    return 0;
  }

  return 2.4 + ORBIT_LOG_SCALE * Math.log1p(distanceAU * ORBIT_LOG_GROWTH);
}

export function getCompressedPlanetRadius(radiusKm: number) {
  if (radiusKm <= 0) {
    return 0;
  }

  return 0.94 * Math.pow(radiusKm / EARTH_RADIUS_KM, 0.46);
}

export function getDistanceLightFactor(distanceAU: number) {
  if (distanceAU <= 0) {
    return 1;
  }

  return Math.min(1.42, Math.max(0.34, 1 / Math.pow(distanceAU, 0.42)));
}

export type RotatingSolarBodyId = Exclude<SolarBodyId, "asteroid-belt">;

export const CELESTIAL_ROTATION_PERIOD_HOURS: Record<RotatingSolarBodyId, number> = {
  sun: 609.12,
  mercury: 1407.6,
  venus: -5832.5,
  earth: 23.9,
  moon: 655.7,
  mars: 24.6,
  jupiter: 9.9,
  saturn: 10.7,
  uranus: -17.2,
  neptune: 16.1,
};

export const solarSystemBodies: SolarBody[] = [
  {
    id: "sun",
    name: "Sun",
    nameZh: "太阳",
    radius: 696340,
    radiusKm: 696340,
    distanceAU: 0,
    visualRadius: 3.6,
    semiMajorAxis: 0,
    eccentricity: 0,
    inclination: 0,
    orbitalPeriod: 0,
    orbitalPeriodDays: 0,
    orbitSpeed: 0,
    solarLightFactor: 1,
    color: "#ffb04a",
    type: "恒星",
    rotationPeriod: "约 25-35 天",
    rotationPeriodHours: CELESTIAL_ROTATION_PERIOD_HOURS.sun,
    axialTilt: 7.25,
    description:
      "太阳是太阳系的中心恒星，以强大的引力束缚着八大行星。它持续释放光与热，是地球生命赖以存在的能量源泉。",
    facts: [
      { label: "类型", value: "G 型主序星" },
      { label: "平均距日距离", value: "0 AU" },
      { label: "公转周期", value: "太阳系中心" },
      { label: "卫星数量", value: "0" },
      { label: "代表特征", value: "光与热、日冕、引力核心" },
    ],
    initialAngle: 0,
  },
  {
    id: "mercury",
    name: "Mercury",
    nameZh: "水星",
    radius: 2440,
    radiusKm: 2440,
    distanceAU: 0.387,
    visualRadius: getCompressedPlanetRadius(2440) * 0.86,
    semiMajorAxis: getCompressedOrbitRadius(0.387),
    eccentricity: 0.2056,
    inclination: 7,
    orbitalPeriod: 87.97,
    orbitalPeriodDays: 87.97,
    orbitSpeed: orbitSpeed(87.97),
    solarLightFactor: getDistanceLightFactor(0.387),
    color: "#9c8b7a",
    type: "类地行星",
    rotationPeriod: "58.6 天",
    rotationPeriodHours: CELESTIAL_ROTATION_PERIOD_HOURS.mercury,
    axialTilt: 0.03,
    description:
      "水星是距离太阳最近的行星。它体积小、表面布满陨石坑，在强烈日照与漫长黑夜之间经历极端温差。",
    facts: [
      { label: "类型", value: "类地行星" },
      { label: "平均距日距离", value: "0.39 AU" },
      { label: "公转周期", value: "87.97 天" },
      { label: "卫星数量", value: "0" },
      { label: "代表特征", value: "陨石坑、极端温差" },
    ],
    initialAngle: 0.55,
  },
  {
    id: "venus",
    name: "Venus",
    nameZh: "金星",
    radius: 6052,
    radiusKm: 6052,
    distanceAU: 0.723,
    visualRadius: getCompressedPlanetRadius(6052) * 0.94,
    semiMajorAxis: getCompressedOrbitRadius(0.723),
    eccentricity: 0.0068,
    inclination: 3.4,
    orbitalPeriod: 224.7,
    orbitalPeriodDays: 224.7,
    orbitSpeed: orbitSpeed(224.7),
    solarLightFactor: getDistanceLightFactor(0.723),
    color: "#d8b06a",
    type: "类地行星",
    rotationPeriod: "243 天",
    rotationPeriodHours: CELESTIAL_ROTATION_PERIOD_HOURS.venus,
    axialTilt: 177.4,
    description:
      "金星被厚重云层包裹，是太阳系中最炽热的行星之一。它明亮而神秘，常被称为地球的姐妹星。",
    facts: [
      { label: "类型", value: "类地行星" },
      { label: "平均距日距离", value: "0.72 AU" },
      { label: "公转周期", value: "224.7 天" },
      { label: "卫星数量", value: "0" },
      { label: "代表特征", value: "厚重大气、强温室效应" },
    ],
    initialAngle: 1.8,
  },
  {
    id: "earth",
    name: "Earth",
    nameZh: "地球",
    radius: 6371,
    radiusKm: 6371,
    distanceAU: 1,
    visualRadius: getCompressedPlanetRadius(6371),
    semiMajorAxis: getCompressedOrbitRadius(1),
    eccentricity: 0.0167,
    inclination: 0,
    orbitalPeriod: 365.25,
    orbitalPeriodDays: 365.25,
    orbitSpeed: orbitSpeed(365.25),
    solarLightFactor: getDistanceLightFactor(1),
    color: "#4a8fe8",
    type: "类地行星",
    rotationPeriod: "23.9 小时",
    rotationPeriodHours: CELESTIAL_ROTATION_PERIOD_HOURS.earth,
    axialTilt: 23.44,
    description:
      "地球是目前已知唯一孕育生命的行星。蓝色海洋、白色云层与稳定的大气层，让它成为深空中罕见的生命绿洲。",
    facts: [
      { label: "类型", value: "类地行星" },
      { label: "平均距日距离", value: "1 AU" },
      { label: "公转周期", value: "365.25 天" },
      { label: "卫星数量", value: "1" },
      { label: "代表特征", value: "海洋、生命、大气层" },
    ],
    initialAngle: 2.7,
  },
  {
    id: "moon",
    name: "Moon",
    nameZh: "月球",
    radius: 1737,
    radiusKm: 1737,
    distanceAU: 0,
    visualRadius: getCompressedPlanetRadius(1737) * 0.7,
    semiMajorAxis: 0,
    eccentricity: 0.0549,
    inclination: 5.15,
    orbitalPeriod: 27.3,
    orbitalPeriodDays: 27.3,
    orbitSpeed: orbitSpeed(27.3),
    solarLightFactor: getDistanceLightFactor(1),
    color: "#b8b5ad",
    type: "天然卫星",
    rotationPeriod: "27.3 天",
    rotationPeriodHours: CELESTIAL_ROTATION_PERIOD_HOURS.moon,
    axialTilt: 6.68,
    description:
      "月球是地球唯一的天然卫星，也是人类最熟悉的近邻天体。它布满环形山与月海，在漫长的岁月中记录着太阳系早期撞击的痕迹，并深刻影响着地球的潮汐与夜空景观。",
    facts: [
      { label: "类型", value: "天然卫星" },
      { label: "平均距地距离", value: "约 384,400 km" },
      { label: "公转周期", value: "27.3 天" },
      { label: "代表特征", value: "地球唯一的天然卫星、月海、环形山、潮汐影响" },
    ],
    initialAngle: 0.85,
    parentId: "earth",
    satelliteOrbitRadius: 2.32,
    satelliteOrbitHeight: 0.2,
  },
  {
    id: "mars",
    name: "Mars",
    nameZh: "火星",
    radius: 3390,
    radiusKm: 3390,
    distanceAU: 1.524,
    visualRadius: getCompressedPlanetRadius(3390) * 1.02,
    semiMajorAxis: getCompressedOrbitRadius(1.524),
    eccentricity: 0.0934,
    inclination: 1.85,
    orbitalPeriod: 686.98,
    orbitalPeriodDays: 686.98,
    orbitSpeed: orbitSpeed(686.98),
    solarLightFactor: getDistanceLightFactor(1.524),
    color: "#c55c3c",
    type: "类地行星",
    rotationPeriod: "24.6 小时",
    rotationPeriodHours: CELESTIAL_ROTATION_PERIOD_HOURS.mars,
    axialTilt: 25.19,
    description:
      "火星拥有红褐色的荒凉地表，是人类最向往探索的邻近行星之一。它的峡谷、沙尘与极冠记录着古老环境的痕迹。",
    facts: [
      { label: "类型", value: "类地行星" },
      { label: "平均距日距离", value: "1.52 AU" },
      { label: "公转周期", value: "686.98 天" },
      { label: "卫星数量", value: "2" },
      { label: "代表特征", value: "红色地表、峡谷、极冠" },
    ],
    initialAngle: 3.65,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    nameZh: "木星",
    radius: 69911,
    radiusKm: 69911,
    distanceAU: 5.203,
    visualRadius: getCompressedPlanetRadius(69911) * 0.735,
    semiMajorAxis: getCompressedOrbitRadius(5.203),
    eccentricity: 0.0489,
    inclination: 1.3,
    orbitalPeriod: 4332.59,
    orbitalPeriodDays: 4332.59,
    orbitSpeed: orbitSpeed(4332.59),
    solarLightFactor: getDistanceLightFactor(5.203),
    color: "#d6ad82",
    type: "气态巨行星",
    rotationPeriod: "9.9 小时",
    rotationPeriodHours: CELESTIAL_ROTATION_PERIOD_HOURS.jupiter,
    axialTilt: 3.13,
    description:
      "木星是太阳系中体积最大的行星，拥有壮观的云带和强大的磁场。它的大红斑是一场持续数百年的巨大风暴。",
    facts: [
      { label: "类型", value: "气态巨行星" },
      { label: "平均距日距离", value: "5.20 AU" },
      { label: "公转周期", value: "11.86 年" },
      { label: "卫星数量", value: "95+" },
      { label: "代表特征", value: "云带、大红斑、强磁场" },
    ],
    initialAngle: 4.4,
  },
  {
    id: "saturn",
    name: "Saturn",
    nameZh: "土星",
    radius: 58232,
    radiusKm: 58232,
    distanceAU: 9.537,
    visualRadius: getCompressedPlanetRadius(58232) * 0.654,
    semiMajorAxis: getCompressedOrbitRadius(9.537),
    eccentricity: 0.0565,
    inclination: 2.49,
    orbitalPeriod: 10759.22,
    orbitalPeriodDays: 10759.22,
    orbitSpeed: orbitSpeed(10759.22),
    solarLightFactor: getDistanceLightFactor(9.537),
    color: "#d9c08d",
    type: "气态巨行星",
    rotationPeriod: "10.7 小时",
    rotationPeriodHours: CELESTIAL_ROTATION_PERIOD_HOURS.saturn,
    axialTilt: 26.73,
    description:
      "土星以壮丽的环系统闻名。无数冰粒与岩石碎片在引力中排列成环，使它成为太阳系中最优雅的行星之一。",
    facts: [
      { label: "类型", value: "气态巨行星" },
      { label: "平均距日距离", value: "9.58 AU" },
      { label: "公转周期", value: "29.45 年" },
      { label: "卫星数量", value: "146+" },
      { label: "代表特征", value: "明亮环系统、低密度" },
    ],
    initialAngle: 5.3,
  },
  {
    id: "uranus",
    name: "Uranus",
    nameZh: "天王星",
    radius: 25362,
    radiusKm: 25362,
    distanceAU: 19.191,
    visualRadius: getCompressedPlanetRadius(25362) * 0.675,
    semiMajorAxis: getCompressedOrbitRadius(19.191),
    eccentricity: 0.0457,
    inclination: 0.77,
    orbitalPeriod: 30688.5,
    orbitalPeriodDays: 30688.5,
    orbitSpeed: orbitSpeed(30688.5),
    solarLightFactor: getDistanceLightFactor(19.191),
    color: "#7ed0d7",
    type: "冰巨星",
    rotationPeriod: "17.2 小时",
    rotationPeriodHours: CELESTIAL_ROTATION_PERIOD_HOURS.uranus,
    axialTilt: 97.77,
    description:
      "天王星是一颗寒冷的冰巨星，呈现淡青色光泽。它独特的自转轴几乎横躺在轨道面上，如同在深空中侧身前行。",
    facts: [
      { label: "类型", value: "冰巨星" },
      { label: "平均距日距离", value: "19.2 AU" },
      { label: "公转周期", value: "84.0 年" },
      { label: "卫星数量", value: "27" },
      { label: "代表特征", value: "横躺自转、淡青色大气" },
    ],
    initialAngle: 0.95,
  },
  {
    id: "neptune",
    name: "Neptune",
    nameZh: "海王星",
    radius: 24622,
    radiusKm: 24622,
    distanceAU: 30.07,
    visualRadius: getCompressedPlanetRadius(24622) * 0.66,
    semiMajorAxis: getCompressedOrbitRadius(30.07),
    eccentricity: 0.0113,
    inclination: 1.77,
    orbitalPeriod: 60182,
    orbitalPeriodDays: 60182,
    orbitSpeed: orbitSpeed(60182),
    solarLightFactor: getDistanceLightFactor(30.07),
    color: "#426dff",
    type: "冰巨星",
    rotationPeriod: "16.1 小时",
    rotationPeriodHours: CELESTIAL_ROTATION_PERIOD_HOURS.neptune,
    axialTilt: 28.32,
    description:
      "海王星位于太阳系遥远边缘，呈现深蓝色。它拥有强烈风暴和高速大气流动，是寒冷而神秘的远方行星。",
    facts: [
      { label: "类型", value: "冰巨星" },
      { label: "平均距日距离", value: "30.1 AU" },
      { label: "公转周期", value: "164.8 年" },
      { label: "卫星数量", value: "14" },
      { label: "代表特征", value: "深蓝色、强风暴、高速大气" },
    ],
    initialAngle: 2.15,
  },
];

export const asteroidBeltBody: SolarBody = {
  id: "asteroid-belt",
  name: "Asteroid Belt",
  nameZh: "小行星带",
  radius: 0,
  radiusKm: 0,
  distanceAU: 2.8,
  visualRadius: 0.62,
  semiMajorAxis: getCompressedOrbitRadius(2.8),
  eccentricity: 0.12,
  inclination: 0.9,
  orbitalPeriod: 1680,
  orbitalPeriodDays: 1680,
  orbitSpeed: orbitSpeed(1680),
  solarLightFactor: getDistanceLightFactor(2.8),
  color: "#8a8174",
  type: "岩石与金属碎片区域",
  rotationPeriod: "各不相同",
  rotationPeriodHours: null,
  axialTilt: 0,
  description:
    "小行星带位于火星轨道与木星轨道之间，由大量不规则小天体、碎石和极淡尘埃组成。这里的天体大小、形状与轨道倾角各不相同，其中包含谷神星、灶神星、智神星和健神星等代表性天体。",
  facts: [
    { label: "位置", value: "火星轨道与木星轨道之间" },
    { label: "类型", value: "岩石与金属碎片区域" },
    { label: "主要成分", value: "硅酸盐岩石、金属、尘埃" },
    { label: "代表天体", value: "谷神星、灶神星、智神星、健神星" },
    { label: "视觉特征", value: "稀疏碎屑带、轻微空间厚度" },
  ],
  initialAngle: 0,
};

export const defaultSolarBody = solarSystemBodies[0];
