export type LearningCategorySlug =
  | "stories"
  | "natural-science"
  | "social-science"
  | "history"
  | "literacy"
  | "mathematics"
  | "health"
  | "games"
  | "creativity";

export type LearningItemRecord = {
  itemId: string;
  categorySlug: LearningCategorySlug;
  titleEn: string;
  titleTet: string;
  descriptionEn: string;
  descriptionTet: string;
  coverImageUrl: string;
  pageImageUrls: string[];
  sourcePdfUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};