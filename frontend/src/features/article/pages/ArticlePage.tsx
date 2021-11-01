import { Grid, Paper, Typography } from "@mui/material";
import { useAuth } from "features/auth/AuthenticationProvider";
import { CommentBox } from "features/comment";
import CommentCard, {
  CommentCardSkeleton,
} from "features/comment/components/CommentCard";
import { useCreateComment } from "features/comment/services/useComment";
import { Comment } from "features/comment/types";
import useProfile, {
  useUserArticles,
} from "features/profile/services/useProfile";
import { FormikHelpers } from "formik";
import useLoginRequiredDialog from "hooks/useLoginRequiredDialog";
import React from "react";
import { RouteComponentProps } from "react-router";
import ArticleDetails, {
  ArticleDetailsSkeleton,
} from "../components/ArticleDetails";
import AuthorCard, { AuthorCardSkeleton } from "../components/AuthorCard";
import Reactions from "../components/Reactions";
import ReadMore, { ReadMoreSkeleton } from "../components/ReadMore";
import ReadNext from "../components/ReadNext";
import {
  useArticle,
  useArticleComments,
  useArticleReactions,
} from "../services/useArticle";

function CommentTree({
  comment,
  parent,
}: {
  comment: Comment;
  parent?: Comment;
}) {
  return (
    <>
      <CommentCard linkOnly={false} comment={comment} parent={parent} />
      {comment.children.map((child) => (
        <CommentTree parent={comment} comment={child} key={child.id} />
      ))}
    </>
  );
}
export default function ArticlePage({
  match,
}: RouteComponentProps<{ id: string }>) {
  const id = match.params.id;
  const article = useArticle({ id });
  const author = useProfile({
    id: article.data?.author.id,
    config: { enabled: article.isSuccess },
  });
  const comments = useArticleComments({ id });
  const reactions = useArticleReactions({ id });
  const createComment = useCreateComment();
  const userArticles = useUserArticles({
    id: article.data?.author.id,
    config: { enabled: article.isSuccess },
  });
  const { user } = useAuth();
  const { toggleDialog } = useLoginRequiredDialog();
  const handleSubmitComment = async (
    values: { content: string },
    helper: FormikHelpers<{ content: string }>
  ) => {
    if (!user) {
      return toggleDialog();
    }
    if (article.isSuccess) {
      await createComment.mutateAsync({
        articleId: article.data.id,
        content: values.content,
      });
    }
    helper.setSubmitting(false);
    helper.resetForm();
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={1}>
          {reactions.isSuccess ? (
            <Reactions reactions={reactions.data} articleId={id} />
          ) : null}
        </Grid>
        <Grid item xs={12} md={11} lg={8}>
          {article.isSuccess ? (
            <ArticleDetails article={article.data} />
          ) : (
            <ArticleDetailsSkeleton />
          )}
          <Paper sx={{ my: 2, p: { xs: 1, md: 2 } }}>
            <Typography fontWeight="bold" sx={{ mb: 2 }} id="comments">
              Comments({article.data?.commentsCount || 0})
            </Typography>
            <CommentBox onSubmit={handleSubmitComment} />
            {comments.isSuccess
              ? comments.data.map((c) => <CommentTree comment={c} key={c.id} />)
              : [...Array(5)].map((v, i) => <CommentCardSkeleton key={i} />)}
          </Paper>
          <Paper>
            <Typography fontWeight="bold" sx={{ p: 2 }}>
              Read Next
            </Typography>
            <ReadNext articleId={id} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={3}>
          {author.isSuccess ? (
            <AuthorCard author={author.data} />
          ) : (
            <AuthorCardSkeleton />
          )}
          <Paper sx={{ mt: 2 }}>
            {userArticles.isSuccess ? (
              <ReadMore author={author.data!} articles={userArticles.data} />
            ) : (
              <ReadMoreSkeleton />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
