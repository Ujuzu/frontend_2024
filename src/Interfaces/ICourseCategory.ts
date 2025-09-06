import { ICourseSubcategoryResponse } from "./ICourseSubcategory";
import { IMeta } from "./IMeta";

export interface ICourseCategory {
  title: string;
  description?: string; 
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
export interface ICourseCategoryResponse extends ICourseCategory {
  id: number;
   documentId: string;
}
export interface ICourseCategoryStrapiResponse {
  data: ICourseCategoryResponse[];
  meta: IMeta;
}


export interface ICategorySelectorProps {
  availableCategories: ICourseCategoryResponse[];
  availableSubcategories: ICourseSubcategoryResponse[];
  selectedCategories: number[];
  selectedSubcategories: number[];
  setSelectedCategories: (ids: number[]) => void;
  setSelectedSubcategories: (ids: number[]) => void;
}
