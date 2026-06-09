import type { GalleryItem } from "../types/content";

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
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
    title: "Pillars of Creation",
    subtitle: "创生之柱",
    category: "Deep Sky Object",
    distance: "约 6,500 光年",
    description:
      "鹰状星云中的尘埃柱孕育年轻恒星，光从气体褶皱间渗出，像宇宙保存下来的慢速雕塑。",
    image: "/images/emission-nebula.png",
    tags: ["深空天体", "尘埃柱", "恒星摇篮"],
  },
];
