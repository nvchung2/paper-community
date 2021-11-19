import { AutoAwesome, Favorite, Save, Star } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardHeader,
  Link as MuiLink,
  Skeleton,
} from "@mui/material";
import HashLink from "components/HashLink";
import { Reaction } from "features/reaction/types";
import { timeAgo } from "lib/utils";
import React from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { Link } from "react-router-dom";
import { Notification } from "./types";
interface Props {
  noti: Notification;
}
const reactionIconMap: Record<Pick<Reaction, "type">["type"], ReactElement> = {
  awesome: <AutoAwesome color="secondary" />,
  heart: <Favorite color="secondary" />,
  save: <Save color="secondary" />,
  star: <Star color="secondary" />,
};
export function NotificationCardSkeleton() {
  return (
    <Card sx={{ p: 2, borderLeft: 5, borderLeftColor: "primary.main", mb: 2 }}>
      <CardHeader
        avatar={
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        }
        title={<Skeleton />}
        subheader={<Skeleton width="60%" />}
      />
    </Card>
  );
}
export default function NotificationCard({ noti }: Props) {
  const renderNotiContent = () => {
    const userLink = (
      <MuiLink component={Link} to={`/profile/${noti.source.id}/articles`}>
        @{noti.source.name}
      </MuiLink>
    );
    const renderLink = (to: string, children: string) => (
      <MuiLink component={HashLink} to={to}>
        {children}
      </MuiLink>
    );
    switch (noti.notifiableType) {
      case "article":
        return (
          <>
            {userLink} đã tạo một{" "}
            {renderLink(`/article/${noti.notifiableId}`, "Bài viết")} mới.
          </>
        );
      case "follow":
        return <>{userLink} bắt đầu theo dõi bạn.</>;
      case "comment":
        return (
          <>
            {userLink} đã tạo một{" "}
            {renderLink(
              `/article/${noti.data.articleId}#${noti.notifiableId}`,
              "Bình luận"
            )}{" "}
            mới trên một bài viết của bạn.
          </>
        );
      case "reply":
        return (
          <>
            {userLink} đã trả lời một{" "}
            {renderLink(
              `/article/${noti.data.articleId}#${noti.notifiableId}`,
              "Bình luận"
            )}{" "}
            của bạn.
          </>
        );
      case "react":
        return (
          <>
            {userLink} đã cho bạn một {reactionIconMap[noti.data.type]} vì{" "}
            {noti.data.targetType == "article"
              ? renderLink(`/article/${noti.data.id}`, "Bài viết")
              : renderLink(
                  `/article/${noti.data.articleId}#${noti.data.id}`,
                  "Bình luận"
                )}{" "}
            của bạn.
          </>
        );
    }
  };
  return (
    <Card sx={{ p: 2, borderLeft: 5, borderLeftColor: "primary.main", mb: 2 }}>
      <CardHeader
        avatar={<Avatar src={noti.source.avatar} />}
        title={renderNotiContent()}
        subheader={timeAgo(noti.createdTime)}
      />
    </Card>
  );
}
