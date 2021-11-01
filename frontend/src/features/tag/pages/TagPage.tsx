import {
  Box,
  Grid,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ContentLoader from "components/ContentLoader";
import InfiniteList from "components/InfiniteList";
import { ArticleCard } from "features/article";
import { ArticleCardSekeleton } from "features/article/components/ArticleCard";
import { Article } from "features/article/types";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { useTag, useTagArticles } from "../services/useTag";
import TagCard, { TagCardSkeleton } from "../TagCard";
const filters = ["week", "month", "year"] as const;
const sorters = ["oldest", "latest"] as const;
const tabs = ["Week", "Month", "Year", "Oldest", "Latest"];
export default function TagPage({
  match,
}: RouteComponentProps<{ id: string }>) {
  const id = match.params.id;
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (i: number) => {
    setActiveTab(i);
  };
  const tag = useTag({ id });
  const filter = activeTab < 3 ? filters[activeTab] : undefined;
  const sort =
    activeTab >= 3 && activeTab < 5 ? sorters[activeTab - 3] : undefined;
  const articles = useTagArticles({
    id,
    filter,
    sort,
  });
  const renderPage = (list: Article[]) =>
    list.map((a) => (
      <Grid key={a.id} item xs={12} md={6}>
        <ArticleCard article={a} />
      </Grid>
    ));
  return (
    <>
      {tag.isSuccess ? <TagCard tag={tag.data} /> : <TagCardSkeleton />}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        my={1}
      >
        <Typography variant="h2" fontWeight="bold" fontSize="h6.fontSize">
          Articles
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(e, v) => handleTabChange(v)}
          sx={{ display: { xs: "none", md: "flex" }, mb: 1 }}
        >
          {tabs.map((f) => (
            <Tab key={f} label={f} />
          ))}
        </Tabs>
        <Select
          value={activeTab}
          onChange={(e) => handleTabChange(+e.target.value)}
          size="small"
          sx={{ display: { xs: "inline-flex", md: "none" }, mb: 1 }}
        >
          {tabs.map((t, index) => (
            <MenuItem key={t} value={index}>
              {t}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Grid container columnSpacing={2}>
        <InfiniteList
          queryResult={articles}
          placeholder={
            <Grid item xs={12} md={6}>
              <ArticleCardSekeleton />
            </Grid>
          }
          renderPage={renderPage}
        />
      </Grid>
    </>
  );
}
