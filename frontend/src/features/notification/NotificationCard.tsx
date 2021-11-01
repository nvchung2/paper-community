import {
  Avatar,
  Card,
  CardHeader,
  Link as MuiLink,
  Skeleton,
} from "@mui/material";
import HashLink from "components/HashLink";
import { timeAgo } from "lib/utils";
import React from "react";
import { Link } from "react-router-dom";
import { Notification } from "./types";
interface Props {
  noti: Notification;
}
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
            {userLink} created a new{" "}
            {renderLink(`/article/${noti.notifiableId}`, "Article.")}
          </>
        );
      case "follow":
        return <>{userLink} has started followed you.</>;
      case "comment":
        return (
          <>
            {userLink} created a new{" "}
            {renderLink(
              `/article/${noti.data.articleId}#${noti.notifiableId}`,
              "Comment"
            )}{" "}
            on your article.
          </>
        );
      case "reply":
        return (
          <>
            {userLink} replied your{" "}
            {renderLink(
              `/article/${noti.data.articleId}#${noti.notifiableId}`,
              "Comment"
            )}
          </>
        );
      case "react":
        return (
          <>
            {userLink} reacted to your{" "}
            {noti.data.targetType == "article"
              ? renderLink(`/article/${noti.data.id}`, "Article")
              : renderLink(
                  `/article/${noti.data.articleId}#${noti.data.id}`,
                  "Comment"
                )}
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
