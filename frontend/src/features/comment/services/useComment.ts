import useSnackbar from "hooks/useSnackbar";
import http from "lib/http";
import { MutationConfig } from "lib/react-query";
import { useMutation, useQueryClient } from "react-query";
import { Comment, CreateComment } from "../types";

function createComment(data: CreateComment): Promise<Comment> {
  return http.post("/comments", data);
}
function updateComment(
  id: string,
  data: { content: string }
): Promise<Comment> {
  return http.put(`/comments/${id}`, data);
}
function deleteComment(id: string) {
  return http.delete(`/comments/${id}`);
}
export function useCreateComment(
  config?: MutationConfig<typeof createComment>
) {
  const client = useQueryClient();
  const { success } = useSnackbar();
  return useMutation({
    mutationFn: createComment,
    onSuccess: async (_, { articleId }) => {
      await client.invalidateQueries("comment");
      await client.invalidateQueries(["article", articleId]);
      success("Comment created");
    },
    ...config,
  });
}
interface UseUpdateCommentOptions {
  id: string;
  config?: MutationConfig<(data: { content: string }) => Promise<Comment>>;
}
export function useUpdateComment({ id, config }: UseUpdateCommentOptions) {
  const client = useQueryClient();
  const { success } = useSnackbar();
  return useMutation({
    mutationFn: (data) => updateComment(id, data),
    onSuccess: async () => {
      await client.invalidateQueries("comment");
      success("Comment updated");
    },
    ...config,
  });
}
interface UseDeleteCommentOptions {
  articleId: string;
  config?: MutationConfig<typeof deleteComment>;
}
export function useDeleteComment({
  articleId,
  config,
}: UseDeleteCommentOptions) {
  const { success } = useSnackbar();
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      await client.invalidateQueries("comment");
      await client.invalidateQueries(["article", articleId]);
      success("Comment deleted");
    },
    ...config,
  });
}
