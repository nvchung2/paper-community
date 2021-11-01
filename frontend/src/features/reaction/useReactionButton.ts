import { useAuth } from "features/auth/AuthenticationProvider";
import useLoginRequiredDialog from "hooks/useLoginRequiredDialog";
import {
  useCreateReaction,
  useReaction,
  useRemoveReaction,
} from "./services/useReaction";
import { Reaction } from "./types";

export function useReactionButton({
  reactableId,
  reactableType,
  type,
}: Omit<Reaction, "id">) {
  const { user } = useAuth();
  const reactions = useReaction({ enabled: !!user });
  const createReaction = useCreateReaction();
  const removeReaction = useRemoveReaction({ reactableId, reactableType });
  const id = reactions.data?.[reactableType][type][reactableId];
  const isReacted = !!id;
  const isLoading = createReaction.isLoading || removeReaction.isLoading;
  const { toggleDialog } = useLoginRequiredDialog();
  const handleClick = () => {
    if (user) {
      if (isReacted) {
        removeReaction.mutate(id);
      } else {
        createReaction.mutate({ reactableId, reactableType, type });
      }
    } else {
      toggleDialog();
    }
  };
  return {
    isReacted,
    isLoading,
    handleClick,
  };
}
