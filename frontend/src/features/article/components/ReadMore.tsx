import {
  Box,
  Link as MuiLink,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Skeleton,
} from "@mui/material";
import ContentLoader from "components/ContentLoader";
import { UserPreview } from "features/profile/types";
import React from "react";
import { Link } from "react-router-dom";
import { Article } from "../types";
interface Props {
  articles: Article[];
  author: UserPreview;
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
      <ContentLoader count={5}>
        <ListItemButton sx={{ borderTop: (theme) => theme.border }}>
          <ListItemText
            primary={<Skeleton />}
            secondary={<Skeleton width="60%" />}
          />
        </ListItemButton>
      </ContentLoader>
    </List>
  );
}
export default function ReadMore({ author, articles }: Props) {
  return (
    <List
      disablePadding
      subheader={
        <ListSubheader>
          Xem thêm từ{" "}
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
      {articles.length == 0 ? (
        <ListItem>
          <ListItemText
            primary="<Không có bài viết nào>"
            primaryTypographyProps={{ color: "GrayText" }}
          />
        </ListItem>
      ) : (
        articles.map((a) => (
          <ListItemButton
            key={a.id}
            sx={{ borderTop: (theme) => theme.border }}
          >
            <ListItemText
              primary={a.title}
              secondary={a.tags.map((t) => (
                <Box key={t.id} component="span" display="inline-block" p={0.5}>
                  #{t.name}
                </Box>
              ))}
            />
          </ListItemButton>
        ))
      )}
    </List>
  );
}
