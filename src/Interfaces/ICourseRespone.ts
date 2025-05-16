import { IMeta } from "./IMeta";

export interface IStrapiResponse {
  data: ICourseResponse[];
  meta: IMeta;
}

export interface ICourseResponse {
  id: number;
  attributes: ICourseAttributes;
}

export interface ICourseAttributes {
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
  createdBy?:string;
  updatedBy?:string;
    createdAt?: string;
    updatedAt?: string;
  courses_subcategories?: RelationData<unknown>;
  courses_categories?: RelationData<unknown>;
  courses_instructors?: RelationData<Instructor[]>;
  course_intro_video?: NullableMediaData;
  course_intro_img?: MediaData;
  course_target_groups?: RelationData<TargetGroup[]>;
  course_learn_lists?: RelationData<LearnItem[]>;
  course_qualification_equirements?: RelationData<Qualification[]>;
  subscription_packages?: RelationData<SubscriptionPackage[]>;
  course_reviews?: RelationData<unknown>;
  courses_features?: RelationData<Feature[]>;
  courses_weekly_curricula?: RelationData<WeeklyCurriculum[]>;
}

 export interface DialogState {
  isAddCourseOpen: boolean;
  isEditCourseOpen: boolean;
  isDeleteCourseOpen: boolean;
  isViewCourseOpen: boolean;
  selectedCourse: ICourseResponse | null;
}

interface RelationData<T> {
  data: T;
}

interface MediaData {
  data: {
    id: number;
    attributes: MediaAttributes;
  };
}

interface NullableMediaData {
  data: null | {
    id: number;
    attributes: MediaAttributes;
  };
}

interface MediaAttributes {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: unknown; 
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Instructor {
  id: number;
  attributes: {
    instructor_name: string;
    instructor_title: string;
    instructor_desc: string;
    instructor_linkedIn: string;
    instructor_x: string;
    instructor_fb: string;
    instructor_youtube: string;
    instructor_email: string;
    country: string;
    contact: string;
    createdAt: string | null;
    updatedAt: string;
    publishedAt: string;
  };
}

interface TargetGroup {
  id: number;
  attributes: {
    target_group_name: string;
    createdAt: string | null;
    updatedAt: string;
    publishedAt: string;
  };
}

interface LearnItem {
  id: number;
  
}

interface Qualification {
  id: number;
  attributes: {
    qualification_name: string;
    createdAt: string | null;
    updatedAt: string;
    publishedAt: string;
  };
}

interface SubscriptionPackage {
  id: number;
  attributes: {
    isActive: boolean;
    totalMaxUsers: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    packageName: string;
    duration: string;
    descritpion: string;
  };
}

interface Feature {
  id: number;
  attributes: {
    course_features_name: string;
    createdAt: string | null;
    updatedAt: string | null;
    publishedAt: string;
  };
}

interface WeeklyCurriculum {
  id: number;
  attributes: {
    curriculum_title: string;
    curriculum_reg: string;
    curriculum_desc: string;
    createdAt: string;
  
  };
}
