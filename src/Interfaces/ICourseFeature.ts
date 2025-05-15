export interface ICoursesFeature {
  id: number;
  course_features_name: string;
  publishedAt?: string | null; // If using draftAndPublish
  createdAt?: string;
  updatedAt?: string;
}