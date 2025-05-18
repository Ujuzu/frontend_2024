import { IMeta } from "./IMeta";

export interface IQualificationReq {
  qualification_name: string;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
export interface ICourseQualificationReqResponse {
  id: number;
  attributes: IQualificationReq;
} 

export interface IQualificationReqStrapiResponse {
  data: ICourseQualificationReqResponse[];
  meta: IMeta;
  };
