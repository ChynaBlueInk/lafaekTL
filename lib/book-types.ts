export type BookRecord = {
  bookId: string;
  titleEn: string;
  titleTet: string;
  descriptionEn: string;
  descriptionTet: string;
  level: "LK" | "LP";
  category: string;
  coverImageUrl: string;
  pageImageUrls: string[];
  sourcePdfUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};