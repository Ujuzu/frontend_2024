// src/Interfaces/ITargetGroup.ts
import { IMeta } from "./IMeta";

export interface ICourseTargetGroupResponse {
  id: number;
  attributes: ITargetGroupAttributes;
}

export interface ITargetGroupAttributes {
  target_group_name: string;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  courses?:number[];
}

export interface ITargetGroupStrapiResponse {
  data: ICourseTargetGroupResponse[];
  meta: IMeta
} 