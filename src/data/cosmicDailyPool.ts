export type CosmicDailyCategory =
  | "Nebula"
  | "Galaxy"
  | "Star Cluster"
  | "Supernova Remnant"
  | "Deep Field"
  | "Planet"
  | "Black Hole";

export interface CosmicDailyItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  source: string;
  link: string;
  category: CosmicDailyCategory;
}

export const cosmicDailyPool: CosmicDailyItem[] = [
  {
    id: "cosmic-cliffs",
    title: "宇宙悬崖",
    subtitle: "船底座星云边缘的恒星风暴",
    image: "/images/daily/cosmic-cliffs.jpg",
    description:
      "年轻恒星将尘埃与气体雕刻成巨大的金色峭壁，像深空里一场正在升起的潮汐。",
    source: "NASA / ESA / CSA / STScI",
    link: "https://images.nasa.gov/details/carina_nebula",
    category: "Nebula",
  },
  {
    id: "carina-nebula",
    title: "船底座星云",
    subtitle: "恒星诞生的深空风暴",
    image: "/images/daily/carina-nebula.jpg",
    description:
      "巨大的恒星形成区在尘埃与辐射中展开，明亮星风把黑暗云层撕开成层叠的光。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/PIA03515",
    category: "Nebula",
  },
  {
    id: "eagle-nebula-pillars",
    title: "鹰状星云创生之柱",
    subtitle: "尘埃柱中点燃新恒星",
    image: "/images/daily/eagle-nebula-pillars.jpg",
    description:
      "高耸的尘埃柱抵抗着年轻恒星的辐射，内部的星胚仍在缓慢聚合与发光。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/PIA03096",
    category: "Nebula",
  },
  {
    id: "tarantula-nebula",
    title: "蜘蛛星云",
    subtitle: "大麦哲伦云中的恒星工厂",
    image: "/images/daily/tarantula-nebula.jpg",
    description:
      "炽热星团照亮巨大的气体网络，让这片星云像一张在宇宙中铺开的发光蛛网。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/PIA14415",
    category: "Nebula",
  },
  {
    id: "horsehead-nebula",
    title: "马头星云",
    subtitle: "猎户座暗云的剪影",
    image: "/images/daily/horsehead-nebula.jpg",
    description:
      "冷暗尘埃在背后星光前投下庄严轮廓，像一座从红色星际雾气中浮现的暗色雕像。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/PIA16008",
    category: "Nebula",
  },
  {
    id: "lagoon-nebula",
    title: "礁湖星云",
    subtitle: "明亮气体中的恒星潮汐",
    image: "/images/daily/lagoon-nebula.jpg",
    description:
      "紫红色氢云与暗尘带交错，新生恒星在云海深处把整片星云点亮。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/GSFC_20171208_Archive_e001955",
    category: "Nebula",
  },
  {
    id: "orion-nebula",
    title: "猎户座星云",
    subtitle: "近邻恒星摇篮的炽亮核心",
    image: "/images/daily/orion-nebula.jpg",
    description:
      "尘埃、气体与年轻恒星在猎户座深处交汇，形成肉眼可见却仍充满秘密的恒星摇篮。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/PIA01322",
    category: "Nebula",
  },
  {
    id: "rosette-nebula",
    title: "玫瑰星云",
    subtitle: "独角兽座中的红外花冠",
    image: "/images/daily/rosette-nebula.jpg",
    description:
      "一圈巨大的星际云被中央星团照亮，像宇宙在寒冷黑暗中展开的火色花冠。",
    source: "NASA / JPL-Caltech / WISE",
    link: "https://images.nasa.gov/details/PIA13126",
    category: "Nebula",
  },
  {
    id: "veil-nebula",
    title: "面纱星云",
    subtitle: "超新星余波留下的光纤",
    image: "/images/daily/veil-nebula.jpg",
    description:
      "古老恒星爆发后的冲击波穿过星际介质，留下如丝线般弯曲延展的发光结构。",
    source: "NASA / JPL-Caltech",
    link: "https://images.nasa.gov/details/PIA15413",
    category: "Supernova Remnant",
  },
  {
    id: "helix-nebula",
    title: "螺旋星云",
    subtitle: "垂暮恒星释放的幽蓝眼眸",
    image: "/images/daily/helix-nebula.jpg",
    description:
      "一颗类太阳恒星抛出的外层气体在深空扩散，呈现出近乎凝视般的巨大环形结构。",
    source: "NASA / JPL-Caltech",
    link: "https://images.nasa.gov/details/PIA15658",
    category: "Nebula",
  },
  {
    id: "southern-ring-nebula",
    title: "南环星云",
    subtitle: "恒星谢幕时的层层回声",
    image: "/images/daily/southern-ring-nebula.jpg",
    description:
      "濒死恒星将外壳一层层推向宇宙，留下精致而幽暗的光环，像时间缓慢散开的涟漪。",
    source: "NASA / ESA / CSA / STScI",
    link: "https://images.nasa.gov/details/southern_ring_nebula",
    category: "Nebula",
  },
  {
    id: "butterfly-nebula",
    title: "双喷流星云",
    subtitle: "蝶翼般展开的恒星遗迹",
    image: "/images/daily/butterfly-nebula.jpg",
    description:
      "高速气体从中央恒星向两侧喷涌，形成对称而锋利的光翼，安静却充满力量。",
    source: "ESA / Hubble / NASA",
    link: "https://esahubble.org/images/heic1518a/",
    category: "Nebula",
  },
  {
    id: "andromeda-galaxy",
    title: "仙女座星系",
    subtitle: "近邻星系的横跨光海",
    image: "/images/daily/andromeda-galaxy.jpg",
    description:
      "数千亿颗恒星汇成倾斜的银色长河，提醒我们银河之外仍有辽阔而相似的岛宇宙。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000839",
    category: "Galaxy",
  },
  {
    id: "whirlpool-galaxy",
    title: "涡状星系",
    subtitle: "旋臂与伴星系的引力舞步",
    image: "/images/daily/whirlpool-galaxy.jpg",
    description:
      "明亮旋臂向外舒展，尘埃带与恒星形成区共同勾勒出星系相互牵引的宏大轨迹。",
    source: "NASA / JPL-Caltech",
    link: "https://images.nasa.gov/details/PIA10200",
    category: "Galaxy",
  },
  {
    id: "sombrero-galaxy",
    title: "草帽星系",
    subtitle: "黑暗尘埃环切过星光穹顶",
    image: "/images/daily/sombrero-galaxy.jpg",
    description:
      "明亮核心与宽阔尘埃环形成强烈对比，像深空中一座悬浮而沉默的发光圣殿。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/PIA15226",
    category: "Galaxy",
  },
  {
    id: "cartwheel-galaxy",
    title: "车轮星系",
    subtitle: "碰撞激起的星系涟漪",
    image: "/images/daily/cartwheel-galaxy.jpg",
    description:
      "一次古老碰撞在星系中推出环形波纹，蓝色新星沿着外圈不断点燃。",
    source: "NASA / JPL-Caltech",
    link: "https://images.nasa.gov/details/PIA03296",
    category: "Galaxy",
  },
  {
    id: "phantom-galaxy",
    title: "幽灵星系 M74",
    subtitle: "正面旋臂的冷光结构",
    image: "/images/daily/phantom-galaxy.jpg",
    description:
      "宽阔旋臂在红外光中显现出清晰骨架，像一个正在慢慢展开的星际漩涡。",
    source: "NASA / JPL-Caltech / WISE",
    link: "https://images.nasa.gov/details/PIA13376",
    category: "Galaxy",
  },
  {
    id: "antennae-galaxies",
    title: "触须星系",
    subtitle: "双星系碰撞中的恒星火花",
    image: "/images/daily/antennae-galaxies.jpg",
    description:
      "两个星系相互穿越，潮汐尾如触须般伸出，碰撞区域则迸发出密集的新生恒星。",
    source: "ESA / Hubble / NASA",
    link: "https://esahubble.org/images/heic0615a/",
    category: "Galaxy",
  },
  {
    id: "stephans-quintet",
    title: "斯蒂芬五重星系",
    subtitle: "星系群中的引力剧场",
    image: "/images/daily/stephans-quintet.jpg",
    description:
      "多个星系在彼此引力中靠近、扭曲与穿行，呈现宇宙结构演化的壮阔现场。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/PIA04201",
    category: "Galaxy",
  },
  {
    id: "m82-cigar-galaxy",
    title: "雪茄星系 M82",
    subtitle: "恒星爆发吹出的红色星风",
    image: "/images/daily/m82-cigar-galaxy.jpg",
    description:
      "剧烈恒星形成把红色气体从星系核心喷向两侧，像一场穿透星盘的深空风暴。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/PIA04218",
    category: "Galaxy",
  },
  {
    id: "crab-nebula",
    title: "蟹状星云",
    subtitle: "超新星爆发后的电光残响",
    image: "/images/daily/crab-nebula.jpg",
    description:
      "恒星死亡留下的丝状云气向外扩张，中央脉冲星仍在为这片遗迹注入高能光芒。",
    source: "NASA / ESA / Hubble",
    link: "https://images.nasa.gov/details/PIA03606",
    category: "Supernova Remnant",
  },
  {
    id: "cassiopeia-a",
    title: "仙后座 A",
    subtitle: "年轻超新星遗迹的炽烈碎片",
    image: "/images/daily/cassiopeia-a.jpg",
    description:
      "爆炸后的恒星碎片仍在高速扩张，不同波段的光共同描绘出一场死亡后的壮丽余烬。",
    source: "NASA / CXC / JPL-Caltech",
    link: "https://images.nasa.gov/details/PIA03519",
    category: "Supernova Remnant",
  },
  {
    id: "omega-centauri",
    title: "欧米伽半人马座",
    subtitle: "古老球状星团的密集星海",
    image: "/images/daily/omega-centauri.jpg",
    description:
      "数百万颗恒星紧密聚集成古老星团，越靠近核心，星光越像无数细小火焰叠加成海。",
    source: "NASA / JPL-Caltech",
    link: "https://images.nasa.gov/details/PIA13125",
    category: "Star Cluster",
  },
  {
    id: "westerlund-2",
    title: "韦斯特伦德 2",
    subtitle: "年轻星团点亮的烟火云",
    image: "/images/daily/westerlund-2.jpg",
    description:
      "炽热年轻恒星照亮周围尘埃，把恒星诞生区渲染成一片宏伟而明亮的宇宙烟火。",
    source: "ESA / Hubble / NASA",
    link: "https://esahubble.org/images/heic1509a/",
    category: "Star Cluster",
  },
  {
    id: "rho-ophiuchi-cloud",
    title: "蛇夫座 Rho 云",
    subtitle: "近邻恒星摇篮的彩色暗河",
    image: "/images/daily/rho-ophiuchi-cloud.jpg",
    description:
      "尘埃云在红外光中显露出青绿与火红的层次，新生恒星从暗云深处把整片星际雾海照亮。",
    source: "NASA / JPL-Caltech / UCLA",
    link: "https://images.nasa.gov/details/PIA13974",
    category: "Nebula",
  },
  {
    id: "saturn-grand-portrait",
    title: "土星宏像",
    subtitle: "环影切过金色行星的寂静弧线",
    image: "/images/daily/saturn-grand-portrait.jpg",
    description:
      "卡西尼凝视下的土星被环系投下长影，柔亮球面与冰尘圆环共同组成深空里最优雅的几何。",
    source: "NASA / JPL / Space Science Institute",
    link: "https://images.nasa.gov/details/PIA06193",
    category: "Planet",
  },
  {
    id: "jupiter-marble",
    title: "木星大理石",
    subtitle: "风暴纹理卷成行星海洋",
    image: "/images/daily/jupiter-marble.jpg",
    description:
      "朱诺号视角里的木星云带像流动的矿物纹理，大红斑与层层风暴在巨大气态世界上缓慢旋转。",
    source: "NASA / JPL-Caltech / SwRI / MSSS",
    link: "https://images.nasa.gov/details/PIA22946",
    category: "Planet",
  },
  {
    id: "hercules-a-jets",
    title: "武仙座 A 喷流",
    subtitle: "超大质量黑洞吹出的紫色双翼",
    image: "/images/daily/hercules-a-jets.jpg",
    description:
      "星系核心的黑洞把高能喷流推出数百万光年，紫红色射电羽流像两片从星海中张开的巨大光翼。",
    source: "NASA / ESA / NRAO",
    link: "https://images.nasa.gov/details/GSFC_20171208_Archive_e001618",
    category: "Black Hole",
  },
  {
    id: "m87-black-hole-galaxy",
    title: "M87 星系核心",
    subtitle: "黑洞喷流穿过椭圆星光",
    image: "/images/daily/m87-black-hole-galaxy.jpg",
    description:
      "M87 中央的超大质量黑洞驱动明亮喷流穿透星系核心，远处星海把这场极端能量释放衬得格外安静。",
    source: "NASA / JPL-Caltech / IPAC",
    link: "https://images.nasa.gov/details/PIA23122",
    category: "Black Hole",
  },
  {
    id: "webb-deep-field",
    title: "韦布深场",
    subtitle: "引力透镜后的早期星系群像",
    image: "/images/daily/webb-deep-field.jpg",
    description:
      "成千上万的星系在一小片天空中浮现，弯曲的橙色光弧记录着引力透镜把远古宇宙放大的瞬间。",
    source: "NASA / ESA / CSA / STScI",
    link: "https://images.nasa.gov/details/webb_first_deep_field",
    category: "Deep Field",
  },
];

export function getDailyCosmicItem(date = new Date()) {
  const dayIndex = (getDayOfYear(date) - 1) % cosmicDailyPool.length;

  return cosmicDailyPool[dayIndex];
}

export function getDayOfYear(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const elapsed = today.getTime() - startOfYear.getTime();

  return Math.floor(elapsed / 86_400_000);
}
