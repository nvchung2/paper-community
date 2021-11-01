import { AutoAwesome, Favorite, Save, Star } from "@mui/icons-material";
import { styled } from "@mui/material";
import LoadingButton from "components/LoadingButton";
import { ReactType } from "features/reaction/types";
import { useReactionButton } from "features/reaction/useReactionButton";
import React from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";
const reactionButton = {
  justifyItems: "center",
  "& .MuiButton-startIcon": {
    marginRight: { md: 0 },
  },
  flexDirection: { xs: "row", md: "column" },
} as const;
const ReactionList = styled("div")(({ theme }) => ({
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    position: "fixed",
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1, 1, 0, 0),
    boxShadow: theme.shadows[10],
    padding: theme.spacing(1, 0),
  },
}));
interface Props {
  articleId: string;
  reactions: Record<ReactType, number>;
}
export default function Reactions({ reactions, articleId }: Props) {
  const renderButton = (
    loading: boolean,
    reacted: boolean,
    icon: ReactElement,
    count: number,
    handleClick: () => any
  ) => (
    <LoadingButton
      sx={reactionButton}
      loading={loading}
      startIcon={icon}
      color={reacted ? "secondary" : "primary"}
      onClick={handleClick}
    >
      {count}
    </LoadingButton>
  );
  const heart = useReactionButton({
    reactableId: articleId,
    reactableType: "article",
    type: "heart",
  });
  const awesome = useReactionButton({
    reactableId: articleId,
    reactableType: "article",
    type: "awesome",
  });
  const star = useReactionButton({
    reactableId: articleId,
    reactableType: "article",
    type: "star",
  });
  const save = useReactionButton({
    reactableId: articleId,
    reactableType: "article",
    type: "save",
  });
  return (
    <ReactionList>
      {renderButton(
        heart.isLoading,
        heart.isReacted,
        <Favorite />,
        reactions.heart,
        heart.handleClick
      )}
      {renderButton(
        awesome.isLoading,
        awesome.isReacted,
        <AutoAwesome />,
        reactions.awesome,
        awesome.handleClick
      )}
      {renderButton(
        star.isLoading,
        star.isReacted,
        <Star />,
        reactions.star,
        star.handleClick
      )}
      {renderButton(
        save.isLoading,
        save.isReacted,
        <Save />,
        reactions.save,
        save.handleClick
      )}
    </ReactionList>
  );
}
