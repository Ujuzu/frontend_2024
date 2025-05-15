
export interface ISubscriptionPackage {
    id: number;
  packageName: string;
  isActive?: boolean;
  totalMaxUsers: number;
  duration?: string;
  description?: string;
}