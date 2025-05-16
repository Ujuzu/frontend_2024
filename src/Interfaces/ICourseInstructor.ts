
import { IMedia } from "./IMedia";
import { IMeta } from "./IMeta";

 export interface ICoursesInstructor {
  id: number;  
  attributes: ICoursesInstructorAttributes;
}
export interface ICoursesInstructorResponse {
  data: ICoursesInstructor[];
  meta: IMeta
}
export interface ICoursesInstructorAttributes {
  id: number;
  instructor_name: string;
  instructor_title?: string;
  instructor_desc?: string;
  instructor_linkedIn?: string;
  instructor_x?: string;
  instructor_fb?: string;
  instructor_youtube?: string;
  instructor_email?: string;
  instructor_img?: IMedia;
  country?: string;
  contact?: string;
  createdAt?: string | null;
  updatedAt?: string;
  publishedAt?: string;
}


