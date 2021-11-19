import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import ContentLoader from "components/ContentLoader";
import Empty from "components/Empty";
import ArticleCard from "features/article/components/ArticleCard";
import { ArticleCardSekeleton } from "features/article/components/ArticleCard";
import CommentCard, {
  CommentCardSkeleton,
} from "features/comment/components/CommentCard";
import FollowerCard, {
  FollowerCardSkeleton,
} from "features/profile/components/FollowerCard";
import SearchBox from "./SearchBox";
import React, { SyntheticEvent, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  useSearchArticles,
  useSearchComments,
  useSearchUsers,
} from "./services";

const searchFilters = ["Bài viết", "Bình luận", "Mọi người"];
const sorters = [
  { text: "Phù hợp nhất", value: "relevance" },
  { text: "Mới nhất", value: "latest" },
  { text: "Cũ nhất", value: "oldest" },
];
export default function SearchPage({ location }: RouteComponentProps) {
  const [activeFilter, setActiveFilter] = useState(0);
  const [activeSorter, setActiveSorter] = useState(0);
  const q = new URLSearchParams(location.search).get("q");
  const sort = activeSorter > 0 ? sorters[activeSorter].value : undefined;
  const articles = useSearchArticles({
    q: q!,
    sort,
    config: { enabled: !!q && activeFilter == 0 },
  });
  const comments = useSearchComments({
    q: q!,
    sort,
    config: { enabled: !!q && activeFilter == 1 },
  });
  const people = useSearchUsers({
    q: q!,
    sort,
    config: { enabled: !!q && activeFilter == 2 },
  });
  const renderSearchResults = () => {
    if (!q) return;
    const noResult = (
      <Empty height="50vh" message="Không tìm thấy kết quả nào" />
    );
    switch (activeFilter) {
      case 0:
        if (articles.isSuccess) {
          return articles.data.length == 0
            ? noResult
            : articles.data.map((a) => <ArticleCard key={a.id} article={a} />);
        }
        return (
          <ContentLoader count={10}>
            <ArticleCardSekeleton />
          </ContentLoader>
        );
      case 1:
        if (comments.isSuccess) {
          return comments.data.length == 0
            ? noResult
            : comments.data.map((c) => <CommentCard key={c.id} comment={c} />);
        }
        return (
          <ContentLoader count={10}>
            <CommentCardSkeleton />
          </ContentLoader>
        );
      case 2:
        if (people.isSuccess) {
          return people.data.length == 0
            ? noResult
            : people.data.map((p) => <FollowerCard key={p.id} follower={p} />);
        }
        return (
          <ContentLoader count={10}>
            <FollowerCardSkeleton />
          </ContentLoader>
        );
    }
  };
  const handleFilter = (e: SyntheticEvent, v: any) => {
    setActiveFilter(v);
  };
  const handleSort = (e: SyntheticEvent, v: any) => {
    setActiveSorter(v);
  };
  return (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <SearchBox />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Typography variant="h5">Kết quả tìm kiếm</Typography>
          <Tabs
            orientation="vertical"
            value={activeFilter}
            onChange={handleFilter}
          >
            {searchFilters.map((f) => (
              <Tab sx={{ alignItems: "flex-start" }} label={f} key={f} />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={12} md={9}>
          <Tabs sx={{ mb: 2 }} value={activeSorter} onChange={handleSort}>
            {sorters.map((s) => (
              <Tab label={s.text} key={s.value} />
            ))}
          </Tabs>
          {renderSearchResults()}
        </Grid>
      </Grid>
    </>
  );
}
export { default as SearchBox } from "./SearchBox";
