import type {
  ArticleItem,
  DailyCosmosItem,
  GuideItem,
} from "../types/content";

export const dailyCosmos: DailyCosmosItem = {
  title: "猎户座大星云 M42",
  date: "2026 / 06 / 09",
  image: "/images/daily-cosmos.png",
  credit: "Mock APOD / Star Archive",
  description:
    "在猎户座腰带下方，巨大的气体云孕育着年轻恒星。尘埃、氢气与紫外线交织出粉紫色辉光，也让我们看见恒星诞生时的缓慢风暴。",
};

export const articleItems: ArticleItem[] = [
  {
    title: "太阳系不只是八颗行星",
    category: "太阳系",
    excerpt:
      "从柯伊伯带到奥尔特云，太阳系边界比课堂上的模型更辽阔，也更安静。",
    tags: ["行星", "小天体", "轨道"],
    readingTime: "6 分钟",
    image: "/images/ringed-planet.png",
  },
  {
    title: "恒星为何会有颜色",
    category: "恒星",
    excerpt:
      "蓝白色、金黄色、红色并不只是视觉差异，它们指向恒星温度、年龄与命运。",
    tags: ["光谱", "温度", "演化"],
    readingTime: "5 分钟",
    image: "/images/emission-nebula.png",
  },
  {
    title: "星云：宇宙里的慢速天气",
    category: "星云",
    excerpt:
      "看似轻柔的云雾，其实是恒星诞生、死亡与物质循环最壮丽的现场。",
    tags: ["气体云", "尘埃", "恒星形成"],
    readingTime: "7 分钟",
    image: "/images/daily-cosmos.png",
  },
  {
    title: "黑洞并不是宇宙吸尘器",
    category: "黑洞",
    excerpt:
      "黑洞的神秘来自极端引力，而不是无限吞噬。理解事件视界，是理解它的第一步。",
    tags: ["引力", "事件视界", "相对论"],
    readingTime: "8 分钟",
    image: "/images/spiral-galaxy.png",
  },
  {
    title: "星系如何组织光",
    category: "星系",
    excerpt:
      "旋涡、椭圆、不规则星系背后，是角动量、暗物质与漫长碰撞史。",
    tags: ["星系结构", "暗物质", "碰撞"],
    readingTime: "6 分钟",
    image: "/images/spiral-galaxy.png",
  },
  {
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
    title: "新手观星准备",
    description: "先从肉眼和双筒望远镜开始，熟悉天空比升级设备更重要。",
    details: ["带红光手电", "查看月相", "提前下载离线星图"],
  },
  {
    title: "避开光污染",
    description: "城市灯光会淹没暗弱天体，选择郊外高处或暗空保护区更理想。",
    details: ["远离商业区", "避开满月夜", "给眼睛 20 分钟适应黑暗"],
  },
  {
    title: "星座识别",
    description: "从北斗、猎户、天蝎等高辨识度星座入手，再建立季节星空地图。",
    details: ["先找亮星", "连接主星轮廓", "记录每月同一时间的变化"],
  },
  {
    title: "望远镜选择",
    description: "入门优先考虑稳定支架、易用性和实际观测目标，而不只看倍率。",
    details: ["月面和行星选折射", "深空目标看口径", "预算留给支架"],
  },
  {
    title: "手机星空摄影",
    description: "固定手机、降低 ISO、延长曝光，并用延时拍摄记录星轨变化。",
    details: ["使用三脚架", "手动对焦到无穷远", "尝试 10-20 秒曝光"],
  },
];
