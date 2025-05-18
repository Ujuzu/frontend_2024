import { ICourseCategoryResponse } from "./ICourseCategory";
import { ICourseFeatureResponse } from "./ICourseFeature";
import { ICoursesInstructorResponse } from "./ICourseInstructor";
import { ICourseSubcategoryResponse } from "./ICourseSubcategory";
import { ILearnListResponse } from "./ILearnList";
import { IMeta } from "./IMeta";
import { ICourseQualificationReqResponse } from "./IQualificationRequirement";
import { ISubscriptionPackageResponse } from "./ISubscriptionPackage";
import { ICourseTargetGroupResponse } from "./ITargetGroup";
import { IWeeklyCurriculumResponse } from "./IWeeklyCurriculum";

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
  courses_subcategories?: ICourseSubcategoryResponse[];
  courses_categories?: ICourseCategoryResponse[];
  courses_instructors?: ICoursesInstructorResponse[];
  course_intro_video?: NullableMediaData;
  course_intro_img?: MediaData;
  course_target_groups?: ICourseTargetGroupResponse[];
  course_learn_lists?: ILearnListResponse[];
  course_qualification_equirements?: ICourseQualificationReqResponse[];
  subscription_packages?: ISubscriptionPackageResponse[];
  course_reviews?: RelationData<unknown>;
  courses_features?: ICourseFeatureResponse[];
  courses_weekly_curricula?: IWeeklyCurriculumResponse[];
}

 export interface DialogState {
  isAddCourseOpen: boolean;
  isEditCourseOpen: boolean;
  isDeleteCourseOpen: boolean;
  isViewCourseOpen: boolean;
  selectedCourse: ICourseResponse | null;
}

export interface ICourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (course: ICourseResponse) => void;
  initialData?: ICourseAttributes;
  isEdit?: boolean;
  course_Id?: number;
}

export interface IFormStepProps {
courseId: number;
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
