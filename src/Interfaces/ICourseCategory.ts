
export interface ICourseCategory {
  id: number;
  title: string;
  description?: string; // Optional richtext field

}

export interface ICourseCategoryInputForm extends Omit<ICourseCategory, 'id'> {
  pic?: number; // Single media upload
  introVideo?: number[]; // Multiple video uploads
}

