import { Article } from "features/article/types";
import { Comment } from "features/comment/types";
import { Follow } from "features/follow/types";
import useSnackbar from "hooks/useSnackbar";
import http from "lib/http";
import { MutationConfig, QueryConfig } from "lib/react-query";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { User, UserPreview } from "../types";

function fetchProfile(id?: string): Promise<User> {
  return http.get(`/users/${id}/profile`);
}
export type UpdateUser = Pick<
  User,
  "avatar" | "bio" | "email" | "work" | "githubLink" | "location" | "name"
>;
function updateProfile(data: UpdateUser): Promise<User> {
  return http.put("/users/profile", data);
}
function fetchUserArticles(id?: string): Promise<Article[]> {
  return http.get(`/users/${id}/articles`);
}
function fetchUserComments(id: string): Promise<Comment[]> {
  return http.get(`/users/${id}/comments`);
}
function fetchTopUsers(): Promise<User[]> {
  return http.get("/users/top");
}
export type Follower = Follow & { user: UserPreview };
function fetchUserFollowers(id: string): Promise<Follower[]> {
  return http.get(`/users/${id}/followers`);
}
interface UseProfileOptions {
  id?: string;
  config?: QueryConfig<typeof fetchProfile>;
}
export default function useProfile({ id, config }: UseProfileOptions) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => fetchProfile(id),
    ...config,
  });
}
interface UseUserArticlesOptions {
  id?: string;
  config?: QueryConfig<typeof fetchUserArticles>;
}
export function useUserArticles({ id, config }: UseUserArticlesOptions) {
  return useQuery({
    queryKey: ["article", "user", id],
    queryFn: () => fetchUserArticles(id),
    ...config,
  });
}
interface UseUserCommentsOptions {
  id: string;
  config?: QueryConfig<typeof fetchUserComments>;
}
export function useUserComments({ id, config }: UseUserCommentsOptions) {
  return useQuery({
    queryKey: ["comment", "user", id, "comment"],
    queryFn: () => fetchUserComments(id),
    ...config,
  });
}
interface UseUserFollowersOptions {
  id: string;
  config?: QueryConfig<typeof fetchUserFollowers>;
}
export function useUserFollowers({ id, config }: UseUserFollowersOptions) {
  return useQuery({
    queryKey: ["follow", "user", id, "follower"],
    queryFn: () => fetchUserFollowers(id),
    ...config,
  });
}
export function useUpdateProfile(
  config?: MutationConfig<typeof updateProfile>
) {
  const { success } = useSnackbar();
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async (data) => {
      await client.invalidateQueries(["profile", data.id]);
      await client.invalidateQueries("auth");
      success("Profile updated");
    },
    ...config,
  });
}
export function useTopUsers(config?: QueryConfig<typeof fetchTopUsers>) {
  return useQuery({
    queryKey: ["user", "top"],
    queryFn: fetchTopUsers,
    ...config,
  });
}
