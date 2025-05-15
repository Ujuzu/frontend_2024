import { ICourseCategory } from "./ICourseCategory";
import { ICoursesFeature } from "./ICourseFeature";
import { ICoursesInstructor } from "./ICourseInstructor";
import { ICourseSubcategory } from "./ICourseSubcategory";
import { ILearnList } from "./ILearnList";
import { ICourseQualificationRequirement } from "./IQualificationRequirement";
import { IQuestion } from "./IQuestion";
import { ISubscriptionPackage } from "./ISubscriptionPackage";
import { ICourseTargetGroup } from "./ITargetGroup";
import { ICoursesWeeklyCurriculum } from "./IWeeklyCurriculum";

export interface ICourse {
  id: number;
  course_name: string;
  short_desc?: string;
  short_desc_2?: string;
  short_desc_3?: string;
  course_outline?: string;
  rating_count?: number;
  language?: string;
  certificate?: boolean;
  quizes?: boolean;
  level?: string;
  sort_order?: number;
  weekly_curriculum_intro?: string;
  duration?: string;
  video_url?: string;
  locale?: string;
  publishedAt?: string;
}

export interface ICourseResponse extends ICourse {
 course_intro_video?: string;
  course_intro_img?: string;

  // Relations (optional or included depending on context)
  courses_subcategories?: ICourseSubcategory[];
  courses_categories?: ICourseCategory[];
  courses_instructors?: ICoursesInstructor[];
  course_target_groups?: ICourseTargetGroup[];
  course_learn_lists?: ILearnList[];
  course_qualification_equirements?: ICourseQualificationRequirement[];
  subscription_packages?: ISubscriptionPackage[];
  courses_features?: ICoursesFeature[];
  courses_weekly_curricula?: ICoursesWeeklyCurriculum[];
  questions?: IQuestion[];
}


export interface ICourseInputForm extends Omit<ICourse, 'id'> {
  courses_subcategories?: number[]; // Array of IDs
  courses_categories?: number[]; // Array of IDs
  courses_instructors?: number[]; // Array of IDs
  course_target_groups?: number[]; // Array of IDs
  course_learn_lists?: number[]; // Array of IDs
  course_qualification_equirements?: number[]; // Array of IDs
  subscription_packages?: number[]; // Array of IDs
  courses_features?: number[]; // Array of IDs
  courses_weekly_curricula?: number[]; // Array of IDs
  questions?: number[]; // Array of IDs
} 

export interface IMeta {
  pagination: IPagination;
}

export interface IPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// Strapi response structure
export interface IStrapiResponse {
  data: ICourse[];
  meta: IMeta;
}