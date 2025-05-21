import { IMedia } from "./IMedia";
import { IMeta } from "./IMeta";

export interface ILessonHeaderResponse {
    id: number;
    attributes: ILessonHeaderAttributes;
}
export interface ILessonHeaderStrapiResponse {
    data: ILessonHeaderResponse[];
    meta: IMeta;
}

export interface ILessonHeaderAttributes {
    curriculum_lesson_header_title: string;
    course_curriculum_lesson_header_content: string;
    content_img?: IMedia
    video_url: string;
    crs_cur_lessons?: number[];
    sort_order: number;
    content_2: string;
    publishedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}



