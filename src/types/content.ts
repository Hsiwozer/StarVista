export type GalleryCategory =
  | "Nebula"
  | "Galaxy"
  | "Moon"
  | "Planet"
  | "Black Hole"
  | "Deep Sky Object";

export interface GalleryItem {
  id: number;
  targetId: string;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  distance: string;
  image: string;
  description: string;
  tags: string[];
}

export type ArchiveAccent = "nebula" | "galaxy" | "blackHole" | "relic" | "cosmic";

export interface ArchiveRecord {
  archiveId: string;
  targetId: string;
  name: string;
  englishName: string;
  type: string;
  distance: string;
  region: string;
  tags: string[];
  summary: string;
  detail: string;
  image: string;
  accent: ArchiveAccent;
}

export interface ManualStepItem {
  manualId: string;
  title: string;
  description: string;
  prompt: string;
}
