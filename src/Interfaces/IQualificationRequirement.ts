import { IMeta } from "./IMeta";

export interface IQualificationReqStrapiResponse {
  data: ICourseQualificationReqResponse[];
  meta: IMeta;
  };
  
export interface IQualificationReqAttributes {
  qualification_name: string;
  description?: string;
  publishedAt?: string;
  courses?: number[];
  createdAt?: string;
  updatedAt?: string;
}
export interface ICourseQualificationReqResponse {
  id: number;
  attributes: IQualificationReqAttributes;
} 


export interface QualificationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newQualificationData: IQualificationReqAttributes) => Promise<void>;
  courseId?: number;
}
