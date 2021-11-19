import { Article } from "features/article/types";
import { Comment } from "features/comment/types";
import { UserPreview } from "features/profile/types";
import http from "lib/http";
import { QueryConfig } from "lib/react-query";
import { useQuery } from "react-query";
import { SortQuery } from "types";

type SearchParams = { q: string } & SortQuery;
function searchArticles(params: SearchParams): Promise<Article[]> {
  return http.get("/search/articles", { params });
}
function searchComments(params: SearchParams): Promise<Comment[]> {
  return http.get("/search/comments", { params });
}
function searchUsers(params: SearchParams): Promise<UserPreview[]> {
  return http.get("/search/users", { params });
}
interface UseSearchArticlesOptions extends SearchParams {
  config?: QueryConfig<typeof searchArticles>;
}
export function useSearchArticles({
  config,
  q,
  sort,
}: UseSearchArticlesOptions) {
  return useQuery({
    queryKey: ["article", "search", q, sort],
    queryFn: () => searchArticles({ q, sort }),
    ...config,
  });
}
interface UseSearchCommentsOptions extends SearchParams {
  config?: QueryConfig<typeof searchComments>;
}
export function useSearchComments({
  config,
  q,
  sort,
}: UseSearchCommentsOptions) {
  return useQuery({
    queryKey: ["comment", "search", q, sort],
    queryFn: () => searchComments({ q, sort }),
    ...config,
  });
}
interface UseSearchUsersOptions extends SearchParams {
  config?: QueryConfig<typeof searchUsers>;
}
export function useSearchUsers({ config, q, sort }: UseSearchUsersOptions) {
  return useQuery({
    queryKey: ["user", "search", q, sort],
    queryFn: () => searchUsers({ q, sort }),
    ...config,
  });
}
