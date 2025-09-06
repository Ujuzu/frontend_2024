
import { IMedia } from "./IMedia";
import { IMeta } from "./IMeta";

export interface IWeeklyCurriculumStrapiResponse {
  data: IWeeklyCurriculumResponse[];
  meta: IMeta;
  };

export interface IWeeklyCurriculumResponse extends ICoursesWklyCurriculumAttribWithMedia {
  id: number;
  documentId: string;
}

export interface ICoursesWklyCurriculumAttrib {
  curriculum_title: string;
  curriculum_reg?: string;
  curriculum_desc?: string;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  courses?:string[];
  intro_pic?:number;
}

export type ICoursesWklyCurriculumAttribWithMedia = Omit<ICoursesWklyCurriculumAttrib, 'intro_pic'> & {
  intro_pic?: IMedia;
};