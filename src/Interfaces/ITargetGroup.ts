// src/Interfaces/ITargetGroup.ts
import { IMeta } from "./IMeta";

export interface ITargetGroupStrapiResponse {
  data: ICourseTargetGroupResponse[];
  meta: IMeta
} 

export interface ICourseTargetGroupResponse extends ITargetGroupAttributes {
  id: number;
  documentId: string;
}

export interface ITargetGroupAttributes {
  target_group_name: string;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  courses?:number[];
}