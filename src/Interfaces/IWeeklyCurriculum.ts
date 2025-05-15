import { IMedia } from "./IMedia";

export interface ICoursesWeeklyCurriculum {
  id: number;
  curriculum_title: string;
  curriculum_reg: string;
  curriculum_desc: string;
  intro_pic: IMedia | null; 
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}