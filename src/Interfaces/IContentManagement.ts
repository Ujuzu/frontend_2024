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
