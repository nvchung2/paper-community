import { Add } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Link as MuiLink,
  Skeleton,
} from "@mui/material";
import FollowButton from "features/follow/FollowButton";
import React from "react";
import { Link } from "react-router-dom";
import { UserPreview } from "../types";

interface Props {
  follower: UserPreview;
}
export function FollowerCardSkeleton() {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        }
        title={
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <Skeleton sx={{ flexGrow: 1, mr: 2 }} />
            <Skeleton variant="rectangular">
              <Button variant="contained" startIcon={<Add />}>
                Follow
              </Button>
            </Skeleton>
          </Box>
        }
      />
    </Card>
  );
}
export default function FollowerCard({ follower }: Props) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={<Avatar src={follower.avatar} />}
        title={
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <MuiLink
              component={Link}
              to={`/profile/${follower.id}/articles`}
              fontWeight="bold"
              fontSize="body1.fontSize"
            >
              @{follower.name}
            </MuiLink>
            <Box flexGrow={1} />
            <FollowButton followableType="user" followableId={follower.id} />
          </Box>
        }
      />
    </Card>
  );
}
