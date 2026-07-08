import type { GalleryItem } from "../types/content";

const DAILY_GALLERY_SIZE = 6;
const ONE_DAY = 24 * 60 * 60 * 1000;
const HERO_BACKGROUND_SEED_OFFSET = 0x9e3779b9;

function getLocalDaySeed(date: Date) {
  return Math.floor(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() /
      ONE_DAY,
  );
}

function nextSeed(seed: number) {
  return (seed * 1664525 + 1013904223) >>> 0;
}

function shuffleForDate(
  items: GalleryItem[],
  date: Date,
  seedOffset = 0,
) {
  const selection = [...items];
  let seed = (getLocalDaySeed(date) + seedOffset) >>> 0;

  for (let index = selection.length - 1; index > 0; index -= 1) {
    seed = nextSeed(seed);
    const swapIndex = seed % (index + 1);
    [selection[index], selection[swapIndex]] = [
      selection[swapIndex],
      selection[index],
    ];
  }

  return selection;
}

export function getDailyGalleryItems(
  items: GalleryItem[] = galleryPool,
  date = new Date(),
) {
  return shuffleForDate(items, date).slice(0, DAILY_GALLERY_SIZE);
}

export function getDailyHeroBackground(
  items: GalleryItem[] = galleryPool,
  date = new Date(),
) {
  const dailyGalleryIds = new Set(
    getDailyGalleryItems(items, date).map((item) => item.id),
  );
  const availableBackgrounds = items.filter(
    (item) => !dailyGalleryIds.has(item.id),
  );
  const dayParity = Math.abs(getLocalDaySeed(date)) % 2;
  const alternatingBackgrounds = items.filter(
    (item, poolIndex) =>
      !dailyGalleryIds.has(item.id) && poolIndex % 2 === dayParity,
  );
  const backgroundPool =
    alternatingBackgrounds.length > 0
      ? alternatingBackgrounds
      : availableBackgrounds;

  return (
    shuffleForDate(backgroundPool, date, HERO_BACKGROUND_SEED_OFFSET)[0] ??
    null
  );
}

export const galleryPool: GalleryItem[] = [
  {
    id: 1,
    targetId: "gallery-nebula",
    title: "Orion Nebula",
    subtitle: "猎户座大星云",
    category: "Nebula",
    distance: "约 1,344 光年",
    description:
      "夜空中最明亮的恒星形成区域之一，尘埃、氢气与新生恒星在粉紫色辉光中缓慢展开。",
    image: "/images/daily-cosmos.png",
    tags: ["恒星形成", "星云", "深空"],
  },
  {
    id: 2,
    targetId: "gallery-galaxy",
    title: "Andromeda Galaxy",
    subtitle: "仙女座星系",
    category: "Galaxy",
    distance: "约 254 万光年",
    description:
      "离银河系最近的大型旋涡星系，数千亿颗恒星组成了横跨深空的银蓝色旋臂。",
    image: "/images/spiral-galaxy.png",
    tags: ["旋涡星系", "岛宇宙", "银河邻居"],
  },
  {
    id: 3,
    targetId: "gallery-moon",
    title: "Lunar Terminator",
    subtitle: "月面晨昏线",
    category: "Moon",
    distance: "约 38.4 万公里",
    description:
      "斜射阳光切过环形山与月海，明暗交界像一条缓慢移动的银色地形线。",
    image: "/images/crescent-moon.png",
    tags: ["月球", "环形山", "近地天体"],
  },
  {
    id: 4,
    targetId: "gallery-planet",
    title: "Saturn Rings",
    subtitle: "土星环带",
    category: "Planet",
    distance: "约 12.7 亿公里",
    description:
      "冰粒与岩屑组成的环带在黑暗中形成纤细光弧，让气态巨行星显得安静而庄严。",
    image: "/images/ringed-planet.png",
    tags: ["行星", "环系", "太阳系"],
  },
  {
    id: 5,
    targetId: "gallery-black-hole",
    title: "M87 Black Hole",
    subtitle: "M87 星系中心黑洞",
    category: "Black Hole",
    distance: "约 5,500 万光年",
    description:
      "事件视界望远镜捕捉到的暗影与吸积辉光，像深空尽头一枚沉默的引力印章。",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg/1280px-Black_hole_-_Messier_87_crop_max_res.jpg",
    tags: ["事件视界", "相对论", "吸积盘"],
  },
  {
    id: 6,
    targetId: "gallery-pillars",
    title: "Pillars of Creation",
    subtitle: "创生之柱",
    category: "Deep Sky Object",
    distance: "约 6,500 光年",
    description:
      "鹰状星云中的尘埃柱孕育年轻恒星，光从气体褶皱间渗出，像宇宙保存下来的慢速雕塑。",
    image: "/images/emission-nebula.png",
    tags: ["深空天体", "尘埃柱", "恒星摇篮"],
  },
  {
    id: 7,
    targetId: "gallery-reflection-nebula",
    title: "Reflection Cradle",
    subtitle: "反射星云摇篮",
    category: "Nebula",
    distance: "约 1,500 光年",
    description:
      "蓝紫色尘埃反射着新生恒星的光，暗云与星团在同一片寂静中缓慢成形。",
    image: "/images/gallery/reflection-nebula-star-cluster.png",
    tags: ["反射星云", "新生恒星", "尘埃云"],
  },
  {
    id: 8,
    targetId: "gallery-relativistic-black-hole",
    title: "Relativistic Halo",
    subtitle: "相对论光环",
    category: "Black Hole",
    distance: "想象深空档案",
    description:
      "吸积盘被强引力弯折成炽亮光弧，黑暗核心像把周围星光轻轻拢入沉默。",
    image: "/images/gallery/relativistic-black-hole.png",
    tags: ["黑洞", "吸积盘", "引力透镜"],
  },
  {
    id: 9,
    targetId: "gallery-emission-ridge",
    title: "Crimson Ion Ridge",
    subtitle: "绯红电离云脊",
    category: "Nebula",
    distance: "约 7,000 光年",
    description:
      "恒星风把氢云推成高耸的绯红边界，青色氧辉在褶皱之间显出深空的层次。",
    image: "/images/gallery/emission-nebula-ridge.png",
    tags: ["发射星云", "恒星风", "电离气体"],
  },
  {
    id: 10,
    targetId: "gallery-icy-exoplanet",
    title: "Glacial Ringworld",
    subtitle: "冰蓝环世界",
    category: "Planet",
    distance: "系外行星想象档案",
    description:
      "冰巨星在蓝白恒星旁显出柔亮边缘，半透明环系穿过夜面，像一条静止的寒光河。",
    image: "/images/gallery/icy-ringed-exoplanet.png",
    tags: ["系外行星", "环系", "冰巨星"],
  },
  {
    id: 11,
    targetId: "gallery-grand-spiral",
    title: "Grand Spiral",
    subtitle: "宏旋星系",
    category: "Galaxy",
    distance: "约 3,000 万光年",
    description:
      "金色星核牵引蓝色旋臂展开，粉红恒星形成区沿尘埃带闪烁，像一座转动的岛宇宙。",
    image: "/images/gallery/grand-design-spiral-galaxy.png",
    tags: ["旋涡星系", "恒星形成区", "尘埃带"],
  },
  {
    id: 12,
    targetId: "gallery-planetary-eye",
    title: "Planetary Eye",
    subtitle: "行星状星云之眼",
    category: "Deep Sky Object",
    distance: "约 2,000 光年",
    description:
      "垂暮恒星抛出的外层气体层层扩散，蓝绿与紫色壳层围成近乎凝视般的深空之眼。",
    image: "/images/gallery/planetary-nebula-eye.png",
    tags: ["行星状星云", "白矮星", "恒星晚年"],
  },
  {
    id: 13,
    targetId: "gallery-supernova-filaments",
    title: "Supernova Lace",
    subtitle: "超新星光丝",
    category: "Supernova Remnant",
    distance: "约 6,000 光年",
    description:
      "爆炸冲击波把星际介质织成蓝白细丝，橙色重元素结点仍保留着恒星最后的回声。",
    image: "/images/gallery/supernova-remnant-filaments.png",
    tags: ["超新星遗迹", "冲击波", "重元素"],
  },
  {
    id: 14,
    targetId: "gallery-interacting-galaxies",
    title: "Tidal Encounter",
    subtitle: "潮汐相遇",
    category: "Galaxy",
    distance: "约 4,500 万光年",
    description:
      "两个星系被彼此引力拉出漫长潮汐尾，星桥与尘埃带在碰撞前夜缓慢重写形状。",
    image: "/images/gallery/interacting-galaxies.png",
    tags: ["星系并合", "潮汐尾", "星暴"],
  },
  {
    id: 15,
    targetId: "gallery-molecular-cloud",
    title: "Molecular Veil",
    subtitle: "分子云暗幕",
    category: "Deep Sky Object",
    distance: "约 500 光年",
    description:
      "冷暗尘埃遮住银河星场，红色发射斑点从边缘透出，提示新的恒星正在阴影里聚集。",
    image: "/images/gallery/dark-molecular-cloud.png",
    tags: ["分子云", "暗星云", "银河星场"],
  },
  {
    id: 16,
    targetId: "gallery-rose-cluster",
    title: "Rose Starfield",
    subtitle: "玫瑰星场",
    category: "Nebula",
    distance: "约 5,200 光年",
    description:
      "年轻星团点亮金色花瓣般的气体壳层，暗尘柱从辉光中升起，像深空里一朵缓慢开放的花。",
    image: "/images/gallery/rose-nebula-star-cluster.png",
    tags: ["星团", "发射星云", "尘埃柱"],
  },
  {
    id: 17,
    targetId: "gallery-quasar-jet",
    title: "Quasar Beacon",
    subtitle: "类星体灯塔",
    category: "Deep Sky Object",
    distance: "遥远宇宙想象档案",
    description:
      "炽亮吸积盘环绕着超大质量黑洞，成对相对论喷流穿透星系际空间，像从宇宙早期射来的灯塔。",
    image: "/images/gallery/quasar-relativistic-jet.png",
    tags: ["类星体", "相对论喷流", "活动星系核"],
  },
  {
    id: 18,
    targetId: "gallery-einstein-ring",
    title: "Einstein Ring",
    subtitle: "爱因斯坦环",
    category: "Galaxy",
    distance: "遥远宇宙观测意象",
    description:
      "前景星系的引力把更遥远天体的光弯成近乎完整的蓝白圆环，让不可见的时空曲率显出轮廓。",
    image: "/images/gallery/einstein-ring-lens.png",
    tags: ["引力透镜", "爱因斯坦环", "时空弯曲"],
  },
  {
    id: 19,
    targetId: "gallery-great-comet",
    title: "Silver Wanderer",
    subtitle: "银蓝长尾彗星",
    category: "Deep Sky Object",
    distance: "太阳系想象档案",
    description:
      "冰质彗核被恒星加热后释放尘埃与气体，银白尘尾和蓝色离子尾在行星近旁铺开漫长光迹。",
    image: "/images/gallery/great-comet-blue-planet.png",
    tags: ["彗星", "离子尾", "太阳风"],
  },
  {
    id: 20,
    targetId: "gallery-protoplanetary-disk",
    title: "Worlds in the Making",
    subtitle: "行星诞生之盘",
    category: "Deep Sky Object",
    distance: "恒星形成想象档案",
    description:
      "年轻恒星点亮层层尘埃环，盘面缝隙记录着物质聚合的路径，一批尚未成形的世界正在其中生长。",
    image: "/images/gallery/protoplanetary-disk.png",
    tags: ["原行星盘", "恒星形成", "行星诞生"],
  },
  {
    id: 21,
    targetId: "gallery-magnetar",
    title: "Magnetar Pulse",
    subtitle: "磁星脉动",
    category: "Supernova Remnant",
    distance: "银河系想象档案",
    description:
      "高度磁化的中子星藏在爆发遗迹中央，炽热等离子体沿磁场卷成巨大光弧，照亮周围的冲击波细丝。",
    image: "/images/gallery/magnetar-plasma-arcs.png",
    tags: ["磁星", "中子星", "强磁场"],
  },
  {
    id: 22,
    targetId: "gallery-globular-cluster",
    title: "Ancient Star Swarm",
    subtitle: "远古球状星团",
    category: "Deep Sky Object",
    distance: "约 2.5 万光年",
    description:
      "数十万颗古老恒星在引力中聚成致密光球，金色核心悬在银河尘埃带上方，保存着早期银河的记忆。",
    image: "/images/gallery/ancient-globular-cluster.png",
    tags: ["球状星团", "古老恒星", "银河晕"],
  },
  {
    id: 23,
    targetId: "gallery-cosmic-cliffs",
    title: "Cosmic Cliffs",
    subtitle: "宇宙峭壁",
    category: "Nebula",
    distance: "约 7,600 光年",
    description:
      "年轻恒星的紫外辐射雕刻分子云边缘，青蓝电离气体在尘埃山脊上升腾，露出恒星摇篮的明亮边界。",
    image: "/images/gallery/cosmic-cliffs-nursery.png",
    tags: ["恒星摇篮", "分子云", "电离前沿"],
  },
  {
    id: 24,
    targetId: "gallery-red-giant-system",
    title: "Red Giant Dominion",
    subtitle: "红巨星疆域",
    category: "Planet",
    distance: "恒星演化想象档案",
    description:
      "膨胀的红巨星以炽热光芒笼罩行星系统，大小不同的世界沿轨道退入暗处，见证恒星生命的暮年。",
    image: "/images/gallery/red-giant-planetary-system.png",
    tags: ["红巨星", "行星系统", "恒星演化"],
  },
  {
    id: 25,
    targetId: "gallery-edge-on-galaxy",
    title: "Galactic Horizon",
    subtitle: "侧视星河",
    category: "Galaxy",
    distance: "约 4,000 万光年",
    description:
      "旋涡星系以侧面对准视线，锐利尘埃带横贯温暖核球，微蓝恒星盘向黑暗两端延伸成一道漫长天际线。",
    image: "/images/gallery/edge-on-spiral-galaxy.png",
    tags: ["侧视星系", "尘埃带", "星系晕"],
  },
  {
    id: 26,
    targetId: "gallery-ocean-aurora",
    title: "Aurora Ocean",
    subtitle: "海洋行星极光",
    category: "Planet",
    distance: "系外行星想象档案",
    description:
      "恒星风抵达蓝色海洋世界，翡翠与紫罗兰色极光沿极区起伏，在稀薄大气边缘织出安静的发光帷幕。",
    image: "/images/gallery/ocean-planet-aurora.png",
    tags: ["系外行星", "极光", "磁层"],
  },
];

export const galleryItems = getDailyGalleryItems();
export const dailyHeroBackground = getDailyHeroBackground();
