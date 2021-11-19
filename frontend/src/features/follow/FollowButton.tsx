import { Add, Check } from "@mui/icons-material";
import { Button, ButtonProps, Skeleton } from "@mui/material";
import LoadingButton from "components/LoadingButton";
import { useAuth } from "features/auth/AuthenticationProvider";
import useLoginRequiredDialog from "hooks/useLoginRequiredDialog";
import React from "react";
import { useCreateFollow, useFollow, useUnfollow } from "./services";
interface Props {
  followableId: string;
  followableType: "tag" | "user";
}
export default function FollowButton({
  followableId,
  followableType,
  ...props
}: Props & ButtonProps) {
  const { user } = useAuth();
  const follows = useFollow({ enabled: !!user });
  const followMutation = useCreateFollow();
  const unfollowMutation = useUnfollow({ followableType });
  const { toggleDialog } = useLoginRequiredDialog();
  const handleFollow = () => {
    if (user) {
      followMutation.mutate({
        followableId: followableId,
        followableType: followableType,
      });
    } else {
      toggleDialog();
    }
  };
  const handleUnfollow = () => {
    if (user) {
      const id = follows.data?.[followableType][followableId];
      id && unfollowMutation.mutate(id);
    } else {
      toggleDialog();
    }
  };
  if (follows.isLoading) {
    return (
      <Skeleton sx={props.sx} variant="rectangular">
        <Button variant="contained">Theo dõi</Button>
      </Skeleton>
    );
  }
  if (follows.isSuccess || follows.isIdle) {
    const isFollowing = !!follows.data?.[followableType][followableId];
    return isFollowing ? (
      <LoadingButton
        {...props}
        loading={unfollowMutation.isLoading}
        variant="outlined"
        startIcon={<Check />}
        onClick={handleUnfollow}
      >
        Đang theo dõi
      </LoadingButton>
    ) : (
      <LoadingButton
        {...props}
        loading={followMutation.isLoading}
        variant="contained"
        startIcon={<Add />}
        onClick={handleFollow}
      >
        Theo dõi
      </LoadingButton>
    );
  }
  return null;
}
