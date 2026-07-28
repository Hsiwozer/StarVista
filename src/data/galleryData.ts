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
  {
    id: 27,
    targetId: "gallery-wolf-rayet-bubble",
    title: "Stellar Wind Cathedral",
    subtitle: "沃尔夫-拉叶星风泡",
    category: "Nebula",
    distance: "恒星演化想象档案",
    description:
      "大质量恒星的强烈星风吹出近乎完美的气体空腔，青绿色电离外壳与金色尘埃边缘围住中央炽星。",
    image: "/images/gallery/wolf-rayet-wind-bubble.png",
    tags: ["沃尔夫-拉叶星", "星风泡", "电离气体"],
  },
  {
    id: 28,
    targetId: "gallery-herbig-haro-jets",
    title: "Infant Star Arrows",
    subtitle: "赫比格-哈罗喷流",
    category: "Nebula",
    distance: "恒星形成想象档案",
    description:
      "新生恒星从尘埃深处射出成对喷流，蓝白激波撞入周围气体，留下明亮弓形结与绯红细丝。",
    image: "/images/gallery/herbig-haro-stellar-jets.png",
    tags: ["原恒星", "喷流", "激波"],
  },
  {
    id: 29,
    targetId: "gallery-bok-globule",
    title: "Bok Shadow",
    subtitle: "博克暗球",
    category: "Deep Sky Object",
    distance: "约 1,000 光年",
    description:
      "致密分子云遮住身后的星光，暗球边缘被氢气微光勾勒；它的内部可能正孕育下一批恒星。",
    image: "/images/gallery/bok-globule-silhouette.png",
    tags: ["博克暗球", "分子云", "恒星摇篮"],
  },
  {
    id: 30,
    targetId: "gallery-open-cluster",
    title: "Crystal Cluster",
    subtitle: "水晶疏散星团",
    category: "Deep Sky Object",
    distance: "约 450 光年",
    description:
      "年轻的蓝白恒星尚未从彼此的引力联系里完全散开，在稀薄反射云中排列成一簇澄澈光点。",
    image: "/images/gallery/open-cluster-reflection-nebula.png",
    tags: ["疏散星团", "年轻恒星", "反射星云"],
  },
  {
    id: 31,
    targetId: "gallery-blue-supergiant",
    title: "Sapphire Colossus",
    subtitle: "蓝超巨星",
    category: "Star",
    distance: "大质量恒星想象档案",
    description:
      "蓝超巨星以近乎白炽的温度照亮周围星云，湍动外层像一层细密辉光，预示其短暂而壮烈的生命。",
    image: "/images/gallery/blue-supergiant-nebula.png",
    tags: ["蓝超巨星", "恒星演化", "星云"],
  },
  {
    id: 32,
    targetId: "gallery-solar-prominence",
    title: "Solar Firefall",
    subtitle: "太阳火瀑",
    category: "Star",
    distance: "约 1.5 亿公里",
    description:
      "日珥沿太阳边缘升起成巨大弧门，炽热等离子体受磁场牵引，在黑暗背景前显出精微而狂放的纹理。",
    image: "/images/gallery/solar-prominence-firefall.png",
    tags: ["太阳", "日珥", "磁场"],
  },
  {
    id: 33,
    targetId: "gallery-binary-stars",
    title: "Twin Sun Waltz",
    subtitle: "双星圆舞",
    category: "Star",
    distance: "双星系统想象档案",
    description:
      "一颗金色恒星与一颗蓝白伴星彼此环绕，恒星风在两者之间拉出柔亮桥带，像一段持续数百万年的舞步。",
    image: "/images/gallery/binary-star-waltz.png",
    tags: ["双星", "恒星风", "引力束缚"],
  },
  {
    id: 34,
    targetId: "gallery-total-eclipse",
    title: "Crown of Totality",
    subtitle: "全食之冠",
    category: "Moon",
    distance: "约 38.4 万公里",
    description:
      "月面恰好遮住太阳光球，银白日冕从黑色圆盘周围舒展，地球大气边缘在下方留下纤细蓝线。",
    image: "/images/gallery/total-solar-eclipse-corona.png",
    tags: ["日全食", "日冕", "月球"],
  },
  {
    id: 35,
    targetId: "gallery-gas-giant-cyclone",
    title: "Ammonia Tempest",
    subtitle: "氨云风暴",
    category: "Planet",
    distance: "巨行星想象档案",
    description:
      "气态巨行星的云带卷入一枚跨越数万公里的涡旋，象牙色、琥珀色与锈红色大气在风暴眼旁层层回旋。",
    image: "/images/gallery/gas-giant-cyclone.png",
    tags: ["气态巨行星", "大气风暴", "云带"],
  },
  {
    id: 36,
    targetId: "gallery-cryovolcanic-moon",
    title: "Ice Plume Moon",
    subtitle: "冰羽卫星",
    category: "Moon",
    distance: "冰卫星想象档案",
    description:
      "冰壳裂隙喷出高耸水汽与冰晶羽流，远方环行星的微光穿过喷雾，让冻结世界显得出奇明亮。",
    image: "/images/gallery/cryovolcanic-ice-moon.png",
    tags: ["冰卫星", "冰火山", "羽流"],
  },
  {
    id: 37,
    targetId: "gallery-volcanic-moon",
    title: "Ember Moon",
    subtitle: "熔火卫星",
    category: "Moon",
    distance: "火山卫星想象档案",
    description:
      "黑色岩壳被熔岩裂隙切开，稀薄火山羽流越过明暗边界；背景中的巨行星让这片炽热地貌更显渺小。",
    image: "/images/gallery/volcanic-moon-gas-giant.png",
    tags: ["火山卫星", "熔岩", "巨行星"],
  },
  {
    id: 38,
    targetId: "gallery-brown-dwarf-aurora",
    title: "Amber Aurora Dwarf",
    subtitle: "琥珀极光褐矮星",
    category: "Star",
    distance: "亚恒星天体想象档案",
    description:
      "褐矮星的昏暗大气被磁层点亮，青绿与紫色极光在两极交织成弧，环抱着琥珀色云带。",
    image: "/images/gallery/brown-dwarf-aurora.png",
    tags: ["褐矮星", "极光", "磁层"],
  },
  {
    id: 39,
    targetId: "gallery-polar-ring-galaxy",
    title: "Polar Crown Galaxy",
    subtitle: "极环星系",
    category: "Galaxy",
    distance: "约 1 亿光年",
    description:
      "明亮星系核外侧悬着一圈近乎垂直的恒星与气体环，像一顶冷白色王冠，记录着一次久远的引力相遇。",
    image: "/images/gallery/polar-ring-galaxy.png",
    tags: ["极环星系", "星系演化", "恒星环"],
  },
  {
    id: 40,
    targetId: "gallery-barred-spiral",
    title: "Barred Spiral Majesty",
    subtitle: "棒旋星系",
    category: "Galaxy",
    distance: "约 5,000 万光年",
    description:
      "一条温暖的恒星棒贯穿星系核心，蓝色旋臂沿两端展开，粉红星形成区在尘埃缝隙间闪烁。",
    image: "/images/gallery/barred-spiral-galaxy.png",
    tags: ["棒旋星系", "旋臂", "恒星形成"],
  },
  {
    id: 41,
    targetId: "gallery-starburst-galaxy",
    title: "Starburst Furnace",
    subtitle: "星暴熔炉",
    category: "Galaxy",
    distance: "约 1,200 万光年",
    description:
      "密集新生恒星把星系核心烧成蓝白光源，炽热气体沿边缘喷出，带走一场剧烈恒星形成的余波。",
    image: "/images/gallery/starburst-galaxy-superwind.png",
    tags: ["星暴星系", "超星风", "新生恒星"],
  },
  {
    id: 42,
    targetId: "gallery-galaxy-cluster",
    title: "Cluster of Ages",
    subtitle: "岁月星系团",
    category: "Galaxy",
    distance: "约 40 亿光年",
    description:
      "中央椭圆星系以温暖光芒统领数十个成员星系，远处背景光被巨大引力轻轻拉成细小弧线。",
    image: "/images/gallery/galaxy-cluster-deep-field.png",
    tags: ["星系团", "椭圆星系", "引力透镜"],
  },
  {
    id: 43,
    targetId: "gallery-ring-galaxy",
    title: "Collision Wheel",
    subtitle: "碰撞之轮",
    category: "Galaxy",
    distance: "约 5 亿光年",
    description:
      "一次正面穿越把星系压成发光圆环，蓝白恒星与粉红气体沿环缘点亮，核心仍守着旧日的金色光。",
    image: "/images/gallery/collision-ring-galaxy.png",
    tags: ["环星系", "星系碰撞", "星形成环"],
  },
  {
    id: 44,
    targetId: "gallery-cosmic-web",
    title: "Cosmic Filament",
    subtitle: "宇宙丝网",
    category: "Deep Sky Object",
    distance: "可观测宇宙尺度",
    description:
      "星系团如发亮结点散布在辽阔暗宇宙中，蓝紫色丝状结构将它们连接，显出大尺度物质分布的隐秘骨架。",
    image: "/images/gallery/cosmic-web-filaments.png",
    tags: ["宇宙网", "星系团", "大尺度结构"],
  },
  {
    id: 45,
    targetId: "gallery-kilonova",
    title: "Golden Kilonova",
    subtitle: "金辉千新星",
    category: "Supernova Remnant",
    distance: "致密星并合想象档案",
    description:
      "两颗中子星在并合瞬间抛出富含重元素的物质，金色与紫色喷流沿极轴展开，短暂照亮遥远深空。",
    image: "/images/gallery/kilonova-neutron-star-merger.png",
    tags: ["中子星并合", "千新星", "重元素"],
  },
  {
    id: 46,
    targetId: "gallery-tidal-disruption",
    title: "Stellar Ribbon",
    subtitle: "黑洞潮汐光带",
    category: "Black Hole",
    distance: "活动星系核想象档案",
    description:
      "一颗恒星掠过黑洞时被潮汐力拉成长长的炽热光带，部分物质卷入吸积盘，释放出明亮高能辐射。",
    image: "/images/gallery/black-hole-tidal-disruption.png",
    tags: ["潮汐撕裂", "黑洞", "吸积流"],
  },
  {
    id: 47,
    targetId: "gallery-classical-nova",
    title: "Pearl Nova",
    subtitle: "珍珠新星",
    category: "Star",
    distance: "双星系统想象档案",
    description:
      "白矮星不断夺取伴星外层气体，积累到临界点后骤然点燃，在双星周围吹出一层明亮而轻盈的爆发壳。",
    image: "/images/gallery/classical-nova-binary.png",
    tags: ["白矮星", "新星", "双星"],
  },
  {
    id: 48,
    targetId: "gallery-pulsar-wind",
    title: "Pulsar Wind",
    subtitle: "脉冲星风云",
    category: "Supernova Remnant",
    distance: "约 6,500 光年",
    description:
      "高速自转的脉冲星把粒子风压成发光圆环与双向喷流，蓝紫色同步辐射在超新星遗迹深处持续扩散。",
    image: "/images/gallery/pulsar-wind-nebula.png",
    tags: ["脉冲星", "同步辐射", "超新星遗迹"],
  },
  {
    id: 49,
    targetId: "gallery-butterfly-nebula",
    title: "Butterfly Nebula",
    subtitle: "双极蝴蝶星云",
    category: "Deep Sky Object",
    distance: "约 3,800 光年",
    description:
      "垂死恒星从狭窄腰部向两侧推出炽热气体，青绿与琥珀色双极瓣翼在黑暗中展开，宛如宇宙蝴蝶。",
    image: "/images/gallery/butterfly-planetary-nebula.png",
    tags: ["行星状星云", "双极喷流", "恒星晚年"],
  },
  {
    id: 50,
    targetId: "gallery-cometary-knots",
    title: "Cometary Knot Field",
    subtitle: "彗状结原野",
    category: "Nebula",
    distance: "约 650 光年",
    description:
      "密集气体结在中央恒星辐射下显出深色头部与细长尾迹，漂浮于青绿色电离云气之间，仿佛一片微型彗星原野。",
    image: "/images/gallery/planetary-nebula-cometary-knots.png",
    tags: ["彗状结", "行星状星云", "电离气体"],
  },
  {
    id: 51,
    targetId: "gallery-red-supergiant-surface",
    title: "Crimson Granulation",
    subtitle: "红超巨星沸腾表面",
    category: "Star",
    distance: "红超巨星想象档案",
    description:
      "巨大的对流胞在红超巨星表面翻滚，炽热等离子体沿弧形边缘逃逸，持续将恒星物质送入周围空间。",
    image: "/images/gallery/red-supergiant-surface.png",
    tags: ["红超巨星", "对流胞", "质量流失"],
  },
  {
    id: 52,
    targetId: "gallery-carbon-star-arcs",
    title: "Carbon Star Echoes",
    subtitle: "碳星尘埃回声",
    category: "Star",
    distance: "恒星晚年想象档案",
    description:
      "富碳恒星被一圈圈不均匀尘埃弧包围，每层微光都记录着一次脉动与质量流失，将恒星晚年的节律留在深空。",
    image: "/images/gallery/carbon-star-dust-arcs.png",
    tags: ["碳星", "尘埃壳层", "恒星风"],
  },
  {
    id: 53,
    targetId: "gallery-exoplanet-transit",
    title: "Transit Silhouette",
    subtitle: "系外行星凌日",
    category: "Planet",
    distance: "系外行星观测意象",
    description:
      "一颗遥远行星从母恒星前方经过，黑色圆影遮去极小部分星光；这次短暂变暗，正是发现系外世界的重要线索。",
    image: "/images/gallery/exoplanet-transit.png",
    tags: ["系外行星", "凌日法", "恒星光变"],
  },
  {
    id: 54,
    targetId: "gallery-tidally-locked-world",
    title: "Terminator World",
    subtitle: "永昼永夜之界",
    category: "Planet",
    distance: "潮汐锁定行星想象档案",
    description:
      "面向红矮星的一侧化为熔岩海，背光半球凝结成冰封荒原，只有狭窄晨昏线维系着明暗与冷热的平衡。",
    image: "/images/gallery/tidally-locked-lava-world.png",
    tags: ["潮汐锁定", "熔岩世界", "红矮星"],
  },
  {
    id: 55,
    targetId: "gallery-ring-shadows",
    title: "Ring Shadow Passage",
    subtitle: "环影掠过云海",
    category: "Planet",
    distance: "巨行星想象档案",
    description:
      "辽阔行星环把多层阴影投向淡色云海，深浅条带随轨道缓慢移动，让巨行星的大气呈现罕见的几何光景。",
    image: "/images/gallery/gas-giant-ring-shadows.png",
    tags: ["行星环", "环影", "大气云带"],
  },
  {
    id: 56,
    targetId: "gallery-contact-asteroid",
    title: "Ancient Contact",
    subtitle: "双叶接触小行星",
    category: "Deep Sky Object",
    distance: "太阳系小天体想象档案",
    description:
      "两块原始天体以极低速度轻柔相接，形成布满撞击坑与巨石的双叶轮廓，保存着太阳系早期聚合的痕迹。",
    image: "/images/gallery/contact-binary-asteroid.png",
    tags: ["接触双小行星", "小行星", "太阳系小天体"],
  },
  {
    id: 57,
    targetId: "gallery-interstellar-visitor",
    title: "Interstellar Visitor",
    subtitle: "星际访客",
    category: "Deep Sky Object",
    distance: "星际小天体想象档案",
    description:
      "细长暗色天体从陌生恒星旁高速掠过，微弱逸气拖出近乎透明的尾迹，带着另一套行星系统的古老物质穿越深空。",
    image: "/images/gallery/interstellar-object-visitor.png",
    tags: ["星际天体", "小天体", "太阳系外来客"],
  },
  {
    id: 58,
    targetId: "gallery-dwarf-irregular",
    title: "Untamed Galaxy",
    subtitle: "矮不规则星系",
    category: "Galaxy",
    distance: "约 300 万光年",
    description:
      "没有规则旋臂约束的年轻星系散布着蓝色恒星与粉红星云，凌乱轮廓中仍在不断孕育新的恒星群。",
    image: "/images/gallery/dwarf-irregular-galaxy.png",
    tags: ["矮星系", "不规则星系", "恒星形成"],
  },
  {
    id: 59,
    targetId: "gallery-shell-galaxy",
    title: "Merger Shells",
    subtitle: "并合壳层星系",
    category: "Galaxy",
    distance: "约 1 亿光年",
    description:
      "巨大椭圆星系外侧浮现一层层微弱恒星壳，它们是较小星系被吞噬后留下的潮汐回声，缓慢扩散在星系晕中。",
    image: "/images/gallery/elliptical-shell-galaxy.png",
    tags: ["椭圆星系", "恒星壳层", "星系并合"],
  },
  {
    id: 60,
    targetId: "gallery-lenticular-galaxy",
    title: "Silent Lens",
    subtitle: "寂静透镜状星系",
    category: "Galaxy",
    distance: "约 5,000 万光年",
    description:
      "平滑恒星盘环绕着古老明亮的核球，细窄尘埃带横过中央；它介于旋涡与椭圆星系之间，少有新星诞生。",
    image: "/images/gallery/lenticular-galaxy.png",
    tags: ["透镜状星系", "尘埃环", "星系演化"],
  },
  {
    id: 61,
    targetId: "gallery-cluster-collision",
    title: "Cluster Shock",
    subtitle: "星系团碰撞前沿",
    category: "Galaxy",
    distance: "约 30 亿光年",
    description:
      "两个星系团迎面交汇，成员星系大多彼此穿过，炽热星系际气体却被压成蓝粉色冲击前沿，显出碰撞的巨大能量。",
    image: "/images/gallery/colliding-galaxy-clusters.png",
    tags: ["星系团碰撞", "冲击波", "星系际气体"],
  },
  {
    id: 62,
    targetId: "gallery-cosmic-dawn",
    title: "First Light Islands",
    subtitle: "宇宙黎明光岛",
    category: "Deep Sky Object",
    distance: "超过 130 亿光年",
    description:
      "首批恒星与星系在紫色原初雾气中点亮一个个电离气泡，明亮光岛不断扩张，逐步结束宇宙的黑暗时代。",
    image: "/images/gallery/cosmic-dawn-first-galaxies.png",
    tags: ["宇宙黎明", "首批星系", "再电离"],
  },
];

export const galleryItems = getDailyGalleryItems();
export const dailyHeroBackground = getDailyHeroBackground();
