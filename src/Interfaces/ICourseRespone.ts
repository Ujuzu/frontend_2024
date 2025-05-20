// src\Interfaces\ICourseRespone.ts
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
  attributes: ICourseAttributesStrapiResponse;
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
 course_intro_img?: MediaData;
   course_intro_video?: NullableMediaData;
}

export interface ICourseAttributesStrapiResponse extends ICourseAttributes {
courses_subcategories?: RelationData<ICourseSubcategoryResponse[]>;
  courses_categories?: RelationData<ICourseCategoryResponse[]>;
  courses_instructors?: RelationData<ICoursesInstructorResponse[]>;
  course_target_groups?: RelationData<ICourseTargetGroupResponse[]>;
  course_learn_lists?: RelationData<ILearnListResponse[]>;
  course_qualification_equirements?: RelationData<ICourseQualificationReqResponse[]>;
  subscription_packages?: RelationData<ISubscriptionPackageResponse[]>;
  course_reviews?: RelationData<unknown>;
  courses_features?: RelationData<ICourseFeatureResponse[]>;
  courses_weekly_curricula?: RelationData<IWeeklyCurriculumResponse[]>;
}

export interface ICourseAttributesDataPayload extends ICourseAttributes {
  courses_subcategories?:number[];
  courses_categories?:number[];
  courses_instructors?:number[];
  course_intro_video?:MediaData;
  course_intro_img?:MediaData;
  course_target_groups?:number[];
  course_learn_lists?:number[];
  course_qualification_equirements?:number[];
  subscription_packages?:number[];
  course_reviews?:number[];
  courses_features?:number[];
  courses_weekly_curricula?:number[];
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
  initialData?: ICourseResponse | null;
  isEdit?: boolean;
  course_Id?: number;
}

export interface IFormStepProps {
courseId: number;
  formData: ICourseAttributesDataPayload;
  setFormData: React.Dispatch<React.SetStateAction<ICourseAttributesDataPayload>>;
}

export interface RelationData<T> {
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
