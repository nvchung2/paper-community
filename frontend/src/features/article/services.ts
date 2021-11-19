import { Comment } from "features/comment/types";
import { ReactType } from "features/reaction/types";
import useSnackbar from "hooks/useSnackbar";
import http from "lib/http";
import {
  InfiniteQueryConfig,
  MutationConfig,
  QueryConfig,
} from "lib/react-query";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { PaginationQuery, PaginationQueryResult, SortQuery } from "types";
import { Article, CreateOrUpdateArticle } from "./types";

function createArticle(data: CreateOrUpdateArticle): Promise<Article> {
  return http.post("/articles", data);
}
function fetchArticle(id: string): Promise<Article> {
  return http.get(`/articles/${id}`);
}
function fetchArticleReactions(id: string): Promise<Record<ReactType, number>> {
  return http.get(`/articles/${id}/reactions`);
}
function fetchArticleComments(id: string): Promise<Comment[]> {
  return http.get(`/articles/${id}/comments`);
}
function fetchFeed(
  params: PaginationQuery
): Promise<PaginationQueryResult<Article>> {
  return http.get(`/articles/feed`, { params });
}
function updateArticle(
  id: string,
  data: CreateOrUpdateArticle
): Promise<Article> {
  return http.put(`/articles/${id}`, data);
}
function deleteArticle(id: string) {
  return http.delete(`/articles/${id}`);
}
type FetchArticlesParams = SortQuery & PaginationQuery;
function fetchArticles(
  params: FetchArticlesParams
): Promise<PaginationQueryResult<Article>> {
  return http.get("/articles", { params });
}
function fetchRecommendations(id: string): Promise<Article[]> {
  return http.get(`/articles/${id}/recommendations`);
}
export function useCreateArticle(
  config?: MutationConfig<typeof createArticle>
) {
  const client = useQueryClient();
  const { success } = useSnackbar();
  return useMutation({
    mutationFn: createArticle,
    onSuccess: async () => {
      await client.invalidateQueries("article");
      success("Bài viết được xuất bản");
    },
    ...config,
  });
}
interface UseArticleOptions {
  id: string;
  config?: QueryConfig<typeof fetchArticle>;
}
export function useArticle({ id, config }: UseArticleOptions) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id),
    ...config,
  });
}
interface UseArticleReactionsOptions {
  id: string;
  config?: QueryConfig<typeof fetchArticleReactions>;
}
export function useArticleReactions({
  id,
  config,
}: UseArticleReactionsOptions) {
  return useQuery({
    queryKey: ["reaction", "article", id],
    queryFn: () => fetchArticleReactions(id),
    ...config,
  });
}
interface UseUpdateArticleOptions {
  id: string;
  config?: MutationConfig<(data: CreateOrUpdateArticle) => Promise<Article>>;
}
export function useUpdateArticle({ id, config }: UseUpdateArticleOptions) {
  const client = useQueryClient();
  const { success } = useSnackbar();
  return useMutation({
    mutationFn: (data: CreateOrUpdateArticle) => updateArticle(id, data),
    onSuccess: async (data) => {
      await client.invalidateQueries(["article", data.id]);
      success("Bài viết được cập nhật");
    },
    ...config,
  });
}
export function useDeleteArticle(
  config?: MutationConfig<typeof deleteArticle>
) {
  const client = useQueryClient();
  const { success } = useSnackbar();
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: async (_, id) => {
      client.removeQueries(["article", id]);
      client.removeQueries(["comment", "article", id]);
      await client.invalidateQueries("article");
      success("Bài viết bị xóa");
    },
    ...config,
  });
}
interface UseArticleCommentsOptions {
  id: string;
  config?: QueryConfig<typeof fetchArticleComments>;
}
export function useArticleComments({ id, config }: UseArticleCommentsOptions) {
  return useQuery({
    queryKey: ["comment", "article", id],
    queryFn: () => fetchArticleComments(id),
    ...config,
  });
}
export function useFeed(config?: InfiniteQueryConfig<typeof fetchFeed>) {
  return useInfiniteQuery({
    queryKey: "feed",
    queryFn: ({ pageParam }) => fetchFeed({ page: pageParam, limit: 1 }),
    getNextPageParam: (lp) => lp.nextPage,
    ...config,
  });
}
interface UseArticlesOptions extends SortQuery {
  config?: InfiniteQueryConfig<typeof fetchArticles>;
}
export function useArticles({ sort, config }: UseArticlesOptions) {
  return useInfiniteQuery({
    queryKey: ["article", sort],
    queryFn: ({ pageParam }) =>
      fetchArticles({ sort, page: pageParam, limit: 1 }),
    getNextPageParam: (lp) => lp.nextPage,
    ...config,
  });
}
interface UseRecommendationsOptions {
  id: string;
  config?: QueryConfig<typeof fetchRecommendations>;
}
export function useRecommendations({ id, config }: UseRecommendationsOptions) {
  return useQuery({
    queryKey: ["article", id, "recommendations"],
    queryFn: () => fetchRecommendations(id),
    ...config,
  });
}
