import type { GalleryItem } from "../types/content";

const DAILY_GALLERY_SIZE = 6;
const ONE_DAY = 24 * 60 * 60 * 1000;

function getLocalDaySeed(date: Date) {
  return Math.floor(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() /
      ONE_DAY,
  );
}

function nextSeed(seed: number) {
  return (seed * 1664525 + 1013904223) >>> 0;
}

export function getDailyGalleryItems(
  items: GalleryItem[] = galleryPool,
  date = new Date(),
) {
  const selection = [...items];
  let seed = getLocalDaySeed(date);

  for (let index = selection.length - 1; index > 0; index -= 1) {
    seed = nextSeed(seed);
    const swapIndex = seed % (index + 1);
    [selection[index], selection[swapIndex]] = [
      selection[swapIndex],
      selection[index],
    ];
  }

  return selection.slice(0, DAILY_GALLERY_SIZE);
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
];

export const galleryItems = getDailyGalleryItems();
