import { Tag } from "@mui/icons-material";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Skeleton,
} from "@mui/material";
import { useTopTags } from "features/tag/services/useTag";
import React from "react";
import { Link } from "react-router-dom";

export default function TopTags() {
  const tags = useTopTags();
  return (
    <List
      disablePadding
      subheader={<ListSubheader>#Top Tags</ListSubheader>}
      sx={{
        border: (theme) => theme.border,
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {tags.isSuccess
        ? tags.data.map((tag) => (
            <ListItemButton
              sx={{
                borderTop: (theme) => theme.border,
              }}
              alignItems="flex-start"
              component={Link}
              to={`/tag/${tag.id}`}
              key={tag.id}
            >
              <ListItemIcon>
                <Tag />
              </ListItemIcon>
              <ListItemText
                primary={`#${tag.name}`}
                secondary={`${tag.followersCount} followers`}
              />
            </ListItemButton>
          ))
        : [...Array(5)].map((v, i) => (
            <ListItemButton
              sx={{
                borderTop: (theme) => theme.border,
              }}
              alignItems="flex-start"
              key={i}
            >
              <ListItemText
                primary={<Skeleton />}
                secondary={<Skeleton width="60%" />}
              />
            </ListItemButton>
          ))}
    </List>
  );
}
