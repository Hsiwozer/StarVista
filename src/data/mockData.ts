import type {
  ArticleItem,
  DailyCosmosItem,
} from "../types/content";

export const dailyCosmos: DailyCosmosItem = {
  title: "猎户座大星云 M42",
  date: "2026 / 06 / 10",
  image: "/images/daily-cosmos.png",
  credit: "Mock APOD / Star Archive",
  description:
    "在猎户座腰带下方，尘埃、氢气与年轻恒星互相照亮。一束来自过去的光，今日抵达档案馆。",
};

export const articleItems: ArticleItem[] = [
  {
    archiveId: "ARCHIVE-001",
    targetId: "archive-solar-system",
    title: "太阳系不只是八颗行星",
    category: "太阳系",
    status: "OPEN RECORD",
    excerpt:
      "柯伊伯带之外，黑暗继续延伸。太阳系的边界，比记忆中的模型更辽阔。",
    tags: ["行星", "小天体", "轨道"],
    readingTime: "6 分钟",
    image: "/images/ringed-planet.png",
  },
  {
    archiveId: "ARCHIVE-002",
    targetId: "archive-stellar-color",
    title: "恒星为何会有颜色",
    category: "恒星",
    status: "SPECTRAL NOTE",
    excerpt:
      "蓝白、金黄、暗红。颜色不是装饰，是温度、年龄与命运留下的微弱签名。",
    tags: ["光谱", "温度", "演化"],
    readingTime: "5 分钟",
    image: "/images/emission-nebula.png",
  },
  {
    archiveId: "ARCHIVE-003",
    targetId: "archive-nebula",
    title: "星云：宇宙里的慢速天气",
    category: "星云",
    status: "FIELD FILE",
    excerpt:
      "那些像雾一样漂浮的结构，保存着恒星诞生与死亡之间漫长的循环。",
    tags: ["气体云", "尘埃", "恒星形成"],
    readingTime: "7 分钟",
    image: "/images/daily-cosmos.png",
  },
  {
    archiveId: "ARCHIVE-004",
    targetId: "archive-black-hole",
    title: "黑洞并不是宇宙吸尘器",
    category: "黑洞",
    status: "RESTRICTED SIGNAL",
    excerpt:
      "它的神秘并非吞噬一切，而是让光在边界前沉默。事件视界，是第一道封印。",
    tags: ["引力", "事件视界", "相对论"],
    readingTime: "8 分钟",
    image: "/images/spiral-galaxy.png",
  },
  {
    archiveId: "ARCHIVE-005",
    targetId: "archive-galaxy",
    title: "星系如何组织光",
    category: "星系",
    status: "DEEP FIELD",
    excerpt:
      "旋臂、椭圆与不规则阴影背后，是暗物质与碰撞史共同整理出的光。",
    tags: ["星系结构", "暗物质", "碰撞"],
    readingTime: "6 分钟",
    image: "/images/spiral-galaxy.png",
  },
  {
    archiveId: "ARCHIVE-006",
    targetId: "archive-first-light",
    title: "宇宙起源的第一束光",
    category: "宇宙起源",
    status: "PRIMORDIAL TRACE",
    excerpt:
      "宇宙微波背景像一张古老底片。温度的涟漪，仍在暗处缓慢显影。",
    tags: ["大爆炸", "CMB", "早期宇宙"],
    readingTime: "9 分钟",
    image: "/images/emission-nebula.png",
  },
];
