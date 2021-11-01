import { Grid, Tab, Tabs } from "@mui/material";
import InfiniteList from "components/InfiniteList";
import { ArticleCard } from "features/article";
import { ArticleCardSekeleton } from "features/article/components/ArticleCard";
import { useArticles, useFeed } from "features/article/services/useArticle";
import { Article } from "features/article/types";
import { useAuth } from "features/auth/AuthenticationProvider";
import { SideMenu } from "features/layout";
import React, { useState } from "react";
import TopTags from "./TopTags";
import TopUsers from "./TopUsers";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  const labels = ["Latest", "Top"];
  user && labels.unshift("Feed");
  const isFeedTab = labels[activeTab] == "Feed";
  const feed = useFeed({ enabled: !!user && isFeedTab });
  const sort = labels[activeTab].toLowerCase();
  const articles = useArticles({ sort, config: { enabled: !isFeedTab } });
  const renderArticleList = () => {
    const renderPage = (list: Article[]) =>
      list.map((a) => <ArticleCard key={a.id} article={a} />);
    if (isFeedTab) {
      return (
        <InfiniteList
          queryResult={feed}
          placeholder={<ArticleCardSekeleton />}
          renderPage={renderPage}
        />
      );
    }
    return (
      <InfiniteList
        queryResult={articles}
        placeholder={<ArticleCardSekeleton />}
        renderPage={renderPage}
      />
    );
  };
  const articleList = renderArticleList();
  return (
    <Grid container spacing={2}>
      <Grid item md={3} sx={{ display: { xs: "none", md: "block" } }}>
        <SideMenu />
      </Grid>
      <Grid item xs={12} sm={8} md={6}>
        <Tabs
          component="nav"
          sx={{ mb: 2 }}
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
        >
          {labels.map((l) => (
            <Tab key={l} label={l} />
          ))}
        </Tabs>
        {articleList}
      </Grid>
      <Grid item xs={12} sm={4} md={3}>
        <TopUsers />
        <TopTags />
      </Grid>
    </Grid>
  );
}
