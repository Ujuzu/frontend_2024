import { ICurriculumLessonResponse } from "./ICurriculumLessons";
import { IMedia } from "./IMedia";
import { IMeta } from "./IMeta";
import { ILoginToken } from "./IUserLoginInterfaces";

export interface ILessonHeaderStrapiResponse {
    data: ILessonHeaderResponse[];
    meta: IMeta;
}

export interface ILessonHeaderResponse {
    id: number;
    attributes: ILessonHeaderAttributes;
}

export interface ILessonHeaderAttributes {
    curriculum_lesson_header_title: string;
    course_curriculum_lesson_header_content: string;
    content_img?: IMedia
    video_url?: string;
    crs_cur_lessons?: number[];
    sort_order?: number;
    content_2?: string;
    publishedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface LessonHeadersFormProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: ICurriculumLessonResponse;
  token: ILoginToken | null;
}
