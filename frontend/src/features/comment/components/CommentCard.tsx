import { Favorite, MoreVert } from "@mui/icons-material";
import CommentIcon from "@mui/icons-material/Comment";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link as MuiLink,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ConfirmDialog from "components/ConfirmDialog";
import LoadingButton from "components/LoadingButton";
import { useAuth } from "features/auth/AuthenticationProvider";
import { useReactionButton } from "features/reaction/useReactionButton";
import { FormikHelpers } from "formik";
import useLoginRequiredDialog from "hooks/useLoginRequiredDialog";
import { timeAgo } from "lib/utils";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CommentBox } from "..";
import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "../services/useComment";
import { Comment } from "../types";
import StyledAvatar from "./StyledAvatar";

interface Props {
  comment: Comment;
  parent?: Comment;
  linkOnly?: boolean;
}
export function CommentCardSkeleton() {
  return (
    <Stack direction="row" spacing={1} my={2} alignItems="flex-start">
      <Skeleton variant="circular">
        <Avatar />
      </Skeleton>
      <Card sx={{ flexGrow: 1 }}>
        <CardHeader
          title={
            <>
              <Skeleton width="50%" />
            </>
          }
        />
        <CardContent sx={{ py: 0 }}>
          <Skeleton />
          <Skeleton />
          <Skeleton width="80%" />
        </CardContent>
        <CardActions>
          <Skeleton width="2rem" variant="rectangular" />
          <Skeleton width="2rem" variant="rectangular" />
        </CardActions>
      </Card>
    </Stack>
  );
}
export default function CommentCard({
  comment,
  parent,
  linkOnly = true,
}: Props) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [edit, setEdit] = useState(false);
  const [anchor, setAnchor] = useState<Element>();
  const createReply = useCreateComment();
  const updateComment = useUpdateComment({ id: comment.id });
  const deleteComment = useDeleteComment({ articleId: comment.articleId });
  const { user } = useAuth();
  const { toggleDialog } = useLoginRequiredDialog();
  const heartReact = useReactionButton({
    reactableId: comment.id,
    reactableType: "comment",
    type: "heart",
  });
  const handleDelete = () => {
    deleteComment.mutate(comment.id);
  };
  const handleSubmit = async (
    values: { content: string },
    helper: FormikHelpers<{ content: string }>
  ) => {
    if (!user) {
      return toggleDialog();
    }
    if (edit) {
      await updateComment.mutateAsync({ content: values.content });
    } else {
      await createReply.mutateAsync({
        articleId: comment.articleId,
        parentId: comment.id,
        content: values.content,
      });
    }
    helper.setSubmitting(false);
    helper.resetForm();
    setShowCommentBox(false);
    setEdit(false);
  };
  const handleMenuSelect = (item: "edit" | "delete" | "report") => {
    if (!user) {
      return toggleDialog();
    }
    setAnchor(undefined);
    if (item == "edit") {
      setEdit(true);
      setShowCommentBox(true);
    }
  };
  return (
    <>
      <Stack direction="row" spacing={1} my={2} ml={parent ? 2 : 0}>
        <StyledAvatar sx={{ mt: 2 }} src={comment.author.avatar} />
        <Card sx={{ flexGrow: 1 }} id={comment.id}>
          <CardHeader
            title={
              <>
                <MuiLink href="/" fontWeight="bold" fontSize="body1.fontSize">
                  @{comment.author.name}
                </MuiLink>
                <Typography
                  component="span"
                  fontSize="body2.fontSize"
                  color="GrayText"
                >
                  &nbsp;&middot; {timeAgo(comment.createdTime)}
                </Typography>
              </>
            }
            action={
              <>
                <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
                  <MoreVert />
                </IconButton>
                <Menu
                  open={!!anchor}
                  anchorEl={anchor}
                  onClose={() => setAnchor(undefined)}
                >
                  {user?.id == comment.author.id && (
                    <MenuItem>
                      <ListItemText
                        primary="Edit"
                        onClick={() => handleMenuSelect("edit")}
                      />
                    </MenuItem>
                  )}
                  {user?.id == comment.author.id && (
                    <MenuItem>
                      <ConfirmDialog
                        actionButton={
                          <ListItemText
                            primary="Delete"
                            onClick={() => handleMenuSelect("delete")}
                          />
                        }
                        message="Are you sure you want to delete this comment?"
                        onAccept={handleDelete}
                      />
                    </MenuItem>
                  )}
                  <MenuItem>
                    <ListItemText
                      primary="Report"
                      onClick={() => handleMenuSelect("report")}
                    />
                  </MenuItem>
                </Menu>
              </>
            }
          />
          <CardContent sx={{ py: 0 }}>{comment.content}</CardContent>
          <CardActions>
            <LoadingButton
              loading={heartReact.isLoading}
              startIcon={<Favorite />}
              color={heartReact.isReacted ? "secondary" : "primary"}
              onClick={heartReact.handleClick}
            >
              {comment.heartsCount}
            </LoadingButton>
            <Button
              component={Link}
              to={`/article/${comment.articleId}#${comment.id}`}
              startIcon={<CommentIcon />}
              onClick={() => setShowCommentBox(true)}
            >
              {comment.children.length}
            </Button>
          </CardActions>
        </Card>
      </Stack>
      {!linkOnly && showCommentBox && (
        <CommentBox
          onDismiss={() => {
            setEdit(false);
            setShowCommentBox(false);
          }}
          isReply={true}
          onSubmit={handleSubmit}
          initialComment={edit ? comment : undefined}
        />
      )}
    </>
  );
}
