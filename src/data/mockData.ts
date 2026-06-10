import type {
  ArticleItem,
  DailyCosmosItem,
  GuideItem,
} from "../types/content";

export const dailyCosmos: DailyCosmosItem = {
  title: "猎户座大星云 M42",
  date: "2026 / 06 / 10",
  image: "/images/daily-cosmos.png",
  credit: "Mock APOD / Star Archive",
  description:
    "在猎户座腰带下方，巨大的气体云孕育着年轻恒星。尘埃、氢气与紫外线交织出粉紫色辉光，像一段从过去抵达地球的低声讯息。",
};

export const articleItems: ArticleItem[] = [
  {
    archiveId: "ARCHIVE-001",
    title: "太阳系不只是八颗行星",
    category: "太阳系",
    excerpt:
      "从柯伊伯带到奥尔特云，太阳系边界比课堂上的模型更辽阔，也更安静。",
    tags: ["行星", "小天体", "轨道"],
    readingTime: "6 分钟",
    image: "/images/ringed-planet.png",
  },
  {
    archiveId: "ARCHIVE-002",
    title: "恒星为何会有颜色",
    category: "恒星",
    excerpt:
      "蓝白色、金黄色、红色并不只是视觉差异，它们指向恒星温度、年龄与命运。",
    tags: ["光谱", "温度", "演化"],
    readingTime: "5 分钟",
    image: "/images/emission-nebula.png",
  },
  {
    archiveId: "ARCHIVE-003",
    title: "星云：宇宙里的慢速天气",
    category: "星云",
    excerpt:
      "看似轻柔的云雾，其实是恒星诞生、死亡与物质循环最壮丽的现场。",
    tags: ["气体云", "尘埃", "恒星形成"],
    readingTime: "7 分钟",
    image: "/images/daily-cosmos.png",
  },
  {
    archiveId: "ARCHIVE-004",
    title: "黑洞并不是宇宙吸尘器",
    category: "黑洞",
    excerpt:
      "黑洞的神秘来自极端引力，而不是无限吞噬。理解事件视界，是理解它的第一步。",
    tags: ["引力", "事件视界", "相对论"],
    readingTime: "8 分钟",
    image: "/images/spiral-galaxy.png",
  },
  {
    archiveId: "ARCHIVE-005",
    title: "星系如何组织光",
    category: "星系",
    excerpt:
      "旋涡、椭圆、不规则星系背后，是角动量、暗物质与漫长碰撞史。",
    tags: ["星系结构", "暗物质", "碰撞"],
    readingTime: "6 分钟",
    image: "/images/spiral-galaxy.png",
  },
  {
    archiveId: "ARCHIVE-006",
    title: "宇宙起源的第一束光",
    category: "宇宙起源",
    excerpt:
      "宇宙微波背景辐射像一张古老底片，保存着早期宇宙的温度涟漪。",
    tags: ["大爆炸", "CMB", "早期宇宙"],
    readingTime: "9 分钟",
    image: "/images/emission-nebula.png",
  },
];

export const guideItems: GuideItem[] = [
  {
    manualId: "MANUAL-01",
    title: "新手观星准备",
    description: "先从肉眼和双筒望远镜开始。熟悉黑夜，比升级设备更重要。",
    details: ["带红光手电", "查看月相", "提前下载离线星图"],
  },
  {
    manualId: "MANUAL-02",
    title: "避开光污染",
    description: "城市灯光会淹没暗弱天体。真正的星空，往往藏在地图边缘。",
    details: ["远离商业区", "避开满月夜", "给眼睛 20 分钟适应黑暗"],
  },
  {
    manualId: "MANUAL-03",
    title: "星座识别",
    description: "从北斗、猎户、天蝎入手，把天空慢慢变成熟悉的路径。",
    details: ["先找亮星", "连接主星轮廓", "记录每月同一时间的变化"],
  },
  {
    manualId: "MANUAL-04",
    title: "望远镜选择",
    description: "倍率不是答案。稳定、口径与目标，决定你能停留多久。",
    details: ["月面和行星选折射", "深空目标看口径", "预算留给支架"],
  },
  {
    manualId: "MANUAL-05",
    title: "手机星空摄影",
    description: "让手机保持安静，给传感器一点时间，它也能接住星光。",
    details: ["使用三脚架", "手动对焦到无穷远", "尝试 10-20 秒曝光"],
  },
  {
    manualId: "MANUAL-06",
    title: "观测安全与天气",
    description: "一次好的观测，从确认天气、温度和归途开始。",
    details: ["查看云量和湿度", "准备保暖衣物", "不要独自前往陌生荒野"],
  },
];
