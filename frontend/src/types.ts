export interface PaginationQuery {
  page?: number;
  limit?: number;
}
export interface PaginationQueryResult<T> {
  list: T[];
  nextPage?: number;
}
export interface SortQuery {
  sort?: string;
}
