import http from "lib/http";
import { InfiniteQueryConfig, QueryConfig } from "lib/react-query";
import { useInfiniteQuery, useQuery } from "react-query";
import { Tag } from "./types";
import { Article } from "features/article/types";
import { PaginationQuery, PaginationQueryResult } from "types";

function fetchTags(): Promise<Tag[]> {
  return http.get("/tags");
}
interface FetchTagArticleParams extends PaginationQuery {
  id: string;
  filter?: "week" | "month" | "year";
  sort?: "oldest" | "latest";
}
function fetchTagArticles({
  id,
  ...params
}: FetchTagArticleParams): Promise<PaginationQueryResult<Article>> {
  return http.get(`/tags/${id}/articles`, {
    params,
  });
}
function fetchTag(id: string): Promise<Tag> {
  return http.get(`/tags/${id}`);
}
function fetchTopTags(): Promise<Tag[]> {
  return http.get("/tags/top");
}
export function useTags(config?: QueryConfig<typeof fetchTags>) {
  return useQuery({
    queryKey: "tag",
    queryFn: fetchTags,
    ...config,
  });
}
interface UseTagOptions {
  id: string;
  config?: QueryConfig<typeof fetchTag>;
}
export function useTag({ id, config }: UseTagOptions) {
  return useQuery({
    queryKey: ["tag", id],
    queryFn: () => fetchTag(id),
    ...config,
  });
}
interface UseTagArticlesOptions extends FetchTagArticleParams {
  config?: InfiniteQueryConfig<typeof fetchTagArticles>;
}
export function useTagArticles({
  id,
  filter,
  sort,
  config,
}: UseTagArticlesOptions) {
  return useInfiniteQuery({
    queryKey: ["tag", id, "article", filter, sort],
    queryFn: ({ pageParam }) =>
      fetchTagArticles({ id, filter, sort, limit: 1, page: pageParam }),
    getNextPageParam: (lp) => lp.nextPage,
    ...config,
  });
}
export function useTopTags(config?: QueryConfig<typeof fetchTopTags>) {
  return useQuery({
    queryKey: ["tag", "top"],
    queryFn: fetchTopTags,
    ...config,
  });
}
