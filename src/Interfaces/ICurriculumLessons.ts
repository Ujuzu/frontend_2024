import { IMedia } from "./IMedia";
import { IMeta } from "./IMeta";

export interface ICurriculumLessonAttributes {
    curriculum_lesson_title: string;
    curriculum_lesson_desc: string;
    curriculum_lesson_reg: string;
    sort_order?: number;
    courses_weekly_curricula?: number[];
    intro_pic?: IMedia;
    publishedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICurriculumLessonResponse {
    id: number;
    attributes: ICurriculumLessonAttributes;
}

export interface ICurriculumLessonStrapiResponse {
    data: ICurriculumLessonResponse[];
    meta: IMeta;
}
