import { Cake, Edit, GitHub, LocationOn } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import ContentLoader from "components/ContentLoader";
import FollowButton from "features/follow/FollowButton";
import { formatDate } from "lib/utils";
import React from "react";
import { Link } from "react-router-dom";
import { User } from "../types";
const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  position: "relative",
}));
const CardAvatar = styled(Avatar)(({ theme }) => ({
  position: "absolute",
  left: "50%",
  top: 0,
  transform: "translate(-50%,-50%)",
  border: `1px solid ${theme.palette.primary.main}`,
  width: 100,
  height: 100,
  backgroundColor: "white",
  [theme.breakpoints.down("md")]: {
    width: 50,
    height: 50,
    left: 10,
    transform: "translate(0,-50%)",
  },
}));
interface Props {
  user: User;
  isMe: boolean;
}
export function ProfileCardSkeleton() {
  return (
    <Card sx={{ mt: 16, mb: 2 }}>
      <Skeleton variant="rectangular" sx={{ ml: "auto" }}>
        <Button variant="contained" startIcon={<Edit />}>
          Chỉnh sửa
        </Button>
      </Skeleton>
      <Box sx={{ "&>*:not(:last-child)": { mb: 2 }, textAlign: "center" }}>
        <Skeleton sx={{ mx: "auto", width: "30%" }} />
        <Skeleton sx={{ mx: "auto", width: "60%" }} />
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
        >
          <ContentLoader count={3}>
            <Skeleton width="20%" sx={{ mr: 1 }} />
          </ContentLoader>
        </Stack>
      </Box>
    </Card>
  );
}
export default function ProfileCard({ user, isMe }: Props) {
  return (
    <Card sx={{ mt: 16, mb: 2 }}>
      <CardAvatar src={user.avatar} />
      <Box textAlign="right">
        {isMe ? (
          <Button
            variant="contained"
            startIcon={<Edit />}
            component={Link}
            to="/profile/edit"
          >
            Chỉnh sửa
          </Button>
        ) : (
          <FollowButton followableId={user.id} followableType="user" />
        )}
      </Box>
      <Box sx={{ "&>*:not(:last-child)": { mb: 2 }, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" mt={4}>
          {user.name}
        </Typography>
        <Typography variant="body1">{user.bio}</Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
        >
          <Button variant="text" disabled startIcon={<LocationOn />}>
            {user.location}
          </Button>
          <Button variant="text" disabled startIcon={<Cake />}>
            {formatDate(user.joinedDate, true)}
          </Button>
          <Button
            variant="text"
            component="a"
            href={user.githubLink}
            startIcon={<GitHub />}
          >
            {user.githubLink}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
