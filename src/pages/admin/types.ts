// types.ts
export interface Category {
  id: number;
  documentId: string;
  title: string;
  description?: string;
}

export interface Subcategory {
  id: number;
  documentId: string;
  name: string;
  description?: string;
}

export interface LearnListItem {
  id: number;
  documentId: string;
  text: string;
}

export interface Review {
  id: number;
  documentId: string;
  reviewer_name: string;
  review_text: string;
  rating: number;
  date?: string;
}

export interface Instructor {
  id: number;
  documentId: string;
  instructor_name: string;
  bio?: string;
  avatar_url?: string;
}

export interface Requirement {
  id: number;
  documentId: string;
  text: string;
}

export interface Feature {
  id: number;
  documentId: string;
  title: string;
  description?: string;
}

export interface TargetGroup {
  id: number;
  documentId: string;
  description: string;
}

export interface Course {
  id: number;
  documentId: string;
  course_name: string;
  course_outline?: string;
  rating_count?: number;
  language?: string;
  certificate?: boolean;
  quizes?: boolean | number;
  level?: string;
  short_desc?: string;
  short_desc_2?: string;
  short_desc_3?: string;
  sort_order?: number;
  curriculum_overview?: string;
  duration?: string;
  intro_video_url?: string;
  course_categories?: Category[];
  course_subcategories?: Subcategory[];
  course_learn_lists?: LearnListItem[];
  course_reviews?: Review[];
  courses_instructors?: Instructor[];
  course_requirements?: Requirement[];
  courses_features?: Feature[];
  course_target_groups?: TargetGroup[];
}

export interface CourseFormData {
  course_name?: string;
  course_outline?: string;
  rating_count?: number;
  language?: string;
  certificate?: boolean;
  quizes?: boolean | number;
  level?: string;
  short_desc?: string;
  short_desc_2?: string;
  short_desc_3?: string;
  sort_order?: number;
  curriculum_overview?: string;
  duration?: string;
  intro_video_url?: string;
  course_categories?: number[];
  course_subcategories?: number[];
  course_learn_lists?: number[];
  course_reviews?: number[];
  courses_instructors?: number[];
  course_requirements?: number[];
  courses_features?: number[];
  course_target_groups?: number[];
}

export interface EditCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  onSave?: () => void;
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
