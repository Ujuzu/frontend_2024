import { IMeta } from "./IMeta";

export interface ICourseCategory {
  title: string;
  description?: string; // Optional richtext field
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
export interface ICourseCategoryResponse {
  id: number;
  attributes: ICourseCategory;
}
export interface ICourseCategoryStrapiResponse {
  data: ICourseCategoryResponse[];
  meta: IMeta;
}


