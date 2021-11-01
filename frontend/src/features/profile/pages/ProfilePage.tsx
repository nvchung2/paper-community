import { Grid, Skeleton } from "@mui/material";
import Empty from "components/Empty";
import { ArticleCard } from "features/article";
import { ArticleCardSekeleton } from "features/article/components/ArticleCard";
import { useAuth } from "features/auth/AuthenticationProvider";
import CommentCard, {
  CommentCardSkeleton,
} from "features/comment/components/CommentCard";
import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import FollowerCard, { FollowerCardSkeleton } from "../components/FollowerCard";
import ProfileCard, { ProfileCardSkeleton } from "../components/ProfileCard";
import StatCard, { StatCardSkeleton } from "../components/StatCard";
import useProfile, {
  useUserArticles,
  useUserComments,
  useUserFollowers,
} from "../services/useProfile";
type ListProps = {
  id: string;
  count: number;
};
function UserCommentList({ id, count }: ListProps) {
  const comments = useUserComments({ id, config: { enabled: count > 0 } });
  if (count == 0) {
    return (
      <Empty
        height={150}
        message="This user has not written any comments yet!"
      />
    );
  }
  return (
    <>
      {comments.data
        ? comments.data.map((c) => <CommentCard key={c.id} comment={c} />)
        : [...Array(count)].map((v, i) => <CommentCardSkeleton key={i} />)}
    </>
  );
}
function UserArticleList({ id, count }: ListProps) {
  const articles = useUserArticles({ id, config: { enabled: count > 0 } });
  if (count == 0) {
    return (
      <Empty
        height={150}
        message="This user has not posted any articles yet!"
      />
    );
  }
  return (
    <>
      {articles.data
        ? articles.data.map((a) => <ArticleCard key={a.id} article={a} />)
        : [...Array(count)].map((v, i) => <ArticleCardSekeleton key={i} />)}
    </>
  );
}
function UserFollowerList({ id, count }: ListProps) {
  const followers = useUserFollowers({ id, config: { enabled: count > 0 } });
  if (count == 0) {
    return <Empty height={150} message="This user has no followers" />;
  }
  return (
    <>
      {followers.isSuccess
        ? followers.data.map((f) => (
            <FollowerCard key={f.id} follower={f.user} />
          ))
        : [...Array(count)].map((v, i) => <FollowerCardSkeleton key={i} />)}
    </>
  );
}
export default function ProfilePage({
  match,
}: RouteComponentProps<{ id: string; list: string }>) {
  const id = match.params.id;
  const list = match.params.list;
  const { data: profile } = useProfile({ id });
  const { user } = useAuth();
  const isMe = user?.id == id;
  return (
    <>
      {profile ? (
        <ProfileCard user={profile} isMe={isMe} />
      ) : (
        <ProfileCardSkeleton />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {profile ? (
            <StatCard user={profile} selectedItem={list} />
          ) : (
            <StatCardSkeleton />
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          {profile ? (
            <Switch>
              <Route path="/profile/:id/articles" exact>
                <UserArticleList id={id} count={profile.articlesCount} />
              </Route>
              <Route path="/profile/:id/comments" exact>
                <UserCommentList id={id} count={profile.commentsCount} />
              </Route>
              <Route path="/profile/:id/followers" exact>
                <UserFollowerList id={id} count={profile.followersCount} />
              </Route>
            </Switch>
          ) : (
            <Skeleton variant="rectangular" height={500} />
          )}
        </Grid>
      </Grid>
    </>
  );
}
