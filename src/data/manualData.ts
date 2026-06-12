import type { ManualStepItem } from "../types/content";

export const manualSteps: ManualStepItem[] = [
  {
    manualId: "MANUAL-00",
    title: "进入夜色",
    description: "观测不是从抬头开始，而是从离开强光开始。",
    prompt: "手册指令：找到一条能把你带离城市灯火的路线。",
  },
  {
    manualId: "MANUAL-01",
    title: "选择观测地点",
    description:
      "寻找远离路灯、高楼和广告牌的开阔地带。天空需要宽阔，也需要安静。",
    prompt: "手册指令：确认一片没有明显遮挡的天空。",
  },
  {
    manualId: "MANUAL-02",
    title: "判断天气与云量",
    description:
      "晴朗只是开始。云量、湿度与透明度，决定暗弱星光能否抵达眼前。",
    prompt: "手册指令：优先确认云量、湿度和透明度。",
  },
  {
    manualId: "MANUAL-03",
    title: "避开月光与光污染",
    description:
      "月光会覆盖暗弱目标。城市灯火会让深空档案暂时隐身。",
    prompt: "手册指令：确认月相，并避开最明亮的城市方向。",
  },
  {
    manualId: "MANUAL-04",
    title: "适应黑暗",
    description:
      "给眼睛 20 到 30 分钟。不要急着看见，先让黑暗归位。",
    prompt: "手册指令：至少等待 20 分钟，避免直视手机和强光。",
  },
  {
    manualId: "MANUAL-05",
    title: "识别方向与星座",
    description:
      "从北极星、北斗七星或猎户座开始。让熟悉的亮星建立第一条坐标。",
    prompt: "手册指令：先锁定一个方向，再寻找最熟悉的亮星。",
  },
  {
    manualId: "MANUAL-06",
    title: "选择工具",
    description:
      "裸眼认识星空，双筒望远镜接近暗光，天文望远镜进入更深的记录层。",
    prompt: "手册指令：先确定目标，再决定是否带上更重的设备。",
  },
  {
    manualId: "MANUAL-07",
    title: "记录第一束星光",
    description:
      "用文字、照片或观测笔记保存那一刻。档案从第一行记录开始。",
    prompt: "手册指令：写下时间、地点、天气和第一个被认出的天体。",
  },
];
