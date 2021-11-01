import { Cake, LocationOn, Work } from "@mui/icons-material";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import { useAuth } from "features/auth/AuthenticationProvider";
import FollowButton from "features/follow/FollowButton";
import { User } from "features/profile/types";
import React from "react";
import { Link } from "react-router-dom";
export function AuthorCardSkeleton() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Skeleton variant="circular">
          <Avatar />
        </Skeleton>
        <Typography fontWeight="bold">
          <Skeleton width="6rem" />
        </Typography>
      </Stack>
      <Typography variant="body2" color="GrayText">
        <Skeleton />
        <Skeleton />
        <Skeleton width="80%" />
      </Typography>
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemIcon>
            <Work />
          </ListItemIcon>
          <ListItemText primary="Work" secondary={<Skeleton />} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <Cake />
          </ListItemIcon>
          <ListItemText primary="Joined" secondary={<Skeleton />} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <LocationOn />
          </ListItemIcon>
          <ListItemText primary="Location" secondary={<Skeleton />} />
        </ListItem>
      </List>
    </Paper>
  );
}
interface Props {
  author: User;
}
export default function AuthorCard({ author }: Props) {
  const { user } = useAuth();
  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <Avatar src={author.avatar} />
        <Typography ml={2} fontWeight="bold">
          {author.name}
        </Typography>
        {user?.id == author.id ? (
          <Button
            component={Link}
            to="/profile/edit"
            variant="contained"
            sx={{ my: 2, ml: "auto", width: { lg: "100%" } }}
          >
            Edit profile
          </Button>
        ) : (
          <FollowButton
            sx={{ my: 2, ml: "auto", width: { lg: "100%" } }}
            followableId={author.id}
            followableType="user"
          />
        )}
      </Box>
      <Typography my={2} variant="body2" color="GrayText">
        {author.bio}
      </Typography>
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemIcon>
            <Work />
          </ListItemIcon>
          <ListItemText primary="Work" secondary={author.work} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <Cake />
          </ListItemIcon>
          <ListItemText primary="Joined" secondary={author.joinedDate} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <LocationOn />
          </ListItemIcon>
          <ListItemText primary="Location" secondary={author.location} />
        </ListItem>
      </List>
    </Paper>
  );
}
