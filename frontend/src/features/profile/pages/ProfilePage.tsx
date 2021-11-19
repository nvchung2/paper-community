import { Grid, Skeleton } from "@mui/material";
import ContentLoader from "components/ContentLoader";
import Empty from "components/Empty";
import ArticleCard from "features/article/components/ArticleCard";
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
} from "../services";
type ListProps = {
  id: string;
  count: number;
};
function UserCommentList({ id, count }: ListProps) {
  const comments = useUserComments({ id, config: { enabled: count > 0 } });
  if (count == 0) {
    return <Empty height={150} message="Không có bình luận nào!" />;
  }
  return (
    <>
      {comments.data ? (
        comments.data.map((c) => <CommentCard key={c.id} comment={c} />)
      ) : (
        <ContentLoader count={count}>
          <CommentCardSkeleton />
        </ContentLoader>
      )}
    </>
  );
}
function UserArticleList({ id, count }: ListProps) {
  const articles = useUserArticles({ id, config: { enabled: count > 0 } });
  if (count == 0) {
    return <Empty height={150} message="Không có bài viết nào!" />;
  }
  return (
    <>
      {articles.data ? (
        articles.data.map((a) => <ArticleCard key={a.id} article={a} />)
      ) : (
        <ContentLoader count={count}>
          <ArticleCardSekeleton />
        </ContentLoader>
      )}
    </>
  );
}
function UserFollowerList({ id, count }: ListProps) {
  const followers = useUserFollowers({ id, config: { enabled: count > 0 } });
  if (count == 0) {
    return <Empty height={150} message="Không có người theo dõi nào" />;
  }
  return (
    <>
      {followers.isSuccess ? (
        followers.data.map((f) => <FollowerCard key={f.id} follower={f.user} />)
      ) : (
        <ContentLoader count={count}>
          <FollowerCardSkeleton />
        </ContentLoader>
      )}
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
