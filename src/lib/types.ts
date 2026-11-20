export type Lang = "pt" | "en";
export type Era = "yep" | "broken";
export type EditorialStatus = "draft" | "review" | "published";
export type WritingType = "scene" | "dossier" | "dialogue" | "lore";
export type UserRole = "admin" | "writer" | "reader";
export type SilhouetteType = "prophet" | "youth" | "runner" | "luck" | "mentor" | "mystery";

export interface LocalizedText {
  pt: string;
  en: string;
}

export interface CharacterPhase {
  agePt: string;
  ageEn: string;
  src: string;
  descPt: string;
  descEn: string;
}

export interface CharacterGalleryItem {
  src: string;
  pt: string;
  en: string;
}

export interface CharacterItem {
  id: string;
  name: string;
  codename: string;
  hasVisual: boolean;
  requiresReveal?: boolean;
  isCustom?: boolean;
  status?: EditorialStatus;
  isCanon?: boolean;
  authorId?: string | null;
  authorName?: string;
  silhouette?: SilhouetteType;
  categories: string[];
  accent: string;
  img?: string;
  gallery?: CharacterGalleryItem[];
  specialType?: "anaira" | "estella";
  phases?: CharacterPhase[];
  role: LocalizedText;
  evidence: LocalizedText;
  summary: LocalizedText;
  publicMode?: LocalizedText;
  tacticalMode?: LocalizedText;
  quote: LocalizedText;
  connections: string[];
}

export interface WritingEntry {
  id: string;
  characterId: string;
  entryType: WritingType;
  era: string;
  title: string;
  body: string;
  status: EditorialStatus;
  isCanon: boolean;
  authorId?: string | null;
  authorName: string;
  updatedAt: string;
}

export interface TrackItem {
  id: string;
  code: string;
  title: string;
  src: string;
  cover: string;
  eraTag: string;
  sourceBadge: string;
  categories: string[];
  duration: string;
  linkedCharId: string;
  linkedCharLabel: string;
  mood: LocalizedText;
  storyNote: LocalizedText;
}

export interface WriterProfile {
  id: string | null;
  email?: string | null;
  displayName: string;
  role: UserRole;
  isCloud: boolean;
}
