import { IMedia } from "./IMedia";
import { IMeta } from "./IMeta";

export interface ICoursesWklyCurriculumAttrib {
  curriculum_title?: string;
  curriculum_reg?: string;
  curriculum_desc?: string;
  intro_pic?: IMedia | null; 
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
export interface IWeeklyCurriculumStrapiResponse {
  data: IWeeklyCurriculumResponse[];
  meta: IMeta;
  };

export interface IWeeklyCurriculumResponse {
  id: number;
  attributes: ICoursesWklyCurriculumAttrib;
}