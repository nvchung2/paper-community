import { Tag } from "@mui/icons-material";
import {
  Chip,
  Paper,
  Box,
  styled,
  Typography,
  Stack,
  Avatar,
  Link as MuiLink,
  Button,
  Skeleton,
} from "@mui/material";
import ContentLoader from "components/ContentLoader";
import Markdown from "components/Markdown";
import { useAuth } from "features/auth/AuthenticationProvider";
import { formatDate } from "lib/utils";
import React from "react";
import { Link } from "react-router-dom";
import { Article } from "../types";
const CoverImage = styled("img")({
  width: "100%",
  height: 300,
  objectFit: "cover",
});
const Content = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));
interface Props {
  article: Article;
}
export function ArticleDetailsSkeleton() {
  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Skeleton variant="rectangular" height={300} />
      <Content>
        <Typography
          variant="h1"
          fontWeight="bold"
          fontSize={["h4.fontSize", null, null, "h3.fontSize"]}
        >
          <Skeleton />
        </Typography>
        <Box sx={{ mt: 1, mb: 2 }}>
          <ContentLoader count={3}>
            <Skeleton sx={{ display: "inline-block", mr: 2 }} width="4rem" />
          </ContentLoader>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          rowGap={1}
          columnGap={2}
        >
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
          <div>
            <Typography variant="body1">
              <MuiLink>
                <Skeleton width="6rem" />
              </MuiLink>
            </Typography>
            <Typography component="time" variant="caption" color="GrayText">
              <Skeleton width="8rem" />
            </Typography>
          </div>
        </Stack>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <ContentLoader count={10}>
            <Skeleton width="100%" />
          </ContentLoader>
        </Typography>
      </Content>
    </Paper>
  );
}
export default function ArticleDetails({ article }: Props) {
  const { user } = useAuth();
  return (
    <Paper sx={{ overflow: "hidden" }}>
      <CoverImage src={article.coverImage} alt="cover" />
      <Content>
        <Typography
          variant="h1"
          fontWeight="bold"
          fontSize={["h4.fontSize", null, null, "h3.fontSize"]}
        >
          {article.title}
        </Typography>
        <Box sx={{ mt: 1, mb: 2 }}>
          {article.tags.map((t) => (
            <Chip
              sx={{ mr: 1, mb: 0.5 }}
              label={t.name}
              key={t.id}
              size="small"
              clickable
              icon={<Tag />}
              component={Link}
              to={`/tag/${t.id}`}
            />
          ))}
        </Box>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Stack direction="row" gap={2} alignItems="center">
            <Avatar src={article.author.avatar} />
            <div>
              <Typography variant="body1">
                <MuiLink
                  component={Link}
                  to={`/profile/${article.author.id}/articles`}
                >
                  @{article.author.name}
                </MuiLink>
              </Typography>
              <Typography component="time" variant="caption" color="GrayText">
                Đã đăng vào lúc {formatDate(article.createdTime)} &middot;{" "}
                {article.readingTime} phút đọc
              </Typography>
            </div>
          </Stack>
          {user?.id == article.author.id && (
            <Button
              variant="outlined"
              size="small"
              component={Link}
              to={`/article/edit/${article.id}`}
              sx={{ ml: "auto" }}
            >
              Sửa
            </Button>
          )}
        </Box>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <Markdown>{article.content}</Markdown>
        </Typography>
      </Content>
    </Paper>
  );
}
