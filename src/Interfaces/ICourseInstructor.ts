import { IMedia } from "./IMedia";
import { IMeta } from "./IMeta";

export interface ICoursesInstructorStrapiResponse {
  data: ICoursesInstructorResponse[];
  meta: IMeta
}

 export interface ICoursesInstructorResponse {
  id: number;  
  attributes: ICoursesInstructorAttributesWithMedia;
}
export interface ICoursesInstructorAttributes {
  instructor_name: string;
  instructor_title?: string;
  instructor_desc?: string;
  instructor_linkedIn?: string;
  instructor_x?: string;
  instructor_fb?: string;
  instructor_youtube?: string;
  instructor_email?: string;
  instructor_img?: number;
  courses?:number[];
  country?: string;
  contact?: string;
  createdAt?: string | null;
  updatedAt?: string;
  publishedAt?: string;
}

export interface InstructorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newInstructorData: ICoursesInstructorAttributes) => Promise<void>;
  courseId?: number;
}

export type ICoursesInstructorAttributesWithMedia = Omit<ICoursesInstructorAttributes, 'instructor_img'> & {
  instructor_img?: IMedia;
};

