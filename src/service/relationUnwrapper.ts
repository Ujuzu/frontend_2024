import { RelationData } from "@/Interfaces/ICourseRespone";

export function unwrapRelation<T extends { id: number }>(relation?: RelationData<T[]>): number[] {
  return relation?.data?.map(item => item.id) ?? [];
}