import { IMedia } from "./IMedia";
import { IMeta } from "./IMeta";


export interface ICourseSubcategory {
  title: string;
  description?: string;
  introVideo?: IMedia; // Single video upload
  level?: number;
  levelType?: "DayCare" | "Nursery" | "Primary" | "High School," | "University" | "College";
  levelName?: string;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICourseSubcategoryResponse extends ICourseSubcategory {
  id: number;
  documentId: string;
}

export interface ICourseSubcategoryStrapiResponse {
  data: ICourseSubcategoryResponse[];
  meta:IMeta;
}

export interface ICourseSubcategoryStrapiResponseSingle {
  data: ICourseSubcategoryResponse;
}
