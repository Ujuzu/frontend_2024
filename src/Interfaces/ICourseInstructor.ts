
import { IMedia } from "./IMedia";

export interface ICoursesInstructor {
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
}
