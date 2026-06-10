export type GalleryCategory =
  | "Nebula"
  | "Galaxy"
  | "Moon"
  | "Planet"
  | "Black Hole"
  | "Deep Sky Object";

export interface DailyCosmosItem {
  title: string;
  date: string;
  image: string;
  credit: string;
  description: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  distance: string;
  image: string;
  description: string;
  tags: string[];
}

export interface ArticleItem {
  archiveId: string;
  title: string;
  category: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  image: string;
}

export interface GuideItem {
  manualId: string;
  title: string;
  description: string;
  details: string[];
}
