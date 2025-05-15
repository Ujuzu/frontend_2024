import { IMedia } from "./IMedia";


export interface ICourseSubcategory {
 id: number;
  title: string;
  description?: string;
  introVideo?: IMedia; // Single video upload
  level?: number;
  levelType?: "DayCare" | "Nursery" | "Primary" | "High School," | "University" | "College";
  levelName?: string;
}

