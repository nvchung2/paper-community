import {
  Link as MuiLink,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Box,
  Skeleton,
} from "@mui/material";
import { UserPreview } from "features/profile/types";
import React from "react";
import { Link } from "react-router-dom";
import { Article } from "../types";
interface Props {
  author: UserPreview;
  articles: Article[];
}
export function ReadMoreSkeleton() {
  return (
    <List
      disablePadding
      subheader={
        <ListSubheader>
          <Skeleton />
        </ListSubheader>
      }
    >
      {[...Array(5)].map((v, i) => (
        <ListItemButton key={i} sx={{ borderTop: (theme) => theme.border }}>
          <ListItemText
            primary={<Skeleton />}
            secondary={<Skeleton width="60%" />}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
export default function ReadMore({ author, articles }: Props) {
  return (
    <List
      disablePadding
      subheader={
        <ListSubheader>
          Read more from{" "}
          <MuiLink
            component={Link}
            to={`/profile/${author.id}/articles`}
            fontWeight="bold"
          >
            @{author.name}
          </MuiLink>
        </ListSubheader>
      }
    >
      {articles.map((a) => (
        <ListItemButton key={a.id} sx={{ borderTop: (theme) => theme.border }}>
          <ListItemText
            primary={a.title}
            secondary={a.tags.map((t) => (
              <Box key={t.id} component="span" display="inline-block" p={0.5}>
                #{t.name}
              </Box>
            ))}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
