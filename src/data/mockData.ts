import type { ArchiveRecord } from "../types/content";

export const archiveRecords: ArchiveRecord[] = [
  {
    archiveId: "ARCHIVE-001",
    targetId: "archive-orion-nebula",
    name: "猎户座大星云",
    englishName: "Orion Nebula",
    type: "发射星云",
    distance: "约 1,344 光年",
    region: "猎户座",
    tags: ["恒星形成", "氢云", "冬季夜空"],
    summary:
      "在猎户腰带下方，气体与尘埃被新生恒星悄悄点亮。那里像一页仍在显影的档案，记录恒星从黑暗中第一次呼吸。",
    detail:
      "猎户座大星云是距离地球较近的大型恒星形成区，肉眼在暗夜中也能看见它微弱的雾状光。紫红色辉光主要来自被年轻炽热恒星激发的氢气，尘埃深处仍有新的恒星和行星系统在缓慢成形。",
    image: "/images/daily-cosmos.png",
    accent: "nebula",
  },
  {
    archiveId: "ARCHIVE-002",
    targetId: "archive-andromeda-galaxy",
    name: "仙女座星系",
    englishName: "Andromeda Galaxy",
    type: "旋涡星系",
    distance: "约 254 万光年",
    region: "仙女座方向",
    tags: ["本星系群", "旋臂", "银河近邻"],
    summary:
      "它是肉眼可见的遥远岛宇宙，一片银蓝色旋臂横卧在深空。此刻抵达眼前的光，早在人类学会书写之前便已启程。",
    detail:
      "仙女座星系与银河系同属本星系群，是离我们最近的大型旋涡星系。它正在缓慢靠近银河系，数十亿年后两者会相互交织，形成一片新的巨大恒星城市。",
    image: "/images/spiral-galaxy.png",
    accent: "galaxy",
  },
  {
    archiveId: "ARCHIVE-003",
    targetId: "archive-crab-nebula",
    name: "蟹状星云",
    englishName: "Crab Nebula",
    type: "超新星遗迹",
    distance: "约 6,500 光年",
    region: "金牛座",
    tags: ["脉冲星", "超新星", "高能辐射"],
    summary:
      "一颗恒星的终章没有立刻归于沉默。爆发后的丝状气体仍在扩散，中央脉冲星像深处的钟，持续敲打这份古老记录。",
    detail:
      "蟹状星云来自公元 1054 年被观测到的一次超新星爆发。如今它的气体外壳仍在膨胀，中央高速旋转的中子星持续释放脉冲信号，让这片遗迹成为研究恒星死亡和高能宇宙的关键档案。",
    image: "/images/emission-nebula.png",
    accent: "relic",
  },
  {
    archiveId: "ARCHIVE-004",
    targetId: "archive-black-hole",
    name: "M87 中心黑洞",
    englishName: "M87 Black Hole",
    type: "超大质量黑洞",
    distance: "约 65 亿倍太阳质量",
    region: "室女座星系团",
    tags: ["事件视界", "吸积盘", "相对论"],
    summary:
      "它不发光，却让周围的光暴露出时空的弯曲。那圈模糊的橙色辉光，像宇宙在不可见边界前留下的签名。",
    detail:
      "M87 中心黑洞是事件视界望远镜首次直接成像的黑洞目标。照片中的亮环不是黑洞本身，而是附近高温物质在极强引力中加速、发光并被弯曲后的结果，暗影则标出光也难以逃离的边界。",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg/1280px-Black_hole_-_Messier_87_crop_max_res.jpg",
    accent: "blackHole",
  },
  {
    archiveId: "ARCHIVE-005",
    targetId: "archive-gravitational-lens",
    name: "引力透镜",
    englishName: "Gravitational Lens",
    type: "时空弯曲现象",
    distance: "星系团级尺度",
    region: "深场观测区",
    tags: ["广义相对论", "星系团", "遥远光源"],
    summary:
      "巨大质量让空间本身变成透镜，把更远处的星系拉成弧线。光没有走直路，却因此把暗处的质量轮廓交给我们。",
    detail:
      "引力透镜是广义相对论在宇宙尺度上的可见证据。当前景星系或星系团质量足够巨大时，背景天体的光会被弯折、放大甚至重复成像，天文学家也借此描绘暗物质的分布。",
    image: "/images/spiral-galaxy.png",
    accent: "cosmic",
  },
  {
    archiveId: "ARCHIVE-006",
    targetId: "archive-supernova-remnant",
    name: "超新星遗迹",
    englishName: "Supernova Remnant",
    type: "恒星死亡回声",
    distance: "数十至数百光年尺度",
    region: "银河系遗迹场",
    tags: ["冲击波", "重元素", "恒星演化"],
    summary:
      "恒星死亡时释放出的冲击波，会把重元素推向下一代星云。所谓遗迹，并非终点，而是宇宙重新整理材料的方式。",
    detail:
      "超新星遗迹是爆炸冲击波与星际介质相遇后留下的扩张结构。铁、氧、硅等重元素在其中被抛洒到深空，未来会进入新的恒星、行星，甚至成为生命化学的一部分。",
    image: "/images/emission-nebula.png",
    accent: "relic",
  },
  {
    archiveId: "ARCHIVE-007",
    targetId: "archive-cmb",
    name: "宇宙微波背景辐射",
    englishName: "Cosmic Microwave Background",
    type: "早期宇宙遗迹",
    distance: "可观测宇宙尺度",
    region: "全天背景",
    tags: ["大爆炸", "温度涨落", "早期宇宙"],
    summary:
      "这不是某一颗星的光，而是整个宇宙童年留下的余温。极微弱的温度涟漪，至今仍像古老底片一样铺满天空。",
    detail:
      "宇宙微波背景辐射来自宇宙诞生后约 38 万年，那时光第一次能够自由穿行。它的温度涨落极其微小，却记录了早期物质分布的种子，也帮助我们推断宇宙年龄、组成和大尺度结构的来源。",
    image: "/images/hero-nebula.png",
    accent: "cosmic",
  },
];
