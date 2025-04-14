// types.ts
export interface CourseFormData {
  documentId?: string;
  course_name?: string;
  short_desc?: string;
  course_outline?: string;
  rating_count?: number;
  language?: string;
  certificate?: boolean;
  quizes?: number | boolean;
  level?: string;
  short_desc_2?: string;
  sort_order?: number;
  short_desc_3?: string;
  weekly_curriculum_intro?: string;
  duration?: string;
  video_url?: string;
  locale?: string;
  course_category?: string;
  subtitle?: string;
}

export interface CurriculumItem {
  title: string;
  description: string;
  order: number;
}

export interface FormStepProps {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
  curriculumItems?: CurriculumItem[];
  setCurriculumItems?: React.Dispatch<React.SetStateAction<CurriculumItem[]>>;
  courseImage?: File | null;
  setCourseImage?: React.Dispatch<React.SetStateAction<File | null>>;
  courseMaterials?: File[];
  setCourseMaterials?: React.Dispatch<React.SetStateAction<File[]>>;
}
