import type { SolarBodyId, SolarFact } from "../../data/solarSystem";

export interface CelestialStatusInfo {
  subtitle: string;
  facts: SolarFact[];
  featureTitle: string;
  featureText: string;
  poeticNote: string;
  observationTip?: string;
}

export const celestialBodiesInfo: Record<SolarBodyId, CelestialStatusInfo> = {
  sun: {
    subtitle: "太阳系引力与光照核心",
    facts: [
      { label: "类型", value: "G 型主序星" },
      { label: "半径", value: "约 696,340 km" },
      { label: "表面温度", value: "约 5,500°C" },
      { label: "自转周期", value: "约 25-35 天" },
    ],
    featureTitle: "日冕与恒星风",
    featureText: "日冕光晕向外铺展，太阳风持续塑造行星际空间的粒子环境。",
    poeticNote: "所有轨道都在它的光里获得尺度。",
  },
  mercury: {
    subtitle: "内侧岩石行星 · 太阳系第一颗行星",
    facts: [
      { label: "平均距离", value: "0.39 AU" },
      { label: "公转周期", value: "87.97 天" },
      { label: "自转周期", value: "58.6 天" },
      { label: "温度跨度", value: "约 -180°C 至 430°C" },
    ],
    featureTitle: "极端昼夜温差",
    featureText: "水星几乎没有稳定大气，日侧被太阳炙烤，夜侧迅速坠入寒冷。",
    poeticNote: "它贴近恒星，却保留着漫长黑夜的冷。",
  },
  venus: {
    subtitle: "厚云行星 · 太阳系第二颗行星",
    facts: [
      { label: "平均距离", value: "0.72 AU" },
      { label: "公转周期", value: "224.7 天" },
      { label: "自转周期", value: "243 天 · 逆向" },
      { label: "表面温度", value: "约 465°C" },
    ],
    featureTitle: "逆向自转 / 厚重大气",
    featureText: "金星缓慢逆向自转，浓密二氧化碳大气让热量难以逃逸。",
    poeticNote: "明亮的晨昏星，藏着太阳系最沉重的温室。",
  },
  earth: {
    subtitle: "蓝色行星 · 太阳系第三颗行星",
    facts: [
      { label: "平均距离", value: "1 AU" },
      { label: "公转周期", value: "365.25 天" },
      { label: "自转周期", value: "23.9 小时" },
      { label: "天然卫星", value: "1 颗" },
    ],
    featureTitle: "昼夜城市灯光 / 地月系统",
    featureText: "月球正在地球引力范围内公转，它的盈亏来自太阳、地球与月球之间不断变化的夹角。",
    poeticNote: "这是目前已知唯一拥有稳定海洋、生命与文明灯火的行星。",
    observationTip: "夜侧城市灯光会沿昼夜分界线微微显现，适合观察地球自转。",
  },
  moon: {
    subtitle: "地球唯一的天然卫星",
    facts: [
      { label: "平均距地", value: "约 384,400 km" },
      { label: "公转周期", value: "27.3 天" },
      { label: "半径", value: "约 1,737 km" },
      { label: "自转状态", value: "近同步自转" },
    ],
    featureTitle: "当前月相 / 同步自转",
    featureText: "月球沿地球轨道缓慢前行，并以近乎同步的自转，将熟悉的一面朝向地球。",
    poeticNote: "它不是发光体，只是把远处的阳光安静地递回夜空。",
    observationTip: "明暗交界线附近的环形山阴影最清晰，那里最能显出月面地形。",
  },
  mars: {
    subtitle: "红色行星 · 太阳系第四颗行星",
    facts: [
      { label: "平均距离", value: "1.52 AU" },
      { label: "公转周期", value: "686.98 天" },
      { label: "自转周期", value: "24.6 小时" },
      { label: "天然卫星", value: "2 颗" },
    ],
    featureTitle: "极冠 / 远古水痕",
    featureText: "火星的红色地表、极冠与古老河道痕迹，共同记录着曾经更湿润的环境。",
    poeticNote: "荒凉的红尘里，仍保存着远古水流的笔迹。",
  },
  "asteroid-belt": {
    subtitle: "岩石与金属碎片区域",
    facts: [
      { label: "位置", value: "火星与木星轨道之间" },
      { label: "平均距离", value: "约 2.8 AU" },
      { label: "主要成分", value: "硅酸盐岩石、金属、尘埃" },
      { label: "代表天体", value: "谷神星、灶神星等" },
    ],
    featureTitle: "碎屑轨道带",
    featureText: "大量小天体在稀疏空间中各自运行，形成带有厚度的碎屑结构。",
    poeticNote: "这里像一段未能凝成行星的沉默历史。",
  },
  jupiter: {
    subtitle: "气态巨行星 · 太阳系第五颗行星",
    facts: [
      { label: "平均距离", value: "5.20 AU" },
      { label: "公转周期", value: "11.86 年" },
      { label: "自转周期", value: "9.9 小时" },
      { label: "天然卫星", value: "95+ 颗" },
    ],
    featureTitle: "大红斑 / 气态巨行星结构",
    featureText: "条带状云层围绕巨大气态外壳流动，大红斑是一场长期存在的巨型风暴。",
    poeticNote: "它以庞大的引力，替内侧行星拦下许多深空来客。",
  },
  saturn: {
    subtitle: "环系巨行星 · 太阳系第六颗行星",
    facts: [
      { label: "平均距离", value: "9.58 AU" },
      { label: "公转周期", value: "29.45 年" },
      { label: "自转周期", value: "10.7 小时" },
      { label: "天然卫星", value: "146+ 颗" },
    ],
    featureTitle: "环系结构 / 冰尘颗粒",
    featureText: "土星环由冰粒、岩屑与尘埃构成，近侧与远侧在光照中呈现不同层次。",
    poeticNote: "它把碎片排列成秩序，让寒冷也显得优雅。",
  },
  uranus: {
    subtitle: "冰巨星 · 太阳系第七颗行星",
    facts: [
      { label: "平均距离", value: "19.2 AU" },
      { label: "公转周期", value: "84.0 年" },
      { label: "自转周期", value: "17.2 小时 · 逆向" },
      { label: "轴倾角", value: "约 97.77°" },
    ],
    featureTitle: "横躺的自转轴",
    featureText: "天王星几乎侧躺着绕太阳运行，极端轴倾角让季节尺度异常漫长。",
    poeticNote: "它以不合常规的姿态，保持着冰蓝色的平静。",
  },
  neptune: {
    subtitle: "深蓝冰巨星 · 太阳系第八颗行星",
    facts: [
      { label: "平均距离", value: "30.1 AU" },
      { label: "公转周期", value: "164.8 年" },
      { label: "自转周期", value: "16.1 小时" },
      { label: "天然卫星", value: "14 颗" },
    ],
    featureTitle: "高速风暴 / 深蓝大气",
    featureText: "甲烷大气带来深蓝外观，强风与风暴在遥远低温环境中持续活动。",
    poeticNote: "太阳在这里变得遥远，蓝色却更加深。",
  },
};
