import { Comment, MoreVert } from "@mui/icons-material";
import Favorite from "@mui/icons-material/Favorite";
import Tag from "@mui/icons-material/Tag";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  Skeleton,
} from "@mui/material";
import ContentLoader from "components/ContentLoader";
import HashLink from "components/HashLink";
import LoadingButton from "components/LoadingButton";
import { useAuth } from "features/auth/AuthenticationProvider";
import { Reaction } from "features/reaction/types";
import { useReactionButton } from "features/reaction/useReactionButton";
import { formatDate, timeAgo } from "lib/utils";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Article } from "../types";

interface Props {
  article: Article;
}
export function ArticleCardSekeleton() {
  return (
    <Card sx={{ mb: 2 }} component="article">
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton />}
        subheader={<Skeleton />}
      />
      <Skeleton variant="rectangular" height={180} />
      <CardContent>
        <ContentLoader count={2} />
      </CardContent>
      <CardActions disableSpacing>
        <Skeleton sx={{ mr: 2 }} width={60} />
        <Skeleton width={60} />
        <Skeleton width={40} sx={{ ml: "auto" }} />
      </CardActions>
    </Card>
  );
}
function SaveButton(props: Omit<Reaction, "id">) {
  const { isLoading, isReacted, handleClick } = useReactionButton(props);
  if (isReacted) {
    return (
      <LoadingButton
        variant="outlined"
        loading={isLoading}
        onClick={handleClick}
        sx={{ ml: "auto" }}
      >
        Đã lưu
      </LoadingButton>
    );
  }
  return (
    <LoadingButton
      loading={isLoading}
      onClick={handleClick}
      sx={{ ml: "auto" }}
    >
      Lưu
    </LoadingButton>
  );
}
export default function ArticleCard({ article }: Props) {
  const [anchor, setAnchor] = useState<Element>();
  const { user } = useAuth();
  return (
    <Card sx={{ mb: 2 }} component="article">
      <CardHeader
        avatar={
          <Avatar
            sx={{
              border: (theme) => `1px solid ${theme.palette.primary.main}`,
            }}
            src={article.author.avatar}
          />
        }
        title={
          <MuiLink
            component={Link}
            to={`/profile/${article.author.id}/articles`}
          >
            @{article.author.name}
          </MuiLink>
        }
        subheader={`${formatDate(article.createdTime)} (${timeAgo(
          article.createdTime
        )})`}
        action={
          <>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
              <MoreVert />
            </IconButton>
            <Menu
              open={!!anchor}
              anchorEl={anchor}
              onClose={() => setAnchor(undefined)}
            >
              {user?.id == article.author.id && (
                <MenuItem component={Link} to={`/article/edit/${article.id}`}>
                  Sửa
                </MenuItem>
              )}
              {user?.id == article.author.id && (
                <MenuItem
                  component={HashLink}
                  to={`/article/edit/${article.id}#dangerZone`}
                >
                  Xóa
                </MenuItem>
              )}
              <MenuItem>Báo cáo</MenuItem>
            </Menu>
          </>
        }
      />
      <CardMedia
        component="img"
        image={article.coverImage}
        height={180}
        alt="thumb"
        sx={{
          transition: ".3s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />
      <CardContent>
        <MuiLink
          component={Link}
          to={`/article/${article.id}`}
          variant="h4"
          color="text.primary"
          underline="hover"
        >
          {article.title}
        </MuiLink>
        <Box mt={1}>
          {article.tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              icon={<Tag />}
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
              size="small"
              component={Link}
              to={`/tag/${tag.id}`}
              clickable
            />
          ))}
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          component={Link}
          to={`/article/${article.id}`}
          size="small"
          startIcon={<Favorite />}
        >
          {article.reactionsCount}
          <Box component="span" sx={{ display: ["none", null, "inline"] }}>
            &nbsp;tương tác
          </Box>
        </Button>
        <Button
          component={HashLink}
          to={`/article/${article.id}#comments`}
          size="small"
          startIcon={<Comment />}
        >
          {article.commentsCount}
          <Box component="span" sx={{ display: ["none", null, "inline"] }}>
            &nbsp;bình luận
          </Box>
        </Button>
        <SaveButton
          reactableId={article.id}
          reactableType="article"
          type="save"
        />
      </CardActions>
    </Card>
  );
}
