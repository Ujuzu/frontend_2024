import { IMedia } from "./IMedia";
import { IMeta } from "./IMeta";
import { ILoginToken } from "./IUserLoginInterfaces";
import { IWeeklyCurriculumResponse } from "./IWeeklyCurriculum";

export interface ICurriculumLessonStrapiResponse {
    data: ICurriculumLessonResponse[];
    meta: IMeta;
}

export interface ICurriculumLessonResponse {
    id: number;
    attributes: ICurriculumLessonAttributesWithMedia;
}

export interface ICurriculumLessonAttributes {
    curriculum_lesson_title: string;
    curriculum_lesson_desc: string;
    curriculum_lesson_reg?: string;
    sort_order?: number;
    courses_weekly_curricula?: number[];
    intro_pic?: number;
    publishedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CurriculumLessonsFormProps {
  isOpen: boolean;
  onClose: () => void;
  curriculum: IWeeklyCurriculumResponse;
  token: ILoginToken | null;
  courseTitle?: string;
}

export type ICurriculumLessonAttributesWithMedia = Omit<ICurriculumLessonAttributes, 'intro_pic'> & {
  intro_pic?: IMedia;
};