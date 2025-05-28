import { ICourseCategory } from "./ICourseCategory";
import { ICourseSubcategory } from "./ICourseSubcategory";

export interface ITopics {
      unitSummary?: string;
  serial?: string;
  coursecategories?: ICourseCategory[];
  course_subcategories?: ICourseSubcategory[];
  duration?: string;
  courseOutline?: string;
  rating_count?: number;
  language?: string;
  certificate?: boolean;
  quizes?: boolean;

}