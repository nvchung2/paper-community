import { Article, Comment, People } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
} from "@mui/material";
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { User } from "../types";

interface Props {
  user: User;
  selectedItem: string;
}
export function StatCardSkeleton() {
  const renderListItemSkeleton = (
    <ListItem disablePadding>
      <ListItemButton sx={{ columnGap: 2 }}>
        <Skeleton width="2em"></Skeleton>
        <Skeleton sx={{ flexGrow: 1 }}></Skeleton>
      </ListItemButton>
    </ListItem>
  );
  return (
    <Paper sx={{ p: 1 }}>
      <List disablePadding>
        {renderListItemSkeleton}
        {renderListItemSkeleton}
        {renderListItemSkeleton}
      </List>
    </Paper>
  );
}
export default function StatCard({ user, selectedItem }: Props) {
  const renderListItem = (
    to: string,
    icon: ReactElement,
    label: string,
    selected: boolean
  ) => {
    return (
      <ListItem disablePadding>
        <ListItemButton component={Link} to={to} selected={selected}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      </ListItem>
    );
  };
  return (
    <Paper sx={{ p: 1 }}>
      <List disablePadding>
        {renderListItem(
          `/profile/${user.id}/articles`,
          <Article />,
          `${user.articlesCount} posts published`,
          selectedItem == "articles"
        )}
        {renderListItem(
          `/profile/${user.id}/comments`,
          <Comment />,
          `${user.commentsCount} comments written`,
          selectedItem == "comments"
        )}
        {renderListItem(
          `/profile/${user.id}/followers`,
          <People />,
          `${user.followersCount} followers`,
          selectedItem == "followers"
        )}
      </List>
    </Paper>
  );
}
