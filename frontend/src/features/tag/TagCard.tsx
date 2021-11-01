import { Article, People } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";
import FollowButton from "features/follow/FollowButton";
import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "./types";
export function TagCardSkeleton() {
  return (
    <Card
      sx={{ borderTop: (theme) => `5px solid ${theme.palette.primary.main}` }}
    >
      <CardContent>
        <MuiLink
          display="block"
          component={Link}
          to="/tag/id"
          fontWeight="bold"
          fontSize="h5.fontSize"
          mb={2}
        >
          <Skeleton width="60%" />
        </MuiLink>
        <List disablePadding>
          <ListItem disablePadding>
            <Skeleton width="100%" />
          </ListItem>
          <ListItem disablePadding>
            <Skeleton width="100%" />
          </ListItem>
        </List>
      </CardContent>
      <CardActions>
        <Skeleton variant="rectangular" sx={{ ml: "auto" }}>
          <Button variant="contained">Follow</Button>
        </Skeleton>
      </CardActions>
    </Card>
  );
}
interface Props {
  tag: Tag;
}
export default function TagCard({ tag }: Props) {
  return (
    <Card
      sx={{ borderTop: (theme) => `5px solid ${theme.palette.primary.main}` }}
    >
      <CardContent>
        <MuiLink
          display="block"
          component={Link}
          to={`/tag/${tag.id}`}
          fontWeight="bold"
          fontSize="h5.fontSize"
          mb={2}
        >
          #{tag.name}
        </MuiLink>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemIcon>
              <Article />
            </ListItemIcon>
            <ListItemText primary={`${tag.articlesCount} articles published`} />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary={`${tag.followersCount} people following`} />
          </ListItem>
        </List>
      </CardContent>
      <CardActions>
        <FollowButton
          followableId={tag.id}
          followableType="tag"
          sx={{ ml: "auto" }}
          variant="contained"
        >
          Follow
        </FollowButton>
      </CardActions>
    </Card>
  );
}
