
import { IMeta } from "./IMeta";

export interface IWeeklyCurriculumStrapiResponse {
  data: IWeeklyCurriculumResponse[];
  meta: IMeta;
  };

export interface IWeeklyCurriculumResponse {
  id: number;
  attributes: ICoursesWklyCurriculumAttrib;
}

export interface ICoursesWklyCurriculumAttrib {
  curriculum_title: string;
  curriculum_reg?: string;
  curriculum_desc?: string;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  courses?:number[];
}
