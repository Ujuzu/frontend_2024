
export interface ICharge {
  id: number;
  amount: number; // Decimal type in Strapi, but treated as number in TypeScript
  name: string;
  description?: string;
  approved?: boolean;
  isActive?: boolean;
}
