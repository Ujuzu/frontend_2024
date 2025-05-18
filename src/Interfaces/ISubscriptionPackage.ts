import { IMeta } from "./IMeta";

export interface ISubscriptionPackage {
  packageName: string;
  isActive?: boolean;
  totalMaxUsers: number;
  duration?: string;
  description?: string;
    publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
export interface ISubscriptionPackageResponse {
  id: number;
  attributes: ISubscriptionPackage;
}

export interface ISubscriptionPackageStrapiResponse {
  data: ISubscriptionPackageResponse[];
  meta: IMeta;
} 
