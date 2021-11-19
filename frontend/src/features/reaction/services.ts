import http from "lib/http";
import { MutationConfig, QueryConfig } from "lib/react-query";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ReactableType, Reaction, ReactType } from "./types";

type NormalizedReaction = Record<
  ReactableType,
  Record<ReactType, Record<string, string | undefined>>
>;
function normalizeReaction(reactions: Reaction[]) {
  const res: NormalizedReaction = {
    article: { awesome: {}, heart: {}, save: {}, star: {} },
    comment: { awesome: {}, heart: {}, save: {}, star: {} },
  };
  reactions.forEach((r) => {
    res[r.reactableType][r.type][r.reactableId] = r.id;
  });
  return res;
}
function fetchUserReactions(): Promise<Reaction[]> {
  return http.get("/reactions");
}
export function useReaction(config?: QueryConfig<typeof normalizeReaction>) {
  return useQuery({
    queryKey: "reaction",
    queryFn: () =>
      fetchUserReactions().then((reactions) => normalizeReaction(reactions)),
    ...config,
  });
}
function createReaction(data: Omit<Reaction, "id">): Promise<Reaction> {
  return http.post("/reactions", data);
}
function removeReaction(id: string) {
  return http.delete(`/reactions/${id}`);
}
export function useCreateReaction(
  config?: MutationConfig<typeof createReaction>
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createReaction,
    onSuccess: async (_, { reactableType, reactableId }) => {
      await client.invalidateQueries("reaction");
      await client.invalidateQueries(
        reactableType == "article"
          ? [reactableType, reactableId]
          : reactableType
      );
    },
    ...config,
  });
}
interface UseRemoveReactionOptions {
  reactableType: string;
  reactableId: string;
  config?: MutationConfig<typeof removeReaction>;
}
export function useRemoveReaction({
  reactableId,
  reactableType,
  config,
}: UseRemoveReactionOptions) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: removeReaction,
    onSuccess: async (_) => {
      await client.invalidateQueries("reaction");
      await client.invalidateQueries("reading-list");
      await client.invalidateQueries(
        reactableType == "article"
          ? [reactableType, reactableId]
          : reactableType
      );
    },
    ...config,
  });
}
