import { SelectQueryBuilder } from "typeorm";
export interface PaginationQuery {
  page: number;
  limit: number;
}
export interface PaginationQueryResult<T> {
  nextPage?: number;
  list: T[];
}
export interface SortQuery {
  sort?: string;
}
export interface SearchQuery {
  q: string;
}
export function createSearchQuery(q: string) {
  return q
    .split(/\s/)
    .map((s) => s.trim())
    .join("|");
}
export async function getPaginationQueryResult<T>(
  qb: SelectQueryBuilder<T>,
  { limit, page }: PaginationQuery
): Promise<PaginationQueryResult<T>> {
  const total = await qb.getCount();
  qb.take(limit).skip(page - 1);
  const list = await qb.getMany();
  return {
    list,
    nextPage: page + 1 <= Math.ceil(total / limit) ? page + 1 : undefined,
  };
}
