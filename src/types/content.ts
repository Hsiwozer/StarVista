export type GalleryCategory = "星云" | "星系" | "月球" | "行星";

export interface DailyCosmosItem {
  title: string;
  date: string;
  image: string;
  credit: string;
  description: string;
}

export interface GalleryItem {
  title: string;
  category: GalleryCategory;
  image: string;
  description: string;
}

export interface ArticleItem {
  title: string;
  category: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  image: string;
}

export interface GuideItem {
  title: string;
  description: string;
  details: string[];
}
