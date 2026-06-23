import * as THREE from "three";

export type MoonPhaseName =
  | "新月"
  | "娥眉月"
  | "上弦月"
  | "盈凸月"
  | "满月"
  | "亏凸月"
  | "下弦月"
  | "残月";

export interface MoonPhaseState {
  phaseAngle: number;
  phaseName: MoonPhaseName;
  illumination: number;
  phaseProgress: number;
  waxing: boolean;
  isWaxing: boolean;
  phaseDescription: string;
}

const moonPhaseDescriptions: Record<MoonPhaseName, string> = {
  新月: "月面几乎隐入阴影，只留下极微弱的轮廓光。",
  娥眉月: "一弯月牙正从暗面边缘浮现，光照正在缓慢增加。",
  上弦月: "明暗分界线切过月盘中央，半个月面被阳光照亮。",
  盈凸月: "月面正被阳光继续铺开，大部分区域已处于可见光照中。",
  满月: "朝向地球的一面几乎完全被太阳照亮，月盘呈现完整银白轮廓。",
  亏凸月: "明亮的月面开始退入阴影，光照比例正在缓慢减少。",
  下弦月: "月盘再次被明暗分界线一分为二，另一侧沉入夜色。",
  残月: "最后一缕月光停留在月缘，月面即将重新隐入新月。",
};

function clampUnit(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function normalizeRadians(angle: number) {
  return THREE.MathUtils.euclideanModulo(angle, Math.PI * 2);
}

function getProjectedSignedAngle(from: THREE.Vector3, to: THREE.Vector3) {
  const fromProjected = new THREE.Vector3(from.x, 0, from.z);
  const toProjected = new THREE.Vector3(to.x, 0, to.z);

  if (fromProjected.lengthSq() < 0.000001 || toProjected.lengthSq() < 0.000001) {
    return 0;
  }

  fromProjected.normalize();
  toProjected.normalize();

  const crossY = fromProjected.z * toProjected.x - fromProjected.x * toProjected.z;
  const dot = THREE.MathUtils.clamp(fromProjected.dot(toProjected), -1, 1);

  return Math.atan2(crossY, dot);
}

export function getMoonIllumination(phaseAngle: number) {
  const angleRadians = THREE.MathUtils.degToRad(phaseAngle);

  return clampUnit((1 + Math.cos(angleRadians)) / 2);
}

export function getMoonPhaseName(
  phaseAngle: number,
  waxing = true,
): MoonPhaseName {
  const illumination = getMoonIllumination(phaseAngle);

  if (illumination < 0.04) {
    return "新月";
  }

  if (illumination > 0.96) {
    return "满月";
  }

  if (Math.abs(illumination - 0.5) < 0.08) {
    return waxing ? "上弦月" : "下弦月";
  }

  if (waxing) {
    return illumination < 0.5 ? "娥眉月" : "盈凸月";
  }

  return illumination > 0.5 ? "亏凸月" : "残月";
}

export function calculateMoonPhase(
  sunPosition: THREE.Vector3,
  earthPosition: THREE.Vector3,
  moonPosition: THREE.Vector3,
): MoonPhaseState {
  const moonToSun = sunPosition.clone().sub(moonPosition);
  const moonToEarth = earthPosition.clone().sub(moonPosition);

  if (moonToSun.lengthSq() < 0.000001 || moonToEarth.lengthSq() < 0.000001) {
    return {
      phaseAngle: 180,
      phaseName: "新月",
      illumination: 0,
      phaseProgress: 0,
      waxing: true,
      isWaxing: true,
      phaseDescription: moonPhaseDescriptions.新月,
    };
  }

  const phaseAngle = THREE.MathUtils.radToDeg(moonToSun.angleTo(moonToEarth));
  const earthToSun = sunPosition.clone().sub(earthPosition);
  const earthToMoon = moonPosition.clone().sub(earthPosition);
  const phaseProgress = normalizeRadians(
    getProjectedSignedAngle(earthToSun, earthToMoon),
  ) / (Math.PI * 2);
  const waxing = phaseProgress > 0 && phaseProgress <= 0.5;
  const illumination = getMoonIllumination(phaseAngle);
  const phaseName = getMoonPhaseName(phaseAngle, waxing);

  return {
    phaseAngle,
    phaseName,
    illumination,
    phaseProgress,
    waxing,
    isWaxing: waxing,
    phaseDescription: moonPhaseDescriptions[phaseName],
  };
}
