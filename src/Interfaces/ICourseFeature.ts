import { IMeta } from "./IMeta";

export interface ICoursesFeature {
  course_features_name: string;
  publishedAt?: string | null; 
  createdAt?: string;
  updatedAt?: string;
}

export interface ICourseFeatureStrapiResponse {
  data: ICourseFeatureResponse[];
  meta: IMeta;
}

export interface ICourseFeatureResponse {
  id: number;
  attributes: ICoursesFeature;
}
